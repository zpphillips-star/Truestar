export default async function handler(req, res) {
  const { query, location } = req.query;
  const apiKey = process.env.GOOGLE_PLACES_KEY;

  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query + ' restaurant ' + location)}&type=restaurant&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
}
