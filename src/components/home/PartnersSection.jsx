import React from 'react';

/**
 * Partners Section — "Our Official Partners" + grid logo (placeholder).
 * Logo partner belum tersedia, tampilkan placeholder yang rapi.
 */
const sponsors = [
  { name: 'Sentral Komputer', logo: '/sponsors/Logo-Sentral-Komputer2.png' },
  { name: 'Sentral Service', logo: '/sponsors/Logo-Sentral_Service.png' },
  { name: 'Acer', logo: '/sponsors/Logo-Acer.png' },
  { name: 'NVIDIA', logo: '/sponsors/nvidia.webp' },
  { name: 'Bangunindo', logo: '/sponsors/Logo-Bangunindo.png' },
  { name: 'Siloam Hospitals', logo: '/sponsors/Logo-Siloam.png' },
  { name: 'Intelligo.id', logo: '/sponsors/Logo-Intelligo.png' },
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

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.name}
              className="group flex h-28 items-center justify-center border-[3px] border-black bg-white p-4 shadow-[5px_5px_0_#111] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-yellow-neo hover:shadow-[7px_7px_0_#111] md:h-36"
            >
              <img
                src={sponsor.logo}
                alt={sponsor.name}
                className="h-full w-full object-contain transition-transform duration-150 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
