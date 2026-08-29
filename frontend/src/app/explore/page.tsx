'use client';

import { useState, useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Filter, Sparkles, ArrowUpRight, ShieldCheck } from 'lucide-react';

interface CraftProduct {
  id: string;
  name: string;
  category: 'Textiles' | 'Pottery' | 'Metalwork' | 'Paintings' | 'Woodcraft' | 'Jewellery';
  region: string;
  artisan: string;
  trustScore: number;
  price: number;
  image: string;
  giCertified: boolean;
  leadTime: string;
}

const PRODUCTS: CraftProduct[] = [
  {
    id: '1',
    name: 'Kani Hand-Knotted Pashmina Shawl',
    category: 'Textiles',
    region: 'Srinagar, Kashmir',
    artisan: 'Ghulam Rasool',
    trustScore: 98,
    price: 48500,
    image: 'https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=800&q=80&auto=format&fit=crop',
    giCertified: true,
    leadTime: '60 days',
  },
  {
    id: '2',
    name: 'Classic Cobalt Blue Pottery Urn',
    category: 'Pottery',
    region: 'Jaipur, Rajasthan',
    artisan: 'Kripal Kumbh Guild',
    trustScore: 95,
    price: 8400,
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80&auto=format&fit=crop',
    giCertified: true,
    leadTime: '14 days',
  },
  {
    id: '3',
    name: 'Tree of Life Madhubani Silk Scroll',
    category: 'Paintings',
    region: 'Mithila, Bihar',
    artisan: 'Meera Devi',
    trustScore: 94,
    price: 16500,
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80&auto=format&fit=crop',
    giCertified: true,
    leadTime: '21 days',
  },
  {
    id: '4',
    name: 'Bastar Lost-Wax Dhokra Dancing Figurine',
    category: 'Metalwork',
    region: 'Bastar, Chhattisgarh',
    artisan: 'Rajan Sutar',
    trustScore: 96,
    price: 12200,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80&auto=format&fit=crop',
    giCertified: true,
    leadTime: '18 days',
  },
  {
    id: '5',
    name: 'Awadhi Shadow-Work Chikankari Kurta Fabric',
    category: 'Textiles',
    region: 'Lucknow, UP',
    artisan: 'Fatima Begum',
    trustScore: 97,
    price: 14900,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&auto=format&fit=crop',
    giCertified: true,
    leadTime: '30 days',
  },
  {
    id: '6',
    name: 'Warli Harvest Ritual Canvas',
    category: 'Paintings',
    region: 'Dahanu, Maharashtra',
    artisan: 'Jivya Soma Clan',
    trustScore: 93,
    price: 9500,
    image: 'https://images.unsplash.com/photo-1504198266287-1659872e6590?w=800&q=80&auto=format&fit=crop',
    giCertified: false,
    leadTime: '10 days',
  },
  {
    id: '7',
    name: 'Bidriware Silver Wire Inlaid Goblet',
    category: 'Metalwork',
    region: 'Bidar, Karnataka',
    artisan: 'Shah Rasheed Quadri',
    trustScore: 99,
    price: 22000,
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=80&auto=format&fit=crop',
    giCertified: true,
    leadTime: '25 days',
  },
  {
    id: '8',
    name: 'Channapatna Lacquered Toy Rocking Horse',
    category: 'Woodcraft',
    region: 'Channapatna, Karnataka',
    artisan: 'Basha Woodworks',
    trustScore: 92,
    price: 3800,
    image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=800&q=80&auto=format&fit=crop',
    giCertified: true,
    leadTime: '7 days',
  },
  {
    id: '9',
    name: 'Tarakasi Silver Filigree Peacock Brooch',
    category: 'Jewellery',
    region: 'Cuttack, Odisha',
    artisan: 'Pankaj Sahoo',
    trustScore: 96,
    price: 7800,
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=80&auto=format&fit=crop',
    giCertified: true,
    leadTime: '12 days',
  },
];

