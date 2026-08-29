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
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80&auto=format&fit=crop',
    tag: 'Bastar Tribal Metalwork',
    minOrder: '25 units',
    priceRange: '₹850 – ₹2,400',
  },
  {
    id: 'basketry',
    title: 'Sabai Grass & Natural Fiber Planters',
    desc: 'Braided by women artisans using natural river reeds, wild golden grass, and bamboo. Sturdy, biodegradable, and washable.',
    image: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?w=800&q=80&auto=format&fit=crop',
    tag: 'Eco-Friendly Basketry',
    minOrder: '50 units',
    priceRange: '₹450 – ₹950',
  },
  {
    id: 'wallplates',
    title: 'Handpainted Tribal Wall Plates & Decor',
    desc: 'Ceramic & wooden wall art featuring authentic Warli, Gond, and Madhubani folk stories created with natural mineral pigments.',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80&auto=format&fit=crop',
    tag: 'Folk Wall Decor',
    minOrder: '20 units',
    priceRange: '₹750 – ₹1,800',
  },
];

export default function CorporateGiftingSection() {
  const [selectedGift, setSelectedGift] = useState(GIFT_CATEGORIES[0]);

  return (
    <section className="py-24 md:py-32 bg-ivory border-t border-border font-sans text-charcoal">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold/10 border border-gold/25 mb-4" style={{ borderRadius: '9999px' }}>
              <Gift size={13} className="text-gold" />
              <span className="font-sans font-semibold text-gold-dark" style={{ fontSize: '0.72rem', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Sustainable Corporate &amp; Institutional Gifting</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-light text-charcoal leading-tight">
              Ethical Corporate Gifting<br />
              <em className="text-gold" style={{ fontStyle: 'italic' }}>
                With an Authentic Tribal Soul.
              </em>
            </h2>
            <p className="text-stone text-sm sm:text-base leading-relaxed mt-3">
              Replace mass-produced plastic merchandise with bespoke handcrafted tribal art. Every gift box is customizable with your corporate logo and includes a verified maker story card.
            </p>
          </div>

          <Link
            href="/b2b/rfq"
            className="btn-gold inline-flex items-center gap-2 text-xs py-3 px-6 shrink-0 font-semibold shadow-xs"
          >
            <Building2 size={14} /> Request Custom Corporate Hamper Quote
          </Link>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {GIFT_CATEGORIES.map((gift) => (
            <div
              key={gift.id}
              onClick={() => setSelectedGift(gift)}
              className="bg-ivory-dark border border-border overflow-hidden hover:shadow-lg hover:border-gold/50 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
              style={{ borderRadius: '24px' }}
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-cream">
                  <Image
                    src={gift.image}
                    alt={gift.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 25vw"
                    unoptimized
                  />
                  <div className="absolute top-3 left-3 bg-charcoal/90 text-ivory text-[10px] font-sans font-medium px-2.5 py-1 shadow-xs" style={{ borderRadius: '8px' }}>
                    {gift.tag}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-serif text-lg font-medium text-charcoal leading-snug group-hover:text-gold transition-colors">
                    {gift.title}
                  </h3>
                  <p className="text-xs text-stone leading-relaxed">
                    {gift.desc}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-border/60 mt-3 pt-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-sans font-medium text-stone-light" style={{ fontSize: '0.62rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Bulk Range</p>
                  <p className="font-serif font-bold text-gold">{gift.priceRange}</p>
                </div>
                <div className="text-right">
                  <p className="font-sans font-medium text-stone-light" style={{ fontSize: '0.62rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>MOQ</p>
                  <p className="font-medium text-charcoal">{gift.minOrder}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Corporate Trust Badges Strip */}
        <div className="p-6 bg-cream/70 border border-border grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-charcoal" style={{ borderRadius: '24px' }}>
          <div className="flex items-start gap-3">
            <ShieldCheck size={20} className="text-gold shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-charcoal">Custom Logo &amp; Brand Story</h4>
              <p className="text-stone text-[11px] mt-0.5">Engrave your logo, custom packaging, and personalized greeting notes.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Leaf size={20} className="text-gold shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-charcoal">100% Eco-Friendly &amp; Plastic Free</h4>
              <p className="text-stone text-[11px] mt-0.5">Recycled craft boxes, handmade paper ribbons, and zero single-use plastics.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Building2 size={20} className="text-gold shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-charcoal">Direct Cluster Livelihood Impact</h4>
              <p className="text-stone text-[11px] mt-0.5">Includes artisan certificate authenticating heritage and community benefit.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
