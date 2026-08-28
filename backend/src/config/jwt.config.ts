import { registerAs } from '@nestjs/config';

export interface JwtConfig {
  privateKey: string;
  publicKey: string;
  accessTokenTtl: number;
  refreshTokenTtl: number;
}

/**
 * JWT configuration for RS256 signing.
 * Keys can be supplied in two ways:
 *   1. JWT_PRIVATE_KEY_B64 / JWT_PUBLIC_KEY_B64  — base64-encoded PEM (preferred for env vars)
 *   2. JWT_PRIVATE_KEY / JWT_PUBLIC_KEY           — raw PEM with \n escapes
 */
export const jwtConfig = registerAs('jwt', (): JwtConfig => {
  const decodeKey = (b64Var: string, rawVar: string): string => {
    const b64 = process.env[b64Var];
    if (b64 && b64.length > 20) {
      return Buffer.from(b64, 'base64').toString('utf8');
    }
    return (process.env[rawVar] ?? '').replace(/\\n/g, '\n');
  };

  return {
    privateKey: decodeKey('JWT_PRIVATE_KEY_B64', 'JWT_PRIVATE_KEY'),
    publicKey:  decodeKey('JWT_PUBLIC_KEY_B64',  'JWT_PUBLIC_KEY'),
    accessTokenTtl:  parseInt(process.env['JWT_ACCESS_TOKEN_TTL']  ?? '900',    10),
    refreshTokenTtl: parseInt(process.env['JWT_REFRESH_TOKEN_TTL'] ?? '604800', 10),
  };
});
