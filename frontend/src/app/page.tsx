/**
 * ALMS Homepage
 * force-dynamic skips static prerender — avoids browser-only module issues at build time.
 */
export const dynamic = 'force-dynamic';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HomePageSections from '@/components/homepage/HomePageSections';

export default function HomePage() {
  return (
    <>
      <a href="#main-content" className="skip-to-main">Skip to main content</a>
      <Navbar />
      <HomePageSections />
      <Footer />
    </>
  );
}
