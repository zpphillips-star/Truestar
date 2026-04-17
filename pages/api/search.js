import { rateLimit, getIp } from "../../lib/rateLimit";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Rate limit: 30 req/min per IP
  const ip = getIp(req);
  const { allowed, remaining, resetIn } = rateLimit(ip, "search", 30);
  if (!allowed) {
    res.setHeader("Retry-After", Math.ceil(resetIn / 1000));
    return res.status(429).json({ error: "Too many requests. Try again in a moment." });
  }

  const { query, location } = req.query;
  if (!query || !location) {
    return res.status(400).json({ error: "Missing query or location" });
  }

  const url = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + encodeURIComponent(query + " restaurant " + location) + "&type=restaurant&key=" + process.env.GOOGLE_PLACES_KEY;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      return res.status(400).json({ error: data.error_message || data.status });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Search failed" });
  }
}
