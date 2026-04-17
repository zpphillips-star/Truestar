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
            <img src="data:image/png;base64,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" width="32" height="32" alt="TrueStar logo" style={{borderRadius:4}} />
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
            <img src="data:image/png;base64,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" width="16" height="16" alt="" style={{borderRadius:2}} />
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

