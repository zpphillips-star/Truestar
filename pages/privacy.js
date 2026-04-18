import Head from "next/head";
import Link from "next/link";

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy — TrueStar</title>
        <link rel="icon" href="/icon128.png" />
      </Head>

      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #F4EFE6; color: #38301f; }
      `}</style>

      <main style={{ maxWidth: 700, margin: "0 auto", padding: "60px 24px" }}>
        <Link href="/" style={{ fontSize: 14, color: "#E8563A", textDecoration: "none" }}>← Back to TrueStar</Link>

        <h1 style={{ fontSize: 32, fontWeight: 900, marginTop: 32, marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ fontSize: 13, color: "#b0a898", marginBottom: 8 }}>Last updated: January 2026</p>
        <p style={{ fontSize: 13, color: "#b0a898", marginBottom: 40 }}>
          Extension:{" "}
          <a href="https://chromewebstore.google.com/detail/truestar/bondnchgjfoofjjdlmpkponeppngnolh" target="_blank" rel="noopener noreferrer" style={{ color: "#E8563A" }}>
            Chrome Web Store
          </a>
        </p>

        {[
          {
            heading: "What TrueStar collects",
            body: "TrueStar does not collect, store, or transmit any personally identifiable information. The extension reads publicly visible review text from Google Maps pages you visit and sends that text to our analysis API (truestar.vercel.app) solely to generate your personalized restaurant score. No user account, name, email, or location data is ever collected.",
          },
          {
            heading: "How your data is used",
            body: "Review text is sent to our server to be forwarded to an AI model (Anthropic Claude) for analysis. This text is not stored by TrueStar after the API response is returned. Your preference weights (food, service, value, vibe) are stored only in your browser's local extension storage and never leave your device.",
          },
          {
            heading: "Third-party services",
            body: "TrueStar uses Anthropic's Claude API to analyze reviews. Anthropic's privacy policy applies to data processed through their API. We do not use advertising networks, analytics services, or any other third-party trackers.",
          },
          {
            heading: "Permissions",
            body: "The extension requests access to google.com/maps to read review content on pages you visit, and storage permission to save your weight preferences locally. No browsing history, bookmarks, or other data is accessed.",
          },
          {
            heading: "Contact",
            body: "Questions about this policy? Email: privacy@gettruestar.com",
          },
        ].map((s) => (
          <section key={s.heading} style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, color: "#E8563A" }}>{s.heading}</h2>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "#6a5a3a" }}>{s.body}</p>
          </section>
        ))}
      </main>
    </>
  );
}
