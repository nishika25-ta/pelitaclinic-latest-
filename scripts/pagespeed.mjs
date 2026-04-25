#!/usr/bin/env node
/**
 * PageSpeed Insights API (same engine as https://pagespeed.web.dev/ lab data).
 * Requires: public HTTPS URL (not localhost) + Google API key.
 *
 * 1) Google Cloud Console → enable "PageSpeed Insights API"
 * 2) APIs & Services → Credentials → Create API key
 * 3) .env: PAGESPEED_API_KEY=...   (optional) PAGE_SPEED_URL=https://your-domain.com
 *
 * Usage: node scripts/pagespeed.mjs [url]
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function loadEnvFile() {
  for (const name of [".env.local", ".env"]) {
    const p = join(root, name);
    if (!existsSync(p)) continue;
    for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
      if (line.trim().startsWith("#") || !line.includes("=")) continue;
      const i = line.indexOf("=");
      const k = line.slice(0, i).trim();
      let v = line.slice(i + 1).trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
      if (k && process.env[k] == null) process.env[k] = v;
    }
  }
}
loadEnvFile();

const API = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"];

function env(name, fallback) {
  const v = process.env[name];
  return v && v.trim() ? v.trim() : fallback;
}

function getTargetUrl() {
  const fromArg = process.argv[2];
  if (fromArg) return fromArg;
  return env("PAGE_SPEED_URL", env("NEXT_PUBLIC_SITE_URL", "https://pelita-clinic.com").replace(/\/+$/, "") + "/");
}

const key = env("PAGESPEED_API_KEY", null) || env("GOOGLE_PAGESPEED_KEY", null);

if (!key) {
  console.error(`
PageSpeed Insights API needs a key.

1. Open: https://console.cloud.google.com/apis/library/pagespeedonline.googleapis.com
2. Enable "PageSpeed Insights API" for a project
3. APIs & Services → Credentials → Create credentials → API key
4. Set in .env:  PAGESPEED_API_KEY=your_key
5. Run again:   node scripts/pagespeed.mjs

URL: use arg, PAGE_SPEED_URL, or NEXT_PUBLIC_SITE_URL (default ends with /). Public HTTPS only.
`.trim());
  process.exit(1);
}

const targetUrl = getTargetUrl();
if (targetUrl.includes("localhost") || targetUrl.includes("127.0.0.1") || targetUrl.startsWith("http://192.168.")) {
  console.error(
    "PageSpeed Insights can only reach public URLs. Deploy your site or use a tunnel (ngrok), then pass that HTTPS URL.\n",
  );
  process.exit(1);
}

function buildRequestUrl(strategy) {
  const u = new URL(API);
  u.searchParams.set("url", targetUrl);
  u.searchParams.set("key", key);
  u.searchParams.set("strategy", strategy);
  for (const c of CATEGORIES) u.searchParams.append("category", c);
  return u.toString();
}

function pickScores(lh) {
  const out = { categories: {} };
  for (const [id, cat] of Object.entries(lh?.categories ?? {})) {
    if (cat?.score == null) continue;
    out.categories[id] = {
      title: cat.title,
      score: Math.round(cat.score * 100),
    };
  }
  return out;
}

async function runStrategy(strategy) {
  const res = await fetch(buildRequestUrl(strategy), { method: "GET" });
  const text = await res.text();
  if (!res.ok) {
    let detail = text;
    try {
      const j = JSON.parse(text);
      detail = j.error?.message || JSON.stringify(j.error) || text;
    } catch {
      /* */
    }
    throw new Error(`HTTP ${res.status}: ${detail}`);
  }
  return JSON.parse(text);
}

function printSummary(name, data) {
  const lh = data.lighthouseResult;
  if (!lh) {
    console.log(name, "no lighthouseResult in response");
    return;
  }
  const s = pickScores(lh);
  console.log(`\n=== ${name} ===`);
  for (const [k, v] of Object.entries(s.categories)) {
    console.log(`  ${v.title ?? k}: ${v.score}/100`);
  }
  const fcp = lh.audits?.["first-contentful-paint"]?.displayValue;
  const lcp = lh.audits?.["largest-contentful-paint"]?.displayValue;
  const cls = lh.audits?.["cumulative-layout-shift"]?.displayValue;
  if (fcp || lcp || cls) {
    console.log("  (metrics)", [fcp && `FCP ${fcp}`, lcp && `LCP ${lcp}`, cls && `CLS ${cls}`].filter(Boolean).join(" | "));
  }
}

try {
  console.log("Target:", targetUrl);
  const [mobile, desktop] = await Promise.all([runStrategy("mobile"), runStrategy("desktop")]);

  printSummary("Mobile", mobile);
  printSummary("Desktop", desktop);

  const out = {
    fetchedAt: new Date().toISOString(),
    url: targetUrl,
    mobile: {
      ...pickScores(mobile.lighthouseResult),
      loadingExperience: mobile.loadingExperience ?? null,
    },
    desktop: {
      ...pickScores(desktop.lighthouseResult),
      loadingExperience: desktop.loadingExperience ?? null,
    },
    // Full payloads are large; keep ref only unless debugging
    _note: "Full API JSON is large. Re-run with DEBUG_PSI=1 in env to include raw in file.",
  };

  if (env("DEBUG_PSI", null) === "1") {
    out._raw = { mobile, desktop };
  }

  const outPath = join(root, "pagespeed-report.json");
  writeFileSync(outPath, JSON.stringify(out, null, 2), "utf8");
  console.log(`\nWrote: ${outPath}`);
} catch (e) {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
}
