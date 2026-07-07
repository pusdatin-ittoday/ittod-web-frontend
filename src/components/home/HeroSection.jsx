import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { motion as Motion, useReducedMotion } from "motion/react";
import { popIn, revealUp, staggerContainer } from "../../lib/motion";

/**
 * Hero Section — Neobrutalism Style
 * Red background with wave patterns, bold typography, dynamic rotation
 * Based on Figma design reference
 */
const HeroSection = () => {
  const heroRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return undefined;

    const ctx = gsap.context(() => {
      gsap.to(".hero-wave-one", {
        xPercent: 3,
        yPercent: -1.5,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".hero-wave-two", {
        xPercent: -2.5,
        yPercent: 1.5,
        duration: 5.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".hero-float", {
        y: -10,
        rotate: 1.25,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, heroRef);

    return () => ctx.revert();
  }, [reduceMotion]);

  return (
    <Motion.section
      ref={heroRef}
      id="hero"
      className="relative flex min-h-[540px] w-full items-center justify-center overflow-hidden border-b-[8px] border-yellow-neo sm:min-h-[600px] md:min-h-[660px]"
      initial="hidden"
      animate="visible"
      style={{
        background: "#ef3741",
      }}
    >
      {/* Wave pattern overlay - layer 1 */}
      <div className="hero-wave-one pointer-events-none absolute inset-0 will-change-transform">
        <svg
          className="h-full w-full"
          viewBox="0 0 1440 720"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M-120 20 C70 160 45 250 265 235 C495 218 355 72 640 94 C900 115 740 284 1040 278 C1240 274 1335 175 1530 245"
            fill="none"
            stroke="#df252c"
            strokeWidth="105"
            strokeLinecap="round"
          />
          <path
            d="M-90 310 C115 210 220 380 410 340 C620 296 520 180 755 214 C980 247 900 420 1125 397 C1320 378 1370 292 1530 335"
            fill="none"
            stroke="#df252c"
            strokeWidth="100"
            strokeLinecap="round"
          />
          <path
            d="M-140 610 C80 445 220 650 445 566 C655 488 560 390 795 438 C1010 483 1000 640 1235 578 C1390 538 1450 487 1550 522"
            fill="none"
            stroke="#df252c"
            strokeWidth="115"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Wave pattern overlay - layer 2 (pink accent) */}
      <div className="hero-wave-two pointer-events-none absolute inset-0 opacity-90 will-change-transform">
        <svg
          className="h-full w-full"
          viewBox="0 0 1440 720"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M-130 135 C60 12 180 132 355 82 C530 32 450 -36 685 20 C880 66 850 168 1090 130 C1260 104 1370 30 1540 80"
            fill="none"
            stroke="#f83e4a"
            strokeWidth="82"
            strokeLinecap="round"
          />
          <path
            d="M-130 465 C80 338 185 522 390 458 C580 399 510 305 730 348 C945 389 885 530 1115 500 C1325 471 1415 410 1540 450"
            fill="none"
            stroke="#f83e4a"
            strokeWidth="76"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Grid pattern overlay */}
      {/* Main Content */}
      <Motion.div
        className="relative z-10 mx-auto w-full max-w-6xl px-4 py-12 text-center sm:px-6 sm:py-16 md:py-20"
        variants={staggerContainer}
      >
        {/* HIMALKOM PRESENT Badge */}
        <Motion.div
          className="hero-float mb-8 inline-block border-[3px] border-black bg-white px-5 py-1.5 font-inter text-[10px] font-black uppercase tracking-[0.08em] text-[#293f9e] shadow-[5px_5px_0_#111] sm:text-xs md:mb-10 md:px-7"
          variants={popIn}
          style={{ rotate: 2 }}
          whileHover={{ rotate: -2, scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          HIMALKOM PRESENT
        </Motion.div>

        {/* Main Title - "IT TODAY 2026" */}
        <Motion.div
          className="mx-auto mb-14 w-fit md:mb-20"
          variants={revealUp}
          style={{ rotate: -2 }}
        >
          <Motion.h1
            className="font-[Anybody] text-[4.1rem] font-black uppercase italic leading-[0.72] tracking-[-0.09em] text-[#ffe64a] sm:text-[6.5rem] md:text-[9rem] lg:text-[10.5rem]"
            style={{
              WebkitTextStroke: "clamp(6px, 0.6vw, 10px) #3545b5",
              paintOrder: "stroke fill",
              textShadow: "9px 10px 0 #cf0a58",
            }}
            whileHover={{ scale: 1.02 }}
          >
            <Motion.span
              className="inline-block"
              style={{ rotate: -6 }}
              animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              IT
            </Motion.span>{" "}
            <Motion.span
              className="inline-block"
              style={{ rotate: 2 }}
              animate={reduceMotion ? undefined : { y: [0, 7, 0] }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              TODAY
            </Motion.span>
          </Motion.h1>
          <Motion.div
            className="-mt-1 font-[Anybody] text-[3.7rem] font-black italic leading-none tracking-[-0.04em] text-[#ffe64a] sm:text-[5.5rem] md:-mt-4 md:text-[7.5rem]"
            style={{
              WebkitTextStroke: "clamp(6px, 0.6vw, 10px) #3545b5",
              paintOrder: "stroke fill",
              textShadow: "9px 10px 0 #cf0a58",
              rotate: -3,
            }}
            animate={reduceMotion ? undefined : { x: [0, 8, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          >
            2026
          </Motion.div>
        </Motion.div>

        {/* Bottom Badge - CTA */}
        <Motion.div
          className="inline-block border-[3px] border-black bg-yellow-neo px-8 py-3 font-inter text-xl font-black tracking-[0.04em] text-[#293f9e] shadow-[6px_6px_0_#111] md:px-12 md:text-2xl"
          variants={popIn}
          style={{ rotate: -2 }}
          whileHover={{ y: -5, rotate: 2, scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          DAFTAR SEKARANG!
        </Motion.div>
      </Motion.div>

      {/* Bottom border line */}
      <div className="absolute inset-x-0 bottom-0 h-[5px] bg-black" />
    </Motion.section>
  );
};

export default HeroSection;
