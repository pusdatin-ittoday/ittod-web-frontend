import React from 'react';
import { timelineEvents, timelineCompetitions } from '../../data/events';

/**
 * Timeline Section — box putih dengan badge "2026", 2 kolom: Main Events & Competitions.
 */
const TimelineSection = () => {
  return (
    <section id="timeline" className="w-full bg-gray-50 py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Heading */}
        <h2 className="font-bebas text-5xl md:text-6xl text-black text-center tracking-wider mb-12">
          Timeline
        </h2>

        {/* Timeline card */}
        <div className="relative card-brutal-no-hover rounded-lg p-8 md:p-12 bg-white">
          {/* Badge 2026 */}
          <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-indigo-neo text-white font-bebas text-2xl px-4 py-1 border-2 border-black shadow-[3px_3px_0px_#000] tracking-widest">
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
