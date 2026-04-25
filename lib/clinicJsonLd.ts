import { CLINIC_INFO } from "@/config/clinicData";
import { getSiteUrl } from "@/lib/siteUrl";

/** Schema.org for crawlers; matches `CLINIC_INFO` and real services (GP, not dental). */
export function getClinicJsonLd(): Record<string, unknown> {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: CLINIC_INFO.name,
    description:
      "Family medicine and general practice clinic in Miri, Sarawak. GP consultations, health screening, vaccinations, and patient-first care.",
    url: siteUrl,
    image: `${siteUrl}/preload.webp`,
    telephone: CLINIC_INFO.phone,
    email: CLINIC_INFO.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Ground Floor, Lot 600, Block 7, Pelita Commercial Centre",
      addressLocality: "Miri",
      addressRegion: "Sarawak",
      postalCode: "98000",
      addressCountry: "MY",
    },
    areaServed: {
      "@type": "City",
      name: "Miri",
    },
    medicalSpecialty: "Family medicine",
  };
}
