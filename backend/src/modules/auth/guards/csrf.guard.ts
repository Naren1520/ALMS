import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { Request, Response } from 'express';

const CSRF_COOKIE = 'csrf_token';
const CSRF_HEADER = 'x-csrf-token';
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

/**
 * CSRF Synchronizer Token Guard (Req 26.1)
 *
 * - Issues a CSRF token in a non-HttpOnly cookie on login/first request.
 * - On all state-mutating requests (POST/PUT/PATCH/DELETE) compares the
 *   cookie value to the X-CSRF-Token header.
 * - Rotates the token on each authenticated mutating request.
 * - Returns HTTP 403 on mismatch.
 */
@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    // Safe methods — no CSRF check needed; ensure token exists
    if (SAFE_METHODS.has(req.method)) {
      this.ensureToken(req, res);
      return true;
    }

    const cookieToken = req.cookies?.[CSRF_COOKIE] as string | undefined;
    const headerToken = req.headers[CSRF_HEADER] as string | undefined;

    if (!cookieToken || !headerToken || cookieToken !== headerToken) {
      throw new ForbiddenException('Invalid CSRF token');
    }

    // Rotate token on successful mutating request
    const newToken = randomBytes(32).toString('hex');
    res.cookie(CSRF_COOKIE, newToken, {
      httpOnly: false, // must be readable by JS so the frontend can send the header
      secure: process.env['NODE_ENV'] === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return true;
  }

  private ensureToken(req: Request, res: Response): void {
    if (!req.cookies?.[CSRF_COOKIE]) {
      const token = randomBytes(32).toString('hex');
      res.cookie(CSRF_COOKIE, token, {
        httpOnly: false,
        secure: process.env['NODE_ENV'] === 'production',
        sameSite: 'strict',
        path: '/',
      });
    }
  }
}
