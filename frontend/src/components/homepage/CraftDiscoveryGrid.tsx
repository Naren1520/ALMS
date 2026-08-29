'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

const TRIBAL_CRAFTS = [
  {
    name: 'Dokra Lost-Wax Metal Art',
    region: 'Bastar, Chhattisgarh',
    category: 'Tribal Metallurgy',
    giTagged: true,
    img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80&auto=format&fit=crop',
    wide: true,
  },
  {
    name: 'Warli Folk Painting',
    region: 'Palghar, Maharashtra',
    category: 'Indigenous Murals',
    giTagged: true,
    img: 'https://images.unsplash.com/photo-1504198266287-1659872e6590?w=800&q=80&auto=format&fit=crop',
    wide: false,
  },
  {
    name: 'Sabai Grass & Reed Basketry',
    region: 'Mayurbhanj, Odisha',
    category: 'Sustainable Fibers',
    giTagged: false,
    img: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?w=800&q=80&auto=format&fit=crop',
    wide: false,
  },
  {
    name: 'Madhubani Sacred Canvas',
    region: 'Mithila, Bihar',
    category: 'Natural Pigment Art',
    giTagged: true,
    img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80&auto=format&fit=crop',
    wide: false,
  },
  {
    name: 'Gond Tribal Wildlife Art',
    region: 'Dindori, Madhya Pradesh',
    category: 'Folk Storytelling',
    giTagged: true,
    img: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&q=80&auto=format&fit=crop',
    wide: false,
  },
  {
    name: 'Jaipur Blue Pottery Glazes',
    region: 'Jaipur, Rajasthan',
    category: 'Clay-Free Ceramics',
    giTagged: true,
    img: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80&auto=format&fit=crop',
    wide: true,
  },
];

export default function CraftDiscoveryGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;
    let ctx: any;
    (async () => {
      try {
        const { gsap } = await import('gsap');
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        gsap.registerPlugin(ScrollTrigger);
        ctx = gsap.context(() => {
          if (headRef.current) {
            gsap.from(Array.from(headRef.current.children), {
              opacity: 0,
              y: 24,
              stagger: 0.1,
              duration: 0.7,
              ease: 'power3.out',
              scrollTrigger: { trigger: headRef.current, start: 'top 80%' },
            });
          }
        });
      } catch (e) {
        // fallback
      }
    })();
    return () => ctx?.revert();
  }, [prefersReduced]);

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-32 bg-ivory text-charcoal font-sans border-t border-border"
      aria-labelledby="tribal-crafts-heading"
    >
      <div className="container">
        {/* Header */}
        <div ref={headRef} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="mb-4">
              <span
                className="font-sans font-semibold text-gold-dark text-xs px-4 py-1.5 bg-[#FA7A21]/15 border border-[#FA7A21]/30 rounded-full inline-block uppercase tracking-wider"
              >
                Indigenous Masterpieces
              </span>
            </div>
            <h2
              id="tribal-crafts-heading"
              className="font-serif text-3xl sm:text-5xl font-light text-charcoal"
            >
              Curated Tribal &amp; Folk Traditions
            </h2>
            <p className="text-stone text-sm sm:text-base mt-2 max-w-xl font-light">
              From the deep forests of Bastar to the sacred walls of Mithila &mdash; certified authentic handicraft traditions.
            </p>
          </div>
          <Link
            href="/explore"
            className="px-6 py-3 bg-white hover:bg-stone-50 text-charcoal border border-border hover:border-charcoal transition-all duration-200 text-xs font-semibold rounded-full inline-flex items-center gap-2 shadow-xs shrink-0"
          >
            <span>Explore Complete Catalog</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Mosaic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TRIBAL_CRAFTS.map((craft) => (
            <Link
              key={craft.name}
              href={`/explore?craft=${encodeURIComponent(craft.name)}`}
              className={`group relative overflow-hidden bg-cream cursor-pointer border border-border shadow-xs hover:shadow-lg transition-all duration-300 ${
                craft.wide ? 'md:col-span-2 aspect-[16/8]' : 'aspect-[4/5]'
              }`}
              style={{ borderRadius: '24px' }}
            >
              {/* Image */}
              <Image
                src={craft.img}
                alt={craft.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes={craft.wide ? '66vw' : '33vw'}
                unoptimized
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent" />

              {/* GI Tag Badge */}
              {craft.giTagged && (
                <span className="absolute top-3.5 right-3.5 bg-ivory/95 backdrop-blur-sm text-charcoal text-[10px] font-semibold shadow-xs flex items-center gap-1 border border-border" style={{ padding: '0.3rem 0.7rem', borderRadius: '9999px' }}>
                  <ShieldCheck size={12} className="text-gold" />
                  GI Certified
                </span>
              )}

              {/* Bottom Card Content */}
              <div className="absolute bottom-0 inset-x-0 p-6 text-ivory space-y-1">
                <span className="font-sans font-semibold text-gold-light" style={{ fontSize: '0.7rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  {craft.category}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-light leading-snug group-hover:text-gold-light transition-colors">
                  {craft.name}
                </h3>
                <p className="text-xs text-stone-light">{craft.region}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
