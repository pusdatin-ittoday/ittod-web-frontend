import React, { useEffect, useState } from 'react';
import LandingEventCard from '../../components/LandingEventCard';
import { getPublicEvents } from '../../api/eventPublic';

const Event = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await getPublicEvents('non_competition');
      if (res.success && res.data) {
        setEvents(res.data);
      }
      setLoading(false);
    };
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center py-16 px-4 lg:px-8 gap-8">
      <h1 className="text-white text-4xl lg:text-5xl font-playfair font-bold leading-[140.625%] [text-shadow:0px_5px_10px_rgba(172,104,113,0.7)]">Event</h1>

      {loading ? (
        <p className="text-white">Loading...</p>
      ) : (
        <div className="flex flex-wrap justify-center align-middle gap-10">
          {events.map((evt) => (
            <LandingEventCard
              key={evt.id}
              title={evt.title}
              description={evt.description}
              imageSrc={`/logo-event/${evt.id.toUpperCase()}.webp`}
              linkHref={`/event/${evt.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Event;
