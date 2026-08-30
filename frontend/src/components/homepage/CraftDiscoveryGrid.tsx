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
    img: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80&auto=format&fit=crop',
    wide: true,
  },
  {
    name: 'Warli Folk Painting',
    region: 'Palghar, Maharashtra',
    category: 'Indigenous Murals',
    giTagged: true,
    img: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&q=80&auto=format&fit=crop',
    wide: false,
  },
  {
    name: 'Sabai Grass & Reed Basketry',
    region: 'Mayurbhanj, Odisha',
    category: 'Sustainable Fibers',
    giTagged: false,
    img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80&auto=format&fit=crop',
    wide: false,
  },
  {
    name: 'Madhubani Sacred Canvas',
    region: 'Mithila, Bihar',
    category: 'Natural Pigment Art',
    giTagged: true,
    img: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&q=80&auto=format&fit=crop',
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
    img: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&q=80&auto=format&fit=crop',
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
      className="py-24 md:py-32 bg-[#3A4A1C] text-white font-sans border-t border-amber-950 relative overflow-hidden"
      style={{
        backgroundImage: `radial-gradient(#55692B 1.5px, transparent 1.5px), radial-gradient(#55692B 1.5px, #3A4A1C 1.5px)`,
        backgroundSize: `40px 40px`,
        backgroundPosition: `0 0, 20px 20px`
      }}
      aria-labelledby="tribal-crafts-heading"
    >
      <div className="container relative z-10">
        {/* Header */}
        <div ref={headRef} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="mb-4">
              <span
                className="font-sans font-semibold text-amber-200 text-xs px-4 py-1.5 bg-black/40 border border-white/20 rounded-full inline-block uppercase tracking-wider backdrop-blur-sm"
              >
                Indigenous Masterpieces
              </span>
            </div>
            <h2
              id="tribal-crafts-heading"
              className="font-serif text-3xl sm:text-5xl font-light text-white"
            >
              Curated Tribal &amp; Folk Traditions
            </h2>
            <p className="text-stone-200 text-sm sm:text-base mt-2 max-w-xl font-light">
              From the deep forests of Bastar to the sacred walls of Mithila &mdash; certified authentic handicraft traditions.
            </p>
          </div>
          <Link
            href="/explore"
            className="px-7 py-3.5 bg-white hover:bg-stone-100 text-[#24130A] transition-all duration-200 text-xs font-semibold rounded-full inline-flex items-center gap-2 shadow-lg shrink-0"
          >
            <span>Explore Complete Catalog</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Mosaic Grid Matching Screenshot 4 (White borders + frosted floating tag pill) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TRIBAL_CRAFTS.map((craft) => (
            <Link
              key={craft.name}
              href={`/explore?craft=${encodeURIComponent(craft.name)}`}
              className={`group relative overflow-hidden bg-black/40 cursor-pointer border-4 border-white shadow-2xl hover:shadow-green-950/60 transition-all duration-300 rounded-3xl ${
                craft.wide ? 'md:col-span-2 aspect-[16/9]' : 'aspect-[4/5]'
              }`}
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

              {/* GI Tag Badge */}
              {craft.giTagged && (
                <span className="absolute top-4 right-4 bg-black/80 backdrop-blur-md text-amber-200 text-[10px] font-semibold shadow-md flex items-center gap-1 border border-white/20 px-3 py-1 rounded-full">
                  <ShieldCheck size={12} className="text-[#FA7A21]" />
                  GI Certified
                </span>
              )}

              {/* Floating Category Pill Matching Screenshot 4 */}
              <div className="absolute bottom-5 inset-x-5 flex flex-col gap-1.5">
                <div className="bg-white/95 backdrop-blur-md text-[#24130A] py-2 px-4 rounded-xl shadow-lg flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#24130A] leading-snug">
                      {craft.name}
                    </h3>
                    <p className="text-[11px] text-stone-600 font-sans font-medium">{craft.region}</p>
                  </div>
                  <span className="text-[10px] font-sans font-semibold uppercase tracking-wider px-2.5 py-1 bg-amber-100 text-[#8B2500] rounded-lg shrink-0">
                    {craft.category}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
