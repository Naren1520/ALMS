import type { Metadata } from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers/Providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ALMS — Artisan Linkage and Market System',
  description:
    "Connecting India's master artisans with discerning buyers worldwide. Authentic craft, direct from the source.",
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'ALMS',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="bg-ivory text-charcoal font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
