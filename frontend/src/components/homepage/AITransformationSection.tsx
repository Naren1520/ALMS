'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/** Section 5 — AI before/after image transformation with pin-and-scrub (Req 27.3) */
export default function AITransformationSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;
    let ctx: any;
    (async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        // Pin section and scrub overlay width
        gsap.fromTo(
          overlayRef.current,
          { width: '100%' },
          {
            width: '0%',
            ease: 'none',
            scrollTrigger: {
              trigger: pinRef.current,
              start: 'top top',
              end: '+=600',
              pin: true,
              scrub: 1,
            },
          },
        );
      });
    })();
    return () => ctx?.revert();
  }, [prefersReduced]);

  return (
    <section
      ref={sectionRef}
      className="py-24"
      style={{ background: 'var(--color-surface)' }}
      aria-labelledby="ai-transform-heading"
    >
      <div className="container mb-16 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-accent font-ui mb-4">AI Transformation</p>
        <h2 id="ai-transform-heading" className="font-display text-4xl md:text-5xl font-light">
          From phone photo to professional listing
        </h2>
        <p className="text-brand-muted font-ui mt-4 max-w-xl mx-auto">
          Our AI pipeline enhances every product image — background removal, lighting correction,
          upscaling — automatically. No photoshoot needed.
        </p>
      </div>

      <div ref={pinRef} className="relative mx-auto max-w-2xl h-96 rounded-2xl overflow-hidden">
        {/* Enhanced (after) */}
        <Image
          src="/images/product-after.jpg"
          alt="Professional enhanced product photo after AI transformation"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 672px"
        />
        {/* Original (before) — overlaid, scrubbed away */}
        <div
          ref={overlayRef}
          className="absolute inset-0 overflow-hidden"
          style={{ width: '100%' }}
          aria-hidden="true"
        >
          <div className="relative w-[672px] h-full">
            <Image
              src="/images/product-before.jpg"
              alt=""
              fill
              className="object-cover"
              sizes="672px"
            />
          </div>
        </div>

        {/* Labels */}
        <div className="absolute bottom-4 start-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full font-ui">
          Before
        </div>
        <div className="absolute bottom-4 end-4 bg-brand-accent text-white text-xs px-3 py-1 rounded-full font-ui">
          After AI Enhancement
        </div>
      </div>
    </section>
  );
}
