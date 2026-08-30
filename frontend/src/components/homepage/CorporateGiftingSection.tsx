'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Gift, Sparkles, Building2, Leaf, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

const GIFT_CATEGORIES = [
  {
    id: 'diaries',
    title: 'Handmade Ethnic Diaries & Stationery',
    desc: 'Crafted from tree-free cotton rag paper, bound with block-printed fabric and jute threads. Perfect for eco-conscious conferences.',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80&auto=format&fit=crop',
    tag: 'Sustainable Stationery',
    minOrder: '50 units',
    priceRange: '₹350 – ₹650',
  },
  {
    id: 'dokra',
    title: 'Dokra Lost-Wax Brass Artifacts',
    desc: 'Ancient 4,000-year-old non-ferrous tribal bell metal casting. Handcrafted mementos, pen holders, and ceremonial tribal figurines.',
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80&auto=format&fit=crop',
    tag: 'Bastar Tribal Metalwork',
    minOrder: '25 units',
    priceRange: '₹850 – ₹2,400',
  },
  {
    id: 'basketry',
    title: 'Sabai Grass & Natural Fiber Planters',
    desc: 'Braided by women artisans using natural river reeds, wild golden grass, and bamboo. Sturdy, biodegradable, and washable.',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80&auto=format&fit=crop',
    tag: 'Eco-Friendly Basketry',
    minOrder: '50 units',
    priceRange: '₹450 – ₹950',
  },
  {
    id: 'wallplates',
    title: 'Handpainted Tribal Wall Plates & Decor',
    desc: 'Ceramic & wooden wall art featuring authentic Warli, Gond, and Madhubani folk stories created with natural mineral pigments.',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&q=80&auto=format&fit=crop',
    tag: 'Folk Wall Decor',
    minOrder: '20 units',
    priceRange: '₹750 – ₹1,800',
  },
];

import FolkArtBanner from './FolkArtBanner';

export default function CorporateGiftingSection() {
  const [selectedGift, setSelectedGift] = useState(GIFT_CATEGORIES[0]);

  return (
    <section className="relative bg-[#24130A] text-white font-sans overflow-hidden">
      <div className="container py-20 md:py-28">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 mb-4 rounded-full">
              <Gift size={13} className="text-[#FA7A21]" />
              <span className="font-sans font-semibold text-amber-200 text-xs uppercase tracking-wider">Sustainable Corporate &amp; Institutional Gifting</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-light text-white leading-tight">
              Ethical Corporate Gifting<br />
              <em className="text-amber-200" style={{ fontStyle: 'italic' }}>
                With an Authentic Tribal Soul.
              </em>
            </h2>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed mt-3 font-light">
              Replace mass-produced plastic merchandise with bespoke handcrafted tribal art. Every gift box is customizable with your corporate logo and includes a verified maker story card.
            </p>
          </div>

          <Link
            href="/b2b/rfq"
            className="px-7 py-3.5 bg-[#FA7A21] hover:bg-[#e06917] text-white text-xs rounded-full font-semibold shadow-lg hover:shadow-orange-500/30 transition-all duration-200 inline-flex items-center gap-2 shrink-0"
          >
            <Building2 size={14} /> Request Custom Corporate Hamper Quote
          </Link>
        </div>

        {/* 4 Cards Grid Matching Screenshot 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {GIFT_CATEGORIES.map((gift) => (
            <div
              key={gift.id}
              onClick={() => setSelectedGift(gift)}
              className="bg-[#1C0E07] border border-white/15 border-t-4 border-t-[#FA7A21] overflow-hidden hover:shadow-2xl hover:border-white/40 transition-all duration-300 flex flex-col justify-between cursor-pointer group rounded-2xl"
            >
              <div>
                <div className="relative h-56 overflow-hidden bg-black/40">
                  <Image
                    src={gift.image}
                    alt={gift.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 25vw"
                    unoptimized
                  />
                  <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm text-amber-200 text-[10px] font-sans font-semibold px-2.5 py-1 rounded-md border border-white/10">
                    {gift.tag}
                  </div>
                  
                  {/* Quick View Frosted Pill Matching Screenshot 1 */}
                  <div className="absolute inset-x-4 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-black/75 backdrop-blur-md text-white text-xs font-semibold py-1.5 text-center rounded-lg border border-white/20">
                      View Bulk Spec
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-serif text-lg font-medium text-white leading-snug group-hover:text-amber-300 transition-colors">
                    {gift.title}
                  </h3>
                  <p className="text-xs text-stone-300 leading-relaxed font-light line-clamp-2">
                    {gift.desc}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-white/10 mt-3 pt-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-sans font-medium text-stone-400 text-[10px] uppercase tracking-wider">Bulk Range</p>
                  <p className="font-serif font-bold text-amber-300">{gift.priceRange}</p>
                </div>
                <div className="text-right">
                  <p className="font-sans font-medium text-stone-400 text-[10px] uppercase tracking-wider">MOQ</p>
                  <p className="font-medium text-stone-200">{gift.minOrder}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Corporate Trust Badges Strip */}
        <div className="p-6 bg-[#331B10]/90 border border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-stone-200 rounded-2xl">
          <div className="flex items-start gap-3">
            <ShieldCheck size={20} className="text-[#FA7A21] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-white">Custom Logo &amp; Brand Story</h4>
              <p className="text-stone-300 text-[11px] mt-0.5 font-light">Engrave your logo, custom packaging, and personalized greeting notes.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Leaf size={20} className="text-[#FA7A21] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-white">100% Eco-Friendly &amp; Plastic Free</h4>
              <p className="text-stone-300 text-[11px] mt-0.5 font-light">Recycled craft boxes, handmade paper ribbons, and zero single-use plastics.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Building2 size={20} className="text-[#FA7A21] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-white">Direct Cluster Livelihood Impact</h4>
              <p className="text-stone-300 text-[11px] mt-0.5 font-light">Includes artisan certificate authenticating heritage and community benefit.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Full-width Folk Art Banner on Bottom Matching Screenshot 1 */}
      <FolkArtBanner height={90} />
    </section>
  );
}
