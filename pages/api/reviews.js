import { rateLimit, getIp } from "../../lib/rateLimit";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Rate limit: 30 req/min per IP
  const ip = getIp(req);
  const { allowed, remaining, resetIn } = rateLimit(ip, "reviews", 30);
  if (!allowed) {
    res.setHeader("Retry-After", Math.ceil(resetIn / 1000));
    return res.status(429).json({ error: "Too many requests. Try again in a moment." });
  }

  const { placeId } = req.query;
  if (!placeId) {
    return res.status(400).json({ error: "Missing placeId" });
  }

  const url = "https://maps.googleapis.com/maps/api/place/details/json?place_id=" + placeId + "&fields=name,rating,reviews,user_ratings_total&key=" + process.env.GOOGLE_PLACES_KEY;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.status !== "OK") {
      return res.status(400).json({ error: data.error_message || data.status });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
}
