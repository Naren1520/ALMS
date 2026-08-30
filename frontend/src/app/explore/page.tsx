'use client';

import { useState, useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Sparkles, ArrowUpRight, ShieldCheck, Building2, Gift, CheckCircle2, Leaf, X } from 'lucide-react';

interface CraftProduct {
  id: string;
  name: string;
  category: 'Dokra & Brass' | 'Natural Basketry' | 'Folk Paintings' | 'Ethnic Stationery' | 'Handloom & Silk' | 'Blue Pottery';
  region: string;
  state: string;
  artisan: string;
  reliabilityScore: number;
  retailPrice: number;
  wholesaleMoq: number;
  wholesalePrice: number;
  image: string;
  giCertified: boolean;
  isEcoFriendly: boolean;
  leadTime: string;
  material: string;
}

const PRODUCTS: CraftProduct[] = [
  {
    id: '1',
    name: 'Bastar Tribal Dokra Brass Bull Figurine',
    category: 'Dokra & Brass',
    region: 'Kondagaon',
    state: 'Chhattisgarh',
    artisan: 'Rajan Sutar Collective',
    reliabilityScore: 96,
    retailPrice: 1850,
    wholesaleMoq: 25,
    wholesalePrice: 1250,
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80&auto=format&fit=crop',
    giCertified: true,
    isEcoFriendly: true,
    leadTime: '15 days',
    material: 'Lost-wax bell metal (Brass & beeswax)',
  },
  {
    id: '2',
    name: 'Hand-Braided Sabai Grass Fruit & Planter Basket',
    category: 'Natural Basketry',
    region: 'Baripada, Mayurbhanj',
    state: 'Odisha',
    artisan: 'Maa Durga SHG Guild',
    reliabilityScore: 95,
    retailPrice: 650,
    wholesaleMoq: 50,
    wholesalePrice: 420,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80&auto=format&fit=crop',
    giCertified: false,
    isEcoFriendly: true,
    leadTime: '10 days',
    material: 'Natural wild Sabai grass & cotton twine',
  },
  {
    id: '3',
    name: 'Tree-Free Handmade Cotton Rag Diary with Kalamkari Wrap',
    category: 'Ethnic Stationery',
    region: 'Sanganer',
    state: 'Rajasthan',
    artisan: 'Kagzi Paper Makers Guild',
    reliabilityScore: 98,
    retailPrice: 490,
    wholesaleMoq: 100,
    wholesalePrice: 310,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80&auto=format&fit=crop',
    giCertified: true,
    isEcoFriendly: true,
    leadTime: '12 days',
    material: '100% upcycled cotton rag handmade paper',
  },
  {
    id: '4',
    name: 'Tree of Life Madhubani Ritual Silk Scroll',
    category: 'Folk Paintings',
    region: 'Ranti, Mithila',
    state: 'Bihar',
    artisan: 'Meera Devi',
    reliabilityScore: 94,
    retailPrice: 4800,
    wholesaleMoq: 10,
    wholesalePrice: 3550,
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&q=80&auto=format&fit=crop',
    giCertified: true,
    isEcoFriendly: true,
    leadTime: '20 days',
    material: 'Tussar silk & organic flower extract dyes',
  },
  {
    id: '5',
    name: 'Warli Village Harmony Handpainted Wall Plate',
    category: 'Folk Paintings',
    region: 'Palghar',
    state: 'Maharashtra',
    artisan: 'Jivya Soma Clan',
    reliabilityScore: 93,
    retailPrice: 1250,
    wholesaleMoq: 30,
    wholesalePrice: 850,
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&q=80&auto=format&fit=crop',
    giCertified: true,
    isEcoFriendly: true,
    leadTime: '10 days',
    material: 'Natural rice paste & red terracotta base',
  },
  {
    id: '6',
    name: 'Persian Cobalt Blue Pottery Floral Vase',
    category: 'Blue Pottery',
    region: 'Jaipur',
    state: 'Rajasthan',
    artisan: 'Kripal Kumbh Guild',
    reliabilityScore: 95,
    retailPrice: 2200,
    wholesaleMoq: 20,
    wholesalePrice: 1650,
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&q=80&auto=format&fit=crop',
    giCertified: true,
    isEcoFriendly: true,
    leadTime: '14 days',
    material: 'Ground quartz, fuller earth & copper oxide glaze',
  },
  {
    id: '7',
    name: 'Hand-Spun Pure Pashmina Kani Weave Shawl',
    category: 'Handloom & Silk',
    region: 'Srinagar',
    state: 'Jammu & Kashmir',
    artisan: 'Ghulam Rasool',
    reliabilityScore: 99,
    retailPrice: 42000,
    wholesaleMoq: 5,
    wholesalePrice: 32000,
    image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80&auto=format&fit=crop',
    giCertified: true,
    isEcoFriendly: true,
    leadTime: '45 days',
    material: '100% Ladakhi Changthangi Cashmere wool',
  },
  {
    id: '8',
    name: 'Dokra Lost-Wax Tribal Tea Light & Incense Lamp',
    category: 'Dokra & Brass',
    region: 'Bastar',
    state: 'Chhattisgarh',
    artisan: 'Rajan Sutar Collective',
    reliabilityScore: 96,
    retailPrice: 1450,
    wholesaleMoq: 30,
    wholesalePrice: 980,
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80&auto=format&fit=crop',
    giCertified: true,
    isEcoFriendly: true,
    leadTime: '12 days',
    material: 'Solid bell metal tribal brass',
  },
  {
    id: '9',
    name: 'Kauna Grass Hand-Woven Laundry & Storage Hamper',
    category: 'Natural Basketry',
    region: 'Imphal',
    state: 'Manipur',
    artisan: 'Nongmaithem Weavers',
    reliabilityScore: 94,
    retailPrice: 1950,
    wholesaleMoq: 20,
    wholesalePrice: 1350,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80&auto=format&fit=crop',
    giCertified: false,
    isEcoFriendly: true,
    leadTime: '18 days',
    material: 'Sun-dried natural Kauna water reed',
  },
];

