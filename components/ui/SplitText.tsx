import { useEffect, useRef, useState, type ElementType } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP);

type SplitKind = "chars" | "words" | "lines" | "chars,words" | "chars,lines" | "words,lines" | "chars,words,lines";

type TweenVars = {
  opacity?: number;
  y?: number;
  x?: number;
  scale?: number;
  rotate?: number;
};

type SplitTextProps = {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: SplitKind;
  from?: TweenVars;
  to?: TweenVars;
  threshold?: number;
  rootMargin?: string;
  textAlign?: "left" | "center" | "right" | "justify";
  tag?: ElementType;
  onLetterAnimationComplete?: () => void;
  showCallback?: boolean;
  triggerOnMount?: boolean;
};

type SplitElement = HTMLElement & { _rbsplitInstance?: GSAPSplitText | null };

export default function SplitText({
  text,
  className = "",
  delay = 50,
  duration = 1.25,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  tag = "p",
  onLetterAnimationComplete,
  showCallback = false,
  triggerOnMount = false,
}: SplitTextProps) {
  const ref = useRef<SplitElement | null>(null);
  const animationCompletedRef = useRef(false);
  const onCompleteRef = useRef(onLetterAnimationComplete);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    onCompleteRef.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);

  useEffect(() => {
    if (typeof document === "undefined" || !document.fonts) {
      setFontsLoaded(true);
      return;
    }
    if (document.fonts.status === "loaded") {
      setFontsLoaded(true);
    } else {
      document.fonts.ready.then(() => setFontsLoaded(true));
    }
  }, []);

  useGSAP(
    () => {
      if (!ref.current || !text || !fontsLoaded) return;
      if (animationCompletedRef.current) return;
      const el = ref.current;

      if (el._rbsplitInstance) {
        try {
          el._rbsplitInstance.revert();
        } catch {
          // noop
        }
        el._rbsplitInstance = null;
      }

      const startPct = (1 - threshold) * 100;
      const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
      const marginValue = marginMatch ? Number.parseFloat(marginMatch[1]) : 0;
      const marginUnit = marginMatch ? marginMatch[2] || "px" : "px";
      const sign = marginValue === 0 ? "" : marginValue < 0 ? `-=${Math.abs(marginValue)}${marginUnit}` : `+=${marginValue}${marginUnit}`;
      const start = `top ${startPct}%${sign}`;

      let targets: HTMLElement[] = [];
      const assignTargets = (self: GSAPSplitText) => {
        if (splitType.includes("chars") && self.chars.length) targets = self.chars as HTMLElement[];
        if (!targets.length && splitType.includes("words") && self.words.length) targets = self.words as HTMLElement[];
        if (!targets.length && splitType.includes("lines") && self.lines.length) targets = self.lines as HTMLElement[];
        if (!targets.length) targets = (self.chars || self.words || self.lines) as HTMLElement[];
      };

      const splitInstance = new GSAPSplitText(el, {
        type: splitType,
        smartWrap: true,
        autoSplit: splitType === "lines",
        linesClass: "split-line",
        wordsClass: "split-word",
        charsClass: "split-char",
        reduceWhiteSpace: false,
        onSplit: (self) => {
          assignTargets(self);
          const tweenVars = {
            ...to,
            duration,
            ease,
            stagger: delay / 1000,
            onComplete: () => {
              animationCompletedRef.current = true;
              if (showCallback) onCompleteRef.current?.();
            },
            willChange: "transform, opacity",
            force3D: true,
          };
          const tween = gsap.fromTo(
            targets,
            { ...from },
            triggerOnMount
              ? tweenVars
              : {
                  ...tweenVars,
                  scrollTrigger: {
                    trigger: el,
                    start,
                    once: true,
                    fastScrollEnd: true,
                    anticipatePin: 0.4,
                  },
                },
          );
          return tween;
        },
      });

      el._rbsplitInstance = splitInstance;

      return () => {
        if (!triggerOnMount) {
          ScrollTrigger.getAll().forEach((st) => {
            if (st.trigger === el) st.kill();
          });
        }
        try {
          splitInstance.revert();
        } catch {
          // noop
        }
        el._rbsplitInstance = null;
      };
    },
    {
      dependencies: [text, delay, duration, ease, splitType, JSON.stringify(from), JSON.stringify(to), threshold, rootMargin, fontsLoaded, showCallback, triggerOnMount],
      scope: ref,
    },
  );

  const style = {
    textAlign,
    overflow: "hidden",
    display: "inline-block",
    whiteSpace: "normal",
    wordWrap: "break-word",
    willChange: "transform, opacity",
  } as const;
  const classes = `split-parent ${className}`;
  const Tag = tag as ElementType;

  return (
    <Tag ref={ref} style={style} className={classes}>
      {text}
    </Tag>
  );
}
