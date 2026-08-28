import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Repository, DataSource } from 'typeorm';
import * as argon2 from 'argon2';
import { randomBytes, createHash } from 'crypto';
import type { Redis } from 'ioredis';
import { UserEntity } from './entities/user.entity';
import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { AuditLogEntity } from './entities/audit-log.entity';
import { RegisterDto } from './dto/register.dto';
import { AccountStatus, UserRole } from '../../common/enums';
import { JwtPayload } from '../../common/interfaces';
import { JwtConfig } from '../../config';

const LOCKOUT_ATTEMPTS = 5;
const LOCKOUT_WINDOW_SECS = 15 * 60; // 15 minutes

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepo: Repository<RefreshTokenEntity>,
    @InjectRepository(AuditLogEntity)
    private readonly auditLogRepo: Repository<AuditLogEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRedis() private readonly redis: Redis,
    private readonly dataSource: DataSource,
  ) {}

  // ─── Registration ────────────────────────────────────────────────────────────

  async register(dto: RegisterDto): Promise<{ message: string }> {
    const existing = await this.userRepo.findOne({ where: { email: dto.email.toLowerCase() } });
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const passwordHash = await argon2.hash(dto.password, { type: argon2.argon2id });

    const user = this.userRepo.create({
      email: dto.email.toLowerCase(),
      passwordHash,
      role: dto.role,
      status: AccountStatus.UNVERIFIED,
    });
    await this.userRepo.save(user);

    // TODO: enqueue email verification via BullMQ (within 30s per Req 1.2)
    this.logger.log(`User registered: ${user.id} (${user.role})`);

    return { message: 'Registration successful. Please check your email to verify your account.' };
  }

  // ─── Local validation (used by LocalStrategy) ────────────────────────────────

  async validateLocalUser(email: string, password: string): Promise<UserEntity | null> {
    const user = await this.userRepo.findOne({ where: { email: email.toLowerCase() } });
    if (!user) return null;

    if (user.status === AccountStatus.LOCKED) {
      throw new UnauthorizedException(
        'Your account has been locked due to multiple failed login attempts. Please check your email for an unlock link.',
      );
    }

    const valid = await argon2.verify(user.passwordHash, password);
    if (!valid) {
      await this.handleFailedLogin(user);
      return null;
    }

    await this.resetFailedAttempts(user.id);
    return user;
  }

  // ─── Login ───────────────────────────────────────────────────────────────────

  async login(user: UserEntity): Promise<{ accessToken: string; message: string }> {
    const tokens = await this.issueTokenPair(user);
    return { accessToken: tokens.accessToken, message: 'Login successful' };
  }

  async loginAndIssueTokens(user: UserEntity): Promise<{ accessToken: string; refreshToken: string; message: string }> {
    const { accessToken, refreshToken } = await this.issueTokenPair(user);
    return { accessToken, refreshToken, message: 'Login successful' };
  }

  async issueTokenPair(user: UserEntity): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role };
    const jwtCfg = this.configService.get<JwtConfig>('jwt')!;

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: jwtCfg.accessTokenTtl,
    });

    // Opaque refresh token — stored as SHA-256 hash
    const opaqueToken = randomBytes(40).toString('hex');
    const tokenHash = createHash('sha256').update(opaqueToken).digest('hex');

    const expiresAt = new Date(Date.now() + jwtCfg.refreshTokenTtl * 1000);
    await this.refreshTokenRepo.save({ userId: user.id, tokenHash, expiresAt, revokedAt: null });

    return { accessToken, refreshToken: opaqueToken };
  }

  // ─── Refresh token rotation ───────────────────────────────────────────────────

  async refreshTokens(opaqueToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const tokenHash = createHash('sha256').update(opaqueToken).digest('hex');

    return await this.dataSource.transaction(async (manager) => {
      const stored = await manager.findOne(RefreshTokenEntity, {
        where: { tokenHash },
        relations: ['user'],
      });

      if (!stored) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      if (stored.revokedAt) {
        // Detected reuse of revoked token — revoke ALL tokens for this user
        await manager.update(
          RefreshTokenEntity,
          { userId: stored.userId, revokedAt: undefined },
          { revokedAt: new Date() },
        );
        throw new UnauthorizedException('Refresh token reuse detected. All sessions revoked.');
      }

      if (stored.expiresAt < new Date()) {
        throw new UnauthorizedException('Refresh token has expired');
      }

      // Revoke old token
      await manager.update(RefreshTokenEntity, stored.id, { revokedAt: new Date() });

      // Issue new pair
      const newOpaque = randomBytes(40).toString('hex');
      const newHash = createHash('sha256').update(newOpaque).digest('hex');
      const jwtCfg = this.configService.get<JwtConfig>('jwt')!;
      const expiresAt = new Date(Date.now() + jwtCfg.refreshTokenTtl * 1000);

      await manager.save(RefreshTokenEntity, {
        userId: stored.userId,
        tokenHash: newHash,
        expiresAt,
        revokedAt: null,
      });

      const payload: JwtPayload = {
        sub: stored.user.id,
        email: stored.user.email,
        role: stored.user.role,
      };
      const newAccess = this.jwtService.sign(payload, { expiresIn: jwtCfg.accessTokenTtl });

      return { accessToken: newAccess, refreshToken: newOpaque };
    });
  }

  // ─── Logout ───────────────────────────────────────────────────────────────────

  async logout(opaqueToken: string): Promise<void> {
    const tokenHash = createHash('sha256').update(opaqueToken).digest('hex');
    await this.refreshTokenRepo.update({ tokenHash }, { revokedAt: new Date() });
  }

  // ─── Account lockout helpers ─────────────────────────────────────────────────

  private async handleFailedLogin(user: UserEntity): Promise<void> {
    const key = `auth:failed:${user.id}`;
    const count = await this.redis.incr(key);
    await this.redis.expire(key, LOCKOUT_WINDOW_SECS);

    if (count >= LOCKOUT_ATTEMPTS) {
      await this.userRepo.update(user.id, { status: AccountStatus.LOCKED });
      await this.redis.del(key);
      // TODO: enqueue unlock email
      this.logger.warn(`Account locked: ${user.id}`);
    }
  }

  private async resetFailedAttempts(userId: string): Promise<void> {
    await this.redis.del(`auth:failed:${userId}`);
  }

  // ─── Role change (Admin) ─────────────────────────────────────────────────────

  async changeRole(
    actorId: string,
    targetUserId: string,
    newRole: UserRole,
    reason: string,
  ): Promise<void> {
    const target = await this.userRepo.findOne({ where: { id: targetUserId } });
    if (!target) throw new NotFoundException('User not found');

    const oldRole = target.role;
    await this.userRepo.update(targetUserId, { role: newRole });

    await this.auditLogRepo.save({
      eventType: 'ROLE_CHANGED',
      actorId,
      targetId: targetUserId,
      beforeState: { role: oldRole },
      afterState: { role: newRole, reason },
    });
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  async findById(id: string): Promise<UserEntity | null> {
    return this.userRepo.findOne({ where: { id } });
  }
}
