import React from "react";
import { AnimatePresence, motion as Motion, useReducedMotion } from "motion/react";
import { useLocation } from "react-router-dom";
import { smooth } from "../../lib/motion";

const waveSheets = [
  {
    fill: "#cf0a58",
    opacity: 0.96,
    delay: 0,
    duration: 0.98,
    path: "M0 112 C190 42 295 158 485 96 C690 29 775 142 972 92 C1175 40 1265 126 1440 74 L1440 918 C1240 850 1136 960 948 894 C755 826 660 942 468 884 C270 824 162 930 0 868 Z",
  },
  {
    fill: "#ef3741",
    opacity: 0.98,
    delay: 0.055,
    duration: 0.92,
    path: "M0 140 C170 72 310 175 505 128 C705 80 790 162 982 118 C1180 72 1284 150 1440 108 L1440 900 C1260 842 1140 938 946 880 C748 820 650 922 456 860 C250 794 150 900 0 842 Z",
  },
  {
    fill: "#f83e4a",
    opacity: 0.92,
    delay: 0.105,
    duration: 0.86,
    path: "M0 172 C170 92 280 196 480 150 C680 104 798 184 1008 134 C1198 88 1310 170 1440 130 L1440 872 C1262 812 1134 908 930 852 C750 802 630 890 438 828 C244 766 132 866 0 810 Z",
  },
];

const RouteWaveTransition = () => {
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return null;

  return (
    <AnimatePresence initial={false}>
      <Motion.div
        key={location.pathname}
        className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.08 } }}
        aria-hidden="true"
      >
        {waveSheets.map((sheet) => (
          <Motion.svg
            key={sheet.fill}
            className="absolute -left-[5vw] top-[-18dvh] h-[136dvh] w-[110vw] will-change-transform"
            viewBox="0 0 1440 1000"
            preserveAspectRatio="none"
            focusable="false"
            initial={{ y: "105%" }}
            animate={{ y: ["105%", "0%", "0%", "-105%"] }}
            transition={{
              duration: sheet.duration,
              delay: sheet.delay,
              ease: smooth,
              times: [0, 0.4, 0.58, 1],
            }}
          >
            <path d={sheet.path} fill={sheet.fill} opacity={sheet.opacity} />
          </Motion.svg>
        ))}

        <Motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.9, y: 18 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.9, 1, 1, 1.04],
            y: [18, 0, 0, -18],
          }}
          transition={{
            duration: 0.82,
            ease: smooth,
            times: [0, 0.34, 0.62, 1],
          }}
        >
          <div className="border-[3px] border-black bg-[#ffe64a] px-5 py-2 font-[Anybody] text-sm font-black uppercase italic tracking-[0.08em] text-[#3545b5] shadow-[6px_6px_0_#171717] sm:px-7 sm:text-base">
            IT TODAY
          </div>
        </Motion.div>
      </Motion.div>
    </AnimatePresence>
  );
};

export default RouteWaveTransition;
