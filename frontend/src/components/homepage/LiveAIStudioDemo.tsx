'use client';

import { useState } from 'react';
import Image from 'next/image';
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
    rawImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=70&auto=format&fit=crop',
    enhancedImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=90&auto=format&fit=crop',
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
    rawImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=70&auto=format&fit=crop',
    enhancedImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=90&auto=format&fit=crop',
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
    rawImage: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=70&auto=format&fit=crop',
    enhancedImage: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=90&auto=format&fit=crop',
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
    rawImage: 'https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=800&q=70&auto=format&fit=crop',
    enhancedImage: 'https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=800&q=90&auto=format&fit=crop',
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
    <section id="live-ai-studio" className="py-24 md:py-32 bg-ivory text-charcoal font-sans border-t border-border">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/30 rounded-full mb-3">
            <Sparkles size={13} className="text-gold" />
            <span className="overline text-gold text-[11px]">Interactive SIH Demonstration</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-light text-charcoal mb-4">
            Experience the Virtual Business Manager
          </h2>
          <p className="text-stone text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
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
              className={`px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                selectedPresetId === p.id
                  ? 'bg-charcoal text-ivory shadow-sm border border-charcoal'
                  : 'bg-ivory-dark border border-border text-stone hover:border-gold hover:text-charcoal'
              }`}
            >
              <span>{p.name.split(' ')[0]} {p.name.split(' ')[1]}</span>
              <span className="text-[10px] opacity-70">({p.region.split(',')[0]})</span>
            </button>
          ))}
        </div>

        {/* Live Interactive Studio Box */}
        <div className="bg-ivory-dark border border-border rounded-xl shadow-md overflow-hidden max-w-5xl mx-auto">
          {/* Studio Navigation Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-border bg-cream/60">
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
                  className={`py-3.5 px-4 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-ivory text-charcoal border-b-2 border-gold shadow-xs'
                      : 'text-stone hover:text-charcoal hover:bg-ivory/50'
                  }`}
                >
                  <Icon size={15} className={isActive ? 'text-gold' : 'text-stone-light'} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab 1: AI Image Enhancer */}
          {activeTab === 'image' && (
            <div className="p-6 sm:p-10 grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="overline text-gold text-[11px] mb-2 block">Mandatory PS Feature #1</span>
                <h3 className="font-serif text-2xl sm:text-3xl text-charcoal mb-3">
                  AI Image Studio &amp; Background Cleaner
                </h3>
                <p className="text-stone text-xs sm:text-sm leading-relaxed mb-6">
                  Rural artisans photograph products on muddy floors or cluttered workshops. Our computer vision pipeline automatically isolates the subject, corrects uneven lighting, and generates professional white/studio e-commerce backgrounds.
                </p>

                <div className="space-y-2.5 mb-6">
                  <div className="flex items-center gap-2 text-xs text-charcoal">
                    <CheckCircle2 size={15} className="text-gold shrink-0" />
                    <span>Automatic clutter &amp; background removal</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-charcoal">
                    <CheckCircle2 size={15} className="text-gold shrink-0" />
                    <span>Shadow balance &amp; natural lighting correction</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-charcoal">
                    <CheckCircle2 size={15} className="text-gold shrink-0" />
                    <span>Standardized e-commerce 1:1 &amp; 4:3 high-res framing</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowBefore((v) => !v)}
                    className="btn-primary text-xs py-2.5 px-5 cursor-pointer"
                  >
                    <RefreshCw size={13} className="mr-1.5" />
                    Toggle {showBefore ? 'Enhanced' : 'Original Raw'} Image
                  </button>
                  <span className="text-[11px] text-stone-light">
                    Showing: <strong>{showBefore ? 'Raw Unedited Photo' : 'AI-Enhanced Studio Shot'}</strong>
                  </span>
                </div>
              </div>

              {/* Visual Frame */}
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-border shadow-inner bg-cream">
                <Image
                  src={showBefore ? preset.rawImage : preset.enhancedImage}
                  alt={preset.name}
                  fill
                  className={`object-cover transition-all duration-500 ${showBefore ? 'grayscale contrast-75' : 'contrast-105'}`}
                  sizes="50vw"
                  unoptimized
                />
                <div className="absolute top-3 left-3 bg-charcoal/90 text-ivory text-[10px] overline px-2.5 py-1 rounded">
                  {showBefore ? 'Raw Smartphone Photo (Cluttered)' : 'AI Studio Cleaned (Marketplace Ready)'}
                </div>
                {!showBefore && (
                  <div className="absolute bottom-3 right-3 bg-gold/90 text-ivory text-[10px] font-semibold px-2.5 py-1 rounded flex items-center gap-1 shadow-sm">
                    <Sparkles size={11} /> AI Enhanced &bull; 0.8s
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Multilingual Voice Auto-Cataloger */}
          {activeTab === 'voice' && (
            <div className="p-6 sm:p-10 grid md:grid-cols-2 gap-8 items-start">
              <div>
                <span className="overline text-gold text-[11px] mb-2 block">Mandatory PS Feature #2</span>
                <h3 className="font-serif text-2xl sm:text-3xl text-charcoal mb-3">
                  Voice-First Auto-Cataloging
                </h3>
                <p className="text-stone text-xs sm:text-sm leading-relaxed mb-4">
                  Low-literacy artisans do not type descriptions or fill complex forms. They simply speak in their native tongue. AI extracts dimensions, material, craft legacy, and generates bilingual English + Hindi listings automatically.
                </p>

                {/* Voice player simulation */}
                <div className="p-4 bg-cream border border-border rounded-lg mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-charcoal flex items-center gap-1.5">
                      <Volume2 size={15} className="text-gold" />
                      Artisan Audio Note ({preset.audioLanguage})
                    </span>
                    <button
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      className="text-[11px] px-2.5 py-1 bg-charcoal text-ivory rounded hover:bg-gold transition-colors cursor-pointer"
                    >
                      {isPlayingAudio ? 'Pause' : 'Play Audio Sample'}
                    </button>
                  </div>
                  <p className="text-xs text-stone italic leading-relaxed">
                    {preset.audioTranscript}
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <p className="font-semibold text-charcoal uppercase tracking-wider text-[11px]">
                    Extracted Craft Metadata:
                  </p>
                  <p><strong className="text-stone-light">Tradition:</strong> {preset.extractedAttributes.craftTradition}</p>
                  <p><strong className="text-stone-light">Material:</strong> {preset.extractedAttributes.material}</p>
                  <p><strong className="text-stone-light">Dimensions:</strong> {preset.extractedAttributes.dimensions}</p>
                  <p><strong className="text-stone-light">Crafting Time:</strong> {preset.extractedAttributes.productionDays} Days</p>
                </div>
              </div>

              {/* Generated Catalog Listing Preview */}
              <div className="bg-ivory border border-border p-6 rounded-lg space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-xs font-serif text-charcoal font-medium">Bilingual Catalog Output</span>
                  <span className="text-[10px] bg-green-100 text-green-800 font-semibold px-2 py-0.5 rounded">
                    Bhashini / Gemini Verified
                  </span>
                </div>

                <div>
                  <p className="overline text-stone-light text-[10px]">English Listing</p>
                  <h4 className="font-serif text-lg font-medium text-charcoal mb-1">{preset.name}</h4>
                  <p className="text-xs text-stone leading-relaxed">{preset.extractedAttributes.descriptionEn}</p>
                </div>

                <div className="pt-3 border-t border-border">
                  <p className="overline text-stone-light text-[10px]">Hindi Listing (हिंदी विवरण)</p>
                  <p className="text-xs text-stone leading-relaxed font-sans mt-1">{preset.extractedAttributes.descriptionHi}</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Dynamic Pricing Assistant & Anti-Exploitation Floor */}
          {activeTab === 'pricing' && (
            <div className="p-6 sm:p-10 space-y-8">
              <div className="max-w-3xl">
                <span className="overline text-gold text-[11px] mb-2 block">Mandatory PS Feature #3</span>
                <h3 className="font-serif text-2xl sm:text-3xl text-charcoal mb-2">
                  Defensible Cost Breakdown &amp; Sustainable Price Floor
                </h3>
                <p className="text-stone text-xs sm:text-sm leading-relaxed">
                  Instead of black-box &ldquo;AI magic&rdquo;, our pricing engine calculates real costs: raw materials + labour hours + overhead + regional indices to protect marginalized artisans from predatory wholesale buyer offers.
                </p>
              </div>

              {/* Transparent Cost Formula Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-ivory border border-border p-4 rounded text-center">
                  <p className="overline text-stone-light text-[10px]">Raw Material Cost</p>
                  <p className="font-serif text-xl text-charcoal font-medium mt-1">
                    ₹{preset.costBreakdown.rawMaterialCost}
                  </p>
                </div>
                <div className="bg-ivory border border-border p-4 rounded text-center">
                  <p className="overline text-stone-light text-[10px]">Labour ({preset.costBreakdown.labourHours} hrs @ ₹{preset.costBreakdown.hourlyWage}/hr)</p>
                  <p className="font-serif text-xl text-charcoal font-medium mt-1">
                    ₹{preset.costBreakdown.labourHours * preset.costBreakdown.hourlyWage}
                  </p>
                </div>
                <div className="bg-ivory border border-border p-4 rounded text-center">
                  <p className="overline text-stone-light text-[10px]">Overhead &amp; Tools</p>
                  <p className="font-serif text-xl text-charcoal font-medium mt-1">
                    ₹{preset.costBreakdown.overheadCost}
                  </p>
                </div>
                <div className="bg-cream border border-gold/40 p-4 rounded text-center">
                  <p className="overline text-gold text-[10px] font-bold">Total Base Production Cost</p>
                  <p className="font-serif text-xl text-gold font-bold mt-1">
                    ₹{totalCalculatedCost}
                  </p>
                </div>
              </div>

              {/* Suggested Price vs Price Floor Anti-Exploitation Test */}
              <div className="p-6 bg-ivory border border-border rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-border">
                  <div>
                    <h4 className="font-serif text-lg text-charcoal font-medium">Anti-Exploitation Price Floor Simulator</h4>
                    <p className="text-xs text-stone">Test a corporate wholesale buyer offer against the artisan&apos;s base production cost.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-stone-light">Buyer Quote Offer:</span>
                    <input
                      type="number"
                      value={testBuyerOffer}
                      onChange={(e) => setTestBuyerOffer(Number(e.target.value))}
                      className="w-28 px-3 py-1.5 border border-border bg-white text-xs font-bold text-charcoal rounded text-right focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                {isBelowCostFloor ? (
                  <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 text-red-800 text-xs rounded">
                    <AlertTriangle size={18} className="text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">⚠️ Warning: Offer is below sustainable production cost!</p>
                      <p className="mt-0.5 text-red-700">
                        The proposed offer of ₹{testBuyerOffer} is ₹{totalCalculatedCost - testBuyerOffer} below the artisan&apos;s base production cost (₹{totalCalculatedCost}). ALMS automatically recommends countering at sustainable wholesale price (₹{preset.costBreakdown.sustainableWholesale}).
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 text-green-800 text-xs rounded">
                    <ShieldCheck size={18} className="text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">✅ Fair Commercial Offer Approved</p>
                      <p className="mt-0.5 text-green-700">
                        Offer exceeds the sustainable cost floor, ensuring fair daily wages for the artisan cluster.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 4: ONDC & B2B Sandbox Interoperability */}
          {activeTab === 'ondc' && (
            <div className="p-6 sm:p-10 space-y-6">
              <div className="max-w-3xl">
                <span className="overline text-gold text-[11px] mb-2 block">Interoperability Layer</span>
                <h3 className="font-serif text-2xl sm:text-3xl text-charcoal mb-2">
                  ONDC Protocol &amp; B2B Payload Generator
                </h3>
                <p className="text-stone text-xs sm:text-sm leading-relaxed">
                  ALMS generates schema-compliant ONDC Beckn protocol payloads, allowing rural artisan clusters to be discovered across ONDC buyer apps and B2B procurement networks.
                </p>
              </div>

              {/* JSON Payload viewer */}
              <div className="bg-[#1A1A1A] text-ivory p-5 rounded-lg font-mono text-xs overflow-x-auto shadow-inner">
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
