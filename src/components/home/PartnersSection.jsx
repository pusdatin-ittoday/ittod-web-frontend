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
    <section id="partners" className="w-full bg-white py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Heading */}
        <h2 className="font-bebas text-5xl md:text-6xl text-black text-center tracking-wider mb-4">
          Our Official Partners
        </h2>
        <div className="w-20 h-1 bg-yellow-neo mx-auto mb-12" />

        {/* Partners grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
          {partnersPlaceholder.map((partner, index) => (
            <div
              key={index}
              className="flex items-center justify-center h-24 bg-gray-50 border-2 border-black rounded-lg shadow-[3px_3px_0px_#000] hover:shadow-[5px_5px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200"
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
