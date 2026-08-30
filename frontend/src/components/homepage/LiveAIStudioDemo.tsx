'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Camera, Mic, Calculator, CheckCircle2, Sparkles, Volume2, ArrowRight, ShieldCheck, AlertTriangle, RefreshCw, Code2 } from 'lucide-react';

interface CraftPreset {
  id: string;
  name: string;
  region: string;
  category: string;
  rawImage: string;
  enhancedImage: string;
  audioLanguage: string;
  audioTranscript: string;
  extractedAttributes: {
    material: string;
    dimensions: string;
    productionDays: number;
    craftTradition: string;
    descriptionEn: string;
    descriptionHi: string;
  };
  costBreakdown: {
    rawMaterialCost: number;
    labourHours: number;
    hourlyWage: number;
    overheadCost: number;
    sustainableRetail: number;
    wholesaleMoq: number;
    sustainableWholesale: number;
  };
}

const PRESETS: CraftPreset[] = [
  {
    id: 'bamboo-basket',
    name: 'Bastar Handwoven Bamboo Storage Basket',
    region: 'Bastar, Chhattisgarh',
    category: 'Home & Utility',
    rawImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=70&auto=format&fit=crop',
    enhancedImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=95&auto=format&fit=crop',
    audioLanguage: 'Kannada / Gondi Dialect',
    audioTranscript: '“ನಮ್ಮ ಕಾಡಿನ ಬಿದಿರಿನಿಂದ ಕೈಯಿಂದ ನೇಯ್ದ ಬುಟ್ಟಿ ಇದು. ಇದನ್ನು ಮಾಡಲು ಮೂರು ದಿನ ಬೇಕಾಗುತ್ತದೆ. ಧಾನ್ಯ ಮತ್ತು ಬಟ್ಟೆ ಇಡಲು ಇದು ತುಂಬಾ ಗಟ್ಟಿಯಾಗಿದೆ...” (This is a basket handwoven from forest bamboo. Takes 3 days to craft. Very sturdy for storing grain and textiles.)',
    extractedAttributes: {
      material: 'Wild Treated Forest Bamboo & Natural Cane',
      dimensions: '35 cm (D) × 40 cm (H) &bull; Weight: 650g',
      productionDays: 3,
      craftTradition: 'Bastar Tribal Weaving (GI Tag Certified)',
      descriptionEn: 'Eco-friendly, tightly woven cylindrical storage basket crafted from mature bamboo strips using ancestral interlocking weave techniques.',
      descriptionHi: 'प्राकृतिक परिपक्व बांस से हाथ से बुनी गई टिकाऊ टोकरी, जो सदियों पुरानी जनजातीय बुनाई तकनीक से बनाई गई है।',
    },
    costBreakdown: {
      rawMaterialCost: 180,
      labourHours: 18,
      hourlyWage: 50,
      overheadCost: 60,
      sustainableRetail: 1450,
      wholesaleMoq: 25,
      sustainableWholesale: 1050,
    },
  },
  {
    id: 'madhubani-painting',
    name: 'Tree of Life Madhubani Silk Scroll',
    region: 'Mithila, Bihar',
    category: 'Traditional Paintings',
    rawImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&q=70&auto=format&fit=crop',
    enhancedImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&q=95&auto=format&fit=crop',
    audioLanguage: 'Maithili / Hindi',
    audioTranscript: '“ई मिथिलाक पारंपरिक कोहबर पेंटिंग छी। प्राकृतिक फूल आर पात के रंग सं बनाओल गेल अछि। बनाबै मे सात दिन लागल...” (This is traditional Mithila painting made using natural floral and mineral colors. Took 7 full days...)',
    extractedAttributes: {
      material: 'Handmade Tussar Silk Canvas & Mineral Pigments',
      dimensions: '60 cm × 90 cm (Unframed Canvas)',
      productionDays: 7,
      craftTradition: 'Mithila Kachni & Bharni Technique',
      descriptionEn: 'Sacred Tree of Life and celestial bird mural rendered on unbleached Tussar silk using bamboo twigs and organic plant dyes.',
      descriptionHi: 'प्राकृतिक वनस्पति रंगों और तसर सिल्क पर हाथ से बनाई गई पवित्र जीवन वृक्ष की पारंपरिक मिथिला पेंटिंग।',
    },
    costBreakdown: {
      rawMaterialCost: 650,
      labourHours: 42,
      hourlyWage: 65,
      overheadCost: 180,
      sustainableRetail: 4800,
      wholesaleMoq: 10,
      sustainableWholesale: 3550,
    },
  },
  {
    id: 'blue-pottery',
    name: 'Cobalt Floral Blue Pottery Urn',
    region: 'Jaipur, Rajasthan',
    category: 'Artisanal Ceramics',
    rawImage: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&q=70&auto=format&fit=crop',
    enhancedImage: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&q=95&auto=format&fit=crop',
    audioLanguage: 'Rajasthani / Hindi',
    audioTranscript: '“यो जयपुर को खास ब्लू पॉटरी को फूलदान छे। ईमे क्ले को इस्तेमाल कोनी होवे, क्वार्ट्ज और कांच स्यूं बण्यो है...” (This is Jaipur special blue pottery vase. No clay is used; made from quartz and glass...)',
    extractedAttributes: {
      material: 'Ground Quartz, Fuller Earth & Copper Oxide Glaze',
      dimensions: '22 cm (Base) × 38 cm (H) &bull; 1.8 kg',
      productionDays: 5,
      craftTradition: 'Jaipur Blue Pottery (No-Clay Ceramic)',
      descriptionEn: 'Hand-cast quartz vase decorated with Persian cobalt floral motifs and low-temperature natural kiln glazed finish.',
      descriptionHi: 'क्वार्ट्ज और तांबे के ऑक्साइड शीशे से निर्मित पारंपरिक जयपुरी नीली मिट्टी का फूलदान, बिना मिट्टी के बनाया गया।',
    },
    costBreakdown: {
      rawMaterialCost: 320,
      labourHours: 24,
      hourlyWage: 55,
      overheadCost: 120,
      sustainableRetail: 2200,
      wholesaleMoq: 20,
      sustainableWholesale: 1650,
    },
  },
  {
    id: 'pashmina-shawl',
    name: 'Hand-Spun Kani Pashmina Shawl',
    region: 'Srinagar, Kashmir',
    category: 'Luxury Handloom',
    rawImage: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=70&auto=format&fit=crop',
    enhancedImage: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=95&auto=format&fit=crop',
    audioLanguage: 'Kashmiri / Urdu',
    audioTranscript: '“یہ اصلی لداخی چنگتھانگی پشمینہ اون ہے۔ اس کان شال پر لکڑی کی کانیاں استعمال کرکے ۳ مہینے کا کام کیا گیا ہے...” (This is genuine Ladakhi Changthangi cashmere wool. Crafted over 3 months using wooden needles...)',
    extractedAttributes: {
      material: '100% Changthangi Grade-A Cashmere (14 Micron)',
      dimensions: '100 cm × 200 cm &bull; Weight: 210g',
      productionDays: 60,
      craftTradition: 'Kashmiri Kani Weave (GI Certified)',
      descriptionEn: 'Featherlight heirloom Pashmina shawl woven on traditional wooden handlooms with intricate paisley weave structures.',
      descriptionHi: '१००% शुद्ध लद्दाखी पश्मीना ऊन से हाथ से बुनी गई पारंपरिक कश्मीरी कानी शॉल।',
    },
    costBreakdown: {
      rawMaterialCost: 8500,
      labourHours: 280,
      hourlyWage: 80,
      overheadCost: 1200,
      sustainableRetail: 42000,
      wholesaleMoq: 5,
      sustainableWholesale: 32000,
    },
  },
];

