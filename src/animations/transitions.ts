import type { Transition } from "framer-motion";

export const spring: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 30,
};

export const smooth: Transition = {
  duration: 0.35,
  ease: [0.4, 0, 0.2, 1],
};

export const fast: Transition = {
  duration: 0.2,
  ease: [0.4, 0, 0.2, 1],
};

export const slow: Transition = {
  duration: 0.5,
  ease: [0.4, 0, 0.2, 1],
};

export function staggerDelay(index: number, base = 0.06): Transition {
  return {
    ...smooth,
    delay: index * base,
  };
}
