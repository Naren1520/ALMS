'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import FolkArtBanner from './FolkArtBanner';

const ARTISANS = [
  {
    name: 'Meera Devi',
    craft: 'Madhubani Painting',
    region: 'Mithila, Bihar',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80&auto=format&fit=crop',
    quote: 'ALMS helped me sell to buyers in Germany without learning English.',
    tag: 'GI Certified',
  },
  {
    name: 'Rajan Sutar',
    craft: 'Dhokra Casting',
    region: 'Bastar, Chhattisgarh',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&auto=format&fit=crop',
    quote: 'The AI wrote my entire catalog while I was in the workshop.',
    tag: 'Top Seller',
  },
  {
    name: 'Fatima Begum',
    craft: 'Chikankari Embroidery',
    region: 'Lucknow, UP',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80&auto=format&fit=crop',
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
      className="relative bg-[#24130A] text-white border-t border-white/10 overflow-hidden"
      aria-labelledby="spotlight-heading"
    >
      <div className="container py-24 md:py-32">

        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="font-sans font-semibold text-amber-300 text-xs uppercase tracking-widest px-4 py-1.5 bg-white/10 border border-white/20 rounded-full inline-block mb-3">
              Artisan Voices &bull; Ground Stories
            </span>
            <h2
              id="spotlight-heading"
              className="font-serif text-white text-3xl sm:text-5xl font-light"
            >
              The hands behind India&apos;s living heritage
            </h2>
          </div>
          <p className="text-stone-300 max-w-xs leading-relaxed text-sm sm:text-base font-light">
            Real artisans, real stories. Meet the master makers transforming India&apos;s rural craft economy.
          </p>
        </div>

        {/* Cards matching Screenshot 1 */}
        <div className="grid md:grid-cols-3 gap-8">
          {ARTISANS.map((artisan, i) => (
            <article
              key={artisan.name}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="group bg-[#1C0E07] overflow-hidden shadow-2xl hover:border-white/40 border border-white/15 border-t-4 border-t-[#FA7A21] transition-all duration-300 rounded-3xl flex flex-col justify-between"
            >
              <div>
                {/* Image */}
                <div className="relative h-72 overflow-hidden bg-black/40">
                  <Image
                    src={artisan.image}
                    alt={`${artisan.name} — ${artisan.craft} artisan from ${artisan.region}`}
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    unoptimized
                  />
                  {/* Tag badge */}
                  <span className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-amber-200 text-[10px] font-sans font-semibold px-3 py-1 rounded-full border border-white/10 shadow-sm">
                    {artisan.tag}
                  </span>
                </div>

                {/* Body */}
                <div className="p-6 sm:p-7 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-serif text-white text-xl font-medium">
                        {artisan.name}
                      </h3>
                      <p className="font-sans text-xs font-semibold text-amber-300 uppercase tracking-wide mt-0.5">
                        {artisan.craft}
                      </p>
                    </div>
                    <p className="text-stone-400 text-xs mt-0.5">{artisan.region}</p>
                  </div>
                  <blockquote
                    className="text-stone-200 leading-relaxed border-l-2 pl-4 text-xs sm:text-sm font-sans font-light italic"
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

      {/* Folk Art Banner on Bottom matching Screenshot 1 */}
      <FolkArtBanner height={90} />
    </section>
  );
}

