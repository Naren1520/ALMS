'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FolkArtBanner from '@/components/homepage/FolkArtBanner';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import Link from 'next/link';
import {
  Building2,
  Sparkles,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  FileText,
  Check,
  Download,
  Truck,
  Users,
  Award,
  Clock,
  Layers,
  RotateCcw,
  BadgePercent,
  CheckCircle,
} from 'lucide-react';

interface MatchedCluster {
  id: string;
  name: string;
  state: string;
  district: string;
  allocatedUnits: number;
  maxMonthlyCapacity: number;
  unitPrice: number;
  deliveryDays: number;
  reliabilityScore: number;
  sustainableCostFloor: number;
  matchScore: number;
  artisansCount: number;
  giCertified: boolean;
}

const PRESET_DEMANDS = [
  {
    label: 'Dokra Brass Sculptures',
    title: '2,000 Bastar Bell Metal Statuettes for Corporate Diwali Gifting',
    qty: 2000,
    budget: 780,
    leadDays: 35,
    city: 'Bengaluru',
    state: 'Karnataka',
  },
  {
    label: 'Blue Pottery Sets',
    title: '1,200 Cobalt Blue Floral Ceramic Dinnerware Sets for Luxury Resort',
    qty: 1200,
    budget: 850,
    leadDays: 30,
    city: 'Jaipur',
    state: 'Rajasthan',
  },
  {
    label: 'Mithila Silk Scarves',
    title: '3,000 Hand-Painted Tussar Silk Scarves for International Summit',
    qty: 3000,
    budget: 920,
    leadDays: 45,
    city: 'New Delhi',
    state: 'Delhi',
  },
  {
    label: 'Kashmir Cashmere Shawls',
    title: '500 Authentic GI-Certified Pashmina Stoles for Export Consignment',
    qty: 500,
    budget: 2200,
    leadDays: 60,
    city: 'Mumbai',
    state: 'Maharashtra',
  },
];

const INITIAL_CLUSTERS: MatchedCluster[] = [
  {
    id: 'cluster-1',
    name: 'Bastar Tribal Weavers & Brass Guild',
    state: 'Chhattisgarh',
    district: 'Bastar',
    allocatedUnits: 800,
    maxMonthlyCapacity: 1200,
    unitPrice: 760,
    deliveryDays: 25,
    reliabilityScore: 96,
    sustainableCostFloor: 680,
    matchScore: 96,
    artisansCount: 42,
    giCertified: true,
  },
  {
    id: 'cluster-2',
    name: 'Kondagaon Cane & Dokra SHG Federation',
    state: 'Chhattisgarh',
    district: 'Kondagaon',
    allocatedUnits: 800,
    maxMonthlyCapacity: 1000,
    unitPrice: 790,
    deliveryDays: 30,
    reliabilityScore: 94,
    sustainableCostFloor: 710,
    matchScore: 92,
    artisansCount: 38,
    giCertified: true,
  },
  {
    id: 'cluster-3',
    name: 'Jagdalpur Metalcraft Cooperative',
    state: 'Chhattisgarh',
    district: 'Jagdalpur',
    allocatedUnits: 400,
    maxMonthlyCapacity: 600,
    unitPrice: 810,
    deliveryDays: 35,
    reliabilityScore: 91,
    sustainableCostFloor: 730,
    matchScore: 88,
    artisansCount: 24,
    giCertified: false,
  },
];

