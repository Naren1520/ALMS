'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
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
  const [sustainableFilter, setSustainableFilter] = useState(true);
  const [rfqSubmitted, setRfqSubmitted] = useState(false);

  const matched = CLUSTERS.filter((c) => c.matchScore >= 80);
  const totalAllocated = matched.reduce((acc, curr) => acc + curr.allocatedUnits, 0);
  const totalEstimatedCost = matched.reduce((acc, curr) => acc + curr.allocatedUnits * curr.unitPrice, 0);
  const weightedUnitPrice = totalAllocated > 0 ? Math.round(totalEstimatedCost / totalAllocated) : 0;

  const isUnderBudget = targetBudget < 700;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-ivory text-charcoal pt-28 pb-24 font-sans">
        <div className="container max-w-5xl">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/30 rounded-full mb-3">
              <Building2 size={13} className="text-gold" />
              <span className="overline text-gold text-[11px]">Institutional &amp; Corporate Sourcing</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-light mb-3">
              Intelligent B2B RFQ Matching Engine
            </h1>
            <p className="text-stone text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              Submit bulk requirements. ALMS matches verified artisan clusters, enforces fair price floors, and algorithmically splits production capacity.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left: RFQ Submission Form (5 cols) */}
            <div className="lg:col-span-5 bg-ivory-dark border border-border p-6 sm:p-8 rounded-xl shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="font-serif text-lg font-medium text-charcoal">Submit Requirement</span>
                <span className="text-[10px] bg-gold/15 text-gold-dark font-semibold px-2.5 py-0.5 rounded">
                  Direct Cluster Link
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-charcoal mb-1">Requirement Title / Product</label>
                  <input
                    type="text"
                    value={rfqTitle}
                    onChange={(e) => setRfqTitle(e.target.value)}
                    className="w-full bg-white border border-border p-2.5 rounded text-xs text-charcoal focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-charcoal mb-1">Target Quantity (Units)</label>
                    <input
                      type="number"
                      value={targetQuantity}
                      onChange={(e) => setTargetQuantity(Number(e.target.value))}
                      className="w-full bg-white border border-border p-2.5 rounded text-xs text-charcoal focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-charcoal mb-1">Max Delivery Time (Days)</label>
                    <input
                      type="number"
                      value={maxLeadDays}
                      onChange={(e) => setMaxLeadDays(Number(e.target.value))}
                      className="w-full bg-white border border-border p-2.5 rounded text-xs text-charcoal focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-charcoal mb-1">Target Unit Price Budget (₹)</label>
                  <input
                    type="number"
                    value={targetBudget}
                    onChange={(e) => setTargetBudget(Number(e.target.value))}
                    className="w-full bg-white border border-border p-2.5 rounded text-xs text-charcoal focus:outline-none focus:border-gold"
                  />
                </div>

                {/* Anti-exploitation warning */}
                {isUnderBudget && (
                  <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 rounded flex items-start gap-2">
                    <AlertTriangle size={15} className="text-red-600 shrink-0 mt-0.5" />
                    <p className="text-[11px] leading-tight">
                      <strong>Price Floor Alert:</strong> Target of ₹{targetBudget} is below estimated sustainable production cost (₹710). Clusters may counter at ₹760–₹790.
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setRfqSubmitted(true)}
                  className="btn-gold w-full justify-center text-xs py-3 mt-2 cursor-pointer font-semibold shadow-xs"
                >
                  <Sparkles size={13} />
                  Run Matching &amp; Capacity Splitting
                </button>
              </div>
            </div>

            {/* Right: Algorithmic Match & Capacity Distribution (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Formula explanation box */}
              <div className="bg-ivory border border-border p-5 rounded-xl text-xs space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-charcoal uppercase tracking-wider text-[11px]">
                    Algorithmic Match Scoring Formula
                  </span>
                  <span className="text-[10px] text-stone-light">Deterministic Rules Engine</span>
                </div>
                <p className="font-mono text-[11px] text-stone bg-cream/70 p-2.5 rounded border border-border leading-relaxed">
                  Match Score = (0.30 × Craft) + (0.20 × Capacity) + (0.15 × Price) + (0.15 × Delivery) + (0.10 × Fulfilment) + (0.10 × Reliability)
                </p>
              </div>

              {/* Matched Clusters Capacity Splitting */}
              <div className="bg-ivory-dark border border-border p-6 rounded-xl space-y-4 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="font-serif text-lg font-medium text-charcoal">
                    Recommended Multi-Cluster Allocation
                  </h3>
                  <span className="text-xs text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded font-semibold flex items-center gap-1">
                    <CheckCircle2 size={12} /> 100% Demand Met
                  </span>
                </div>

                <div className="space-y-3">
                  {matched.map((cluster) => (
                    <div key={cluster.id} className="p-4 bg-white border border-border rounded-lg space-y-2 shadow-xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-xs text-charcoal">{cluster.name}</p>
                          <p className="text-[11px] text-stone">{cluster.state} &bull; Reliability: {cluster.reliabilityScore}% &bull; Max: {cluster.maxMonthlyCapacity} units/mo</p>
                        </div>
                        <span className="text-xs font-serif font-bold text-gold">
                          Match: {cluster.matchScore}%
                        </span>
                      </div>

                      {/* Capacity bar */}
                      <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
                        <span className="text-stone">Allocated: <strong className="text-charcoal">{cluster.allocatedUnits} units</strong> ({cluster.deliveryDays} Days)</span>
                        <span className="font-medium text-charcoal">₹{cluster.unitPrice} / unit</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Procurement Order Summary */}
                <div className="pt-4 border-t border-border grid grid-cols-3 gap-3 text-center text-xs">
                  <div className="p-2.5 bg-cream/70 rounded">
                    <p className="overline text-stone-light text-[10px]">Total Units</p>
                    <p className="font-serif text-base font-bold text-charcoal">{totalAllocated}</p>
                  </div>
                  <div className="p-2.5 bg-cream/70 rounded">
                    <p className="overline text-stone-light text-[10px]">Avg Unit Price</p>
                    <p className="font-serif text-base font-bold text-gold">₹{weightedUnitPrice}</p>
                  </div>
                  <div className="p-2.5 bg-cream/70 rounded">
                    <p className="overline text-stone-light text-[10px]">Total Order Value</p>
                    <p className="font-serif text-base font-bold text-charcoal">₹{totalEstimatedCost.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => alert('Purchase Order draft generated and transmitted to Bastar & Kondagaon cluster supervisors via ONDC B2B network!')}
                  className="btn-primary w-full justify-center text-xs py-3 mt-2 cursor-pointer font-semibold"
                >
                  Generate Multi-Cluster Purchase Order <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
