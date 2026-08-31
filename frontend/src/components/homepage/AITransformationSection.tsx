'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Camera, Mic, Calculator, Sparkles, CheckCircle2 } from 'lucide-react';

const PILLARS = [
  {
    icon: Camera,
    title: 'AI Image Studio & Lighting Normalization',
    desc: 'Automatically extracts products from noisy rural backgrounds (mud floors, tin sheds) and creates standardized high-res studio lighting.',
  },
  {
    icon: Mic,
    title: 'Multilingual Auto-Cataloger (Bhashini/Gemini)',
    desc: 'Artisans speak in 12+ native Indian languages. AI transcribes, translates, and generates structured English and Hindi product listings.',
  },
  {
    icon: Calculator,
    title: 'Dynamic Pricing Engine & Cost Floor Protection',
    desc: 'Computes raw materials, crafting hours, and regional wage indices to establish a defensible price floor and prevent buyer exploitation.',
  },
];

export default function AITransformationSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
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
          if (listRef.current) {
            gsap.from(Array.from(listRef.current.children), {
              opacity: 0,
              x: -32,
              stagger: 0.12,
              duration: 0.7,
              ease: 'power3.out',
              scrollTrigger: { trigger: listRef.current, start: 'top 75%' },
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
      className="pt-24 md:pt-32 pb-12 md:pb-16 overflow-hidden bg-[#24130A] text-white border-t border-amber-900/30"
      aria-labelledby="ai-pillars-heading"
    >
      <div className="container grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Left: Content */}
        <div>
          <div className="mb-5">
            <span
              className="inline-flex items-center gap-1.5 text-amber-300 font-sans font-semibold text-xs px-4 py-1.5 bg-[#FA7A21]/20 border border-[#FA7A21]/40 rounded-full uppercase tracking-wider"
            >
              Virtual Business Manager Architecture
            </span>
          </div>
          <h2
            id="ai-pillars-heading"
            className="font-serif text-white mb-6 font-light"
            style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)', lineHeight: 1.1 }}
          >
            Zero-Literacy AI Pipeline:<br />
            <em className="text-amber-200" style={{ fontStyle: 'italic' }}>
              One Photo. One Voice Note.
            </em>
          </h2>
          <p className="leading-relaxed mb-10 text-stone-100 text-base font-light">
            ALMS replaces complex e-commerce seller dashboards with an intuitive voice-first mobile pipeline. We solve the exact operational bottlenecks holding back rural micro-producers.
          </p>

          <div ref={listRef} className="space-y-4">
            {PILLARS.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="flex gap-4 p-4 sm:p-5 bg-[#331B10]/90 border border-white/10 hover:border-[#FA7A21]/50 transition-all duration-200 rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-[#FA7A21]/20 border border-[#FA7A21]/40 flex items-center justify-center text-[#FA7A21] shrink-0 mt-0.5">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-normal text-white mb-1">
                      {p.title}
                    </h3>
                    <p className="text-xs text-stone-200 leading-relaxed font-sans font-light">
                      {p.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Real Visual Transformation */}
        <div ref={imgRef} className="relative space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/4] overflow-hidden border border-white/10 rounded-2xl bg-black/40">
              <Image
                src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&q=70&auto=format&fit=crop"
                alt="Raw unedited artisan smartphone photo"
                fill
                className="object-cover grayscale contrast-75"
                sizes="25vw"
                unoptimized
              />
              <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-sm text-white text-[10px] px-2.5 py-1 font-sans font-medium rounded-lg">
                Raw Smartphone Photo
              </div>
            </div>
            <div className="relative aspect-[3/4] overflow-hidden border-2 border-[#FA7A21]/60 rounded-2xl shadow-xl shadow-orange-950/40">
              <Image
                src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&q=95&auto=format&fit=crop"
                alt="AI-enhanced studio listing"
                fill
                className="object-cover contrast-105"
                sizes="25vw"
                unoptimized
              />
              <div className="absolute bottom-3 right-3 bg-[#FA7A21] text-white px-2.5 py-1 font-sans font-semibold text-[10px] flex items-center gap-1 rounded-lg shadow-md">
                <Sparkles size={11} /> AI Studio Ready
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#331B10]/90 border border-white/10 flex items-center justify-between text-xs text-stone-300 rounded-xl">
            <span className="flex items-center gap-1.5 text-white">
              <CheckCircle2 size={15} className="text-[#FA7A21]" />
              Direct Output to ONDC &amp; B2B Buyers
            </span>
            <span className="text-amber-300 font-mono text-[11px]">Latency: ~1.2s</span>
          </div>
        </div>
      </div>
    </section>
  );
}
