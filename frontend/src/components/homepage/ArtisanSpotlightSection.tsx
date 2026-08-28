'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const ARTISANS = [
  {
    name: 'Meera Devi',
    craft: 'Madhubani Painting',
    region: 'Mithila, Bihar',
    image: '/images/artisans/meera.jpg',
    quote: 'ALMS helped me sell to buyers in Germany without learning English.',
  },
  {
    name: 'Rajan Sutar',
    craft: 'Dhokra Casting',
    region: 'Bastar, Chhattisgarh',
    image: '/images/artisans/rajan.jpg',
    quote: 'The AI wrote my entire catalog while I was in the workshop.',
  },
  {
    name: 'Fatima Begum',
    craft: 'Chikankari Embroidery',
    region: 'Lucknow, UP',
    image: '/images/artisans/fatima.jpg',
    quote: 'My trust score helped me get bulk orders from three companies.',
  },
];

/** Section 3 — Staggered card cascade with ≥3 rotating profiles (Req 27.3) */
export default function ArtisanSpotlightSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;
    let ctx: any;
    (async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.from(cardsRef.current.filter(Boolean), {
          opacity: 0,
          y: 60,
          scale: 0.95,
          stagger: 0.2,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        });
      });
    })();
    return () => ctx?.revert();
  }, [prefersReduced]);

  return (
    <section
      ref={sectionRef}
      className="py-24"
      style={{ background: 'var(--color-bg-primary)' }}
      aria-labelledby="spotlight-heading"
    >
      <div className="container">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-accent font-ui mb-4">
            Artisan Spotlight
          </p>
          <h2
            id="spotlight-heading"
            className="font-display text-4xl md:text-5xl font-light"
          >
            The hands behind the craft
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {ARTISANS.map((artisan, i) => (
            <div
              key={artisan.name}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              style={{ background: 'var(--color-surface)' }}
            >
              <div className="relative h-64">
                <Image
                  src={artisan.image}
                  alt={`${artisan.name} — ${artisan.craft} artisan from ${artisan.region}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-medium mb-1">{artisan.name}</h3>
                <p className="text-sm font-ui text-brand-accent mb-1">{artisan.craft}</p>
                <p className="text-sm font-ui text-brand-muted mb-4">{artisan.region}</p>
                <blockquote className="text-brand-muted font-ui text-sm italic leading-relaxed border-s-2 ps-4"
                  style={{ borderColor: 'var(--color-accent)' }}>
                  &ldquo;{artisan.quote}&rdquo;
                </blockquote>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
