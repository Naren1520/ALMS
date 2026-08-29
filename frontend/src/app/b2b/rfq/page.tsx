'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Layers, ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight, Sparkles, Building2, Calculator } from 'lucide-react';

interface MatchedCluster {
  id: string;
  name: string;
  state: string;
  allocatedUnits: number;
  maxMonthlyCapacity: number;
  unitPrice: number;
  deliveryDays: number;
  reliabilityScore: number;
  sustainableCostFloor: number;
  matchScore: number;
}

const CLUSTERS: MatchedCluster[] = [
  {
    id: 'cluster-1',
    name: 'Bastar Tribal Weavers Cooperative',
    state: 'Chhattisgarh',
    allocatedUnits: 800,
    maxMonthlyCapacity: 950,
    unitPrice: 760,
    deliveryDays: 25,
    reliabilityScore: 94,
    sustainableCostFloor: 680,
    matchScore: 96,
  },
  {
    id: 'cluster-2',
    name: 'Kondagaon Natural Cane Collective',
    state: 'Chhattisgarh',
    allocatedUnits: 1200,
    maxMonthlyCapacity: 1400,
    unitPrice: 790,
    deliveryDays: 35,
    reliabilityScore: 96,
    sustainableCostFloor: 710,
    matchScore: 94,
  },
  {
    id: 'cluster-3',
    name: 'Bidar Heritage Crafts Guild',
    state: 'Karnataka',
    allocatedUnits: 0,
    maxMonthlyCapacity: 600,
    unitPrice: 920,
    deliveryDays: 45,
    reliabilityScore: 98,
    sustainableCostFloor: 840,
    matchScore: 78,
  },
];

