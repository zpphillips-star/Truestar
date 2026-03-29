export default async function handler(req, res) {
  const { placeId } = req.query;
  const apiKey = process.env.GOOGLE_PLACES_KEY;

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews,user_ratings_total&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
}
