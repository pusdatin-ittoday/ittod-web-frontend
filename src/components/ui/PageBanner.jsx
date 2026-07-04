import React from 'react';

/**
 * Banner judul miring dengan border kuning-hitam — dipakai di EventDetail & CompetitionDetail.
 * Efek Neo-Brutalisme: kotak miring, border tebal, shadow solid.
 */
const PageBanner = ({ icon, title, subtitle }) => {
  return (
    <section className="relative w-full bg-indigo-neo py-16 md:py-24 overflow-hidden">
      {/* Decorative diagonal stripes */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 12px)',
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 md:px-8">
        {/* Main banner box */}
        <div className="inline-block bg-yellow-neo border-4 border-black shadow-[8px_8px_0px_#000] px-8 md:px-12 py-6 -rotate-2 transform">
          <div className="flex items-center gap-4 md:gap-6">
            {icon && (
              <img
                src={icon}
                alt={title}
                className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-md"
              />
            )}
            <h1 className="font-bebas text-4xl md:text-6xl lg:text-7xl text-black tracking-wider uppercase">
              {title}
            </h1>
          </div>
        </div>

        {/* Subtitle tagline */}
        {subtitle && (
          <div className="mt-6 ml-4 md:ml-8">
            <p className="font-inter font-semibold text-lg md:text-xl text-white/90 tracking-widest uppercase">
              {subtitle}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PageBanner;
