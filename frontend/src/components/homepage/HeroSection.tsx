'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Sparkles, ArrowRight, ShieldCheck, Camera, Mic, Calculator } from 'lucide-react';

export default function HeroSection() {
  const prefersReduced = useReducedMotion();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReduced) return;
    let ctx: any;
    (async () => {
      try {
        const { gsap } = await import('gsap');
        ctx = gsap.context(() => {
          const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
          tl.from(metaRef.current, { opacity: 0, y: 16, duration: 0.8, delay: 0.2 })
            .from(headingRef.current, { opacity: 0, y: 36, duration: 1.0 }, '-=0.4')
            .from(subRef.current, { opacity: 0, y: 20, duration: 0.8 }, '-=0.5')
            .from(ctaRef.current, { opacity: 0, y: 20, duration: 0.7 }, '-=0.4');
        });
      } catch (e) {
        // fallback
      }
    })();
    return () => ctx?.revert();
  }, [prefersReduced]);

  return (
    <section
      className="relative min-h-[90vh] md:min-h-screen flex items-center overflow-hidden bg-charcoal text-white pt-20"
      aria-label="ALMS — Virtual Business Manager for Artisans"
    >
      {/* Background Image: Authentic Handcrafted Heritage Artwork & Ambient Workshop */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/truly_tribal_hero.jpg"
          alt="Indian traditional handicrafts, brass diyas, and handpainted artisan plates"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Soft Vignette / Gradient Overlay for pristine text readability */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              to right,
              rgba(18, 10, 6, 0.90) 0%,
              rgba(24, 12, 7, 0.78) 50%,
              rgba(18, 10, 6, 0.42) 100%
            )`,
          }}
        />
      </div>

      {/* Hero Content */}
      <div className="container relative z-10 py-16 md:py-24">
        <div className="max-w-3xl space-y-6">
          {/* Government Affiliation Badge */}
          <div ref={metaRef} className="space-y-3">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs text-amber-200 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#FA7A21] animate-pulse" />
              <span className="font-sans font-medium tracking-wide">
                Ministry of Social Justice &amp; Empowerment &bull; Govt. of India
              </span>
            </div>
            {/* <p
              className="text-[#FA7A21] font-sans font-bold tracking-widest text-xs uppercase flex items-center gap-2"
              style={{ letterSpacing: '0.14em' }}
            >
              <span className="w-6 h-0.5 bg-[#FA7A21] rounded-full inline-block" />
              SIH Problem Statement Solution
            </p> */}
          </div>

          {/* Main Headline: Original ALMS Core Identity */}
          <h1
            ref={headingRef}
            className="font-serif text-white font-normal"
            style={{
              fontSize: 'clamp(2.75rem, 6vw, 5.25rem)',
              lineHeight: 1.08,
              letterSpacing: '-0.015em',
            }}
          >
            The Virtual Business Manager<br />
            <span className="italic font-light text-amber-200">for India&apos;s Artisans.</span>
          </h1>

          {/* Subtitle: Addressing Problem Statement Barriers */}
          <p
            ref={subRef}
            className="text-stone-200 font-sans text-base sm:text-lg font-light max-w-2xl leading-relaxed"
          >
            Bridging indigenous craftsmanship and digital commerce without technical barriers.
            <strong className="text-white font-medium"> One photo + one native voice note</strong> turns raw craft into an e-commerce-ready catalogue, defensible price breakdown, and direct B2B market connection.
          </p>

          {/* 3 Core AI Pillars Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 max-w-2xl">
            <div className="p-3 bg-black/40 backdrop-blur-md border border-white/15 rounded-2xl flex items-center gap-2.5 shadow-sm">
              <Camera size={18} className="text-[#FA7A21] shrink-0" />
              <div>
                <p className="text-xs font-semibold text-white">AI Image Studio</p>
                <p className="text-[10px] text-stone-300">Background Extraction</p>
              </div>
            </div>
            <div className="p-3 bg-black/40 backdrop-blur-md border border-white/15 rounded-2xl flex items-center gap-2.5 shadow-sm">
              <Mic size={18} className="text-[#FA7A21] shrink-0" />
              <div>
                <p className="text-xs font-semibold text-white">Voice Cataloger</p>
                <p className="text-[10px] text-stone-300">12+ Native Dialects</p>
              </div>
            </div>
            <div className="p-3 bg-black/40 backdrop-blur-md border border-white/15 rounded-2xl flex items-center gap-2.5 shadow-sm">
              <Calculator size={18} className="text-[#FA7A21] shrink-0" />
              <div>
                <p className="text-xs font-semibold text-white">Dynamic Pricing</p>
                <p className="text-[10px] text-stone-300">Fair Price Floor</p>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div ref={ctaRef} className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              href="#live-ai-studio"
              className="px-8 py-4 bg-[#FA7A21] hover:bg-[#e06917] text-white font-sans font-semibold text-sm sm:text-base rounded-full shadow-lg hover:shadow-orange-500/25 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <Sparkles size={17} />
              <span>Launch Live AI Studio Demo</span>
            </Link>

            <Link
              href="/b2b/rfq"
              className="px-7 py-4 bg-white/10 hover:bg-white/20 text-white font-sans font-medium text-sm sm:text-base rounded-full border border-white/30 backdrop-blur-md transition-all duration-300 flex items-center gap-2"
            >
              <span>B2B RFQ Matcher</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/impact"
              className="flex items-center gap-1.5 text-xs text-stone-300 hover:text-white transition-colors py-2 px-3"
            >
              <ShieldCheck size={15} className="text-amber-400" />
              <span>MoSJE Impact Tracker</span>
            </Link>
          </div>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-white/15">
            {[
              { n: '3.5 Mins', l: 'Catalogue Creation' },
              { n: '12+ Dialects', l: 'Voice AI Translation' },
              { n: 'Fair Price Floor', l: 'Wage Protection' },
              { n: 'ONDC Ready', l: 'Standardized Payload' },
            ].map(({ n, l }) => (
              <div key={l}>
                <p className="font-serif text-amber-200 text-xl sm:text-2xl font-light">{n}</p>
                <p className="text-stone-300 text-[11px] font-sans mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
