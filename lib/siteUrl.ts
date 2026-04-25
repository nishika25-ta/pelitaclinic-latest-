/** Public site origin, normalized (no trailing slash). Use for metadata, sitemap, and JSON-LD. */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pelita-clinic.com";
  return raw.replace(/\/+$/, "");
}
