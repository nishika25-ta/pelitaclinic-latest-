import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { CLINIC_INFO } from "../../config/clinicData";
import SplitText from "@/components/ui/SplitText";

/** Vite serves `public/logo/logo.png` as `/logo/logo.png`. */
const LOGO_SRC = "/logo/logo.png";
/** Storefront photo — `public/preload.jpeg` */
const SPLASH_BG_SRC = "/preload.jpeg";
/** Mobile preload photo — `public/image/mob_preload.jpg` */
const SPLASH_BG_SRC_MOBILE = "/image/hallway.jpg";

export type SplashScreenProps = {
  onExitStart?: () => void;
  onExitComplete?: () => void;
};

const SPLASH_TEXT_DELAY_MS = 24;
const SPLASH_TEXT_DURATION_S = 0.85;
const SPLASH_EXIT_MS = 1100;

/** Hold until split text finishes + dwell + exit buffer. */
function computeSplashHoldMs(text: string): number {
  const chars = text.replace(/\s+/g, "").length;
  const n = Math.max(1, chars);
  const textDoneSec = ((n - 1) * SPLASH_TEXT_DELAY_MS) / 1000 + SPLASH_TEXT_DURATION_S;
  const dwellAfterTextDone = 0.9;
  const exitBuffer = 0.5;
  const ms = (textDoneSec + dwellAfterTextDone + exitBuffer) * 1000;
  return Math.ceil(Math.min(12_000, Math.max(3_200, ms)));
}

export default function SplashScreen({ onExitStart, onExitComplete }: SplashScreenProps = {}) {
  const [isVisible, setIsVisible] = useState(true);
  const reduceMotion = useReducedMotion();
  const onExitCompleteRef = useRef(onExitComplete);
  onExitCompleteRef.current = onExitComplete;
  const onExitStartRef = useRef(onExitStart);
  onExitStartRef.current = onExitStart;

  const splashTitle = CLINIC_INFO.name;
  const splashTagline = "Refined Aesthetic & Wellness Care";

  const holdMs = useMemo(() => computeSplashHoldMs(`${splashTitle} ${splashTagline}`), [splashTitle, splashTagline]);

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
  const logoExitTransition = reduceMotion
    ? { duration: 0.28, ease: "easeOut" as const }
    : { duration: SPLASH_EXIT_MS / 1000, ease: [0.16, 1, 0.3, 1] as const };

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
            transition: { duration: SPLASH_EXIT_MS / 1000, ease: [0.22, 1, 0.36, 1] },
          }}
        >
          <motion.div
            className="pointer-events-none absolute inset-0 overflow-hidden [contain:strict]"
            aria-hidden
            exit={
              reduceMotion
                ? { opacity: 0 }
                : {
                    scale: 1.04,
                    opacity: 0.9,
                  }
            }
            transition={logoExitTransition}
          >
            <picture className="absolute inset-0 block h-full w-full">
              <source media="(max-width: 767px)" srcSet={SPLASH_BG_SRC_MOBILE} />
              <img
                src={SPLASH_BG_SRC}
                alt=""
                fetchPriority="high"
                decoding="async"
                className="absolute inset-0 h-full w-full scale-[1.045] object-cover object-center blur-[4px] md:scale-100 md:blur-0"
              />
            </picture>
            <div className="absolute inset-0 bg-[#000000]/25" />
          </motion.div>

          {/* Centered stack: logo above title */}
          <div className="relative z-10 flex w-full max-w-[100vw] items-center justify-center px-4 sm:px-6">
            <div className="flex min-w-0 max-w-full flex-col items-center justify-center gap-4 sm:gap-5 md:gap-6">
              <motion.div
                aria-hidden
                className="pointer-events-none absolute h-28 w-28 rounded-full bg-violet-400/25 blur-2xl sm:h-36 sm:w-36"
                initial={{ opacity: 0 }}
                animate={{ opacity: reduceMotion ? 0.18 : 0.26 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 2.2 }}
                transition={logoExitTransition}
              />
              <motion.div
                initial={reduceMotion ? { opacity: 0, scale: 0.96 } : { opacity: 0, scale: 0.88, rotate: -12 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={
                  reduceMotion
                    ? { opacity: 0, scale: 1.08, transition: logoExitTransition }
                    : {
                        opacity: [1, 1, 0.82, 0],
                        scale: [1, 1.08, 2.6, 5.8],
                        rotate: 0,
                        transition: logoExitTransition,
                      }
                }
                transition={logoTransition}
                className="flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-3xl border border-gray-200/90 bg-white shadow-[0_20px_40px_-10px_rgba(0,102,204,0.18)] will-change-transform sm:h-20 sm:w-20"
                style={{ transformOrigin: "center center", backfaceVisibility: "hidden" }}
              >
                <img
                  src={LOGO_SRC}
                  alt=""
                  className="h-[68%] w-[68%] object-contain"
                  decoding="async"
                />
              </motion.div>

              {/* Premium text treatment: GSAP split-by-char animation on both mobile and desktop. */}
              <motion.div
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.985 }}
                transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex flex-col items-center gap-2 rounded-[1.75rem] border border-white/30 bg-white/10 px-5 py-4 shadow-[0_16px_45px_-20px_rgba(15,23,42,0.7)] backdrop-blur-xl sm:rounded-[2rem] sm:px-7 sm:py-5"
              >
                <SplitText
                  text={splashTitle}
                  className="min-w-0 text-center text-4xl font-black tracking-[-0.045em] text-white sm:text-5xl md:text-6xl lg:text-7xl"
                  delay={SPLASH_TEXT_DELAY_MS}
                  duration={SPLASH_TEXT_DURATION_S}
                  ease="power3.out"
                  splitType="chars"
                  from={{ opacity: 0, y: 40 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  rootMargin="-100px"
                  textAlign="center"
                  triggerOnMount
                  showCallback={false}
                />
                <SplitText
                  text={splashTagline}
                  className="min-w-0 text-center text-xs font-medium uppercase tracking-[0.26em] text-white/85 sm:text-sm"
                  delay={22}
                  duration={0.8}
                  ease="power2.out"
                  splitType="chars"
                  from={{ opacity: 0, y: 16 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  rootMargin="-100px"
                  textAlign="center"
                  triggerOnMount
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
