import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { UserEntity } from '../auth/entities/user.entity';
import { AuditLogEntity } from '../auth/entities/audit-log.entity';
import { UserRole, AccountStatus } from '../../common/enums';
import { TrustService } from '../trust/trust.service';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(AuditLogEntity)
    private readonly auditLogRepo: Repository<AuditLogEntity>,
    private readonly dataSource: DataSource,
    private readonly trustService: TrustService,
  ) {}

  /** Platform metrics (Req 25.1, 25.2) */
  async getMetrics() {
    const [usersByRole, productCount, ordersByStatus, queueDepths] = await Promise.all([
      this.dataSource.query(
        `SELECT role, COUNT(*) AS count FROM users GROUP BY role`,
      ),
      this.dataSource.query(
        `SELECT COUNT(*) AS count FROM products WHERE status = 'PUBLISHED'`,
      ),
      this.dataSource.query(
        `SELECT status, COUNT(*) AS count FROM orders GROUP BY status`,
      ),
      this.dataSource.query(
        `SELECT 1`, // BullMQ depths fetched separately in controller
      ),
    ]);
    return { usersByRole, productCount: productCount[0]?.count, ordersByStatus };
  }

  /** Search users (Req 25.3) */
  async searchUsers(query: string, role?: UserRole, page = 1, limit = 20) {
    const qb = this.userRepo.createQueryBuilder('u');
    if (query) {
      qb.where(`u.email ILIKE :q`, { q: `%${query}%` });
    }
    if (role) qb.andWhere('u.role = :role', { role });
    qb.skip((page - 1) * limit).take(limit).orderBy('u.created_at', 'DESC');
    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit };
  }

  /** Change user role with audit log (Req 25.3, 1.10) */
  async changeUserRole(
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

  /** Suspend / reinstate user */
  async setUserStatus(actorId: string, targetUserId: string, status: AccountStatus): Promise<void> {
    await this.userRepo.update(targetUserId, { status });
    await this.auditLogRepo.save({
      eventType: status === AccountStatus.SUSPENDED ? 'USER_SUSPENDED' : 'USER_REINSTATED',
      actorId,
      targetId: targetUserId,
    });
  }

  /** Manually recalculate trust score (Req 25.7) */
  async recalculateTrustScore(actorId: string, userId: string): Promise<void> {
    await this.dataSource.query(
      `INSERT INTO trust_scores (user_id, score, updated_at)
       SELECT $1,
         GREATEST(0, LEAST(100, COALESCE(SUM(applied_weight), 0))),
         NOW()
       FROM trust_events WHERE user_id = $1
       ON CONFLICT (user_id) DO UPDATE SET
         score = EXCLUDED.score,
         updated_at = EXCLUDED.updated_at`,
      [userId],
    );

    await this.auditLogRepo.save({
      eventType: 'TRUST_SCORE_RECALCULATED',
      actorId,
      targetId: userId,
    });
  }

  /** Update platform config (Req 25.8) */
  async updatePlatformConfig(actorId: string, key: string, value: unknown): Promise<void> {
    await this.dataSource.query(
      `INSERT INTO platform_config (key, value, updated_by, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (key) DO UPDATE SET value = $2, updated_by = $3, updated_at = NOW()`,
      [key, JSON.stringify(value), actorId],
    );
    await this.auditLogRepo.save({
      eventType: 'PLATFORM_CONFIG_UPDATED',
      actorId,
      targetId: key,
      afterState: { value },
    });
  }

  /** Moderation queue across all entities (Req 25.4) */
  async getModerationQueue() {
    const [artisanVerifications, buyerVerifications, reviews, disputes] = await Promise.all([
      this.dataSource.query(
        `SELECT 'ARTISAN_VERIFICATION' AS type, id, submitted_at AS created_at FROM artisan_verifications WHERE status = 'PENDING' ORDER BY submitted_at ASC`,
      ),
      this.dataSource.query(
        `SELECT 'BUYER_VERIFICATION' AS type, id, submitted_at AS created_at FROM buyer_verifications WHERE status = 'PENDING' ORDER BY submitted_at ASC`,
      ),
      this.dataSource.query(
        `SELECT 'REVIEW' AS type, id, created_at FROM reviews WHERE moderation_status = 'PENDING_MODERATION' ORDER BY created_at ASC`,
      ),
      this.dataSource.query(
        `SELECT 'DISPUTE' AS type, id, created_at FROM disputes WHERE status IN ('OPEN','UNDER_REVIEW') ORDER BY created_at ASC`,
      ),
    ]);

    return [
      ...artisanVerifications,
      ...buyerVerifications,
      ...reviews,
      ...disputes,
    ].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }
}
