import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useReducedMotion, type MotionValue } from "framer-motion";
import {
  Briefcase,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Megaphone,
  Newspaper,
  Pill,
  Plus,
  Stethoscope,
  Users,
} from "lucide-react";
import "./HeroSection.css";

const SLIDE_COUNT = 2;

interface HeroUpdateTile {
  id: string;
  category: string;
  title: string;
  description: string;
  icon: ReactNode;
}

const HERO_UPDATE_TILES: HeroUpdateTile[] = [
  {
    id: "promotions",
    category: "Promotions",
    title: "Screening & seasonal offers",
    description:
      "Limited-time bundles on family health screens, travel vaccines, and seasonal check-ups—ask reception or WhatsApp for what’s running now.",
    icon: <Megaphone className="hero-update-tile__icon-svg" strokeWidth={1.75} aria-hidden />,
  },
  {
    id: "news",
    category: "News",
    title: "Inside the practice",
    description:
      "New services, equipment, and quality initiatives—short notes on how we’re raising the bar for care in Miri.",
    icon: <Newspaper className="hero-update-tile__icon-svg" strokeWidth={1.75} aria-hidden />,
  },
  {
    id: "hiring",
    category: "Hiring",
    title: "Grow with Pelita",
    description:
      "We’re looking for warm, reliable front-desk and clinical support staff. CVs and enquiries welcome via WhatsApp.",
    icon: <Briefcase className="hero-update-tile__icon-svg" strokeWidth={1.75} aria-hidden />,
  },
];

interface HeroSectionProps {
  yHero: MotionValue<string>;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const tileContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.12 },
  },
};

const tileVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const LIVE_LABELS = ["Welcome to Pelita Clinic", "Clinic updates and opportunities"];

export default function HeroSection({ yHero }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.12 });
  const reduceMotion = useReducedMotion();
  const [activeSlide, setActiveSlide] = useState(0);

  const goPrev = useCallback(() => {
    setActiveSlide((i) => Math.max(0, i - 1));
  }, []);

  const goNext = useCallback(() => {
    setActiveSlide((i) => Math.min(SLIDE_COUNT - 1, i + 1));
  }, []);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (!el.contains(document.activeElement)) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goPrev, goNext]);

  const trackTransition =
    reduceMotion === true
      ? { duration: 0 }
      : { type: "spring" as const, stiffness: 300, damping: 34, mass: 0.88 };

  const trackX = `-${(activeSlide * 100) / SLIDE_COUNT}%`;

  return (
    <section ref={sectionRef} id="home" className="hero-section">
      <div className="hero-bg" aria-hidden>
        <motion.div style={{ y: yHero }} className="hero-bg-inner">
          <div className="hero-bg-photo" />
          <div className="hero-bg-bokeh">
            <span className="hero-bokeh-icon hero-bokeh-icon--1">
              <Stethoscope strokeWidth={1.25} />
            </span>
            <span className="hero-bokeh-icon hero-bokeh-icon--2">
              <Pill strokeWidth={1.25} />
            </span>
            <span className="hero-bokeh-icon hero-bokeh-icon--3">
              <Users strokeWidth={1.25} />
            </span>
            <span className="hero-bokeh-icon hero-bokeh-icon--4">
              <Plus strokeWidth={1.25} />
            </span>
          </div>
          <div className="hero-bg-scrim" />
          <div className="hero-orb hero-orb--violet" />
          <div className="hero-orb hero-orb--cyan" />
          <div className="hero-orb hero-orb--rose" />
          <div className="hero-grain hero-grain--subtle" />
        </motion.div>
      </div>

      <div className="container-shell hero-content">
        <div className="hero-layout">
          <div
            ref={stageRef}
            className="hero-stage"
            tabIndex={0}
            role="region"
            aria-roledescription="carousel"
            aria-label="Hero highlights"
          >
            <span className="hero-stage__live" aria-live="polite">
              {LIVE_LABELS[activeSlide] ?? LIVE_LABELS[0]}
            </span>

            <div className="hero-stage__viewport">
              <motion.div
                className="hero-stage__track"
                animate={{ x: trackX }}
                transition={trackTransition}
              >
                <div className="hero-slide">
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="hero-text-block hero-copy-glass"
                  >
                    <div className="hero-copy-glass__shine" aria-hidden />
                    <motion.h1 variants={itemVariants} className="hero-headline">
                      <span className="hero-headline__line hero-headline__line--display">
                        Exceptional Care
                      </span>
                      <span className="hero-headline__line hero-headline__line--sub">for every</span>
                      <span className="hero-headline__line hero-headline__line--display hero-headline__line--last">
                        <span className="hero-headline__family">family</span>{" "}
                        <span className="hero-headline-accent">in Miri</span>
                      </span>
                    </motion.h1>
                  </motion.div>
                </div>

                <div className="hero-slide">
                  <div className="hero-updates-surface">
                    <div className="hero-updates-surface__shine" aria-hidden />
                    <p className="hero-updates-surface__eyebrow">Updates</p>
                    <h2 className="hero-updates-surface__title">Offers &amp; notices</h2>
                    <p className="hero-updates-surface__lede">
                      What&apos;s new at the practice—promotions, news, and open roles.
                    </p>

                    <motion.div
                      className="hero-update-grid"
                      variants={tileContainerVariants}
                      initial="hidden"
                      animate={isInView && activeSlide === 1 ? "visible" : "hidden"}
                    >
                      {HERO_UPDATE_TILES.map((tile) => (
                        <motion.article
                          key={tile.id}
                          variants={tileVariants}
                          className="hero-update-tile"
                        >
                          <div className="hero-update-tile__icon" aria-hidden>
                            {tile.icon}
                          </div>
                          <p className="hero-update-tile__category">{tile.category}</p>
                          <h3 className="hero-update-tile__title">{tile.title}</h3>
                          <p className="hero-update-tile__desc">{tile.description}</p>
                        </motion.article>
                      ))}
                    </motion.div>

                    <p className="hero-updates-surface__footnote">
                      Hours and schedule changes are posted at reception and online.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            <button
              type="button"
              className="hero-nav-btn hero-nav-btn--prev"
              aria-label="Previous slide"
              disabled={activeSlide === 0}
              onClick={goPrev}
            >
              <ChevronLeft className="hero-nav-btn__icon" strokeWidth={2} aria-hidden />
            </button>
            <div className="hero-nav-cluster hero-nav-cluster--next">
              {activeSlide === 0 && (
                <span className="hero-nav-hint" aria-hidden="true">
                  Offers &amp; notices
                </span>
              )}
              <button
                type="button"
                className="hero-nav-btn hero-nav-btn--next"
                aria-label={
                  activeSlide === 0 ? "Next slide: Offers and notices" : "Next slide"
                }
                disabled={activeSlide === SLIDE_COUNT - 1}
                onClick={goNext}
              >
                <ChevronRight className="hero-nav-btn__icon" strokeWidth={2} aria-hidden />
              </button>
            </div>

            <div className="hero-dots" role="group" aria-label="Choose slide">
              {Array.from({ length: SLIDE_COUNT }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`hero-dot ${activeSlide === i ? "hero-dot--active" : ""}`}
                  aria-label={
                    i === activeSlide
                      ? `${LIVE_LABELS[i]}, current`
                      : `Go to slide ${i + 1}: ${LIVE_LABELS[i]}`
                  }
                  onClick={() => setActiveSlide(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <motion.div
        className="hero-scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-5 w-5 text-slate-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}
