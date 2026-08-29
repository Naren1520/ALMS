'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { ShieldCheck, TrendingUp, MapPin, Sparkles, Building2 } from 'lucide-react';
import Link from 'next/link';

const PILOT_METRICS = [
  { label: 'Artisans Digitized (Pilot)', value: '500+', desc: 'Dakshina Kannada & Udupi artisan clusters', trend: '+34% this quarter' },
  { label: 'Avg. Cataloging Time', value: '3.5 min', desc: 'Down from 120 mins via manual data entry', trend: '97% reduction' },
  { label: 'Direct Revenue Unlocked', value: '₹1.84 Cr', desc: 'Zero intermediary commission deductions', trend: '100% direct-to-account' },
  { label: 'B2B RFQ Conversion Rate', value: '78.4%', desc: 'Capacity splitting matching efficacy', trend: '48+ corporate hampers' },
];

const CLUSTER_BENEFICIARIES = [
  { state: 'Chhattisgarh', cluster: 'Bastar Bell Metal & Bamboo', artisans: 420, orders: '₹48.5 Lakhs', status: 'Active' },
  { state: 'Bihar', cluster: 'Mithila Madhubani Guilds', artisans: 680, orders: '₹82.1 Lakhs', status: 'Active' },
  { state: 'Rajasthan', cluster: 'Jaipur Blue Pottery Collective', artisans: 350, orders: '₹54.3 Lakhs', status: 'Active' },
  { state: 'Karnataka', cluster: 'Bidar & Channapatna Crafts', artisans: 510, orders: '₹62.0 Lakhs', status: 'Active' },
  { state: 'Jammu & Kashmir', cluster: 'Srinagar Pashmina Guild', artisans: 290, orders: '₹75.8 Lakhs', status: 'Active' },
];

