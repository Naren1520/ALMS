import { UserRole } from '../enums';

/**
 * Payload encoded inside every RS256 JWT access token.
 */
export interface JwtPayload {
  /** User UUID */
  sub: string;

  /** User's registered email */
  email: string;

  /** RBAC role */
  role: UserRole;

  /** Issued-at (Unix seconds) */
  iat?: number;

  /** Expiry (Unix seconds) */
  exp?: number;
}
