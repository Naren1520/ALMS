'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ArrowRight, Layers, CheckCircle2, ShieldCheck, TrendingUp, Users } from 'lucide-react';

export default function B2BSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
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
          if (textRef.current) {
            gsap.from(Array.from(textRef.current.children), {
              opacity: 0,
              y: 28,
              stagger: 0.1,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: { trigger: textRef.current, start: 'top 75%' },
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
      className="py-24 md:py-32 overflow-hidden bg-ivory-dark border-t border-border"
      aria-labelledby="b2b-matching-heading"
    >
      <div className="container grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Left: Interactive RFQ Capacity Matching Simulation */}
        <div className="bg-ivory border border-border p-6 sm:p-8 shadow-sm space-y-6" style={{ borderRadius: '28px' }}>
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div>
              <span
                className="font-sans font-semibold text-gold-dark"
                style={{ fontSize: '0.7rem', letterSpacing: '0.07em', textTransform: 'uppercase' }}
              >
                Real B2B Procurement Case
              </span>
              <h3 className="font-serif text-xl font-medium text-charcoal">Hotel Chain Bulk RFQ: 2,000 Baskets</h3>
            </div>
            <span className="text-[10px] bg-green-100 text-green-800 font-semibold px-3 py-1" style={{ borderRadius: '999px' }}>
              AI Match Engine: 97% Fit
            </span>
          </div>

          {/* Transparent Scoring Formula */}
          <div className="p-4 bg-cream/70 border border-border text-xs" style={{ borderRadius: '14px' }}>
            <p className="font-mono text-[11px] text-charcoal font-semibold mb-1">
              Deterministic Match Score:
            </p>
            <p className="font-mono text-[10px] text-stone leading-relaxed">
              0.30×Craft + 0.20×Capacity + 0.15×Price + 0.15×Delivery + 0.10×Fulfilment + 0.10×Reliability
            </p>
          </div>

          {/* Cluster Splitting Visualization */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-charcoal uppercase tracking-wider">
              Intelligent Capacity Splitting:
            </p>

            {/* Cluster A */}
            <div className="p-4 bg-white border border-border flex items-center justify-between shadow-xs" style={{ borderRadius: '18px' }}>
              <div>
                <p className="font-semibold text-xs text-charcoal">Bastar Bamboo Weavers Guild (Cluster A)</p>
                <p className="text-[11px] text-stone">Allocated: <strong>800 units</strong> &bull; Delivery: 25 Days &bull; Reliability: 94%</p>
              </div>
              <span className="text-xs font-serif font-bold text-gold">₹760 / unit</span>
            </div>

            {/* Cluster B */}
            <div className="p-4 bg-white border border-border flex items-center justify-between shadow-xs" style={{ borderRadius: '18px' }}>
              <div>
                <p className="font-semibold text-xs text-charcoal">Kondagaon Cane Collective (Cluster B)</p>
                <p className="text-[11px] text-stone">Allocated: <strong>1,200 units</strong> &bull; Delivery: 35 Days &bull; Reliability: 96%</p>
              </div>
              <span className="text-xs font-serif font-bold text-gold">₹790 / unit</span>
            </div>
          </div>

          {/* Summary */}
          <div className="pt-4 border-t border-border flex items-center justify-between text-xs">
            <span className="text-stone">Combined Target Met: <strong>2,000 / 2,000 Units</strong></span>
            <span className="font-serif text-sm font-bold text-charcoal">Total Value: ₹15,56,000</span>
          </div>
        </div>

        {/* Right: Text Narrative */}
        <div ref={textRef} className="space-y-8">
          <div>
            <div className="mb-5">
              <span
                className="font-sans font-semibold text-gold-dark text-xs px-4 py-1.5 bg-[#FA7A21]/15 border border-[#FA7A21]/30 rounded-full inline-block uppercase tracking-wider"
              >
                Intelligent B2B Linkage
              </span>
            </div>
            <h2
              id="b2b-matching-heading"
              className="font-serif text-charcoal leading-tight font-light"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)' }}
            >
              Solving Bulk Demand<br />
              <em className="text-[#FA7A21]" style={{ fontStyle: 'italic' }}>
                Without Overburdening Artisans.
              </em>
            </h2>
          </div>

          <p className="text-stone leading-relaxed text-base font-light">
            Individual rural artisans cannot fulfill a 5,000-unit corporate order alone. ALMS extracts structured requirements from natural-language B2B RFQs and transparently distributes volume across verified artisan clusters.
          </p>

          <ul className="space-y-3.5">
            {[
              'Algorithmic match scoring based on craft type, capacity, and lead-time',
              'Multi-cluster capacity splitting to fulfill large corporate and export orders',
              'Automated anti-exploitation price floor checks protecting rural margins',
              'Milestone-based PO tracking and transparent delivery reconciliation',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-stone-700 text-xs sm:text-sm">
                <CheckCircle2 size={16} className="text-[#FA7A21] mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/b2b/rfq"
              className="px-7 py-3.5 bg-[#FA7A21] hover:bg-[#e06917] text-white font-sans font-semibold text-xs rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
            >
              <span>Launch B2B RFQ Portal</span>
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
            <Link
              href="/explore"
              className="px-7 py-3.5 bg-white hover:bg-stone-50 border border-border hover:border-charcoal text-charcoal font-sans font-medium text-xs rounded-full shadow-xs transition-all duration-200 flex items-center gap-2"
            >
              <span>Browse Verified Clusters</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
