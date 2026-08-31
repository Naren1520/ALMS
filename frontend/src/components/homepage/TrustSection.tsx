'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { BadgeCheck, Clock, Star, PackageCheck, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const RELIABILITY_METRICS = [
  {
    title: 'Beneficiary Identity Verified',
    stat: '100%',
    desc: 'Government artisan card & cluster verification via MoSJE databases',
    icon: BadgeCheck,
  },
  {
    title: 'Historical On-Time Fulfilment',
    stat: '96.4%',
    desc: 'Consistent track record across domestic and bulk procurement orders',
    icon: Clock,
  },
  {
    title: 'Verified Buyer Feedback',
    stat: '4.8 / 5',
    desc: 'Authentic quality evaluations from registered retail and wholesale buyers',
    icon: Star,
  },
  {
    title: 'Direct RFQs Completed',
    stat: '148 Orders',
    desc: 'Demonstrated capacity for multi-round custom craft production',
    icon: PackageCheck,
  },
];

export default function TrustSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
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
          gsap.from(itemsRef.current.filter(Boolean), {
            opacity: 0,
            x: 24,
            stagger: 0.12,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
          });
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
      <div className="container grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
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

        {/* Right Column: Artisan Showcase Image + Metric Breakdown Cards */}
        <div className="space-y-6 lg:pt-20">
          {/* Master Artisan Photo Showcase */}
          <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl group">
            <div className="relative h-64 sm:h-72 lg:h-80 w-full">
              <Image
                src="/images/artisan_trust_profile.jpg"
                alt="Master Artisan in Workshop with GI Authenticated Handicraft"
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C0E07] via-black/30 to-transparent" />
            </div>
            
            {/* Floating verification badge */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-[#1C0E07]/90 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={18} className="text-[#FA7A21] shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-white">Govt GI &amp; MoSJE Verified Master Craftsman</span>
              </div>
              <span className="text-[11px] font-sans font-semibold text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-300/30">
                Active ID
              </span>
            </div>
          </div>

          {/* Metric Breakdown Cards */}
          <div className="space-y-3.5">
            {RELIABILITY_METRICS.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  ref={(el) => { itemsRef.current[i] = el; }}
                  className="p-4 sm:p-5 bg-[#1C0E07] border border-white/15 hover:border-white/40 transition-all duration-200 flex items-center justify-between shadow-xl rounded-2xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[#2D160B] border border-white/10 flex items-center justify-center text-[#FA7A21] shrink-0 rounded-xl">
                      <Icon size={19} />
                    </div>
                    <div>
                      <h3 className="font-sans font-medium text-white text-sm">{item.title}</h3>
                      <p className="text-stone-300 text-xs mt-0.5 font-light">{item.desc}</p>
                    </div>
                  </div>
                  <span className="font-serif text-base sm:text-lg font-bold text-amber-300 shrink-0 ml-4">
                    {item.stat}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
