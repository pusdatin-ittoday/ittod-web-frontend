import React, { useEffect, useState } from 'react';
import LandingCompetitionCard from '../../components/LandingCompetitionCard';
import { getPublicEvents } from '../../api/eventPublic';

const Lomba = () => {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompetitions = async () => {
      const res = await getPublicEvents('competition');
      if (res.success && res.data) {
        setCompetitions(res.data);
      }
      setLoading(false);
    };
    fetchCompetitions();
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center py-16 px-4 lg:px-8 gap-8">
      <h1 className="text-white text-4xl lg:text-5xl font-playfair font-bold leading-[140.625%] [text-shadow:0px_5px_10px_rgba(172,104,113,0.7)]">
        Competition
      </h1>

      {loading ? (
        <p className="text-white">Loading...</p>
      ) : (
        <div className="flex flex-wrap justify-center align-middle gap-10">
          {competitions.map((comp) => (
            <LandingCompetitionCard
              key={comp.id}
              title={comp.title}
              description={comp.description}
              imageSrc={`/logo-competition/${comp.id.toUpperCase()}.webp`}
              linkHref={`/competition/${comp.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Lomba;
