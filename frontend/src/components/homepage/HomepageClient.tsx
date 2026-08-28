'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import HeroSection from '@/components/homepage/HeroSection';
import CraftPhilosophySection from '@/components/homepage/CraftPhilosophySection';
import ArtisanSpotlightSection from '@/components/homepage/ArtisanSpotlightSection';
import CraftDiscoveryGrid from '@/components/homepage/CraftDiscoveryGrid';
import AITransformationSection from '@/components/homepage/AITransformationSection';
import B2BSection from '@/components/homepage/B2BSection';
import TrustSection from '@/components/homepage/TrustSection';
import FinalCTASection from '@/components/homepage/FinalCTASection';

/**
 * Client-only wrapper for the homepage.
 * Handles Lenis smooth scroll + GSAP ScrollTrigger setup.
 * This is dynamically imported with ssr:false to avoid
 * browser-only Lenis/GSAP modules crashing during prerender.
 */
export default function HomepageClient() {
  const prefersReducedMotion = useReducedMotion();
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    if (prefersReducedMotion) return;

    let cleanup: (() => void) | undefined;

    (async () => {
      const [{ default: Lenis }, gsapModule] = await Promise.all([
        import('lenis'),
        import('gsap'),
      ]);
      const { gsap } = gsapModule;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        duration: 0.8,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      lenisRef.current = lenis;

      lenis.on('scroll', ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      cleanup = () => {
        lenis.destroy();
        ScrollTrigger.killAll();
        gsap.ticker.remove(tick);
      };
    })();

    return () => cleanup?.();
  }, [prefersReducedMotion]);

  return (
    <main id="main-content">
      <HeroSection />
      <CraftPhilosophySection />
      <ArtisanSpotlightSection />
      <CraftDiscoveryGrid />
      <AITransformationSection />
      <B2BSection />
      <TrustSection />
      <FinalCTASection />
    </main>
  );
}
