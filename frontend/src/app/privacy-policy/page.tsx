'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { ShieldCheck, Lock } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#2B1810] text-white pt-28 pb-24 font-sans">
        <div className="container max-w-4xl mx-auto px-4">
          <ScrollReveal className="text-center max-w-2xl mx-auto mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FA7A21]/15 border border-[#FA7A21]/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck size={14} className="text-[#FA7A21]" />
              <span>MoSJE Compliance &bull; Data Protection</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-normal text-white tracking-tight">
              Privacy Policy &amp; Terms
            </h1>
            <p className="text-stone-200 text-sm font-light">
              Last updated: August 2026 &bull; ALMS Ministry of Social Justice &amp; Empowerment
            </p>
          </ScrollReveal>

          <ScrollReveal className="bg-[#1C0E07] border border-white/10 p-8 sm:p-12 rounded-2xl shadow-xl space-y-8 text-stone-100 text-sm leading-relaxed font-light" delay={0.1}>
            <div className="space-y-3">
              <h2 className="font-serif text-2xl font-light text-white">1. Beneficiary Data &amp; Aadhaar Privacy</h2>
              <p className="text-stone-100">
                ALMS collects artisan identification and banking telemetry solely for direct-to-bank subsidy disbursement (DBT) and cluster performance verification under Ministry of Social Justice &amp; Empowerment guidelines. Personal identification numbers are tokenized and encrypted at rest following standard Indian e-Gov privacy architectures.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-serif text-2xl font-light text-white">2. Voice &amp; Multimedia Asset Rights</h2>
              <p className="text-stone-100">
                Audio recordings uploaded by artisans via the Virtual Business Manager Voice Cataloger are processed strictly for translation, metadata synthesis, and ONDC catalog generation. Artisans retain full moral rights, GI provenance ownership, and trademark recognition over their craft assets.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-serif text-2xl font-light text-white">3. B2B &amp; Price Protection Guarantee</h2>
              <p className="text-stone-100">
                All wholesale transactions and RFQs negotiated across the ALMS network are bound by deterministic price floor protections to prevent distress sales, unfair predatory pricing, and non-consensual middleman deductions.
              </p>
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center gap-3 text-xs text-stone-300">
              <Lock size={15} className="text-[#FA7A21]" />
              <span>For privacy inquiries, contact the nodal cell at <a href="mailto:privacy@alms.gov.in" className="text-[#FA7A21] underline hover:text-amber-200">privacy@alms.gov.in</a></span>
            </div>
          </ScrollReveal>
        </div>
      </main>
      <Footer />
    </>
  );
}
