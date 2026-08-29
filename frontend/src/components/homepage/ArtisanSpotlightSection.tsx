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
      className="py-24 md:py-32 bg-[#F5F0E8] border-t border-border"
      aria-labelledby="spotlight-heading"
    >
      <div className="container">

        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="font-sans font-semibold text-gold-dark text-xs uppercase tracking-widest px-4 py-1.5 bg-[#FA7A21]/15 border border-[#FA7A21]/30 rounded-full inline-block mb-3">
              Artisan Voices &bull; Ground Stories
            </span>
            <h2
              id="spotlight-heading"
              className="font-serif text-charcoal"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)', fontWeight: 300 }}
            >
              The hands behind India&apos;s living heritage
            </h2>
          </div>
          <p className="text-stone max-w-xs leading-relaxed text-sm sm:text-base font-light">
            Real artisans, real stories. Meet the master makers transforming India&apos;s rural craft economy.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {ARTISANS.map((artisan, i) => (
            <article
              key={artisan.name}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="group bg-white overflow-hidden shadow-sm hover:shadow-xl hover:border-[#FA7A21]/40 border border-border transition-all duration-300 rounded-3xl flex flex-col justify-between"
            >
              <div>
                {/* Image */}
                <div className="relative h-72 overflow-hidden bg-cream">
                  <Image
                    src={artisan.image}
                    alt={`${artisan.name} — ${artisan.craft} artisan from ${artisan.region}`}
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    unoptimized
                  />
                  {/* Tag badge */}
                  <span className="absolute top-4 left-4 bg-black/75 backdrop-blur-md text-amber-200 text-[10px] font-sans font-semibold px-3 py-1 rounded-full border border-white/10 shadow-sm">
                    {artisan.tag}
                  </span>
                </div>

                {/* Body */}
                <div className="p-6 sm:p-7 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-serif text-charcoal text-xl font-medium">
                        {artisan.name}
                      </h3>
                      <p className="font-sans text-xs font-semibold text-[#FA7A21] uppercase tracking-wide mt-0.5">
                        {artisan.craft}
                      </p>
                    </div>
                    <p className="text-stone text-xs mt-0.5">{artisan.region}</p>
                  </div>
                  <blockquote
                    className="text-stone-700 leading-relaxed border-l-2 pl-4 text-xs sm:text-sm font-sans font-light italic"
                    style={{ borderColor: '#FA7A21' }}
                  >
                    &ldquo;{artisan.quote}&rdquo;
                  </blockquote>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

