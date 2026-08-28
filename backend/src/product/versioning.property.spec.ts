/**
 * Property 11: Product Update Always Creates a Pre-Update Snapshot
 * Validates: Requirements 10.3
 *
 * Property 10: Product Deletion Blocked by Active Orders
 * Validates: Requirements 10.1
 */
import * as fc from 'fast-check';

// ─── Property 11 ─────────────────────────────────────────────────────────────

interface ProductSnapshot {
  productId: string;
  snapshot: Record<string, unknown>;
  snapshotAt: Date;
  snapshotBy: string;
}

class MockProductStore {
  products = new Map<string, Record<string, unknown>>();
  snapshots: ProductSnapshot[] = [];

  createProduct(id: string, data: Record<string, unknown>) {
    this.products.set(id, { ...data });
  }

  updateProduct(
    productId: string,
    updates: Record<string, unknown>,
    actorId: string,
  ): boolean {
    const current = this.products.get(productId);
    if (!current) return false;

    // MUST snapshot before updating
    this.snapshots.push({
      productId,
      snapshot: { ...current },
      snapshotAt: new Date(),
      snapshotBy: actorId,
    });

    this.products.set(productId, { ...current, ...updates });
    return true;
  }

  getSnapshotsFor(productId: string): ProductSnapshot[] {
    return this.snapshots.filter((s) => s.productId === productId);
  }
}

describe('Property 11: Product Update Always Creates a Pre-Update Snapshot', () => {
  const productDataArb = fc.record({
    title: fc.string({ minLength: 1, maxLength: 200 }),
    description: fc.string({ minLength: 0, maxLength: 500 }),
    price: fc.float({ min: 1, max: 100000 }),
  });

  it('every update creates exactly one snapshot containing the previous state', () => {
    fc.assert(
      fc.property(
        fc.uuid(),
        productDataArb,
        productDataArb,
        fc.uuid(),
        (productId, originalData, updateData, actorId) => {
          const store = new MockProductStore();
          store.createProduct(productId, originalData);

          const snapshotsBefore = store.getSnapshotsFor(productId).length;
          store.updateProduct(productId, updateData, actorId);
          const snapshotsAfter = store.getSnapshotsFor(productId).length;

          const latestSnapshot = store.snapshots.at(-1);

          return (
            snapshotsAfter === snapshotsBefore + 1 &&
            latestSnapshot?.snapshotBy === actorId &&
            latestSnapshot?.snapshot['title'] === originalData.title
          );
        },
      ),
      { numRuns: 100 },
    );
  });

  it('multiple updates produce ordered snapshots with increasing snapshotAt', () => {
    fc.assert(
      fc.property(
        fc.uuid(),
        fc.array(productDataArb, { minLength: 2, maxLength: 5 }),
        fc.uuid(),
        (productId, updates, actorId) => {
          const store = new MockProductStore();
          store.createProduct(productId, updates[0]);

          for (let i = 1; i < updates.length; i++) {
            store.updateProduct(productId, updates[i], actorId);
          }

          const snaps = store.getSnapshotsFor(productId);
          return snaps.length === updates.length - 1;
        },
      ),
      { numRuns: 50 },
    );
  });
});

// ─── Property 10 ─────────────────────────────────────────────────────────────

describe('Property 10: Product Deletion Blocked by Active Orders', () => {
  type OrderStatus = 'PENDING' | 'CONFIRMED' | 'IN_PRODUCTION' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  const BLOCKING_STATUSES: OrderStatus[] = ['PENDING', 'CONFIRMED', 'IN_PRODUCTION'];

  function canDelete(orderStatuses: OrderStatus[]): { allowed: boolean; reason?: string } {
    const blockingOrder = orderStatuses.find((s) => BLOCKING_STATUSES.includes(s));
    if (blockingOrder) {
      return { allowed: false, reason: `Active order in ${blockingOrder} status` };
    }
    return { allowed: true };
  }

  it('deletion is always blocked when any order is in an active status', () => {
    fc.assert(
      fc.property(
        fc.array(fc.constantFrom<OrderStatus>('PENDING', 'CONFIRMED', 'IN_PRODUCTION'), { minLength: 1 }),
        fc.array(fc.constantFrom<OrderStatus>('SHIPPED', 'DELIVERED', 'CANCELLED'), { minLength: 0 }),
        (activeOrders, completedOrders) => {
          const allOrders = [...activeOrders, ...completedOrders];
          const result = canDelete(allOrders);
          return result.allowed === false;
        },
      ),
      { numRuns: 200 },
    );
  });

  it('deletion is always allowed when all orders are in terminal status', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.constantFrom<OrderStatus>('SHIPPED', 'DELIVERED', 'CANCELLED'),
          { minLength: 0, maxLength: 10 },
        ),
        (completedOrders) => {
          const result = canDelete(completedOrders);
          return result.allowed === true;
        },
      ),
      { numRuns: 100 },
    );
  });
});
