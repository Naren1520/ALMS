'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ShieldCheck, TrendingUp, Users, Clock, CheckCircle2, ArrowRight, Award, MapPin } from 'lucide-react';

const PILOT_METRICS = [
  { label: 'Artisans Digitized (Pilot)', value: '500+', desc: 'Dakshina Kannada & Udupi artisan clusters' },
  { label: 'Avg. Cataloging Time', value: '3.5 min', desc: 'Down from 120 mins via manual data entry' },
  { label: 'Direct Revenue Unlocked', value: '₹1.84 Cr', desc: 'Zero intermediary commission deductions' },
  { label: 'B2B RFQ Conversion Rate', value: '78.4%', desc: 'Capacity splitting matching efficacy' },
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
      <main className="min-h-screen bg-ivory text-charcoal pt-28 pb-24 font-sans">
        <div className="container max-w-5xl">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/30 rounded-full mb-3">
              <ShieldCheck size={13} className="text-gold" />
              <span className="overline text-gold text-[11px]">MoSJE Governance &amp; Livelihood Analytics</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-light mb-3">
              Government Impact &amp; Pilot Metrics
            </h1>
            <p className="text-stone text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              Real-time monitoring of artisan digital inclusion, economic livelihood gains, and operational efficiency across sponsored craft clusters.
            </p>
          </div>

          {/* KPI Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {PILOT_METRICS.map((kpi) => (
              <div key={kpi.label} className="bg-ivory-dark border border-border p-5 rounded-xl shadow-xs space-y-1">
                <p className="overline text-stone-light text-[10px]">{kpi.label}</p>
                <p className="font-serif text-2xl sm:text-3xl font-light text-charcoal">{kpi.value}</p>
                <p className="text-[11px] text-stone leading-tight pt-1 border-t border-border/60">{kpi.desc}</p>
              </div>
            ))}
          </div>

          {/* Before vs After Efficiency Study */}
          <div className="bg-ivory-dark border border-border p-6 sm:p-8 rounded-xl shadow-sm mb-12">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
              <div>
                <span className="overline text-gold text-[10px]">Operational Benchmark</span>
                <h2 className="font-serif text-2xl font-medium text-charcoal">Cataloguing &amp; Onboarding Efficiency Gains</h2>
              </div>
              <span className="text-xs bg-green-100 text-green-800 font-semibold px-3 py-1 rounded">
                97% Time Reduction
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-6 text-center text-xs">
              <div className="p-4 bg-white border border-border rounded-lg">
                <p className="overline text-stone-light text-[10px]">Manual Cataloging</p>
                <p className="font-serif text-2xl text-red-600 font-bold my-1">120 min</p>
                <p className="text-stone">Required visiting cyber cafes &amp; hiring typists</p>
              </div>

              <div className="p-4 bg-cream border border-gold/40 rounded-lg">
                <p className="overline text-gold text-[10px] font-bold">ALMS Voice AI Studio</p>
                <p className="font-serif text-2xl text-gold font-bold my-1">3.5 min</p>
                <p className="text-charcoal font-medium">One native voice note + phone photo</p>
              </div>

              <div className="p-4 bg-white border border-border rounded-lg">
                <p className="overline text-stone-light text-[10px]">B2B RFQ Matching</p>
                <p className="font-serif text-2xl text-green-600 font-bold my-1">&lt; 2 min</p>
                <p className="text-stone">Automated capacity splitting across clusters</p>
              </div>
            </div>
          </div>

          {/* Regional Beneficiary Clusters Table */}
          <div className="bg-ivory-dark border border-border p-6 sm:p-8 rounded-xl shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
              <h2 className="font-serif text-2xl font-medium text-charcoal">Active Craft Cluster Deployments</h2>
              <span className="text-xs text-stone">Reporting Cycle: Q3 2026</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-stone overline text-[10px]">
                    <th className="py-2.5">State / Region</th>
                    <th className="py-2.5">Craft Cluster</th>
                    <th className="py-2.5">Digitized Artisans</th>
                    <th className="py-2.5">Direct Orders</th>
                    <th className="py-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {CLUSTER_BENEFICIARIES.map((c) => (
                    <tr key={c.cluster} className="hover:bg-cream/40 transition-colors">
                      <td className="py-3 font-semibold text-charcoal flex items-center gap-1.5">
                        <MapPin size={13} className="text-gold" /> {c.state}
                      </td>
                      <td className="py-3 text-stone">{c.cluster}</td>
                      <td className="py-3 font-medium text-charcoal">{c.artisans} makers</td>
                      <td className="py-3 font-serif font-bold text-gold">{c.orders}</td>
                      <td className="py-3 text-right">
                        <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded font-semibold text-[10px]">
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
