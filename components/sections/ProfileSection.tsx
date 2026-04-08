import { Briefcase, Languages, Stethoscope } from "lucide-react";
import { motion } from "framer-motion";
import { CLINIC_INFO, DOCTOR_PROFILE } from "../../config/clinicData";
import { useParallax } from "../../utils/useParallax";

export default function ProfileSection() {
  const { ref, y } = useParallax({ distance: 35 });

  return (
    <section id="profile" className="section-shell overflow-hidden">
      <div className="container-shell grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div ref={ref} style={{ y }} className="relative w-full">
          <div className="absolute inset-0 rounded-full bg-violet-100 opacity-60 blur-3xl transform -translate-x-10 translate-y-10" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border-4 border-white shadow-2xl">
            <div className="flex h-full w-full items-center justify-center bg-violet-50 text-center text-violet-500">
              <div>
                <p className="text-lg font-semibold">Doctor Photo Placeholder</p>
                <p className="mt-1 text-sm">Client to provide high-resolution image</p>
              </div>
            </div>
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900/80 to-transparent p-6 pt-24">
              <p className="flex items-center gap-2 text-sm font-medium text-white">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                Accepting Walk-ins
              </p>
            </div>
          </div>
        </motion.div>

        <div className="w-full space-y-5">
          <p className="section-subtitle">Section 4</p>
          <h2 className="section-title">Clinic & Doctor Profile</h2>
          <div className="glass-card p-6">
            <h3 className="mb-1 text-2xl font-bold text-slate-900">{DOCTOR_PROFILE.name}</h3>
            <p className="mb-5 text-base text-violet-700">{DOCTOR_PROFILE.designation}</p>
            <div className="space-y-5">
              <div className="flex gap-4">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-50">
                  <Briefcase className="h-5 w-5 text-violet-500" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Qualifications & Experience</h4>
                  <ul className="mt-2 space-y-2 text-sm text-slate-600">
                    {DOCTOR_PROFILE.qualifications.map((q) => (
                      <li key={q} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-300" />
                        {q}
                      </li>
                    ))}
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-300" />
                      {DOCTOR_PROFILE.experience} experience
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-50">
                  <Languages className="h-5 w-5 text-violet-500" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Languages Spoken</h4>
                  <p className="mt-1 text-sm text-slate-600">{DOCTOR_PROFILE.languages}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-violet-700">
              <Stethoscope className="h-4 w-4" />
              Clinic Identity
            </h4>
            <div className="mb-3 flex items-center gap-3">
              <img
                src="/logo/logo.png"
                alt={`${CLINIC_INFO.name} logo`}
                className="h-12 w-12 rounded-full border border-violet-200 bg-white object-cover shadow-sm"
                loading="lazy"
                decoding="async"
              />
              <p className="text-sm font-semibold text-slate-800">{CLINIC_INFO.name}</p>
            </div>
            <p className="text-sm text-slate-700">
              <strong>{CLINIC_INFO.name}</strong> · Established {CLINIC_INFO.established}
            </p>
            <p className="mt-2 text-sm text-slate-600">{CLINIC_INFO.type}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
