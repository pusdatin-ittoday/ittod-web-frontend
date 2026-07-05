import React from 'react';

/**
 * Hero Section — background merah bertekstur wave, badge "HIMALKOM PRESENT",
 * judul besar "IT TODAY 2026", badge tahun.
 */
const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative flex min-h-[calc(100svh-4rem)] w-full items-center justify-center overflow-hidden border-b-[14px] border-yellow-neo md:min-h-[calc(100svh-5rem)]"
      style={{
        background: 'linear-gradient(135deg, #e2252b 0%, #c71920 48%, #9f1118 100%)',
      }}
    >
      <div className="absolute inset-0 opacity-[0.12]">
        <svg
          className="h-full w-full"
          viewBox="0 0 1440 800"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0,78 C250,230,470,220,680,150 C930,68,1120,182,1440,145 L1440,800 L0,800 Z"
            fill="#7f0d13"
          />
          <path
            d="M0,295 C300,390,485,290,730,315 C995,342,1160,255,1440,312 L1440,800 L0,800 Z"
            fill="#970f16"
            opacity="0.65"
          />
        </svg>
      </div>

      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, transparent, transparent 22px, #6f090d 22px, #6f090d 24px)',
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-14 text-center sm:py-16 md:py-20">
        <div className="mb-7 inline-block border-[3px] border-black bg-yellow-neo px-7 py-2.5 font-inter text-xs font-black uppercase tracking-[0.18em] text-black shadow-[6px_6px_0_#111] sm:text-sm md:mb-9 md:px-10 md:text-base">
          HIMALKOM PRESENT
        </div>

        <h1 className="mb-5 font-bebas text-7xl leading-[0.88] tracking-[0.05em] text-white [text-shadow:7px_7px_0_#111] sm:text-8xl md:text-[8.5rem] lg:text-[10rem]">
          IT TODAY
        </h1>

        <div className="mb-7 flex items-center justify-center gap-4 md:mb-9 md:gap-6">
          <div className="h-[3px] w-12 bg-yellow-neo md:w-24" />
          <span className="font-bebas text-3xl tracking-[0.35em] text-yellow-neo md:text-5xl">
            2026
          </span>
          <div className="h-[3px] w-12 bg-yellow-neo md:w-24" />
        </div>

        <p className="mx-auto max-w-2xl font-inter text-sm font-semibold text-white/90 sm:text-base md:text-lg">
          &quot;Exploring Harmonious Connections In The Digital Universe&quot;
        </p>

        <div className="mt-8 md:mt-10">
          <img
            src="/LOGO_ITTODAY_2025.webp"
            alt="IT Today 2026 Logo"
            className="mx-auto w-28 drop-shadow-[4px_5px_0_rgba(0,0,0,0.35)] transition-transform duration-300 hover:-rotate-2 hover:scale-105 sm:w-32 md:w-40"
          />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-[5px] bg-black" />
    </section>
  );
};

export default HeroSection;
