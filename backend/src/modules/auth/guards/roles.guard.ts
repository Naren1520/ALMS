import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { ROLES_KEY } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../common/enums';
import { JwtPayload } from '../../../common/interfaces';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly dataSource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload | undefined;

    if (!user || !requiredRoles.includes(user.role)) {
      // Write audit log entry asynchronously — non-blocking (Req 1.3, 26.7)
      this.dataSource
        .query(
          `INSERT INTO audit_logs (event_type, actor_id, target_id, after_state, ip_address, user_agent)
           VALUES ($1, $2, $3, $4::jsonb, $5, $6)`,
          [
            'UNAUTHORIZED_ACCESS_ATTEMPT',
            user?.sub ?? null,
            `${request.method} ${request.url}`,
            JSON.stringify({ requiredRoles, actualRole: user?.role ?? 'NONE' }),
            request.ip ?? null,
            request.headers?.['user-agent'] ?? null,
          ],
        )
        .catch(() => { /* non-blocking */ });

      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true;
  }
}
