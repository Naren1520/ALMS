'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#2B1810] text-white pt-28 pb-24 font-sans">
        <div className="container max-w-4xl mx-auto px-4">
          <ScrollReveal className="text-center max-w-2xl mx-auto mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FA7A21]/15 border border-[#FA7A21]/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <FileText size={14} className="text-[#FA7A21]" />
              <span>Terms of Service &bull; Governance</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-normal text-white tracking-tight">
              Terms of Service
            </h1>
            <p className="text-stone-200 text-sm font-light">
              Governing network usage, ONDC commerce, and institutional procurement
            </p>
          </ScrollReveal>

          <ScrollReveal className="bg-[#1C0E07] border border-white/10 p-8 sm:p-12 rounded-2xl shadow-xl space-y-8 text-stone-100 text-sm leading-relaxed font-light" delay={0.1}>
            <div className="space-y-3">
              <h2 className="font-serif text-2xl font-light text-white">1. Platform Purpose &amp; Scope</h2>
              <p className="text-stone-100">
                The Artisan Linkage and Market System (ALMS) is operated under the auspices of the Ministry of Social Justice &amp; Empowerment (MoSJE) to provide digital market enablement, price floor security, and direct buyer linkage for traditional Indian artisans and SHGs.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-serif text-2xl font-light text-white">2. Fair Trade &amp; Anti-Exploitation Policy</h2>
              <p className="text-stone-100">
                Buyers, aggregators, and institutional purchasers agree to abide by statutory Minimum Support Price (MSP) benchmarks and algorithmically enforced price floors calculated on material and labour inputs. Unilateral discounting below production cost is strictly prohibited.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-serif text-2xl font-light text-white">3. Settlement &amp; Fulfillment</h2>
              <p className="text-stone-100">
                All B2B purchase orders executed via ONDC protocol connectors are safeguarded by escrow terms ensuring advance disbursement to artisan cooperatives for raw material procurement prior to production commencement.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </main>
      <Footer />
    </>
  );
}
