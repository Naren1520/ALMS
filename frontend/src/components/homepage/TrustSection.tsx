'use client';

import { useEffect, useRef } from 'react';
import { BadgeCheck, Clock, Star, Package } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const TRUST_EVENTS = [
  { event: 'Identity Verified',       weight: '+20', Icon: BadgeCheck, desc: 'Govt ID + workshop verification' },
  { event: 'Order Fulfilled On Time', weight: '+5',  Icon: Clock,      desc: 'Consistent delivery track record' },
  { event: 'Positive Review (4–5★)',  weight: '+3',  Icon: Star,       desc: 'Genuine buyer feedback' },
  { event: 'RFQ Fulfilled',           weight: '+8',  Icon: Package,    desc: 'Bulk order capability proven' },
];

export default function TrustSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef   = useRef<(HTMLDivElement | null)[]>([]);
  const textRef    = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;
    let ctx: any;
    (async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        if (textRef.current) {
          gsap.from(Array.from(textRef.current.children), {
            opacity: 0, y: 24, stagger: 0.1, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: textRef.current, start: 'top 75%' },
          });
        }
        gsap.from(itemsRef.current.filter(Boolean), {
          opacity: 0, x: 24, stagger: 0.12, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        });
      });
    })();
    return () => ctx?.revert();
  }, [prefersReduced]);

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-32"
      style={{ background: '#FDFBF7' }}
      aria-labelledby="trust-heading"
    >
      <div className="container grid md:grid-cols-2 gap-16 lg:gap-24 items-center">

        {/* Text */}
        <div ref={textRef} className="space-y-8">
          <div>
            <p className="overline text-gold mb-4">Trust System</p>
            <div className="w-10 h-px bg-gold mb-8" />
            <h2
              id="trust-heading"
              className="font-serif text-charcoal leading-tight"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)', fontWeight: 300 }}
            >
              Trust that's earned,<br />
              <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>
                explained, and real.
              </em>
            </h2>
          </div>
          <p className="text-stone leading-relaxed" style={{ fontSize: '1.0625rem' }}>
            Every artisan and buyer has an explainable Trust Score (0–100) built from verified
            actions — not just ratings. A full breakdown of <em>why</em> you should trust them.
          </p>

          {/* Score dial — simple visual */}
          <div className="flex items-center gap-6 p-6 bg-ivory-dark border border-border">
            <div className="flex-shrink-0">
              <div
                className="w-20 h-20 rounded-full border-4 flex items-center justify-center"
                style={{ borderColor: 'var(--gold)' }}
              >
                <span className="font-serif text-gold text-2xl font-medium">94</span>
              </div>
            </div>
            <div>
              <p className="font-sans font-medium text-charcoal text-sm mb-1">Meera Devi</p>
              <p className="overline text-gold mb-2" style={{ fontSize: '0.6rem' }}>Madhubani Painting · Bihar</p>
              <p className="text-stone text-xs leading-relaxed">
                Verified ID · 124 orders · 4.9★ · 3 RFQs fulfilled
              </p>
            </div>
          </div>
        </div>

        {/* Event list */}
        <div className="space-y-3">
          {TRUST_EVENTS.map((item, i) => (
            <div
              key={item.event}
              ref={(el) => { itemsRef.current[i] = el; }}
              className="flex items-center justify-between p-5 bg-ivory-dark border border-border
                hover:border-gold/40 transition-colors duration-300 group"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-9 h-9 flex items-center justify-center bg-ivory border border-border
                    group-hover:border-gold/40 transition-colors duration-300 flex-shrink-0"
                >
                  <item.Icon size={16} style={{ color: 'var(--gold)' }} aria-hidden="true" />
                </div>
                <div>
                  <p className="font-sans font-medium text-charcoal text-sm">{item.event}</p>
                  <p className="text-stone-light text-xs mt-0.5">{item.desc}</p>
                </div>
              </div>
              <span
                className="font-sans font-semibold text-xs px-3 py-1.5 bg-charcoal text-ivory
                  flex-shrink-0 ml-4"
              >
                {item.weight} pts
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