const CATEGORIES = [
  'All',
  'Dokra & Brass',
  'Natural Basketry',
  'Folk Paintings',
  'Ethnic Stationery',
  'Handloom & Silk',
  'Blue Pottery',
] as const;

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [giOnly, setGiOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'reliability'>('featured');
  const [quoteModalProduct, setQuoteModalProduct] = useState<CraftProduct | null>(null);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.artisan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.material.toLowerCase().includes(searchQuery.toLowerCase());
      const matchGi = !giOnly || p.giCertified;
      return matchCat && matchSearch && matchGi;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.retailPrice - b.retailPrice;
      if (sortBy === 'price-desc') return b.retailPrice - a.retailPrice;
      if (sortBy === 'reliability') return b.reliabilityScore - a.reliabilityScore;
      return 0;
    });
  }, [selectedCategory, searchQuery, giOnly, sortBy]);

  return (
    <>
      <Navbar />

      {/* Dark Hero Banner */}
      <section
        className="relative min-h-[45vh] flex items-center overflow-hidden pt-20"
        style={{ background: 'linear-gradient(135deg, #1A0D06 0%, #2B1810 60%, #1A0D06 100%)' }}
      >
        <div className="absolute inset-0 opacity-15"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 60%, #FA7A21 0%, transparent 50%), radial-gradient(circle at 80% 20%, #B8965A 0%, transparent 40%)' }}
        />
        <div className="container relative z-10 py-16 md:py-20">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs text-amber-200">
              <Gift size={14} className="text-[#FA7A21]" />
              <span className="font-sans font-medium tracking-wide">Curated Tribal & Folk Crafts &bull; Direct Sourcing, Zero Middlemen</span>
            </div>
            <h1
              className="font-serif text-white font-normal"
              style={{ fontSize: 'clamp(2.25rem, 5vw, 4rem)', lineHeight: 1.08, letterSpacing: '-0.015em' }}
            >
              Authentic Handcrafted<br />
              <em className="font-light text-amber-200" style={{ fontStyle: 'italic' }}>Treasures of India.</em>
            </h1>
            <p className="text-white font-sans text-base font-light max-w-2xl leading-relaxed">
              Sourced directly from indigenous artisan collectives, self-help groups (SHGs), and master craftspersons across India — available for direct consumer orders and bulk corporate gifting.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-white/15">
              {[
                { n: '9+', l: 'Craft Categories' },
                { n: 'GI Tagged', l: 'Authenticated Crafts' },
                { n: 'Direct', l: 'Artisan to Buyer' },
                { n: 'B2B Ready', l: 'Corporate Gifting' },
              ].map(({ n, l }) => (
                <div key={l}>
                  <p className="font-serif text-amber-200 text-xl sm:text-2xl font-light">{n}</p>
                  <p className="text-white text-[11px] font-sans mt-0.5">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main className="bg-[#2B1810] text-white font-sans pb-0 min-h-screen">
        <div className="container max-w-7xl py-14">

          {/* Filter Bar */}
          <ScrollReveal className="bg-[#1C0E07] border border-white/10 p-6 mb-12 rounded-2xl space-y-4" delay={0.1}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Search input */}
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Dokra, Sabai grass, Warli, Madhubani, or state..."
                  className="w-full bg-black/30 border border-white/15 pl-11 pr-4 py-2.5 text-xs text-white placeholder:text-stone-400 focus:outline-none focus:border-[#FA7A21]/60 rounded-full transition-colors"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setGiOnly((v) => !v)}
                  className={`px-4 py-2.5 text-xs font-semibold rounded-full border transition-all cursor-pointer flex items-center gap-1.5 ${
                    giOnly
                      ? 'bg-[#FA7A21] text-white border-[#FA7A21] shadow-md'
                      : 'bg-white/10 border-white/20 text-stone-100 hover:border-[#FA7A21]/60 hover:text-amber-200'
                  }`}
                >
                  <ShieldCheck size={14} className={giOnly ? 'text-white' : 'text-[#FA7A21]'} />
                  <span>GI Certified Only</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-stone-200">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'featured' | 'price-asc' | 'price-desc' | 'reliability')}
                    className="bg-black/30 border border-white/15 text-xs px-4 py-2 text-white rounded-full focus:outline-none focus:border-[#FA7A21]/60 cursor-pointer"
                  >
                    <option value="featured">Featured Collection</option>
                    <option value="reliability">Reliability Score</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/10">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs rounded-full transition-all duration-200 cursor-pointer font-medium ${
                    selectedCategory === cat
                      ? 'bg-[#FA7A21] text-white font-semibold shadow-md'
                      : 'bg-white/10 border border-white/20 text-stone-100 hover:border-[#FA7A21]/60 hover:text-amber-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <ScrollReveal key={product.id} delay={(index % 3) * 0.08}>
                <article className="group bg-[#1C0E07] border border-white/10 hover:border-[#FA7A21]/40 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5">
                  <div>
                    {/* Photo with hover zoom */}
                    <div className="relative aspect-[4/3] bg-stone-900 overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        unoptimized
                      />
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        {product.giCertified && (
                          <span className="bg-black/70 backdrop-blur-sm text-amber-200 uppercase tracking-wider px-3 py-1 text-[10px] font-bold border border-[#FA7A21]/40 rounded-full flex items-center gap-1">
                            <ShieldCheck size={12} className="text-[#FA7A21]" />
                            GI Certified
                          </span>
                        )}
                        {product.isEcoFriendly && (
                          <span className="bg-green-900/80 text-green-300 uppercase tracking-wider px-3 py-1 text-[10px] font-bold rounded-full flex items-center gap-1">
                            <Leaf size={10} /> Eco
                          </span>
                        )}
                      </div>
                      <span className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md text-amber-200 text-xs font-semibold px-3 py-1 rounded-full border border-white/15">
                        {product.reliabilityScore}% Reliable
                      </span>
                    </div>

                    {/* Body */}
                    <div className="p-6 sm:p-7 space-y-3">
                      <div className="flex items-center justify-between text-xs text-stone-300 font-light">
                        <span>{product.region}, {product.state}</span>
                        <span>Lead: {product.leadTime}</span>
                      </div>
                      <h2 className="font-serif text-xl font-normal text-white group-hover:text-amber-200 transition-colors leading-snug">
                        {product.name}
                      </h2>
                      <p className="text-xs text-stone-200">
                        By <span className="font-semibold text-white">{product.artisan}</span>
                      </p>
                      <p className="text-xs text-stone-300 line-clamp-1 italic font-light">
                        {product.material}
                      </p>
                    </div>
                  </div>

                  {/* Pricing & Actions Footer */}
                  <div className="p-6 sm:p-7 pt-0 border-t border-white/10 mt-2 pt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[9px] uppercase font-bold tracking-wider text-stone-300">Single Unit</p>
                        <p className="font-serif text-2xl text-white font-light">
                          ₹{product.retailPrice.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] uppercase font-bold tracking-wider text-[#FA7A21]">Wholesale MOQ: {product.wholesaleMoq}</p>
                        <p className="font-serif text-lg text-[#FA7A21] font-semibold">
                          ₹{product.wholesalePrice.toLocaleString('en-IN')} / unit
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 pt-1">
                      <button
                        onClick={() => setQuoteModalProduct(product)}
                        className="py-3 px-4 bg-white/10 border border-white/20 text-stone-100 hover:border-[#FA7A21]/60 hover:text-amber-200 text-xs font-semibold rounded-full transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Building2 size={13} /> B2B Quote
                      </button>
                      <Link
                        href={`/register?role=CONSUMER&product=${product.id}`}
                        className="py-3 px-4 bg-[#FA7A21] hover:bg-[#e06917] text-white text-xs font-semibold rounded-full transition-all flex items-center justify-center gap-1 shadow-md hover:shadow-orange-500/25"
                      >
                        Order Direct <ArrowUpRight size={13} />
                      </Link>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </main>

      {/* Quote Modal */}
      {quoteModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A0D06]/90 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#1C0E07] border border-white/15 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setQuoteModalProduct(null)}
              className="absolute top-5 right-5 text-stone-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-black/40 border border-white/15 overflow-hidden relative shrink-0">
                <Image src={quoteModalProduct.image} alt={quoteModalProduct.name} fill className="object-cover" unoptimized />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#FA7A21] bg-[#FA7A21]/10 px-2.5 py-0.5 rounded-full border border-[#FA7A21]/30">
                  Corporate Gifting RFQ
                </span>
                <h3 className="font-serif text-xl font-normal text-white leading-tight mt-1">{quoteModalProduct.name}</h3>
              </div>
            </div>

            <div className="p-4 bg-black/30 border border-white/10 rounded-xl text-xs space-y-1.5 text-stone-200">
              <p><strong className="text-white">Artisan Cluster:</strong> {quoteModalProduct.artisan} ({quoteModalProduct.region})</p>
              <p><strong className="text-white">Wholesale Price:</strong> ₹{quoteModalProduct.wholesalePrice} / unit (MOQ: {quoteModalProduct.wholesaleMoq}+ units)</p>
              <p><strong className="text-white">Customization:</strong> Custom branding, eco-friendly gift boxes, artisan story card included</p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-100 mb-1 uppercase tracking-wider">Company / Organization Name</label>
                <input type="text" placeholder="e.g. Tata Consultancy Services"
                  className="w-full p-3 bg-black/30 border border-white/15 rounded-xl text-xs text-white placeholder:text-stone-400 focus:outline-none focus:border-[#FA7A21]/60 transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-100 mb-1 uppercase tracking-wider">Quantity Needed</label>
                  <input type="number" defaultValue={quoteModalProduct.wholesaleMoq} min={quoteModalProduct.wholesaleMoq}
                    className="w-full p-3 bg-black/30 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-[#FA7A21]/60 transition-colors" />
                </div>
                <div>
                  <label className="block font-semibold text-stone-100 mb-1 uppercase tracking-wider">Required By</label>
                  <input type="date"
                    className="w-full p-3 bg-black/30 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-[#FA7A21]/60 transition-colors" />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                alert(`Quote request for ${quoteModalProduct.name} submitted directly to ${quoteModalProduct.artisan} cluster coordinator!`);
                setQuoteModalProduct(null);
              }}
              className="w-full py-4 px-6 bg-[#FA7A21] hover:bg-[#e06917] text-white font-semibold text-xs rounded-full shadow-lg hover:shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 size={16} />
              <span>Transmit RFQ to Cluster Coordinator</span>
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
