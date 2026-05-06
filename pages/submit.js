import Head from "next/head";
import { useState, useRef } from "react";
import Link from "next/link";
import { Logo } from "../components/Logo";

const C = {
  cream: "#F4EFE6",
  ink: "#38301f",
  ink2: "#6a5a3a",
  muted: "#b0a898",
  border: "#E0D8CA",
  white: "#FFFFFF",
  orange: "#E8563A",
  amber: "#E7A545",
};

function Nav() {
  return (
    <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", borderBottom: `1px solid ${C.border}`, background: C.cream }}>
      <Link href="/" style={{ textDecoration: "none" }}>
        <Logo size={22} starColor={C.amber} textColor={C.ink} />
      </Link>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <Link href="/roadmap" style={{ color: C.ink2, textDecoration: "none", fontSize: 14, fontWeight: 600 }}>Roadmap</Link>
        <Link href="/submit" style={{ background: C.orange, color: "#fff", padding: "8px 18px", borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
          Suggest a Feature
        </Link>
      </div>
    </nav>
  );
}

export default function SubmitRequest() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef();

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Image must be under 5MB.");
      setStatus("error");
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = ev => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
    if (status === "error") { setStatus("idle"); setErrorMsg(""); }
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (title.trim().length < 3) return;
    setStatus("loading");

    try {
      let imageUrl = null;

      // Upload image first if present
      if (imageFile) {
        const reader = new FileReader();
        const base64 = await new Promise((resolve, reject) => {
          reader.onload = ev => resolve(ev.target.result.split(",")[1]);
          reader.onerror = reject;
          reader.readAsDataURL(imageFile);
        });
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ base64, mime: imageFile.type, filename: imageFile.name }),
        });
        if (!uploadRes.ok) {
          const d = await uploadRes.json();
          setErrorMsg(d.error || "Image upload failed.");
          setStatus("error");
          return;
        }
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      }

      const res = await fetch("/api/feature-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, image_url: imageUrl }),
      });
      if (!res.ok) {
        const d = await res.json();
        setErrorMsg(d.error || "Something went wrong.");
        setStatus("error");
      } else {
        setStatus("success");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <>
      <Head>
        <title>Suggest a Feature — TrueStar</title>
        <meta name="description" content="Got an idea to make TrueStar better? Tell us — we read every request." />
        <link rel="icon" href="/icon128.png" />
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Lato', -apple-system, BlinkMacSystemFont, sans-serif; background: ${C.cream}; color: ${C.ink}; }
        textarea, input { font-family: inherit; }
        input:focus, textarea:focus { outline: 2px solid ${C.orange}; outline-offset: 0; }
      `}</style>

      <Nav />

      <main style={{ maxWidth: 600, margin: "0 auto", padding: "64px 24px" }}>

        {status === "success" ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 56, marginBottom: 20 }}>🌟</div>
            <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 12 }}>Request submitted!</h1>
            <p style={{ color: C.ink2, fontSize: 16, lineHeight: 1.6, marginBottom: 32 }}>
              We review all requests weekly. Check the roadmap to see where things stand.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/roadmap" style={{ background: C.orange, color: "#fff", padding: "12px 28px", borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                View Roadmap →
              </Link>
              <button
                onClick={() => { setTitle(""); setDescription(""); setStatus("idle"); }}
                style={{ background: "none", border: `1px solid ${C.border}`, color: C.ink2, padding: "12px 28px", borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: "pointer" }}
              >
                Submit Another
              </button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 40 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, padding: "5px 14px", marginBottom: 20, fontSize: 12, color: C.ink2 }}>
                💡 Feature Request
              </div>
              <h1 style={{ fontSize: 36, fontWeight: 900, lineHeight: 1.1, marginBottom: 12 }}>
                Got an idea?
              </h1>
              <p style={{ color: C.ink2, fontSize: 16, lineHeight: 1.6 }}>
                We read every request and review them weekly. The most-requested ideas get built first.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontWeight: 700, fontSize: 14, marginBottom: 8, color: C.ink }}>
                  What would you like to see? <span style={{ color: C.orange }}>*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Show price range filter on search results"
                  maxLength={120}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: 8,
                    border: `1.5px solid ${C.border}`,
                    fontSize: 15,
                    background: C.white,
                    color: C.ink,
                  }}
                />
                <div style={{ textAlign: "right", fontSize: 11, color: C.muted, marginTop: 4 }}>
                  {title.length}/120
                </div>
              </div>

              <div style={{ marginBottom: 28 }}>
                <label style={{ display: "block", fontWeight: 700, fontSize: 14, marginBottom: 8, color: C.ink }}>
                  Any details? <span style={{ color: C.muted, fontWeight: 400 }}>(optional)</span>
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Tell us more about the problem it solves or how it would work..."
                  maxLength={1000}
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: 8,
                    border: `1.5px solid ${C.border}`,
                    fontSize: 15,
                    background: C.white,
                    color: C.ink,
                    resize: "vertical",
                  }}
                />
                <div style={{ textAlign: "right", fontSize: 11, color: C.muted, marginTop: 4 }}>
                  {description.length}/1000
                </div>
              </div>

              {/* Image upload */}
              <div style={{ marginBottom: 28 }}>
                <label style={{ display: "block", fontWeight: 700, fontSize: 14, marginBottom: 8, color: C.ink }}>
                  Screenshot or mockup <span style={{ color: C.muted, fontWeight: 400 }}>(optional)</span>
                </label>
                {imagePreview ? (
                  <div style={{ position: "relative", display: "inline-block" }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ maxWidth: "100%", maxHeight: 240, borderRadius: 8, border: `1.5px solid ${C.border}`, display: "block" }}
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      style={{
                        position: "absolute", top: 8, right: 8,
                        background: "rgba(0,0,0,0.55)", color: "#fff",
                        border: "none", borderRadius: "50%", width: 28, height: 28,
                        fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                      title="Remove image"
                    >✕</button>
                  </div>
                ) : (
                  <label
                    style={{
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                      gap: 8, padding: "24px 16px", borderRadius: 8,
                      border: `1.5px dashed ${C.border}`, cursor: "pointer",
                      background: "#faf8f4", color: C.muted, fontSize: 14,
                    }}
                  >
                    <span style={{ fontSize: 28 }}>📎</span>
                    <span>Click to attach an image</span>
                    <span style={{ fontSize: 12 }}>PNG, JPG, GIF · max 5MB</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                  </label>
                )}
              </div>

              {status === "error" && (
                <div style={{ background: "#fde8e8", color: "#CC010A", borderRadius: 8, padding: "10px 16px", fontSize: 14, marginBottom: 16 }}>
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading" || title.trim().length < 3}
                style={{
                  width: "100%",
                  background: status === "loading" || title.trim().length < 3 ? "#ccc" : C.orange,
                  color: "#fff",
                  padding: "14px",
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 16,
                  border: "none",
                  cursor: status === "loading" || title.trim().length < 3 ? "not-allowed" : "pointer",
                  transition: "background 0.15s",
                }}
              >
                {status === "loading" ? "Submitting…" : "Submit Request"}
              </button>
            </form>
          </>
        )}
      </main>

      <footer style={{ padding: "28px 40px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, color: C.muted, flexWrap: "wrap", gap: 12 }}>
        <span>© 2026 TrueStar</span>
        <Link href="/roadmap" style={{ color: C.muted, textDecoration: "none" }}>Roadmap</Link>
        <Link href="/privacy" style={{ color: C.muted, textDecoration: "none" }}>Privacy Policy</Link>
      </footer>
    </>
  );
}
