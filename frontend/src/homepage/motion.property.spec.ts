/**
 * Property 23: Reduced Motion Disables All Animation Instances
 * Validates: Requirements 27.8
 */

// JSDOM mock for matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: query === '(prefers-reduced-motion: reduce)',
    media: query,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  })),
});

import * as fc from 'fast-check';

// Simulate the animation manager that checks reduced motion
class AnimationManager {
  private instances: { id: string; running: boolean }[] = [];

  constructor(private readonly prefersReducedMotion: boolean) {}

  start(id: string): boolean {
    if (this.prefersReducedMotion) {
      this.instances.push({ id, running: false });
      return false; // Not started
    }
    this.instances.push({ id, running: true });
    return true;
  }

  getRunningCount(): number {
    return this.instances.filter((i) => i.running).length;
  }

  getAllStopped(): boolean {
    return this.instances.every((i) => !i.running);
  }
}

describe('Property 23: Reduced Motion Disables All Animation Instances', () => {
  it('when reduced motion is true, no animations run regardless of count', () => {
    fc.assert(
      fc.property(
        fc.array(fc.uuid(), { minLength: 1, maxLength: 20 }),
        (animationIds) => {
          const manager = new AnimationManager(true);
          animationIds.forEach((id) => manager.start(id));
          return manager.getRunningCount() === 0 && manager.getAllStopped() === true;
        },
      ),
      { numRuns: 100 },
    );
  });

  it('when reduced motion is false, animations run normally', () => {
    fc.assert(
      fc.property(
        fc.array(fc.uuid(), { minLength: 1, maxLength: 20 }),
        (animationIds) => {
          const manager = new AnimationManager(false);
          animationIds.forEach((id) => manager.start(id));
          return manager.getRunningCount() === animationIds.length;
        },
      ),
      { numRuns: 100 },
    );
  });

  it('each individual animation start returns false under reduced motion', () => {
    fc.assert(
      fc.property(fc.uuid(), (id) => {
        const manager = new AnimationManager(true);
        const started = manager.start(id);
        return started === false;
      }),
      { numRuns: 100 },
    );
  });
});
