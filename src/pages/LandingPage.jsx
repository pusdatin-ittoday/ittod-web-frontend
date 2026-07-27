import React, { useEffect, Suspense, lazy } from 'react';
import NavbarNeo from '../components/layout/Navbar';
import FooterNeo from '../components/layout/Footer';
import HeroSection from '../components/home/HeroSection';

const GallerySection = lazy(() => import('../components/home/GallerySection'));
const MainEventSection = lazy(() => import('../components/home/MainEventSection'));
const CompetitionSection = lazy(() => import('../components/home/CompetitionSection'));
const TimelineSection = lazy(() => import('../components/home/TimelineSection'));
const PartnersSection = lazy(() => import('../components/home/PartnersSection'));
const GetInTouchSection = lazy(() => import('../components/home/GetInTouchSection'));

/**
 * Landing Page — compose semua section top-to-bottom.
 * Mendukung scroll-to-section dari halaman lain via sessionStorage.
 */
const LandingPage = () => {
  useEffect(() => {
    // Scroll to section jika diarahkan dari halaman lain
    const sectionId =
      sessionStorage.getItem('scrollToSectionId') ||
      window.location.hash.replace('#', '');
    if (sectionId) {
      sessionStorage.removeItem('scrollToSectionId');
      // Delay sedikit agar DOM ter-render
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white text-black">
      <NavbarNeo />
      <main className="pt-16 md:pt-20">
        <HeroSection />
        <Suspense fallback={<div className="min-h-[200px]" />}>
          <GallerySection />
          <MainEventSection />
          <CompetitionSection />
          <TimelineSection />
          <PartnersSection />
          <GetInTouchSection />
        </Suspense>
      </main>
      <FooterNeo />
    </div>
  );
};

export default LandingPage;
