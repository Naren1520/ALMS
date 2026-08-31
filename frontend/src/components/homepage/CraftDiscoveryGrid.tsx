'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, Compass, MapPin } from 'lucide-react';

const TRIBAL_CRAFTS = [
  {
    name: 'Dokra Lost-Wax Metal Art',
    region: 'Bastar, Chhattisgarh',
    category: 'Tribal Metallurgy',
    giTagged: true,
    img: '/images/dokra_metal_art.jpg',
    wide: true,
    desc: '4,000-year-old non-ferrous lost-wax bell metal casting by Bastar indigenous tribes.',
  },
  {
    name: 'Warli Folk Painting',
    region: 'Palghar, Maharashtra',
    category: 'Indigenous Murals',
    giTagged: true,
    img: '/images/warli_folk_painting.jpg',
    wide: false,
    desc: 'Ancient rhythmic circle dance murals rendered with rice paste on terracotta.',
  },
  {
    name: 'Sabai Grass & Reed Basketry',
    region: 'Mayurbhanj, Odisha',
    category: 'Sustainable Fibers',
    giTagged: false,
    img: '/images/sabai_grass_basketry.jpg',
    wide: false,
    desc: 'Hand-braided natural golden wild grass and sustainable forest reeds.',
  },
  {
    name: 'Madhubani Sacred Canvas',
    region: 'Mithila, Bihar',
    category: 'Natural Pigment Art',
    giTagged: true,
    img: '/images/madhubani_sacred_canvas.jpg',
    wide: false,
    desc: 'Intricate Tree of Life motifs hand-rendered with natural mineral and plant dyes.',
  },
  {
    name: 'Gond Tribal Wildlife Art',
    region: 'Dindori, Madhya Pradesh',
    category: 'Folk Storytelling',
    giTagged: true,
    img: '/images/gond_wildlife_art.jpg',
    wide: false,
    desc: 'Intricate dot-and-line sacred mythology celebrating coexistence with nature.',
  },
];

export default function CraftDiscoveryGrid() {
  return (
    <section
      className="py-24 md:py-32 bg-[#1C0E07] text-white font-sans border-t border-white/10 relative overflow-hidden"
      style={{
        backgroundImage: `
          radial-gradient(circle at 10% 20%, rgba(250, 122, 33, 0.08) 0%, transparent 40%),
          radial-gradient(circle at 90% 80%, rgba(217, 119, 6, 0.06) 0%, transparent 45%),
          repeating-linear-gradient(90deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 40px),
          repeating-linear-gradient(0deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 40px)
        `,
      }}
      aria-labelledby="tribal-crafts-heading"
    >
      {/* Subtle ambient heritage glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#FA7A21]/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="container relative z-10 space-y-14">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FA7A21]/15 border border-[#FA7A21]/30 rounded-full">
              <Compass size={13} className="text-[#FA7A21]" />
              <span className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
                Indigenous Masterpieces
              </span>
            </div>
            <h2
              id="tribal-crafts-heading"
              className="font-serif text-3xl sm:text-5xl font-light text-white leading-tight"
            >
              Curated Tribal &amp; Folk Traditions
            </h2>
            <p className="text-stone-300 text-sm sm:text-base font-light leading-relaxed">
              From the deep forest hearths of Bastar to the sacred courtyards of Mithila &mdash; certified authentic craft clusters with direct artisan provenance.
            </p>
          </div>

          <Link
            href="/explore"
            className="px-7 py-3.5 bg-gradient-to-r from-[#FA7A21] via-orange-500 to-amber-500 hover:from-[#e06917] hover:to-orange-600 text-white font-semibold text-xs rounded-full shadow-lg shadow-orange-500/20 transition-all duration-300 hover:shadow-orange-500/40 hover:-translate-y-0.5 inline-flex items-center gap-2.5 shrink-0"
          >
            <span>Explore Complete Catalog</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Mosaic Grid with Premium Glassmorphism & Hover Lighting */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {TRIBAL_CRAFTS.map((craft) => (
            <Link
              key={craft.name}
              href={`/explore?craft=${encodeURIComponent(craft.name)}`}
              className={`group relative overflow-hidden bg-[#24130A] cursor-pointer border border-white/15 hover:border-[#FA7A21]/70 shadow-2xl hover:shadow-[#FA7A21]/10 transition-all duration-500 rounded-3xl flex flex-col justify-end no-underline ${
                craft.wide ? 'md:col-span-2 aspect-[16/9]' : 'aspect-[4/5]'
              }`}
            >
              {/* Main Image */}
              <Image
                src={craft.img}
                alt={craft.name}
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes={craft.wide ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
              />

              {/* Dynamic Gradient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#140803] via-[#140803]/40 to-transparent group-hover:via-[#140803]/25 transition-all duration-500" />

              {/* Top Bar Badges */}
              <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none">
                {craft.giTagged ? (
                  <span className="bg-[#1C0E07]/85 backdrop-blur-md text-amber-300 text-[11px] font-medium shadow-lg flex items-center gap-1.5 border border-amber-500/30 px-3 py-1 rounded-full">
                    <ShieldCheck size={13} className="text-[#FA7A21]" />
                    GI Certified Heritage
                  </span>
                ) : (
                  <span className="bg-[#1C0E07]/85 backdrop-blur-md text-stone-200 text-[11px] font-medium shadow-lg flex items-center gap-1.5 border border-white/15 px-3 py-1 rounded-full">
                    <Sparkles size={13} className="text-amber-400" />
                    Verified Rural Cluster
                  </span>
                )}

                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#FA7A21] text-white p-2 rounded-full shadow-md">
                  <ArrowRight size={14} />
                </span>
              </div>

              {/* Bottom Frosted Card Overlay */}
              <div className="relative p-5 sm:p-6 m-3 sm:m-4 bg-[#1C0E07]/90 backdrop-blur-md rounded-2xl border border-white/15 group-hover:border-white/30 transition-all duration-300 shadow-xl space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl font-medium text-white group-hover:text-amber-200 transition-colors leading-snug">
                      {craft.name}
                    </h3>
                    <p className="text-xs text-stone-300 font-sans flex items-center gap-1.5 mt-1 font-light">
                      <MapPin size={12} className="text-[#FA7A21] shrink-0" />
                      <span>{craft.region}</span>
                    </p>
                  </div>
                  <span className="text-[10px] font-sans font-semibold uppercase tracking-wider px-3 py-1 bg-[#FA7A21]/15 text-amber-300 border border-[#FA7A21]/30 rounded-lg shrink-0">
                    {craft.category}
                  </span>
                </div>
                <p className="text-xs text-stone-300/90 font-light leading-relaxed line-clamp-1 group-hover:line-clamp-2 transition-all">
                  {craft.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
