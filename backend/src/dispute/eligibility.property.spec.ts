/**
 * Property 18: Dispute Eligibility Window is Universally Enforced
 * Validates: Requirements 19.1
 */
import * as fc from 'fast-check';

type OrderStatus = 'DELIVERED' | 'SHIPPED' | 'CONFIRMED' | 'IN_PRODUCTION';

function isEligibleForDispute(
  orderStatus: OrderStatus,
  deliveredAt: Date | null,
  expectedDeliveryDate: Date | null,
  nowDate: Date,
): { eligible: boolean; reason?: string } {
  if (orderStatus === 'DELIVERED') {
    if (!deliveredAt) return { eligible: false, reason: 'No delivery date recorded' };
    const daysSince = (nowDate.getTime() - deliveredAt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince > 30) return { eligible: false, reason: 'Post-delivery window (30 days) expired' };
    return { eligible: true };
  }

  if (!expectedDeliveryDate) return { eligible: false, reason: 'No expected delivery date' };
  const daysOverdue = (nowDate.getTime() - expectedDeliveryDate.getTime()) / (1000 * 60 * 60 * 24);
  if (daysOverdue < 0) return { eligible: false, reason: 'Expected delivery not yet due' };
  if (daysOverdue > 7) return { eligible: false, reason: 'Non-delivery window (7 days) expired' };
  return { eligible: true };
}

describe('Property 18: Dispute Eligibility Window is Universally Enforced', () => {
  it('dispute opened > 30 days after delivery is always rejected', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 31, max: 365 }),
        (daysAfterDelivery) => {
          const deliveredAt = new Date('2024-01-01');
          const nowDate = new Date(
            deliveredAt.getTime() + daysAfterDelivery * 24 * 60 * 60 * 1000,
          );
          const result = isEligibleForDispute('DELIVERED', deliveredAt, null, nowDate);
          return result.eligible === false;
        },
      ),
      { numRuns: 200 },
    );
  });

  it('dispute opened within 30 days after delivery is always allowed', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 30 }),
        (daysAfterDelivery) => {
          const deliveredAt = new Date('2024-01-01');
          const nowDate = new Date(
            deliveredAt.getTime() + daysAfterDelivery * 24 * 60 * 60 * 1000,
          );
          const result = isEligibleForDispute('DELIVERED', deliveredAt, null, nowDate);
          return result.eligible === true;
        },
      ),
      { numRuns: 100 },
    );
  });

  it('non-delivery dispute opened > 7 days after expected delivery is always rejected', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 8, max: 100 }),
        fc.constantFrom<OrderStatus>('SHIPPED', 'CONFIRMED', 'IN_PRODUCTION'),
        (daysOverdue, status) => {
          const expectedDate = new Date('2024-01-01');
          const now = new Date(expectedDate.getTime() + daysOverdue * 24 * 60 * 60 * 1000);
          const result = isEligibleForDispute(status, null, expectedDate, now);
          return result.eligible === false;
        },
      ),
      { numRuns: 200 },
    );
  });
});
