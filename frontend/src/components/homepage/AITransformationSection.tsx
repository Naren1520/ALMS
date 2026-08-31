'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function AITransformationSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textColRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
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
          gsap.from(imgRef.current, {
            opacity: 0,
            x: 40,
            duration: 1,
            ease: 'expo.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
          });
          if (textColRef.current) {
            gsap.from(Array.from(textColRef.current.children), {
              opacity: 0,
              y: 24,
              stagger: 0.1,
              duration: 0.7,
              ease: 'power3.out',
              scrollTrigger: { trigger: textColRef.current, start: 'top 75%' },
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
      className="py-12 md:py-16 overflow-hidden bg-[#24130A] text-white border-t border-amber-900/30"
      aria-labelledby="ai-pillars-heading"
    >
      <div className="container">
        {/* Top Tier: Left Narrative Text & Right Dual-Image Transformation side-by-side */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left Column: Heading, Badge & Descriptive Copy */}
          <div ref={textColRef} className="space-y-5">
            <div>
              <span
                className="inline-flex items-center gap-1.5 text-amber-300 font-sans font-semibold text-xs px-4 py-1.5 bg-[#FA7A21]/20 border border-[#FA7A21]/40 rounded-full uppercase tracking-wider mb-4"
              >
                Virtual Business Manager Architecture
              </span>
              <h2
                id="ai-pillars-heading"
                className="font-serif text-white font-light text-3xl sm:text-4xl lg:text-5xl leading-tight"
              >
                Zero-Literacy AI Pipeline:<br />
                <em className="text-amber-200" style={{ fontStyle: 'italic' }}>
                  One Photo. One Voice Note.
                </em>
              </h2>
            </div>
            
            <p className="leading-relaxed text-stone-200 text-base font-light max-w-xl">
              ALMS replaces complex e-commerce seller dashboards with an intuitive voice-first mobile pipeline. We solve the exact operational bottlenecks holding back rural micro-producers by converting raw smartphone captures and native voice notes into standardized catalogs in seconds.
            </p>
          </div>

          {/* Right Column: Visual Before/After Photos side-by-side */}
          <div ref={imgRef} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-[4/3] overflow-hidden border border-white/10 rounded-2xl bg-black/40">
                <Image
                  src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&q=70&auto=format&fit=crop"
                  alt="Raw unedited artisan smartphone photo"
                  fill
                  className="object-cover grayscale contrast-75"
                  sizes="25vw"
                  unoptimized
                />
                <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-sm text-white text-[10px] sm:text-xs px-2.5 py-1 font-sans font-medium rounded-lg">
                  Raw Smartphone Photo
                </div>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden border-2 border-[#FA7A21]/60 rounded-2xl shadow-xl shadow-orange-950/40">
                <Image
                  src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&q=95&auto=format&fit=crop"
                  alt="AI-enhanced studio listing"
                  fill
                  className="object-cover contrast-105"
                  sizes="25vw"
                  unoptimized
                />
                <div className="absolute bottom-3 right-3 bg-[#FA7A21] text-white px-2.5 py-1 font-sans font-semibold text-[10px] sm:text-xs flex items-center gap-1 rounded-lg shadow-md">
                  <Sparkles size={12} /> AI Studio Ready
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-[#331B10]/90 border border-white/10 flex items-center justify-between text-xs text-stone-300 rounded-xl">
              <span className="flex items-center gap-1.5 text-white">
                <CheckCircle2 size={15} className="text-[#FA7A21]" />
                Direct Output to ONDC &amp; B2B Buyers
              </span>
              <span className="text-amber-300 font-mono text-[11px]">Latency: ~1.2s</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
