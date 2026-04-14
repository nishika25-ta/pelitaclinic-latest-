import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, MotionConfig, useReducedMotion } from "framer-motion";
import { CLINIC_INFO } from "../../config/clinicData";
import BlurText from "@/components/ui/BlurText";

/** Vite serves `public/logo/logo.png` as `/logo/logo.png`. */
const LOGO_SRC = "/logo/logo.png";
/** Storefront photo — `public/preload.jpeg` */
const SPLASH_BG_SRC = "/preload.jpeg";

export type SplashScreenProps = {
  onExitStart?: () => void;
  onExitComplete?: () => void;
};

/** BlurText timing — must match `BlurText` props on the splash (`delay` ms, `stepDuration`, default 2-step `animationTo`). */
const SPLASH_BLUR_DELAY_MS = 160;
const SPLASH_BLUR_STEP_DURATION = 0.28;

/** Hold until last word’s blur animation finishes + dwell + exit buffer (same whenever BlurText runs). */
function computeSplashHoldMs(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const n = Math.max(1, words.length);
  const stepCount = 3;
  const totalDuration = SPLASH_BLUR_STEP_DURATION * (stepCount - 1);
  const lastWordEndSec = ((n - 1) * SPLASH_BLUR_DELAY_MS) / 1000 + totalDuration;
  const dwellAfterTextDone = 1;
  const exitBuffer = 0.5;
  const ms = (lastWordEndSec + dwellAfterTextDone + exitBuffer) * 1000;
  return Math.ceil(Math.min(12_000, Math.max(3_200, ms)));
}

export default function SplashScreen({ onExitStart, onExitComplete }: SplashScreenProps = {}) {
  const [isVisible, setIsVisible] = useState(true);
  const reduceMotion = useReducedMotion();
  const onExitCompleteRef = useRef(onExitComplete);
  onExitCompleteRef.current = onExitComplete;
  const onExitStartRef = useRef(onExitStart);
  onExitStartRef.current = onExitStart;

  const splashText = CLINIC_INFO.name;

  const holdMs = useMemo(() => computeSplashHoldMs(splashText), [splashText]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      onExitStartRef.current?.();
      setIsVisible(false);
    }, holdMs);
    return () => window.clearTimeout(t);
  }, [holdMs]);

  const logoTransition = reduceMotion
    ? { duration: 0.28, ease: "easeOut" as const }
    : { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <AnimatePresence onExitComplete={() => onExitCompleteRef.current?.()}>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#F5F5F7] antialiased [font-family:var(--font-apple)] [contain:layout_paint] isolate"
          style={{ WebkitFontSmoothing: "antialiased" }}
          role="status"
          aria-live="polite"
          aria-busy="true"
          aria-label="Loading"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.85, ease: [0.42, 0, 1, 1] },
          }}
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden [contain:strict]" aria-hidden>
            <img
              src={SPLASH_BG_SRC}
              alt=""
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-[#F5F5F7]/55" />
          </div>

          {/* Centered row: logo + title */}
          <div className="relative z-10 flex w-full max-w-[100vw] items-center justify-center px-4 sm:px-6">
            <div className="flex min-w-0 max-w-full flex-wrap items-center justify-center gap-5 sm:gap-8 md:gap-10">
              <motion.div
                initial={reduceMotion ? { opacity: 0, scale: 0.96 } : { opacity: 0, scale: 0.88, rotate: -12 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={logoTransition}
                className="flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-3xl border border-gray-200/90 bg-white shadow-[0_20px_40px_-10px_rgba(0,102,204,0.18)] sm:h-20 sm:w-20"
              >
                <img
                  src={LOGO_SRC}
                  alt=""
                  className="h-[68%] w-[68%] object-contain"
                  decoding="async"
                />
              </motion.div>

              {/* Title: always BlurText; MotionConfig overrides OS reduced-motion so desktop matches mobile (logo/exit still respect `reduceMotion`). */}
              <MotionConfig reducedMotion="never">
                <BlurText
                  text={splashText}
                  effect="lift"
                  delay={SPLASH_BLUR_DELAY_MS}
                  animateBy="words"
                  direction="top"
                  stepDuration={SPLASH_BLUR_STEP_DURATION}
                  className="min-w-0 text-center text-4xl font-bold tracking-[-0.04em] text-[#1D1D1F] sm:text-5xl md:text-6xl lg:text-7xl"
                />
              </MotionConfig>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
