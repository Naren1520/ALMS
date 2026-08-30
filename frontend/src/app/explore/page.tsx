'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FolkArtBanner from '@/components/homepage/FolkArtBanner';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Sparkles, ArrowUpRight, ShieldCheck, Building2, Gift, CheckCircle2, Leaf, X, Database, ArrowRight } from 'lucide-react';

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
  justPublished?: boolean;
}

const FALLBACK_PRODUCTS: CraftProduct[] = [
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
    name: 'Mithila Madhubani Handpainted Tussar Silk Wall Scroll',
    category: 'Folk Paintings',
    region: 'Madhubani',
    state: 'Bihar',
    artisan: 'Shanti Devi Guild',
    reliabilityScore: 98,
    retailPrice: 4200,
    wholesaleMoq: 10,
    wholesalePrice: 2800,
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&q=80&auto=format&fit=crop',
    giCertified: true,
    isEcoFriendly: true,
    leadTime: '18 days',
    material: 'Pure Tussar Silk & Organic Botanical Pigments',
  },
  {
    id: '4',
    name: 'Jaipur Cobalt Floral Glazed Ceramic Urn Vase',
    category: 'Blue Pottery',
    region: 'Jaipur',
    state: 'Rajasthan',
    artisan: 'Kripal Kumbh Heritage',
    reliabilityScore: 94,
    retailPrice: 2100,
    wholesaleMoq: 20,
    wholesalePrice: 1350,
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&q=80&auto=format&fit=crop',
    giCertified: true,
    isEcoFriendly: true,
    leadTime: '12 days',
    material: 'Quartz Powder, Fuller Earth & Cobalt Oxide Glaze',
  },
  {
    id: '5',
    name: 'Royal Kanchipuram Pure Mulberry Silk Brocade Saree',
    category: 'Handloom & Silk',
    region: 'Kanchipuram',
    state: 'Tamil Nadu',
    artisan: 'Meenakshi Handloom Society',
    reliabilityScore: 99,
    retailPrice: 18500,
    wholesaleMoq: 5,
    wholesalePrice: 12800,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80&auto=format&fit=crop',
    giCertified: true,
    isEcoFriendly: true,
    leadTime: '25 days',
    material: '100% Pure Mulberry Silk & Silver Zari',
  },
  {
    id: '6',
    name: 'Kashmiri Hand-Spun Diamond Weave Pashmina Shawl',
    category: 'Handloom & Silk',
    region: 'Srinagar',
    state: 'Jammu & Kashmir',
    artisan: 'Mirza Ghulam Artisans',
    reliabilityScore: 97,
    retailPrice: 14500,
    wholesaleMoq: 8,
    wholesalePrice: 9800,
    image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80&auto=format&fit=crop',
    giCertified: true,
    isEcoFriendly: true,
    leadTime: '30 days',
    material: '100% Grade-A Mountain Cashmere (Pashm)',
  },
  {
    id: '7',
    name: 'Warli Tribal Harvest & Tarpa Dance Canvas Art',
    category: 'Folk Paintings',
    region: 'Palghar',
    state: 'Maharashtra',
    artisan: 'Jivya Soma Clan',
    reliabilityScore: 95,
    retailPrice: 2800,
    wholesaleMoq: 15,
    wholesalePrice: 1750,
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&q=80&auto=format&fit=crop',
    giCertified: true,
    isEcoFriendly: true,
    leadTime: '10 days',
    material: 'Rice Flour Paste & Geru Earth Clay on Canvas',
  },
  {
    id: '8',
    name: 'Bidriware Pure Silver Wire Inlaid Zinc Alloy Flower Vase',
    category: 'Dokra & Brass',
    region: 'Bidar',
    state: 'Karnataka',
    artisan: 'Ustad Bilal Heritage Crafts',
    reliabilityScore: 96,
    retailPrice: 5600,
    wholesaleMoq: 10,
    wholesalePrice: 3800,
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80&auto=format&fit=crop',
    giCertified: true,
    isEcoFriendly: true,
    leadTime: '14 days',
    material: 'Zinc-Copper Alloy, 99.9% Fine Silver Inlay',
  }
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

