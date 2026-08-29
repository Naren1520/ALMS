'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import HeroSection from '@/components/homepage/HeroSection';
import WhoWeAreSection from '@/components/homepage/WhoWeAreSection';
import OfferingsSection from '@/components/homepage/OfferingsSection';
import LiveAIStudioDemo from '@/components/homepage/LiveAIStudioDemo';
import DiariesOfIndiaSection from '@/components/homepage/DiariesOfIndiaSection';
import CorporateGiftingSection from '@/components/homepage/CorporateGiftingSection';
import CraftDiscoveryGrid from '@/components/homepage/CraftDiscoveryGrid';
import AITransformationSection from '@/components/homepage/AITransformationSection';
import B2BSection from '@/components/homepage/B2BSection';
import TrustSection from '@/components/homepage/TrustSection';
import ImpactPreviewSection from '@/components/homepage/ImpactPreviewSection';
import VLEAssistedSection from '@/components/homepage/VLEAssistedSection';
import ArtisanSpotlightSection from '@/components/homepage/ArtisanSpotlightSection';
import FinalCTASection from '@/components/homepage/FinalCTASection';
import FloatingSupportWidget from '@/components/homepage/FloatingSupportWidget';

export default function HomePageSections() {
  const prefersReducedMotion = useReducedMotion();
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    if (prefersReducedMotion) return;
    let cleanup: (() => void) | undefined;

    (async () => {
      try {
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
      } catch (e) {
        console.warn('Smooth scroll init failed:', e);
      }
    })();

    return () => cleanup?.();
  }, [prefersReducedMotion]);

  return (
    <main id="main-content" className="relative overflow-x-hidden">
      {/* 1. Hero: Where Tradition Meets Thoughtful Gifting */}
      <HeroSection />

      {/* 2. Editorial Mission: Why ALMS & MoSJE Mission Cards */}
      <WhoWeAreSection />

      {/* 3. Our Digital Offerings: Zero-Hardware Studio & Core Pillars */}
      <OfferingsSection />

      {/* 4. Interactive Virtual Business Manager & Live AI Studio */}
      <LiveAIStudioDemo />

      {/* 5. Master Artisan Spotlight: Diaries of India (GI Certified Pattachitra) */}
      <DiariesOfIndiaSection />

      {/* 6. Sustainable Corporate & Institutional Gifting */}
      <div id="corporate-gifting">
        <CorporateGiftingSection />
      </div>

      {/* 7. Curated Tribal & Folk Craft Traditions Mosaic */}
      <CraftDiscoveryGrid />

      {/* 8. AI Image Studio, Voice Cataloger & Dynamic Pricing Architecture */}
      <AITransformationSection />

      {/* 9. B2B RFQ Matching & Capacity Splitting Engine */}
      <B2BSection />

      {/* 10. Explainable Artisan Reliability Profile & Trust Metrics */}
      <TrustSection />

      {/* 11. MoSJE Government Outcomes & Livelihood Impact Matrix */}
      <ImpactPreviewSection />

      {/* 12. Last-Mile VLE & CSC Assisted Ground Network */}
      <VLEAssistedSection />

      {/* 13. Master Artisan Voices & Testimonials */}
      <ArtisanSpotlightSection />

      {/* 14. Final Action Call to Action */}
      <FinalCTASection />

      {/* Floating Orange Chat & Support Widget */}
      <FloatingSupportWidget />
    </main>
  );
}
