import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import "./Carousel.css";

const DRAG_BUFFER = 24;
const VELOCITY_THRESHOLD = 450;
const GAP = 16;
const SPRING_OPTIONS = { type: "spring", stiffness: 300, damping: 30 } as const;

export interface CarouselItemData {
  id: number | string;
  /** Short label, e.g. Promotions / Announcements (optional). */
  category?: string;
  title: string;
  description: string;
  icon: ReactNode;
}

interface CarouselProps {
  items: CarouselItemData[];
  baseWidth?: number;
  /** Minimum height of each slide card (default 260). */
  minSlideHeight?: number;
}

interface CarouselCardProps {
  item: CarouselItemData;
  index: number;
  itemWidth: number;
  trackItemOffset: number;
  x: ReturnType<typeof useMotionValue<number>>;
  minSlideHeight: number;
}

function CarouselCard({ item, index, itemWidth, trackItemOffset, x, minSlideHeight }: CarouselCardProps) {
  const range = [-(index + 1) * trackItemOffset, -index * trackItemOffset, -(index - 1) * trackItemOffset];
  const rotateY = useTransform(x, range, [16, 0, -16], { clamp: false });

  return (
    <motion.div className="carousel-item" style={{ width: itemWidth, minHeight: minSlideHeight, rotateY }} transition={SPRING_OPTIONS}>
      <div className="carousel-item-header">
        <span className="carousel-icon-container">{item.icon}</span>
      </div>
      <div className="carousel-item-content">
        {item.category ? <span className="carousel-item-category">{item.category}</span> : null}
        <div className="carousel-item-title">{item.title}</div>
        <p className="carousel-item-description">{item.description}</p>
      </div>
    </motion.div>
  );
}

export default function Carousel({ items, baseWidth = 360, minSlideHeight = 260 }: CarouselProps) {
  const containerPadding = 16;
  const [containerWidth, setContainerWidth] = useState(baseWidth);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemWidth = Math.max(220, containerWidth - containerPadding * 2);
  const trackItemOffset = itemWidth + GAP;
  const [position, setPosition] = useState(0);
  const x = useMotionValue(0);

  const safeItems = useMemo(() => items ?? [], [items]);
  const activeIndex = safeItems.length === 0 ? 0 : Math.min(position, safeItems.length - 1);

  useEffect(() => {
    const updateWidth = () => {
      if (!containerRef.current) return;
      setContainerWidth(containerRef.current.clientWidth || baseWidth);
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(updateWidth);
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    window.addEventListener("resize", updateWidth);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateWidth);
    };
  }, [baseWidth]);

  useEffect(() => {
    setPosition((prev) => Math.max(0, Math.min(prev, Math.max(0, safeItems.length - 1))));
  }, [safeItems.length]);

  return (
    <div className="carousel-container" ref={containerRef}>
      <motion.div
        className="carousel-track"
        drag="x"
        dragConstraints={{ left: -trackItemOffset * Math.max(safeItems.length - 1, 0), right: 0 }}
        style={{
          width: itemWidth,
          gap: `${GAP}px`,
          perspective: 1000,
          perspectiveOrigin: `${position * trackItemOffset + itemWidth / 2}px 50%`,
          x,
        }}
        onDragEnd={(_, info) => {
          const direction =
            info.offset.x < -DRAG_BUFFER || info.velocity.x < -VELOCITY_THRESHOLD
              ? 1
              : info.offset.x > DRAG_BUFFER || info.velocity.x > VELOCITY_THRESHOLD
                ? -1
                : 0;

          if (direction === 0) return;
          setPosition((prev) => Math.max(0, Math.min(prev + direction, safeItems.length - 1)));
        }}
        animate={{ x: -(position * trackItemOffset) }}
        transition={SPRING_OPTIONS}
      >
        {safeItems.map((item, index) => (
          <CarouselCard
            key={item.id}
            item={item}
            index={index}
            itemWidth={itemWidth}
            trackItemOffset={trackItemOffset}
            x={x}
            minSlideHeight={minSlideHeight}
          />
        ))}
      </motion.div>
      <div className="carousel-indicators-container">
        <div className="carousel-indicators">
          {safeItems.map((item, index) => (
            <motion.button
              key={item.id}
              type="button"
              className={`carousel-indicator ${activeIndex === index ? "active" : "inactive"}`}
              onClick={() => setPosition(index)}
              aria-label={item.category ? `${item.category}: ${item.title}` : `Go to ${item.title}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
