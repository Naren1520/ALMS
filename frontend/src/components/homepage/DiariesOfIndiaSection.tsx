'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Leaf, ShieldCheck, Sparkles, Building2 } from 'lucide-react';
import FolkArtBanner from './FolkArtBanner';

export default function DiariesOfIndiaSection() {
  return (
    <section id="diaries-of-india" className="relative bg-[#2B1810] text-white">
      {/* Folk Art Banner on top matching Screenshot 4 */}
      <FolkArtBanner height={85} />

      <div className="container py-20 md:py-28">
        {/* Title matching Screenshot 4 */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-amber-200">
            <Sparkles size={13} className="text-[#FA7A21]" />
            <span>Master Artisan Cluster Spotlight</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-wider text-white uppercase">
            DIARIES OF INDIA
          </h2>
          <p className="text-stone-300 font-sans text-sm sm:text-base font-light max-w-xl mx-auto leading-relaxed">
            Timeless tales of folk artistry bound in sustainable, tree-free organic cotton rag paper crafted by verified Odisha &amp; Bihar artisan collectives.
          </p>
        </div>

        {/* Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center max-w-6xl mx-auto">
          {/* Left: Real Photo matching Screenshot 4 */}
          <div className="lg:col-span-6">
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-900/30 bg-[#3D2214]">
              <Image
                src="/images/diary_of_india.jpg"
                alt="Diaries of India - Pattachitra painting on handmade paper with jute tie and artisan story card"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-amber-200 text-xs font-sans font-semibold px-3.5 py-1.5 rounded-full border border-amber-400/20">
                Pattachitra Cluster &bull; GI Certified
              </div>
            </div>
          </div>

          {/* Right: Product Story & Specifications */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <span className="text-[#FA7A21] font-sans font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                <Sparkles size={14} />
                Sustainable Artisanal Stationery
              </span>
              <h3 className="font-serif text-2xl sm:text-4xl font-light text-white leading-tight">
                Handcrafted with Heart &amp; Verified Heritage
              </h3>
              <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-sans font-light">
                Each diary is individually hand-painted by women artisans in the Raghurajpur Craft Cluster. Pages are made from 100% upcycled cotton textile scraps &mdash; entirely tree-free, chemical-free, and digitally cataloged via the ALMS AI Studio.
              </p>
            </div>

            {/* Feature Bullets */}
            <div className="space-y-3 pt-2">
              {[
                { icon: Leaf, title: '100% Tree-Free Cotton Rag Paper', desc: 'Upcycled cotton fabric fibers with hand-deckled organic edges' },
                { icon: ShieldCheck, title: 'GI Certified Folk Painting Cover', desc: 'Pattachitra & Madhubani art painted with natural mineral dyes' },
                { icon: Building2, title: 'B2B & Corporate Customization', desc: 'Available with embossed company logo & custom story insert for events' },
              ].map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="flex items-start gap-3.5 p-3.5 bg-[#3D2214]/80 border border-white/10 rounded-2xl">
                    <div className="w-9 h-9 rounded-xl bg-[#FA7A21]/20 border border-[#FA7A21]/40 flex items-center justify-center text-[#FA7A21] shrink-0 mt-0.5">
                      <Icon size={18} />
                    </div>
                    <div>
                      <h4 className="font-sans font-semibold text-sm text-white">{f.title}</h4>
                      <p className="text-xs text-stone-300 font-light mt-0.5">{f.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/explore?craft=Pattachitra"
                className="px-7 py-3.5 bg-[#FA7A21] hover:bg-[#e06917] text-white font-sans font-semibold text-sm rounded-full shadow-lg transition-all duration-200 flex items-center gap-2"
              >
                <span>Explore Craft Products</span>
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/b2b/rfq"
                className="px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white font-sans font-medium text-sm rounded-full border border-white/20 transition-all duration-200"
              >
                <span>Bulk Corporate RFQ</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
