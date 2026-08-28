'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ArrowRight } from 'lucide-react';

const CRAFTS = [
  {
    name: 'Pashmina Weaving',
    region: 'Kashmir',
    img: 'https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=600&q=80&auto=format&fit=crop',
    wide: true,
  },
  {
    name: 'Madhubani Painting',
    region: 'Bihar',
    img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80&auto=format&fit=crop',
    wide: false,
  },
  {
    name: 'Dhokra Casting',
    region: 'Chhattisgarh',
    img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80&auto=format&fit=crop',
    wide: false,
  },
  {
    name: 'Chikankari',
    region: 'Lucknow',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&auto=format&fit=crop',
    wide: false,
  },
  {
    name: 'Warli Painting',
    region: 'Maharashtra',
    img: 'https://images.unsplash.com/photo-1504198266287-1659872e6590?w=600&q=80&auto=format&fit=crop',
    wide: false,
  },
  {
    name: 'Blue Pottery',
    region: 'Rajasthan',
    img: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80&auto=format&fit=crop',
    wide: true,
  },
];

export default function CraftDiscoveryGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef    = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;
    let ctx: any;
    (async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        if (headRef.current) {
          gsap.from(Array.from(headRef.current.children), {
            opacity: 0, y: 24, stagger: 0.1, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: headRef.current, start: 'top 80%' },
          });
        }
        const cards = sectionRef.current?.querySelectorAll<HTMLElement>('[data-craft-card]');
        if (cards) {
          gsap.from(Array.from(cards), {
            opacity: 0, y: 40, stagger: 0.1, duration: 0.8, ease: 'expo.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
          });
        }
      });
    })();
    return () => ctx?.revert();
  }, [prefersReduced]);

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-32"
      style={{ background: '#FDFBF7' }}
      aria-labelledby="discovery-heading"
    >
      <div className="container">

        {/* Header */}
        <div ref={headRef} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <p className="overline text-gold mb-4">Discover Crafts</p>
            <h2
              id="discovery-heading"
              className="font-serif text-charcoal"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)', fontWeight: 300 }}
            >
              India's living heritage
            </h2>
          </div>
          <Link
            href="/explore"
            className="flex items-center gap-2 overline text-charcoal hover:text-gold
              transition-colors duration-300 self-end pb-1"
            style={{ fontSize: '0.7rem' }}
          >
            View All Crafts <ArrowRight size={12} aria-hidden="true" />
          </Link>
        </div>

        {/* Mosaic grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {CRAFTS.map((craft, i) => (
            <article
              key={craft.name}
              data-craft-card
              className={`group relative overflow-hidden bg-cream cursor-pointer
                ${craft.wide ? 'md:col-span-2' : ''}
              `}
              style={{ aspectRatio: craft.wide ? '16/7' : '3/4' }}
              role="button"
              tabIndex={0}
              aria-label={`Explore ${craft.name} from ${craft.region}`}
              onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.click(); }}
            >
              {/* Background image */}
              <Image
                src={craft.img}
                alt={`${craft.name} — traditional craft from ${craft.region}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes={craft.wide ? '66vw' : '33vw'}
                unoptimized
              />

              {/* Dark overlay on hover */}
              <div
                className="absolute inset-0 transition-opacity duration-400"
                style={{
                  background: 'linear-gradient(to top, rgba(26,26,26,0.75) 0%, rgba(26,26,26,0.1) 50%, transparent 100%)',
                }}
              />

              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2
                group-hover:translate-y-0 transition-transform duration-400 ease-luxury">
                <h3
                  className="font-serif text-ivory font-light leading-tight"
                  style={{ fontSize: 'clamp(1rem, 1.5vw, 1.375rem)' }}
                >
                  {craft.name}
                </h3>
                <p className="overline text-gold-light mt-1 opacity-0 group-hover:opacity-100
                  transition-opacity duration-300" style={{ fontSize: '0.6rem' }}>
                  {craft.region}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

