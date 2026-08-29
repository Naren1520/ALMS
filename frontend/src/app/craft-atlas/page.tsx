'use client';

import { useState, useCallback } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Sparkles, ArrowRight, ShieldCheck, Search } from 'lucide-react';

interface RegionData {
  regionCode: string;
  artisanCount: number;
  crafts: string[];
  sampleImages: string[];
  culturalDescription: string;
}

const REGION_DETAILS: Record<string, RegionData> = {
  JK: {
    regionCode: 'Jammu & Kashmir',
    artisanCount: 4200,
    crafts: ['Pashmina Weaving', 'Paper Mache', 'Walnut Wood Carving', 'Kani Shawls'],
    sampleImages: ['https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=600&q=80&auto=format&fit=crop'],
    culturalDescription: 'Centuries of Persian-influenced artisan guilds preserving pure cashmere wool spinning and intricate hand-knotted floral carpets along the Jhelum valley.',
  },
  RJ: {
    regionCode: 'Rajasthan',
    artisanCount: 18400,
    crafts: ['Blue Pottery', 'Bandhani Tie-Dye', 'Block Printing', 'Meenakari Jewellery', 'Kathputli Puppets'],
    sampleImages: ['https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80&auto=format&fit=crop'],
    culturalDescription: 'The royal atelier traditions of Jaipur and Jodhpur, celebrated for vibrant natural dye alchemy, quartz-based glaze pottery, and miniature court paintings.',
  },
  BR: {
    regionCode: 'Bihar',
    artisanCount: 9100,
    crafts: ['Madhubani Painting', 'Sikki Grass Craft', 'Manjusha Art', 'Bhagalpuri Silk'],
    sampleImages: ['https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80&auto=format&fit=crop'],
    culturalDescription: 'Ancient ritual wall and cloth murals originating from Mithila, painted with fingers, twigs, and natural mineral pigments depicting sacred nature motifs.',
  },
  UP: {
    regionCode: 'Uttar Pradesh',
    artisanCount: 24500,
    crafts: ['Chikankari Embroidery', 'Varanasi Zari Brocade', 'Moradabad Brassware', 'Firozabad Glasswork'],
    sampleImages: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&auto=format&fit=crop'],
    culturalDescription: 'Awadhi royal embroidery requiring decades of needlework mastery and handloom silk weaving along the sacred ghats of Varanasi.',
  },
  CG: {
    regionCode: 'Chhattisgarh',
    artisanCount: 6800,
    crafts: ['Dhokra Metal Casting', 'Bastar Wrought Iron', 'Kosa Silk', 'Terracotta'],
    sampleImages: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80&auto=format&fit=crop'],
    culturalDescription: '4,000-year-old lost-wax bell metal casting practiced by tribal metalsmiths in Bastar, echoing the ancient Dancing Girl of Mohenjo-daro.',
  },
  MH: {
    regionCode: 'Maharashtra',
    artisanCount: 11200,
    crafts: ['Warli Tribal Art', 'Paithani Sarees', 'Kolhapuri Chappals', 'Sawantwadi Lacquerware'],
    sampleImages: ['https://images.unsplash.com/photo-1504198266287-1659872e6590?w=600&q=80&auto=format&fit=crop'],
    culturalDescription: 'Indigenous agrarian geometric line art celebrating harvest gods, paired with gold-bordered Peshwa handloom silk traditions.',
  },
  GJ: {
    regionCode: 'Gujarat',
    artisanCount: 15600,
    crafts: ['Rogan Art', 'Kutch Embroidery', 'Ajrakh Block Print', 'Patan Patola'],
    sampleImages: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&auto=format&fit=crop'],
    culturalDescription: 'Castor oil paste painting by the sole surviving Khatri family master line, and double-ikat geometric silk heirlooms from Patan.',
  },
  WB: {
    regionCode: 'West Bengal',
    artisanCount: 14300,
    crafts: ['Kantha Embroidery', 'Terracotta Bankura Horse', 'Dhaka Jamdani', 'Dokra'],
    sampleImages: ['https://images.unsplash.com/photo-1604423975750-e1e9a729ef8e?w=600&q=80&auto=format&fit=crop'],
    culturalDescription: 'Running-stitch storytelling textiles and terracotta kiln architecture rooted in the rural artisan heartlands of Shantiniketan and Bishnupur.',
  },
  TN: {
    regionCode: 'Tamil Nadu',
    artisanCount: 19800,
    crafts: ['Tanjore Gold Paintings', 'Kanchipuram Silks', 'Swamimalai Bronze Idols', 'Pattamadai Mats'],
    sampleImages: ['https://images.unsplash.com/photo-1547612345-7f6e9f2bd6f6?w=600&q=80&auto=format&fit=crop'],
    culturalDescription: 'Chola dynasty lost-wax bronze sculptures and temple silk tapestries enriched with 22-karat gold foil inlay and unboiled silk weaves.',
  },
  KA: {
    regionCode: 'Karnataka',
    artisanCount: 13700,
    crafts: ['Channapatna Wooden Toys', 'Mysore Sandalwood Carving', 'Bidriware', 'Ilkal Sarees'],
    sampleImages: ['https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=80&auto=format&fit=crop'],
    culturalDescription: 'Eco-friendly natural lacquered ivory-wood toy crafts patronized since Tipu Sultan, and silver inlay on blackened zinc-copper Bidriware alloys.',
  },
  KL: {
    regionCode: 'Kerala',
    artisanCount: 8900,
    crafts: ['Aranmula Metal Mirror', 'Coir Craft', 'Kathakali Mask Carving', 'Nettur Petti Boxes'],
    sampleImages: ['https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=600&q=80&auto=format&fit=crop'],
    culturalDescription: 'Front-surface reflective metallurgy alloys whose exact metallurgical formula remains a sacred family secret passed down through temple artisans.',
  },
  OD: {
    regionCode: 'Odisha',
    artisanCount: 12100,
    crafts: ['Pattachitra Palm Leaf Art', 'Silver Filigree (Tarakasi)', 'Sambalpuri Ikat', 'Applique Pipli'],
    sampleImages: ['https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80&auto=format&fit=crop'],
    culturalDescription: 'Intricate palm-leaf engravings honoring Lord Jagannath, and featherlight silver gossamer wires spun into celestial filigree jewellery.',
  },
  AS: {
    regionCode: 'Assam',
    artisanCount: 7600,
    crafts: ['Muga Golden Silk', 'Bamboo & Cane Craft', 'Bell Metal Craft', 'Majuli Mask Making'],
    sampleImages: ['https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=600&q=80&auto=format&fit=crop'],
    culturalDescription: 'Wild natural shimmering golden silk endemic solely to the Brahmaputra valley and sacred bamboo theatre masks crafted on Majuli Island.',
  },
};