function B2BRfqContent() {
  const searchParams = useSearchParams();
  const paramTitle = searchParams.get('title');
  const paramQty = searchParams.get('qty');
  const paramPrice = searchParams.get('price');
  const paramCraft = searchParams.get('craft') || searchParams.get('category');
  const paramArtisan = searchParams.get('artisan');

  // Pipeline Step State: 1 = Demand Config, 2 = Cluster Allocation, 3 = Escrow Terms, 4 = Live PO Dashboard
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Demand Form State
  const [rfqTitle, setRfqTitle] = useState(
    paramTitle
      ? `Procurement for ${paramTitle}`
      : paramCraft
      ? `Bulk Sourcing for ${paramCraft} (${paramArtisan || 'Verified Guild'})`
      : '2,000 Bastar Bell Metal Statuettes for Corporate Diwali Gifting'
  );
  const [targetQuantity, setTargetQuantity] = useState<number>(paramQty ? parseInt(paramQty) : 2000);
  const [targetBudget, setTargetBudget] = useState<number>(paramPrice ? parseInt(paramPrice) : 780);
  const [maxLeadDays, setMaxLeadDays] = useState<number>(35);
  const [deliveryCity, setDeliveryCity] = useState<string>('Bengaluru');
  const [deliveryState, setDeliveryState] = useState<string>('Karnataka');

  // Cluster Allocation State
  const [clusters, setClusters] = useState<MatchedCluster[]>(INITIAL_CLUSTERS);
  const [customizingCluster, setCustomizingCluster] = useState(false);

  // Live Production State (Step 4)
  const [advancePaid, setAdvancePaid] = useState<boolean>(false);
  const [qcAuditScheduled, setQcAuditScheduled] = useState<boolean>(false);
  const [poTrackingId] = useState<string>(() => `ONDC-B2B-PO-${Math.floor(10000 + Math.random() * 90000)}`);

  // Dynamically update cluster allocations when quantity changes
  useEffect(() => {
    if (paramTitle) setRfqTitle(`Procurement for ${paramTitle}`);
    if (paramQty) setTargetQuantity(parseInt(paramQty));
    if (paramPrice) setTargetBudget(parseInt(paramPrice));
  }, [paramTitle, paramQty, paramPrice]);

  useEffect(() => {
    // Proportional AI distribution based on cluster throughput
    const c1 = Math.round(targetQuantity * 0.4);
    const c2 = Math.round(targetQuantity * 0.4);
    const c3 = targetQuantity - (c1 + c2);
    setClusters((prev) => [
      { ...prev[0], allocatedUnits: c1 },
      { ...prev[1], allocatedUnits: c2 },
      { ...prev[2], allocatedUnits: Math.max(0, c3) },
    ]);
  }, [targetQuantity]);

  const totalAllocated = useMemo(() => clusters.reduce((acc, c) => acc + c.allocatedUnits, 0), [clusters]);
  const totalEstimatedCost = useMemo(() => clusters.reduce((acc, c) => acc + c.allocatedUnits * c.unitPrice, 0), [clusters]);
  const weightedUnitPrice = totalAllocated > 0 ? Math.round(totalEstimatedCost / totalAllocated) : 0;
  const totalArtisansEmployed = useMemo(() => clusters.reduce((acc, c) => acc + c.artisansCount, 0), [clusters]);
  const isUnderBudget = targetBudget < 700;

  function handleClusterAllocationChange(index: number, val: number) {
    const next = [...clusters];
    next[index].allocatedUnits = Math.max(0, val);
    setClusters(next);
  }

  function downloadPOJson() {
    const poData = {
      purchaseOrderId: poTrackingId,
      timestamp: new Date().toISOString(),
      specification: rfqTitle,
      totalQuantity: totalAllocated,
      weightedUnitPrice: `₹${weightedUnitPrice}`,
      totalContractValue: `₹${totalEstimatedCost}`,
      deliveryTimeline: `${maxLeadDays} Days`,
      destination: `${deliveryCity}, ${deliveryState}`,
      participatingClusters: clusters.map((c) => ({
        guildName: c.name,
        region: `${c.district}, ${c.state}`,
        allocatedUnits: c.allocatedUnits,
        unitCost: `₹${c.unitPrice}`,
        clusterTotal: `₹${c.allocatedUnits * c.unitPrice}`,
      })),
      escrowStructure: {
        milestone1_advance_30pct: `₹${Math.round(totalEstimatedCost * 0.3)}`,
        milestone2_qc_pass_40pct: `₹${Math.round(totalEstimatedCost * 0.4)}`,
        milestone3_delivery_30pct: `₹${Math.round(totalEstimatedCost * 0.3)}`,
      },
    };
    const blob = new Blob([JSON.stringify(poData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${poTrackingId}-manifest.json`;
    a.click();
  }

  return (
    <>
      <Navbar />

      {/* Hero Banner */}
      <section
        className="relative min-h-[40vh] flex items-center overflow-hidden pt-20"
        style={{ background: 'linear-gradient(135deg, #1A0D06 0%, #2B1810 60%, #1A0D06 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              'radial-gradient(circle at 15% 50%, #FA7A21 0%, transparent 50%), radial-gradient(circle at 85% 25%, #B8965A 0%, transparent 40%)',
          }}
        />
        <div className="container relative z-10 py-12 md:py-16">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs text-amber-200">
              <Building2 size={14} className="text-[#FA7A21]" />
              <span className="font-sans font-medium tracking-wide">
                Institutional B2B Procurement Engine &bull; ONDC Multi-Cluster Network
              </span>
            </div>
            <h1
              className="font-serif text-white font-normal"
              style={{ fontSize: 'clamp(2.25rem, 5vw, 3.75rem)', lineHeight: 1.1, letterSpacing: '-0.015em' }}
            >
              Multi-Cluster B2B RFQ<br />
              <em className="font-light text-amber-200" style={{ fontStyle: 'italic' }}>
                Capacity Aggregation &amp; Escrow Engine.
              </em>
            </h1>
            <p className="text-white font-sans text-sm font-light max-w-2xl leading-relaxed">
              Institutional buyers can source 500 to 10,000+ handcrafted units. ALMS automatically aggregates production capacity across regional SHG clusters with living-wage compliance and milestone-based smart contracts.
            </p>
          </div>
        </div>
      </section>

      {/* Heritage Folk Art Ribbon Divider */}
      <FolkArtBanner height={75} variant="border-2" alt="Indian heritage tapestry border" />

      {/* Progressive Step Progress Bar */}
      <nav aria-label="RFQ Pipeline Stages" className="bg-[#1C0E07] border-y border-white/10 sticky top-16 md:top-20 z-40">
        <div className="container max-w-7xl mx-auto px-4 py-3.5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            {[
              { num: 1, label: '1. Demand Specification', sub: 'Volume & Budget Floor' },
              { num: 2, label: '2. Cluster Capacity Match', sub: 'Algorithmic Distribution' },
              { num: 3, label: '3. Escrow Terms Review', sub: '3-Stage Milestone Terms' },
              { num: 4, label: '4. Active PO Dashboard', sub: 'ONDC Live Production' },
            ].map((step) => {
              const isActive = currentStep === step.num;
              const isDone = currentStep > step.num;
              return (
                <button
                  type="button"
                  key={step.num}
                  onClick={() => {
                    if (isDone || step.num <= currentStep) setCurrentStep(step.num);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isActive
                      ? 'bg-[#FA7A21]/20 border-[#FA7A21] text-white shadow-lg'
                      : isDone
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                      : 'bg-black/30 border-white/10 text-white opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-semibold">
                    {isDone ? <CheckCircle2 size={13} className="text-emerald-400 shrink-0" /> : null}
                    <span className="truncate">{step.label}</span>
                  </div>
                  <p className="text-[10px] text-white truncate mt-0.5">{step.sub}</p>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Multi-Stage Workspace */}
      <main className="bg-[#24130A] text-white py-12 font-sans min-h-[60vh]">
        <div className="container max-w-7xl mx-auto px-4">
          <ScrollReveal>
            {/* ═════════════════════════════════════════════════════════════════ */}
            {/* STAGE 1: DEMAND SPECIFICATION & FAIR PRICE FLOOR                */}
            {/* ═════════════════════════════════════════════════════════════════ */}
            {currentStep === 1 && (
              <div className="grid lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 bg-[#1C0E07] border border-white/10 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6">
                  <div className="border-b border-white/10 pb-4">
                    <span className="text-[11px] uppercase tracking-wider text-[#FA7A21] font-semibold">Stage 1 of 4</span>
                    <h2 className="font-serif text-2xl font-light text-white mt-1">Configure Bulk Demand Specification</h2>
                    <p className="text-xs text-white mt-1">
                      Select a standard institutional template or customize custom craft dimensions, volume, and target budget.
                    </p>
                  </div>

                  {/* Preset Selector */}
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300">Quick Institutional Templates:</span>
                    <div className="grid grid-cols-2 gap-2">
                      {PRESET_DEMANDS.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            setRfqTitle(preset.title);
                            setTargetQuantity(preset.qty);
                            setTargetBudget(preset.budget);
                            setMaxLeadDays(preset.leadDays);
                            setDeliveryCity(preset.city);
                            setDeliveryState(preset.state);
                          }}
                          className="p-3 bg-black/40 border border-white/10 hover:border-[#FA7A21]/60 hover:bg-[#FA7A21]/10 rounded-xl text-left transition-all text-xs cursor-pointer group"
                        >
                          <p className="font-semibold text-white group-hover:text-amber-200">{preset.label}</p>
                          <p className="text-[11px] text-white mt-0.5">{preset.qty} units &bull; ₹{preset.budget}/u</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block font-semibold text-white mb-1.5 uppercase tracking-wider">
                        Procurement Project Title
                      </label>
                      <input
                        type="text"
                        value={rfqTitle}
                        onChange={(e) => setRfqTitle(e.target.value)}
                        className="w-full p-3.5 bg-black/40 border border-white/15 rounded-xl text-xs text-white placeholder:text-white focus:outline-none focus:border-[#FA7A21]/60 transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-white mb-1.5 uppercase tracking-wider">
                          Required Quantity (Units)
                        </label>
                        <input
                          type="number"
                          value={targetQuantity}
                          onChange={(e) => setTargetQuantity(Math.max(100, Number(e.target.value)))}
                          min={100}
                          step={50}
                          className="w-full p-3.5 bg-black/40 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-[#FA7A21]/60 transition-colors font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-white mb-1.5 uppercase tracking-wider">
                          Target Budget (₹ / Unit)
                        </label>
                        <input
                          type="number"
                          value={targetBudget}
                          onChange={(e) => setTargetBudget(Math.max(100, Number(e.target.value)))}
                          min={100}
                          step={25}
                          className="w-full p-3.5 bg-black/40 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-[#FA7A21]/60 transition-colors font-mono font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block font-semibold text-white uppercase tracking-wider">
                          Max Permitted Delivery Timeline
                        </label>
                        <span className="text-amber-200 font-mono font-bold">{maxLeadDays} Calendar Days</span>
                      </div>
                      <input
                        type="range"
                        min={15}
                        max={90}
                        step={5}
                        value={maxLeadDays}
                        onChange={(e) => setMaxLeadDays(Number(e.target.value))}
                        className="w-full accent-[#FA7A21] cursor-pointer"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-white mb-1.5 uppercase tracking-wider">Delivery City</label>
                        <input
                          type="text"
                          value={deliveryCity}
                          onChange={(e) => setDeliveryCity(e.target.value)}
                          className="w-full p-3.5 bg-black/40 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-[#FA7A21]/60"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-white mb-1.5 uppercase tracking-wider">Destination State</label>
                        <input
                          type="text"
                          value={deliveryState}
                          onChange={(e) => setDeliveryState(e.target.value)}
                          className="w-full p-3.5 bg-black/40 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-[#FA7A21]/60"
                        />
                      </div>
                    </div>

                    {isUnderBudget && (
                      <div className="p-3.5 bg-amber-950/50 border border-amber-500/50 rounded-xl text-amber-200 text-xs flex items-start gap-2.5">
                        <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                        <span>
                          Target ₹{targetBudget} is close to the living-wage floor (₹700). ALMS multi-cluster matching will ensure artisan artisans receive fair compensation.
                        </span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="w-full py-4 px-6 bg-[#FA7A21] hover:bg-[#e06917] text-white font-semibold text-xs rounded-full shadow-lg hover:shadow-orange-500/25 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer mt-4"
                    >
                      <Sparkles size={15} />
                      <span>Run Multi-Cluster Capacity Matching Engine</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Right: AI Matching Principles & Instant Estimator */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-[#1C0E07] border border-white/10 p-6 sm:p-7 rounded-3xl shadow-xl space-y-4">
                    <div className="flex items-center gap-2 text-amber-200">
                      <Calculator size={18} className="text-[#FA7A21]" />
                      <h3 className="font-serif text-lg font-normal text-white">Estimated Sourcing Economics</h3>
                    </div>
                    <div className="space-y-2.5 text-xs text-white">
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span>Total Requirement Volume:</span>
                        <span className="font-mono text-white font-bold">{targetQuantity.toLocaleString('en-IN')} units</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span>Estimated Gross Contract:</span>
                        <span className="font-mono text-[#FA7A21] font-bold">
                          ₹{(targetQuantity * targetBudget).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span>Artisans Employed:</span>
                        <span className="font-mono text-emerald-400 font-bold">~104 Master Artisans &amp; Apprentices</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span>Compliance Standard:</span>
                        <span className="text-amber-300 font-medium">MoSJE Living Wage &amp; GI Verified</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/40 border border-white/10 p-6 rounded-3xl space-y-3 text-xs">
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold uppercase tracking-wider text-[10px]">
                      <ShieldCheck size={14} /> Anti-Exploitation Floor Guarantee
                    </div>
                    <p className="text-white leading-relaxed">
                      ALMS algorithmically disallows buyer predatory bidding below standard labor and raw material benchmarks. All orders are backed by an automated 3-stage milestone escrow smart contract.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ═════════════════════════════════════════════════════════════════ */}
            {/* STAGE 2: CLUSTER CAPACITY MATCHING & SPLIT MATRIX                */}
            {/* ═════════════════════════════════════════════════════════════════ */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="bg-[#1C0E07] border border-white/10 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-[#FA7A21] font-semibold">Stage 2 of 4</span>
                      <h2 className="font-serif text-2xl sm:text-3xl font-light text-white mt-1">
                        Algorithmic Multi-Cluster Allocation Matrix
                      </h2>
                      <p className="text-xs text-white mt-1">
                        Demand of <strong className="text-white">{targetQuantity} units</strong> split across 3 verified cooperatives for zero delivery bottleneck.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCustomizingCluster(!customizingCluster)}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold rounded-full transition-all cursor-pointer"
                      >
                        {customizingCluster ? 'Lock Allocation' : 'Customize Quotas'}
                      </button>
                    </div>
                  </div>

                  {/* Cluster Cards */}
                  <div className="grid md:grid-cols-3 gap-4">
                    {clusters.map((cluster, idx) => (
                      <div
                        key={cluster.id}
                        className="p-5 bg-[#24130A] border border-amber-900/40 hover:border-[#FA7A21]/60 rounded-2xl space-y-4 shadow-lg transition-all"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-[#FA7A21] bg-[#FA7A21]/10 px-2 py-0.5 rounded-md">
                              {cluster.state}
                            </span>
                            <h3 className="font-serif text-lg text-white font-normal mt-1 leading-snug">{cluster.name}</h3>
                            <p className="text-[11px] text-white mt-0.5">{cluster.district} Cluster &bull; {cluster.artisansCount} Artisans</p>
                          </div>
                          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded-lg border border-emerald-500/40">
                            {cluster.matchScore}% Match
                          </span>
                        </div>

                        <div className="p-3 bg-black/40 border border-white/10 rounded-xl space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-white">Allocated Quota:</span>
                            <span className="font-mono text-white font-bold">{cluster.allocatedUnits} units</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white">Unit Price:</span>
                            <span className="font-mono text-[#FA7A21] font-bold">₹{cluster.unitPrice}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white">Monthly Throughput:</span>
                            <span className="font-mono text-white">{cluster.maxMonthlyCapacity} units/mo</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white">Delivery Lead:</span>
                            <span className="font-mono text-white">{cluster.deliveryDays} Days</span>
                          </div>
                        </div>

                        {customizingCluster && (
                          <div className="space-y-1">
                            <label className="block text-[10px] uppercase font-bold text-white">
                              Adjust Quota: {cluster.allocatedUnits}
                            </label>
                            <input
                              type="range"
                              min={0}
                              max={targetQuantity}
                              step={50}
                              value={cluster.allocatedUnits}
                              onChange={(e) => handleClusterAllocationChange(idx, Number(e.target.value))}
                              className="w-full accent-[#FA7A21] cursor-pointer"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Summary Strip */}
                  <div className="p-5 bg-black/40 border border-white/15 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                    <div className="flex flex-wrap items-center gap-6">
                      <div>
                        <p className="text-[10px] uppercase text-white">Total Allocated Units</p>
                        <p className="font-mono text-lg font-bold text-white mt-0.5">{totalAllocated} / {targetQuantity}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-white">Weighted Average Unit Cost</p>
                        <p className="font-mono text-lg font-bold text-[#FA7A21] mt-0.5">₹{weightedUnitPrice} / unit</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-white">Total Estimated Contract</p>
                        <p className="font-mono text-lg font-bold text-emerald-400 mt-0.5">₹{totalEstimatedCost.toLocaleString('en-IN')}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="py-3 px-5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs rounded-full transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <ArrowLeft size={13} /> Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(3)}
                        className="py-3 px-6 bg-[#FA7A21] hover:bg-[#e06917] text-white font-semibold text-xs rounded-full shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <span>Review Smart Escrow Contract</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ═════════════════════════════════════════════════════════════════ */}
            {/* STAGE 3: SMART ESCROW CONTRACT & MILESTONE TERMS                 */}
            {/* ═════════════════════════════════════════════════════════════════ */}
            {currentStep === 3 && (
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-[#1C0E07] border border-white/10 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6">
                  <div className="border-b border-white/10 pb-4">
                    <span className="text-[11px] uppercase tracking-wider text-[#FA7A21] font-semibold">Stage 3 of 4</span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-light text-white mt-1">
                      ONDC Smart Contract Escrow Terms
                    </h2>
                    <p className="text-xs text-white mt-1">
                      Automated 3-stage milestone release guarantees artisan working capital while protecting buyer delivery risk.
                    </p>
                  </div>

                  {/* Contract Snapshot */}
                  <div className="p-4 bg-black/40 border border-white/10 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <p className="text-white">Total Purchase Order:</p>
                      <p className="font-serif text-base font-semibold text-white mt-0.5">{totalAllocated} Handcrafted Units</p>
                    </div>
                    <div>
                      <p className="text-white">Aggregated Total:</p>
                      <p className="font-serif text-base font-semibold text-[#FA7A21] mt-0.5">₹{totalEstimatedCost.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-white">Lead Delivery Window:</p>
                      <p className="font-serif text-base font-semibold text-white mt-0.5">{maxLeadDays} Days</p>
                    </div>
                    <div>
                      <p className="text-white">Target Destination:</p>
                      <p className="font-serif text-base font-semibold text-white mt-0.5">{deliveryCity}, {deliveryState}</p>
                    </div>
                  </div>

                  {/* 3 Milestones Detailed */}
                  <div className="space-y-3">
                    <h3 className="text-xs uppercase font-bold tracking-wider text-amber-300">Escrow Milestone Disbursement Structure:</h3>

                    {/* Milestone 1 */}
                    <div className="p-4 bg-[#24130A] border border-emerald-500/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">
                          1
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm">Milestone 1: 30% Raw Material Advance</p>
                          <p className="text-white mt-0.5">Disbursed immediately to cluster bank accounts to purchase brass ingots &amp; coal.</p>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-emerald-400 text-base">
                        ₹{Math.round(totalEstimatedCost * 0.3).toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Milestone 2 */}
                    <div className="p-4 bg-[#24130A] border border-amber-500/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center shrink-0">
                          2
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm">Milestone 2: 40% Mid-Production QC Inspection</p>
                          <p className="text-white mt-0.5">Released after MoSJE certified field auditor verifies 50% finished batch dimensions &amp; casting purity.</p>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-amber-300 text-base">
                        ₹{Math.round(totalEstimatedCost * 0.4).toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Milestone 3 */}
                    <div className="p-4 bg-[#24130A] border border-amber-500/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center shrink-0">
                          3
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm">Milestone 3: 30% Consolidated Final Dispatch</p>
                          <p className="text-white mt-0.5">Released upon barcode arrival scan at buyer warehouse in {deliveryCity}.</p>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-amber-300 text-base">
                        ₹{Math.round(totalEstimatedCost * 0.3).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="py-3.5 px-6 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <ArrowLeft size={13} /> Back to Quotas
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      className="flex-1 py-4 px-6 bg-[#FA7A21] hover:bg-[#e06917] text-white font-semibold text-xs rounded-full shadow-xl hover:shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <FileText size={16} />
                      <span>Authorize &amp; Dispatch ONDC Purchase Order ({poTrackingId})</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ═════════════════════════════════════════════════════════════════ */}
            {/* STAGE 4: LIVE PO PRODUCTION & ESCROW DISBURSEMENT DASHBOARD       */}
            {/* ═════════════════════════════════════════════════════════════════ */}
            {currentStep === 4 && (
              <div className="max-w-5xl mx-auto space-y-6">
                <div className="bg-[#1C0E07] border border-amber-600/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center text-green-400 shrink-0">
                        <Check size={24} />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-green-400 bg-green-950/60 px-2.5 py-0.5 rounded-full border border-green-700/40">
                          ONDC Protocol &bull; PO Live &amp; Bound
                        </span>
                        <h2 className="font-serif text-2xl font-normal text-white mt-1">
                          Purchase Order: <span className="font-mono text-[#FA7A21]">{poTrackingId}</span>
                        </h2>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={downloadPOJson}
                        className="px-4 py-2.5 bg-black/40 border border-white/20 hover:border-[#FA7A21]/60 text-white hover:text-white text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download size={13} />
                        <span>Export Contract Manifest</span>
                      </button>
                    </div>
                  </div>

                  {/* Summary Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-black/40 border border-white/10 p-4 rounded-2xl text-xs">
                    <div>
                      <p className="text-white">Total Units:</p>
                      <p className="font-mono text-base font-bold text-white mt-0.5">{totalAllocated} Units</p>
                    </div>
                    <div>
                      <p className="text-white">Total Escrow Pool:</p>
                      <p className="font-mono text-base font-bold text-[#FA7A21] mt-0.5">₹{totalEstimatedCost.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-white">Participating Clusters:</p>
                      <p className="font-mono text-base font-bold text-emerald-400 mt-0.5">3 Artisan Collectives</p>
                    </div>
                    <div>
                      <p className="text-white">Destination:</p>
                      <p className="font-mono text-base font-bold text-white mt-0.5">{deliveryCity}</p>
                    </div>
                  </div>

                  {/* Live Interactive Milestone Dispatch Controls */}
                  <div className="space-y-4">
                    <h3 className="text-xs uppercase font-bold tracking-wider text-amber-300">Live Escrow &amp; Production Tracking:</h3>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      {/* Milestone 1 Card */}
                      <div className={`p-5 rounded-2xl border transition-all ${
                        advancePaid ? 'bg-emerald-950/30 border-emerald-500/50' : 'bg-[#24130A] border-white/10'
                      }`}>
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] uppercase font-bold text-emerald-400">Stage 1 (30%)</span>
                          {advancePaid ? (
                            <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1">
                              <CheckCircle size={11} /> Disbursed
                            </span>
                          ) : (
                            <span className="text-[10px] text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-md font-semibold">
                              Pending Release
                            </span>
                          )}
                        </div>
                        <h4 className="font-serif text-lg text-white mt-1">Raw Material Advance</h4>
                        <p className="font-mono text-xs text-[#FA7A21] font-bold mt-0.5">₹{Math.round(totalEstimatedCost * 0.3).toLocaleString('en-IN')}</p>
                        <p className="text-xs text-white mt-2">Enables 3 clusters to buy raw materials without predatory local moneylenders.</p>

                        {!advancePaid ? (
                          <button
                            type="button"
                            onClick={() => setAdvancePaid(true)}
                            className="mt-4 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                          >
                            <Check size={13} />
                            <span>Simulate 30% Advance Release</span>
                          </button>
                        ) : (
                          <div className="mt-4 text-[11px] text-emerald-300 font-mono bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-700/40">
                            ✓ Escrow TX #84920-A Confirmed
                          </div>
                        )}
                      </div>

                      {/* Milestone 2 Card */}
                      <div className={`p-5 rounded-2xl border transition-all ${
                        qcAuditScheduled ? 'bg-amber-950/30 border-amber-500/50' : 'bg-[#24130A] border-white/10'
                      }`}>
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] uppercase font-bold text-amber-300">Stage 2 (40%)</span>
                          {qcAuditScheduled ? (
                            <span className="text-[10px] text-amber-300 bg-amber-950 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1">
                              <CheckCircle size={11} /> Auditor Assigned
                            </span>
                          ) : (
                            <span className="text-[10px] text-white bg-black/40 px-2 py-0.5 rounded-md font-semibold">
                              Awaiting Mid-Term
                            </span>
                          )}
                        </div>
                        <h4 className="font-serif text-lg text-white mt-1">MoSJE Quality Audit</h4>
                        <p className="font-mono text-xs text-[#FA7A21] font-bold mt-0.5">₹{Math.round(totalEstimatedCost * 0.4).toLocaleString('en-IN')}</p>
                        <p className="text-xs text-white mt-2">Field quality inspector visits Bastar &amp; Kondagaon casting sites for batch sample test.</p>

                        {!qcAuditScheduled ? (
                          <button
                            type="button"
                            onClick={() => setQcAuditScheduled(true)}
                            className="mt-4 w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                          >
                            <ShieldCheck size={13} />
                            <span>Request Field Audit</span>
                          </button>
                        ) : (
                          <div className="mt-4 text-[11px] text-amber-300 font-mono bg-amber-950/60 p-2.5 rounded-xl border border-amber-700/40">
                            ✓ Auditor ID: MoSJE-QC-742 Assigned
                          </div>
                        )}
                      </div>

                      {/* Milestone 3 Card */}
                      <div className="p-5 rounded-2xl border bg-[#24130A] border-white/10">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] uppercase font-bold text-amber-300">Stage 3 (30%)</span>
                          <span className="text-[10px] text-white bg-black/40 px-2 py-0.5 rounded-md font-semibold">
                            Scheduled on Dispatch
                          </span>
                        </div>
                        <h4 className="font-serif text-lg text-white mt-1">Final Consolidated Delivery</h4>
                        <p className="font-mono text-xs text-[#FA7A21] font-bold mt-0.5">₹{Math.round(totalEstimatedCost * 0.3).toLocaleString('en-IN')}</p>
                        <p className="text-xs text-white mt-2">Integrated logistics vehicle collects from all 3 clusters and delivers to {deliveryCity}.</p>
                        
                        <div className="mt-4 text-[11px] text-white font-mono bg-black/30 p-2.5 rounded-xl border border-white/10 flex items-center gap-1.5">
                          <Truck size={13} className="text-[#FA7A21]" />
                          <span>Hub: Raipur Central Hub</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Return / Next Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentStep(1);
                        setAdvancePaid(false);
                        setQcAuditScheduled(false);
                      }}
                      className="py-3 px-6 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw size={13} />
                      <span>Create Another RFQ</span>
                    </button>
                    <Link
                      href="/explore"
                      className="flex-1 py-3 px-6 bg-[#FA7A21] hover:bg-[#e06917] text-white font-semibold text-xs rounded-full text-center shadow-lg transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Explore More Craft Catalogues</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </ScrollReveal>
        </div>
      </main>

      <FolkArtBanner height={65} variant="border-4" alt="Indian heritage tapestry border ribbon" />

      <Footer />
    </>
  );
}

export default function B2BRfqPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#24130A] text-white flex items-center justify-center font-serif text-lg">
          Loading Multi-Cluster RFQ Engine...
        </div>
      }
    >
      <B2BRfqContent />
    </Suspense>
  );
}
