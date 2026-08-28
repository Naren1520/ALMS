'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Hero Section — 100vh, GSAP character reveal without SplitText premium plugin (Req 27.1, 27.3)
 * Characters are split manually via React spans so no Club GSAP license is required.
 * LCP ≤3s: hero image uses priority={true} (Req 27.6)
 */

/** Wrap every character in a <span> so GSAP can stagger them. */
function SplitChars({ text, className }: { text: string; className?: string }) {
  return (
    <>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className={className}
          style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : undefined }}
          aria-hidden="true"
        >
          {char}
        </span>
      ))}
    </>
  );
}

export default function HeroSection() {
  const prefersReduced = useReducedMotion();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReduced) return;

    let ctx: any;
    (async () => {
      const { gsap } = await import('gsap');

      ctx = gsap.context(() => {
        if (!headingRef.current) return;

        // Target every inline-block char span inside the heading
        const chars = headingRef.current.querySelectorAll<HTMLSpanElement>('span[aria-hidden="true"]');

        gsap.from(chars, {
          opacity: 0,
          y: 40,
          rotationX: -90,
          stagger: 0.02,
          duration: 0.8,
          ease: 'back.out(1.7)',
        });

        gsap.from(subRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.6,
          delay: 0.8,
          ease: 'power2.out',
        });

        gsap.from(ctaRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.5,
          delay: 1.2,
          ease: 'power2.out',
        });
      });
    })();

    return () => ctx?.revert();
  }, [prefersReduced]);

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'var(--color-bg-primary)' }}
      aria-label="Hero — ALMS Artisan Marketplace"
    >
      {/* Background image — priority for LCP */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-artisan.jpg"
          alt="Indian artisan weaving a traditional textile"
          fill
          priority
          className="object-cover object-center opacity-20"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(250,247,242,0.95) 0%, rgba(250,247,242,0.7) 100%)',
          }}
        />
      </div>

      <div className="container relative z-10 text-center py-20">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-accent mb-6 font-ui">
          Ministry of Social Justice & Empowerment
        </p>

        <h1
          ref={headingRef}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-light leading-tight text-brand-text mb-8"
        >
          {/* Screen-reader text — hidden visually but readable by AT */}
          <span className="sr-only">Crafted by India. Discovered by the World.</span>

          {/* Animated char spans — hidden from screen readers via aria-hidden on each span */}
          <span aria-hidden="true">
            <SplitChars text="Crafted by India." />
          </span>
          <br />
          <span aria-hidden="true" style={{ color: 'var(--color-accent)' }}>
            <SplitChars text="Discovered by the World." />
          </span>
        </h1>

        <p
          ref={subRef}
          className="font-ui text-lg md:text-xl text-brand-muted max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          ALMS connects marginalized artisans with domestic consumers and global B2B buyers
          through zero-friction AI-powered tools — upload a photo, speak your language,
          and let the platform handle the rest.
        </p>

        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register?role=ARTISAN"
            className="px-8 py-4 rounded-lg font-ui font-medium text-white transition-all duration-200
              hover:opacity-90 hover:-translate-y-0.5 focus-visible:outline-2"
            style={{ background: 'var(--color-accent)' }}
          >
            I&apos;m an Artisan
          </Link>
          <Link
            href="/register?role=BUYER"
            className="px-8 py-4 rounded-lg font-ui font-medium border-2 transition-all duration-200
              hover:-translate-y-0.5 focus-visible:outline-2"
            style={{
              borderColor: 'var(--color-accent)',
              color: 'var(--color-accent)',
            }}
          >
            I&apos;m a Buyer
          </Link>
          <Link
            href="/explore"
            className="px-8 py-4 rounded-lg font-ui font-medium transition-all duration-200
              hover:-translate-y-0.5 focus-visible:outline-2"
            style={{
              background: 'var(--color-surface)',
              color: 'var(--color-text-primary)',
            }}
          >
            Explore Crafts
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div
          className="w-6 h-10 rounded-full border-2 flex items-start justify-center p-1"
          style={{ borderColor: 'var(--color-muted)' }}
          aria-hidden="true"
        >
          <div
            className="w-1.5 h-3 rounded-full"
            style={{ background: 'var(--color-muted)' }}
          />
        </div>
      </div>
    </section>
  );
}
