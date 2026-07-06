import React from 'react';
import { timelineEvents, timelineCompetitions } from '../../data/events';

/**
 * Timeline Section — box putih dengan badge "2026", 2 kolom: Main Events & Competitions.
 */
const TimelineSection = () => {
  return (
    <section id="timeline" className="w-full border-b-[5px] border-black bg-[#f7f7f4] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-7 md:px-10">
        {/* Timeline card */}
        <div className="relative border-[4px] border-[#171918] bg-white px-6 pb-9 pt-16 shadow-[10px_10px_0_#171918] sm:px-8 md:p-12">
          {/* Badge 2026 */}
          <div className="absolute -right-3 -top-9 flex h-24 w-24 items-center justify-center rounded-full border-[4px] border-[#171918] bg-[#ffd400] font-inter text-xl font-black text-black shadow-[7px_7px_0_#171918] sm:-right-5 sm:-top-10 sm:h-28 sm:w-28 sm:text-2xl">
            2026
          </div>

          <h2 className="border-b-[4px] border-[#171918] pb-5 pr-16 font-inter text-3xl font-black uppercase tracking-[-0.04em] text-[#171918] sm:text-4xl md:pr-28 md:text-5xl">
            Timeline Event
          </h2>

          {/* Two columns */}
          <div className="mt-10 grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-20">
            {/* Main Events column */}
            <div>
              <h3 className="mb-7 border-l-[7px] border-[#4246b8] py-1 pl-4 font-inter text-sm font-black uppercase tracking-[0.12em] text-[#4246b8] sm:text-base">
                Main Events
              </h3>
              <div className="space-y-6">
                {timelineEvents.map((item, index) => (
                  <div key={index} className="group flex items-start gap-4">
                    {/* Bullet */}
                    <div className="relative mt-0.5 flex w-4 shrink-0 justify-center">
                      <div className={`z-10 h-4 w-4 rounded-full border-2 border-[#171918] transition-transform duration-200 group-hover:scale-125 ${
                        index === timelineEvents.length - 1 ? 'bg-[#4246b8]' : 'bg-[#ffd400]'
                      }`} />
                      {index < timelineEvents.length - 1 && (
                        <div className={`absolute top-3 h-9 w-[3px] ${
                          index === timelineEvents.length - 1 ? 'bg-[#4246b8]' : 'bg-[#ffd400]'
                        }`} />
                      )}
                    </div>
                    <div>
                      <p className={`font-inter text-sm font-black uppercase sm:text-base ${
                        index === timelineEvents.length - 1 ? 'text-[#4246b8]' : 'text-[#171918]'
                      }`}>{item.title}</p>
                      <p className="mt-1 font-inter text-xs font-medium text-[#4d505c] sm:text-sm">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Competitions column */}
            <div>
              <h3 className="mb-7 border-l-[7px] border-[#4246b8] py-1 pl-4 font-inter text-sm font-black uppercase tracking-[0.12em] text-[#4246b8] sm:text-base">
                Competitions
              </h3>
              <div className="space-y-6">
                {timelineCompetitions.map((item, index) => (
                  <div key={index} className="group flex items-start gap-4">
                    {/* Bullet */}
                    <div className="relative mt-0.5 flex w-4 shrink-0 justify-center">
                      <div className="z-10 h-4 w-4 rounded-full border-2 border-[#171918] bg-[#4246b8] transition-transform duration-200 group-hover:scale-125" />
                      {index < timelineCompetitions.length - 1 && (
                        <div className="absolute top-3 h-9 w-[3px] bg-[#4246b8]" />
                      )}
                    </div>
                    <div>
                      <p className="font-inter text-sm font-black uppercase text-[#171918] sm:text-base">{item.title}</p>
                      <p className="mt-1 font-inter text-xs font-medium text-[#4d505c] sm:text-sm">{item.date}</p>
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
