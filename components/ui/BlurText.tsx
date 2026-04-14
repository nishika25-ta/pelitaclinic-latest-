import { motion } from "framer-motion";
import { useLayoutEffect, useMemo, useRef, useState } from "react";

type KeyframeSnapshot = Record<string, string | number>;

function buildKeyframes(from: KeyframeSnapshot, steps: KeyframeSnapshot[]) {
  const keys = new Set([...Object.keys(from), ...steps.flatMap((s) => Object.keys(s))]);
  const keyframes: Record<string, (string | number)[]> = {};
  keys.forEach((k) => {
    keyframes[k] = [from[k]!, ...steps.map((s) => (s[k] !== undefined ? s[k]! : from[k]!))];
  });
  return keyframes;
}

export type BlurTextProps = {
  text?: string;
  delay?: number;
  className?: string;
  animateBy?: "words" | "characters";
  direction?: "top" | "bottom";
  threshold?: number;
  rootMargin?: string;
  animationFrom?: KeyframeSnapshot;
  animationTo?: KeyframeSnapshot[];
  easing?: (t: number) => number;
  onAnimationComplete?: () => void;
  stepDuration?: number;
  /**
   * When true, animation starts only after the block intersects the viewport (scroll-in).
   * When false (default), animation runs on mount — required for full-screen splash / above-the-fold text.
   */
  observeIntersection?: boolean;
  /**
   * `"lift"` (default): opacity + translate only — cheap on GPU, best for splash.
   * `"blur"`: animates `filter: blur()` — heavier; use only when you need the literal blur look.
   */
  effect?: "lift" | "blur";
};

export default function BlurText({
  text = "",
  delay = 200,
  className = "",
  animateBy = "words",
  direction = "top",
  threshold = 0,
  rootMargin = "0px",
  animationFrom,
  animationTo,
  easing,
  onAnimationComplete,
  stepDuration = 0.35,
  observeIntersection = false,
  effect = "lift",
}: BlurTextProps) {
  const elements =
    animateBy === "words" ? text.trim().split(/\s+/).filter(Boolean) : [...text];
  const [inView, setInView] = useState(() => !observeIntersection);
  const ref = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    if (!observeIntersection) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [observeIntersection, threshold, rootMargin]);

  const { fromSnapshot, toSnapshots } = useMemo(() => {
    if (animationFrom != null && animationTo != null && animationTo.length > 0) {
      return { fromSnapshot: animationFrom, toSnapshots: animationTo };
    }
    if (effect === "blur") {
      const from =
        direction === "top"
          ? { filter: "blur(10px)", opacity: 0, y: -50 }
          : { filter: "blur(10px)", opacity: 0, y: 50 };
      const steps =
        direction === "top"
          ? [
              { filter: "blur(5px)", opacity: 0.5, y: 5 },
              { filter: "blur(0px)", opacity: 1, y: 0 },
            ]
          : [
              { filter: "blur(5px)", opacity: 0.5, y: -5 },
              { filter: "blur(0px)", opacity: 1, y: 0 },
            ];
      return { fromSnapshot: from, toSnapshots: steps };
    }
    const from =
      direction === "top"
        ? { opacity: 0, y: -14 }
        : { opacity: 0, y: 14 };
    const steps =
      direction === "top"
        ? [
            { opacity: 0.88, y: 3 },
            { opacity: 1, y: 0 },
          ]
        : [
            { opacity: 0.88, y: -3 },
            { opacity: 1, y: 0 },
          ];
    return { fromSnapshot: from, toSnapshots: steps };
  }, [animationFrom, animationTo, direction, effect]);

  const stepCount = toSnapshots.length + 1;
  const totalDuration = stepDuration * (stepCount - 1);
  const times = Array.from({ length: stepCount }, (_, i) => (stepCount === 1 ? 0 : i / (stepCount - 1)));

  const keyframesMemo = useMemo(
    () => buildKeyframes(fromSnapshot, toSnapshots),
    [fromSnapshot, toSnapshots],
  );

  const spanClass =
    effect === "blur"
      ? "inline-block [transform:translateZ(0)]"
      : "inline-block [transform:translate3d(0,0,0)]";

  return (
    <p ref={ref} className={className} style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
      {elements.map((segment, index) => {
        const spanTransition = {
          duration: totalDuration,
          times,
          delay: (index * delay) / 1000,
          ease: easing ?? ("easeOut" as const),
        };

        return (
          <motion.span
            className={spanClass}
            key={`${index}-${segment}`}
            initial={fromSnapshot}
            animate={inView ? keyframesMemo : fromSnapshot}
            transition={spanTransition}
            onAnimationComplete={index === elements.length - 1 ? onAnimationComplete : undefined}
          >
            {segment === " " ? "\u00A0" : segment}
            {animateBy === "words" && index < elements.length - 1 ? "\u00A0" : null}
          </motion.span>
        );
      })}
    </p>
  );
}
