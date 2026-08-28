'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ArrowRight } from 'lucide-react';

const STATS = [
  { value: 12400, label: 'Verified Buyers', suffix: '+',    prefix: '' },
  { value: 850,   label: 'B2B Orders',      suffix: 'Cr+',  prefix: '₹' },
  { value: 340,   label: 'Districts',       suffix: '+',    prefix: '' },
];

export default function B2BSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const countersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const textRef     = useRef<HTMLDivElement>(null);
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
            opacity: 0, y: 28, stagger: 0.1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: textRef.current, start: 'top 75%' },
          });
        }
        STATS.forEach((stat, i) => {
          const el = countersRef.current[i];
          if (!el) return;
          const obj = { val: 0 };
          gsap.to(obj, {
            val: stat.value,
            duration: 1.8,
            ease: 'power2.out',
            snap: { val: 1 },
            onUpdate() { if (el) el.textContent = Math.floor(obj.val).toLocaleString('en-IN'); },
            scrollTrigger: { trigger: sectionRef.current, start: 'top 65%', once: true },
          });
        });
      });
    })();
    return () => ctx?.revert();
  }, [prefersReduced]);

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-32 overflow-hidden"
      style={{ background: '#F5F0E8' }}
      aria-labelledby="b2b-heading"
    >
      <div className="container grid md:grid-cols-2 gap-16 lg:gap-24 items-center">

        {/* Image */}
        <div className="relative h-[480px] overflow-hidden order-last md:order-first">
          <Image
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=85&auto=format&fit=crop"
            alt="Business buyers reviewing artisan catalog"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized
          />
          {/* Stats overlay strip */}
          <div className="absolute bottom-0 inset-x-0 bg-charcoal/92 px-8 py-6">
            <div className="grid grid-cols-3 gap-4 divide-x divide-white/15">
              {STATS.map((stat, i) => (
                <div key={stat.label} className="text-center px-2">
                  <p className="font-serif text-gold-light" style={{ fontSize: 'clamp(1.25rem, 2vw, 1.75rem)' }}>
                    {stat.prefix}
                    <span ref={(el) => { countersRef.current[i] = el; }}>0</span>
                    {stat.suffix}
                  </p>
                  <p className="overline text-stone-light mt-1" style={{ fontSize: '0.6rem' }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Text */}
        <div ref={textRef} className="space-y-8">
          <div>
            <p className="overline text-gold mb-4">B2B Commerce</p>
            <div className="w-10 h-px bg-gold mb-8" />
            <h2
              id="b2b-heading"
              className="font-serif text-charcoal leading-tight"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)', fontWeight: 300 }}
            >
              Bulk orders.<br />Fair prices.<br />
              <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Zero friction.</em>
            </h2>
          </div>

          <p className="text-stone leading-relaxed" style={{ fontSize: '1.0625rem' }}>
            Verified buyers submit RFQs. Our AI matches them with the right artisans in minutes.
            Wholesale pricing, production scheduling, and delivery estimation — automated.
          </p>

          <ul className="space-y-3">
            {[
              'Verified buyer network across 80+ countries',
              'AI-driven RFQ matching in under 2 minutes',
              'Transparent production timelines',
              'Escrow-protected payments',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-stone" style={{ fontSize: '0.9375rem' }}>
                <span className="w-1 h-1 rounded-full bg-gold mt-2.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          <Link href="/register?role=BUYER" className="btn-primary inline-flex items-center gap-2">
            Register as a Buyer
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

