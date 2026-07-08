import React, { useEffect, useState } from "react";
import { motion as Motion } from "motion/react";
import { Link } from "react-router-dom";
import { getEvents } from "../../services/eventService";
import { getCompetitionTimelines } from "../../api/eventPublic";
import {
  hoverLift,
  popIn,
  revealUp,
  staggerContainer,
  tapPress,
  viewportOnce,
} from "../../lib/motion";

const MotionLink = Motion.create(Link);

const defaultCompetitions = [
  {
    id: "HackToday",
    title: "Hack Today",
    description: "Kompetisi Capture the Flag (CTF) tingkat nasional untuk menguji kemampuan analisis dan eksploitasi keamanan siber.",
    logo_url: "https://cdn.ittoday.web.id/events/logos/uWRUdDcbAQTJvarX350jeC0fezK9PhRQQXQdMJzZ.png"
  },
  {
    id: "MineToday",
    title: "Mine Today",
    description: "Kompetisi perancangan dan pengembangan game tingkat nasional untuk memamerkan kreativitas dan gameplay inovatif.",
    logo_url: "https://cdn.ittoday.web.id/events/logos/aSekiyHcy0RnaAjYUvtZWx1Gf1Z7L1FQK6DyHUC.png"
  },
  {
    id: "UXToday",
    title: "UX Today",
    description: "Kompetisi perancangan antarmuka pengguna (UI/UX) tingkat nasional untuk menghadirkan solusi digital kreatif.",
    logo_url: null
  },
  {
    id: "CodeToday",
    title: "IT-Brains",
    description: "Kompetisi analisis bisnis IT dan pemecahan masalah (IT Case Study) berskala nasional.",
    logo_url: null
  }
];

/**
 * Competition Section — background kuning, 4x card poster kompetisi.
 */
