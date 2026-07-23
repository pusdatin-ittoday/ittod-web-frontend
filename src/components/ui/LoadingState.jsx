import React, { useState, useEffect } from "react";

const LoadingState = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#2f3888] font-sans text-white overflow-hidden">
      {/* Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: "4rem 4rem",
        }}
      ></div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-md px-6">
        {/* Logo */}
        <div className="mb-12">
          <img
            src="/logo-ittod.webp"
            alt="IT Today Logo"
            className="h-20 object-contain"
          />
        </div>

        {/* LOADING glitch text */}
        <div className="mb-6 relative font-black italic tracking-widest text-sm">
          <span className="absolute -left-[2px] top-0 text-[#00FFFF] opacity-70 animate-pulse">
            LOADING...
          </span>
          <span className="absolute left-[2px] top-0 text-[#FF00FF] opacity-70 animate-pulse">
            LOADING...
          </span>
          <span className="relative text-white">LOADING...</span>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full h-10 border-[3px] border-[#1A1C1C] bg-[#1A1C1C] p-0.5 shadow-[5px_5px_0_#1A1C1C] mb-8 relative overflow-hidden">
          {/* Animated gradient fill */}
          <div
            className="h-full transition-all duration-200 ease-out"
            style={{
              width: `${Math.min(progress, 100)}%`,
              background: "linear-gradient(90deg, #2f3888 0%, #FCD400 100%)",
            }}
          ></div>
        </div>

        {/* Updating Nodes text */}
        <div className="flex flex-col items-center mb-16 text-[#FCD400]">
          <div className="flex items-center gap-2 mb-1 text-xs font-bold tracking-widest uppercase">
            <svg
              className="w-3.5 h-3.5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>UPDATING_NODES...</span>
          </div>
          <div className="text-[10px] font-mono italic text-white/70">
            {Math.min(progress, 100)}%
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="absolute bottom-32 w-full max-w-lg">
        <div className="bg-[#1c2466] w-full py-2 flex justify-center items-center text-[9px] sm:text-[10px] uppercase tracking-wider text-white/80 shadow-[0_0_15px_rgba(28,36,102,0.8)]">
          IT TODAY 2026 // GLOBAL TECH SUMMIT // BUILD YOUR FUTURE
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
