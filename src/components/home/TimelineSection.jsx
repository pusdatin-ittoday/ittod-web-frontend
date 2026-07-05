import React from 'react';
import { timelineEvents, timelineCompetitions } from '../../data/events';

/**
 * Timeline Section — box putih dengan badge "2026", 2 kolom: Main Events & Competitions.
 */
const TimelineSection = () => {
  return (
    <section id="timeline" className="w-full border-b-[5px] border-black bg-[#f7f7f4] py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        {/* Heading */}
        <h2 className="mb-12 text-center font-bebas text-5xl tracking-[0.1em] text-black md:text-7xl">
          Timeline
        </h2>

        {/* Timeline card */}
        <div className="relative border-[4px] border-black bg-white p-8 shadow-[9px_9px_0_#111] md:p-12">
          {/* Badge 2026 */}
          <div className="absolute right-4 top-4 border-[3px] border-black bg-indigo-neo px-4 py-1 font-bebas text-2xl tracking-widest text-white shadow-[5px_5px_0_#111] md:right-6 md:top-6">
            2026
          </div>

          {/* Two columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 mt-6 md:mt-2">
            {/* Main Events column */}
            <div>
              <h3 className="font-bebas text-2xl text-indigo-neo tracking-wider mb-6 border-b-2 border-black pb-2">
                Main Events
              </h3>
              <div className="space-y-5">
                {timelineEvents.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    {/* Bullet */}
                    <div className="w-4 h-4 bg-yellow-neo border-2 border-black rounded-full mt-1 shrink-0" />
                    <div>
                      <p className="font-inter font-semibold text-black text-base">{item.title}</p>
                      <p className="font-inter text-sm text-gray-500 mt-0.5">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Competitions column */}
            <div>
              <h3 className="font-bebas text-2xl text-indigo-neo tracking-wider mb-6 border-b-2 border-black pb-2">
                Competitions
              </h3>
              <div className="space-y-5">
                {timelineCompetitions.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    {/* Bullet */}
                    <div className="w-4 h-4 bg-indigo-neo border-2 border-black rounded-full mt-1 shrink-0" />
                    <div>
                      <p className="font-inter font-semibold text-black text-base">{item.title}</p>
                      <p className="font-inter text-sm text-gray-500 mt-0.5">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
