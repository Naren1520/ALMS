/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false, // Disabled to prevent double-invocation issues in dev

  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: '**.supabase.in' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
    ],
  },

  async rewrites() {
    // In production (Vercel/Render), NEXT_PUBLIC_BACKEND_URL points to the Render backend.
    // In dev, it defaults to localhost:8080.
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      process.env.BACKEND_URL ||
      'http://127.0.0.1:8080';

    return [
      {
        // All /api/* calls are proxied to NestJS backend.
        // Next.js App Router internal routes (e.g. /api/analyse-craft, /api/chat)
        // take priority automatically — no exclusion needed.
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