const CATEGORIES = ['All', 'Textiles', 'Pottery', 'Metalwork', 'Paintings', 'Woodcraft', 'Jewellery'] as const;

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [giOnly, setGiOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'trust'>('featured');

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.artisan.toLowerCase().includes(searchQuery.toLowerCase());
      const matchGi = !giOnly || p.giCertified;
      return matchCat && matchSearch && matchGi;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'trust') return b.trustScore - a.trustScore;
      return 0;
    });
  }, [selectedCategory, searchQuery, giOnly, sortBy]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-ivory text-charcoal pt-28 pb-24 font-sans">
        <div className="container">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="w-6 h-px bg-gold" />
              <p className="overline text-gold" style={{ fontSize: '0.65rem' }}>
                Curated Marketplace
              </p>
              <span className="w-6 h-px bg-gold" />
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-light mb-4">
              Discover Masterpieces of India
            </h1>
            <p className="text-stone text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
              Direct-from-source authentic creations. Every purchase empowers a verified master artisan and preserves centuries of living craft heritage.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="bg-ivory-dark border border-border p-4 sm:p-6 mb-10 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Search input */}
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-light" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by craft, state, or artisan..."
                  className="w-full bg-white border border-border pl-10 pr-4 py-2 text-xs text-charcoal placeholder:text-stone-light focus:outline-none focus:border-gold transition-colors shadow-xs"
                />
              </div>

              {/* Sort and GI Tag controls */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setGiOnly((v) => !v)}
                  className={`px-3 py-2 text-xs font-medium border flex items-center gap-1.5 transition-colors cursor-pointer ${
                    giOnly
                      ? 'bg-charcoal text-ivory border-charcoal'
                      : 'bg-white border-border text-stone hover:border-gold hover:text-charcoal'
                  }`}
                >
                  <ShieldCheck size={14} className={giOnly ? 'text-gold-light' : 'text-gold'} />
                  <span>GI Tagged Only</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-light">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-white border border-border text-xs px-3 py-2 text-charcoal focus:outline-none focus:border-gold"
                  >
                    <option value="featured">Featured</option>
                    <option value="trust">Highest Trust Score</option>
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
                  className={`px-3 py-1.5 text-xs tracking-wider transition-all duration-200 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-charcoal text-ivory font-medium shadow-xs'
                      : 'bg-ivory border border-border text-stone hover:border-gold hover:text-charcoal'
                  }`}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="group bg-ivory-dark border border-border overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col"
              >
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
                  {product.giCertified && (
                    <span className="absolute top-3 left-3 bg-ivory/95 backdrop-blur-sm text-charcoal overline px-2.5 py-1 text-[10px] font-semibold border border-border shadow-xs flex items-center gap-1">
                      <ShieldCheck size={11} className="text-gold" />
                      GI Certified
                    </span>
                  )}
                  <span className="absolute bottom-3 right-3 bg-charcoal/85 backdrop-blur-sm text-gold-light text-[11px] font-sans px-2.5 py-1 font-medium">
                    Trust {product.trustScore}/100
                  </span>
                </div>

                {/* Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-stone-light mb-1.5">
                      <span>{product.region}</span>
                      <span>Lead: {product.leadTime}</span>
                    </div>
                    <h2 className="font-serif text-xl font-medium text-charcoal group-hover:text-gold transition-colors mb-2 leading-snug">
                      {product.name}
                    </h2>
                    <p className="text-xs text-stone mb-4">
                      By <span className="font-medium text-charcoal">{product.artisan}</span>
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border flex items-center justify-between">
                    <div>
                      <p className="overline text-stone-light" style={{ fontSize: '0.55rem' }}>Direct Price</p>
                      <p className="font-serif text-2xl text-charcoal font-medium">
                        ₹{product.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <Link
                      href={`/register?role=BUYER&inquire=${product.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-charcoal text-ivory text-xs uppercase tracking-wider font-medium hover:bg-gold transition-colors"
                    >
                      Inquire <ArrowUpRight size={13} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="py-20 text-center bg-ivory-dark border border-border p-12 max-w-lg mx-auto">
              <Sparkles size={32} className="text-gold mx-auto mb-3" />
              <h3 className="font-serif text-2xl text-charcoal mb-2">No Crafts Found</h3>
              <p className="text-xs text-stone leading-relaxed mb-6">
                No items matched your specific filter combination. Try resetting your search or exploring another category.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                  setGiOnly(false);
                }}
                className="btn-primary text-xs"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
