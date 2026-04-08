import { useRef, type RefObject } from "react";
import { useScroll, useTransform, type MotionValue } from "framer-motion";

interface UseParallaxOptions {
  distance?: number;
}

export function useParallax(options: UseParallaxOptions = {}): {
  ref: RefObject<HTMLDivElement | null>;
  y: MotionValue<string>;
} {
  const { distance = 40 } = options;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${distance}px`, `${distance}px`]);

  return { ref, y };
}
