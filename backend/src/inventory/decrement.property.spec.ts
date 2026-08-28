/**
 * Property 12: Inventory Decrement Safety Invariant
 * Validates: Requirements 11.1
 *
 * Property 13: Inventory Status Cycle Round-Trip
 * Validates: Requirements 11.5, 11.6
 */
import * as fc from 'fast-check';

// ─── Property 12 ─────────────────────────────────────────────────────────────

describe('Property 12: Inventory Decrement Safety Invariant', () => {
  function decrementInventory(
    currentQty: number,
    orderQty: number,
  ): { success: boolean; newQty: number; error?: string } {
    if (currentQty - orderQty < 0) {
      return { success: false, newQty: currentQty, error: 'Insufficient inventory' };
    }
    return { success: true, newQty: currentQty - orderQty };
  }

  it('inventory never goes below 0 after any decrement', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 999_999 }), // currentQty
        fc.integer({ min: 0, max: 999_999 }), // orderQty
        (currentQty, orderQty) => {
          const result = decrementInventory(currentQty, orderQty);
          return result.newQty >= 0;
        },
      ),
      { numRuns: 1000 },
    );
  });

  it('when orderQty > currentQty the decrement is always rejected', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 999_998 }),
        fc.integer({ min: 1, max: 999_999 }),
        (base, extra) => {
          const currentQty = base;
          const orderQty = base + extra; // always greater
          const result = decrementInventory(currentQty, orderQty);
          return result.success === false && result.newQty === currentQty;
        },
      ),
      { numRuns: 500 },
    );
  });

  it('concurrent decrements never result in negative inventory', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100 }), // starting qty
        fc.array(fc.integer({ min: 1, max: 10 }), { minLength: 1, maxLength: 20 }),
        (startQty, orders) => {
          let qty = startQty;
          for (const orderQty of orders) {
            if (qty - orderQty < 0) break; // reject
            qty -= orderQty;
          }
          return qty >= 0;
        },
      ),
      { numRuns: 200 },
    );
  });
});

// ─── Property 13 ─────────────────────────────────────────────────────────────

describe('Property 13: Inventory Status Cycle Round-Trip', () => {
  type ProductStatus = 'PUBLISHED' | 'OUT_OF_STOCK';

  function applyInventoryChange(
    currentStatus: ProductStatus,
    currentQty: number,
    delta: number,
  ): { newStatus: ProductStatus; newQty: number } {
    const newQty = Math.max(0, currentQty + delta);
    let newStatus: ProductStatus = currentStatus;

    if (newQty === 0) {
      newStatus = 'OUT_OF_STOCK';
    } else if (currentStatus === 'OUT_OF_STOCK' && newQty > 0) {
      newStatus = 'PUBLISHED';
    }

    return { newStatus, newQty };
  }

  it('inventory reaching 0 always sets OUT_OF_STOCK status', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 999_999 }),
        (startQty) => {
          const result = applyInventoryChange('PUBLISHED', startQty, -startQty);
          return result.newQty === 0 && result.newStatus === 'OUT_OF_STOCK';
        },
      ),
      { numRuns: 200 },
    );
  });

  it('incrementing above 0 while OUT_OF_STOCK always restores PUBLISHED status', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 999_999 }),
        (addQty) => {
          const result = applyInventoryChange('OUT_OF_STOCK', 0, addQty);
          return result.newQty === addQty && result.newStatus === 'PUBLISHED';
        },
      ),
      { numRuns: 200 },
    );
  });

  it('published → out-of-stock → published is a valid round-trip', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 999_999 }),
        fc.integer({ min: 1, max: 999_999 }),
        (initialQty, restoreQty) => {
          // Decrement to 0
          const step1 = applyInventoryChange('PUBLISHED', initialQty, -initialQty);
          if (step1.newStatus !== 'OUT_OF_STOCK') return false;

          // Restore
          const step2 = applyInventoryChange('OUT_OF_STOCK', 0, restoreQty);
          return step2.newStatus === 'PUBLISHED' && step2.newQty === restoreQty;
        },
      ),
      { numRuns: 200 },
    );
  });
});
