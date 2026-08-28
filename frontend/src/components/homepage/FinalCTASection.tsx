'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ArrowRight } from 'lucide-react';

export default function FinalCTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bgRef      = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;
    let ctx: any;
    (async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        if (contentRef.current) {
          gsap.from(Array.from(contentRef.current.children), {
            opacity: 0, y: 36, stagger: 0.12, duration: 0.9, ease: 'expo.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
          });
        }
        gsap.to(bgRef.current, {
          y: '-8%',
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      });
    })();
    return () => ctx?.revert();
  }, [prefersReduced]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ paddingBlock: '140px' }}
      aria-labelledby="cta-heading"
    >
      {/* Full-bleed background image */}
      <div ref={bgRef} className="absolute inset-0 z-0 scale-110">
        <Image
          src="https://images.unsplash.com/photo-1504198266287-1659872e6590?w=2000&q=85&auto=format&fit=crop"
          alt=""
          fill
          className="object-cover object-center"
          aria-hidden="true"
          sizes="100vw"
          unoptimized
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(26,26,26,0.7) 0%, rgba(26,26,26,0.82) 100%)',
          }}
        />
      </div>

      <div className="container relative z-10 text-center">
        <div ref={contentRef} className="max-w-3xl mx-auto space-y-10">

          <div className="flex items-center justify-center gap-4">
            <span className="block w-12 h-px bg-gold/60" />
            <p className="overline text-gold/80" style={{ fontSize: '0.65rem' }}>
              Join the movement
            </p>
            <span className="block w-12 h-px bg-gold/60" />
          </div>

          <h2
            id="cta-heading"
            className="font-serif text-ivory"
            style={{ fontSize: 'clamp(2.5rem, 5.5vw, 5rem)', fontWeight: 300, lineHeight: 1.0 }}
          >
            Your craft deserves<br />
            <em className="text-gold-light" style={{ fontStyle: 'italic' }}>
              the world's attention.
            </em>
          </h2>

          <p className="text-stone-light leading-relaxed max-w-lg mx-auto" style={{ fontSize: '1.0625rem' }}>
            Join 12,000+ artisans already selling on ALMS.
            Start with just a photo — no e-commerce knowledge required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/register?role=ARTISAN"
              className="btn-gold flex items-center justify-center gap-2 px-10 py-4"
              style={{ fontSize: '0.8125rem' }}>
              Start Selling Today
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
            <Link href="/explore"
              className="btn-outline flex items-center justify-center gap-2 px-10 py-4"
              style={{
                borderColor: 'rgba(253,251,247,0.35)',
                color: 'var(--ivory)',
                fontSize: '0.8125rem',
              }}>
              Browse Products
            </Link>
          </div>

          <p className="text-stone-light/70 text-xs">
            Free to register. No listing fees. Powered by the Ministry of Social Justice &amp; Empowerment.
          </p>
        </div>
      </div>
    </section>
  );
}

