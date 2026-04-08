import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { HeartPulse, Home, IdCard, MapPin, Send, Stethoscope, Star } from "lucide-react";
import MacOSDock from "../ui/MacOSDock";
import { CLINIC_INFO } from "../../config/clinicData";
import { getWhatsAppLink } from "../../utils/contact";
import type { DockAppItem } from "../../types/dock";

const SECTIONS = ["home", "services", "panels", "profile", "reviews", "contact"];

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.offsetTop - 24, behavior: "smooth" });
}

export default function AppleDock() {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const onScroll = () => {
      const mid = window.scrollY + window.innerHeight / 2;
      for (const id of SECTIONS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        const bottom = el.getBoundingClientRect().bottom + window.scrollY;
        if (mid >= top && mid <= bottom) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const apps = useMemo<DockAppItem[]>(
    () => [
      { id: "home", name: "Home", icon: <Home /> },
      { id: "services", name: "Services", icon: <HeartPulse /> },
      { id: "panels", name: "Panels", icon: <IdCard /> },
      { id: "profile", name: "Doctor", icon: <Stethoscope /> },
      { id: "reviews", name: "Reviews", icon: <Star /> },
      { id: "contact", name: "Contact", icon: <MapPin /> },
      {
        id: "dock-divider",
        name: "",
        icon: <div className="h-8 w-px bg-slate-500/35" aria-hidden />,
        isDivider: true,
      },
      { id: "whatsapp", name: "WhatsApp", icon: <Send /> },
    ],
    []
  );

  const onAppClick = (appId: string) => {
    if (appId === "dock-divider") return;
    if (appId === "whatsapp") {
      window.open(getWhatsAppLink(CLINIC_INFO.phone), "_blank", "noopener,noreferrer");
      return;
    }
    scrollTo(appId);
  };

  return (
    <motion.div initial={{ y: 48, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, ease: "easeOut" }}>
      <MacOSDock apps={apps} onAppClick={onAppClick} openApps={[activeSection]} />
    </motion.div>
  );
}
