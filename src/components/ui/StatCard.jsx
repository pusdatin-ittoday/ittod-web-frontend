import React from "react";
import { motion as Motion } from "motion/react";
import { popIn, tapPress } from "../../lib/motion";

/**
 * Card statistik untuk landing page.
 * Menampilkan angka besar + label — gaya Neo-Brutalisme.
 */
const variants = [
  "bg-[#ffd400] text-[#293f9e]",
  "bg-[#4b56be] text-[#d9dcff]",
  "bg-white text-[#785f00]",
  "bg-white text-[#9f2a0e]",
];

const StatCard = ({ count, label, variant = 0 }) => {
  const colorClass = variants[variant % variants.length];

  return (
    <Motion.div
      variants={popIn}
      whileHover={{ y: -7, x: -3, rotate: variant % 2 === 0 ? -1 : 1 }}
      whileTap={tapPress}
      className={`min-w-0 border-[4px] border-[#1a1c1c] p-4 text-left shadow-[7px_7px_0_#1a1c1c] sm:p-5 md:min-h-40 ${colorClass}`}
    >
      <p className="break-words font-inter text-4xl font-black leading-none tracking-[-0.05em] sm:text-5xl">
        {count}
      </p>
      <p className="mt-5 break-words font-bebas text-base uppercase leading-tight tracking-[0.04em] text-current sm:text-lg">
        {label}
      </p>
    </Motion.div>
  );
};

export default StatCard;
