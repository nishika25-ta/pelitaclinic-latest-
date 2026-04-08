import { Children, cloneElement, isValidElement, useLayoutEffect, useRef, type ReactElement, type ReactNode } from "react";
import "./ScrollStack.css";

interface ScrollStackProps {
  children: ReactNode;
  className?: string;
  stackPositionPercent?: number;
  stackGap?: number;
  scaleStep?: number;
  baseScale?: number;
}

interface ScrollStackItemProps {
  children: ReactNode;
  itemClassName?: string;
}

export function ScrollStackItem({ children, itemClassName = "" }: ScrollStackItemProps) {
  return <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>;
}

export default function ScrollStack({
  children,
  className = "",
  stackPositionPercent = 22,
  stackGap = 28,
  scaleStep = 0.035,
  baseScale = 0.86,
}: ScrollStackProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const rafRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    const cards = cardsRef.current.filter(Boolean);
    if (!cards.length) return;

    const updateCards = () => {
      const viewportHeight = window.innerHeight;
      const scrollTop = window.scrollY;
      const stackPosition = (stackPositionPercent / 100) * viewportHeight;

      const endElement = scrollerRef.current?.querySelector(".scroll-stack-end");
      const endTop = endElement ? endElement.getBoundingClientRect().top + scrollTop : scrollTop + viewportHeight;

      cards.forEach((card, i) => {
        const cardTop = card.getBoundingClientRect().top + scrollTop;
        const triggerStart = cardTop - stackPosition - stackGap * i;
        const triggerEnd = cardTop - viewportHeight * 0.1;
        const pinEnd = endTop - viewportHeight / 2;

        const progressRaw = (scrollTop - triggerStart) / Math.max(1, triggerEnd - triggerStart);
        const progress = Math.min(1, Math.max(0, progressRaw));
        const targetScale = baseScale + i * scaleStep;
        const scale = 1 - progress * (1 - targetScale);

        let translateY = 0;
        if (scrollTop >= triggerStart && scrollTop <= pinEnd) {
          translateY = scrollTop - cardTop + stackPosition + stackGap * i;
        } else if (scrollTop > pinEnd) {
          translateY = pinEnd - cardTop + stackPosition + stackGap * i;
        }

        card.style.transform = `translate3d(0, ${translateY.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`;
      });
    };

    const onScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(() => {
        updateCards();
        rafRef.current = null;
      });
    };

    updateCards();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [baseScale, scaleStep, stackGap, stackPositionPercent]);

  const stackedChildren = Children.map(children, (child, index) => {
    if (!isValidElement(child)) return child;
    return cloneElement(child as ReactElement<{ ref?: (node: HTMLDivElement | null) => void }>, {
      ref: (node: HTMLDivElement | null) => {
        if (!node) return;
        cardsRef.current[index] = node;
      },
    });
  });

  return (
    <div className={`scroll-stack-scroller ${className}`.trim()} ref={scrollerRef}>
      <div className="scroll-stack-inner">
        <div className="scroll-stack-card-wrapper">{stackedChildren}</div>
        <div className="scroll-stack-end" />
      </div>
    </div>
  );
}
