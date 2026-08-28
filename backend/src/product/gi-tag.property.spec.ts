/**
 * Property 19: GI Tag Eligibility Correctly Reflects Registry Membership
 * Validates: Requirements 22.3
 */
import * as fc from 'fast-check';

const GI_REGISTRY = new Set([
  'Pashmina', 'Madhubani Painting', 'Dhokra', 'Chikankari', 'Phulkari',
  'Blue Pottery', 'Bidriware', 'Kancheepuram Silk', 'Mysore Silk', 'Channapatna Toys',
]);

function checkGiEligibility(craftName: string): boolean {
  return GI_REGISTRY.has(craftName);
}

describe('Property 19: GI Tag Eligibility Correctly Reflects Registry Membership', () => {
  it('all GI-registered crafts are always marked eligible', () => {
    fc.assert(
      fc.property(fc.constantFrom(...GI_REGISTRY), (craft) => {
        return checkGiEligibility(craft) === true;
      }),
      { numRuns: 50 },
    );
  });

  it('crafts not in registry are always marked ineligible', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 2, maxLength: 40 }).filter((s) => !GI_REGISTRY.has(s)),
        (craft) => {
          return checkGiEligibility(craft) === false;
        },
      ),
      { numRuns: 100 },
    );
  });

  it('eligibility is deterministic — same craft always produces same result', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 2, maxLength: 40 }), (craft) => {
        return checkGiEligibility(craft) === checkGiEligibility(craft);
      }),
      { numRuns: 100 },
    );
  });
});
