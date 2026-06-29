import React from 'react';
import LandingCompetitionCard from '../../components/LandingCompetitionCard';

const Lomba = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center py-16 px-4 lg:px-8 gap-8">
      <h1 className="text-white text-4xl lg:text-5xl font-playfair font-bold leading-[140.625%] [text-shadow:0px_5px_10px_rgba(172,104,113,0.7)]">
        Competition
      </h1>

      {/* competitions */}
      <div className="flex flex-wrap justify-center align-middle gap-10">
        <LandingCompetitionCard
          title="Hack Today"
          description="Aku Nak Flag 🥵"
          imageSrc={"/logo-competition/HACKTODAY.webp"}
          linkHref="/competition/hack_today"
        />
        <LandingCompetitionCard
          title="Mine Today"
          description="Selesaikan masalah dengan Machine Learning!"
          imageSrc={"/logo-competition/MINETODAY.webp"}
          linkHref="/competition/mine_today"
        />
        <LandingCompetitionCard
          title="UX Today"
          description="Rancang UI/UX yang inovatif!"
          imageSrc={"/logo-competition/UXTODAY.webp"}
          linkHref="/competition/ux_today"
        />
        <LandingCompetitionCard
          title="Game Today"
          description="Jadilah Toby Fox 2.0!"
          imageSrc="/logo-competition/GAMETODAY.webp"
          linkHref="/competition/game_today"
        />
      </div>
    </div>
  );
};

export default Lomba;
