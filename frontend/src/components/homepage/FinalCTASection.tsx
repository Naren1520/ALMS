'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/** Section 8 — Final CTA fade-in parallax (Req 27.3) */
export default function FinalCTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;
    let ctx: any;
    (async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.from(contentRef.current, {
          opacity: 0,
          y: 40,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        });
        gsap.to(bgRef.current, {
          y: '-10%',
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 2,
          },
        });
      });
    })();
    return () => ctx?.revert();
  }, [prefersReduced]);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 overflow-hidden"
      aria-labelledby="cta-heading"
    >
      <div ref={bgRef} className="absolute inset-0 z-0">
        <Image
          src="/images/cta-background.jpg"
          alt=""
          fill
          className="object-cover opacity-15"
          aria-hidden="true"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, #FAF7F2 0%, #F0EBE3 100%)' }}
        />
      </div>

      <div ref={contentRef} className="container relative z-10 text-center max-w-3xl mx-auto space-y-8">
        <h2
          id="cta-heading"
          className="font-display text-5xl md:text-6xl font-light leading-tight"
        >
          Your craft deserves the world&apos;s attention.
        </h2>
        <p className="font-ui text-xl text-brand-muted leading-relaxed">
          Join 12,000+ artisans already selling on ALMS. Start with just a photo.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            href="/register?role=ARTISAN"
            className="px-10 py-4 rounded-lg text-white font-ui font-medium text-lg hover:opacity-90
              transition hover:-translate-y-1 duration-200"
            style={{ background: 'var(--color-accent)' }}
          >
            Start Selling Today
          </Link>
          <Link
            href="/explore"
            className="px-10 py-4 rounded-lg font-ui font-medium text-lg border-2 hover:-translate-y-1
              transition duration-200"
            style={{ borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }}
          >
            Browse Products
          </Link>
        </div>
        <p className="font-ui text-sm text-brand-muted">
          Free to register. No listing fees. Powered by the Ministry of Social Justice &amp; Empowerment.
        </p>
      </div>
    </section>
  );
}