const INDIA_STATES = [
  { code: 'JK', name: 'Jammu & Kashmir', cx: 200, cy: 80 },
  { code: 'HP', name: 'Himachal Pradesh', cx: 220, cy: 110 },
  { code: 'PB', name: 'Punjab', cx: 190, cy: 130 },
  { code: 'HR', name: 'Haryana', cx: 215, cy: 145 },
  { code: 'DL', name: 'Delhi', cx: 225, cy: 160 },
  { code: 'RJ', name: 'Rajasthan', cx: 195, cy: 190 },
  { code: 'UP', name: 'Uttar Pradesh', cx: 260, cy: 175 },
  { code: 'UK', name: 'Uttarakhand', cx: 240, cy: 140 },
  { code: 'BR', name: 'Bihar', cx: 300, cy: 175 },
  { code: 'JH', name: 'Jharkhand', cx: 305, cy: 205 },
  { code: 'WB', name: 'West Bengal', cx: 335, cy: 200 },
  { code: 'SK', name: 'Sikkim', cx: 355, cy: 155 },
  { code: 'AS', name: 'Assam', cx: 380, cy: 165 },
  { code: 'MN', name: 'Manipur', cx: 395, cy: 195 },
  { code: 'MZ', name: 'Mizoram', cx: 385, cy: 215 },
  { code: 'TR', name: 'Tripura', cx: 365, cy: 210 },
  { code: 'ML', name: 'Meghalaya', cx: 365, cy: 180 },
  { code: 'NL', name: 'Nagaland', cx: 405, cy: 175 },
  { code: 'AR', name: 'Arunachal Pradesh', cx: 415, cy: 150 },
  { code: 'MP', name: 'Madhya Pradesh', cx: 245, cy: 215 },
  { code: 'GJ', name: 'Gujarat', cx: 175, cy: 225 },
  { code: 'MH', name: 'Maharashtra', cx: 220, cy: 260 },
  { code: 'CG', name: 'Chhattisgarh', cx: 285, cy: 240 },
  { code: 'OD', name: 'Odisha', cx: 315, cy: 240 },
  { code: 'TS', name: 'Telangana', cx: 265, cy: 295 },
  { code: 'AP', name: 'Andhra Pradesh', cx: 285, cy: 325 },
  { code: 'KA', name: 'Karnataka', cx: 240, cy: 330 },
  { code: 'GA', name: 'Goa', cx: 205, cy: 315 },
  { code: 'KL', name: 'Kerala', cx: 240, cy: 370 },
  { code: 'TN', name: 'Tamil Nadu', cx: 270, cy: 365 },
];

