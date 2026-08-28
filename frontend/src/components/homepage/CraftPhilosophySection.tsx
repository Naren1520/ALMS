'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/** Section 2 — Craft Philosophy with parallax image movement (Req 27.3) */
export default function CraftPhilosophySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;
    let ctx: any;
    (async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        // Parallax image — moves slower than scroll
        gsap.to(imgRef.current, {
          y: '-15%',
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        });

        // Text fade-in
        gsap.from(textRef.current?.children ?? [], {
          opacity: 0,
          y: 30,
          stagger: 0.15,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 80%',
          },
        });
      });
    })();
    return () => ctx?.revert();
  }, [prefersReduced]);

  return (
    <section
      ref={sectionRef}
      className="py-24 overflow-hidden"
      style={{ background: 'var(--color-surface)' }}
      aria-labelledby="philosophy-heading"
    >
      <div className="container grid md:grid-cols-2 gap-16 items-center">
        <div ref={imgRef} className="relative h-[500px] rounded-2xl overflow-hidden">
          <Image
            src="/images/craft-philosophy.jpg"
            alt="Artisan hands shaping a clay vessel using traditional pottery techniques"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <div ref={textRef} className="space-y-6">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-accent font-ui">
            Our Philosophy
          </p>
          <h2
            id="philosophy-heading"
            className="font-display text-4xl md:text-5xl font-light leading-tight"
          >
            Every thread tells a story 300 years in the making.
          </h2>
          <p className="text-brand-muted text-lg leading-relaxed font-ui">
            India&apos;s 7 million artisans carry forward traditions that are UNESCO-recognized,
            GI-tagged, and irreplaceable. ALMS gives them a digital voice — without requiring
            them to learn e-commerce.
          </p>
          <p className="text-brand-muted text-lg leading-relaxed font-ui">
            Upload a photo. Speak in your language. Our AI handles photography,
            catalog writing, pricing, and global market discovery.
          </p>
          <div className="grid grid-cols-3 gap-6 pt-4">
            {[
              { stat: '7M+', label: 'Artisans in India' },
              { stat: '3,000+', label: 'Craft traditions' },
              { stat: '₹26,000 Cr', label: 'Export potential' },
            ].map(({ stat, label }) => (
              <div key={label} className="text-center">
                <p className="font-display text-3xl font-medium" style={{ color: 'var(--color-accent)' }}>
                  {stat}
                </p>
                <p className="text-sm text-brand-muted font-ui mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
