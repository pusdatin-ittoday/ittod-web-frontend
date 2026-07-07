export const springy = {
  type: "spring",
  stiffness: 420,
  damping: 28,
  mass: 0.8,
};

export const smooth = [0.22, 1, 0.36, 1];

export const viewportOnce = {
  once: true,
  amount: 0.22,
  margin: "0px 0px -80px 0px",
};

export const pageTransition = {
  initial: { opacity: 1 },
  animate: {
    opacity: 1,
    transition: { duration: 0.01, ease: smooth },
  },
  exit: {
    opacity: 1,
    transition: { duration: 0.24, ease: smooth },
  },
};

export const revealUp = {
  hidden: { opacity: 0, y: 38 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, ease: smooth },
  },
};

export const revealLeft = {
  hidden: { opacity: 0, x: -36 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.58, ease: smooth },
  },
};

export const popIn = {
  hidden: { opacity: 0, scale: 0.86, rotate: -1.5 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: springy,
  },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

export const timelineDot = {
  hidden: { opacity: 0, scale: 0.2 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springy,
  },
};

export const lineDraw = {
  hidden: { scaleY: 0, transformOrigin: "top" },
  visible: {
    scaleY: 1,
    transition: { duration: 0.5, ease: smooth },
  },
};

export const hoverLift = {
  y: -8,
  x: -3,
  rotate: -0.4,
  transition: springy,
};

export const tapPress = {
  scale: 0.97,
  x: 2,
  y: 2,
};
