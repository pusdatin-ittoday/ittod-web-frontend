import React from 'react';
import StatCard from '../ui/StatCard';
import { landingStats } from '../../data/events';

/**
 * About Section — "What is IT Today?", card deskripsi, 4x StatCard.
 */
const AboutSection = () => {
  return (
    <section id="about" className="w-full border-b-[5px] border-black bg-[#f7f7f4] py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        {/* Heading */}
        <h2 className="mb-12 text-center font-bebas text-5xl tracking-[0.08em] text-black md:text-7xl">
          What is IT Today?
        </h2>

        {/* Description card */}
        <div className="mb-14 border-[4px] border-black bg-white p-7 shadow-[9px_9px_0_#111] md:p-10">
          <div className="flex items-start gap-4 mb-4">
            <div className="shrink-0 border-[3px] border-black bg-indigo-neo px-4 py-2 font-bebas text-xl tracking-wider text-white shadow-[5px_5px_0_#111]">
              THE BIGGEST IT EVENT
            </div>
          </div>
          <p className="font-inter text-base font-medium leading-relaxed text-gray-800 md:text-lg">
            <strong>IT Today</strong> merupakan megaproker tahunan Himpunan Mahasiswa Ilmu Komputer
            (HIMALKOM) IPB dan Departemen Ilmu Komputer IPB yang telah berlangsung sejak 2003.
            Memasuki tahun ke-20, rangkaian acara seperti seminar komunitas, workshop, kompetisi,
            seminar nasional, dan awarding hadir dengan kemasan menarik. Berkolaborasi dengan{' '}
            <strong>Sentral Komputer</strong>, IT Today menjadi wadah penting yang menghubungkan
            mahasiswa, masyarakat, dan industri untuk mengembangkan pengetahuan serta keterampilan
            di bidang ilmu komputer dan teknologi.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {landingStats.map((stat) => (
            <StatCard key={stat.label} count={stat.count} label={stat.label} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
