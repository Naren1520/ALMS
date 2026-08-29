'use client';

import Link from 'next/link';
import { TrendingUp, Clock, Users, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ImpactPreviewSection() {
  return (
    <section className="py-24 md:py-32 bg-ivory-dark border-t border-border font-sans text-charcoal">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/30 rounded-full mb-3">
            <ShieldCheck size={13} className="text-gold" />
            <span className="overline text-gold text-[11px]">MoSJE Government Outcomes</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-light text-charcoal mb-4">
            Measurable Livelihood Impact
          </h2>
          <p className="text-stone text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            ALMS is designed for policy accountability. MoSJE administrators can track digital adoption, cataloguing time reduction, and direct household income generated across artisan clusters.
          </p>
        </div>

        {/* Before vs After ALMS Impact Matrix */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {/* Before ALMS */}
          <div className="bg-ivory border border-red-200/60 p-6 sm:p-8 rounded-xl shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-serif text-xl font-medium text-red-900">Before ALMS (Status Quo)</h3>
              <span className="text-xs px-2.5 py-0.5 bg-red-100 text-red-700 font-semibold rounded">High Friction</span>
            </div>
            <ul className="space-y-3 text-xs text-stone">
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">&bull;</span>
                <span><strong>Catalogue Creation:</strong> ~120 mins requiring third-party computer operators</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">&bull;</span>
                <span><strong>Market Access:</strong> Restricted to seasonal fairs (Shilp Samagam, Dilli Haat)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">&bull;</span>
                <span><strong>B2B Linkage:</strong> 0 direct institutional buyer connections; dependent on opaque middlemen</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">&bull;</span>
                <span><strong>Price Realization:</strong> Sub-optimal distress sales due to lack of market pricing data</span>
              </li>
            </ul>
          </div>

          {/* After ALMS */}
          <div className="bg-ivory border border-green-300/80 p-6 sm:p-8 rounded-xl shadow-sm space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-serif text-xl font-medium text-green-950">After ALMS (Virtual Business Manager)</h3>
              <span className="text-xs px-2.5 py-0.5 bg-green-100 text-green-800 font-semibold rounded">Empowered</span>
            </div>
            <ul className="space-y-3 text-xs text-charcoal">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-green-600 shrink-0 mt-0.5" />
                <span><strong>Catalogue Creation:</strong> <strong>~3.5 mins</strong> via voice &amp; smartphone camera</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-green-600 shrink-0 mt-0.5" />
                <span><strong>Market Access:</strong> 365-day digital visibility on ONDC &amp; B2B procurement networks</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-green-600 shrink-0 mt-0.5" />
                <span><strong>B2B Linkage:</strong> Automatic matching with corporate RFQs &amp; bulk capacity splitting</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-green-600 shrink-0 mt-0.5" />
                <span><strong>Price Realization:</strong> Automated sustainable cost floor protecting artisan daily wages</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA to Full Impact Dashboard */}
        <div className="text-center">
          <Link href="/impact" className="btn-primary inline-flex items-center gap-2 text-xs py-3 px-8 font-semibold">
            View Live MoSJE Impact &amp; Pilot Metrics
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
