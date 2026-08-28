'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/** Section 7 — Trust score text + badge reveal (Req 27.3) */
export default function TrustSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;
    let ctx: any;
    (async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.from(itemsRef.current.filter(Boolean), {
          opacity: 0,
          x: -30,
          stagger: 0.2,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        });
      });
    })();
    return () => ctx?.revert();
  }, [prefersReduced]);

  const TRUST_EVENTS = [
    { event: 'Identity Verified', weight: '+20', icon: '✓' },
    { event: 'Order Fulfilled On Time', weight: '+5', icon: '⏰' },
    { event: 'Positive Review (4–5★)', weight: '+3', icon: '⭐' },
    { event: 'RFQ Fulfilled', weight: '+8', icon: '📦' },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-24"
      style={{ background: 'var(--color-surface)' }}
      aria-labelledby="trust-heading"
    >
      <div className="container grid md:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-accent font-ui">Trust System</p>
          <h2 id="trust-heading" className="font-display text-4xl md:text-5xl font-light leading-tight">
            Trust that's earned, explained, and real.
          </h2>
          <p className="text-brand-muted font-ui text-lg leading-relaxed">
            Every artisan and buyer has an explainable Trust Score (0–100) built from verified
            actions. Not just stars — a full breakdown of why you should trust them.
          </p>
        </div>

        <div className="space-y-4">
          {TRUST_EVENTS.map((item, i) => (
            <div
              key={item.event}
              ref={(el) => { itemsRef.current[i] = el; }}
              className="flex items-center justify-between p-4 rounded-xl"
              style={{ background: 'var(--color-bg-primary)' }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl" aria-hidden="true">{item.icon}</span>
                <span className="font-ui text-brand-text">{item.event}</span>
              </div>
              <span
                className="font-ui font-semibold px-3 py-1 rounded-full text-white text-sm"
                style={{ background: 'var(--color-accent)' }}
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
