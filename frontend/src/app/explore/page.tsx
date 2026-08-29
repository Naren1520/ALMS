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
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?w=800&q=80&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1504198266287-1659872e6590?w=800&q=80&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=800&q=80&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=80&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80&auto=format&fit=crop',
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
      <main className="min-h-screen bg-ivory text-charcoal pt-28 pb-24 font-sans">
        <div className="container">
          {/* Header */}
          <ScrollReveal className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/30 rounded-full mb-3">
              <Gift size={13} className="text-gold" />
              <span className="overline text-gold text-[11px]">Curated Tribal &amp; Folk Crafts</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-light mb-4">
              Authentic Handcrafted Treasures
            </h1>
            <p className="text-stone text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              Sourced directly from indigenous artisan collectives, self-help groups (SHGs), and master craftspersons across India. Available for direct consumer orders and bulk corporate gifting.
            </p>
          </ScrollReveal>

          {/* Filter Bar */}
          <ScrollReveal className="bg-ivory-dark border border-border p-4 sm:p-6 mb-10 rounded-xl shadow-xs" delay={0.1}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Search input */}
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-light" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Dokra, Sabai grass, Warli, Madhubani, or state..."
                  className="w-full bg-white border border-border pl-10 pr-4 py-2.5 text-xs text-charcoal placeholder:text-stone-light focus:outline-none focus:border-gold transition-colors rounded shadow-xs"
                />
              </div>

              {/* Sort and GI Tag controls */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setGiOnly((v) => !v)}
                  className={`px-3 py-2 text-xs font-medium border rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
                    giOnly
                      ? 'bg-charcoal text-ivory border-charcoal'
                      : 'bg-white border-border text-stone hover:border-gold hover:text-charcoal'
                  }`}
                >
                  <ShieldCheck size={14} className={giOnly ? 'text-gold-light' : 'text-gold'} />
                  <span>GI Certified Only</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-light">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-white border border-border text-xs px-3 py-2 text-charcoal rounded focus:outline-none focus:border-gold"
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
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs rounded-full tracking-wider transition-all duration-200 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-charcoal text-ivory font-medium shadow-xs'
                      : 'bg-white border border-border text-stone hover:border-gold hover:text-charcoal'
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
              <article
                className="group bg-ivory-dark border border-border rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Photo with hover zoom */}
                  <div className="relative aspect-[4/3] bg-cream overflow-hidden">
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
                        <span className="bg-ivory/95 backdrop-blur-sm text-charcoal overline px-2.5 py-1 text-[10px] font-semibold border border-border rounded shadow-xs flex items-center gap-1">
                          <ShieldCheck size={11} className="text-gold" />
                          GI Certified
                        </span>
                      )}
                      {product.isEcoFriendly && (
                        <span className="bg-green-800/90 text-ivory overline px-2 py-1 text-[10px] font-semibold rounded shadow-xs flex items-center gap-1">
                          <Leaf size={10} /> Eco-Friendly
                        </span>
                      )}
                    </div>

                    <span className="absolute bottom-3 right-3 bg-charcoal/85 backdrop-blur-sm text-gold-light text-[11px] font-sans px-2.5 py-1 rounded font-medium">
                      Reliability {product.reliabilityScore}%
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-stone-light">
                      <span>{product.region}, {product.state}</span>
                      <span>Lead: {product.leadTime}</span>
                    </div>

                    <h2 className="font-serif text-xl font-medium text-charcoal group-hover:text-gold transition-colors leading-snug">
                      {product.name}
                    </h2>

                    <p className="text-xs text-stone">
                      By <span className="font-semibold text-charcoal">{product.artisan}</span>
                    </p>

                    <p className="text-[11px] text-stone-light line-clamp-1 italic">
                      Material: {product.material}
                    </p>
                  </div>
                </div>

                {/* Pricing & Actions Footer */}
                <div className="p-6 pt-0 border-t border-border/60 mt-4 pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="overline text-stone-light text-[9px]">Single Unit</p>
                      <p className="font-serif text-xl text-charcoal font-medium">
                        ₹{product.retailPrice.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="overline text-gold text-[9px] font-bold">Wholesale / Gifting (MOQ: {product.wholesaleMoq})</p>
                      <p className="font-serif text-base text-gold font-bold">
                        ₹{product.wholesalePrice.toLocaleString('en-IN')} / unit
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => setQuoteModalProduct(product)}
                      className="px-3 py-2.5 bg-cream border border-gold/40 text-charcoal hover:bg-gold hover:text-ivory text-xs font-semibold rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Building2 size={12} /> B2B Quote
                    </button>
                    <Link
                      href={`/register?role=CONSUMER&product=${product.id}`}
                      className="btn-primary text-xs py-2.5 justify-center"
                    >
                      Order Direct <ArrowUpRight size={13} />
                    </Link>
                  </div>
                </div>
              </article>
              </ScrollReveal>
            ))}
          </div>

          {/* Quote Modal */}
          {quoteModalProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/80 backdrop-blur-sm">
              <div className="bg-ivory border border-border rounded-xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
                <button
                  onClick={() => setQuoteModalProduct(null)}
                  className="absolute top-4 right-4 text-stone hover:text-charcoal p-1 cursor-pointer"
                >
                  <X size={20} />
                </button>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-cream border border-border overflow-hidden relative shrink-0">
                    <Image src={quoteModalProduct.image} alt={quoteModalProduct.name} fill className="object-cover" unoptimized />
                  </div>
                  <div>
                    <span className="overline text-gold text-[10px]">Corporate Gifting / B2B RFQ</span>
                    <h3 className="font-serif text-lg font-medium text-charcoal leading-tight">{quoteModalProduct.name}</h3>
                  </div>
                </div>

                <div className="p-4 bg-cream/70 rounded-lg text-xs space-y-1.5">
                  <p><strong>Artisan Cluster:</strong> {quoteModalProduct.artisan} ({quoteModalProduct.region})</p>
                  <p><strong>Wholesale Price:</strong> ₹{quoteModalProduct.wholesalePrice} / unit (MOQ: {quoteModalProduct.wholesaleMoq}+ units)</p>
                  <p><strong>Customization:</strong> Logo engraving, custom eco-boxes, personalized greeting cards</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-charcoal mb-1">Company / Organization Name</label>
                    <input type="text" placeholder="e.g. Tata Consultancy Services" className="w-full p-2.5 bg-white border border-border rounded text-xs text-charcoal focus:outline-none focus:border-gold" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-charcoal mb-1">Quantity Needed</label>
                      <input type="number" defaultValue={quoteModalProduct.wholesaleMoq} min={quoteModalProduct.wholesaleMoq} className="w-full p-2.5 bg-white border border-border rounded text-xs text-charcoal focus:outline-none focus:border-gold" />
                    </div>
                    <div>
                      <label className="block font-semibold text-charcoal mb-1">Required By (Date)</label>
                      <input type="date" className="w-full p-2.5 bg-white border border-border rounded text-xs text-charcoal focus:outline-none focus:border-gold" />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    alert(`Quote request for ${quoteModalProduct.name} submitted directly to ${quoteModalProduct.artisan} cluster coordinator!`);
                    setQuoteModalProduct(null);
                  }}
                  className="btn-gold w-full justify-center py-3 text-xs font-semibold shadow-sm cursor-pointer"
                >
                  <CheckCircle2 size={14} /> Transmit RFQ to Cluster Coordinator
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
