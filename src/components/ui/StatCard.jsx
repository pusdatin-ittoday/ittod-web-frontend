import React from 'react';

/**
 * Card statistik untuk landing page.
 * Menampilkan angka besar + label — gaya Neo-Brutalisme.
 */
const variants = [
  'bg-[#ffd400] text-[#293f9e]',
  'bg-[#4b56be] text-[#d9dcff]',
  'bg-white text-[#785f00]',
  'bg-white text-[#9f2a0e]',
];

const StatCard = ({ count, label, variant = 0 }) => {
  const colorClass = variants[variant % variants.length];

  return (
    <div className={`min-w-0 border-[4px] border-[#1a1c1c] p-4 text-left shadow-[7px_7px_0_#1a1c1c] transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 sm:p-5 md:min-h-40 ${colorClass}`}>
      <p className="break-words font-inter text-4xl font-black leading-none tracking-[-0.05em] sm:text-5xl">
        {count}
      </p>
      <p className="mt-5 break-words font-bebas text-base uppercase leading-tight tracking-[0.04em] text-current sm:text-lg">
        {label}
      </p>
    </div>
  );
};

export default StatCard;
