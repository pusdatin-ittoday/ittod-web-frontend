import React from 'react';
import LandingEventCard from '../../components/LandingEventCard';

const Event = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center py-16 px-4 lg:px-8   gap-8">
      <h1 className="text-white text-4xl lg:text-5xl font-playfair font-bold leading-[140.625%] [text-shadow:0px_5px_10px_rgba(172,104,113,0.7)]">Event</h1>

      {/* Events */}
      <div className="flex flex-wrap justify-center align-middle gap-10">
        <LandingEventCard
          title="National Seminar"
          // description='National Seminar is one of the series of events under IT Today 2025, aimed at students and the general public who have an interest in the field of Information Technology. This aligns with the theme of IT Today 2025: “Collaborating for Change and Harnessing the Power of Technology."'
          imageSrc={'/logo-event/SEMINAR-NASIONAL.webp'}
          linkHref="/event/national_seminar"
        />
        <LandingEventCard
          title="Bootcamp"
          // description="Bootcamp is a training program designed to equip participants with skills and knowledge related to the field of Information Technology. The bootcamp is held for several hours per week over the course of three weeks."
          imageSrc={'/logo-event/BOOTCAMP.webp'}
          linkHref="/event/bootcamp"
        />
        <LandingEventCard
          title="Workshop"
          // description="Workshop is a training session featuring speakers who are experts in their respective fields. This workshop allows participants to actively engage and interact with the speakers on various interesting IT-related topics."
          imageSrc={'/logo-event/WORKSHOP.webp'}
          linkHref="/event/workshop"
        />
      </div>
    </div>
  );
};

export default Event;
