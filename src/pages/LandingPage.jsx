import React, { useEffect } from 'react';
import NavbarNeo from '../components/layout/Navbar';
import FooterNeo from '../components/layout/Footer';
import HeroSection from '../components/home/HeroSection';
import AboutSection from '../components/home/AboutSection';
import MainEventSection from '../components/home/MainEventSection';
import CompetitionSection from '../components/home/CompetitionSection';
import TimelineSection from '../components/home/TimelineSection';
import PartnersSection from '../components/home/PartnersSection';
import GetInTouchSection from '../components/home/GetInTouchSection';

/**
 * Landing Page — compose semua section top-to-bottom.
 * Mendukung scroll-to-section dari halaman lain via sessionStorage.
 */
const LandingPage = () => {
  useEffect(() => {
    // Scroll to section jika diarahkan dari halaman lain
    const sectionId = sessionStorage.getItem('scrollToSectionId');
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
    <>
      <NavbarNeo />
      <main>
        <HeroSection />
        <AboutSection />
        <MainEventSection />
        <CompetitionSection />
        <TimelineSection />
        <PartnersSection />
        <GetInTouchSection />
      </main>
      <FooterNeo />
    </>
  );
};

export default LandingPage;
