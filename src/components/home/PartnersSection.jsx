import React from 'react';

/**
 * Partners Section — "Our Official Partners" + grid logo (placeholder).
 * Logo partner belum tersedia, tampilkan placeholder yang rapi.
 */
const partnersPlaceholder = [
  { name: 'Partner 1' },
  { name: 'Partner 2' },
  { name: 'Partner 3' },
  { name: 'Partner 4' },
  { name: 'Partner 5' },
  { name: 'Partner 6' },
];

const PartnersSection = () => {
  return (
    <section id="partners" className="w-full border-b-[5px] border-black bg-white py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        {/* Heading */}
        <h2 className="mb-3 text-center font-bebas text-5xl tracking-[0.1em] text-black md:text-7xl">
          Our Official Partners
        </h2>
        <div className="mx-auto mb-12 h-[5px] w-24 bg-yellow-neo" />

        {/* Partners grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
          {partnersPlaceholder.map((partner, index) => (
            <div
              key={index}
              className="flex h-24 items-center justify-center border-[3px] border-black bg-gray-50 shadow-[5px_5px_0_#111] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_#111]"
            >
              <span className="font-inter text-xs text-gray-400 font-medium">
                {partner.name}
              </span>
            </div>
          ))}
        </div>

        <p className="text-center font-inter text-sm text-gray-400 mt-8 italic">
          Partner logos will be updated soon
        </p>
      </div>
    </section>
  );
};

export default PartnersSection;
