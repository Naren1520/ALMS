import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import type { Redis } from 'ioredis';
import { Request, Response } from 'express';
import { JwtPayload } from '../../../common/interfaces';

const UNAUTH_LIMIT = 100; // req/min per IP  (Req 26.2)
const AUTH_LIMIT   = 500; // req/min per user_id
const WINDOW_SECS  = 60;

/**
 * Redis-backed rate limiting guard (Req 26.2).
 * Unauthenticated: 100 req/min per IP.
 * Authenticated:   500 req/min per user_id.
 * Returns HTTP 429 + Retry-After header on breach.
 */
@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const user  = req.user as JwtPayload | undefined;
    const key   = user ? `rate:user:${user.sub}` : `rate:ip:${req.ip ?? 'unknown'}`;
    const limit = user ? AUTH_LIMIT : UNAUTH_LIMIT;

    const multi = this.redis.multi();
    multi.incr(key);
    multi.ttl(key);
    const results = await multi.exec();
    const count = results?.[0]?.[1] as number ?? 0;
    const ttl   = results?.[1]?.[1] as number ?? -1;

    if (ttl < 0) {
      await this.redis.expire(key, WINDOW_SECS);
    }

    if (count > limit) {
      const retryAfter = ttl > 0 ? ttl : WINDOW_SECS;
      res.setHeader('Retry-After', String(retryAfter));
      throw new HttpException(
        {
          statusCode: 429,
          error: 'TOO_MANY_REQUESTS',
          message: `Rate limit exceeded. Retry after ${retryAfter}s.`,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}
