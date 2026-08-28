import type { Metadata } from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers/Providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
});

export const metadata: Metadata = {
  title: 'ALMS — Artisan Linkage and Market System',
  description:
    'Connecting marginalized Indian artisans with domestic and global markets through AI-powered tools.',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'ALMS',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="bg-brand-bg text-brand-text font-ui antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
