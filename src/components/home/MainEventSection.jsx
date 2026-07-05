import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../../services/eventService';
import SectionCard from '../ui/SectionCard';
import Button from '../ui/Button';

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
    <section id="event" className="w-full bg-indigo-neo py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Heading */}
        <h2 className="font-bebas text-5xl md:text-6xl text-white text-center tracking-wider mb-4">
          Main Event
        </h2>
        <div className="w-20 h-1 bg-yellow-neo mx-auto mb-12" />

        {loading ? (
          <div className="text-center text-white">Loading...</div>
        ) : events.length === 0 ? (
          <div className="text-center text-white">No main events available at the moment.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {events.map((event) => (
              <Link to={`/event/${event.id}`} key={event.id} className="block group">
                <SectionCard className="flex flex-col items-center text-center h-full hover:shadow-[6px_6px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200">
                  {/* Icon */}
                  <img
                    src={event.logo_url || getDefaultImage(event.title)}
                    alt={event.title}
                    className="w-20 h-20 md:w-24 md:h-24 object-contain mb-5 group-hover:scale-110 transition-transform duration-300"
                  />

                  {/* Title */}
                  <h3 className="font-bebas text-2xl md:text-3xl text-indigo-neo tracking-wider mb-3">
                    {event.title}
                  </h3>

                  {/* Description */}
                  <p className="font-inter text-sm text-gray-600 leading-relaxed mb-6 flex-grow">
                    {event.description?.substring(0, 100)}...
                  </p>

                  {/* CTA */}
                  <div className="w-full max-w-[200px] text-center bg-yellow-neo text-black font-inter font-bold py-2 px-4 rounded border-2 border-black shadow-[2px_2px_0px_#000] group-hover:bg-yellow-400 transition-colors text-sm">
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