function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<CraftProduct[]>(FALLBACK_PRODUCTS);
  const [isLiveFromSupabase, setIsLiveFromSupabase] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'All');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('state') || searchParams.get('q') || '');
  const [giOnly, setGiOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'reliability'>('featured');
  const [quoteModalProduct, setQuoteModalProduct] = useState<CraftProduct | null>(null);
  const [directOrderProduct, setDirectOrderProduct] = useState<CraftProduct | null>(null);
  const [directOrderPlaced, setDirectOrderPlaced] = useState(false);

  function handleOrderDirect(product: CraftProduct) {
    setDirectOrderProduct(product);
    setDirectOrderPlaced(false);
  }

  useEffect(() => {
    const stateParam = searchParams.get('state');
    const categoryParam = searchParams.get('category');
    if (stateParam) setSearchQuery(stateParam);
    if (categoryParam) setSelectedCategory(categoryParam);
  }, [searchParams]);

  useEffect(() => {
    async function fetchSupabaseProducts() {
      try {
        const res = await fetch('/api/v1/products');
        if (!res.ok) throw new Error('Failed to load products');
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped: CraftProduct[] = data.map((item: any) => {
            const firstMedia = item.media?.[0]?.enh || item.media?.[0]?.orig;
            return {
              id: item.id,
              name: item.title,
              category: (item.category as any) || 'Dokra & Brass',
              region: item.district || item.state || 'India',
              state: item.state || 'India',
              artisan: item.primary_craft ? `${item.primary_craft} Guild` : 'Master Artisan Collective',
              reliabilityScore: Math.round(Number(item.trust_score) || 95),
              retailPrice: Number(item.retail_price) || 1200,
              wholesaleMoq: Number(item.moq) || 10,
              wholesalePrice: Number(item.wholesale_price) || 800,
              image: firstMedia || 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80&auto=format&fit=crop',
              giCertified: Boolean(item.gi_eligible),
              isEcoFriendly: true,
              leadTime: item.lead_time_days ? `${item.lead_time_days} days` : '15 days',
              material: item.material || 'Natural indigenous materials',
            };
          });
          let combined = mapped;
          try {
            const custom = JSON.parse(localStorage.getItem('alms_custom_products') || '[]');
            if (Array.isArray(custom) && custom.length > 0) {
              combined = [...custom, ...mapped];
            }
          } catch (e) {
            console.error('Error reading custom products', e);
          }
          setProducts(combined);
          setIsLiveFromSupabase(true);
        }
      } catch (err) {
        console.warn('Using seeded offline cache:', err);
        try {
          const custom = JSON.parse(localStorage.getItem('alms_custom_products') || '[]');
          if (Array.isArray(custom) && custom.length > 0) {
            setProducts([...custom, ...FALLBACK_PRODUCTS]);
          }
        } catch (e) {}
      } finally {
        setLoading(false);
      }
    }

    fetchSupabaseProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
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
  }, [products, selectedCategory, searchQuery, giOnly, sortBy]);


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
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs text-amber-200">
                <Gift size={14} className="text-[#FA7A21]" />
                <span className="font-sans font-medium tracking-wide">Curated Tribal & Folk Crafts &bull; Zero Middlemen</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-950/50 backdrop-blur-md border border-emerald-500/50 rounded-full text-xs text-emerald-300">
                <Database size={13} className="text-emerald-400" />
                <span className="font-sans font-medium">{isLiveFromSupabase ? `Live Supabase Connected (${products.length} Products)` : 'Supabase PostgreSQL'}</span>
              </div>
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

      {/* Heritage Folk Art Ribbon Divider */}
      <FolkArtBanner height={75} variant="border-3" alt="Indian heritage tapestry border" />

      <main className="bg-[#2B1810] text-white font-sans pb-0 min-h-screen">
        <div className="container max-w-7xl py-14">

          {/* Filter Bar */}
          <ScrollReveal className="bg-[#1C0E07] border border-white/10 p-6 mb-12 rounded-2xl space-y-4" delay={0.1}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Search input */}
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Dokra, Sabai grass, Warli, Madhubani, or state..."
                  className="w-full bg-black/30 border border-white/15 pl-11 pr-4 py-2.5 text-xs text-white placeholder:text-white focus:outline-none focus:border-[#FA7A21]/60 rounded-full transition-colors"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setGiOnly((v) => !v)}
                  className={`px-4 py-2.5 text-xs font-semibold rounded-full border transition-all cursor-pointer flex items-center gap-1.5 ${
                    giOnly
                      ? 'bg-[#FA7A21] text-white border-[#FA7A21] shadow-md'
                      : 'bg-white/10 border-white/20 text-white hover:border-[#FA7A21]/60 hover:text-amber-200'
                  }`}
                >
                  <ShieldCheck size={14} className={giOnly ? 'text-white' : 'text-[#FA7A21]'} />
                  <span>GI Certified Only</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-white">Sort:</span>
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
                      : 'bg-white/10 border border-white/20 text-white hover:border-[#FA7A21]/60 hover:text-amber-200'
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
                    <div className="relative aspect-[4/3] bg-white overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        unoptimized
                      />
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                        {product.justPublished && (
                          <span className="bg-[#FA7A21] text-white uppercase tracking-wider px-3 py-1 text-[10px] font-bold rounded-full flex items-center gap-1 shadow-lg shadow-orange-500/50">
                            <Sparkles size={11} className="animate-spin" /> Just Published
                          </span>
                        )}
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
                      <span className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md text-amber-200 text-xs font-semibold px-3 py-1 rounded-full border border-white/15 z-10">
                        {product.reliabilityScore}% Reliable
                      </span>
                    </div>

                    {/* Body */}
                    <div className="p-6 sm:p-7 space-y-3">
                      <div className="flex items-center justify-between text-xs text-white font-light">
                        <span>{product.region}, {product.state}</span>
                        <span>Lead: {product.leadTime}</span>
                      </div>
                      <h2 className="font-serif text-xl font-normal text-white group-hover:text-amber-200 transition-colors leading-snug">
                        {product.name}
                      </h2>
                      <p className="text-xs text-white">
                        By <span className="font-semibold text-white">{product.artisan}</span>
                      </p>
                      <p className="text-xs text-white line-clamp-1 italic font-light">
                        {product.material}
                      </p>
                    </div>
                  </div>

                  {/* Pricing & Actions Footer */}
                  <div className="p-6 sm:p-7 pt-0 border-t border-white/10 mt-2 pt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[9px] uppercase font-bold tracking-wider text-white">Single Unit</p>
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
                        className="py-3 px-4 bg-white/10 border border-white/20 text-white hover:border-[#FA7A21]/60 hover:text-amber-200 text-xs font-semibold rounded-full transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Building2 size={13} /> B2B Quote
                      </button>
                      <button
                        onClick={() => handleOrderDirect(product)}
                        className="py-3 px-4 bg-[#FA7A21] hover:bg-[#e06917] text-white text-xs font-semibold rounded-full transition-all flex items-center justify-center gap-1 shadow-md hover:shadow-orange-500/25 cursor-pointer"
                      >
                        <span>Order Direct</span>
                        <ArrowUpRight size={13} />
                      </button>
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
              className="absolute top-5 right-5 text-white hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
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

            <div className="p-4 bg-black/30 border border-white rounded-xl text-xs space-y-1.5 text-white">
              <p><strong className="text-white">Artisan Cluster:</strong> {quoteModalProduct.artisan} ({quoteModalProduct.region})</p>
              <p><strong className="text-white">Wholesale Price:</strong> ₹{quoteModalProduct.wholesalePrice} / unit (MOQ: {quoteModalProduct.wholesaleMoq}+ units)</p>
              <p><strong className="text-white">Customization:</strong> Custom branding, eco-friendly gift boxes, artisan story card included</p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-white mb-1 uppercase tracking-wider">Company / Organization Name</label>
                <input type="text" placeholder="e.g. Tata Consultancy Services"
                  className="w-full p-3 bg-black/30 border border-white/15 rounded-xl text-xs text-white placeholder:text-white focus:outline-none focus:border-[#FA7A21]/60 transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-white mb-1 uppercase tracking-wider">Quantity Needed</label>
                  <input type="number" defaultValue={quoteModalProduct.wholesaleMoq} min={quoteModalProduct.wholesaleMoq}
                    className="w-full p-3 bg-black/30 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-[#FA7A21]/60 transition-colors" />
                </div>
                <div>
                  <label className="block font-semibold text-white mb-1 uppercase tracking-wider">Required By</label>
                  <input type="date"
                    className="w-full p-3 bg-black/30 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-[#FA7A21]/60 transition-colors" />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href={`/b2b/rfq?category=${encodeURIComponent(quoteModalProduct.category)}&title=${encodeURIComponent(quoteModalProduct.name)}&qty=${quoteModalProduct.wholesaleMoq}&price=${quoteModalProduct.wholesalePrice}`}
                className="w-full py-3.5 px-6 bg-black/40 border border-amber-600/40 hover:bg-[#FA7A21]/20 text-amber-200 font-semibold text-xs rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
              >
                <span>Launch in Multi-Cluster RFQ Engine</span>
                <ArrowRight size={14} />
              </Link>
              <button
                type="button"
                onClick={() => {
                  alert(`Quote inquiry for ${quoteModalProduct.name} sent to ${quoteModalProduct.artisan}!`);
                  setQuoteModalProduct(null);
                }}
                className="w-full py-3.5 px-6 bg-[#FA7A21] hover:bg-[#e06917] text-white font-semibold text-xs rounded-full shadow-lg hover:shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 size={16} />
                <span>Instant Inquire</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Consumer Direct Order Modal */}
      {directOrderProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A0D06]/90 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#1C0E07] border border-white/15 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setDirectOrderProduct(null)}
              className="absolute top-5 right-5 text-white hover:text-stone-300 p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-black/40 border border-white/15 overflow-hidden relative shrink-0">
                <Image src={directOrderProduct.image} alt={directOrderProduct.name} fill className="object-cover" unoptimized />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  Direct Artisan Order &bull; 100% Fair Wage
                </span>
                <h3 className="font-serif text-xl font-normal text-white leading-tight mt-1">{directOrderProduct.name}</h3>
                <p className="text-xs text-amber-200 mt-0.5">{directOrderProduct.artisan} &bull; {directOrderProduct.region}</p>
              </div>
            </div>

            {directOrderPlaced ? (
              <div className="p-6 bg-emerald-950/40 border border-emerald-500/50 rounded-2xl text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={24} />
                </div>
                <h4 className="font-serif text-lg text-white">Order Confirmed!</h4>
                <p className="text-xs text-stone-200 leading-relaxed">
                  Your order for <strong className="text-white">{directOrderProduct.name}</strong> has been routed to {directOrderProduct.artisan}. Track ID: <strong className="text-amber-300">ONDC-ORD-{Math.floor(100000 + Math.random() * 900000)}</strong>
                </p>
                <button
                  type="button"
                  onClick={() => setDirectOrderProduct(null)}
                  className="mt-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-full transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="p-4 bg-black/30 border border-white/15 rounded-xl text-xs space-y-2 text-white">
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-stone-300">Retail Unit Price:</span>
                    <span className="font-serif text-base font-semibold text-[#FA7A21]">₹{directOrderProduct.retailPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-stone-300">
                    <span>Artisan Direct Payment:</span>
                    <span className="text-emerald-400 font-medium">85% directly to artisan bank</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-stone-300">
                    <span>Estimated Dispatch:</span>
                    <span>{directOrderProduct.leadTime}</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-white mb-1 uppercase tracking-wider">Delivery Address &amp; Pincode</label>
                    <input
                      type="text"
                      placeholder="e.g. Flat 402, Green Glen Layout, Bellandur, Bengaluru — 560103"
                      className="w-full p-3 bg-black/30 border border-white/15 rounded-xl text-xs text-white placeholder:text-stone-400 focus:outline-none focus:border-[#FA7A21]/60 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-white mb-1 uppercase tracking-wider">Contact Phone / WhatsApp</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="w-full p-3 bg-black/30 border border-white/15 rounded-xl text-xs text-white placeholder:text-stone-400 focus:outline-none focus:border-[#FA7A21]/60 transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setDirectOrderPlaced(true)}
                  className="w-full py-3.5 px-6 bg-[#FA7A21] hover:bg-[#e06917] text-white font-semibold text-xs rounded-full shadow-lg hover:shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 size={16} />
                  <span>Confirm Direct Order (₹{directOrderProduct.retailPrice.toLocaleString('en-IN')})</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Bottom Heritage Ribbon */}
      <FolkArtBanner height={65} variant="border-1" alt="Heritage tapestry border" />

      <Footer />
    </>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#24130A] text-white flex items-center justify-center">Loading marketplace...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