export default function ImpactPage() {
  return (
    <>
      <Navbar />

      {/* Dark Hero Banner */}
      <section
        className="relative min-h-[45vh] flex items-center overflow-hidden pt-20"
        style={{ background: 'linear-gradient(135deg, #1A0D06 0%, #2B1810 60%, #1A0D06 100%)' }}
      >
        <div className="absolute inset-0 opacity-15"
          style={{ backgroundImage: 'radial-gradient(circle at 10% 60%, #FA7A21 0%, transparent 50%), radial-gradient(circle at 90% 20%, #B8965A 0%, transparent 40%)' }}
        />
        <div className="container relative z-10 py-16 md:py-20">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs text-amber-200">
              <ShieldCheck size={14} className="text-[#FA7A21]" />
              <span className="font-sans font-medium tracking-wide">MoSJE Governance & Livelihood Analytics &bull; Govt of India</span>
            </div>
            <h1
              className="font-serif text-white font-normal"
              style={{ fontSize: 'clamp(2.25rem, 5vw, 4rem)', lineHeight: 1.08, letterSpacing: '-0.015em' }}
            >
              Government Impact &amp;<br />
              <em className="font-light text-amber-200" style={{ fontStyle: 'italic' }}>Pilot Outcomes.</em>
            </h1>
            <p className="text-white font-sans text-base font-light max-w-2xl leading-relaxed">
              Real-time monitoring of artisan digital inclusion, economic livelihood gains, and operational efficiency across MoSJE-sponsored craft clusters.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-white/15">
              {PILOT_METRICS.slice(0, 4).map(({ value, label }) => (
                <div key={label}>
                  <p className="font-serif text-amber-200 text-xl sm:text-2xl font-light">{value}</p>
                  <p className="text-white text-[11px] font-sans mt-0.5">{label.split(' ').slice(0, 3).join(' ')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main className="bg-[#2B1810] text-white font-sans pb-0 min-h-screen">
        <div className="container max-w-6xl py-14 space-y-10">

          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PILOT_METRICS.map((kpi, index) => (
              <ScrollReveal key={kpi.label} delay={index * 0.08}>
                <div className="bg-[#1C0E07] border border-white/10 hover:border-[#FA7A21]/40 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 space-y-2 h-full flex flex-col justify-between hover:-translate-y-1">
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-stone-300">{kpi.label}</span>
                    <p className="font-serif text-3xl sm:text-4xl font-light text-[#FA7A21]">{kpi.value}</p>
                    <p className="text-xs text-stone-100 font-light leading-relaxed">{kpi.desc}</p>
                  </div>
                  <div className="pt-3 border-t border-white/10 flex items-center gap-1.5 text-[11px] font-semibold text-green-400">
                    <TrendingUp size={13} />
                    <span>{kpi.trend}</span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Before vs After Efficiency Study */}
          <ScrollReveal className="bg-[#24130A] border border-amber-900/30 p-8 sm:p-10 rounded-2xl shadow-xl" delay={0.1}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-white/10 mb-8">
              <div>
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Operational Benchmark</span>
                <h2 className="font-serif text-2xl sm:text-3xl font-light text-white mt-1">
                  Cataloguing &amp; Onboarding Efficiency Gains
                </h2>
              </div>
              <span className="text-xs bg-[#FA7A21] text-white font-bold px-4 py-1.5 rounded-full shadow-md self-start sm:self-auto">
                97% Time Reduction
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-6 text-center text-xs">
              <div className="p-6 bg-black/30 border border-white/10 rounded-2xl space-y-2">
                <p className="text-[10px] uppercase font-bold tracking-wider text-stone-300">Traditional Manual Cataloging</p>
                <p className="font-serif text-3xl text-red-400 font-light my-1">120 min</p>
                <p className="text-stone-200 font-light">Required visiting cyber cafes, hiring English typists, and paid camera rentals</p>
              </div>
              <div className="p-6 bg-[#FA7A21]/15 border-2 border-[#FA7A21]/50 rounded-2xl shadow-lg space-y-2 transform md:-translate-y-2">
                <div className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-[#FA7A21] bg-black/30 px-2.5 py-0.5 rounded-full border border-[#FA7A21]/30">
                  <Sparkles size={11} /> ALMS Voice AI Studio
                </div>
                <p className="font-serif text-4xl text-[#FA7A21] font-light my-1">3.5 min</p>
                <p className="text-amber-200 font-light">One native voice note + budget smartphone photo → ONDC catalog</p>
              </div>
              <div className="p-6 bg-black/30 border border-white/10 rounded-2xl space-y-2">
                <p className="text-[10px] uppercase font-bold tracking-wider text-stone-300">B2B RFQ Matching Engine</p>
                <p className="font-serif text-3xl text-green-400 font-light my-1">&lt; 2 min</p>
                <p className="text-stone-200 font-light">Automated deterministic capacity splitting across verified artisan clusters</p>
              </div>
            </div>
          </ScrollReveal>

          {/* Regional Beneficiary Clusters Table */}
          <ScrollReveal className="bg-[#1C0E07] border border-white/10 p-8 sm:p-10 rounded-2xl shadow-xl space-y-6" delay={0.15}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-light text-white">Active Craft Cluster Deployments</h2>
                <p className="text-xs text-stone-300 font-light mt-0.5">Physical telemetry and Aadhaar-authenticated beneficiary hubs</p>
              </div>
              <span className="text-xs text-stone-200 bg-white/10 px-3.5 py-1.5 rounded-full font-medium">
                Reporting Cycle: Q3 2026
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-stone-300 text-[10px] uppercase font-bold tracking-wider">
                    <th className="py-3 px-3">State / Region</th>
                    <th className="py-3 px-3">Craft Cluster</th>
                    <th className="py-3 px-3">Digitized Artisans</th>
                    <th className="py-3 px-3">Direct Orders</th>
                    <th className="py-3 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {CLUSTER_BENEFICIARIES.map((c) => (
                    <tr key={c.cluster} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-3 font-semibold text-white flex items-center gap-2">
                        <MapPin size={14} className="text-[#FA7A21]" /> {c.state}
                      </td>
                      <td className="py-4 px-3 text-stone-100 font-light">{c.cluster}</td>
                      <td className="py-4 px-3 font-medium text-white">{c.artisans} master makers</td>
                      <td className="py-4 px-3 font-serif font-light text-[#FA7A21] text-sm">{c.orders}</td>
                      <td className="py-4 px-3 text-right">
                        <span className="px-3 py-1 bg-green-900/40 text-green-400 border border-green-700/40 rounded-full font-semibold text-[10px]">
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollReveal>

          {/* Bottom Callout Banner */}
          <ScrollReveal delay={0.2}>
            <div className="p-8 sm:p-10 bg-[#24130A] border border-amber-900/30 text-white rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
              <div className="space-y-2 text-center md:text-left">
                <h3 className="font-serif text-2xl sm:text-3xl font-light text-amber-200">
                  Are You a Government or Institutional Partner?
                </h3>
                <p className="text-stone-100 text-xs sm:text-sm font-light max-w-xl leading-relaxed">
                  Integrate your state craft federation or district administration with ALMS APIs for real-time beneficiary telemetry.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/b2b/rfq"
                  className="px-6 py-3.5 bg-[#FA7A21] hover:bg-[#e06917] text-white font-semibold text-xs rounded-full shadow-lg hover:shadow-orange-500/30 transition-all flex items-center gap-2"
                >
                  <Building2 size={14} />
                  <span>Institutional Sourcing</span>
                </Link>
                <Link
                  href="/docs"
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-full border border-white/20 backdrop-blur-md transition-all flex items-center gap-2"
                >
                  <span>API Documentation</span>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </main>
      <Footer />
    </>
  );
}
