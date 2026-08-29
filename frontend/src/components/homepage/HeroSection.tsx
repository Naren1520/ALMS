'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ArrowRight, Sparkles, Camera, Mic, Calculator, ShieldCheck } from 'lucide-react';

export default function HeroSection() {
  const prefersReduced = useReducedMotion();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReduced) return;
    let ctx: any;
    (async () => {
      try {
        const { gsap } = await import('gsap');
        ctx = gsap.context(() => {
          const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
          tl.from(metaRef.current, { opacity: 0, y: 16, duration: 0.8, delay: 0.2 })
            .from(headingRef.current, { opacity: 0, y: 40, duration: 1.1 }, '-=0.4')
            .from(subRef.current, { opacity: 0, y: 24, duration: 0.8 }, '-=0.5')
            .from(badgesRef.current, { opacity: 0, y: 20, duration: 0.7 }, '-=0.4')
            .from(ctaRef.current, { opacity: 0, y: 20, duration: 0.7 }, '-=0.4');
        });
      } catch (e) {
        // animations fallback
      }
    })();
    return () => ctx?.revert();
  }, [prefersReduced]);

  return (
    <section
      className="relative min-h-screen flex items-end overflow-hidden bg-charcoal text-ivory"
      aria-label="ALMS — Virtual Business Manager for Artisans"
    >
      {/* Background image: Authentic artisan crafting in workshop */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=2000&q=85&auto=format&fit=crop"
          alt="Indian artisan handcrafting traditional textiles"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
          unoptimized
        />
        {/* Layered luxury gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(
                to bottom,
                rgba(26,26,26,0.3) 0%,
                rgba(26,26,26,0.45) 30%,
                rgba(26,26,26,0.78) 70%,
                rgba(26,26,26,0.95) 100%
              )
            `,
          }}
        />
      </div>

      {/* Hero Content */}
      <div className="container relative z-10 pb-16 md:pb-24 pt-32">
        <div className="max-w-4xl">
          {/* Government Affiliation Badge */}
          <div ref={metaRef} className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-ivory/10 backdrop-blur-md border border-white/20 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="overline text-ivory tracking-widest text-[11px]">
              Ministry of Social Justice &amp; Empowerment &bull; Govt. of India
            </span>
          </div>

          {/* Main Headline */}
          <h1
            ref={headingRef}
            className="font-serif text-ivory mb-6"
            style={{
              fontSize: 'clamp(2.75rem, 6.5vw, 5.5rem)',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              fontWeight: 300,
            }}
          >
            The Virtual Business Manager<br />
            <em className="text-gold-light" style={{ fontStyle: 'italic' }}>
              for India&apos;s Artisans.
            </em>
          </h1>

          {/* Subtitle addressing the PS barriers */}
          <p
            ref={subRef}
            className="text-stone-light font-sans mb-8 max-w-2xl leading-relaxed text-base sm:text-lg"
          >
            Bridging indigenous craftsmanship and digital markets without technical barriers.
            <strong className="text-ivory font-medium"> One photo + one native voice note</strong> turns raw craft into an e-commerce-ready catalogue, defensible price breakdown, and direct B2B market connection.
          </p>

          {/* 3 Core AI Pillars Pills */}
          <div ref={badgesRef} className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10 max-w-2xl">
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-charcoal/80 border border-white/15 rounded backdrop-blur-sm">
              <Camera size={16} className="text-gold shrink-0" />
              <span className="text-xs font-medium text-ivory">AI Image Studio</span>
            </div>
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-charcoal/80 border border-white/15 rounded backdrop-blur-sm">
              <Mic size={16} className="text-gold shrink-0" />
              <span className="text-xs font-medium text-ivory">Voice Auto-Cataloger</span>
            </div>
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-charcoal/80 border border-white/15 rounded backdrop-blur-sm">
              <Calculator size={16} className="text-gold shrink-0" />
              <span className="text-xs font-medium text-ivory">Dynamic Price Engine</span>
            </div>
          </div>

          {/* CTA Row */}
          <div ref={ctaRef} className="flex flex-wrap gap-4 items-center">
            <Link href="#live-ai-studio" className="btn-gold flex items-center gap-2 text-xs py-3.5 px-6 font-semibold">
              <Sparkles size={14} />
              Launch Live AI Studio Demo
            </Link>
            <Link href="/b2b/rfq" className="btn-outline flex items-center gap-2 text-xs py-3.5 px-6 font-semibold" style={{ borderColor: 'rgba(253,251,247,0.4)', color: 'var(--ivory)' }}>
              B2B RFQ Matching Engine
              <ArrowRight size={14} />
            </Link>
            <Link href="/impact" className="overline text-stone-light hover:text-ivory transition-colors duration-300 flex items-center gap-1.5 text-xs py-2">
              <ShieldCheck size={14} className="text-gold" />
              MoSJE Impact Tracker
            </Link>
          </div>
        </div>

        {/* Bottom Metrics: Grounded & Realistic */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-14 pt-8 border-t border-white/10">
          {[
            { n: '3.5 Mins', l: 'Catalogue Creation Time' },
            { n: '12+ Dialects', l: 'Multilingual Voice AI' },
            { n: 'Fair Price Floor', l: 'Anti-Exploitation Engine' },
            { n: 'ONDC Ready', l: 'Standardized Payload Format' },
          ].map(({ n, l }) => (
            <div key={l}>
              <p className="font-serif text-gold-light text-xl sm:text-2xl font-light">{n}</p>
              <p className="overline text-stone-light mt-0.5" style={{ fontSize: '0.6rem' }}>{l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
