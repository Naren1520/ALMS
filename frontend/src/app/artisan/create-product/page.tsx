'use client';

import { useState, useRef } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import Image from 'next/image';
import { enqueue } from '@/lib/syncQueue';
import {
  UploadCloud,
  Mic,
  Square,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Calculator,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Camera,
  Check
} from 'lucide-react';

const CRAFT_TEMPLATES = [
  {
    name: 'Bastar Bamboo Basket',
    region: 'Bastar, Chhattisgarh',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80&auto=format&fit=crop',
    voiceSample: '"ನಮ್ಮ ಕಾಡಿನ ಬಿದಿರಿನಿಂದ ಕೈಯಿಂದ ನೇಯ್ದ ಬುಟ್ಟಿ ಇದು. ಮೂರು ದಿನ ಬೇಕಾಗುತ್ತದೆ..."',
    material: 'Natural Seasoned Bamboo & Cane',
    labourHours: 18,
    hourlyWage: 50,
    materialCost: 180,
    overhead: 60,
  },
  {
    name: 'Mithila Madhubani Silk Scroll',
    region: 'Mithila, Bihar',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80&auto=format&fit=crop',
    voiceSample: '"ई मिथिलाक पारंपरिक कोहबर पेंटिंग छी। सात दिन लागल..."',
    material: 'Tussar Silk & Organic Floral Dyes',
    labourHours: 42,
    hourlyWage: 65,
    materialCost: 650,
    overhead: 180,
  },
  {
    name: 'Jaipur Blue Pottery Urn',
    region: 'Jaipur, Rajasthan',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80&auto=format&fit=crop',
    voiceSample: '"यो जयपुर को खास ब्लू पॉटरी को फूलदान छे। क्वार्ट्ज और कांच स्यूं बण्यो है..."',
    material: 'Ground Quartz, Fuller Earth & Cobalt Glaze',
    labourHours: 24,
    hourlyWage: 55,
    materialCost: 320,
    overhead: 120,
  },
];

const DIALECTS = ['Hindi', 'ಕನ್ನಡ (Kannada)', 'বাংলা (Bengali)', 'தமிழ் (Tamil)', 'मराठी (Marathi)', 'ગુજરાતી (Gujarati)'];