export default function B2BRfqPage() {
  const [rfqTitle, setRfqTitle] = useState('2,000 Eco-Friendly Handwoven Storage Baskets for Hotel Rooms');
  const [targetQuantity, setTargetQuantity] = useState<number>(2000);
  const [targetBudget, setTargetBudget] = useState<number>(800);
  const [maxLeadDays, setMaxLeadDays] = useState<number>(45);
  const [rfqSubmitted, setRfqSubmitted] = useState(false);

  const matched = CLUSTERS.filter((c) => c.matchScore >= 80);
  const totalAllocated = matched.reduce((acc, curr) => acc + curr.allocatedUnits, 0);
  const totalEstimatedCost = matched.reduce((acc, curr) => acc + curr.allocatedUnits * curr.unitPrice, 0);
  const weightedUnitPrice = totalAllocated > 0 ? Math.round(totalEstimatedCost / totalAllocated) : 0;
  const isUnderBudget = targetBudget < 700;

  return (
    <>
      <Navbar />

      {/* Dark Hero Banner */}
      <section
        className="relative min-h-[45vh] flex items-center overflow-hidden pt-20"
        style={{ background: 'linear-gradient(135deg, #1A0D06 0%, #2B1810 60%, #1A0D06 100%)' }}
      >
        <div className="absolute inset-0 opacity-15"
          style={{ backgroundImage: 'radial-gradient(circle at 15% 50%, #FA7A21 0%, transparent 50%), radial-gradient(circle at 85% 25%, #B8965A 0%, transparent 40%)' }}
        />
        <div className="container relative z-10 py-16 md:py-20">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs text-amber-200">
              <Building2 size={14} className="text-[#FA7A21]" />
              <span className="font-sans font-medium tracking-wide">Institutional & Corporate Sourcing &bull; ONDC B2B Network</span>
            </div>
            <h1
              className="font-serif text-white font-normal"
              style={{ fontSize: 'clamp(2.25rem, 5vw, 4rem)', lineHeight: 1.08, letterSpacing: '-0.015em' }}
            >
              Intelligent B2B RFQ<br />
              <em className="font-light text-amber-200" style={{ fontStyle: 'italic' }}>Matching &amp; Capacity Engine.</em>
            </h1>
            <p className="text-white font-sans text-base font-light max-w-2xl leading-relaxed">
              Submit bulk requirements. ALMS matches verified artisan clusters, enforces anti-exploitation fair price floors, and algorithmically splits production capacity across regional cooperatives.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-white/15">
              {[
                { n: '78.4%', l: 'RFQ Conversion Rate' },
                { n: '< 2 min', l: 'Cluster Matching Time' },
                { n: '100%', l: 'Fair Wage Enforced' },
              ].map(({ n, l }) => (
                <div key={l}>
                  <p className="font-serif text-amber-200 text-xl sm:text-2xl font-light">{n}</p>
                  <p className="text-white text-[11px] font-sans mt-0.5">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main className="bg-[#2B1810] text-white font-sans pb-0 min-h-screen">
        <div className="container max-w-6xl py-14">

          <ScrollReveal className="grid lg:grid-cols-12 gap-8 items-start" delay={0.1}>
            {/* Left: RFQ Submission Form */}
            <div className="lg:col-span-5 bg-[#1C0E07] border border-white/10 p-6 sm:p-8 rounded-2xl shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h2 className="font-serif text-2xl font-light text-white">Submit Requirement</h2>
                  <p className="text-xs text-stone-300 font-light mt-0.5">Direct institutional cluster linkage</p>
                </div>
                <span className="text-[10px] bg-[#FA7A21]/20 text-amber-300 font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-[#FA7A21]/30">
                  MoSJE Verified
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-stone-100 mb-1.5 uppercase tracking-wider">
                    Requirement Title / Product Type
                  </label>
                  <input
                    type="text"
                    value={rfqTitle}
                    onChange={(e) => setRfqTitle(e.target.value)}
                    className="w-full bg-black/30 border border-white/15 p-3 rounded-xl text-xs text-white focus:outline-none focus:border-[#FA7A21]/60 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-100 mb-1.5 uppercase tracking-wider">
                      Target Quantity (Units)
                    </label>
                    <input
                      type="number"
                      value={targetQuantity}
                      onChange={(e) => setTargetQuantity(Number(e.target.value))}
                      className="w-full bg-black/30 border border-white/15 p-3 rounded-xl text-xs text-white focus:outline-none focus:border-[#FA7A21]/60 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-100 mb-1.5 uppercase tracking-wider">
                      Max Lead Time (Days)
                    </label>
                    <input
                      type="number"
                      value={maxLeadDays}
                      onChange={(e) => setMaxLeadDays(Number(e.target.value))}
                      className="w-full bg-black/30 border border-white/15 p-3 rounded-xl text-xs text-white focus:outline-none focus:border-[#FA7A21]/60 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-100 mb-1.5 uppercase tracking-wider">
                    Target Unit Price Budget (₹)
                  </label>
                  <input
                    type="number"
                    value={targetBudget}
                    onChange={(e) => setTargetBudget(Number(e.target.value))}
                    className="w-full bg-black/30 border border-white/15 p-3 rounded-xl text-xs text-white focus:outline-none focus:border-[#FA7A21]/60 transition-colors"
                  />
                </div>

                {/* Anti-exploitation warning */}
                {isUnderBudget && (
                  <div className="p-4 bg-red-900/30 border border-red-700/40 text-red-300 rounded-xl flex items-start gap-2.5">
                    <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
                    <p className="text-xs leading-relaxed">
                      <strong>Price Floor Alert:</strong> Target of ₹{targetBudget} is below estimated sustainable cost (₹710). Clusters may counter at ₹760–₹790.
                    </p>
                  </div>
                )}

                {rfqSubmitted && (
                  <div className="p-4 bg-green-900/30 border border-green-700/40 text-green-300 rounded-xl flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-green-400 shrink-0 mt-0.5" />
                    <p className="text-xs leading-relaxed">
                      RFQ submitted. Matching engine has scored all 3 clusters below.
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setRfqSubmitted(true)}
                  className="w-full py-3.5 px-6 bg-[#FA7A21] hover:bg-[#e06917] text-white font-semibold text-xs rounded-full shadow-md hover:shadow-orange-500/25 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer mt-3"
                >
                  <Sparkles size={14} />
                  <span>Run Matching &amp; Capacity Splitting</span>
                </button>
              </div>
            </div>

            {/* Right: Algorithmic Match & Capacity Distribution */}
            <div className="lg:col-span-7 space-y-6">
              {/* Formula explanation box */}
              <div className="bg-[#24130A] border border-amber-900/30 text-white p-6 rounded-2xl space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-amber-200 uppercase tracking-wider text-xs flex items-center gap-2">
                    <Calculator size={14} className="text-[#FA7A21]" />
                    Deterministic Match Scoring Formula
                  </span>
                  <span className="text-[10px] text-stone-300 font-medium">ONDC B2B Engine</span>
                </div>
                <p className="font-mono text-xs text-amber-100 bg-black/30 p-3.5 rounded-xl border border-white/10 leading-relaxed">
                  Score = (0.30 × Craft) + (0.20 × Capacity) + (0.15 × Price) + (0.15 × Delivery) + (0.10 × Fulfilment) + (0.10 × Reliability)
                </p>
              </div>

              {/* Matched Clusters Capacity Splitting */}
              <div className="bg-[#1C0E07] border border-white/10 p-6 sm:p-8 rounded-2xl space-y-5 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
                  <h3 className="font-serif text-2xl font-light text-white">
                    Recommended Multi-Cluster Allocation
                  </h3>
                  <span className="text-xs text-green-400 bg-green-900/40 border border-green-700/40 px-3 py-1 rounded-full font-semibold flex items-center gap-1.5 self-start sm:self-auto">
                    <CheckCircle2 size={14} className="text-green-400" /> 100% Demand Met
                  </span>
                </div>

                <div className="space-y-4">
                  {matched.map((cluster) => (
                    <div key={cluster.id} className="p-5 bg-[#24130A] border border-amber-900/30 rounded-xl space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-sm text-white">{cluster.name}</p>
                          <p className="text-xs text-stone-200 mt-0.5">
                            {cluster.state} &bull; Reliability: <strong className="text-[#FA7A21]">{cluster.reliabilityScore}%</strong> &bull; Max: {cluster.maxMonthlyCapacity} units/mo
                          </p>
                        </div>
                        <span className="text-xs font-serif font-semibold text-amber-200 bg-[#FA7A21]/15 border border-[#FA7A21]/30 px-2.5 py-1 rounded-full shrink-0">
                          {cluster.matchScore}% Match
                        </span>
                      </div>
                      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                        <span className="text-stone-200">Allocated: <strong className="text-white font-bold">{cluster.allocatedUnits} units</strong> ({cluster.deliveryDays} Days)</span>
                        <span className="font-bold text-[#FA7A21]">₹{cluster.unitPrice} / unit</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Procurement Order Summary */}
                <div className="pt-4 border-t border-white/10 grid grid-cols-3 gap-3 text-center text-xs">
                  <div className="p-4 bg-black/30 rounded-xl border border-white/10">
                    <p className="text-[9px] uppercase font-bold tracking-wider text-stone-300">Total Units</p>
                    <p className="font-serif text-xl font-light text-white mt-1">{totalAllocated.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="p-4 bg-[#FA7A21]/15 rounded-xl border border-[#FA7A21]/30">
                    <p className="text-[9px] uppercase font-bold tracking-wider text-[#FA7A21]">Avg Unit Price</p>
                    <p className="font-serif text-xl font-semibold text-[#FA7A21] mt-1">₹{weightedUnitPrice}</p>
                  </div>
                  <div className="p-4 bg-black/30 rounded-xl border border-white/10">
                    <p className="text-[9px] uppercase font-bold tracking-wider text-stone-300">Total Order Value</p>
                    <p className="font-serif text-xl font-light text-white mt-1">₹{totalEstimatedCost.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => alert('Purchase Order draft transmitted to Bastar & Kondagaon cluster supervisors via ONDC B2B network!')}
                  className="w-full py-4 px-6 bg-[#FA7A21] hover:bg-[#e06917] text-white font-semibold text-xs rounded-full shadow-md hover:shadow-orange-500/25 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>Generate Multi-Cluster Purchase Order</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </main>
      <Footer />
    </>
  );
}
