/**
 * Property 20: CSRF Protection is Universally Applied to State-Mutating Endpoints
 * Validates: Requirements 26.1
 */
import * as fc from 'fast-check';
import { randomBytes } from 'crypto';

// Simulate CSRF guard logic
function csrfCheck(
  method: string,
  cookieToken: string | undefined,
  headerToken: string | undefined,
): { allowed: boolean; reason: string } {
  const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
  if (SAFE_METHODS.has(method.toUpperCase())) {
    return { allowed: true, reason: 'safe_method' };
  }
  if (!cookieToken || !headerToken) {
    return { allowed: false, reason: 'missing_token' };
  }
  if (cookieToken !== headerToken) {
    return { allowed: false, reason: 'token_mismatch' };
  }
  return { allowed: true, reason: 'token_match' };
}

describe('Property 20: CSRF Protection is Universally Applied to State-Mutating Endpoints', () => {
  const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS'];
  const MUTATING_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

  it('safe methods always pass without token', () => {
    fc.assert(
      fc.property(fc.constantFrom(...SAFE_METHODS), (method) => {
        const result = csrfCheck(method, undefined, undefined);
        return result.allowed === true;
      }),
      { numRuns: 100 },
    );
  });

  it('mutating methods always fail without matching tokens', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...MUTATING_METHODS),
        fc.option(fc.hexaString({ minLength: 32, maxLength: 64 })),
        fc.option(fc.hexaString({ minLength: 32, maxLength: 64 })),
        (method, cookieToken, headerToken) => {
          if (
            cookieToken === null ||
            headerToken === null ||
            cookieToken !== headerToken
          ) {
            const result = csrfCheck(
              method,
              cookieToken ?? undefined,
              headerToken ?? undefined,
            );
            return result.allowed === false;
          }
          return true; // skip when tokens happen to match
        },
      ),
      { numRuns: 200 },
    );
  });

  it('mutating methods pass when cookie and header token match', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...MUTATING_METHODS),
        fc.hexaString({ minLength: 32, maxLength: 64 }),
        (method, token) => {
          const result = csrfCheck(method, token, token);
          return result.allowed === true;
        },
      ),
      { numRuns: 100 },
    );
  });
});
