import { useEffect } from "react";
import { useScroll, useTransform, AnimatePresence } from "framer-motion";
import SmoothScroll from "../components/layout/SmoothScroll";
import ScrollReveal from "../components/ui/ScrollReveal";
import HeroSection from "../components/sections/HeroSection";
import ServicesSection from "../components/sections/ServicesSection";
import PanelsSection from "../components/sections/PanelsSection";
import ProfileSection from "../components/sections/ProfileSection";
import TestimonialsSection from "../components/sections/TestimonialsSection";
import ContactSection from "../components/sections/ContactSection";
import SiteFooter from "../components/layout/SiteFooter";
import AppleDock from "../components/layout/AppleDock";
import SplashScreen from "../components/ui/SplashScreen";

export default function App() {
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const yTestimonial = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    const timer = window.setTimeout(() => {
      document.body.classList.remove("overflow-hidden");
    }, 4000);
    return () => {
      window.clearTimeout(timer);
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return (
    <>
      <SplashScreen />
      <SmoothScroll>
        <div className="min-h-screen overflow-x-clip overflow-y-visible font-sans text-slate-800 selection:bg-purple-200 selection:text-purple-900">
          <main>
            <HeroSection yHero={yHero} />
            <ScrollReveal>
              <ServicesSection />
            </ScrollReveal>
            <ScrollReveal>
              <PanelsSection />
            </ScrollReveal>
            <ScrollReveal>
              <ProfileSection />
            </ScrollReveal>
            <ScrollReveal>
              <TestimonialsSection yTestimonial={yTestimonial} />
            </ScrollReveal>
            <ScrollReveal>
              <ContactSection />
            </ScrollReveal>
          </main>
          <ScrollReveal>
            <SiteFooter />
          </ScrollReveal>
          <AppleDock />
        </div>
      </SmoothScroll>
    </>
  );
}
