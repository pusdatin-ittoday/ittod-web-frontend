import React from 'react';

/**
 * Banner judul miring dengan border kuning-hitam — dipakai di EventDetail & CompetitionDetail.
 * Efek Neo-Brutalisme: kotak miring, border tebal, shadow solid.
 */
const PageBanner = ({ icon, title, subtitle, variant = 'default' }) => {
  if (variant === 'event') {
    return (
      <section className="w-full bg-[#f7f7f4] px-5 py-14 md:px-8 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="relative mx-auto max-w-4xl">
            <div className="absolute inset-0 translate-x-3 translate-y-3 rotate-1 border-[3px] border-black bg-yellow-neo" />
            <div className="relative flex -rotate-1 flex-col items-center border-[3px] border-black bg-white px-6 py-8 text-center shadow-[7px_7px_0_#111] transition-transform duration-300 hover:rotate-0 md:px-12 md:py-10">
              {icon && (
                <img
                  src={icon}
                  alt={title}
                  className="mb-4 h-24 w-32 object-contain md:h-32 md:w-44 lg:h-36 lg:w-52"
                />
              )}
              <h1 className="font-inter text-4xl font-black uppercase leading-none tracking-tight text-[#171918] sm:text-5xl md:text-6xl lg:text-7xl">
                {title}
              </h1>
            </div>
          </div>

          {subtitle && (
            <p className="mx-auto mt-5 w-fit max-w-full bg-[#191b1a] px-5 py-2 text-center font-inter text-[10px] font-bold uppercase tracking-widest text-white md:text-xs">
              {subtitle}
            </p>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full overflow-hidden border-b-[5px] border-black bg-indigo-neo py-16 md:py-24">
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
        <div className="inline-block -rotate-1 transform border-[4px] border-black bg-yellow-neo px-7 py-6 shadow-[9px_9px_0_#111] md:px-12">
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
