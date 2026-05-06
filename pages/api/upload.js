// /api/upload — receives base64-encoded image, uploads to Supabase Storage
// POST { base64, mime, filename }
// Returns { url }

export const config = { api: { bodyParser: { sizeLimit: "6mb" } } };

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const BUCKET = "feature-request-images";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { base64, mime, filename } = req.body || {};
  if (!base64 || !mime) return res.status(400).json({ error: "Missing base64 or mime" });

  // Decode base64 → Buffer
  const buffer = Buffer.from(base64, "base64");
  const safeFilename = `${Date.now()}-${(filename || "upload").replace(/[^a-zA-Z0-9._-]/g, "_")}`;

  const uploadRes = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${safeFilename}`,
    {
      method: "POST",
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        "Content-Type": mime,
        "x-upsert": "false",
      },
      body: buffer,
    }
  );

  if (!uploadRes.ok) {
    const err = await uploadRes.text();
    console.error("Supabase storage upload failed:", err);
    return res.status(500).json({ error: "Image upload failed." });
  }

  const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${safeFilename}`;
  return res.status(200).json({ url: publicUrl });
}
