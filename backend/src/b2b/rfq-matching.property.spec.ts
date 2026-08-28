/**
 * Property 14: RFQ Match Scores Are Correctly Computed and Sorted
 * Validates: Requirements 13.3
 */
import * as fc from 'fast-check';

interface ArtisanMatch {
  artisanId: string;
  categoryMatch: number;
  capacityScore: number;
  trustScoreNorm: number;
  proximityScore: number;
  activeInventoryPct: number;
}

/**
 * score = (category_match×0.30) + (capacity_score×0.25) +
 *         (trust_score_norm×0.20) + (proximity_score×0.15) +
 *         (active_inventory_pct×0.10)
 */
function computeMatchScore(artisan: ArtisanMatch): number {
  return (
    artisan.categoryMatch * 0.3 +
    artisan.capacityScore * 0.25 +
    artisan.trustScoreNorm * 0.2 +
    artisan.proximityScore * 0.15 +
    artisan.activeInventoryPct * 0.1
  );
}

function rankMatches(artisans: ArtisanMatch[]): Array<ArtisanMatch & { score: number }> {
  return artisans
    .map((a) => ({ ...a, score: computeMatchScore(a) }))
    .sort((a, b) => b.score - a.score);
}

const artisanArb = fc.record({
  artisanId: fc.uuid(),
  categoryMatch: fc.float({ min: 0, max: 1 }),
  capacityScore: fc.float({ min: 0, max: 1 }),
  trustScoreNorm: fc.float({ min: 0, max: 1 }),
  proximityScore: fc.constantFrom(0, 0.5, 1),
  activeInventoryPct: fc.float({ min: 0, max: 1 }),
});

describe('Property 14: RFQ Match Scores Are Correctly Computed and Sorted', () => {
  it('scores are always in range [0, 1]', () => {
    fc.assert(
      fc.property(artisanArb, (artisan) => {
        const score = computeMatchScore(artisan);
        return score >= 0 && score <= 1;
      }),
      { numRuns: 500 },
    );
  });

  it('result list is always sorted descending by score', () => {
    fc.assert(
      fc.property(
        fc.array(artisanArb, { minLength: 3, maxLength: 20 }),
        (artisans) => {
          const ranked = rankMatches(artisans);
          for (let i = 1; i < ranked.length; i++) {
            if (ranked[i].score > ranked[i - 1].score) return false;
          }
          return true;
        },
      ),
      { numRuns: 200 },
    );
  });

  it('higher category match always increases score holding other factors equal', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 0.9 }),
        fc.float({ min: 0, max: 1 }),
        fc.float({ min: 0, max: 1 }),
        fc.constantFrom<0 | 0.5 | 1>(0, 0.5, 1),
        fc.float({ min: 0, max: 1 }),
        (lowCat, capScore, trustNorm, proxScore, invPct) => {
          const highCat = Math.min(1, lowCat + 0.1);
          const baseFn = (cat: number) =>
            computeMatchScore({
              artisanId: 'test',
              categoryMatch: cat,
              capacityScore: capScore,
              trustScoreNorm: trustNorm,
              proximityScore: proxScore,
              activeInventoryPct: invPct,
            });
          return baseFn(highCat) > baseFn(lowCat);
        },
      ),
      { numRuns: 200 },
    );
  });

  it('weights always sum to 1.0', () => {
    const weights = [0.3, 0.25, 0.2, 0.15, 0.1];
    const sum = weights.reduce((a, b) => a + b, 0);
    expect(Math.abs(sum - 1.0)).toBeLessThan(0.0001);
  });
});
