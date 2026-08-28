'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface RegionData {
  regionCode: string;
  artisanCount: number;
  crafts: string[];
  sampleImages: string[];
  culturalDescription: string;
}

/**
 * Craft Atlas — Interactive India SVG map (Req 21.1–21.6)
 * Accessible: role="button", aria-label, tabindex, keyboard handlers
 * URL hash state: #state=MH&district=PUNE
 */
export default function CraftAtlasPage() {
  const router = useRouter();
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [regionData, setRegionData] = useState<RegionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    craftType: '',
    category: '',
    priceMin: '',
    priceMax: '',
    minTrustScore: '',
  });

  const handleRegionClick = useCallback(async (regionCode: string) => {
    setSelectedRegion(regionCode);
    setLoading(true);

    // Update URL hash for deep linking (Req 21.4)
    window.history.replaceState(null, '', `#state=${regionCode}`);

    try {
      const res = await fetch(`/api/v1/craft-atlas/regions/${regionCode}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token') ?? ''}` },
      });
      const data = await res.json();
      setRegionData(data);
    } catch {
      setRegionData(null);
    } finally {
      setLoading(false);
    }
  }, []);

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

  return (
    <main
      className="min-h-screen py-12"
      style={{ background: 'var(--color-bg-primary)' }}
    >
      <div className="container">
        <div className="text-center mb-12">
          <h1 className="font-display text-5xl font-light mb-4">Craft Atlas of India</h1>
          <p className="font-ui text-brand-muted text-lg max-w-xl mx-auto">
            Explore artisan traditions by region. Click any state to discover local crafts.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* SVG Map */}
          <div className="lg:col-span-2">
            {/* Client-side filters (Req 21.3) — no full page reload */}
            <div className="flex flex-wrap gap-3 mb-6">
              {[
                { id: 'craftType', label: 'Craft type', value: filters.craftType },
                { id: 'category', label: 'Category', value: filters.category },
                { id: 'minTrustScore', label: 'Min trust score', value: filters.minTrustScore },
              ].map((f) => (
                <input
                  key={f.id}
                  type="text"
                  placeholder={f.label}
                  value={f.value}
                  onChange={(e) => setFilters((prev) => ({ ...prev, [f.id]: e.target.value }))}
                  className="px-3 py-2 rounded-lg border text-sm font-ui focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  style={{ borderColor: '#D1C4B0' }}
                  aria-label={`Filter by ${f.label}`}
                />
              ))}
            </div>

            {/* Interactive SVG map */}
            <svg
              viewBox="0 0 500 450"
              className="w-full border rounded-2xl"
              style={{ background: '#f8f5f0' }}
              role="img"
              aria-label="Interactive map of India — click a state to explore artisan crafts"
            >
              {INDIA_STATES.map((state) => (
                <g key={state.code}>
                  <circle
                    cx={state.cx}
                    cy={state.cy}
                    r={18}
                    fill={selectedRegion === state.code ? 'var(--color-accent)' : 'var(--color-surface)'}
                    stroke={selectedRegion === state.code ? 'var(--color-accent-dark)' : '#C4A882'}
                    strokeWidth="1.5"
                    className="cursor-pointer hover:fill-brand-accent transition-colors duration-150"
                    onClick={() => handleRegionClick(state.code)}
                    role="button"
                    aria-label={`${state.name}: click to explore artisans and crafts`}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleRegionClick(state.code);
                      }
                    }}
                  />
                  <text
                    x={state.cx}
                    y={state.cy + 4}
                    textAnchor="middle"
                    fontSize="7"
                    fontFamily="Inter, sans-serif"
                    fill={selectedRegion === state.code ? 'white' : '#2C2C2C'}
                    pointerEvents="none"
                    aria-hidden="true"
                  >
                    {state.code}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Region detail panel */}
          <div className="space-y-6">
            {loading && (
              <div className="flex items-center justify-center h-40 rounded-2xl"
                style={{ background: 'var(--color-surface)' }}>
                <div className="font-ui text-brand-muted animate-pulse">Loading region data…</div>
              </div>
            )}

            {!loading && regionData && (
              <div
                className="p-6 rounded-2xl space-y-4"
                style={{ background: 'var(--color-surface)' }}
                aria-live="polite"
                aria-label={`Region data for ${regionData.regionCode}`}
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl">{regionData.regionCode}</h2>
                  <span className="font-ui text-sm text-white px-3 py-1 rounded-full"
                    style={{ background: 'var(--color-accent)' }}>
                    {regionData.artisanCount} artisans
                  </span>
                </div>

                {regionData.crafts.length > 0 && (
                  <div>
                    <h3 className="font-ui text-sm font-medium text-brand-muted uppercase tracking-wider mb-2">
                      Crafts
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {regionData.crafts.map((craft) => (
                        <span
                          key={craft}
                          className="px-3 py-1 rounded-full text-xs font-ui border"
                          style={{ borderColor: '#C4A882', color: 'var(--color-text-primary)' }}
                        >
                          {craft}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <p className="font-ui text-sm text-brand-muted leading-relaxed">
                  {regionData.culturalDescription}
                </p>
              </div>
            )}

            {!loading && !regionData && (
              <div
                className="p-6 rounded-2xl text-center"
                style={{ background: 'var(--color-surface)' }}
              >
                <p className="font-ui text-brand-muted text-lg mb-2">🗺️</p>
                <p className="font-ui text-brand-muted">
                  Click a state on the map to explore its artisan traditions.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
