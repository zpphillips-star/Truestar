// POST /api/vote?id=[uuid]
// Increments votes by 1 using a Supabase RPC or a read-then-write

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "Missing id." });

  // Read current votes
  const getRes = await fetch(
    `${SUPABASE_URL}/rest/v1/feature_requests?id=eq.${id}&select=votes`,
    {
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    }
  );

  const rows = await getRes.json();
  if (!rows || rows.length === 0) return res.status(404).json({ error: "Not found." });

  const newVotes = (rows[0].votes || 1) + 1;

  const patchRes = await fetch(
    `${SUPABASE_URL}/rest/v1/feature_requests?id=eq.${id}`,
    {
      method: "PATCH",
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ votes: newVotes, updated_at: new Date().toISOString() }),
    }
  );

  if (!patchRes.ok) return res.status(500).json({ error: "Vote failed." });
  return res.status(200).json({ votes: newVotes });
}
