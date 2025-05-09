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
          description='Wawasan menarik di bidang Teknologi Informasi!'
          imageSrc={'/logo-event/SEMINAR-NASIONAL.webp'}
          linkHref="/event/national_seminar"
        />
        <LandingEventCard
          title="Bootcamp"
          description="Asah kemampuanmu dalam bidang Teknologi Informasi!"
          imageSrc={'/logo-event/BOOTCAMP.webp'}
          linkHref="/event/bootcamp"
        />
        <LandingEventCard
          title="Workshop"
          description="Temui dengan para ahli di berbagai bidang IT!"
          imageSrc={'/logo-event/WORKSHOP.webp'}
          linkHref="/event/workshop"
        />
      </div>
    </div>
  );
};

export default Event;
