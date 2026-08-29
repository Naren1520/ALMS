'use client';

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
      className="py-24 md:py-32 bg-ivory text-charcoal font-sans"
      aria-labelledby="reliability-heading"
    >
      <div className="container grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Left: Text Narrative */}
        <div ref={textRef} className="space-y-8">
          <div>
            <div className="mb-5">
              <span
                className="font-sans font-semibold text-gold-dark text-xs px-4 py-1.5 bg-[#FA7A21]/15 border border-[#FA7A21]/30 rounded-full inline-block uppercase tracking-wider"
              >
                Explainable Quality Assurance
              </span>
            </div>
            <h2
              id="reliability-heading"
              className="font-serif text-charcoal leading-tight font-light"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)' }}
            >
              Artisan Reliability Profiles:<br />
              <em className="text-[#FA7A21]" style={{ fontStyle: 'italic' }}>
                Transparent. Explainable. Fair.
              </em>
            </h2>
          </div>

          <p className="text-stone leading-relaxed text-base">
            Instead of opaque ratings that penalize rural artisans for poor internet connectivity or delayed third-party transport, ALMS provides a transparent <strong>Reliability Profile</strong> grounded in verified craftsmanship, government beneficiary records, and on-time milestone fulfilment.
          </p>

          {/* Profile Card Example */}
          <div className="p-6 bg-ivory-dark border border-border shadow-xs space-y-4" style={{ borderRadius: '24px' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-serif text-lg font-medium text-charcoal">Meera Devi &bull; Mithila Craft Cluster</p>
                <p className="text-xs text-stone">Madhubani Painting &bull; Bihar (GI Certified)</p>
              </div>
              <span className="px-3 py-1 bg-gold/15 text-gold-dark font-semibold text-xs rounded-full border border-gold/30 flex items-center gap-1">
                <ShieldCheck size={13} /> Verified Master
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border text-center">
              <div>
                <p className="text-stone-light font-sans font-medium" style={{ fontSize: '0.65rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Fulfilment Rate</p>
                <p className="font-serif text-base font-bold text-charcoal">97.8%</p>
              </div>
              <div>
                <p className="text-stone-light font-sans font-medium" style={{ fontSize: '0.65rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>On-Time Dispatch</p>
                <p className="font-serif text-base font-bold text-charcoal">95.2%</p>
              </div>
              <div>
                <p className="text-stone-light font-sans font-medium" style={{ fontSize: '0.65rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Active Capacity</p>
                <p className="font-serif text-base font-bold text-gold">45 Units/mo</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Metric Breakdown Cards */}
        <div className="space-y-4">
          {RELIABILITY_METRICS.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                ref={(el) => { itemsRef.current[i] = el; }}
                className="p-5 bg-ivory-dark border border-border hover:border-gold/50 transition-all duration-200 flex items-center justify-between shadow-xs"
                style={{ borderRadius: '20px' }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-cream border border-border flex items-center justify-center text-gold shrink-0" style={{ borderRadius: '14px' }}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-sans font-medium text-charcoal text-sm">{item.title}</h3>
                    <p className="text-stone text-xs mt-0.5">{item.desc}</p>
                  </div>
                </div>
                <span className="font-serif text-lg font-medium text-charcoal shrink-0 ml-4">
                  {item.stat}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
