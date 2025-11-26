// Animation utility functions for TimeGrave

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

export const soulGlow = {
  initial: { opacity: 0.6, filter: "blur(8px)" },
  animate: {
    opacity: [0.6, 1, 0.6],
    filter: ["blur(8px)", "blur(4px)", "blur(8px)"],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const fogDrift = {
  initial: { x: 0, y: 0, opacity: 0.3 },
  animate: {
    x: [0, 20, 0],
    y: [0, -20, 0],
    opacity: [0.3, 0.5, 0.3],
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};
