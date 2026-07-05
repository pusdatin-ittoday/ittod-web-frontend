import React from 'react';

/**
 * Card statistik untuk landing page.
 * Menampilkan angka besar + label — gaya Neo-Brutalisme.
 */
const StatCard = ({ count, label }) => {
  return (
    <div className="card-brutal rounded-lg p-6 text-center min-w-[160px]">
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
