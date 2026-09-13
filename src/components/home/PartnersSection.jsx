import React from "react";
import { motion as Motion } from "motion/react";
import {
  popIn,
  revealUp,
  staggerContainer,
  tapPress,
  viewportOnce,
} from "../../lib/motion";

/**
 * Partners Section — "Our Official Partners" + grid logo (placeholder).
 * Logo partner belum tersedia, tampilkan placeholder yang rapi.
 */
import sponsors from "../../data/sponsors";

const PartnersSection = () => {
  return (
    <Motion.section
      id="partners"
      className="w-full border-b-[5px] border-black bg-white py-16 md:py-24"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer}
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        {/* Heading */}
        <Motion.h2
          variants={revealUp}
          className="mb-3 text-center font-bebas text-5xl tracking-[0.1em] text-black md:text-7xl"
        >
          Our Official Partners
        </Motion.h2>
        <Motion.div
          variants={{
            hidden: { scaleX: 0 },
            visible: { scaleX: 1, transition: { duration: 0.5 } },
          }}
          className="mx-auto mb-12 h-[5px] w-24 origin-center bg-yellow-neo"
        />

        <Motion.div
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4"
          variants={staggerContainer}
        >
          {sponsors.map((sponsor) => (
            <Motion.div
              key={sponsor.name}
              variants={popIn}
              whileTap={tapPress}
              className="group flex h-28 items-center justify-center border-[3px] border-black bg-white p-4 shadow-[5px_5px_0_#111] transition-[background-color,box-shadow] duration-150 hover:bg-[#F5C518] hover:shadow-[7px_7px_0_#111] md:h-36"
            >
              <img
                src={sponsor.logo}
                alt={sponsor.name}
                className="h-full w-full object-contain transition-transform duration-150 will-change-transform group-hover:-translate-y-1 group-hover:scale-110"
                loading="lazy"
              />
            </Motion.div>
          ))}
        </Motion.div>
      </div>
    </Motion.section>
  );
};

export default PartnersSection;
