'use client';

import { useState, useRef } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
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
  Code2,
  RefreshCw,
  Sliders,
  Volume2
} from 'lucide-react';

const CRAFT_TEMPLATES = [
  {
    name: 'Bastar Bamboo Basket',
    region: 'Bastar, Chhattisgarh',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80&auto=format&fit=crop',
    voiceSample: '“ನಮ್ಮ ಕಾಡಿನ ಬಿದಿರಿನಿಂದ ಕೈಯಿಂದ ನೇಯ್ದ ಬುಟ್ಟಿ ಇದು. ಮೂರು ದಿನ ಬೇಕಾಗುತ್ತದೆ...”',
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
    voiceSample: '“ई मिथिलाक पारंपरिक कोहबर पेंटिंग छी। सात दिन लागल...”',
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
    voiceSample: '“यो जयपुर को खास ब्लू पॉटरी को फूलदान छे। क्वार्ट्ज और कांच स्यूं बण्यो है...”',
    material: 'Ground Quartz, Fuller Earth & Cobalt Glaze',
    labourHours: 24,
    hourlyWage: 55,
    materialCost: 320,
    overhead: 120,
  },
];

export default function CreateProductPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(0);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>(CRAFT_TEMPLATES[0].image);
  const [showEnhanced, setShowEnhanced] = useState(true);

  // Voice recording state
  const [recording, setRecording] = useState(false);
  const [voiceFile, setVoiceFile] = useState<File | null>(null);
  const [voiceSeconds, setVoiceSeconds] = useState(0);
  const [textInput, setTextInput] = useState(CRAFT_TEMPLATES[0].voiceSample);

  // Dynamic Pricing Sliders
  const [materialCost, setMaterialCost] = useState<number>(CRAFT_TEMPLATES[0].materialCost);
  const [labourHours, setLabourHours] = useState<number>(CRAFT_TEMPLATES[0].labourHours);
  const [hourlyWage, setHourlyWage] = useState<number>(CRAFT_TEMPLATES[0].hourlyWage);
  const [overhead, setOverhead] = useState<number>(CRAFT_TEMPLATES[0].overhead);

  // Job Submission State
  const [jobStatus, setJobStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const mediaRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Calculations
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
      setImages(files);
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
    setJobStatus('AI Pipeline running: Enhancing photo & generating bilingual catalog...');

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
      setJobStatus('Listing successfully generated and formatted for ONDC & B2B procurement networks!');
    }, 1800);
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-ivory text-charcoal pt-28 pb-24 font-sans">
        <div className="container max-w-4xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/30 rounded-full mb-3">
              <Sparkles size={13} className="text-gold" />
              <span className="overline text-gold text-[11px]">Zero-Literacy AI Studio</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-light mb-3">
              Virtual Business Manager Studio
            </h1>
            <p className="text-stone text-sm max-w-xl mx-auto leading-relaxed">
              Upload a craft photo, speak in any native Indian language, and adjust your defensible cost formula.
            </p>
          </div>

          {/* Quick Preset Pickers */}
          <div className="mb-8 p-4 bg-ivory-dark border border-border rounded-xl">
            <p className="text-xs font-semibold text-charcoal uppercase tracking-wider mb-2.5">
              Select Sample Craft Preset (Or Upload Your Own Below):
            </p>
            <div className="flex flex-wrap gap-2">
              {CRAFT_TEMPLATES.map((t, idx) => (
                <button
                  type="button"
                  key={t.name}
                  onClick={() => applyTemplate(idx)}
                  className={`px-3.5 py-2 text-xs rounded border transition-all cursor-pointer ${
                    selectedTemplate === idx
                      ? 'bg-charcoal text-ivory border-charcoal font-semibold shadow-xs'
                      : 'bg-white border-border text-stone hover:border-gold hover:text-charcoal'
                  }`}
                >
                  {t.name} ({t.region.split(',')[0]})
                </button>
              ))}
            </div>
          </div>

          {/* Studio Form Container */}
          <form onSubmit={handleSubmit} className="bg-ivory-dark border border-border p-6 sm:p-10 rounded-xl shadow-sm space-y-10">
            {/* Step 1: AI Image Studio */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="overline text-gold text-[11px]">Step 1 &bull; Photography</span>
                <button
                  type="button"
                  onClick={() => setShowEnhanced((v) => !v)}
                  className="text-xs text-stone hover:text-charcoal flex items-center gap-1.5 cursor-pointer font-medium"
                >
                  <RefreshCw size={13} />
                  Toggle {showEnhanced ? 'Raw' : 'AI Enhanced'} View
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6 items-center">
                {/* Upload box */}
                <div
                  className="border-2 border-dashed border-border hover:border-gold rounded-lg p-6 text-center cursor-pointer transition-colors bg-white"
                  onClick={() => document.getElementById('craft-photo-input')?.click()}
                >
                  <input
                    id="craft-photo-input"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleImageUpload}
                  />
                  <UploadCloud size={32} className="text-gold mx-auto mb-2" />
                  <p className="font-serif text-base text-charcoal font-medium">Click to Upload Raw Photo</p>
                  <p className="text-[11px] text-stone-light mt-1">JPEG, PNG, WebP &bull; Taken from any phone</p>
                </div>

                {/* Live Preview */}
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-border bg-cream shadow-inner">
                  <Image
                    src={imagePreviewUrl}
                    alt="Craft Preview"
                    fill
                    className={`object-cover transition-all duration-300 ${showEnhanced ? 'contrast-105' : 'grayscale contrast-75'}`}
                    unoptimized
                  />
                  <div className="absolute top-2 left-2 bg-charcoal/90 text-ivory text-[10px] overline px-2 py-0.5 rounded">
                    {showEnhanced ? 'AI Cleaned Studio Shot' : 'Raw Smartphone Shot'}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Voice Auto-Cataloger */}
            <div className="pt-8 border-t border-border">
              <span className="overline text-gold text-[11px] block mb-1">Step 2 &bull; Multilingual Voice</span>
              <h3 className="font-serif text-xl text-charcoal font-medium mb-3">Speak in Your Native Language</h3>
              <p className="text-xs text-stone mb-4">
                Record in Hindi, Kannada, Tamil, Bengali, Marathi, or Gujarati. AI handles translation &amp; technical listing metadata.
              </p>

              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  {!recording ? (
                    <button
                      type="button"
                      onClick={startRecording}
                      className="btn-primary inline-flex items-center gap-2 text-xs py-2.5 px-5 cursor-pointer"
                    >
                      <Mic size={14} className="text-gold-light" />
                      Record Native Audio Note
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="inline-flex items-center gap-2 text-xs py-2.5 px-5 bg-red-600 text-white rounded font-medium animate-pulse cursor-pointer"
                    >
                      <Square size={13} />
                      Stop Recording ({voiceSeconds}s)
                    </button>
                  )}

                  {voiceFile && (
                    <span className="text-xs text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded flex items-center gap-1.5">
                      <CheckCircle2 size={14} /> Voice note ready for transcription
                    </span>
                  )}
                </div>

                <div>
                  <label htmlFor="voice-notes" className="block text-xs font-semibold text-charcoal mb-1">
                    Transcribed Audio / Notes:
                  </label>
                  <textarea
                    id="voice-notes"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    rows={3}
                    className="w-full bg-white border border-border p-3 text-xs text-charcoal rounded focus:outline-none focus:border-gold resize-none shadow-xs"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Dynamic Pricing & Cost Floor Sliders */}
            <div className="pt-8 border-t border-border">
              <span className="overline text-gold text-[11px] block mb-1">Step 3 &bull; Pricing Assistant</span>
              <h3 className="font-serif text-xl text-charcoal font-medium mb-2">Defensible Cost Breakdown</h3>
              <p className="text-xs text-stone mb-6">
                Adjust raw material costs, crafting time, and hourly wages. ALMS enforces sustainable price floor protection.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 bg-cream/60 border border-border rounded-lg mb-6">
                <div>
                  <label className="flex justify-between text-xs font-semibold text-charcoal mb-1">
                    <span>Raw Material Cost:</span>
                    <span className="text-gold font-bold">₹{materialCost}</span>
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="10000"
                    step="50"
                    value={materialCost}
                    onChange={(e) => setMaterialCost(Number(e.target.value))}
                    className="w-full accent-gold"
                  />
                </div>

                <div>
                  <label className="flex justify-between text-xs font-semibold text-charcoal mb-1">
                    <span>Labour Crafting Duration:</span>
                    <span className="text-gold font-bold">{labourHours} Hours</span>
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="300"
                    step="2"
                    value={labourHours}
                    onChange={(e) => setLabourHours(Number(e.target.value))}
                    className="w-full accent-gold"
                  />
                </div>

                <div>
                  <label className="flex justify-between text-xs font-semibold text-charcoal mb-1">
                    <span>Hourly Fair Wage:</span>
                    <span className="text-gold font-bold">₹{hourlyWage}/hr</span>
                  </label>
                  <input
                    type="range"
                    min="30"
                    max="200"
                    step="5"
                    value={hourlyWage}
                    onChange={(e) => setHourlyWage(Number(e.target.value))}
                    className="w-full accent-gold"
                  />
                </div>

                <div>
                  <label className="flex justify-between text-xs font-semibold text-charcoal mb-1">
                    <span>Overhead &amp; Kiln/Tools:</span>
                    <span className="text-gold font-bold">₹{overhead}</span>
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="2000"
                    step="20"
                    value={overhead}
                    onChange={(e) => setOverhead(Number(e.target.value))}
                    className="w-full accent-gold"
                  />
                </div>
              </div>

              {/* Calculated Outputs */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3.5 bg-white border border-border rounded">
                  <p className="overline text-stone-light text-[10px]">Base Production Cost</p>
                  <p className="font-serif text-lg font-bold text-charcoal mt-0.5">₹{baseCost}</p>
                </div>
                <div className="p-3.5 bg-cream border border-gold/40 rounded">
                  <p className="overline text-gold text-[10px] font-bold">Wholesale Price Floor</p>
                  <p className="font-serif text-lg font-bold text-gold mt-0.5">₹{recommendedWholesale}</p>
                </div>
                <div className="p-3.5 bg-white border border-border rounded">
                  <p className="overline text-stone-light text-[10px]">Suggested Retail Price</p>
                  <p className="font-serif text-lg font-bold text-charcoal mt-0.5">₹{recommendedRetail}</p>
                </div>
              </div>
            </div>

            {/* Status Alert */}
            {jobStatus && (
              <div className={`p-4 rounded-lg text-xs flex items-center gap-2.5 ${isSuccess ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-cream text-charcoal border border-border'}`}>
                <CheckCircle2 size={16} className={isSuccess ? 'text-green-600' : 'text-gold'} />
                <span>{jobStatus}</span>
              </div>
            )}

            {/* Submit Action */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="btn-gold w-full justify-center py-4 text-xs font-semibold shadow-md cursor-pointer"
              >
                {submitting ? 'Generating ONDC Payload & Catalog...' : 'Publish to ONDC & B2B Procurement Networks'}
                <ArrowRight size={14} />
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