export default function LiveAIStudioDemo() {
  const [selectedPresetId, setSelectedPresetId] = useState('bamboo-basket');
  const [activeTab, setActiveTab] = useState<'image' | 'voice' | 'pricing' | 'ondc'>('image');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showBefore, setShowBefore] = useState(false);
  const [testBuyerOffer, setTestBuyerOffer] = useState<number>(750);

  const preset = PRESETS.find((p) => p.id === selectedPresetId) || PRESETS[0];

  const totalCalculatedCost =
    preset.costBreakdown.rawMaterialCost +
    preset.costBreakdown.labourHours * preset.costBreakdown.hourlyWage +
    preset.costBreakdown.overheadCost;

  const isBelowCostFloor = testBuyerOffer < totalCalculatedCost;

  return (
    <section id="live-ai-studio" className="py-24 md:py-32 bg-[#2B1810] text-white font-sans border-t border-amber-900/30">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FA7A21]/15 border border-[#FA7A21]/30 rounded-full">
            <Sparkles size={13} className="text-[#FA7A21]" />
            <span className="text-amber-300 text-xs font-semibold uppercase tracking-wider">Interactive Demonstration</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-light text-white">
            Experience the Virtual Business Manager
          </h2>
          <p className="text-stone-100 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-light">
            Test how raw rural photos and native voice recordings are instantly transformed into commercial-grade listings with sustainable price protection.
          </p>
        </div>

        {/* Craft Presets Selector */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setSelectedPresetId(p.id);
                setTestBuyerOffer(p.costBreakdown.sustainableWholesale * 0.7);
              }}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                selectedPresetId === p.id
                  ? 'bg-[#FA7A21] text-white shadow-md'
                  : 'bg-white/10 border border-white/20 text-stone-100 hover:border-[#FA7A21]/60 hover:text-amber-200'
              }`}
            >
              <span>{p.name.split(' ')[0]} {p.name.split(' ')[1]}</span>
              <span className="text-[10px] opacity-80">({p.region.split(',')[0]})</span>
            </button>
          ))}
        </div>

        {/* Live Interactive Studio Box */}
        <div className="bg-[#1C0E07] border border-white/15 rounded-3xl shadow-2xl overflow-hidden max-w-5xl mx-auto">
          {/* Studio Navigation Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-white/10 bg-[#24130A] text-white">
            {[
              { id: 'image', label: '1. AI Image Enhancer', icon: Camera },
              { id: 'voice', label: '2. Voice Auto-Cataloger', icon: Mic },
              { id: 'pricing', label: '3. Dynamic Pricing & Floor', icon: Calculator },
              { id: 'ondc', label: '4. ONDC Payload & B2B', icon: Code2 },
            ].map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`py-4 px-4 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#1C0E07] text-amber-200 border-b-2 border-[#FA7A21] font-bold shadow-xs'
                      : 'text-stone-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={15} className={isActive ? 'text-[#FA7A21]' : 'text-stone-400'} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab 1: AI Image Enhancer */}
          {activeTab === 'image' && (
            <div className="p-6 sm:p-10 grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-amber-300 uppercase tracking-wider text-[11px] font-semibold mb-2 block">Feature #1</span>
                <h3 className="font-serif text-2xl sm:text-3xl text-white mb-3 font-light">
                  AI Image Studio &amp; Background Cleaner
                </h3>
                <p className="text-stone-100 text-xs sm:text-sm leading-relaxed mb-6 font-light">
                  Rural artisans photograph products on muddy floors or cluttered workshops. Our computer vision pipeline automatically isolates the subject, corrects uneven lighting, and generates professional white/studio e-commerce backgrounds.
                </p>

                <div className="space-y-2.5 mb-6">
                  <div className="flex items-center gap-2 text-xs text-stone-100">
                    <CheckCircle2 size={15} className="text-[#FA7A21] shrink-0" />
                    <span>Automatic clutter &amp; background removal</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-100">
                    <CheckCircle2 size={15} className="text-[#FA7A21] shrink-0" />
                    <span>Shadow balance &amp; natural lighting correction</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-100">
                    <CheckCircle2 size={15} className="text-[#FA7A21] shrink-0" />
                    <span>Standardized e-commerce 1:1 &amp; 4:3 high-res framing</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowBefore((v) => !v)}
                    className="px-5 py-2.5 bg-[#FA7A21] hover:bg-[#e06917] text-white text-xs font-semibold rounded-full shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <RefreshCw size={13} />
                    <span>Toggle {showBefore ? 'Enhanced' : 'Original Raw'} Image</span>
                  </button>
                  <span className="text-[11px] text-stone-300">
                    Showing: <strong className="text-white">{showBefore ? 'Raw Unedited Photo' : 'AI-Enhanced Studio Shot'}</strong>
                  </span>
                </div>
              </div>

              {/* Visual Frame */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/15 shadow-inner bg-black/40">
                <Image
                  src={showBefore ? preset.rawImage : preset.enhancedImage}
                  alt={preset.name}
                  fill
                  className={`object-cover transition-all duration-500 ${showBefore ? 'grayscale contrast-75' : 'contrast-105'}`}
                  sizes="50vw"
                  unoptimized
                />
                <div className="absolute top-3 left-3 bg-black/80 text-amber-200 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-white/15">
                  {showBefore ? 'Raw Smartphone Photo (Cluttered)' : 'AI Studio Cleaned (Marketplace Ready)'}
                </div>
                {!showBefore && (
                  <div className="absolute bottom-3 right-3 bg-[#FA7A21] text-white text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Sparkles size={11} /> AI Enhanced &bull; 0.8s
                  </div>
                )}
              </div>

              {/* Action Banner to full AI Studio Analyzer */}
              <div className="md:col-span-2 p-5 bg-gradient-to-r from-amber-950/80 via-[#2B1810] to-orange-950/80 border-2 border-[#FA7A21] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FA7A21] animate-ping" />
                    <p className="text-xs font-bold uppercase tracking-wider text-amber-300">
                      Live AI Craft &amp; Market Valuation Studio
                    </p>
                  </div>
                  <p className="text-xs text-white">
                    Upload your own custom smartphone photo, extract GI metadata, and compute defensible B2C/B2B fair-wage price floors.
                  </p>
                </div>
                <Link
                  href="/artisan/create-product"
                  className="px-6 py-3 bg-gradient-to-r from-[#FA7A21] via-orange-500 to-amber-500 hover:from-[#e06917] hover:to-orange-600 text-white font-bold text-xs rounded-full shadow-lg shadow-orange-500/30 transition-all flex items-center gap-2 shrink-0 transform hover:-translate-y-0.5"
                >
                  <Sparkles size={15} />
                  <span>🧠 Open Full AI Studio &amp; Upload Craft</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          )}

          {/* Tab 2: Multilingual Voice Auto-Cataloger */}
          {activeTab === 'voice' && (
            <div className="p-6 sm:p-10 grid md:grid-cols-2 gap-8 items-start">
              <div>
                <span className="text-amber-300 uppercase tracking-wider text-[11px] font-semibold mb-2 block">Feature #2</span>
                <h3 className="font-serif text-2xl sm:text-3xl text-white mb-3 font-light">
                  Voice-First Auto-Cataloging
                </h3>
                <p className="text-stone-100 text-xs sm:text-sm leading-relaxed mb-4 font-light">
                  Low-literacy artisans do not type descriptions or fill complex forms. They simply speak in their native tongue. AI extracts dimensions, material, craft legacy, and generates bilingual English + Hindi listings automatically.
                </p>

                {/* Voice player simulation */}
                <div className="p-4 bg-black/30 border border-white/10 rounded-xl mb-6 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-amber-200 flex items-center gap-1.5">
                      <Volume2 size={15} className="text-[#FA7A21]" />
                      Artisan Audio Note ({preset.audioLanguage})
                    </span>
                    <button
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      className="text-[11px] px-3 py-1 bg-[#FA7A21] text-white rounded-full hover:bg-[#e06917] transition-colors cursor-pointer"
                    >
                      {isPlayingAudio ? 'Pause' : 'Play Audio Sample'}
                    </button>
                  </div>
                  <p className="text-xs text-stone-200 italic leading-relaxed">
                    {preset.audioTranscript}
                  </p>
                </div>

                <div className="space-y-2 text-xs text-stone-100">
                  <p className="font-semibold text-amber-300 uppercase tracking-wider text-[11px]">
                    Extracted Craft Metadata:
                  </p>
                  <p><strong className="text-stone-300">Tradition:</strong> {preset.extractedAttributes.craftTradition}</p>
                  <p><strong className="text-stone-300">Material:</strong> {preset.extractedAttributes.material}</p>
                  <p><strong className="text-stone-300">Dimensions:</strong> {preset.extractedAttributes.dimensions}</p>
                  <p><strong className="text-stone-300">Crafting Time:</strong> {preset.extractedAttributes.productionDays} Days</p>
                </div>
              </div>

              {/* Generated Catalog Listing Preview */}
              <div className="bg-[#24130A] border border-amber-900/30 p-6 rounded-2xl space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-serif text-white font-medium">Bilingual Catalog Output</span>
                  <span className="text-[10px] bg-green-900/40 text-green-300 border border-green-700/40 font-semibold px-2.5 py-0.5 rounded-full">
                    Bhashini / Gemini Verified
                  </span>
                </div>

                <div>
                  <p className="text-[#FA7A21] uppercase tracking-wider text-[10px] font-semibold">English Listing</p>
                  <h4 className="font-serif text-lg font-light text-white mb-1">{preset.name}</h4>
                  <p className="text-xs text-stone-100 leading-relaxed font-light">{preset.extractedAttributes.descriptionEn}</p>
                </div>

                <div className="pt-3 border-t border-white/10">
                  <p className="text-[#FA7A21] uppercase tracking-wider text-[10px] font-semibold">Hindi Listing (हिंदी विवरण)</p>
                  <p className="text-xs text-stone-100 leading-relaxed font-sans font-light mt-1">{preset.extractedAttributes.descriptionHi}</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Dynamic Pricing Assistant & Anti-Exploitation Floor */}
          {activeTab === 'pricing' && (
            <div className="p-6 sm:p-10 space-y-8">
              <div className="max-w-3xl">
                <span className="text-amber-300 uppercase tracking-wider text-[11px] font-semibold mb-2 block">Feature #3</span>
                <h3 className="font-serif text-2xl sm:text-3xl text-white mb-2 font-light">
                  Defensible Cost Breakdown &amp; Sustainable Price Floor
                </h3>
                <p className="text-stone-100 text-xs sm:text-sm leading-relaxed font-light">
                  Instead of black-box &ldquo;AI magic&rdquo;, our pricing engine calculates real costs: raw materials + labour hours + overhead + regional indices to protect marginalized artisans from predatory wholesale buyer offers.
                </p>
              </div>

              {/* Transparent Cost Formula Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-black/30 border border-white/10 p-4 rounded-xl text-center">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-stone-300">Raw Material Cost</p>
                  <p className="font-serif text-xl text-white font-light mt-1">
                    ₹{preset.costBreakdown.rawMaterialCost}
                  </p>
                </div>
                <div className="bg-black/30 border border-white/10 p-4 rounded-xl text-center">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-stone-300">Labour ({preset.costBreakdown.labourHours} hrs @ ₹{preset.costBreakdown.hourlyWage}/hr)</p>
                  <p className="font-serif text-xl text-white font-light mt-1">
                    ₹{preset.costBreakdown.labourHours * preset.costBreakdown.hourlyWage}
                  </p>
                </div>
                <div className="bg-black/30 border border-white/10 p-4 rounded-xl text-center">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-stone-300">Overhead &amp; Logistics</p>
                  <p className="font-serif text-xl text-white font-light mt-1">
                    ₹{preset.costBreakdown.overheadCost}
                  </p>
                </div>
                <div className="bg-[#FA7A21]/15 border-2 border-[#FA7A21]/50 p-4 rounded-xl text-center shadow-md">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-[#FA7A21]">Cost Floor (Anti-Distress)</p>
                  <p className="font-serif text-2xl text-[#FA7A21] font-bold mt-1">
                    ₹{totalCalculatedCost}
                  </p>
                </div>
              </div>

              {/* Interactive Buyer Negotiation Simulation */}
              <div className="bg-[#24130A] border border-amber-900/30 p-6 rounded-2xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                  <span className="text-xs font-semibold text-white">
                    Simulate Buyer Wholesale Offer Negotiation:
                  </span>
                  <span className="text-xs text-amber-200">
                    Buyer Offers: <strong className="text-white text-base">₹{testBuyerOffer}</strong> / unit
                  </span>
                </div>

                <div className="space-y-2">
                  <input
                    type="range"
                    min={Math.round(totalCalculatedCost * 0.5)}
                    max={Math.round(totalCalculatedCost * 1.8)}
                    value={testBuyerOffer}
                    onChange={(e) => setTestBuyerOffer(Number(e.target.value))}
                    className="w-full accent-[#FA7A21] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-stone-300">
                    <span>Below Cost Floor (₹{Math.round(totalCalculatedCost * 0.5)})</span>
                    <span>Fair Floor: ₹{totalCalculatedCost}</span>
                    <span>Generous Margin (₹{Math.round(totalCalculatedCost * 1.8)})</span>
                  </div>
                </div>

                {isBelowCostFloor ? (
                  <div className="p-4 bg-red-900/30 border border-red-700/40 text-red-300 rounded-xl flex items-start gap-3 text-xs">
                    <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-200">Anti-Exploitation Alert Triggered</p>
                      <p className="mt-0.5 leading-relaxed text-red-300">
                        This offer (₹{testBuyerOffer}) is below the sustainable production cost floor (₹{totalCalculatedCost}). ALMS automatically blocks distress acceptance and proposes a fair counter-offer of ₹{preset.costBreakdown.sustainableWholesale}.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-green-900/30 border border-green-700/40 text-green-300 rounded-xl flex items-start gap-3 text-xs">
                    <CheckCircle2 size={18} className="text-green-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-200">Sustainable Fair-Trade Offer</p>
                      <p className="mt-0.5 leading-relaxed text-green-300">
                        Offer meets artisan livelihood requirements. Net artisan margin after all inputs: <strong>₹{testBuyerOffer - totalCalculatedCost} per unit</strong>.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 4: ONDC Payload Viewer */}
          {activeTab === 'ondc' && (
            <div className="p-6 sm:p-10 space-y-6">
              <div>
                <span className="text-amber-300 uppercase tracking-wider text-[11px] font-semibold mb-2 block">Feature #4</span>
                <h3 className="font-serif text-2xl sm:text-3xl text-white mb-2 font-light">
                  ONDC Protocol Standardized Payload
                </h3>
                <p className="text-stone-100 text-xs sm:text-sm leading-relaxed font-light">
                  ALMS maps the artisan&apos;s multimodal inputs directly into Beckn protocol-compliant schemas, ready for ingestion by ONDC buyer applications (Paytm, Mystore, Pincode).
                </p>
              </div>

              {/* JSON Payload viewer */}
              <div className="bg-black/60 text-amber-200 p-5 rounded-2xl font-mono text-xs overflow-x-auto border border-white/10 shadow-inner">
                <pre>{JSON.stringify({
                  context: {
                    domain: "nic2004:52110",
                    action: "on_search",
                    bap_id: "ondc.mock.buyer.app",
                    bpp_id: "alms.mosje.artisan.network",
                    timestamp: new Date().toISOString()
                  },
                  message: {
                    catalog: {
                      "bpp/descriptor": {
                        name: "ALMS Artisan Cluster - " + preset.region
                      },
                      "bpp/providers": [{
                        id: preset.id,
                        descriptor: { name: preset.name },
                        category_id: preset.category,
                        tags: [
                          { code: "gi_tagged", value: "true" },
                          { code: "sustainable_floor_price", value: String(preset.costBreakdown.sustainableWholesale) }
                        ],
                        items: [{
                          id: preset.id + "-item",
                          descriptor: {
                            name: preset.name,
                            short_desc: preset.extractedAttributes.descriptionEn,
                            symbol: preset.enhancedImage
                          },
                          price: {
                            currency: "INR",
                            value: String(preset.costBreakdown.sustainableRetail)
                          }
                        }]
                      }]
                    }
                  }
                }, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
