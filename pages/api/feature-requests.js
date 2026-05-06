// Feature Requests API
// POST  → submit a new request (public)
// GET   → fetch requests (public, supports ?status= filter)
// PATCH → update a request (admin only, requires x-admin-key header)

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

function supabaseFetch(path, options = {}, useServiceKey = false) {
  const key = useServiceKey ? SUPABASE_SERVICE_KEY : SUPABASE_ANON_KEY;
  return fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...options,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
}

export default async function handler(req, res) {
  // ── GET: fetch requests ─────────────────────────────────────────────────
  if (req.method === "GET") {
    const { status } = req.query;
    let path = `/feature_requests?select=*&order=votes.desc,created_at.desc`;
    if (status) path += `&status=eq.${encodeURIComponent(status)}`;

    const r = await supabaseFetch(path);
    const data = await r.json();
    return res.status(r.ok ? 200 : 500).json(data);
  }

  // ── POST: submit new request ────────────────────────────────────────────
  if (req.method === "POST") {
    const { title, description, image_url } = req.body || {};
    if (!title || title.trim().length < 3) {
      return res.status(400).json({ error: "Title must be at least 3 characters." });
    }

    const r = await supabaseFetch(
      "/feature_requests",
      {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({
          title: title.trim().slice(0, 120),
          description: description ? description.trim().slice(0, 1000) : null,
          image_url: image_url || null,
        }),
      },
      true // service key for writes
    );

    if (!r.ok) return res.status(500).json({ error: "Failed to save request." });
    return res.status(201).json({ success: true });
  }

  // ── PATCH: update request (admin) ───────────────────────────────────────
  if (req.method === "PATCH") {
    const adminKey = req.headers["x-admin-key"];
    if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
      return res.status(401).json({ error: "Unauthorized." });
    }

    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "Missing request id." });

    const allowed = ["status", "zap_notes", "zap_score", "votes"];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    updates.updated_at = new Date().toISOString();

    const r = await supabaseFetch(
      `/feature_requests?id=eq.${id}`,
      {
        method: "PATCH",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify(updates),
      },
      true
    );

    if (!r.ok) return res.status(500).json({ error: "Update failed." });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: "Method not allowed." });
}
