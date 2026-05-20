#!/usr/bin/env node
/**
 * scripts/ping-indexnow.js
 *
 * Fires IndexNow pings to Bing, Yandex, and api.indexnow.org after every
 * production build.  Runs automatically via the "postbuild" npm script so
 * Vercel triggers it on every deployment.
 *
 * Mirrors the URL list in pages/api/indexnow.js — keep both in sync when
 * new pages are added.
 */

const INDEXNOW_KEY = "a3f8b2e1d4c7960f5e2a1b3d8c4f7e09";
const HOST = "gettruestar.com";

const ALL_URLS = [
  "https://gettruestar.com/",
  "https://gettruestar.com/blog",
  "https://gettruestar.com/compare",
  "https://gettruestar.com/roadmap",
  "https://gettruestar.com/use-cases",
  "https://gettruestar.com/blog/are-google-maps-ratings-accurate",
  "https://gettruestar.com/blog/best-chrome-extensions-for-google-maps",
  "https://gettruestar.com/blog/best-restaurants-near-me-tips",
  "https://gettruestar.com/blog/best-way-to-discover-local-restaurants",
  "https://gettruestar.com/blog/chrome-extensions-for-foodies",
  "https://gettruestar.com/blog/how-to-filter-restaurants-by-price-and-rating",
  "https://gettruestar.com/blog/how-to-find-good-restaurants-google-maps",
  "https://gettruestar.com/blog/how-to-find-hidden-gem-restaurants",
  "https://gettruestar.com/blog/yelp-vs-google-maps-reviews",
  "https://gettruestar.com/blog/why-google-maps-ratings-are-misleading",
  "https://gettruestar.com/blog/best-restaurants-for-business-lunch",
  "https://gettruestar.com/blog/how-to-find-cheap-eats-near-me",
  "https://gettruestar.com/blog/google-maps-vs-yelp-which-is-better",
  "https://gettruestar.com/blog/how-to-discover-new-restaurants-in-your-city",
];

const ENDPOINTS = [
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
  "https://yandex.com/indexnow",
];

async function pingEndpoint(endpoint, payload) {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });
    return { endpoint, status: res.status, ok: res.ok };
  } catch (err) {
    return { endpoint, status: null, ok: false, error: err.message };
  }
}

async function main() {
  // Skip during local dev / preview builds — only ping on production.
  // Vercel sets VERCEL_ENV=production for prod deployments.
  // When running locally (no VERCEL_ENV), also skip unless FORCE_INDEXNOW=1.
  const env = process.env.VERCEL_ENV;
  if (env && env !== "production" && !process.env.FORCE_INDEXNOW) {
    console.log(`[IndexNow] Skipping ping — VERCEL_ENV=${env} (not production)`);
    return;
  }
  if (!env && !process.env.FORCE_INDEXNOW) {
    console.log("[IndexNow] Skipping ping — not running on Vercel (set FORCE_INDEXNOW=1 to override)");
    return;
  }

  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
    urlList: ALL_URLS,
  };

  console.log(`[IndexNow] Pinging ${ENDPOINTS.length} endpoints with ${ALL_URLS.length} URLs…`);

  const results = await Promise.allSettled(
    ENDPOINTS.map((ep) => pingEndpoint(ep, payload))
  );

  let allOk = true;
  for (const r of results) {
    const val = r.status === "fulfilled" ? r.value : { endpoint: "?", ok: false, error: r.reason?.message };
    const icon = val.ok ? "✓" : "✗";
    const detail = val.error ? ` (${val.error})` : ` HTTP ${val.status}`;
    console.log(`  ${icon} ${val.endpoint}${detail}`);
    if (!val.ok) allOk = false;
  }

  if (allOk) {
    console.log("[IndexNow] All pings succeeded.");
  } else {
    // Non-zero exit would fail the Vercel build — warn only so a flaky
    // IndexNow endpoint never blocks a deployment.
    console.warn("[IndexNow] One or more pings failed (build continues).");
  }
}

main();