export default function CraftAtlasPage() {
  const [selectedRegion, setSelectedRegion] = useState<string>('RJ');
  const [searchFilter, setSearchFilter] = useState('');

  const handleRegionSelect = useCallback((code: string) => {
    setSelectedRegion(code);
    window.history.replaceState(null, '', `#state=${code}`);
  }, []);

  const activeData: RegionData =
    REGION_DETAILS[selectedRegion] ?? {
      regionCode: INDIA_STATES.find((s) => s.code === selectedRegion)?.name ?? selectedRegion,
      artisanCount: 3400,
      crafts: ['Traditional Handloom', 'Pottery', 'Folk Paintings', 'Wood Carving'],
      sampleImages: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&auto=format&fit=crop'],
      culturalDescription: 'Heritage artisan clusters preserving ancestral craft methodologies passed down over multiple generations.',
    };

  const filteredStates = INDIA_STATES.filter(
    (s) =>
      s.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      s.code.toLowerCase().includes(searchFilter.toLowerCase()),
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#2B1810] text-white pt-28 pb-24 font-sans">
        <div className="container max-w-7xl mx-auto px-4">
          {/* Header */}
          <ScrollReveal className="text-center max-w-3xl mx-auto mb-14 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FA7A21]/15 border border-[#FA7A21]/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles size={14} className="text-[#FA7A21]" />
              <span>Indigenous Heritage Cartography &bull; 3,000+ Traditions</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal text-white tracking-tight leading-tight">
              The Craft Atlas <br />
              <em className="text-amber-200" style={{ fontStyle: 'italic' }}>of Bharat</em>
            </h1>

            <p className="text-stone-100 font-sans text-base font-light max-w-2xl leading-relaxed">
              Explore 3,000+ indigenous craft lineages spanning every state and union territory. Select a region below to discover registered master artisans, GI tags, and cultural legacies.
            </p>
          </ScrollReveal>

          {/* Main Grid */}
          <ScrollReveal className="grid lg:grid-cols-12 gap-8 items-start" delay={0.1}>
            {/* Left: Map & Region Selector (7 cols) */}
            <div className="lg:col-span-7 bg-[#1C0E07] border border-white/10 p-6 sm:p-8 rounded-2xl shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <MapPin size={20} className="text-[#FA7A21]" />
                  <span className="font-serif text-xl text-white font-light">Interactive Heritage Map</span>
                </div>
                {/* Search / filter box */}
                <div className="relative w-full sm:w-64">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Search state..."
                    className="w-full bg-black/30 border border-white/15 pl-10 pr-3 py-2 text-xs text-white placeholder:text-stone-400 focus:outline-none focus:border-[#FA7A21]/60 rounded-full transition-colors"
                  />
                </div>
              </div>

              {/* State Quick Selection Pills */}
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                {filteredStates.map((state) => (
                  <button
                    key={state.code}
                    onClick={() => handleRegionSelect(state.code)}
                    className={`px-3 py-1.5 text-xs rounded-full transition-all duration-200 cursor-pointer font-medium ${
                      selectedRegion === state.code
                        ? 'bg-[#FA7A21] text-white font-semibold shadow-xs'
                        : 'bg-white/10 border border-white/20 text-stone-100 hover:border-[#FA7A21]/60 hover:text-amber-200'
                    }`}
                  >
                    {state.name}
                  </button>
                ))}
              </div>

              {/* SVG Map Canvas */}
              <div className="relative w-full aspect-[500/420] bg-[#24130A] border border-amber-900/30 rounded-2xl overflow-hidden p-2 shadow-inner">
                <svg
                  viewBox="0 0 500 450"
                  className="w-full h-full"
                  role="img"
                  aria-label="Interactive map of India with artisan hubs"
                >
                  <defs>
                    <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#FA7A21" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#FA7A21" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Subdued map outline aesthetic */}
                  <path
                    d="M 190 70 Q 230 60 250 90 L 300 130 Q 380 140 420 150 L 390 200 L 340 210 Q 300 240 280 340 L 250 400 L 220 340 Q 180 250 170 210 Z"
                    fill="#2B1810"
                    stroke="#5A3520"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    opacity="0.8"
                  />

                  {INDIA_STATES.map((state) => {
                    const isSelected = selectedRegion === state.code;
                    return (
                      <g
                        key={state.code}
                        className="cursor-pointer group"
                        onClick={() => handleRegionSelect(state.code)}
                        role="button"
                        tabIndex={0}
                        aria-label={`${state.name} — click to view artisan heritage`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleRegionSelect(state.code);
                          }
                        }}
                      >
                        {isSelected && (
                          <circle cx={state.cx} cy={state.cy} r={28} fill="url(#mapGlow)" className="animate-pulse" />
                        )}
                        <circle
                          cx={state.cx}
                          cy={state.cy}
                          r={isSelected ? 16 : 12}
                          fill={isSelected ? '#FA7A21' : 'rgba(255,255,255,0.15)'}
                          stroke={isSelected ? '#FA7A21' : '#FA7A21'}
                          strokeWidth={isSelected ? '2.5' : '1.5'}
                          className="transition-all duration-300 group-hover:fill-[#FA7A21] group-hover:scale-110"
                        />
                        <text
                          x={state.cx}
                          y={state.cy + 3.5}
                          textAnchor="middle"
                          fontSize={isSelected ? '8' : '7'}
                          fontWeight={isSelected ? '700' : '600'}
                          fontFamily="var(--font-sans), sans-serif"
                          fill={isSelected ? '#FFFFFF' : '#EDE6DB'}
                          pointerEvents="none"
                        >
                          {state.code}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Right: Selected Region Detail Panel (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#1C0E07] border border-white/10 p-6 sm:p-8 rounded-2xl shadow-xl space-y-6">
                <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                      Region Overview
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl text-white font-light mt-0.5">
                      {activeData.regionCode}
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="font-serif text-2xl text-[#FA7A21] font-bold">
                      {activeData.artisanCount.toLocaleString('en-IN')}
                    </span>
                    <p className="text-[10px] text-stone-200 font-semibold uppercase tracking-wider">
                      Makers Onboarded
                    </p>
                  </div>
                </div>

                {/* Cultural Narrative */}
                <div>
                  <p className="text-stone-100 leading-relaxed text-sm font-light">{activeData.culturalDescription}</p>
                </div>

                {/* Featured Crafts */}
                <div className="space-y-2.5">
                  <p className="text-xs font-bold text-white uppercase tracking-wider">
                    Signature Crafts &amp; GI Traditions:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {activeData.crafts.map((craft) => (
                      <span
                        key={craft}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-black/30 border border-white/15 text-xs text-white font-medium rounded-full"
                      >
                        <Sparkles size={12} className="text-[#FA7A21] flex-shrink-0" />
                        {craft}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Verified Protection Badge */}
                <div className="flex items-center gap-3 p-4 bg-[#FA7A21]/10 border border-[#FA7A21]/20 rounded-xl">
                  <ShieldCheck size={22} className="text-[#FA7A21] flex-shrink-0" />
                  <p className="text-xs text-stone-100 leading-relaxed font-light">
                    All listed craft clusters are verified by the Ministry of Social Justice &amp; Empowerment and GI registry.
                  </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link
                    href={`/explore?region=${selectedRegion}`}
                    className="flex-1 py-3 px-6 bg-[#FA7A21] hover:bg-[#e06917] text-white text-xs font-semibold rounded-full text-center shadow-md hover:shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    <span>View Products</span>
                    <ArrowRight size={13} />
                  </Link>
                  <Link
                    href={`/artisans?region=${selectedRegion}`}
                    className="flex-1 py-3 px-6 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold rounded-full text-center transition-all flex items-center justify-center gap-2"
                  >
                    <span>Meet Artisans</span>
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </main>
      <Footer />
    </>
  );
}
