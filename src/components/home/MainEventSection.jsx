import React, { useEffect, useState } from "react";
import { motion as Motion } from "motion/react";
import { Link } from "react-router-dom";
import { getEvents } from "../../services/eventService";
import {
  hoverLift,
  popIn,
  revealUp,
  staggerContainer,
  tapPress,
  viewportOnce,
} from "../../lib/motion";

const MotionLink = Motion.create(Link);

/**
 * Main Event Section — background indigo, 3x SectionCard (Seminar, Bootcamp, Workshop).
 */
const MainEventSection = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await getEvents("non_competition");
      if (response.success && response.data) {
        setEvents(response.data);
      }
      setLoading(false);
    };
    fetchEvents();
  }, []);

  return (
    <Motion.section
      id="event"
      className="w-full border-b-[5px] border-black bg-[#3f3aad] py-14 sm:py-16 md:py-20"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-7 md:px-10">
        {/* Heading */}
        <Motion.h2
          variants={revealUp}
          className="mb-9 text-center font-inter text-4xl font-black uppercase tracking-[-0.04em] text-[#ffd400] sm:text-5xl md:mb-12 md:text-6xl"
        >
          Main Event
        </Motion.h2>

        {loading ? (
          <Motion.div
            animate={{ rotate: [-1, 1, -1] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto w-fit border-[3px] border-black bg-yellow-neo px-6 py-3 font-inter font-black uppercase text-black shadow-[5px_5px_0_#111]"
          >
            Loading...
          </Motion.div>
        ) : events.length === 0 ? (
          <Motion.div
            variants={popIn}
            className="border-[3px] border-black bg-white p-6 text-center font-inter font-bold text-black shadow-[6px_6px_0_#111]"
          >
            No main events available at the moment.
          </Motion.div>
        ) : (
          <Motion.div
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer}
          >
            {events.map((event) => (
              <MotionLink
                to={`/event/${event.slug || event.id}`}
                key={event.id}
                variants={popIn}
                whileHover={hoverLift}
                whileTap={tapPress}
                className="group flex min-w-0 flex-col border-[4px] border-[#111827] bg-white p-6 text-center shadow-[8px_8px_0_#111827] transition-shadow duration-300 ease-out hover:shadow-[12px_14px_0_#111827] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#ffd400] sm:p-7"
              >
                {/* Icon */}
                <div className="mx-auto mb-8 flex h-28 w-40 items-center justify-center sm:h-32 sm:w-44">
                  <img
                    src={event.logo_url || "/images/DummyImg2.jpeg"}
                    alt={event.title}
                    className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = "/images/DummyImg2.jpeg";
                    }}
                  />
                </div>

                {/* Title */}
                <h3 className="mb-8 break-words font-inter text-base font-black uppercase tracking-[-0.02em] text-[#171918] sm:text-lg">
                  {event.title}
                </h3>

                {/* Description */}
                <p className="mb-10 flex-grow font-inter text-xs font-medium leading-relaxed text-[#4d505c]">
                  {event.description?.substring(0, 100)}...
                </p>

                {/* CTA */}
                <div className="mx-auto w-full border-[3px] border-black bg-[#ffd400] px-4 py-2.5 text-center font-inter text-[11px] font-black uppercase text-black shadow-[4px_4px_0_#111] transition-all duration-200 hover:-translate-y-1 hover:bg-[#3f3aad] hover:text-white hover:shadow-[5px_6px_0_#111] active:translate-x-1 active:translate-y-1 active:shadow-none">
                  Lihat Lebih Lanjut →
                </div>
              </MotionLink>
            ))}
          </Motion.div>
        )}
      </div>
    </Motion.section>
  );
};

export default MainEventSection;
