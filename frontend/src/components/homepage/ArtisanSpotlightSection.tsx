'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const ARTISANS = [
  {
    name: 'Meera Devi',
    craft: 'Madhubani Painting',
    region: 'Mithila, Bihar',
    image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=600&q=80&auto=format&fit=crop&crop=face',
    quote: 'ALMS helped me sell to buyers in Germany without learning English.',
    tag: 'GI Certified',
  },
  {
    name: 'Rajan Sutar',
    craft: 'Dhokra Casting',
    region: 'Bastar, Chhattisgarh',
    image: 'https://images.unsplash.com/photo-1547612345-7f6e9f2bd6f6?w=600&q=80&auto=format&fit=crop&crop=face',
    quote: 'The AI wrote my entire catalog while I was in the workshop.',
    tag: 'Top Seller',
  },
  {
    name: 'Fatima Begum',
    craft: 'Chikankari Embroidery',
    region: 'Lucknow, UP',
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80&auto=format&fit=crop&crop=face',
    quote: 'My trust score helped me get bulk orders from three companies.',
    tag: 'UNESCO Heritage',
  },
];

export default function ArtisanSpotlightSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef   = useRef<(HTMLElement | null)[]>([]);
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
          y: 48,
          stagger: 0.15,
          duration: 0.9,
          ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
        });
      });
    })();
    return () => ctx?.revert();
  }, [prefersReduced]);

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-32"
      style={{ background: '#F5F0E8' }}
      aria-labelledby="spotlight-heading"
    >
      <div className="container">

        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <p className="overline text-gold mb-4">Artisan Spotlight</p>
            <h2
              id="spotlight-heading"
              className="font-serif text-charcoal"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)', fontWeight: 300 }}
            >
              The hands behind the craft
            </h2>
          </div>
          <p className="text-stone max-w-xs leading-relaxed" style={{ fontSize: '0.9375rem' }}>
            Real artisans, real stories. Meet the makers transforming India's craft economy.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {ARTISANS.map((artisan, i) => (
            <article
              key={artisan.name}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="group bg-ivory overflow-hidden shadow-sm card-lift"
            >
              {/* Image */}
              <div className="relative h-72 overflow-hidden">
                <Image
                  src={artisan.image}
                  alt={`${artisan.name} — ${artisan.craft} artisan from ${artisan.region}`}
                  fill
                  className="object-cover object-top transition-transform duration-700
                    group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  unoptimized
                />
                {/* Tag badge */}
                <span className="absolute top-4 left-4 bg-ivory/90 text-charcoal overline px-3 py-1.5"
                  style={{ fontSize: '0.6rem' }}>
                  {artisan.tag}
                </span>
              </div>

              {/* Body */}
              <div className="p-7">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-serif text-charcoal text-xl font-medium">
                      {artisan.name}
                    </h3>
                    <p className="overline text-gold mt-1" style={{ fontSize: '0.6rem' }}>
                      {artisan.craft}
                    </p>
                  </div>
                  <p className="text-stone-light text-xs mt-1">{artisan.region}</p>
                </div>
                <blockquote
                  className="text-stone leading-relaxed border-l-2 pl-4"
                  style={{ borderColor: 'var(--gold)', fontSize: '0.9375rem', fontStyle: 'italic' }}
                >
                  "{artisan.quote}"
                </blockquote>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

