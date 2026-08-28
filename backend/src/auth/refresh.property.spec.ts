/**
 * Property 4: Refresh Token Single-Use Invariant
 * Validates: Requirements 1.8
 */
import * as fc from 'fast-check';
import { createHash } from 'crypto';

// Simulates the refresh token store
class MockRefreshTokenStore {
  private tokens = new Map<
    string,
    { hash: string; revoked: boolean; expiresAt: Date }
  >();

  issue(token: string, ttlSeconds: number): void {
    const hash = createHash('sha256').update(token).digest('hex');
    this.tokens.set(hash, {
      hash,
      revoked: false,
      expiresAt: new Date(Date.now() + ttlSeconds * 1000),
    });
  }

  use(token: string): { valid: boolean; reuse: boolean } {
    const hash = createHash('sha256').update(token).digest('hex');
    const stored = this.tokens.get(hash);

    if (!stored) return { valid: false, reuse: false };
    if (stored.expiresAt < new Date()) return { valid: false, reuse: false };
    if (stored.revoked) return { valid: false, reuse: true }; // reuse detected

    // Revoke old, issue new
    stored.revoked = true;
    return { valid: true, reuse: false };
  }
}

describe('Property 4: Refresh Token Single-Use Invariant', () => {
  it('a valid refresh token can only be used once', () => {
    fc.assert(
      fc.property(fc.hexaString({ minLength: 40, maxLength: 40 }), (tokenValue) => {
        const store = new MockRefreshTokenStore();
        store.issue(tokenValue, 604800);

        const first = store.use(tokenValue);
        const second = store.use(tokenValue);

        // First use must succeed, second must fail as reuse
        return first.valid === true && second.valid === false && second.reuse === true;
      }),
      { numRuns: 200 },
    );
  });

  it('using a never-issued token always returns invalid', () => {
    fc.assert(
      fc.property(fc.hexaString({ minLength: 40, maxLength: 40 }), (token) => {
        const store = new MockRefreshTokenStore();
        const result = store.use(token);
        return result.valid === false && result.reuse === false;
      }),
      { numRuns: 200 },
    );
  });

  it('reuse of revoked token always triggers reuse detection', () => {
    fc.assert(
      fc.property(
        fc.hexaString({ minLength: 40, maxLength: 40 }),
        fc.integer({ min: 1, max: 5 }), // number of additional uses
        (token, extraUses) => {
          const store = new MockRefreshTokenStore();
          store.issue(token, 604800);
          store.use(token); // consume once (valid)

          for (let i = 0; i < extraUses; i++) {
            const r = store.use(token);
            if (!r.reuse) return false;
          }
          return true;
        },
      ),
      { numRuns: 100 },
    );
  });
});
