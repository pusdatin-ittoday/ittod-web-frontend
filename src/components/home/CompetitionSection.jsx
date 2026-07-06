import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../../services/eventService';

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
    <section id="competition" className="w-full border-b-[5px] border-black bg-[#ffe477] py-14 sm:py-16 md:py-20">
      <div className="mx-auto max-w-[90rem] px-5 sm:px-7 md:px-10">
        {/* Heading */}
        <div className="mb-6 flex items-end justify-between gap-5">
          <h2 className="font-inter text-4xl font-black uppercase tracking-[-0.04em] text-[#111827] sm:text-5xl md:text-6xl">
            Competition
          </h2>
          <p className="hidden pb-1 font-bebas text-lg uppercase tracking-[0.06em] text-black sm:block">
            Show Your Skills
          </p>
        </div>
        <div className="mb-8 h-[4px] w-full bg-[#111827] md:mb-10" />

        {loading ? (
          <div className="mx-auto w-fit border-[3px] border-black bg-white px-6 py-3 font-inter font-black uppercase text-black shadow-[5px_5px_0_#111]">Loading...</div>
        ) : competitions.length === 0 ? (
          <div className="border-[3px] border-black bg-white p-6 text-center font-inter font-bold text-black shadow-[6px_6px_0_#111]">No competitions available at the moment.</div>
        ) : (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-4">
            {competitions.map((comp) => {
              return (
                <Link
                to={`/competition/${comp.id}`}
                key={comp.id}
                className="group flex min-w-0 flex-col border-[4px] border-[#111827] bg-white p-3 shadow-[8px_8px_0_#111827] transition-all duration-300 ease-out hover:-translate-x-1 hover:-translate-y-2 hover:-rotate-[0.5deg] hover:shadow-[12px_14px_0_#111827] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-indigo-neo"
              >
                {/* Poster image */}
                <div className="relative flex aspect-[5/4] items-center justify-center overflow-hidden border-[3px] border-[#111827] bg-white">
                  <span className="absolute left-3 top-3 z-10 border-2 border-black bg-[#ffd400] px-2 py-1 font-bebas text-[10px] uppercase tracking-wide text-black">
                    {comp.title}
                  </span>
                  <img
                    src={comp.logo_url}
                    alt={comp.title}
                    className="h-full w-full object-contain p-7 transition-transform duration-500 ease-out group-hover:rotate-2 group-hover:scale-110 sm:p-9"
                  />
                </div>

                {/* Card content */}
                <div className="flex flex-1 flex-col px-1 pb-1 pt-4">
                  <h3 className="mb-2 font-bebas text-xl tracking-[0.04em] text-[#293f9e] md:text-2xl">
                    {comp.title}
                  </h3>
                  <p className="mb-5 line-clamp-3 flex-grow font-inter text-xs leading-relaxed text-[#4d505c]">
                    {comp.description?.substring(0, 80)}...
                  </p>
                  <div className="group/button flex w-full items-center justify-center gap-2 border-[3px] border-black bg-[#3f3aad] px-3 py-2.5 text-center font-inter text-[11px] font-black uppercase text-white shadow-[4px_4px_0_#111] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#7a6800] hover:shadow-[5px_6px_0_#111] active:translate-x-1 active:translate-y-1 active:shadow-none">
                    Lihat Lebih Lanjut →
                  </div>
                </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default CompetitionSection;
