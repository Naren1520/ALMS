'use client';

import Link from 'next/link';
import { TrendingUp, Clock, Users, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

import FolkArtBanner from './FolkArtBanner';

export default function ImpactPreviewSection() {
  return (
    <section className="relative bg-[#24130A] text-white border-t border-white/10 font-sans overflow-hidden">
      <div className="container py-24 md:py-32">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full mb-4">
            <ShieldCheck size={14} className="text-[#FA7A21]" />
            <span
              className="font-sans font-semibold text-amber-300 text-xs uppercase tracking-wider"
            >MoSJE Government Outcomes</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-light text-white mb-4">
            Measurable Livelihood Impact
          </h2>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-light">
            ALMS is designed for policy accountability. MoSJE administrators can track digital adoption, cataloguing time reduction, and direct household income generated across artisan clusters.
          </p>
        </div>

        {/* Before vs After ALMS Impact Matrix */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {/* Before ALMS */}
          <div className="bg-[#1C0E07] border border-red-500/30 p-6 sm:p-8 shadow-2xl space-y-4 rounded-3xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-serif text-xl font-medium text-red-300">Before ALMS (Status Quo)</h3>
              <span className="text-xs px-3 py-1 bg-red-900/40 text-red-300 font-semibold rounded-full border border-red-500/40">High Friction</span>
            </div>
            <ul className="space-y-3 text-xs text-stone-300">
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">&bull;</span>
                <span><strong>Catalogue Creation:</strong> ~120 mins requiring third-party computer operators</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">&bull;</span>
                <span><strong>Market Access:</strong> Restricted to seasonal fairs (Shilp Samagam, Dilli Haat)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">&bull;</span>
                <span><strong>B2B Linkage:</strong> 0 direct institutional buyer connections; dependent on opaque middlemen</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">&bull;</span>
                <span><strong>Price Realization:</strong> Sub-optimal distress sales due to lack of market pricing data</span>
              </li>
            </ul>
          </div>

          {/* After ALMS */}
          <div className="bg-[#1C0E07] border border-emerald-500/40 p-6 sm:p-8 shadow-2xl space-y-4 relative overflow-hidden rounded-3xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-serif text-xl font-medium text-emerald-300">After ALMS (Virtual Business Manager)</h3>
              <span className="text-xs px-3 py-1 bg-emerald-900/40 text-emerald-300 font-semibold rounded-full border border-emerald-500/40">Empowered</span>
            </div>
            <ul className="space-y-3 text-xs text-stone-200">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Catalogue Creation:</strong> <strong className="text-white">~3.5 mins</strong> via voice &amp; smartphone camera</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Market Access:</strong> 365-day digital visibility on ONDC &amp; B2B procurement networks</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>B2B Linkage:</strong> Automatic matching with corporate RFQs &amp; bulk capacity splitting</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Price Realization:</strong> Automated sustainable cost floor protecting artisan daily wages</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA to Full Impact Dashboard */}
        <div className="text-center">
          <Link
            href="/impact"
            className="px-8 py-4 bg-[#FA7A21] hover:bg-[#e06917] text-white font-sans font-semibold text-xs rounded-full shadow-lg hover:shadow-orange-500/25 transition-all duration-200 inline-flex items-center gap-2"
          >
            <span>View Live MoSJE Impact &amp; Pilot Metrics</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Folk Art Banner on Bottom */}
      <FolkArtBanner height={90} variant="border-4" />
    </section>
  );
}
