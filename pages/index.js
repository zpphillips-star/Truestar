import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>TrueStar — Restaurant Ratings Built Around You</title>
        <meta name="description" content="TrueStar re-ranks Google Maps restaurants based on what YOU care about — food quality, service, value, vibe. Free Chrome extension." />
        <meta property="og:title" content="TrueStar — Restaurant Ratings Built Around You" />
        <meta property="og:description" content="Re-rank any restaurant on Google Maps based on your priorities. Food, service, value, vibe — you decide." />
        <meta property="og:image" content="/icon128.png" />
        <link rel="icon" href="/icon128.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Lato', -apple-system, BlinkMacSystemFont, sans-serif; background: #F4EFE6; color: #2D2D2D; }
        a { cursor: pointer; }
        a:hover { opacity: 0.88; }
      `}</style>

      <main>
        {/* Nav */}
        <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", borderBottom: "1px solid #E5DDD0", background: "#F4EFE6" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <polygon points="14,2 17.5,10.5 27,11 20,17.5 22.5,27 14,22 5.5,27 8,17.5 1,11 10.5,10.5" fill="#E63946" />
            </svg>
            <span style={{ fontWeight: 900, fontSize: 22, letterSpacing: -0.5 }}>TrueStar</span>
          </div>
          <a
            href="https://chromewebstore.google.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ background: "#E63946", color: "#fff", padding: "10px 22px", borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: "none" }}
          >
            Add to Chrome — Free
          </a>
        </nav>

        {/* Hero */}
        <section style={{ textAlign: "center", padding: "80px 24px 60px", maxWidth: 680, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #E5DDD0", borderRadius: 20, padding: "6px 16px", marginBottom: 28, fontSize: 13, color: "#666" }}>
            <span>🌟</span>
            <span>Free Chrome Extension</span>
          </div>

          <h1 style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.1, marginBottom: 20, letterSpacing: -1 }}>
            Restaurant ratings built<br />
            <span style={{ color: "#E63946" }}>around you.</span>
          </h1>

          <p style={{ fontSize: 19, color: "#555", lineHeight: 1.6, marginBottom: 36 }}>
            {"Google's 4.3★ means nothing if you care about vibe and they counted the parking reviews. TrueStar re-ranks any restaurant on Google Maps based on what "}
            <em>you</em>
            {" actually care about."}
          </p>

          <a
            href="https://chromewebstore.google.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-block", background: "#E63946", color: "#fff", padding: "16px 36px", borderRadius: 10, fontWeight: 700, fontSize: 17, textDecoration: "none", boxShadow: "0 4px 20px rgba(230,57,70,0.3)" }}
          >
            Add to Chrome — It&#39;s Free
          </a>

          <p style={{ marginTop: 14, fontSize: 13, color: "#999" }}>Works on Chrome, Edge, Brave &amp; Opera · No account needed</p>
        </section>

        {/* Demo visual */}
        <section style={{ background: "#fff", padding: "60px 24px", textAlign: "center" }}>
          <p style={{ fontSize: 13, color: "#aaa", marginBottom: 28, textTransform: "uppercase", letterSpacing: 1 }}>Set your weights. Get your score.</p>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <div style={{ background: "#F4EFE6", borderRadius: 16, padding: "40px 32px", border: "1px solid #E5DDD0" }}>
              <div style={{ display: "flex", justifyContent: "center", gap: 32, flexWrap: "wrap", marginBottom: 32 }}>
                {[
                  { label: "Food Quality", pct: 50, color: "#E63946" },
                  { label: "Service", pct: 20, color: "#F4A261" },
                  { label: "Value", pct: 20, color: "#2A9D8F" },
                  { label: "Vibe", pct: 10, color: "#457B9D" },
                ].map((c) => (
                  <div key={c.label} style={{ textAlign: "left", minWidth: 150 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13, fontWeight: 700 }}>
                      <span>{c.label}</span>
                      <span style={{ color: c.color }}>{c.pct}%</span>
                    </div>
                    <div style={{ height: 8, background: "#E5DDD0", borderRadius: 4 }}>
                      <div style={{ width: `${c.pct}%`, height: "100%", background: c.color, borderRadius: 4 }} />
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background: "#fff", borderRadius: 12, padding: "20px 32px", display: "inline-block", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
                <div style={{ fontSize: 13, color: "#999", marginBottom: 4 }}>Your TrueStar Score</div>
                <div style={{ fontSize: 48, fontWeight: 900, color: "#E63946", lineHeight: 1 }}>4.6 ★</div>
                <div style={{ fontSize: 12, color: "#aaa", marginTop: 6 }}>Google says 4.2 ★ — you care about food more</div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section style={{ padding: "72px 24px", maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 34, fontWeight: 900, marginBottom: 12 }}>How it works</h2>
          <p style={{ color: "#888", marginBottom: 48, fontSize: 16 }}>Three steps. Zero sign-up.</p>
          <div style={{ display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { n: "1", title: "Open Google Maps", body: "Browse restaurants like normal. TrueStar quietly activates on any Google Maps page." },
              { n: "2", title: "Set your priorities", body: "Dial in what matters to you — food, service, value, vibe. Weights must add up to 100%." },
              { n: "3", title: "Get your real score", body: "AI reads the freshest reviews and scores the restaurant your way. In seconds." },
            ].map((s) => (
              <div key={s.n} style={{ flex: "1 1 220px", maxWidth: 260, textAlign: "left" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#E63946", color: "#fff", fontWeight: 900, fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  {s.n}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ color: "#666", fontSize: 15, lineHeight: 1.6 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: "#E63946", color: "#fff", padding: "80px 24px", textAlign: "center" }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16 }}>Stop letting Google rate your dinner.</h2>
          <p style={{ fontSize: 18, opacity: 0.88, marginBottom: 36, maxWidth: 480, margin: "0 auto 36px" }}>
            TrueStar is free, private, and takes 30 seconds to install.
          </p>
          <a
            href="https://chromewebstore.google.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-block", background: "#fff", color: "#E63946", padding: "16px 40px", borderRadius: 10, fontWeight: 700, fontSize: 17, textDecoration: "none" }}
          >
            Add to Chrome — Free
          </a>
        </section>

        {/* Footer */}
        <footer style={{ padding: "28px 40px", borderTop: "1px solid #E5DDD0", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, color: "#aaa", flexWrap: "wrap", gap: 12, background: "#F4EFE6" }}>
          <span>© 2026 TrueStar</span>
          <span>gettruestar.com</span>
        </footer>
      </main>
    </>
  );
}
