export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { query, location } = req.query;

  if (!query || !location) {
    return res.status(400).json({ error: "Missing query or location" });
  }

  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
    query + " restaurant " + location
  )}&type=restaurant&key=${process.env.GOOGLE_PLACES_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      console.error("Google Places error:", data.status, data.error_message);
      return res.status(400).json({ error: data.error_message || data.status });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Search failed:", error);
    res.status(500).json({ error: "Search failed" });
  }
}
