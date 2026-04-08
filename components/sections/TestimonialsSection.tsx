import { motion, useReducedMotion, type MotionValue } from "framer-motion";
import { Star } from "lucide-react";
import { TESTIMONIALS } from "../../config/clinicData";
import { TestimonialsColumn, type TestimonialColumnItem } from "@/components/ui/testimonials-columns-1";

interface TestimonialsSectionProps {
  yTestimonial: MotionValue<string>;
}

/** Stock portraits (Unsplash) — decorative avatars for column cards. */
const COLUMN_AVATARS: string[] = [
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&face",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&face",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&face",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&face",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&face",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&face",
];

function toColumnItems(): TestimonialColumnItem[] {
  return TESTIMONIALS.map((t, i) => ({
    text: t.text,
    name: t.name,
    role: `${t.platform} · ${t.date}`,
    image: COLUMN_AVATARS[i % COLUMN_AVATARS.length] ?? COLUMN_AVATARS[0],
  }));
}

export default function TestimonialsSection({ yTestimonial }: TestimonialsSectionProps) {
  const reduceMotion = useReducedMotion();
  const columnData = toColumnItems();
  const firstColumn = columnData.slice(0, 3);
  const secondColumn = columnData.slice(3, 6);
  const thirdColumn = columnData.slice(6, 9);

  return (
    <section id="reviews" className="section-shell relative overflow-hidden">
      <motion.div
        className="absolute inset-0 w-full h-[150%] -top-[25%] bg-cover bg-center opacity-10"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1582750433449-648ed127d09b?q=80&w=2069&auto=format&fit=crop")',
          y: yTestimonial,
        }}
      />
      <div className="container-shell relative z-10">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="section-subtitle mb-2">Section 5</p>
          <h2 className="section-title mb-4">Real Patient Testimonials</h2>
          <p className="text-slate-600">
            Collected from Google, Facebook, and Erufu Care based on the client research sheet.
          </p>
          <div className="mx-auto mt-6 flex w-full max-w-2xl flex-col items-center gap-4 rounded-2xl border border-violet-100 bg-white/90 px-4 py-4 shadow-sm sm:flex-row sm:justify-between sm:px-5">
            <img
              src="/Five-Star-Google-Review-Recognition-PNG.png"
              alt="Google five-star review recognition banner"
              className="h-16 w-auto object-contain"
              loading="lazy"
              decoding="async"
            />
            <div className="text-center sm:text-left">
              <p className="text-sm font-semibold uppercase tracking-[0.1em] text-slate-500">Google Reviews</p>
              <p className="text-2xl font-extrabold text-slate-900">5.0 Average Rating</p>
              <p className="text-sm text-slate-600">Based on verified patient feedback.</p>
            </div>
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={`badge-${i}`} className="h-4 w-4 fill-current" />
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 md:gap-6 mt-6 pb-2">
          {reduceMotion === true ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 w-full max-w-5xl">
              {columnData.map((item, idx) => (
                <div
                  key={`static-${item.name}-${idx}`}
                  className="p-6 rounded-3xl border border-violet-100 bg-white/95 shadow-lg shadow-violet-500/10"
                >
                  <p className="text-sm leading-relaxed text-slate-700">{item.text}</p>
                  <div className="flex items-center gap-3 mt-5">

                    <div>
                      <div className="font-medium text-slate-900">{item.name}</div>
                      <div className="text-xs text-slate-600 opacity-80">{item.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <TestimonialsColumn testimonials={firstColumn} duration={15} />
              <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
              <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
