import React, { useState, useEffect } from "react";
import { motion as Motion } from "motion/react";
import { getCompetitionTimelines } from "../../api/eventPublic";
import { timelineEvents } from "../../data/events";
import {
  lineDraw,
  popIn,
  revealUp,
  staggerContainer,
  timelineDot,
  viewportOnce,
} from "../../lib/motion";

const COMPETITION_TIMELINE_EMPTY =
  "Belum ada timeline competition yang tersedia";

/**
 * Timeline Section — box putih dengan badge "2026", 2 kolom: Main Events & Competitions.
 */
const TimelineSection = () => {
  const [timelineCompetitions, setTimelineCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const formatDate = (dateString, endDateString = null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Jakarta",
    };
    const formatter = new Intl.DateTimeFormat("id-ID", options);

    if (endDateString) {
      const endDate = new Date(endDateString);

      const getMonthYearString = (d) =>
        new Intl.DateTimeFormat("id-ID", {
          month: "long",
          year: "numeric",
          timeZone: "Asia/Jakarta",
        }).format(d);
      const getDayString = (d) =>
        new Intl.DateTimeFormat("id-ID", {
          day: "numeric",
          timeZone: "Asia/Jakarta",
        }).format(d);

      if (getMonthYearString(date) === getMonthYearString(endDate)) {
        return `${getDayString(date)} - ${getDayString(endDate)} ${getMonthYearString(date)}`;
      }
      return `${formatter.format(date)} - ${formatter.format(endDate)}`;
    }

    return formatter.format(date);
  };

  useEffect(() => {
    const fetchTimelines = async () => {
      setLoading(true);
      setError(false);
      try {
        // Fetch global competition timelines
        const compRes = await getCompetitionTimelines();
        if (compRes.success && compRes.data) {
          const mapped = compRes.data.map((item) => ({
            id: item.id,
            title: item.title,
            date: formatDate(item.start_date, item.end_date),
            dateObj: new Date(item.start_date),
          }));
          mapped.sort((a, b) => a.dateObj - b.dateObj);
          setTimelineCompetitions(mapped);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error loading timelines:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTimelines();
  }, []);

  return (
    <Motion.section
      id="timeline"
      className="w-full border-b-[5px] border-black bg-[#f7f7f4] py-16 md:py-24"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-7 md:px-10">
        {/* Timeline card */}
        <Motion.div
          variants={revealUp}
          whileHover={{ y: -5, rotate: -0.15 }}
          className="relative border-[4px] border-[#171918] bg-white px-6 pb-9 pt-16 shadow-[10px_10px_0_#171918] sm:px-8 md:p-12"
        >
          {/* Badge 2026 */}
          <Motion.div
            variants={popIn}
            animate={{ rotate: [-3, 3, -3] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-3 -top-9 flex h-24 w-24 items-center justify-center rounded-full border-[4px] border-[#171918] bg-[#ffd400] font-inter text-xl font-black text-black shadow-[7px_7px_0_#171918] sm:-right-5 sm:-top-10 sm:h-28 sm:w-28 sm:text-2xl"
          >
            2026
          </Motion.div>

          <Motion.h2
            variants={revealUp}
            className="border-b-[4px] border-[#171918] pb-5 pr-16 font-inter text-3xl font-black uppercase tracking-[-0.04em] text-[#171918] sm:text-4xl md:pr-28 md:text-5xl"
          >
            Timeline Event
          </Motion.h2>

          {/* Two columns */}
          <div className="mt-10 grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-20">
            {/* Main Events column */}
            <div>
              <h3 className="mb-7 border-l-[7px] border-[#4246b8] py-1 pl-4 font-inter text-sm font-black uppercase tracking-[0.12em] text-[#4246b8] sm:text-base">
                Main Events
              </h3>
              <Motion.div className="space-y-6" variants={staggerContainer}>
                {timelineEvents.map((item, index) => (
                  <Motion.div
                    key={index}
                    className="group flex items-start gap-4"
                    variants={revealUp}
                  >
                    {/* Bullet */}
                    <div className="relative mt-0.5 flex w-4 shrink-0 justify-center">
                      <Motion.div
                        variants={timelineDot}
                        className={`z-10 h-4 w-4 rounded-full border-2 border-[#171918] transition-transform duration-200 group-hover:scale-125 ${
                          index === timelineEvents.length - 1
                            ? "bg-[#4246b8]"
                            : "bg-[#ffd400]"
                        }`}
                      />
                      {index < timelineEvents.length - 1 && (
                        <Motion.div
                          variants={lineDraw}
                          className={`absolute top-3 h-9 w-[3px] ${
                            index === timelineEvents.length - 1
                              ? "bg-[#4246b8]"
                              : "bg-[#ffd400]"
                          }`}
                        />
                      )}
                    </div>
                    <div>
                      <p
                        className={`font-inter text-sm font-black uppercase sm:text-base ${
                          index === timelineEvents.length - 1
                            ? "text-[#4246b8]"
                            : "text-[#171918]"
                        }`}
                      >
                        {item.title}
                      </p>
                      <p className="mt-1 font-inter text-xs font-medium text-[#4d505c] sm:text-sm">
                        {item.date}
                      </p>
                    </div>
                  </Motion.div>
                ))}
              </Motion.div>
            </div>

            {/* Competitions column */}
            <div>
              <h3 className="mb-7 border-l-[7px] border-[#4246b8] py-1 pl-4 font-inter text-sm font-black uppercase tracking-[0.12em] text-[#4246b8] sm:text-base">
                Competitions
              </h3>
              <Motion.div className="space-y-6" variants={staggerContainer}>
                {loading ? (
                  <div className="flex justify-center py-10">
                    <Motion.div
                      className="h-8 w-8 rounded-full border-4 border-black border-t-[#ffd400]"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </div>
                ) : error ? (
                  <Motion.p
                    variants={popIn}
                    className="pl-4 font-inter text-sm font-medium text-red-500"
                  >
                    {COMPETITION_TIMELINE_EMPTY}
                  </Motion.p>
                ) : timelineCompetitions.length > 0 ? (
                  timelineCompetitions.map((item, index) => (
                    <Motion.div
                      key={item.id}
                      className="group flex items-start gap-4"
                      variants={revealUp}
                    >
                      {/* Bullet */}
                      <div className="relative mt-0.5 flex w-4 shrink-0 justify-center">
                        <Motion.div
                          variants={timelineDot}
                          className="z-10 h-4 w-4 rounded-full border-2 border-[#171918] bg-[#4246b8] transition-transform duration-200 group-hover:scale-125"
                        />
                        {index < timelineCompetitions.length - 1 && (
                          <Motion.div
                            variants={lineDraw}
                            className="absolute top-3 h-9 w-[3px] bg-[#4246b8]"
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-inter text-sm font-black uppercase text-[#171918] sm:text-base">
                          {item.title}
                        </p>
                        <p className="mt-1 font-inter text-xs font-medium text-[#4d505c] sm:text-sm">
                          {item.date}
                        </p>
                      </div>
                    </Motion.div>
                  ))
                ) : (
                  <Motion.p
                    variants={popIn}
                    className="pl-4 font-inter text-sm italic text-gray-500"
                  >
                    {COMPETITION_TIMELINE_EMPTY}
                  </Motion.p>
                )}
              </Motion.div>
            </div>
          </div>
        </Motion.div>
      </div>
    </Motion.section>
  );
};

export default TimelineSection;
