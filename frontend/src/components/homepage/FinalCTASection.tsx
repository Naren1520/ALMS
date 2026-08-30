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
          src="https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=2000&q=85&auto=format&fit=crop"
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

          <div className="flex justify-center mb-2">
            <span
              className="font-sans font-semibold text-amber-200 uppercase tracking-widest text-xs px-4 py-1.5 bg-white/10 border border-white/20 rounded-full inline-block backdrop-blur-md"
            >
              Join the movement
            </span>
          </div>

          <h2
            id="cta-heading"
            className="font-serif text-white font-light"
            style={{ fontSize: 'clamp(2.5rem, 5.5vw, 5rem)', lineHeight: 1.05 }}
          >
            Your craft deserves<br />
            <em className="text-amber-200" style={{ fontStyle: 'italic' }}>
              the world&apos;s attention.
            </em>
          </h2>

          <p className="text-stone-200 leading-relaxed max-w-lg mx-auto font-sans font-light text-base sm:text-lg">
            Join 12,000+ artisans already empowered on ALMS.
            Start with just a smartphone photo &mdash; no e-commerce knowledge required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/register?role=ARTISAN"
              className="px-9 py-4 bg-[#FA7A21] hover:bg-[#e06917] text-white font-sans font-semibold text-sm rounded-full shadow-xl hover:shadow-orange-500/30 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <span>Start Selling Today</span>
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link
              href="/explore"
              className="px-9 py-4 bg-white/10 hover:bg-white/20 text-white font-sans font-medium text-sm rounded-full border border-white/30 backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>Browse Products</span>
            </Link>
          </div>

          <p className="text-stone-300 text-xs font-light">
            Free to register &bull; Zero listing fees &bull; Powered by Ministry of Social Justice &amp; Empowerment (Govt. of India)
          </p>
        </div>
      </div>
    </section>
  );
}

