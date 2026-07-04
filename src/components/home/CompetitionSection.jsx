import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../../services/eventService';
import Button from '../ui/Button';

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
    <section id="competition" className="w-full bg-yellow-neo py-16 md:py-24 border-y-4 border-black">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Heading */}
        <h2 className="font-bebas text-5xl md:text-6xl text-black text-center tracking-wider mb-4">
          Competition
        </h2>
        <div className="w-20 h-1 bg-indigo-neo mx-auto mb-12" />

        {loading ? (
          <div className="text-center text-black">Loading...</div>
        ) : competitions.length === 0 ? (
          <div className="text-center text-black">No competitions available at the moment.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {competitions.map((comp) => (
              <Link
                to={`/competition/${comp.id}`}
                key={comp.id}
                className="group block bg-white border-2 border-black rounded-lg overflow-hidden shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200"
              >
                {/* Poster image */}
                <div className="relative h-48 bg-indigo-neo flex items-center justify-center overflow-hidden border-b-2 border-black">
                  <img
                    src={comp.logo_url || getDefaultImage(comp.title)}
                    alt={comp.title}
                    className="w-28 h-28 object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Card content */}
                <div className="p-5 flex flex-col h-[calc(100%-12rem)]">
                  <h3 className="font-bebas text-xl md:text-2xl text-black tracking-wider mb-2">
                    {comp.title}
                  </h3>
                  <p className="font-inter text-xs text-gray-600 leading-relaxed mb-4 line-clamp-3 flex-grow">
                    {comp.description?.substring(0, 80)}...
                  </p>
                  <div className="w-full text-center bg-indigo-neo text-white font-inter font-bold py-2 rounded border-2 border-black shadow-[2px_2px_0px_#000] group-hover:bg-indigo-700 transition-colors text-sm">
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
