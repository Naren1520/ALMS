'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, Camera, Mic, Calculator, Gift, Home, BookOpen } from 'lucide-react';
import FolkArtBanner from './FolkArtBanner';

const ALMS_OFFERINGS = [
  {
    id: 'ai-studio',
    title: 'AI Image Studio & Lighting Correction',
    desc: 'Extracts products from messy rural mud floors and tin sheds into high-resolution white studio backgrounds with uniform lighting.',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80&auto=format&fit=crop',
    icon: Camera,
    tag: 'Zero-Hardware Studio',
    link: '/artisan/create-product',
  },
  {
    id: 'voice-catalog',
    title: 'Multilingual Voice Auto-Cataloger',
    desc: 'Artisans speak in 12+ native Indian dialects. Real-time translation automatically drafts structured English and Hindi product listings.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80&auto=format&fit=crop',
    icon: Mic,
    tag: '12+ Native Dialects',
    link: '/artisan/create-product',
  },
  {
    id: 'pricing-engine',
    title: 'Anti-Exploitation Price Engine',
    desc: 'Calculates raw materials, labour hours, and regional wage indices to establish a defensible price floor protecting artisan margins.',
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80&auto=format&fit=crop',
    icon: Calculator,
    tag: 'Fair Wage Protection',
    link: '/artisan/create-product',
  },
  {
    id: 'b2b-rfq',
    title: 'B2B RFQ Matching & Capacity Splitting',
    desc: 'Intelligently splits large corporate orders across verified artisan clusters, ensuring volume fulfillment without overburdening creators.',
    image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80&auto=format&fit=crop',
    icon: Gift,
    tag: 'Corporate & Bulk Linkage',
    link: '/b2b/rfq',
  },
];

export default function OfferingsSection() {
  return (
    <section id="offerings" className="relative bg-[#2B1810] text-white">
      {/* Folk Art Banner on top matching Screenshot 1 */}
      <FolkArtBanner height={85} />

      <div className="container py-20 md:py-28">
        {/* Main Section Heading */}
        <div className="text-center max-w-4xl mx-auto mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-xs text-amber-200">
            <ShieldCheck size={14} className="text-[#FA7A21]" />
            <span>ALMS Virtual Business Manager Core Architecture</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-white tracking-tight">
            Our Digital Offerings
          </h2>

          <p className="text-stone-100 font-sans text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mx-auto font-light">
            ALMS connects marginalized rural artisans with domestic consumers and global institutional buyers. By eliminating technical and literacy barriers through voice AI, image normalization, and automated ONDC payloads, we transform traditional craft into scalable digital commerce.
          </p>
        </div>

        {/* 4 Cards Grid with Rich Visuals */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ALMS_OFFERINGS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="group bg-[#3B2217]/90 border border-white/10 rounded-3xl overflow-hidden hover:border-[#FA7A21]/60 transition-all duration-300 flex flex-col justify-between shadow-xl hover:-translate-y-1"
              >
                <div>
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-black/30">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                    <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-sm text-amber-200 text-[10px] font-sans font-semibold px-3 py-1 rounded-full border border-white/10">
                      {item.tag}
                    </div>
                  </div>

                  <div className="p-6 space-y-2.5">
                    <div className="w-9 h-9 rounded-full bg-[#FA7A21]/20 border border-[#FA7A21]/40 flex items-center justify-center text-[#FA7A21]">
                      <Icon size={18} />
                    </div>
                    <h3 className="font-serif text-xl font-medium text-white group-hover:text-amber-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-stone-100 leading-relaxed font-sans font-light">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    href={item.link}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FA7A21] hover:text-amber-300 transition-colors"
                  >
                    <span>Launch Feature</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
