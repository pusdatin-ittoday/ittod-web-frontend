import React, { useState, useEffect } from "react";

const LoadingState = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) {
          clearInterval(interval);
          return 98; // Stay at 98% until loaded
        }
        const increment = Math.floor(Math.random() * 15) + 5;
        return Math.min(prev + increment, 98);
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center font-dm-sans bg-[#0d0f26]"
      style={{
        background: "url('https://api.builder.io/api/v1/image/assets/TEMP/794d42f37c2c7754d2f7b62f7ad0198b09ee2cf0?width=3966') lightgray -0.317px -51.05px / 96.823% 113.089% no-repeat",
        backgroundColor: "#0d0f26"
      }}
    >
      {/* Inject Keyframe CSS for Infinite sliding bar */}
      <style>{`
        @keyframes progress-infinite {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>

      <div className="flex flex-col items-center gap-6 max-w-lg w-full px-4">
        {/* Central Loading Branding */}
        <div className="relative flex flex-col items-center mb-2">
          {/* Main Glitch Text */}
          <h1 
            className="text-white text-xl font-bold italic uppercase tracking-wider text-center"
            style={{
              fontFamily: "Anybody, sans-serif",
              textShadow: "2px 0 0 #FF00FF, -2px 0 0 #00FFFF"
            }}
          >
            LOADING...
          </h1>
          {/* Glitch Offset Text */}
          <span 
            className="absolute top-0 text-[#FCD400] text-xl font-bold opacity-30 blur-[0.5px] pointer-events-none translate-x-[4px]"
            style={{ fontFamily: "Anybody, sans-serif" }}
          >
            LOADING...
          </span>
        </div>

        {/* Progress Bar Container */}
        <div 
          className="w-full h-12 border-[4px] border-[#1A1C1C] bg-[#464652] overflow-hidden p-1 relative"
          style={{
            boxShadow: "8px 8px 0 0 #000"
          }}
        >
          {/* Progress Fill with Infinite CSS animation */}
          <div 
            className="absolute inset-y-1 left-0 w-1/2 animate-[progress-infinite_2s_infinite_linear]"
            style={{
              background: "linear-gradient(90deg, #34399F 0%, #FCD400 100%)",
            }}
          ></div>
        </div>

        {/* Dynamic Status Subtext */}
        <div className="flex items-center gap-6 mt-2">
          <div className="flex items-center gap-3">
            {/* Spinning Yellow Icon */}
            <svg 
              className="animate-spin w-5 h-5 text-[#FCD400]" 
              viewBox="0 0 18 18" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M8.85 17.7C6.4 17.7 4.3125 16.8375 2.5875 15.1125C0.8625 13.3875 0 11.3 0 8.85C0 6.4 0.8625 4.3125 2.5875 2.5875C4.3125 0.8625 6.4 0 8.85 0C10.15 0 11.3792 0.2625 12.5375 0.7875C13.6958 1.3125 14.6833 2.075 15.5 3.075V0H17.9V8.225H9.65V5.85H13.7C13.1667 5.01667 12.475 4.35833 11.625 3.875C10.775 3.39167 9.85 3.15 8.85 3.15C7.26667 3.15 5.92083 3.70417 4.8125 4.8125C3.70417 5.92083 3.15 7.26667 3.15 8.85C3.15 10.4333 3.70417 11.7792 4.8125 12.8875C5.92083 13.9958 7.26667 14.55 8.85 14.55C10.0333 14.55 11.1125 14.2083 12.0875 13.525C13.0625 12.8417 13.7667 11.95 14.2 10.85H17.475C16.9917 12.85 15.95 14.4917 14.35 15.775C12.75 17.0583 10.9167 17.7 8.85 17.7Z" 
                fill="currentColor"
              />
            </svg>
            <span 
              className="text-[#F9F9F9] text-sm tracking-[3.2px] uppercase font-bold"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              UPDATING_NODES...
            </span>
          </div>
          <span 
            className="text-[#BFC1FF] text-sm italic font-bold"
            style={{ fontFamily: "Anybody, sans-serif" }}
          >
            {progress}%
          </span>
        </div>

        {/* Footer / Branding Tag */}
        <div 
          className="w-full mt-6 py-2 px-4 border-t-2 border-b-2 border-[rgba(77,82,184,0.30)] bg-[rgba(13,55,153,0.75)] text-center"
        >
          <p 
            className="text-[#C7C5D4] text-[10px] tracking-wider uppercase font-semibold leading-relaxed"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            IT TODAY 2026 // GLOBAL TECH SUMMIT // BUILD YOUR FUTURE
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