export default function CreateProductPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(0);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>(CRAFT_TEMPLATES[0].image);
  const [showEnhanced, setShowEnhanced] = useState(true);
  const [selectedDialect, setSelectedDialect] = useState('Hindi');
  const [recording, setRecording] = useState(false);
  const [voiceFile, setVoiceFile] = useState<File | null>(null);
  const [voiceSeconds, setVoiceSeconds] = useState(0);
  const [textInput, setTextInput] = useState(CRAFT_TEMPLATES[0].voiceSample);
  const [materialCost, setMaterialCost] = useState<number>(CRAFT_TEMPLATES[0].materialCost);
  const [labourHours, setLabourHours] = useState<number>(CRAFT_TEMPLATES[0].labourHours);
  const [hourlyWage, setHourlyWage] = useState<number>(CRAFT_TEMPLATES[0].hourlyWage);
  const [overhead, setOverhead] = useState<number>(CRAFT_TEMPLATES[0].overhead);
  const [jobStatus, setJobStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const mediaRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const baseCost = materialCost + labourHours * hourlyWage + overhead;
  const recommendedRetail = Math.round(baseCost * 1.55);
  const recommendedWholesale = Math.round(baseCost * 1.25);

  function applyTemplate(index: number) {
    const t = CRAFT_TEMPLATES[index];
    setSelectedTemplate(index);
    setImagePreviewUrl(t.image);
    setTextInput(t.voiceSample);
    setMaterialCost(t.materialCost);
    setLabourHours(t.labourHours);
    setHourlyWage(t.hourlyWage);
    setOverhead(t.overhead);
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setImagePreviewUrl(url);
      setSelectedTemplate(null);
    }
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setVoiceFile(new File([blob], 'artisan_voice.webm', { type: 'audio/webm' }));
        stream.getTracks().forEach((t) => t.stop());
      };
      recorder.start();
      mediaRef.current = recorder;
      setRecording(true);
      setVoiceSeconds(0);
      timerRef.current = setInterval(() => setVoiceSeconds((v) => v + 1), 1000);
    } catch {
      alert('Microphone access unavailable. You can type or use the audio template.');
    }
  }

  function stopRecording() {
    mediaRef.current?.stop();
    if (timerRef.current) clearInterval(timerRef.current);
    setRecording(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setJobStatus('AI Pipeline running: Extracting background, translating voice note & generating ONDC catalog...');
    if (!navigator.onLine) {
      enqueue('PRODUCT_DRAFT', { textInput, materialCost, labourHours }, () => {});
      setJobStatus('Offline mode: Saved locally. Will sync to ONDC when reconnected.');
      setSubmitting(false);
      setIsSuccess(true);
      return;
    }
    setTimeout(() => {
      setSubmitting(false);
      setIsSuccess(true);
      setJobStatus('Listing successfully generated, price-protected, and formatted for ONDC & B2B procurement networks!');
    }, 1800);
  }

  return (
    <>
      <Navbar />
      {/* ── Hero banner matching homepage dark aesthetic ── */}
      <section
        className="relative min-h-[45vh] flex items-center overflow-hidden pt-20"
        style={{ background: 'linear-gradient(135deg, #1A0D06 0%, #2B1810 60%, #1A0D06 100%)' }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, #FA7A21 0%, transparent 50%), radial-gradient(circle at 80% 20%, #B8965A 0%, transparent 40%)',
          }}
        />
        <div className="container relative z-10 py-16 md:py-20">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs text-amber-200">
              <span className="w-2 h-2 rounded-full bg-[#FA7A21] animate-pulse" />
              <span className="font-sans font-medium tracking-wide">Zero-Literacy AI Studio &bull; MoSJE Virtual Business Manager</span>
            </div>
            <h1 className="font-serif text-white font-normal" style={{ fontSize: 'clamp(2.25rem, 5vw, 4rem)', lineHeight: 1.08, letterSpacing: '-0.015em' }}>
              AI Cataloging Studio<br />
              <em className="font-light text-amber-200" style={{ fontStyle: 'italic' }}>for India&apos;s Master Artisans.</em>
            </h1>
            <p className="text-white font-sans text-base font-light max-w-2xl leading-relaxed">
              One smartphone photo + one native voice note → studio-grade listing, defensible price floor, and ONDC payload in under 4 minutes.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 max-w-2xl">
              {[
                { icon: Camera, label: 'AI Image Studio', sub: 'Background Extraction' },
                { icon: Mic, label: 'Voice Cataloger', sub: '12+ Native Dialects' },
                { icon: Calculator, label: 'Dynamic Pricing', sub: 'Fair Price Floor' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="p-3 bg-black/40 backdrop-blur-md border border-white/15 rounded-2xl flex items-center gap-2.5">
                  <Icon size={18} className="text-[#FA7A21] shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-white">{label}</p>
                    <p className="text-[10px] text-white">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main className="bg-[#2B1810] text-white font-sans pb-0">
        <div className="container max-w-4xl py-14">

          {/* Preset Pickers */}
          <ScrollReveal className="mb-8 p-5 bg-[#1C0E07] border border-white/10 rounded-2xl" delay={0.05}>
            <p className="text-xs font-semibold text-amber-300 uppercase tracking-widest mb-3">Select Sample Craft Preset:</p>
            <div className="flex flex-wrap gap-2">
              {CRAFT_TEMPLATES.map((t, idx) => (
                <button
                  type="button"
                  key={t.name}
                  onClick={() => applyTemplate(idx)}
                  className={`px-4 py-2 text-xs rounded-full font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedTemplate === idx
                      ? 'bg-[#FA7A21] text-white font-semibold shadow-md'
                      : 'bg-white/10 border border-white/20 text-stone-100 hover:border-[#FA7A21]/60 hover:text-amber-200'
                  }`}
                >
                  {selectedTemplate === idx && <Check size={12} />}
                  <span>{t.name}</span>
                  <span className="opacity-75 text-[10px]">({t.region.split(',')[0]})</span>
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-[#1C0E07] border border-white/10 p-6 sm:p-10 rounded-2xl space-y-10">

            {/* Step 1 */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-[#FA7A21] text-white text-xs font-bold flex items-center justify-center shrink-0">1</span>
                  <h2 className="font-serif text-xl text-white font-light">AI Image Studio &bull; Photography</h2>
                </div>
                <button type="button" onClick={() => setShowEnhanced(v => !v)}
                  className="text-xs text-stone-200 bg-white/5 border border-white/15 hover:border-[#FA7A21]/60 hover:text-amber-200 rounded-full px-3.5 py-1.5 flex items-center gap-1.5 cursor-pointer transition-all">
                  <RefreshCw size={12} className="text-[#FA7A21]" />
                  Toggle {showEnhanced ? 'Raw' : 'AI Enhanced'} View
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div
                  className="border-2 border-dashed border-white/20 hover:border-[#FA7A21]/60 bg-black/30 hover:bg-[#FA7A21]/5 rounded-2xl p-8 text-center cursor-pointer transition-all group flex flex-col items-center min-h-[240px] justify-center"
                  onClick={() => document.getElementById('craft-photo-input')?.click()}
                >
                  <input id="craft-photo-input" type="file" accept="image/*" className="sr-only" onChange={handleImageUpload} />
                  <div className="w-14 h-14 rounded-full bg-[#FA7A21]/20 border border-[#FA7A21]/40 flex items-center justify-center text-[#FA7A21] mb-3 group-hover:scale-110 transition-transform">
                    <UploadCloud size={26} />
                  </div>
                  <p className="font-serif text-lg text-white font-light">Click to Upload Raw Photo</p>
                  <p className="text-xs text-stone-300 mt-1">Any budget smartphone photo</p>
                </div>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/15 bg-black/40 shadow-xl">
                  <Image
                    src={imagePreviewUrl}
                    alt="Craft Preview"
                    fill
                    className={`object-cover transition-all duration-500 ${showEnhanced ? 'contrast-105 saturate-110' : 'grayscale contrast-75'}`}
                    unoptimized
                  />
                  <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md text-amber-200 text-[10px] font-semibold px-3 py-1 rounded-full border border-white/15 flex items-center gap-1.5">
                    <Sparkles size={11} className="text-[#FA7A21]" />
                    {showEnhanced ? 'AI Studio Shot' : 'Raw Phone Shot'}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="pt-8 border-t border-white/10 space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
                <span className="w-7 h-7 rounded-full bg-[#FA7A21] text-white text-xs font-bold flex items-center justify-center shrink-0">2</span>
                <div>
                  <h2 className="font-serif text-xl text-white font-light">Multilingual Voice Auto-Cataloger</h2>
                  <p className="text-xs text-stone-200 mt-0.5">Speak naturally — AI translates and generates structured ONDC metadata.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {DIALECTS.map(lang => (
                  <button type="button" key={lang} onClick={() => setSelectedDialect(lang)}
                    className={`px-3.5 py-1.5 text-xs rounded-full border transition-all cursor-pointer font-medium ${
                      selectedDialect === lang
                        ? 'bg-[#FA7A21] text-white border-[#FA7A21] font-semibold'
                        : 'bg-white/10 border-white/20 text-stone-100 hover:border-[#FA7A21]/60 hover:text-amber-200'
                    }`}
                  >{lang}</button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {!recording ? (
                  <button type="button" onClick={startRecording}
                    className="px-6 py-3 bg-[#FA7A21] hover:bg-[#e06917] text-white font-semibold text-xs rounded-full shadow-md hover:shadow-orange-500/25 flex items-center gap-2 cursor-pointer transition-all transform hover:-translate-y-0.5">
                    <Mic size={15} /> Record Native Audio Note
                  </button>
                ) : (
                  <button type="button" onClick={stopRecording}
                    className="px-6 py-3 bg-red-700 hover:bg-red-800 text-white font-semibold text-xs rounded-full flex items-center gap-2 animate-pulse cursor-pointer">
                    <Square size={13} /> Stop ({voiceSeconds}s)
                  </button>
                )}
                {voiceFile && (
                  <span className="text-xs text-green-400 bg-green-900/40 border border-green-600/40 px-3.5 py-2 rounded-full flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> Voice captured
                  </span>
                )}
              </div>
              <div>
                <label htmlFor="voice-notes" className="block text-xs font-semibold text-white mb-1.5 uppercase tracking-wider">
                  Transcribed Audio / Story Notes:
                </label>
                <textarea
                  id="voice-notes"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  rows={3}
                  className="w-full bg-black/30 border border-white/15 p-4 text-xs text-white rounded-xl focus:outline-none focus:border-[#FA7A21]/60 resize-none"
                />
              </div>
            </div>

            {/* Step 3 */}
            <div className="pt-8 border-t border-white/10 space-y-6">
              <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
                <span className="w-7 h-7 rounded-full bg-[#FA7A21] text-white text-xs font-bold flex items-center justify-center shrink-0">3</span>
                <div>
                  <h2 className="font-serif text-xl text-white font-light">Defensible Cost Floor &amp; Pricing Engine</h2>
                  <p className="text-xs text-stone-200 mt-0.5">Anti-exploitation price floor based on crafting hours, materials, and regional wage indices.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-6 bg-[#24130A] border border-amber-900/30 rounded-2xl">
                {[
                  { label: 'Raw Material Cost', value: `₹${materialCost}`, min: 50, max: 10000, step: 50, val: materialCost, set: setMaterialCost, note: 'Natural dyes, silk, brass, bamboo' },
                  { label: 'Labour Crafting Duration', value: `${labourHours} Hours`, min: 2, max: 300, step: 2, val: labourHours, set: setLabourHours, note: 'Hands-on crafting time' },
                  { label: 'Hourly Fair Wage Rate', value: `₹${hourlyWage}/hr`, min: 30, max: 200, step: 5, val: hourlyWage, set: setHourlyWage, note: 'MoSJE benchmark rate' },
                  { label: 'Overhead & Kiln/Tools', value: `₹${overhead}`, min: 20, max: 2000, step: 20, val: overhead, set: setOverhead, note: 'Kiln, polishing, packaging' },
                ].map(({ label, value, min, max, step, val, set, note }) => (
                  <div key={label} className="space-y-1.5">
                    <label className="flex justify-between text-xs font-semibold text-stone-100">
                      <span>{label}:</span>
                      <span className="text-[#FA7A21] font-bold">{value}</span>
                    </label>
                    <input type="range" min={min} max={max} step={step} value={val}
                      onChange={e => set(Number(e.target.value))} className="w-full accent-[#FA7A21] cursor-pointer" />
                    <p className="text-[10px] text-stone-300">{note}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-black/30 border border-white/10 rounded-2xl">
                  <p className="text-[9px] uppercase font-bold tracking-wider text-stone-300">Base Production Cost</p>
                  <p className="font-serif text-2xl font-light text-white mt-1">₹{baseCost.toLocaleString('en-IN')}</p>
                </div>
                <div className="p-4 bg-[#FA7A21]/15 border-2 border-[#FA7A21]/50 rounded-2xl shadow-lg transform -translate-y-1">
                  <p className="text-[9px] uppercase font-bold tracking-wider text-[#FA7A21]">Wholesale Price Floor</p>
                  <p className="font-serif text-2xl font-bold text-[#FA7A21] mt-1">₹{recommendedWholesale.toLocaleString('en-IN')}</p>
                </div>
                <div className="p-4 bg-black/30 border border-white/10 rounded-2xl">
                  <p className="text-[9px] uppercase font-bold tracking-wider text-stone-300">Suggested Retail</p>
                  <p className="font-serif text-2xl font-light text-amber-200 mt-1">₹{recommendedRetail.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>

            {jobStatus && (
              <div className={`p-4 rounded-xl text-xs flex items-center gap-3 ${
                isSuccess ? 'bg-green-900/40 text-green-300 border border-green-700/40' : 'bg-[#FA7A21]/10 text-amber-200 border border-[#FA7A21]/30'
              }`}>
                <CheckCircle2 size={18} className={isSuccess ? 'text-green-400 shrink-0' : 'text-[#FA7A21] shrink-0'} />
                <span className="leading-relaxed">{jobStatus}</span>
              </div>
            )}

            <div className="pt-2">
              <button type="submit" disabled={submitting}
                className="w-full py-4 bg-[#FA7A21] hover:bg-[#e06917] text-white font-semibold text-sm rounded-full shadow-lg hover:shadow-orange-500/30 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50">
                <Sparkles size={16} />
                <span>{submitting ? 'Generating ONDC Payload...' : 'Publish to ONDC & B2B Procurement Networks'}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
