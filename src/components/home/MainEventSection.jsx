import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../../services/eventService';
import SectionCard from '../ui/SectionCard';

const getDefaultImage = (title) => {
  if (!title) return '/logo-event/SEMINAR-NASIONAL.webp';
  const t = title.toLowerCase();
  if (t.includes('bootcamp')) return '/logo-event/BOOTCAMP.webp';
  if (t.includes('workshop')) return '/logo-event/WORKSHOP.webp';
  return '/logo-event/SEMINAR-NASIONAL.webp';
};

/**
 * Main Event Section — background indigo, 3x SectionCard (Seminar, Bootcamp, Workshop).
 */
const MainEventSection = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await getEvents('non_competition');
      if (response.success && response.data) {
        setEvents(response.data);
      }
      setLoading(false);
    };
    fetchEvents();
  }, []);

  return (
    <section id="event" className="w-full border-b-[5px] border-black bg-indigo-neo py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        {/* Heading */}
        <h2 className="mb-3 text-center font-bebas text-5xl tracking-[0.1em] text-white md:text-7xl">
          Main Event
        </h2>
        <div className="mx-auto mb-12 h-[5px] w-24 bg-yellow-neo" />

        {loading ? (
          <div className="mx-auto w-fit border-[3px] border-black bg-yellow-neo px-6 py-3 font-inter font-black uppercase text-black shadow-[5px_5px_0_#111]">Loading...</div>
        ) : events.length === 0 ? (
          <div className="border-[3px] border-black bg-white p-6 text-center font-inter font-bold text-black shadow-[6px_6px_0_#111]">No main events available at the moment.</div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {events.map((event) => (
              <Link to={`/event/${event.id}`} key={event.id} className="block group">
                <SectionCard className="flex h-full flex-col items-center border-[4px] border-black bg-white text-center shadow-[8px_8px_0_#111] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[10px_10px_0_#111]">
                  {/* Icon */}
                  <img
                    src={event.logo_url || getDefaultImage(event.title)}
                    alt={event.title}
                    className="mb-5 h-20 w-20 object-contain transition-transform duration-300 group-hover:-rotate-2 group-hover:scale-110 md:h-24 md:w-24"
                  />

                  {/* Title */}
                  <h3 className="mb-3 font-bebas text-2xl tracking-wider text-indigo-neo md:text-3xl">
                    {event.title}
                  </h3>

                  {/* Description */}
                  <p className="mb-6 flex-grow font-inter text-sm font-medium leading-relaxed text-gray-600">
                    {event.description?.substring(0, 100)}...
                  </p>

                  {/* CTA */}
                  <div className="w-full max-w-[220px] border-[3px] border-black bg-yellow-neo px-4 py-2.5 text-center font-inter text-xs font-black uppercase text-black shadow-[4px_4px_0_#111] transition-colors group-hover:bg-yellow-400">
                    Lihat Lebih Lanjut →
                  </div>
                </SectionCard>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MainEventSection;
