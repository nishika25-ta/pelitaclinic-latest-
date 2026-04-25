import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { I18nProvider } from "@/contexts/I18nContext";
import { getClinicJsonLd } from "@/lib/clinicJsonLd";
import { getSiteUrl } from "@/lib/siteUrl";
import "./globals.css";
import type { ReactNode } from "react";

const inter = Inter({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = getSiteUrl();
const defaultTitle = "Pelita Clinic | General Practice & Family Medicine in Miri";
const defaultDescription =
  "General practice clinic in Miri, Sarawak: GP consultations, health screening, vaccinations, acute care, and women's and children's health — experienced doctors, patient-first care.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | Pelita Clinic",
  },
  description: defaultDescription,
  keywords: [
    "Pelita Clinic",
    "general practice Miri",
    "GP clinic Miri",
    "family doctor Sarawak",
    "health screening Miri",
    "walk-in clinic Miri",
    "Pelita Commercial Centre",
    "medical clinic Miri",
    "vaccination Miri",
  ],
  applicationName: "Pelita Clinic",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Pelita Clinic",
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: "/preload.webp",
        width: 1200,
        height: 630,
        alt: "Pelita Clinic — general practice in Miri, Sarawak",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/preload.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/logo/logo.webp",
    apple: "/logo/logo.webp",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const jsonLd = getClinicJsonLd();
  /* suppressHydrationWarning: some browsers/extensions add data-* attrs to <html> before hydration. */
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preload" as="image" href="/preload.webp" fetchPriority="high" />
        <link rel="preload" as="image" href="/logo/logo.webp" />
      </head>
      <body className={inter.variable}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
