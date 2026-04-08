import { PANELS } from "../../config/clinicData";

const PANEL_ICON_MAP: Record<string, string> = {
  AIA: "/panel_icon/AIA.png",
  "EMAS (Eximius)": "/panel_icon/eximius.png",
  PERKESO: "/panel_icon/PERKESO.png",
  "Health Connect / MediExpress": "/panel_icon/mediexpress.png",
  "PeKa B40": "/panel_icon/PEKA.png",
  PMCare: "/panel_icon/pmcare.png",
  "Senior Citizen Health Benefit (SCHB)": "/panel_icon/SCHB.jpg",
  "Kenyalang Gold Card": "/panel_icon/GoldCard.png",
  WeCare: "/panel_icon/wecare.png",
  Medkad: "/panel_icon/medkad.png",
  "Great Eastern": "/panel_icon/greateastern.png",
  "Public Bank": "/panel_icon/publicbank.png",
  "Grand Palace Hotel Miri": "/panel_icon/grandpalace.png",
};

export default function PanelsSection() {
  return (
    <section id="panels" className="section-shell pt-8" aria-labelledby="panels-heading">
      <div className="container-shell">
        <div className="glass-card-strong overflow-hidden p-8 sm:p-10">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="section-subtitle mb-2">Section 3</p>
            <h3 id="panels-heading" className="mb-3 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Recognized Panel Clinic Endorsements
            </h3>
            <p className="text-sm leading-relaxed text-slate-600">
              Pelita Clinic works with private insurers, government schemes, and community health programmes. Ask at reception if your plan is accepted.
            </p>
          </div>

          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" role="list">
            {PANELS.map((panel) => (
              <li key={panel} className="list-none">
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-violet-100/80 bg-gradient-to-b from-white to-violet-50/30 shadow-sm ring-1 ring-violet-100/50 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-200/40 hover:ring-violet-200/80 focus-within:ring-2 focus-within:ring-violet-400">
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-white via-violet-50/50 to-slate-50">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.08),transparent_50%)]" aria-hidden />
                    {PANEL_ICON_MAP[panel] ? (
                      <img
                        src={PANEL_ICON_MAP[panel]}
                        alt={`${panel} logo`}
                        className="relative z-[1] h-full w-full object-cover object-center transition duration-300 group-hover:scale-[1.02]"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="relative z-[1] flex h-full w-full items-center justify-center">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-violet-500">Logo</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-end border-t border-violet-100/60 bg-white/80 px-4 py-3 backdrop-blur-sm">
                    <p className="text-sm font-semibold leading-snug text-slate-800">{panel}</p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
