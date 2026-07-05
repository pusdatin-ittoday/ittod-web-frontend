import React from 'react';

/**
 * Hero Section — Neobrutalism Style
 * Red background with wave patterns, bold typography, dynamic rotation
 * Based on Figma design reference
 */
const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative flex min-h-[calc(100svh-4rem)] w-full items-center justify-center overflow-hidden border-b-[14px] border-yellow-neo md:min-h-[calc(100svh-5rem)]"
      style={{
        background: 'linear-gradient(135deg, #b91c1c 0%, #dc2626 50%, #991b1b 100%)',
      }}
    >
      {/* Wave pattern overlay - layer 1 */}
      <div className="absolute inset-0 opacity-[0.25]">
        <svg
          className="h-full w-full"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0,150 C320,280,480,100,720,180 C960,260,1120,140,1440,200 L1440,900 L0,900 Z"
            fill="#7f1d1d"
          />
          <path
            d="M0,350 C280,450,560,320,840,400 C1120,480,1280,380,1440,450 L1440,900 L0,900 Z"
            fill="#991b1b"
          />
          <path
            d="M0,550 C360,620,720,500,1080,600 C1200,640,1320,580,1440,650 L1440,900 L0,900 Z"
            fill="#7f1d1d"
            opacity="0.7"
          />
        </svg>
      </div>

      {/* Wave pattern overlay - layer 2 (pink accent) */}
      <div className="absolute inset-0 opacity-[0.15]">
        <svg
          className="h-full w-full"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0,200 C400,320,600,180,900,280 C1100,350,1300,220,1440,300 L1440,900 L0,900 Z"
            fill="#fda4af"
          />
          <path
            d="M0,500 C350,580,700,450,1000,550 C1200,600,1350,480,1440,550 L1440,900 L0,900 Z"
            fill="#fecdd3"
          />
        </svg>
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, transparent, transparent 20px, #450a0a 20px, #450a0a 22px)',
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-12 text-center sm:px-6 sm:py-16 md:py-20">
        
        {/* HIMALKOM PRESENT Badge */}
        <div 
          className="mb-6 inline-block border-[3px] border-black bg-white px-6 py-2 font-inter text-xs font-black uppercase tracking-[0.2em] text-black shadow-[5px_5px_0_#111] sm:text-sm md:mb-8 md:px-10 md:text-base"
          style={{ transform: 'rotate(-1deg)' }}
        >
          HIMALKOM PRESENT
        </div>

        {/* Main Title - "it TODAY 2026" */}
        <div className="mb-6 md:mb-8">
          {/* "it" - smaller, rotated */}
          <span 
            className="font-bebas text-5xl text-yellow-neo sm:text-6xl md:text-8xl lg:text-9xl"
            style={{ 
              textShadow: '3px 3px 0 #1e40af, 6px 6px 0 #111',
              transform: 'rotate(-3deg)',
              display: 'inline-block'
            }}
          >
            it
          </span>
          
          {/* "TODAY" - large, bold */}
          <h1 
            className="font-bebas text-6xl leading-[0.85] tracking-[0.08em] text-yellow-neo sm:text-7xl md:text-[7rem] lg:text-[9rem]"
            style={{ 
              textShadow: '4px 4px 0 #1e40af, 8px 8px 0 #111',
              transform: 'rotate(1deg)',
              display: 'block',
              marginTop: '-0.2em'
            }}
          >
            TODAY
          </h1>
          
          {/* "2026" - with blue stroke effect */}
          <div className="relative inline-block mt-2">
            <span 
              className="font-bebas text-5xl tracking-[0.3em] text-blue-600 sm:text-6xl md:text-7xl lg:text-8xl"
              style={{ 
                WebkitTextStroke: '3px #111',
                color: '#1d4ed8',
                textShadow: '3px 3px 0 #111',
                transform: 'rotate(2deg)',
                display: 'inline-block'
              }}
            >
              2026
            </span>
          </div>
        </div>

        {/* Bottom Badge - "- 2026 -" */}
        <div 
          className="mt-6 inline-block border-[3px] border-black bg-yellow-neo px-8 py-3 font-bebas text-xl tracking-[0.25em] text-blue-600 shadow-[6px_6px_0_#111] md:mt-8 md:text-2xl"
          style={{ transform: 'rotate(1deg)' }}
        >
          - 2026 -
        </div>
      </div>

      {/* Bottom border line */}
      <div className="absolute inset-x-0 bottom-0 h-[5px] bg-black" />
    </section>
  );
};

export default HeroSection;
