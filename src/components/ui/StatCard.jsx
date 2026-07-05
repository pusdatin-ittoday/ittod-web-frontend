import React from 'react';

/**
 * Card statistik untuk landing page.
 * Menampilkan angka besar + label — gaya Neo-Brutalisme.
 */
const StatCard = ({ count, label }) => {
  return (
    <div className="min-w-[140px] border-[3px] border-black bg-white p-5 text-center shadow-[6px_6px_0_#111] transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 sm:min-w-[160px] sm:p-6">
      <p className="font-bebas text-4xl md:text-5xl text-indigo-neo tracking-wide">
        {count}
      </p>
      <p className="font-inter text-sm md:text-base text-gray-700 font-medium mt-2">
        {label}
      </p>
    </div>
  );
};

export default StatCard;
