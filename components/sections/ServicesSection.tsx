import { useState } from "react";
import { Activity, Baby, Bug, CheckCircle2, HeartPulse, ShieldAlert, Stethoscope, Syringe } from "lucide-react";
import { SERVICES } from "../../config/clinicData";

const iconClass = "w-6 h-6 text-purple-400";
const iconMap = {
  stethoscope: <Stethoscope className={iconClass} />,
  activity: <Activity className={iconClass} />,
  bug: <Bug className={iconClass} />,
  syringe: <Syringe className={iconClass} />,
  baby: <Baby className={iconClass} />,
  heartPulse: <HeartPulse className={iconClass} />,
  shieldAlert: <ShieldAlert className={iconClass} />,
};

export default function ServicesSection() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const totalServices = SERVICES.reduce((sum, service) => sum + service.items.length, 0);

  const toggleExpanded = (category: string) => {
    setExpanded((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  return (
    <section id="services" className="section-shell relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-violet-200/30 to-transparent" aria-hidden />
      <div className="container-shell">
        <div className="glass-card-strong relative mx-auto mb-10 max-w-5xl p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <div>
              <p className="section-subtitle mb-2">Section 2</p>
              <h2 className="section-title mb-3">Comprehensive Services Available</h2>
              <p className="text-slate-600">
                From everyday consultation to chronic care and women&apos;s or children&apos;s health, every service is grouped clearly so patients can find what they need fast.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-violet-100 bg-white/90 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.12em] text-violet-600">Categories</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{SERVICES.length}</p>
              </div>
              <div className="rounded-2xl border border-violet-100 bg-white/90 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.12em] text-violet-600">Total Services</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{totalServices}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {SERVICES.map((service) => (
            <article
              key={service.category}
              className="glass-card group p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-200/30"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-100 bg-white shadow-sm transition-transform group-hover:scale-110">
                  {iconMap[service.iconName as keyof typeof iconMap]}
                </div>
                <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                  {service.items.length} items
                </span>
              </div>
              <h4 className="mb-3 text-lg font-bold text-slate-900">{service.category}</h4>
              <ul className="space-y-2.5 text-sm">
                {(expanded[service.category] ? service.items : service.items.slice(0, 4)).map((item) => (
                  <li key={item} className="flex items-start gap-2 leading-relaxed text-slate-600">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              {service.items.length > 4 && (
                <button
                  onClick={() => toggleExpanded(service.category)}
                  className="mt-4 text-sm font-semibold text-violet-700 transition hover:text-violet-900"
                >
                  {expanded[service.category] ? "Show less" : `Show all ${service.items.length} services`}
                </button>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
