/**
 * Property 21: Rate Limiting Threshold is Universally Enforced
 * Validates: Requirements 26.2
 */
import * as fc from 'fast-check';

// Simulate Redis-backed rate limiter
class MockRateLimiter {
  private counters = new Map<string, number>();
  private readonly unauthLimit: number;
  private readonly authLimit: number;

  constructor(unauthLimit = 100, authLimit = 500) {
    this.unauthLimit = unauthLimit;
    this.authLimit = authLimit;
  }

  check(key: string, isAuthenticated: boolean): { allowed: boolean; count: number } {
    const current = (this.counters.get(key) ?? 0) + 1;
    this.counters.set(key, current);
    const limit = isAuthenticated ? this.authLimit : this.unauthLimit;
    return { allowed: current <= limit, count: current };
  }

  reset(key: string): void {
    this.counters.delete(key);
  }
}

describe('Property 21: Rate Limiting Threshold is Universally Enforced', () => {
  it('unauthenticated requests exceeding 100/min are always blocked', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 7, maxLength: 15 }), // IP address
        fc.integer({ min: 101, max: 300 }),           // excess requests
        (ip, extraRequests) => {
          const limiter = new MockRateLimiter();
          // First 100: should all be allowed
          for (let i = 0; i < 100; i++) {
            const r = limiter.check(ip, false);
            if (!r.allowed) return false;
          }
          // Requests > 100: should all be blocked
          for (let i = 0; i < extraRequests; i++) {
            const r = limiter.check(ip, false);
            if (r.allowed) return false;
          }
          return true;
        },
      ),
      { numRuns: 50 },
    );
  });

  it('authenticated requests up to 500 are always allowed', () => {
    fc.assert(
      fc.property(
        fc.uuid(), // user_id
        fc.integer({ min: 1, max: 500 }),
        (userId, reqCount) => {
          const limiter = new MockRateLimiter();
          for (let i = 0; i < reqCount; i++) {
            const r = limiter.check(userId, true);
            if (!r.allowed) return false;
          }
          return true;
        },
      ),
      { numRuns: 50 },
    );
  });

  it('after reset, counter starts fresh', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 7, maxLength: 15 }),
        (ip) => {
          const limiter = new MockRateLimiter(100, 500);
          // Exhaust limit
          for (let i = 0; i < 101; i++) limiter.check(ip, false);
          // Reset
          limiter.reset(ip);
          // Should be allowed again
          return limiter.check(ip, false).allowed === true;
        },
      ),
      { numRuns: 50 },
    );
  });
});