const CompetitionSection = () => {
  const [competitions, setCompetitions] = useState(defaultCompetitions);
  const [loading, setLoading] = useState(false);
  const [targetEvent, setTargetEvent] = useState(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const fetchCompetitionsAndTimelines = async () => {
      try {
        const [compResponse, timelineResponse] = await Promise.all([
          getEvents("competition"),
          getCompetitionTimelines()
        ]);
        
        if (compResponse.success && compResponse.data) {
          setCompetitions(compResponse.data);
        }

        if (timelineResponse.success && Array.isArray(timelineResponse.data)) {
          const now = new Date();
          // Find the closest future event
          const futureEvents = timelineResponse.data
            .map(t => ({
                ...t,
                dateObj: new Date(t.start_date || t.date)
            }))
            .filter(e => e.dateObj > now)
            .sort((a, b) => a.dateObj - b.dateObj);
            
          if (futureEvents.length > 0) {
            setTargetEvent(futureEvents[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchCompetitionsAndTimelines();
  }, []);

  useEffect(() => {
    if (!targetEvent) return;

    const intervalId = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetEvent.dateObj.getTime() - now;

      if (distance < 0) {
        clearInterval(intervalId);
        setTargetEvent(null); // Or trigger a refetch
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [targetEvent]);

  return (
    <Motion.section
      id="competition"
      className="w-full border-b-[5px] border-black bg-[#ffe477] py-14 sm:py-16 md:py-20"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer}
    >
      <div className="mx-auto max-w-[90rem] px-5 sm:px-7 md:px-10">
        {/* Heading */}
        <Motion.div
          className="mb-6 flex flex-col items-center justify-center gap-5 text-center"
          variants={revealUp}
        >
          <div className="flex flex-col gap-2">
            <h2 className="font-inter text-4xl font-black uppercase tracking-[-0.04em] text-[#111827] sm:text-5xl md:text-6xl">
              Competition
            </h2>
            <p className="pb-1 font-bebas text-lg uppercase tracking-[0.06em] text-black">
              Show Your Skills
            </p>
          </div>
          
          {targetEvent && (
            <div className="flex flex-col items-center mt-4 w-full">
              <span className="font-space-grotesk text-xl sm:text-2xl md:text-3xl font-black uppercase text-[#111827] text-center mb-2">
                {targetEvent.title || targetEvent.name || "Next Agenda"} closes in:
              </span>
              <div className="flex items-center justify-center gap-2 mb-6 text-[#111827] font-space-grotesk font-bold text-sm sm:text-base bg-[#ffe477] px-4 py-2 border-[3px] border-[#111827] shadow-[4px_4px_0_#111827]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                {targetEvent.dateObj.toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' })} WIB
              </div>
              <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
                {[
                  { label: 'Days', value: timeLeft.days },
                  { label: 'Hours', value: timeLeft.hours },
                  { label: 'Minutes', value: timeLeft.minutes },
                  { label: 'Seconds', value: timeLeft.seconds }
                ].map((item, idx, arr) => (
                  <React.Fragment key={idx}>
                    <div className="flex flex-col items-center justify-center rounded-full border-[5px] border-[#111827] bg-white text-[#111827] shadow-[6px_6px_0_#111827] w-[75px] h-[75px] sm:w-[100px] sm:h-[100px] md:w-[130px] md:h-[130px] transition-transform hover:scale-105">
                      <span className="text-[9px] sm:text-xs md:text-sm font-black uppercase font-space-grotesk mb-1 md:mb-1.5">{item.label}</span>
                      <div className="w-[60%] border-t-[3px] sm:border-t-[4px] border-[#111827] mb-1 md:mb-2"></div>
                      <span className="font-black text-xl sm:text-3xl md:text-5xl leading-none">{item.value.toString().padStart(2, '0')}</span>
                    </div>
                    {idx < arr.length - 1 && (
                      <div className="flex flex-col gap-2 sm:gap-3">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#111827]"></div>
                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#111827]"></div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </Motion.div>
        <Motion.div
          className="mb-8 h-[4px] w-full origin-left bg-[#111827] md:mb-10"
          variants={{
            hidden: { scaleX: 0 },
            visible: { scaleX: 1, transition: { duration: 0.55 } },
          }}
        />

        {loading ? (
          <Motion.div
            animate={{ rotate: [-1, 1, -1] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto w-fit border-[3px] border-black bg-white px-6 py-3 font-inter font-black uppercase text-black shadow-[5px_5px_0_#111]"
          >
            Loading...
          </Motion.div>
        ) : competitions.length === 0 ? (
          <Motion.div
            variants={popIn}
            className="border-[3px] border-black bg-white p-6 text-center font-inter font-bold text-black shadow-[6px_6px_0_#111]"
          >
            No competitions available at the moment.
          </Motion.div>
        ) : (
          <Motion.div
            className="grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-4"
            variants={staggerContainer}
          >
            {competitions.map((comp) => {
              return (
                <MotionLink
                  to={`/competition/${comp.id}`}
                  key={comp.id}
                  variants={popIn}
                  whileHover={hoverLift}
                  whileTap={tapPress}
                  className="group flex min-w-0 flex-col border-[4px] border-[#111827] bg-white p-3 shadow-[8px_8px_0_#111827] transition-shadow duration-300 ease-out hover:shadow-[12px_14px_0_#111827] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-indigo-neo"
                >
                  {/* Poster image */}
                  <div className="relative flex aspect-[5/4] items-center justify-center overflow-hidden border-[3px] border-[#111827] bg-white">
                    <span className="absolute left-3 top-3 z-10 border-2 border-black bg-[#ffd400] px-2 py-1 font-bebas text-[10px] uppercase tracking-wide text-black">
                      {comp.title}
                    </span>
                    <img
                      src={comp.logo_url || "/images/DummyImg2.jpeg"}
                      alt={comp.title}
                      className="h-full w-full object-contain p-7 transition-transform duration-500 ease-out group-hover:rotate-2 group-hover:scale-110 sm:p-9"
                      onError={(e) => {
                        e.target.src = "/images/DummyImg2.jpeg";
                      }}
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
                </MotionLink>
              );
            })}
          </Motion.div>
        )}
      </div>
    </Motion.section>
  );
};

export default CompetitionSection;
