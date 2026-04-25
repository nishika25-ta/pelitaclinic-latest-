import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pelita Clinic",
    short_name: "Pelita Clinic",
    description:
      "General practice in Miri, Sarawak: GP care, health screening, and vaccinations. Experienced doctors, patient-first care.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/logo/logo.webp",
        sizes: "192x192",
        type: "image/webp",
      },
      {
        src: "/logo/logo.webp",
        sizes: "512x512",
        type: "image/webp",
      },
    ],
  };
}
