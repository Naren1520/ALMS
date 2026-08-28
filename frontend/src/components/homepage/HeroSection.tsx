'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ArrowRight } from 'lucide-react';

/**
 * Hero — full-viewport, editorial luxury layout.
 * Background: Unsplash artisan photo (online, no download needed).
 * Layout: Left-aligned large serif headline over a richly textured warm scene.
 */
export default function HeroSection() {
  const prefersReduced = useReducedMotion();
  const headingRef  = useRef<HTMLHeadingElement>(null);
  const subRef      = useRef<HTMLParagraphElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);
  const metaRef     = useRef<HTMLDivElement>(null);

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
            .from(subRef.current,    { opacity: 0, y: 24, duration: 0.8 }, '-=0.5')
            .from(ctaRef.current,    { opacity: 0, y: 20, duration: 0.7 }, '-=0.4');
        });
      } catch (e) {
        // animations unavailable — content still visible
      }
    })();
    return () => ctx?.revert();
  }, [prefersReduced]);

  return (
    <section
      className="relative min-h-screen flex items-end overflow-hidden bg-charcoal"
      aria-label="Hero — ALMS Artisan Marketplace"
    >
      {/* ── Background image from Unsplash (artisan weaving, warm tones) ── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=2000&q=85&auto=format&fit=crop"
          alt="Indian artisan weaving a traditional textile by hand"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
          unoptimized
        />
        {/* Gradient overlay — dark bottom, lighter top-left for text readability */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(
                to bottom,
                rgba(26,26,26,0.15) 0%,
                rgba(26,26,26,0.2) 30%,
                rgba(26,26,26,0.65) 70%,
                rgba(26,26,26,0.88) 100%
              )
            `,
          }}
        />
      </div>

      {/* ── Content — bottom aligned, editorial feel ── */}
      <div className="container relative z-10 pb-20 md:pb-28 pt-32">
        <div className="max-w-4xl">

          {/* Overline */}
          <div ref={metaRef} className="flex items-center gap-3 mb-8">
            <span className="block w-8 h-px bg-gold" />
            <span className="overline text-stone-light">
              Ministry of Social Justice &amp; Empowerment
            </span>
          </div>

          {/* Headline */}
          <h1
            ref={headingRef}
            className="font-serif text-ivory mb-8"
            style={{
              fontSize: 'clamp(3rem, 7vw, 6.5rem)',
              lineHeight: 1.0,
              letterSpacing: '-0.02em',
              fontWeight: 300,
            }}
          >
            <span className="sr-only">Crafted by India. Discovered by the World.</span>
            <span aria-hidden="true">
              Crafted by India.<br />
              <em className="italic not-italic" style={{ color: 'var(--gold-light)' }}>
                Discovered by the World.
              </em>
            </span>
          </h1>

          {/* Sub */}
          <p
            ref={subRef}
            className="text-stone-light font-sans mb-12 max-w-xl leading-relaxed"
            style={{ fontSize: 'clamp(1rem, 1.5vw, 1.125rem)' }}
          >
            ALMS connects India's 7 million artisans with domestic consumers and global buyers
            through zero-friction, AI-powered tools. Upload a photo, speak your language —
            the platform does the rest.
          </p>

          {/* CTA row */}
          <div ref={ctaRef} className="flex flex-wrap gap-4 items-center">
            <Link href="/register?role=ARTISAN" className="btn-gold flex items-center gap-2">
              I&apos;m an Artisan
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
            <Link href="/register?role=BUYER"
              className="btn-outline flex items-center gap-2"
              style={{ borderColor: 'rgba(253,251,247,0.4)', color: 'var(--ivory)' }}
            >
              I&apos;m a Buyer
            </Link>
            <Link
              href="/explore"
              className="overline text-stone-light hover:text-ivory transition-colors duration-300
                flex items-center gap-2"
              style={{ fontSize: '0.7rem' }}
            >
              Explore Crafts
              <ArrowRight size={11} aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* ── Bottom meta strip ── */}
        <div className="flex flex-wrap gap-8 mt-16 pt-8 border-t border-white/10">
          {[
            { n: '7M+',       l: 'Artisans' },
            { n: '3,000+',    l: 'Craft Traditions' },
            { n: '₹26,000 Cr',l: 'Export Potential' },
          ].map(({ n, l }) => (
            <div key={l}>
              <p className="font-serif text-gold-light text-2xl font-light">{n}</p>
              <p className="overline text-stone-light mt-0.5" style={{ fontSize: '0.6rem' }}>{l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
