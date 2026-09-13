'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FolkArtBanner from '@/components/homepage/FolkArtBanner';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, Plus, Package, TrendingUp, Eye, Edit2, Trash2, CheckCircle2, Clock, Archive } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  status: string;
  category: string;
  retail_price: number;
  wholesale_price: number;
  inventory_qty: number;
  created_at: string;
  media?: Array<{ enh?: string; orig?: string }>;
}

const STATUS_COLORS: Record<string, string> = {
  PUBLISHED: 'bg-emerald-900/60 text-emerald-300 border-emerald-500/40',
  DRAFT: 'bg-stone-800 text-stone-300 border-stone-600/40',
  PAUSED: 'bg-amber-900/60 text-amber-300 border-amber-500/40',
  ARCHIVED: 'bg-red-900/60 text-red-300 border-red-500/40',
  OUT_OF_STOCK: 'bg-orange-900/60 text-orange-300 border-orange-500/40',
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  PUBLISHED: <CheckCircle2 size={12} />,
  DRAFT: <Edit2 size={12} />,
  PAUSED: <Clock size={12} />,
  ARCHIVED: <Archive size={12} />,
};

export default function MyProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('ALL');

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch('/api/v1/products', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error('Failed to load products');
        const data = await res.json();
        // Filter to only this artisan's products using stored user ID
        const storedUser = JSON.parse(localStorage.getItem('alms_user') || '{}');
        const artisanId = storedUser?.id;
        const mine = artisanId
          ? data.filter((p: any) => p.artisan_id === artisanId)
          : data;
        setProducts(mine);
      } catch (err: any) {
        // Fall back to local custom products
        try {
          const custom = JSON.parse(localStorage.getItem('alms_custom_products') || '[]');
          setProducts(custom.map((c: any) => ({
            id: c.id,
            title: c.name,
            status: 'PUBLISHED',
            category: c.category,
            retail_price: c.retailPrice,
            wholesale_price: c.wholesalePrice,
            inventory_qty: 25,
            created_at: c.publishedAt || new Date().toISOString(),
            media: [{ enh: c.image, orig: c.image }],
          })));
        } catch {
          setError('Could not load your products. Please ensure the backend is running.');
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = filter === 'ALL' ? products : products.filter(p => p.status === filter);

  async function handleDelete(id: string) {
    if (!confirm('Archive this product? It will be hidden from the marketplace.')) return;
    try {
      const token = localStorage.getItem('access_token');
      await fetch(`/api/v1/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch {
      alert('Failed to delete product. Please try again.');
    }
  }

  return (
    <>
      <Navbar />
      <section
        className="relative min-h-[35vh] flex items-center overflow-hidden pt-20"
        style={{ background: 'linear-gradient(135deg, #1A0D06 0%, #2B1810 60%, #1A0D06 100%)' }}
      >
        <div className="container relative z-10 py-12">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs text-amber-200">
              <Package size={14} className="text-[#FA7A21]" />
              <span>Artisan Product Dashboard</span>
            </div>
            <h1 className="font-serif text-white font-light" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
              My Products<br />
              <em className="text-amber-200 font-light italic">& Listings</em>
            </h1>
            <p className="text-stone-300 text-sm font-light">Manage your published crafts, monitor inventory, and create new listings.</p>
          </div>
        </div>
      </section>

      <FolkArtBanner height={60} variant="border-2" alt="Heritage border" />

      <main className="bg-[#1C0E07] text-white font-sans min-h-screen pb-16">
        <div className="container max-w-6xl py-10 space-y-8">

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Listings', value: products.length, color: 'text-white' },
              { label: 'Published', value: products.filter(p => p.status === 'PUBLISHED').length, color: 'text-emerald-400' },
              { label: 'Draft', value: products.filter(p => p.status === 'DRAFT').length, color: 'text-amber-300' },
              { label: 'Total Units', value: products.reduce((s, p) => s + (p.inventory_qty || 0), 0), color: 'text-[#FA7A21]' },
            ].map(stat => (
              <div key={stat.label} className="bg-[#24130A] border border-white/10 p-5 rounded-2xl">
                <p className="text-[10px] uppercase font-bold text-stone-400">{stat.label}</p>
                <p className={`font-serif text-3xl font-light mt-1 ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Filter + Create */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {['ALL', 'PUBLISHED', 'DRAFT', 'PAUSED', 'ARCHIVED'].map(s => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-4 py-2 text-xs rounded-full font-medium border transition-all cursor-pointer ${
                    filter === s
                      ? 'bg-[#FA7A21] text-white border-[#FA7A21]'
                      : 'bg-white/5 border-white/15 text-stone-300 hover:border-[#FA7A21]/50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <Link
              href="/artisan/create-product"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#FA7A21] hover:bg-[#e06917] text-white text-xs font-semibold rounded-full shadow-md transition-all"
            >
              <Plus size={14} /> Create New Listing
            </Link>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="text-center py-20 text-stone-400">Loading your products...</div>
          ) : error ? (
            <div className="p-6 bg-red-900/30 border border-red-700/40 text-red-300 rounded-2xl text-sm">{error}</div>
          ) : filtered.length === 0 ? (
            <ScrollReveal className="py-20 text-center space-y-4">
              <Package size={48} className="text-stone-600 mx-auto" />
              <p className="text-stone-400">No products found. Create your first listing!</p>
              <Link href="/artisan/create-product" className="inline-flex items-center gap-2 px-6 py-3 bg-[#FA7A21] text-white rounded-full text-sm font-semibold">
                <Sparkles size={14} /> Launch AI Studio
              </Link>
            </ScrollReveal>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((product, i) => {
                const img = product.media?.[0]?.enh || product.media?.[0]?.orig;
                return (
                  <ScrollReveal key={product.id} delay={i * 0.05}>
                    <article className="bg-[#24130A] border border-white/10 hover:border-[#FA7A21]/50 rounded-2xl overflow-hidden shadow-xl transition-all hover:-translate-y-1">
                      <div className="relative aspect-video bg-black/40">
                        {img ? (
                          <Image src={img} alt={product.title} fill className="object-cover" unoptimized />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-600">
                            <Package size={32} />
                          </div>
                        )}
                        <div className="absolute top-3 left-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-full border ${STATUS_COLORS[product.status] || STATUS_COLORS.DRAFT}`}>
                            {STATUS_ICONS[product.status]}
                            {product.status}
                          </span>
                        </div>
                      </div>
                      <div className="p-5 space-y-3">
                        <div>
                          <p className="text-[10px] text-stone-400 uppercase font-semibold">{product.category}</p>
                          <h3 className="font-serif text-lg text-white font-normal leading-snug mt-0.5 line-clamp-2">{product.title}</h3>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <div>
                            <p className="text-stone-400">Retail</p>
                            <p className="font-serif text-lg text-[#FA7A21] font-light">₹{Number(product.retail_price).toLocaleString('en-IN')}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-stone-400">Stock</p>
                            <p className="font-mono font-bold text-white">{product.inventory_qty ?? '—'} units</p>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2 border-t border-white/10">
                          <Link
                            href={`/explore`}
                            className="flex-1 py-2 text-xs text-center bg-white/5 border border-white/15 hover:border-[#FA7A21]/50 text-stone-300 hover:text-white rounded-xl transition-all flex items-center justify-center gap-1"
                          >
                            <Eye size={12} /> View
                          </Link>
                          <Link
                            href={`/artisan/create-product`}
                            className="flex-1 py-2 text-xs text-center bg-[#FA7A21]/15 border border-[#FA7A21]/40 text-amber-200 hover:bg-[#FA7A21]/30 rounded-xl transition-all flex items-center justify-center gap-1"
                          >
                            <Edit2 size={12} /> Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="px-3 py-2 text-xs bg-red-900/30 border border-red-700/30 text-red-400 hover:bg-red-900/60 rounded-xl transition-all cursor-pointer"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </article>
                  </ScrollReveal>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <FolkArtBanner height={60} variant="border-1" alt="Heritage border" />
      <Footer />
    </>
  );
}
