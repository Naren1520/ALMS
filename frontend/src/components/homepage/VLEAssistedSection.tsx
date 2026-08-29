'use client';

import { Users, ShieldCheck, FileCheck, Smartphone, CheckCircle2 } from 'lucide-react';

export default function VLEAssistedSection() {
  return (
    <section className="py-24 md:py-32 bg-[#2B1810] text-white border-t border-white/10 font-sans">
      <div className="container grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Left: Narrative */}
        <div>
          <div className="mb-5">
            <span
              className="font-sans font-semibold text-amber-300 text-xs px-4 py-1.5 bg-white/10 border border-white/20 rounded-full inline-block uppercase tracking-wider"
            >
              Last-Mile Human-in-the-Loop
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-light text-white mb-6 leading-tight">
            VLE &amp; CSC Assisted Onboarding:<br />
            <em className="text-amber-200" style={{ fontStyle: 'italic' }}>
              No Artisan Left Behind.
            </em>
          </h2>
          <p className="text-stone-300 text-base leading-relaxed mb-6 font-light">
            We recognize that elderly master weavers and rural micro-entrepreneurs may not own smartphones or understand digital apps. ALMS empowers Village Level Entrepreneurs (VLEs) and Common Service Center (CSC) operators to assist artisans on the ground.
          </p>

          <div className="space-y-4">
            {[
              {
                title: 'Consent-First Workflow',
                desc: 'Artisans retain 100% account sovereignty via Aadhaar OTP or voice consent; VLEs cannot alter payouts.',
              },
              {
                title: 'Micro-Incentive Alignment',
                desc: 'VLEs receive modest government-mandated service fees for verifying and digitizing master craftspeople.',
              },
              {
                title: 'Full Audit Trail',
                desc: 'Every listing creation, price update, and order update is logged immutably with timestamp and operator ID.',
              },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-3.5">
                <CheckCircle2 size={18} className="text-[#FA7A21] mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-sm text-white">{f.title}</h3>
                  <p className="text-stone-300 text-xs leading-relaxed mt-0.5 font-light">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Flow Diagram Card */}
        <div className="bg-[#1C0E07] border border-white/15 p-8 shadow-2xl space-y-6 rounded-3xl">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <span
              className="font-sans font-semibold text-amber-300 text-xs uppercase tracking-wider"
            >
              Onboarding Flow
            </span>
            <span className="text-[10px] bg-[#FA7A21]/20 text-amber-300 font-semibold px-3 py-1 rounded-full border border-[#FA7A21]/40">
              Verified Ground Network
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-4 p-4 bg-[#2D160B] border border-white/15 shadow-sm rounded-2xl">
              <div className="w-8 h-8 rounded-full bg-[#FA7A21] text-white flex items-center justify-center font-bold shrink-0 shadow-md">
                1
              </div>
              <div>
                <p className="font-semibold text-white">Artisan Visits Local CSC / Village Hub</p>
                <p className="text-[11px] text-stone-300">Brings handmade craft samples &amp; artisan registration card</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-[#2D160B] border border-white/15 shadow-sm rounded-2xl">
              <div className="w-8 h-8 rounded-full bg-[#FA7A21] text-white flex items-center justify-center font-bold shrink-0 shadow-md">
                2
              </div>
              <div>
                <p className="font-semibold text-white">VLE Snaps Photos &amp; Records Voice Note</p>
                <p className="text-[11px] text-stone-300">ALMS AI processes image background, translates voice to English &amp; Hindi</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-[#2D160B] border border-white/15 shadow-sm rounded-2xl">
              <div className="w-8 h-8 rounded-full bg-[#FA7A21] text-white flex items-center justify-center font-bold shrink-0 shadow-md">
                3
              </div>
              <div>
                <p className="font-semibold text-white">Price Breakdown &amp; Artisan Consent</p>
                <p className="text-[11px] text-stone-300">Artisan approves sustainable price floor before instant ONDC listing</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
