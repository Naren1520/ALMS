'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import FolkArtBanner from './FolkArtBanner';

export default function WhoWeAreSection() {
  return (
    <section id="who-we-are" className="relative bg-[#2B1810] text-charcoal">
      <div className="container py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Card 1: Why ALMS? inside cream card matching Screenshot 3 */}
          <div
            className="bg-[#EDE6DB] p-8 sm:p-12 rounded-3xl shadow-2xl flex flex-col justify-between space-y-8 border border-amber-900/10 transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="space-y-6">
              {/* Header */}
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#8B2500] tracking-tight">
                Why ALMS?
              </h2>

              {/* Sub-headline */}
              <p className="font-serif text-lg sm:text-xl font-semibold text-[#FA7A21] italic">
                &ldquo;The Virtual Business Manager for India&apos;s Artisans&rdquo;
              </p>

              {/* Body Text */}
              <div className="space-y-4 text-stone-700 text-sm sm:text-base leading-relaxed font-sans font-normal">
                <p>
                  Traditional e-commerce seller portals require high digital literacy, studio photography, and English copywriting &mdash; creating an insurmountable barrier for rural craftspeople.
                </p>
                <p>
                  ALMS automates the entire onboarding and cataloguing lifecycle. With just one smartphone photo and a 30-second native voice note, artisans create compliant, price-protected listings ready for ONDC and global B2B buyers.
                </p>
              </div>
            </div>

            {/* Orange Button */}
            <div>
              <Link
                href="/artisan/create-product"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#FA7A21] hover:bg-[#e06917] text-white font-sans font-semibold text-sm rounded-full shadow-lg transition-all duration-200"
              >
                <span>Launch Live AI Studio</span>
                <Sparkles size={15} />
              </Link>
            </div>
          </div>

          {/* Card 2: MoSJE Livelihood Mission inside cream card matching Screenshot 3 */}
          <div
            className="bg-[#EDE6DB] p-8 sm:p-12 rounded-3xl shadow-2xl flex flex-col justify-between space-y-8 border border-amber-900/10 transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="space-y-6">
              {/* Header */}
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#8B2500] tracking-tight">
                MoSJE Mission
              </h2>

              {/* Sub-headline */}
              <p className="font-serif text-lg sm:text-xl font-semibold text-[#FA7A21] italic">
                &ldquo;From Middlemen Exploitation to Sovereign Digital Wealth&rdquo;
              </p>

              {/* Body Text */}
              <div className="space-y-4 text-stone-700 text-sm sm:text-base leading-relaxed font-sans font-normal">
                <p>
                  Affiliated with the Ministry of Social Justice &amp; Empowerment (MoSJE), ALMS integrates verifiable beneficiary authentication with automated price floor protection so artisans never make distress sales.
                </p>
                <p>
                  Government administrators access real-time cluster telemetry, tracking cataloging time reduction (120 mins down to 3.5 mins), direct household income, and regional livelihood indices across 48+ craft clusters.
                </p>
              </div>
            </div>

            {/* Orange Button */}
            <div>
              <Link
                href="/impact"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#FA7A21] hover:bg-[#e06917] text-white font-sans font-semibold text-sm rounded-full shadow-lg transition-all duration-200"
              >
                <span>View Impact Dashboard</span>
                <ShieldCheck size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Folk Art Banner on bottom matching background cut */}
      <FolkArtBanner height={85} variant="border-1" />
    </section>
  );
}
