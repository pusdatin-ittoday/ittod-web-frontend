import React from "react";
import { motion as Motion } from "motion/react";
import MemoriesCarousel from "./MemoriesCarousel";
import StatCard from "../ui/StatCard";
import { landingStats } from "../../data/events";
import {
  revealLeft,
  revealUp,
  popIn,
  staggerContainer,
  viewportOnce,
} from "../../lib/motion";

/**
 * Gallery Section — "What Is IT Today?" combined section.
 * Contains: heading, rotated banner, memories carousel, description card, stats.
 * Replaces the old separate AboutSection.
 */
const GallerySection = () => {
  return (
    <Motion.section
      id="about"
      className="w-full overflow-hidden border-b-[5px] border-black bg-gradient-to-b from-[#FDF6E3] to-[#ffd400] py-14 sm:py-16 md:py-24"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-7 md:px-8">
        {/* Heading */}
        <Motion.h2
          variants={revealLeft}
          className="mb-8 max-w-md font-inter text-5xl font-black uppercase leading-[0.9] tracking-[-0.04em] text-[#293f9e] sm:text-6xl md:mb-10 md:text-7xl"
        >
          <span className="block">What is</span>
          <span className="inline-block border-b-[4px] border-[#f6ce00] pb-1 text-[#f6ce00]">
            IT Today
          </span>
          <span>?</span>
        </Motion.h2>

        {/* Rotated banner — "IT TODAY MEMORIES" */}
        <Motion.div
          variants={popIn}
          className="mb-10 flex justify-center md:mb-14"
        >
          <div
            className="inline-block border-[3px] border-black bg-[#f5c518] px-8 py-2 font-inter text-sm font-black uppercase tracking-[0.1em] text-[#1a1c1c] shadow-[5px_5px_0_#111] sm:px-12 sm:text-base md:px-16 md:py-2.5 md:text-lg"
            style={{ transform: "rotate(-2deg)" }}
          >
            IT TODAY MEMORIES
          </div>
        </Motion.div>

        {/* Carousel */}
        <Motion.div variants={revealUp} className="mb-12 md:mb-16">
          <MemoriesCarousel />
        </Motion.div>

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

export default GallerySection;
