/**
 * Property 17: Review Submission Gate is Universally Enforced
 * Validates: Requirements 18.1
 */
import * as fc from 'fast-check';

type OrderStatus = 'PENDING' | 'CONFIRMED' | 'IN_PRODUCTION' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

function canSubmitReview(
  orderStatus: OrderStatus,
  existingReviewCount: number,
  rating: number,
  textLength: number,
): { allowed: boolean; reason?: string } {
  if (orderStatus !== 'DELIVERED') {
    return { allowed: false, reason: 'Order must be in DELIVERED status' };
  }
  if (existingReviewCount > 0) {
    return { allowed: false, reason: 'A review already exists for this order (max 1)' };
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { allowed: false, reason: 'Rating must be an integer 1–5' };
  }
  if (textLength > 1000) {
    return { allowed: false, reason: 'Review text must not exceed 1000 characters' };
  }
  return { allowed: true };
}

describe('Property 17: Review Submission Gate is Universally Enforced', () => {
  it('non-DELIVERED orders always block review submission', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<OrderStatus>('PENDING', 'CONFIRMED', 'IN_PRODUCTION', 'SHIPPED', 'CANCELLED'),
        fc.integer({ min: 1, max: 5 }),
        (status, rating) => {
          const result = canSubmitReview(status, 0, rating, 100);
          return result.allowed === false;
        },
      ),
      { numRuns: 200 },
    );
  });

  it('duplicate review for same order is always blocked', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100 }),
        fc.integer({ min: 1, max: 5 }),
        (existingCount, rating) => {
          const result = canSubmitReview('DELIVERED', existingCount, rating, 100);
          return result.allowed === false;
        },
      ),
      { numRuns: 100 },
    );
  });

  it('invalid rating (outside 1–5 integer range) always blocks review', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.integer({ min: 6, max: 100 }),
          fc.integer({ min: -100, max: 0 }),
          fc.double({ min: 1.1, max: 4.9, noNaN: true }).filter((n) => !Number.isInteger(n)),
        ),
        (invalidRating) => {
          const result = canSubmitReview('DELIVERED', 0, invalidRating, 100);
          return result.allowed === false;
        },
      ),
      { numRuns: 100 },
    );
  });

  it('review text > 1000 chars is always blocked', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1001, max: 10000 }),
        fc.integer({ min: 1, max: 5 }),
        (textLength, rating) => {
          const result = canSubmitReview('DELIVERED', 0, rating, textLength);
          return result.allowed === false;
        },
      ),
      { numRuns: 100 },
    );
  });

  it('valid submission always succeeds', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 5 }),
        fc.integer({ min: 0, max: 1000 }),
        (rating, textLength) => {
          const result = canSubmitReview('DELIVERED', 0, rating, textLength);
          return result.allowed === true;
        },
      ),
      { numRuns: 100 },
    );
  });
});
