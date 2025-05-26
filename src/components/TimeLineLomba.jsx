import React, { useState } from 'react';

// Komponen item untuk tiap langkah pada timeline
const TimelineItem = ({ title, date, isFirst, isLast }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseHover = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div
      className="relative pl-12 mb-12"
      onMouseOver={handleMouseHover}
      onMouseLeave={handleMouseLeave}
    >
      {/* Garis vertikal ke atas */}
      <div
        className="absolute left-5.5 bottom-10 w-1 h-0 lg:h-14 bg-white/20 timeline-line-glow"
        style={{ display: isFirst ? 'none' : 'block' }}
      ></div>

      {/* Garis vertikal ke bawah */}
      <div
        className="absolute left-5.5 top-10 w-1 h-0 lg:h-14 bg-white/20 timeline-line-glow"
        style={{ display: isLast ? 'none' : 'block' }}
      ></div>

      {/* Lingkaran indikator */}
      <div
        className="absolute left-0 top-2 lg:w-12 w-10 lg:h-12 h-10 rounded-full flex items-center justify-center z-10 timeline-circle-glow"
        style={{
          backgroundColor: isHovered ? '#FF9BA8' : '#593151',
          transition: 'background-color 0.3s ease-in-out, transform 0.3s ease-in-out',
        }}
      ></div>

      {/* Teks judul dan tanggal */}
      <div className="flex flex-col justify-center lg:ml-4 ml-[-10px]">
        <h3 className="text-white text-xl lg:text-2xl font-bold mb-1 font-dm-sans drop-shadow-[0_0_10px_#ac6871] pl-6">{title}</h3>
        <p className="text-sm lg:text-xl text-white/80 font-dm-sans pl-6">{date}</p>
      </div>
    </div>
  );
};

// Komponen utama timeline lomba
const TimelineLomba = ({items}) => {


  return (
    <>
      <h1 className="text-center text-white text-4xl lg:text-5xl font-playfair font-bold leading-[140.625%] [text-shadow:0px_5px_10px_rgba(172,104,113,0.7)]">TIMELINE</h1>
      <div className="flex justify-center px-8 py-16">
        <div className="max-w-xl">
          {items.map((item, index) => (
            <TimelineItem
              key={index}
              {...item}
              isLast={index === items.length - 1}
              isFirst={index === 0}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default TimelineLomba;
