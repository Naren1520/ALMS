'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function CraftPhilosophySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef     = useRef<HTMLDivElement>(null);
  const textRef    = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;
    let ctx: any;
    (async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.to(imgRef.current, {
          y: '-12%',
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
        if (textRef.current) {
          gsap.from(Array.from(textRef.current.children), {
            opacity: 0,
            y: 32,
            stagger: 0.12,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: textRef.current, start: 'top 78%' },
          });
        }
      });
    })();
    return () => ctx?.revert();
  }, [prefersReduced]);

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-32 overflow-hidden"
      style={{ background: '#F5F0E8' }}
      aria-labelledby="philosophy-heading"
    >
      <div className="container grid md:grid-cols-2 gap-16 lg:gap-24 items-center">

        {/* Image column */}
        <div className="relative h-[520px] lg:h-[620px] overflow-hidden bg-cream">
          <div ref={imgRef} className="absolute inset-0 scale-110">
            <Image
              src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1200&q=85&auto=format&fit=crop"
              alt="Artisan hands shaping a clay vessel using traditional pottery techniques"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
              unoptimized
            />
          </div>
          {/* Gold accent bar */}
          <div className="absolute bottom-0 left-0 w-1 h-32 bg-gold" />
        </div>

        {/* Text column */}
        <div ref={textRef} className="space-y-8">
          <div>
            <p className="overline text-gold mb-4">Our Philosophy</p>
            <div className="w-10 h-px bg-gold mb-8" />
            <h2
              id="philosophy-heading"
              className="font-serif text-charcoal"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)', fontWeight: 300, lineHeight: 1.1 }}
            >
              Every thread tells a story<br />
              <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>
                300 years in the making.
              </em>
            </h2>
          </div>

          <p className="text-stone font-sans leading-relaxed" style={{ fontSize: '1.0625rem' }}>
            India's 7 million artisans carry forward traditions that are UNESCO-recognized,
            GI-tagged, and irreplaceable. ALMS gives them a digital voice — without
            requiring them to learn e-commerce.
          </p>
          <p className="text-stone font-sans leading-relaxed" style={{ fontSize: '1.0625rem' }}>
            Upload a photo. Speak in your language. Our AI handles photography, catalog writing,
            pricing, and global market discovery — automatically.
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-6 pt-4 border-t border-border">
            {[
              { stat: '7M+',       label: 'Artisans' },
              { stat: '3,000+',    label: 'Traditions' },
              { stat: '₹26,000 Cr',label: 'Export Value' },
            ].map(({ stat, label }) => (
              <div key={label}>
                <p
                  className="font-serif text-gold"
                  style={{ fontSize: 'clamp(1.5rem, 2vw, 2rem)', fontWeight: 400 }}
                >
                  {stat}
                </p>
                <p className="overline text-stone mt-1" style={{ fontSize: '0.6rem' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

