import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { CLINIC_INFO } from "../../config/clinicData";
import "./SplashScreen.css";

/** Public URL — Vite copies `public/logo/logo.png` → `/logo/logo.png`. */
const LOGO_SRC = "/logo/logo.png";

/** Smooth ease-out for exit (Material-like). */
const easeExit = [0.33, 1, 0.68, 1] as const;
const easeIn = [0.4, 0, 0.2, 1] as const;
const easePremium = [0.16, 1, 0.3, 1] as const;
const easeSoft = [0.22, 1, 0.36, 1] as const;

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const visibleMs = reduceMotion ? 1000 : 2600;
    const t = window.setTimeout(() => setIsVisible(false), visibleMs);
    return () => window.clearTimeout(t);
  }, [reduceMotion]);

  const tLogo = reduceMotion ? { duration: 0.35 } : { duration: 1.05, ease: easePremium };
  const tBrand = reduceMotion ? { duration: 0.3 } : { delay: 0.35, duration: 0.75, ease: easeSoft };

  const exitTransition = reduceMotion
    ? { duration: 0.35, ease: easeExit }
    : { duration: 0.95, ease: easeExit };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`splash-container${reduceMotion ? " splash-container--reduce-motion" : ""}`}
          role="status"
          aria-live="polite"
          aria-busy="true"
          aria-label="Loading"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            y: reduceMotion ? 0 : -12,
            scale: reduceMotion ? 1 : 1.012,
            filter: reduceMotion ? "none" : "blur(8px)",
            transition: exitTransition,
          }}
        >
          <div className="splash-bg-mesh" aria-hidden />
          <motion.div
            className="splash-bg-orb splash-bg-orb--violet"
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: easeIn }}
          />
          <motion.div
            className="splash-bg-orb splash-bg-orb--cyan"
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.15, ease: easeIn }}
          />
          <div className="splash-bg-grain" aria-hidden />

          <div className="splash-content">
            <div className="splash-logo-stage">
              <div className="splash-logo-glow splash-logo-glow--pulse" aria-hidden />
              <div className="splash-logo-ring splash-logo-ring--outer splash-logo-ring--pulse" aria-hidden />
              <div className="splash-logo-ring splash-logo-ring--ripple" aria-hidden />
              <motion.div
                className="splash-logo-ring splash-logo-ring--inner"
                aria-hidden
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.55 }}
                transition={{ delay: 0.45, duration: 0.8, ease: easeSoft }}
              />
              <motion.div
                className="splash-logo-card"
                initial={
                  reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: 28, scale: 0.88, filter: "blur(14px)" }
                }
                animate={
                  reduceMotion
                    ? { opacity: 1 }
                    : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
                }
                transition={tLogo}
              >
                <img src={LOGO_SRC} alt="" className="splash-logo" decoding="async" />
              </motion.div>
            </div>

            <motion.div
              className="splash-brand"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={tBrand}
            >
              <p className="splash-kicker">Family medicine</p>
              <h1 className="splash-title">{CLINIC_INFO.name}</h1>
              <p className="splash-subtitle">Miri, Sarawak</p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
