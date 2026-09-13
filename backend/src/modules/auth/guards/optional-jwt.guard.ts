import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Optional JWT guard — sets req.user if a valid token is present,
 * but does NOT throw if no token or invalid token is provided.
 * Use this for endpoints that work for both authenticated and anonymous users.
 */
@Injectable()
export class OptionalJwtGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleRequest(_err: any, user: any) {
    // Return user if valid, null if not — never throw
    return user || null;
  }
}
