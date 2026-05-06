import Head from "next/head";
import { useState } from "react";
import Link from "next/link";

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
        <svg width="140" height="18" viewBox="0 0 789.7 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M 57.47,0.00 L 54.41,1.53 L 42.91,37.55 L 3.45,44.06 L 0.00,46.74 L 2.30,49.04 L 26.82,56.32 L 36.78,61.30 L 37.16,65.90 L 30.27,95.79 L 31.42,100.00 L 56.32,75.86 L 60.54,76.25 L 73.56,86.59 L 91.19,96.17 L 92.34,92.34 L 79.31,62.84 L 78.93,57.85 L 109.58,35.63 L 108.05,32.95 L 69.73,34.48 Z" fill="#E7A545"/>
          <g transform="translate(127.6,0)" fill="#38301f">
            <path d="M 22.5,0.0 L 19.5,2.4 L 17.8,7.7 L 13.0,16.6 L 6.5,23.1 L 0.0,27.8 L 0.0,31.4 L 2.4,33.1 L 10.7,33.1 L 13.0,36.7 L 13.6,68.0 L 12.4,82.8 L 15.4,91.1 L 18.9,94.7 L 24.3,97.6 L 33.7,98.2 L 46.2,92.9 L 48.5,90.5 L 48.5,87.6 L 46.7,85.8 L 43.8,85.8 L 37.3,88.8 L 31.4,88.2 L 27.8,85.2 L 26.0,81.7 L 24.9,76.9 L 24.9,37.3 L 26.0,34.3 L 27.8,33.1 L 45.0,32.5 L 46.7,30.8 L 46.7,26.0 L 44.4,24.3 L 28.4,24.3 L 26.0,21.9 L 25.4,16.6 L 26.6,11.8 L 26.6,2.4 L 25.4,0.6 Z" fillRule="evenodd"/>
          </g>
        </svg>
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
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (title.trim().length < 3) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/feature-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
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
