import React from 'react';

/**
 * Hero Section — background merah bertekstur wave, badge "HIMALKOM PRESENT",
 * judul besar "IT TODAY 2026", badge tahun.
 */
const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 40%, #991B1B 100%)',
      }}
    >
      {/* Wave pattern overlay */}
      <div className="absolute inset-0 opacity-[0.07]">
        <svg className="w-full h-full" viewBox="0 0 1440 800" preserveAspectRatio="none">
          <path d="M0,160 C320,300,420,240,640,200 C880,160,960,280,1440,240 L1440,800 L0,800 Z" fill="#000" />
          <path d="M0,320 C240,400,480,320,720,360 C960,400,1200,320,1440,380 L1440,800 L0,800 Z" fill="#000" />
        </svg>
      </div>

      {/* Diagonal stripes */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, transparent, transparent 20px, #000 20px, #000 22px)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 py-20">
        {/* Badge */}
        <div className="inline-block bg-yellow-neo text-black font-inter font-bold text-sm md:text-base px-6 py-2 mb-8 border-2 border-black shadow-[4px_4px_0px_#000] tracking-widest uppercase">
          HIMALKOM PRESENT
        </div>

        {/* Main title */}
        <h1 className="font-bebas text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] text-white leading-none tracking-wider mb-4 drop-shadow-[4px_4px_0px_#000]">
          IT TODAY
        </h1>

        {/* Year subtitle */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-12 md:w-20 h-0.5 bg-yellow-neo" />
          <span className="font-bebas text-3xl md:text-5xl text-yellow-neo tracking-[0.3em]">
            2026
          </span>
          <div className="w-12 md:w-20 h-0.5 bg-yellow-neo" />
        </div>

        {/* Tagline */}
        <p className="font-inter text-base md:text-lg text-white/80 italic max-w-xl mx-auto">
          "Exploring Harmonious Connections In The Digital Universe"
        </p>

        {/* Logo */}
        <div className="mt-10">
          <img
            src="/LOGO_ITTODAY_2025.webp"
            alt="IT Today 2026 Logo"
            className="w-32 md:w-40 mx-auto drop-shadow-lg hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      {/* Bottom decorative border */}
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-yellow-neo border-t-4 border-black" />
    </section>
  );
};

export default HeroSection;
