import React, { useEffect } from "react";
import { MotionConfig } from "motion/react";
import Lenis from "lenis";

const MotionProvider = ({ children }) => {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

    if (prefersReducedMotion || coarsePointer) return undefined;

    const lenis = new Lenis({
      duration: 0.95,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1,
    });
    let rafId;

    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionConfig>
  );
};

export default MotionProvider;
