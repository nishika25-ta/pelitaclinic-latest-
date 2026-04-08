import React from "react";
import { motion } from "framer-motion";

/** Single card in a scrolling column (matches shadcn-style demo props). */
export interface TestimonialColumnItem {
  text: string;
  image: string;
  name: string;
  role: string;
}

export interface TestimonialsColumnProps {
  className?: string;
  testimonials: TestimonialColumnItem[];
  duration?: number;
}

/**
 * Vertical infinite scroll column. Content is duplicated so translating by -50%
 * loops seamlessly. Uses `framer-motion` (same animation API as `motion` / `motion/react`).
 */
export function TestimonialsColumn({ className, testimonials, duration = 15 }: TestimonialsColumnProps) {
  const loop = [...testimonials, ...testimonials];

  return (
    <div
      className={`h-[min(560px,62svh)] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent_0%,black_8%,black_92%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_8%,black_92%,transparent_100%)] ${className ?? ""}`}
    >
      <motion.div
        animate={{ y: ["0%", "-50%"] }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6 bg-transparent will-change-transform"
      >
        {loop.map((item, i) => (
          <div
            key={`${item.name}-${i}`}
            className="p-6 sm:p-8 rounded-3xl border border-violet-100 bg-white/95 shadow-lg shadow-violet-500/10 max-w-xs w-full"
          >
            <p className="text-sm leading-relaxed text-slate-700">{item.text}</p>
            <div className="flex items-center gap-3 mt-5">

              <div className="flex flex-col min-w-0">
                <div className="font-medium tracking-tight leading-5 text-slate-900 truncate">{item.name}</div>
                <div className="leading-5 opacity-60 tracking-tight text-xs text-slate-600">{item.role}</div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
