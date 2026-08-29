'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import Image from 'next/image';
import Link from 'next/link';
import { Search, ShieldCheck, Award, ArrowRight, Star } from 'lucide-react';

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

export default function ArtisansPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArtisans = ARTISANS.filter((a) => {
    return (
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.craft.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.region.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-ivory text-charcoal pt-28 pb-24 font-sans">
        <div className="container">
          {/* Header */}
          <ScrollReveal className="text-center max-w-3xl mx-auto mb-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="w-6 h-px bg-gold" />
              <p className="overline text-gold" style={{ fontSize: '0.65rem' }}>
                Master Creators
              </p>
              <span className="w-6 h-px bg-gold" />
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-light mb-4">
              Meet the Masters Behind the Craft
            </h1>
            <p className="text-stone text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
              India&apos;s living national treasures. Every artisan on ALMS undergoes physical workshop verification, identity checks, and craft heritage validation.
            </p>
          </ScrollReveal>

          {/* Search Bar */}
          <ScrollReveal className="max-w-xl mx-auto mb-12" delay={0.1}>
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-light" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by artisan name, craft tradition, or state..."
                className="w-full bg-ivory-dark border border-border pl-11 pr-4 py-3 text-xs text-charcoal placeholder:text-stone-light focus:outline-none focus:border-gold transition-colors shadow-xs"
              />
            </div>
          </ScrollReveal>

          {/* Artisan Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArtisans.map((artisan, index) => (
              <ScrollReveal key={artisan.id} delay={(index % 3) * 0.08}>
              <article
                className="bg-ivory-dark border border-border overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Portrait photo */}
                  <div className="relative h-64 bg-cream overflow-hidden">
                    <Image
                      src={artisan.image}
                      alt={artisan.name}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-ivory">
                      <p className="overline text-gold-light" style={{ fontSize: '0.6rem' }}>
                        {artisan.craft}
                      </p>
                      <h2 className="font-serif text-2xl font-medium text-ivory leading-tight">
                        {artisan.name}
                      </h2>
                      <p className="text-xs text-stone-light mt-0.5">{artisan.region}, {artisan.state}</p>
                    </div>

                    {artisan.giCertified && (
                      <span className="absolute top-3 right-3 bg-ivory/95 backdrop-blur-sm text-charcoal text-[10px] overline px-2.5 py-1 font-semibold border border-border shadow-xs flex items-center gap-1">
                        <ShieldCheck size={11} className="text-gold" />
                        GI Master
                      </span>
                    )}
                  </div>

                  {/* Body Info */}
                  <div className="p-6 space-y-4">
                    {/* Honor Badge */}
                    <div className="flex items-center gap-2 text-xs font-medium text-gold bg-cream px-3 py-2 border border-border">
                      <Award size={14} className="shrink-0 text-gold" />
                      <span className="truncate">{artisan.heritageHonor}</span>
                    </div>

                    <p className="text-xs text-stone leading-relaxed">
                      {artisan.bio}
                    </p>

                    {/* Stats strip */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-border text-center">
                      <div>
                        <p className="overline text-stone-light" style={{ fontSize: '0.55rem' }}>Experience</p>
                        <p className="font-serif text-sm font-medium text-charcoal">{artisan.experience}</p>
                      </div>
                      <div>
                        <p className="overline text-stone-light" style={{ fontSize: '0.55rem' }}>Orders</p>
                        <p className="font-serif text-sm font-medium text-charcoal">{artisan.ordersFulfilled}+</p>
                      </div>
                      <div>
                        <p className="overline text-stone-light" style={{ fontSize: '0.55rem' }}>Trust Score</p>
                        <p className="font-serif text-sm font-medium text-gold">{artisan.trustScore}/100</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action footer */}
                <div className="p-6 pt-0">
                  <Link
                    href={`/explore?artisan=${encodeURIComponent(artisan.name)}`}
                    className="btn-primary w-full justify-center text-xs py-2.5"
                  >
                    View Creations <ArrowRight size={13} />
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
