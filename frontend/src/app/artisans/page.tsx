'use client';

import { useState, useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import Image from 'next/image';
import Link from 'next/link';
import { Search, ShieldCheck, Award, ArrowRight, MapPin, Sparkles } from 'lucide-react';

interface ArtisanProfile {
  id: string;
  name: string;
  craft: string;
  region: string;
  state: string;
  experience: string;
  trustScore: number;
  ordersFulfilled: number;
  heritageHonor: string;
  bio: string;
  image: string;
  giCertified: boolean;
}

const ARTISANS: ArtisanProfile[] = [
  {
    id: '1',
    name: 'Meera Devi',
    craft: 'Madhubani Painting',
    region: 'Ranti, Madhubani',
    state: 'Bihar',
    experience: '32 years',
    trustScore: 94,
    ordersFulfilled: 148,
    heritageHonor: 'National Award Winner 2018',
    bio: 'Preserving natural pigment extraction from aparajita flowers and soot, creating ritual ceremonial murals for temple sanctums and private collectors worldwide.',
    image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=800&q=80&auto=format&fit=crop&crop=face',
    giCertified: true,
  },
  {
    id: '2',
    name: 'Rajan Sutar',
    craft: 'Dhokra Lost-Wax Metalwork',
    region: 'Kondagaon, Bastar',
    state: 'Chhattisgarh',
    experience: '28 years',
    trustScore: 96,
    ordersFulfilled: 215,
    heritageHonor: 'UNESCO Seal of Excellence',
    bio: 'Sixth-generation bell-metal tribal caster maintaining pure beeswax and river clay molding methods dating back four millennia to the Indus Valley Civilization.',
    image: 'https://images.unsplash.com/photo-1547612345-7f6e9f2bd6f6?w=800&q=80&auto=format&fit=crop&crop=face',
    giCertified: true,
  },
  {
    id: '3',
    name: 'Fatima Begum',
    craft: 'Chikankari Shadow Embroidery',
    region: 'Chowk, Lucknow',
    state: 'Uttar Pradesh',
    experience: '25 years',
    trustScore: 97,
    ordersFulfilled: 340,
    heritageHonor: 'State Master Craftsperson',
    bio: 'Leading a collective of 120 women artisans mastering all 32 traditional stitches including Tepchi, Bakhiya, and Murri on pure organza and mulmul cottons.',
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=80&auto=format&fit=crop&crop=face',
    giCertified: true,
  },
  {
    id: '4',
    name: 'Ghulam Rasool',
    craft: 'Pashmina Kani Weaving',
    region: 'Kanihama, Budgam',
    state: 'Jammu & Kashmir',
    experience: '40 years',
    trustScore: 98,
    ordersFulfilled: 88,
    heritageHonor: 'Padma Shri Nominee',
    bio: 'Master of the coded "Tujis" needle technique, spending up to two full years on a single intricately patterned heirloom Jamawar shawl.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&auto=format&fit=crop&crop=face',
    giCertified: true,
  },
  {
    id: '5',
    name: 'Kripal Kumbh Guild',
    craft: 'Blue Pottery & Quartz Glazing',
    region: 'Jaipur',
    state: 'Rajasthan',
    experience: '45 years collective',
    trustScore: 95,
    ordersFulfilled: 512,
    heritageHonor: 'Geographical Indication Custodian',
    bio: 'Forming vessels purely from ground quartz, fuller earth, and natural copper oxide glazes without using conventional clay or potter wheel throwing.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80&auto=format&fit=crop&crop=face',
    giCertified: true,
  },
  {
    id: '6',
    name: 'Shah Rasheed Quadri',
    craft: 'Bidriware Silver Inlay',
    region: 'Bidar',
    state: 'Karnataka',
    experience: '36 years',
    trustScore: 99,
    ordersFulfilled: 190,
    heritageHonor: 'Padma Shri Awardee',
    bio: 'Master in inlaying pure silver wires into zinc-copper alloy matrices blackened with special historic Bidar fort soil compounds.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80&auto=format&fit=crop&crop=face',
    giCertified: true,
  },
];

const STATES = ['All States', 'Bihar', 'Chhattisgarh', 'Uttar Pradesh', 'Jammu & Kashmir', 'Rajasthan', 'Karnataka'];

export default function ArtisansPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('All States');
  const [giOnly, setGiOnly] = useState(false);

  const filteredArtisans = useMemo(() => {
    return ARTISANS.filter((a) => {
      const matchSearch =
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.craft.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.region.toLowerCase().includes(searchQuery.toLowerCase());
      const matchState = selectedState === 'All States' || a.state === selectedState;
      const matchGi = !giOnly || a.giCertified;
      return matchSearch && matchState && matchGi;
    });
  }, [searchQuery, selectedState, giOnly]);

  return (
    <>
      <Navbar />

      {/* Dark Hero Banner */}
      <section
        className="relative min-h-[45vh] flex items-center overflow-hidden pt-20"
        style={{ background: 'linear-gradient(135deg, #1A0D06 0%, #2B1810 60%, #1A0D06 100%)' }}
      >
        <div className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: 'radial-gradient(circle at 15% 50%, #FA7A21 0%, transparent 50%), radial-gradient(circle at 85% 20%, #B8965A 0%, transparent 40%)',
          }}
        />
        <div className="container relative z-10 py-16 md:py-20">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs text-amber-200">
              <Sparkles size={14} className="text-[#FA7A21]" />
              <span className="font-sans font-medium tracking-wide">Living National Treasures &bull; MoSJE Verified Artisan Registry</span>
            </div>
            <h1
              className="font-serif text-white font-normal"
              style={{ fontSize: 'clamp(2.25rem, 5vw, 4rem)', lineHeight: 1.08, letterSpacing: '-0.015em' }}
            >
              Meet the Masters<br />
              <em className="font-light text-amber-200" style={{ fontStyle: 'italic' }}>Behind India&apos;s Heritage.</em>
            </h1>
            <p className="text-white font-sans text-base font-light max-w-2xl leading-relaxed">
              Every artisan on ALMS undergoes physical cluster validation, GI verification, and direct digital linkage — connecting ancient techniques to modern patrons.
            </p>
            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-white/15">
              {[
                { n: '48+', l: 'Craft Clusters' },
                { n: '100%', l: 'GI Authentic' },
                { n: '0%', l: 'Middlemen Cut' },
                { n: '96.5%', l: 'Avg. Reliability' },
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

          {/* Search & Filter Controls */}
          <ScrollReveal className="mb-12 p-5 bg-[#1C0E07] border border-white/10 rounded-2xl space-y-4" delay={0.1}>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by artisan name, craft (Madhubani, Dokra, Pashmina), or state..."
                  className="w-full bg-black/30 border border-white/15 pl-11 pr-4 py-3 text-xs text-white placeholder:text-stone-400 focus:outline-none focus:border-[#FA7A21]/60 rounded-full transition-colors"
                />
              </div>
              <button
                type="button"
                onClick={() => setGiOnly((v) => !v)}
                className={`px-5 py-3 text-xs font-semibold rounded-full border transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                  giOnly
                    ? 'bg-[#FA7A21] text-white border-[#FA7A21] shadow-md'
                    : 'bg-white/10 border-white/20 text-stone-100 hover:border-[#FA7A21]/60 hover:text-amber-200'
                }`}
              >
                <ShieldCheck size={15} className={giOnly ? 'text-white' : 'text-[#FA7A21]'} />
                <span>GI Tagged Only</span>
              </button>
            </div>
            {/* State filter pills */}
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/10">
              <span className="text-xs font-semibold text-stone-200 mr-1">Filter:</span>
              {STATES.map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedState(st)}
                  className={`px-3 py-1.5 text-xs rounded-full transition-all cursor-pointer font-medium ${
                    selectedState === st
                      ? 'bg-[#FA7A21] text-white font-semibold'
                      : 'bg-white/10 border border-white/20 text-stone-100 hover:border-[#FA7A21]/60 hover:text-amber-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Artisan Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArtisans.map((artisan, index) => (
              <ScrollReveal key={artisan.id} delay={(index % 3) * 0.08}>
                <article className="group bg-[#1C0E07] border border-white/10 hover:border-[#FA7A21]/40 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5">
                  <div>
                    {/* Portrait Photo with Badge */}
                    <div className="relative h-72 bg-stone-900 overflow-hidden">
                      <Image
                        src={artisan.image}
                        alt={artisan.name}
                        fill
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1C0E07]/95 via-[#1C0E07]/30 to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                        <span className="bg-black/70 backdrop-blur-md text-amber-200 text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5">
                          <MapPin size={11} className="text-[#FA7A21]" />
                          {artisan.state}
                        </span>
                        {artisan.giCertified && (
                          <span className="bg-[#FA7A21]/20 backdrop-blur-md text-amber-200 text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full border border-[#FA7A21]/40 flex items-center gap-1">
                            <ShieldCheck size={12} className="text-[#FA7A21]" />
                            GI Master
                          </span>
                        )}
                      </div>

                      {/* Bottom Title on Image */}
                      <div className="absolute bottom-4 left-5 right-5 text-white">
                        <p className="text-[#FA7A21] text-xs font-semibold uppercase tracking-wider">{artisan.craft}</p>
                        <h2 className="font-serif text-2xl sm:text-3xl font-normal text-white leading-tight mt-0.5">{artisan.name}</h2>
                        <p className="text-xs text-stone-200 font-light mt-0.5">{artisan.region}</p>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 sm:p-7 space-y-4">
                      {/* Heritage Honor Tag */}
                      <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 bg-[#FA7A21]/10 px-3.5 py-2 rounded-xl border border-[#FA7A21]/20">
                        <Award size={16} className="text-[#FA7A21] shrink-0" />
                        <span className="truncate">{artisan.heritageHonor}</span>
                      </div>
                      <p className="text-xs text-stone-100 leading-relaxed font-light">{artisan.bio}</p>
                      {/* Stats Strip */}
                      <div className="grid grid-cols-3 gap-2 py-3.5 px-3 bg-black/30 border border-white/10 rounded-xl text-center">
                        <div>
                          <p className="text-[9px] uppercase font-bold tracking-wider text-stone-300">Experience</p>
                          <p className="font-serif text-sm font-semibold text-white mt-0.5">{artisan.experience}</p>
                        </div>
                        <div className="border-x border-white/10">
                          <p className="text-[9px] uppercase font-bold tracking-wider text-stone-300">Fulfilled</p>
                          <p className="font-serif text-sm font-semibold text-white mt-0.5">{artisan.ordersFulfilled}+</p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase font-bold tracking-wider text-stone-300">Trust Score</p>
                          <p className="font-serif text-sm font-bold text-[#FA7A21] mt-0.5">{artisan.trustScore}/100</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Button */}
                  <div className="p-6 sm:p-7 pt-0">
                    <Link
                      href={`/explore?artisan=${encodeURIComponent(artisan.name)}`}
                      className="w-full py-3 px-6 bg-[#FA7A21] hover:bg-[#e06917] text-white text-xs font-semibold rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-orange-500/25"
                    >
                      <span>Explore Master Catalogue</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
