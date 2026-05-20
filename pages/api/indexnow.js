// IndexNow submission API route
// POST /api/indexnow — pings Bing and Yandex with updated URLs
// Call this after deploying new content

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

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const urlsToSubmit = req.body?.urls || ALL_URLS;

  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
    urlList: urlsToSubmit,
  };

  const endpoints = [
    "https://api.indexnow.org/indexnow",
    "https://www.bing.com/indexnow",
    "https://yandex.com/indexnow",
  ];

  const results = await Promise.allSettled(
    endpoints.map((endpoint) =>
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(payload),
      }).then((r) => ({ endpoint, status: r.status, ok: r.ok }))
    )
  );

  const summary = results.map((r) =>
    r.status === "fulfilled" ? r.value : { endpoint: "unknown", error: r.reason?.message }
  );

  return res.status(200).json({
    submitted: urlsToSubmit.length,
    urls: urlsToSubmit,
    results: summary,
  });
}
