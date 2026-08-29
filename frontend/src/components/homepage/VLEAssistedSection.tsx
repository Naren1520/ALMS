'use client';

import { Users, ShieldCheck, FileCheck, Smartphone, CheckCircle2 } from 'lucide-react';

export default function VLEAssistedSection() {
  return (
    <section className="py-24 md:py-32 bg-ivory border-t border-border font-sans text-charcoal">
      <div className="container grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Left: Narrative */}
        <div>
          <div className="mb-5">
            <span
              className="font-sans font-semibold text-gold-dark text-xs px-4 py-1.5 bg-[#FA7A21]/15 border border-[#FA7A21]/30 rounded-full inline-block uppercase tracking-wider"
            >
              Last-Mile Human-in-the-Loop
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-light text-charcoal mb-6 leading-tight">
            VLE &amp; CSC Assisted Onboarding:<br />
            <em className="text-[#FA7A21]" style={{ fontStyle: 'italic' }}>
              No Artisan Left Behind.
            </em>
          </h2>
          <p className="text-stone text-base leading-relaxed mb-6 font-light">
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
                  <h3 className="font-semibold text-xs text-charcoal">{f.title}</h3>
                  <p className="text-stone text-xs leading-relaxed mt-0.5 font-light">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Flow Diagram Card */}
        <div className="bg-ivory-dark border border-border p-8 shadow-xs space-y-6" style={{ borderRadius: '28px' }}>
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <span
              className="font-sans font-medium text-stone-light"
              style={{ fontSize: '0.65rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}
            >
              Onboarding Flow
            </span>
            <span className="text-[10px] bg-gold/15 text-gold-dark font-semibold px-3 py-1" style={{ borderRadius: '999px' }}>
              Verified Ground Network
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-4 p-4 bg-white border border-border shadow-xs" style={{ borderRadius: '18px' }}>
              <div className="w-8 h-8 rounded-full bg-cream border border-border flex items-center justify-center text-charcoal font-bold shrink-0">
                1
              </div>
              <div>
                <p className="font-semibold text-charcoal">Artisan Visits Local CSC / Village Hub</p>
                <p className="text-[11px] text-stone">Brings handmade craft samples &amp; artisan registration card</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white border border-border shadow-xs" style={{ borderRadius: '18px' }}>
              <div className="w-8 h-8 rounded-full bg-cream border border-border flex items-center justify-center text-charcoal font-bold shrink-0">
                2
              </div>
              <div>
                <p className="font-semibold text-charcoal">VLE Snaps Photos &amp; Records Voice Note</p>
                <p className="text-[11px] text-stone">ALMS AI processes image background, translates voice to English &amp; Hindi</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white border border-border shadow-xs" style={{ borderRadius: '18px' }}>
              <div className="w-8 h-8 rounded-full bg-cream border border-border flex items-center justify-center text-charcoal font-bold shrink-0">
                3
              </div>
              <div>
                <p className="font-semibold text-charcoal">Price Breakdown &amp; Artisan Consent</p>
                <p className="text-[11px] text-stone">Artisan approves sustainable price floor before instant ONDC listing</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
