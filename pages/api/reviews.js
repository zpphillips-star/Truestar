export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { placeId } = req.query;

  if (!placeId) {
    return res.status(400).json({ error: "Missing placeId" });
  }

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews,user_ratings_total&key=${process.env.GOOGLE_PLACES_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "OK") {
      console.error("Google Places error:", data.status, data.error_message);
      return res.status(400).json({ error: data.error_message || data.status });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Reviews fetch failed:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
}
