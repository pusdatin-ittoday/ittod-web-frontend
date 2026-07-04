import React from 'react';
import StatCard from '../ui/StatCard';
import { landingStats } from '../../data/events';

/**
 * About Section — "What is IT Today?", card deskripsi, 4x StatCard.
 */
const AboutSection = () => {
  return (
    <section id="about" className="w-full bg-white py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Heading */}
        <h2 className="font-bebas text-5xl md:text-6xl text-black text-center tracking-wider mb-12">
          What is IT Today?
        </h2>

        {/* Description card */}
        <div className="card-brutal-no-hover rounded-lg p-8 md:p-10 mb-14 bg-yellow-neo/10">
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-indigo-neo text-white font-bebas text-xl px-4 py-2 border-2 border-black shadow-[3px_3px_0px_#000] tracking-wider shrink-0">
              THE BIGGEST IT EVENT
            </div>
          </div>
          <p className="font-inter text-base md:text-lg text-gray-800 leading-relaxed">
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
