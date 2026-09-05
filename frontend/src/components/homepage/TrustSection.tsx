'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function TrustSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;
    let ctx: any;
    (async () => {
      try {
        const { gsap } = await import('gsap');
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        gsap.registerPlugin(ScrollTrigger);
        ctx = gsap.context(() => {
          if (textRef.current) {
            gsap.from(Array.from(textRef.current.children), {
              opacity: 0,
              y: 24,
              stagger: 0.1,
              duration: 0.7,
              ease: 'power3.out',
              scrollTrigger: { trigger: textRef.current, start: 'top 75%' },
            });
          }
        });
      } catch (e) {
        // fallback
      }
    })();
    return () => ctx?.revert();
  }, [prefersReduced]);

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-32 bg-[#2B1810] text-white font-sans border-t border-white/10"
      aria-labelledby="reliability-heading"
    >
      <div className="container grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left Column: Narrative Text + Artisan Profile Card Box */}
        <div ref={textRef} className="space-y-8">
          <div>
            <div className="mb-5">
              <span
                className="font-sans font-semibold text-amber-300 text-xs px-4 py-1.5 bg-white/10 border border-white/20 rounded-full inline-block uppercase tracking-wider"
              >
                Explainable Quality Assurance
              </span>
            </div>
            <h2
              id="reliability-heading"
              className="font-serif text-white leading-tight font-light text-3xl sm:text-4xl lg:text-5xl"
            >
              Artisan Reliability Profiles:<br />
              <em className="text-amber-200" style={{ fontStyle: 'italic' }}>
                Transparent. Explainable. Fair.
              </em>
            </h2>
          </div>

          <p className="text-stone-300 leading-relaxed text-base font-light">
            Instead of opaque ratings that penalize rural artisans for poor internet connectivity or delayed third-party transport, ALMS provides a transparent <strong>Reliability Profile</strong> grounded in verified craftsmanship, government beneficiary records, and on-time milestone fulfilment.
          </p>

          {/* Profile Card Example */}
          <div className="p-6 bg-[#1C0E07] border border-white/15 shadow-2xl space-y-4 rounded-3xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-serif text-lg font-medium text-white">Meera Devi &bull; Mithila Craft Cluster</p>
                <p className="text-xs text-stone-400">Madhubani Painting &bull; Bihar (GI Certified)</p>
              </div>
              <span className="px-3 py-1 bg-[#FA7A21]/20 text-amber-300 font-semibold text-xs rounded-full border border-[#FA7A21]/40 flex items-center gap-1">
                <ShieldCheck size={13} /> Verified Master
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 text-center">
              <div>
                <p className="text-stone-400 font-sans font-medium text-[10px] uppercase tracking-wider">Fulfilment Rate</p>
                <p className="font-serif text-base font-bold text-white">97.8%</p>
              </div>
              <div>
                <p className="text-stone-400 font-sans font-medium text-[10px] uppercase tracking-wider">On-Time Dispatch</p>
                <p className="font-serif text-base font-bold text-white">95.2%</p>
              </div>
              <div>
                <p className="text-stone-400 font-sans font-medium text-[10px] uppercase tracking-wider">Active Capacity</p>
                <p className="font-serif text-base font-bold text-amber-300">45 Units/mo</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Artisan Showcase Image */}
        <div>
          {/* Master Artisan Photo Showcase */}
          <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl group">
            <div className="relative h-[380px] sm:h-[460px] lg:h-[500px] w-full">
              <Image
                src="/images/artisan_trust_profile.jpg"
                alt="Master Artisan in Workshop with GI Authenticated Handicraft"
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C0E07] via-black/20 to-transparent" />
            </div>
            
            {/* Floating verification badge */}
            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between bg-[#1C0E07]/90 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/15 shadow-xl">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={18} className="text-[#FA7A21] shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-white">Govt GI &amp; MoSJE Verified Master Craftsman</span>
              </div>
              <span className="text-[11px] font-sans font-semibold text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-300/30">
                Active ID
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
