import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../../services/eventService';

const getDefaultImage = (title) => {
  if (!title) return '/LOGO_ITTODAY_2025.webp';
  const t = title.toLowerCase();
  if (t.includes('hack')) return '/logo-competition/HACKTODAY.webp';
  if (t.includes('mine')) return '/logo-competition/MINETODAY.webp';
  if (t.includes('ux')) return '/logo-competition/UXTODAY.webp';
  if (t.includes('game')) return '/logo-competition/GAMETODAY.webp';
  return '/LOGO_ITTODAY_2025.webp';
};

/**
 * Competition Section — background kuning, 4x card poster kompetisi.
 */
const CompetitionSection = () => {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompetitions = async () => {
      const response = await getEvents('competition');
      if (response.success && response.data) {
        setCompetitions(response.data);
      }
      setLoading(false);
    };
    fetchCompetitions();
  }, []);

  return (
    <section id="competition" className="w-full border-b-[5px] border-black bg-yellow-neo py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        {/* Heading */}
        <h2 className="mb-3 text-center font-bebas text-5xl tracking-[0.1em] text-black md:text-7xl">
          Competition
        </h2>
        <div className="mx-auto mb-12 h-[5px] w-24 bg-indigo-neo" />

        {loading ? (
          <div className="mx-auto w-fit border-[3px] border-black bg-white px-6 py-3 font-inter font-black uppercase text-black shadow-[5px_5px_0_#111]">Loading...</div>
        ) : competitions.length === 0 ? (
          <div className="border-[3px] border-black bg-white p-6 text-center font-inter font-bold text-black shadow-[6px_6px_0_#111]">No competitions available at the moment.</div>
        ) : (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {competitions.map((comp) => (
              <Link
                to={`/competition/${comp.id}`}
                key={comp.id}
                className="group block overflow-hidden border-[4px] border-black bg-white shadow-[8px_8px_0_#111] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[10px_10px_0_#111]"
              >
                {/* Poster image */}
                <div className="relative flex h-48 items-center justify-center overflow-hidden border-b-[4px] border-black bg-indigo-neo">
                  <img
                    src={comp.logo_url || getDefaultImage(comp.title)}
                    alt={comp.title}
                    className="h-28 w-28 object-contain transition-transform duration-300 group-hover:-rotate-2 group-hover:scale-110"
                  />
                </div>

                {/* Card content */}
                <div className="flex h-[calc(100%-12rem)] flex-col p-5">
                  <h3 className="font-bebas text-xl md:text-2xl text-black tracking-wider mb-2">
                    {comp.title}
                  </h3>
                  <p className="font-inter text-xs text-gray-600 leading-relaxed mb-4 line-clamp-3 flex-grow">
                    {comp.description?.substring(0, 80)}...
                  </p>
                  <div className="w-full border-[3px] border-black bg-indigo-neo py-2.5 text-center font-inter text-xs font-black uppercase text-white shadow-[4px_4px_0_#111] transition-colors group-hover:bg-indigo-700">
                    Lihat Lebih Lanjut →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CompetitionSection;
