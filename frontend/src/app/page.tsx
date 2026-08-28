/**
 * ALMS Homepage — Scroll-driven Storytelling (Req 27.1–27.8)
 * 8 GSAP ScrollTrigger sections with Lenis smooth scroll.
 */
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

export default function HomePage() {
  const prefersReducedMotion = useReducedMotion();
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    if (prefersReducedMotion) return;

    // Dynamic import to avoid blocking first paint (Req 27.2)
    let cleanup: (() => void) | undefined;

    (async () => {
      const [{ default: Lenis }, gsapModule] = await Promise.all([
        import('lenis'),
        import('gsap'),
      ]);
      const { gsap } = gsapModule;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');

      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({ duration: 1.2, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
      lenisRef.current = lenis;

      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time: number) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);

      cleanup = () => {
        lenis.destroy();
        ScrollTrigger.killAll();
        gsap.ticker.remove((time: number) => lenis.raf(time * 1000));
      };
    })();

    return () => cleanup?.();
  }, [prefersReducedMotion]);

  return (
    <main id="main-content">
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>
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
