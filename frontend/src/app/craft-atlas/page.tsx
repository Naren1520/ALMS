'use client';

import { useState, useCallback } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
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
    culturalDescription: 'Chola dynasty lost-wax bronze sculptures and temple silk tapestries enriched with 22-karat gold foil foil inlay and unboiled silk weaves.',
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
      <main className="min-h-screen bg-ivory text-charcoal pt-28 pb-24 font-sans">
        <div className="container">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="w-8 h-px bg-gold" />
              <p className="overline text-gold">Heritage Cartography</p>
              <span className="w-8 h-px bg-gold" />
            </div>
            <h1
              className="font-serif text-charcoal font-light mb-4"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.1 }}
            >
              The Craft Atlas of India
            </h1>
            <p className="text-stone leading-relaxed text-base md:text-lg max-w-2xl mx-auto">
              Explore 3,000+ indigenous craft lineages spanning every state and union territory.
              Select a region to discover registered master artisans, GI tags, and cultural legacies.
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left: Map & Region Selector (7 cols) */}
            <div className="lg:col-span-7 bg-ivory-dark border border-border p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-gold" />
                  <span className="font-serif text-lg text-charcoal font-medium">Interactive Map</span>
                </div>
                {/* Search / filter box */}
                <div className="relative w-full sm:w-60">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-light" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Search state..."
                    className="w-full bg-ivory border border-border pl-8 pr-3 py-1.5 text-xs text-charcoal placeholder:text-stone-light focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
              </div>

              {/* State Quick Selection Pills */}
              <div className="flex flex-wrap gap-1.5 mb-6 max-h-24 overflow-y-auto pr-1">
                {filteredStates.map((state) => (
                  <button
                    key={state.code}
                    onClick={() => handleRegionSelect(state.code)}
                    className={`px-2.5 py-1 text-[11px] font-sans transition-all duration-200 cursor-pointer ${
                      selectedRegion === state.code
                        ? 'bg-charcoal text-ivory font-medium shadow-xs'
                        : 'bg-ivory border border-border text-stone hover:border-gold hover:text-charcoal'
                    }`}
                  >
                    {state.name}
                  </button>
                ))}
              </div>

              {/* SVG Map Canvas */}
              <div className="relative w-full aspect-[500/420] bg-ivory border border-border overflow-hidden p-2">
                <svg
                  viewBox="0 0 500 450"
                  className="w-full h-full"
                  role="img"
                  aria-label="Interactive map of India with artisan hubs"
                >
                  <defs>
                    <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#B8965A" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#B8965A" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Subdued map outline aesthetic */}
                  <path
                    d="M 190 70 Q 230 60 250 90 L 300 130 Q 380 140 420 150 L 390 200 L 340 210 Q 300 240 280 340 L 250 400 L 220 340 Q 180 250 170 210 Z"
                    fill="#EDE8DF"
                    stroke="#E2DDD6"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    opacity="0.7"
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
                          fill={isSelected ? '#B8965A' : '#FFFFFF'}
                          stroke={isSelected ? '#9A7A42' : '#C4A882'}
                          strokeWidth={isSelected ? '2.5' : '1.5'}
                          className="transition-all duration-300 group-hover:fill-gold group-hover:stroke-gold-dark group-hover:scale-110"
                        />
                        <text
                          x={state.cx}
                          y={state.cy + 3.5}
                          textAnchor="middle"
                          fontSize={isSelected ? '8' : '7'}
                          fontWeight={isSelected ? '700' : '500'}
                          fontFamily="var(--font-sans), sans-serif"
                          fill={isSelected ? '#FFFFFF' : '#1A1A1A'}
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
              <div className="bg-ivory-dark border border-border p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-border">
                  <div>
                    <span className="overline text-gold" style={{ fontSize: '0.6rem' }}>
                      Region Overview
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl text-charcoal font-medium mt-0.5">
                      {activeData.regionCode}
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="font-serif text-2xl text-gold font-light">
                      {activeData.artisanCount.toLocaleString('en-IN')}
                    </span>
                    <p className="overline text-stone" style={{ fontSize: '0.55rem' }}>
                      Registered Artisans
                    </p>
                  </div>
                </div>

                {/* Cultural Narrative */}
                <div className="mb-6">
                  <p className="text-stone leading-relaxed text-sm">{activeData.culturalDescription}</p>
                </div>

                {/* Featured Crafts */}
                <div className="mb-6">
                  <p className="overline text-stone-light mb-3" style={{ fontSize: '0.65rem' }}>
                    Signature Crafts &amp; GI Traditions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {activeData.crafts.map((craft) => (
                      <span
                        key={craft}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-ivory border border-border text-xs text-charcoal font-medium shadow-xs"
                      >
                        <Sparkles size={11} className="text-gold flex-shrink-0" />
                        {craft}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Verified Protection Badge */}
                <div className="flex items-center gap-3 p-3.5 bg-cream border border-border mb-6">
                  <ShieldCheck size={20} className="text-gold flex-shrink-0" />
                  <p className="text-xs text-stone leading-normal">
                    All listed craft clusters are verified by the Ministry of Social Justice &amp; Empowerment and GI registry.
                  </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href={`/explore?region=${selectedRegion}`}
                    className="btn-primary flex-1 justify-center text-xs py-3"
                  >
                    View Products
                    <ArrowRight size={13} aria-hidden="true" />
                  </Link>
                  <Link
                    href={`/artisans?region=${selectedRegion}`}
                    className="btn-outline flex-1 justify-center text-xs py-3"
                  >
                    Meet Artisans
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
