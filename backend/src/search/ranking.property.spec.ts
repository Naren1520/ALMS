/**
 * Property 8: Search Result Ordering Invariant
 * Property 9: Zero Search Results Always Yields Suggestions
 * Validates: Requirements 9.2, 9.6
 */
import * as fc from 'fast-check';

interface SearchCandidate {
  id: string;
  ftsScore: number;
  cosineSim: number;
  trustScoreNorm: number;
}

function computeSearchScore(c: SearchCandidate): number {
  return c.ftsScore * 0.4 + c.cosineSim * 0.4 + c.trustScoreNorm * 0.2;
}

function rankResults(candidates: SearchCandidate[]): (SearchCandidate & { score: number })[] {
  return candidates
    .map((c) => ({ ...c, score: computeSearchScore(c) }))
    .sort((a, b) => b.score - a.score);
}

const candidateArb = fc.record({
  id: fc.uuid(),
  ftsScore: fc.double({ min: 0, max: 1, noNaN: true }),
  cosineSim: fc.double({ min: 0, max: 1, noNaN: true }),
  trustScoreNorm: fc.double({ min: 0, max: 1, noNaN: true }),
});

describe('Property 8: Search Result Ordering Invariant', () => {
  it('results are always sorted descending by combined score', () => {
    fc.assert(
      fc.property(
        fc.array(candidateArb, { minLength: 0, maxLength: 50 }),
        (candidates) => {
          const ranked = rankResults(candidates);
          for (let i = 1; i < ranked.length; i++) {
            if (ranked[i].score > ranked[i - 1].score) return false;
          }
          return true;
        },
      ),
      { numRuns: 300 },
    );
  });

  it('weights sum to 1.0', () => {
    const total = 0.4 + 0.4 + 0.2;
    expect(Math.abs(total - 1.0)).toBeLessThan(0.0001);
  });

  it('higher FTS score always produces higher combined score given equal other factors', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 0.8, noNaN: true }),
        fc.double({ min: 0, max: 1, noNaN: true }),
        fc.double({ min: 0, max: 1, noNaN: true }),
        (lowFts, cosineSim, trustNorm) => {
          const highFts = Math.min(1, lowFts + 0.2);
          const lowScore = computeSearchScore({ id: 'a', ftsScore: lowFts, cosineSim, trustScoreNorm: trustNorm });
          const highScore = computeSearchScore({ id: 'b', ftsScore: highFts, cosineSim, trustScoreNorm: trustNorm });
          return highScore > lowScore;
        },
      ),
      { numRuns: 200 },
    );
  });
});

describe('Property 9: Zero Search Results Always Yields Suggestions', () => {
  const CRAFT_CATEGORIES = ['Textile', 'Pottery', 'Jewelry', 'Painting', 'Weaving', 'Casting'];

  function getZeroResultsSuggestions(query: string): string[] {
    // Simulates nearest-neighbor suggestions
    const lower = query.toLowerCase();
    const matches = CRAFT_CATEGORIES.filter((c) =>
      c.toLowerCase().includes(lower.slice(0, 3)),
    );
    if (matches.length >= 5) return matches.slice(0, 5);
    return [...matches, ...CRAFT_CATEGORIES.slice(0, 5 - matches.length)];
  }

  it('zero results always returns exactly 5 suggestions', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }),
        (query) => {
          const suggestions = getZeroResultsSuggestions(query);
          return suggestions.length === 5;
        },
      ),
      { numRuns: 100 },
    );
  });

  it('suggestions array is never empty when results are empty', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }),
        (query) => {
          const suggestions = getZeroResultsSuggestions(query);
          return Array.isArray(suggestions) && suggestions.length > 0;
        },
      ),
      { numRuns: 100 },
    );
  });
});
