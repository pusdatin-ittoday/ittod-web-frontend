import React, { useState } from "react";

// Timeline item component that represents each step on the timeline
const TimelineItem = ({ title, date, isFirst, isLast }) => {
  
  const [isHovered, setIsHovered] = useState(() => {
    const initialState = false;
    return initialState;
  });

  const handleMouseHover = () => {
    setIsHovered(true);
  }

  const handleMouseLeave = () => {
    setIsHovered(false);
  }
  
  return (
    <div className="relative pl-12 mb-12" onMouseOver={handleMouseHover} onMouseLeave={handleMouseLeave}>
      {/* Vertical line going up */}
      <div className="absolute left-5.5 bottom-10 w-1 h-12 bg-white/20 timeline-line-glow" style={{ display: isFirst ? "none" : "block" }}></div>
      
      {/* Vertical line going down */}
      <div className="absolute left-5.5 top-10 w-1 h-12 bg-white/20 timeline-line-glow" style={{ display: isLast ? "none" : "block" }}></div>

      {/* Glowing circle indicator for the timeline item*/}
        <div
          className="absolute left-0 top-2 w-12 h-12 rounded-full flex items-center justify-center z-10 timeline-circle-glow"
          style={{ backgroundColor: isHovered ? "#FF9BA8" : "#593151", 
                   transition: "background-color 0.3s ease-in-out, transform 0.3s ease-in-out",
          }}
        ></div>

      {/* Title and date description */}
        <h3 className="text-white text-4xl font-bold mb-1 font-playfair white-text-glow pl-6">{title}</h3>
        <p className="text-sm text-white/80 font-dm-sans white-text-glow pl-6">{date}</p>
    </div>
  );
};

// Main timeline section that renders all timeline items
const TimelineUmum = () => {
  // List of timeline events
  var items = [
    { title: "Pendaftaran", date: "19 Februari 2049 - 23 Januari 2312"},
    { title: "Pengumuman Tema", date: "19 Februari 2049 - 23 Januari 2312"},
    { title: "Pengumuman Pemenang", date: "19 Februari 2049 - 23 Januari 2312"},
    { title: "Kelupaan Njir", date: "Besok"},
  ];

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6a316c] to-[#2e1c3d] flex items-center justify-center px-8 py-16">
      <div className="max-w-xl">
        {/* Render each timeline item */}
        {items.map((item, index) => (
          <TimelineItem key={index} {...item} isLast={index === items.length-1} isFirst={index === 0} />
        ))}
      </div>
    </div>
  );
};

export default TimelineUmum;
