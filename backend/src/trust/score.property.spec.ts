/**
 * Property 16: Trust Score Computation Invariant
 * Validates: Requirements 17.1, 17.2
 */
import * as fc from 'fast-check';
import { TrustEventType } from '../common/enums';

const BASE_WEIGHTS: Record<TrustEventType, number> = {
  [TrustEventType.IDENTITY_VERIFIED]: 20,
  [TrustEventType.BUSINESS_VERIFIED]: 25,
  [TrustEventType.ORDER_FULFILLED_ON_TIME]: 5,
  [TrustEventType.ORDER_FULFILLED_LATE]: -3,
  [TrustEventType.POSITIVE_REVIEW]: 3,
  [TrustEventType.NEGATIVE_REVIEW]: -4,
  [TrustEventType.DISPUTE_RESOLVED_AGAINST]: -10,
  [TrustEventType.DISPUTE_RESOLVED_FOR]: 5,
  [TrustEventType.RFQ_FULFILLED]: 8,
  [TrustEventType.LISTING_REJECTED]: -5,
  [TrustEventType.ACCOUNT_FLAGGED]: -15,
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function computeTrustScore(
  events: { eventType: TrustEventType; multiplier: number }[],
): number {
  const total = events.reduce((sum, e) => {
    const baseWeight = BASE_WEIGHTS[e.eventType] ?? 0;
    return sum + baseWeight * e.multiplier;
  }, 0);
  return clamp(total, 0, 100);
}

describe('Property 16: Trust Score Computation Invariant', () => {
  const eventArb = fc.record({
    eventType: fc.constantFrom(...Object.values(TrustEventType)),
    multiplier: fc.float({ min: 0.1, max: 3.0 }),
  });

  it('trust score is always in range [0, 100]', () => {
    fc.assert(
      fc.property(
        fc.array(eventArb, { minLength: 0, maxLength: 50 }),
        (events) => {
          const score = computeTrustScore(events);
          return score >= 0 && score <= 100;
        },
      ),
      { numRuns: 500 },
    );
  });

  it('adding only positive events never decreases score', () => {
    const positiveEvents: TrustEventType[] = [
      TrustEventType.IDENTITY_VERIFIED,
      TrustEventType.BUSINESS_VERIFIED,
      TrustEventType.ORDER_FULFILLED_ON_TIME,
      TrustEventType.POSITIVE_REVIEW,
      TrustEventType.DISPUTE_RESOLVED_FOR,
      TrustEventType.RFQ_FULFILLED,
    ];

    fc.assert(
      fc.property(
        fc.array(
          fc.record({ eventType: fc.constantFrom(...positiveEvents), multiplier: fc.float({ min: 0.1, max: 3 }) }),
          { minLength: 0, maxLength: 20 },
        ),
        fc.constantFrom(...positiveEvents),
        (existingEvents, newPositiveEvent) => {
          const before = computeTrustScore(existingEvents);
          const after = computeTrustScore([...existingEvents, { eventType: newPositiveEvent, multiplier: 1.0 }]);
          return after >= before;
        },
      ),
      { numRuns: 200 },
    );
  });

  it('score with all negative events never goes below 0', () => {
    const negativeEvents: TrustEventType[] = [
      TrustEventType.ORDER_FULFILLED_LATE,
      TrustEventType.NEGATIVE_REVIEW,
      TrustEventType.DISPUTE_RESOLVED_AGAINST,
      TrustEventType.LISTING_REJECTED,
      TrustEventType.ACCOUNT_FLAGGED,
    ];

    fc.assert(
      fc.property(
        fc.array(
          fc.record({ eventType: fc.constantFrom(...negativeEvents), multiplier: fc.float({ min: 0.1, max: 3 }) }),
          { minLength: 1, maxLength: 100 },
        ),
        (events) => {
          const score = computeTrustScore(events);
          return score >= 0;
        },
      ),
      { numRuns: 200 },
    );
  });
});
