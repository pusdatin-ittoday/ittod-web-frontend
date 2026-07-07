import React from "react";
import { motion as Motion } from "motion/react";
import StatCard from "../ui/StatCard";
import { landingStats } from "../../data/events";
import {
  revealLeft,
  revealUp,
  staggerContainer,
  viewportOnce,
} from "../../lib/motion";

/**
 * About Section — "What is IT Today?", card deskripsi, 4x StatCard.
 */
const AboutSection = () => {
  return (
    <Motion.section
      id="about"
      className="w-full border-b-[5px] border-black bg-[#f7f7f4] py-14 sm:py-16 md:py-24"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-7 md:px-8">
        {/* Heading */}
        <Motion.h2
          variants={revealLeft}
          className="mb-9 max-w-md font-inter text-5xl font-black uppercase leading-[0.9] tracking-[-0.04em] text-[#293f9e] sm:text-6xl md:mb-12 md:text-7xl"
        >
          <span className="block">What is</span>
          <span className="inline-block border-b-[4px] border-[#f6ce00] pb-1 text-[#f6ce00]">
            IT Today
          </span>
          <span>?</span>
        </Motion.h2>

        {/* Description card */}
        <Motion.div
          variants={revealUp}
          whileHover={{ y: -6, rotate: -0.25 }}
          className="mb-9 border-[4px] border-[#1a1c1c] bg-white p-5 shadow-[8px_8px_0_#1a1c1c] sm:p-7 md:mb-10 md:p-8"
        >
          <h3 className="border-b-2 border-[#1a1c1c] pb-3 font-inter text-xl font-black text-[#1a1c1c] sm:text-2xl">
            The <span className="text-[#a1280d]">BIGGEST</span> IT Event
          </h3>
          <p className="pt-4 font-inter text-sm font-medium leading-7 text-[#4d505c] sm:text-base sm:leading-7">
            IT Today merupakan rangkaian kegiatan tahunan Himpunan Mahasiswa
            Ilmu Komputer (Himalkom) IPB yang telah berlangsung sejak 2003.
            Memasuki tahun ke-23, IT Today 2026 mengusung tema &quot;Modern
            Brutalist Street&quot; untuk menggabungkan inovasi teknologi dengan
            ekspresi urban yang autentik. Bersiaplah untuk pengalaman yang tidak
            hanya mencerahkan otak tetapi juga menggetarkan jiwa.
          </p>
        </Motion.div>

        {/* Stats grid */}
        <Motion.div
          className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5"
          variants={staggerContainer}
        >
          {landingStats.map((stat, index) => (
            <StatCard
              key={stat.label}
              count={stat.count}
              label={stat.label}
              variant={index}
            />
          ))}
        </Motion.div>
      </div>
    </Motion.section>
  );
};

export default AboutSection;
