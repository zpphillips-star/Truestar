import Head from "next/head";
import Link from "next/link";

const C = {
  cream: "#F4EFE6",
  ink: "#38301f",
  ink2: "#6a5a3a",
  muted: "#aaa",
  border: "#E5DDD0",
  white: "#FFFFFF",
  orange: "#E8563A",
  amber: "#E7A545",
  green: "#189E01",
  navy: "#1a2540",
};

const PROBLEMS = [
  {
    id: "everyone-rates-differently",
    number: "01",
    emoji: "🌐",
    problem: "Everyone rates differently — and averages hide that",
    problemDetail:
      "One reviewer gives 5 stars because the waiter was friendly. Another gives 3 stars because the parking was hard. A third drops 2 stars over a slow Friday night they happened to visit. Google's overall rating folds all of this into a single number — 3.8★ — that tells you almost nothing about the actual experience you'll have.",
    fix: "TrueStar reads the text of recent reviews and extracts separate dimension scores — food quality, service, price/value, and ambiance — from what reviewers actually wrote. The crowd can't hide behind a vague average.",
    fixEmoji: "✅",
  },
  {
    id: "no-context-for-you",
    number: "02",
    emoji: "🎯",
    problem: "There's no context for what matters to YOU",
    problemDetail:
      "Google's 4.2★ looks the same whether you care about a romantic atmosphere, a quick power lunch, or the best bowl of ramen in the city. The rating was not built with your priorities in mind — it was built for everyone, which means it's really built for no one in particular.",
    fix: "Before TrueStar shows you a score, you tell it your priorities: maybe food quality is 70% of what matters, ambiance 20%, and value 10%. Every score on the map is then re-calculated specifically for you — a 3.9★ place with extraordinary food can outrank a 4.6★ crowd-pleaser.",
    fixEmoji: "✅",
  },
  {
    id: "no-way-to-filter",
    number: "03",
    emoji: "🔧",
    problem: "No way to filter by YOUR priorities",
    problemDetail:
      "Even if you know that Google's rating is imperfect, there's no dial to turn. You can filter by price range or distance, but you cannot tell Google Maps \"show me places where the food quality reviews are exceptional, even if the service is mediocre.\" The system doesn't expose that granularity.",
    fix: "TrueStar overlays a live re-ranked score on every result as you browse Google Maps. Slide Food Quality to max, drop Service and Ambiance, and watch the map re-sort in real time. You're not picking from a static list — you're actively filtering by what you care about.",
    fixEmoji: "✅",
  },
];

const COMPARE_ROWS = [
  { feature: "Shows an overall star rating", google: true, truestar: true },
  { feature: "Scores for food quality specifically", google: false, truestar: true },
  { feature: "Scores for service, value & ambiance", google: false, truestar: true },
  { feature: "You set the weights that matter to you", google: false, truestar: true },
  { feature: "Re-ranks results based on your priorities", google: false, truestar: true },
  { feature: "Works on existing Google Maps interface", google: false, truestar: true },
  { feature: "Free to use", google: true, truestar: true },
  { feature: "No account required", google: true, truestar: true },
];

const FAQ = [
  {
    q: "Why are Google Maps ratings sometimes misleading?",
    a: "Google Maps ratings average all reviewer opinions into one number regardless of what those reviewers valued. Someone who cares only about atmosphere and someone who cares only about food quality both contribute equally to the same 1-5 star score, which obscures the signal you actually need.",
  },
  {
    q: "Is TrueStar a replacement for Google Maps?",
    a: "No — TrueStar is a Chrome extension that works on top of Google Maps. You keep all the map features, search, photos, and hours you already rely on. TrueStar adds a second layer: a personalised rating score alongside the default one.",
  },
  {
    q: "How does TrueStar calculate its scores?",
    a: "TrueStar's AI reads recent review text and extracts separate dimension scores for food quality, service, price/value, and ambiance. It then applies the weights you set in the extension popup to calculate a personalised overall score for each restaurant.",
  },
  {
    q: "Do I need to create an account?",
    a: "No account is needed. Install the extension, set your priority weights once in the popup, and TrueStar immediately starts re-scoring every restaurant you browse on Google Maps.",
  },
  {
    q: "Which browsers does TrueStar support?",
    a: "TrueStar works on any Chromium-based browser: Google Chrome, Microsoft Edge, Brave, and Opera.",
  },
];

export default function Compare() {
  const pageUrl = "https://gettruestar.com/compare";
  const pageTitle = "TrueStar vs. Default Google Maps Ratings";
  const pageDesc =
    "Google Maps gives every restaurant a single 1-5 star average that ignores what matters to you. TrueStar fixes that with personalised scores for food quality, service, value, and ambiance — free Chrome extension.";

  const jsonLdWebPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: pageTitle,
    description: pageDesc,
    url: pageUrl,
    isPartOf: {
      "@type": "WebSite",
      name: "TrueStar",
      url: "https://gettruestar.com",
    },
    about: {
      "@type": "SoftwareApplication",
      name: "TrueStar",
      applicationCategory: "BrowserApplication",
      operatingSystem: "Chrome, Edge, Brave, Opera",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      url: "https://gettruestar.com",
      downloadUrl:
        "https://chromewebstore.google.com/detail/truestar/bondnchgjfoofjjdlmpkponeppngnolh",
    },
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://gettruestar.com" },
      { "@type": "ListItem", position: 2, name: "Compare", item: pageUrl },
    ],
  };

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta
          name="keywords"
          content="google maps ratings not accurate, better way to find restaurants than google maps, google maps alternative restaurant ratings, personalised restaurant ratings, truestar vs google maps, google maps star rating problems, restaurant rating chrome extension"
        />
        <link rel="canonical" href={pageUrl} />

        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:image" content="https://gettruestar.com/og-compare.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="TrueStar" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image" content="https://gettruestar.com/og-compare.png" />

        {/* hreflang */}
        <link rel="alternate" hreflang="en" href={pageUrl} />
        <link rel="alternate" hreflang="x-default" href={pageUrl} />

        <link rel="icon" href="/icon128.png" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap"
          rel="stylesheet"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebPage) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
        />
      </Head>

      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Lato', -apple-system, BlinkMacSystemFont, sans-serif; background: ${C.cream}; color: ${C.ink}; }
        a { cursor: pointer; }
        a:hover { opacity: 0.88; }
        @media (max-width: 600px) {
          nav { padding: 16px 20px !important; }
          .nav-links { display: none !important; }
          .nav-cta { display: none !important; }
        }
        @media (max-width: 800px) {
          .compare-table th, .compare-table td { font-size: 13px !important; padding: 10px 12px !important; }
          .problem-grid { flex-direction: column !important; }
        }
      `}</style>

      {/* Nav */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 40px",
          borderBottom: `1px solid ${C.border}`,
          background: C.cream,
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <Link href="/" style={{ textDecoration: "none" }}>
          <svg width="160" height="20" viewBox="0 0 789.7 100" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 57.47,0.00 L 54.41,1.53 L 42.91,37.55 L 3.45,44.06 L 0.00,46.74 L 2.30,49.04 L 26.82,56.32 L 36.78,61.30 L 37.16,65.90 L 30.27,95.79 L 31.42,100.00 L 56.32,75.86 L 60.54,76.25 L 73.56,86.59 L 91.19,96.17 L 92.34,92.34 L 79.31,62.84 L 78.93,57.85 L 109.58,35.63 L 108.05,32.95 L 69.73,34.48 Z"
              fill="#E7A545"
            />
            <g transform="translate(127.6,0)" fill="#38301f">
              <path d="M 22.5,0.0 L 19.5,2.4 L 17.8,7.7 L 13.0,16.6 L 6.5,23.1 L 0.0,27.8 L 0.0,31.4 L 2.4,33.1 L 10.7,33.1 L 13.0,36.7 L 13.6,68.0 L 12.4,82.8 L 15.4,91.1 L 18.9,94.7 L 24.3,97.6 L 33.7,98.2 L 46.2,92.9 L 48.5,90.5 L 48.5,87.6 L 46.7,85.8 L 43.8,85.8 L 37.3,88.8 L 31.4,88.2 L 27.8,85.2 L 26.0,81.7 L 24.9,76.9 L 24.9,37.3 L 26.0,34.3 L 27.8,33.1 L 45.0,32.5 L 46.7,30.8 L 46.7,26.0 L 44.4,24.3 L 28.4,24.3 L 26.0,21.9 L 25.4,16.6 L 26.6,11.8 L 26.6,2.4 L 25.4,0.6 Z" fillRule="evenodd"/>
              <path d="M 95.3,23.7 L 87.6,29.0 L 82.2,31.4 L 79.9,33.7 L 79.9,36.7 L 81.7,38.5 L 85.2,39.6 L 88.2,42.6 L 89.3,45.6 L 89.9,55.0 L 88.8,66.9 L 89.9,72.2 L 89.9,83.4 L 88.8,88.2 L 86.4,90.5 L 80.5,91.7 L 79.3,93.5 L 79.3,95.9 L 81.7,97.6 L 100.6,97.0 L 111.8,97.6 L 114.2,96.4 L 114.8,93.5 L 111.8,91.1 L 107.7,91.1 L 104.1,89.9 L 101.8,86.4 L 101.2,72.2 L 102.4,64.5 L 101.2,58.0 L 101.2,47.9 L 104.1,42.0 L 108.3,37.9 L 111.8,36.1 L 116.0,36.1 L 122.5,39.6 L 129.0,39.1 L 132.0,35.5 L 132.5,30.2 L 128.4,24.9 L 125.4,23.7 L 121.9,23.7 L 113.0,27.2 L 104.7,34.3 L 102.4,34.3 L 100.6,32.5 L 100.0,25.4 L 98.2,23.7 Z" fillRule="evenodd"/>
              <path d="M 161.5,28.4 L 162.1,32.0 L 168.6,34.3 L 172.2,40.2 L 173.4,81.7 L 176.3,89.3 L 179.3,92.9 L 187.6,97.6 L 194.7,98.2 L 204.7,95.3 L 217.2,88.2 L 219.5,88.2 L 221.3,90.5 L 221.9,96.4 L 223.7,98.2 L 229.0,98.2 L 243.2,91.1 L 243.8,88.2 L 242.0,86.4 L 236.7,85.8 L 233.7,82.8 L 232.5,79.3 L 232.0,63.9 L 233.1,55.6 L 232.0,35.5 L 234.3,28.4 L 232.0,24.9 L 210.7,24.9 L 208.3,26.6 L 207.7,28.4 L 210.1,31.4 L 216.0,32.5 L 219.5,36.7 L 221.3,73.4 L 219.5,78.7 L 216.6,81.7 L 207.7,87.0 L 201.8,88.2 L 192.3,86.4 L 188.8,83.4 L 185.8,78.1 L 184.0,51.5 L 185.2,30.2 L 184.0,25.4 L 178.1,23.7 L 173.4,25.4 L 164.5,26.0 Z" fillRule="evenodd"/>
              <path d="M 298.8,23.1 L 292.9,24.9 L 287.6,27.8 L 278.1,36.7 L 274.0,43.2 L 269.8,55.6 L 269.8,66.3 L 271.6,74.0 L 277.5,85.8 L 284.0,92.3 L 291.7,97.0 L 301.2,99.4 L 310.1,99.4 L 318.3,96.4 L 324.9,92.3 L 330.2,86.4 L 330.2,81.7 L 326.6,82.2 L 321.9,87.0 L 315.4,89.9 L 305.3,90.5 L 298.2,88.2 L 294.7,85.8 L 287.0,76.9 L 283.4,66.3 L 283.4,58.6 L 286.4,56.2 L 290.5,55.6 L 326.0,55.6 L 328.4,55.0 L 330.8,52.7 L 330.8,47.9 L 329.6,42.6 L 326.6,36.1 L 320.7,29.6 L 310.7,24.3 L 305.9,23.1 Z M 317.8,41.4 L 317.8,45.0 L 317.2,46.2 L 314.2,49.1 L 313.0,49.7 L 310.1,50.3 L 289.9,50.3 L 287.6,49.7 L 286.4,49.1 L 285.2,47.9 L 284.6,46.2 L 285.2,43.2 L 288.2,37.9 L 294.1,32.0 L 296.4,30.8 L 300.6,29.6 L 304.7,29.6 L 308.9,30.8 L 312.4,33.1 L 314.8,35.5 L 316.0,37.3 Z" fillRule="evenodd"/>
              <path d="M 383.4,23.7 L 373.4,27.2 L 368.0,32.0 L 364.5,39.1 L 363.9,48.5 L 365.7,53.3 L 370.4,59.2 L 375.1,62.7 L 392.9,70.4 L 398.8,75.7 L 400.0,78.7 L 400.0,85.2 L 397.0,89.9 L 394.7,91.7 L 389.9,93.5 L 385.2,93.5 L 379.3,91.7 L 365.7,77.5 L 362.7,79.3 L 362.7,84.0 L 364.5,93.5 L 367.5,97.0 L 375.7,97.0 L 383.4,99.4 L 390.5,99.4 L 398.8,96.4 L 404.1,92.3 L 408.3,85.8 L 410.1,76.3 L 407.1,66.3 L 401.8,60.4 L 393.5,55.6 L 380.5,50.9 L 375.1,46.2 L 373.4,41.4 L 374.0,36.7 L 378.7,31.4 L 381.7,30.2 L 388.2,30.2 L 391.7,31.4 L 403.0,43.2 L 404.7,43.2 L 406.5,41.4 L 404.7,29.6 L 402.4,26.0 L 395.9,26.0 Z" fillRule="evenodd"/>
              <path d="M 463.3,0.0 L 460.9,2.4 L 455.6,14.8 L 447.9,23.1 L 441.4,27.8 L 441.4,30.8 L 444.4,33.1 L 452.1,33.1 L 454.4,36.1 L 455.0,68.0 L 453.8,82.8 L 455.0,87.6 L 456.8,91.1 L 462.1,95.9 L 467.5,98.2 L 475.1,98.2 L 485.8,94.1 L 489.9,90.5 L 490.5,88.8 L 488.8,85.8 L 485.8,85.8 L 478.7,88.8 L 475.1,88.8 L 471.0,87.0 L 467.5,81.7 L 466.3,76.9 L 466.3,36.7 L 466.9,34.9 L 469.2,33.1 L 485.2,33.1 L 488.2,30.2 L 488.2,26.6 L 485.8,24.3 L 473.4,24.9 L 469.8,24.3 L 467.5,21.9 L 466.9,17.2 L 468.0,13.0 L 468.0,2.4 L 466.3,0.0 Z" fillRule="evenodd"/>
              <path d="M 527.8,29.0 L 522.5,33.1 L 520.1,36.7 L 519.5,43.2 L 521.9,46.2 L 530.2,46.2 L 534.3,42.6 L 537.3,34.9 L 540.2,32.0 L 548.5,30.2 L 552.7,31.4 L 557.4,36.1 L 559.8,46.2 L 559.2,53.3 L 556.2,56.2 L 538.5,62.7 L 532.0,63.9 L 524.9,68.0 L 520.1,72.8 L 518.3,76.9 L 518.3,85.8 L 520.7,91.1 L 526.6,96.4 L 534.9,99.4 L 547.3,96.4 L 558.6,89.9 L 560.4,90.5 L 562.7,94.1 L 568.0,98.2 L 575.7,97.6 L 582.8,92.3 L 584.6,89.9 L 584.6,87.6 L 583.4,86.4 L 578.7,88.2 L 574.0,88.2 L 571.0,84.0 L 570.4,38.5 L 566.3,29.6 L 561.5,25.4 L 555.0,23.1 L 545.6,23.1 L 539.1,24.3 Z M 557.4,62.1 L 558.6,63.3 L 559.2,65.1 L 559.2,79.9 L 558.6,81.7 L 557.4,82.8 L 557.4,83.4 L 553.3,87.0 L 550.3,88.8 L 547.3,89.9 L 544.4,90.5 L 541.4,90.5 L 539.6,89.9 L 536.1,88.2 L 534.3,86.4 L 533.1,84.6 L 532.5,82.8 L 532.5,76.9 L 533.1,75.1 L 534.9,72.8 L 537.3,70.4 L 539.6,68.6 L 546.2,65.1 L 553.8,62.1 L 556.2,61.5 Z" fillRule="evenodd"/>
              <path d="M 623.7,23.7 L 616.0,29.0 L 610.7,31.4 L 608.3,33.7 L 608.3,36.7 L 610.1,38.5 L 615.4,40.8 L 617.8,44.4 L 618.3,46.7 L 617.8,66.9 L 618.9,73.4 L 618.3,86.4 L 616.0,89.9 L 609.5,91.7 L 608.3,92.9 L 608.3,95.9 L 610.1,97.6 L 640.8,97.6 L 643.2,95.9 L 643.8,94.1 L 643.2,92.9 L 640.8,91.1 L 636.7,91.1 L 633.1,89.9 L 631.4,88.2 L 630.2,84.0 L 630.8,60.4 L 629.6,54.4 L 630.2,46.7 L 633.1,41.4 L 640.8,36.1 L 645.0,36.1 L 651.5,39.6 L 658.0,39.1 L 660.9,34.9 L 661.5,30.8 L 660.4,27.8 L 657.4,24.9 L 654.4,23.7 L 650.9,23.7 L 642.0,27.2 L 633.1,34.3 L 630.8,34.3 L 629.0,32.0 L 629.0,26.6 L 627.8,24.3 Z" fillRule="evenodd"/>
            </g>
          </svg>
        </Link>

        <div style={{ display: "flex", gap: 16, alignItems: "center" }} className="nav-links">
          <Link href="/use-cases" style={{ color: C.ink2, textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
            Use Cases
          </Link>
          <Link href="/compare" style={{ color: C.orange, textDecoration: "none", fontSize: 14, fontWeight: 700 }}>
            Compare
          </Link>
          <a href="/blog" style={{ color: C.ink2, textDecoration: "none", fontSize: 14, fontWeight: 600 }}>Blog</a>
          <a href="/roadmap" style={{ color: C.ink2, textDecoration: "none", fontSize: 14, fontWeight: 600 }}>Roadmap</a>
          <a
            href="https://chromewebstore.google.com/detail/truestar/bondnchgjfoofjjdlmpkponeppngnolh"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-cta"
            style={{
              background: C.orange,
              color: C.white,
              padding: "10px 22px",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 14,
              textDecoration: "none",
            }}
          >
            Add to Browser — Free
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          textAlign: "center",
          padding: "72px 24px 56px",
          background: C.cream,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" style={{ marginBottom: 24, fontSize: 13, color: C.muted }}>
            <Link href="/" style={{ color: C.muted, textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>›</span>
            <span style={{ color: C.ink2 }}>Compare</span>
          </nav>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: C.white,
              border: `1px solid ${C.border}`,
              borderRadius: 20,
              padding: "6px 16px",
              fontSize: 13,
              color: "#666",
              marginBottom: 24,
            }}
          >
            <span>⚖️</span>
            <span>An honest comparison</span>
          </div>

          <h1
            style={{
              fontSize: 46,
              fontWeight: 900,
              lineHeight: 1.1,
              color: C.ink,
              marginBottom: 20,
              letterSpacing: -1,
            }}
          >
            TrueStar vs.{" "}
            <span style={{ color: C.orange }}>Default Google Maps Ratings</span>
          </h1>

          <p
            style={{
              fontSize: 18,
              color: "#555",
              lineHeight: 1.7,
              marginBottom: 36,
              maxWidth: 600,
              margin: "0 auto 36px",
            }}
          >
            A single 1–5 star average sounds useful. In practice, it collapses the opinions of thousands of strangers — with different tastes, priorities, and expectations — into one number that means almost nothing for your specific situation. Here's exactly why that fails, and how TrueStar fixes it.
          </p>
        </div>
      </section>

      {/* Problems & Fixes */}
      <main>
        {PROBLEMS.map((item, index) => (
          <section
            key={item.id}
            id={item.id}
            style={{
              padding: "72px 40px",
              borderBottom: `1px solid ${C.border}`,
              background: index % 2 === 0 ? C.cream : C.white,
            }}
          >
            <div
              className="problem-grid"
              style={{
                maxWidth: 960,
                margin: "0 auto",
                display: "flex",
                gap: 64,
                alignItems: "flex-start",
                flexWrap: "wrap",
              }}
            >
              {/* Problem column */}
              <div style={{ flex: "1 1 380px", minWidth: 280 }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "#fff0ee",
                    border: `1px solid #f5c4bc`,
                    borderRadius: 20,
                    padding: "6px 14px",
                    marginBottom: 20,
                    fontSize: 12,
                    fontWeight: 700,
                    color: C.orange,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  <span>{item.emoji}</span>
                  <span>Problem {item.number}</span>
                </div>

                <h2
                  style={{
                    fontSize: 26,
                    fontWeight: 900,
                    lineHeight: 1.25,
                    color: C.ink,
                    marginBottom: 16,
                  }}
                >
                  {item.problem}
                </h2>

                <p style={{ fontSize: 16, color: "#555", lineHeight: 1.75 }}>
                  {item.problemDetail}
                </p>
              </div>

              {/* Fix column */}
              <div style={{ flex: "1 1 380px", minWidth: 280 }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "#edf8ea",
                    border: `1px solid #b8e8b2`,
                    borderRadius: 20,
                    padding: "6px 14px",
                    marginBottom: 20,
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#0f7a00",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  <span>{item.fixEmoji}</span>
                  <span>How TrueStar fixes it</span>
                </div>

                <div
                  style={{
                    background: C.white,
                    border: `1px solid ${C.border}`,
                    borderLeft: `4px solid ${C.amber}`,
                    borderRadius: 8,
                    padding: "24px 24px 20px",
                    boxShadow: "0 2px 16px rgba(56,48,31,0.06)",
                  }}
                >
                  <p style={{ fontSize: 16, color: C.ink, lineHeight: 1.75 }}>
                    {item.fix}
                  </p>
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* Comparison Table */}
        <section
          style={{
            padding: "72px 40px",
            borderBottom: `1px solid ${C.border}`,
            background: C.cream,
          }}
        >
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <h2
              style={{
                fontSize: 32,
                fontWeight: 900,
                textAlign: "center",
                color: C.ink,
                marginBottom: 8,
              }}
            >
              Side by side
            </h2>
            <p
              style={{
                textAlign: "center",
                fontSize: 16,
                color: "#666",
                marginBottom: 40,
                lineHeight: 1.6,
              }}
            >
              TrueStar doesn&rsquo;t replace Google Maps. It upgrades the rating layer.
            </p>

            <div style={{ overflowX: "auto" }}>
              <table
                className="compare-table"
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  background: C.white,
                  borderRadius: 12,
                  overflow: "hidden",
                  boxShadow: "0 2px 20px rgba(56,48,31,0.08)",
                  fontSize: 15,
                }}
              >
                <thead>
                  <tr style={{ background: C.navy }}>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "16px 24px",
                        color: C.white,
                        fontWeight: 700,
                        fontSize: 14,
                      }}
                    >
                      Feature
                    </th>
                    <th
                      style={{
                        textAlign: "center",
                        padding: "16px 20px",
                        color: "#ccc",
                        fontWeight: 700,
                        fontSize: 14,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Google Maps alone
                    </th>
                    <th
                      style={{
                        textAlign: "center",
                        padding: "16px 20px",
                        color: C.amber,
                        fontWeight: 900,
                        fontSize: 14,
                        whiteSpace: "nowrap",
                      }}
                    >
                      + TrueStar
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map((row, i) => (
                    <tr
                      key={row.feature}
                      style={{
                        background: i % 2 === 0 ? C.white : "#fdfaf5",
                        borderBottom: `1px solid ${C.border}`,
                      }}
                    >
                      <td style={{ padding: "14px 24px", color: C.ink, fontWeight: 500 }}>
                        {row.feature}
                      </td>
                      <td style={{ textAlign: "center", padding: "14px 20px", fontSize: 18 }}>
                        {row.google ? (
                          <span style={{ color: C.green }}>✓</span>
                        ) : (
                          <span style={{ color: "#ccc" }}>—</span>
                        )}
                      </td>
                      <td style={{ textAlign: "center", padding: "14px 20px", fontSize: 18 }}>
                        {row.truestar ? (
                          <span style={{ color: C.green }}>✓</span>
                        ) : (
                          <span style={{ color: "#ccc" }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p style={{ textAlign: "center", fontSize: 13, color: C.muted, marginTop: 20 }}>
              TrueStar is a free Chrome extension. No account, no subscription.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section
          style={{
            padding: "72px 40px",
            background: C.white,
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <h2
              style={{
                fontSize: 32,
                fontWeight: 900,
                color: C.ink,
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              Common questions
            </h2>
            <p
              style={{
                textAlign: "center",
                fontSize: 16,
                color: "#666",
                marginBottom: 48,
                lineHeight: 1.6,
              }}
            >
              Straight answers about what TrueStar does and doesn&rsquo;t do.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {FAQ.map((item) => (
                <div
                  key={item.q}
                  style={{
                    background: C.cream,
                    border: `1px solid ${C.border}`,
                    borderRadius: 10,
                    padding: "24px 28px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: 17,
                      fontWeight: 900,
                      color: C.ink,
                      marginBottom: 10,
                      lineHeight: 1.3,
                    }}
                  >
                    {item.q}
                  </h3>
                  <p style={{ fontSize: 15, color: "#555", lineHeight: 1.7 }}>{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Bottom CTA */}
      <section
        style={{
          background: C.orange,
          color: C.white,
          padding: "80px 24px",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16 }}>
          Ready for ratings that actually mean something to you?
        </h2>
        <p
          style={{
            fontSize: 18,
            opacity: 0.9,
            marginBottom: 36,
            maxWidth: 500,
            margin: "0 auto 36px",
            lineHeight: 1.6,
          }}
        >
          Install TrueStar in 30 seconds and start seeing personalised scores on every restaurant in Google Maps — instantly, for free.
        </p>
        <a
          href="https://chromewebstore.google.com/detail/truestar/bondnchgjfoofjjdlmpkponeppngnolh"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            background: C.white,
            color: C.orange,
            padding: "16px 40px",
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 17,
            textDecoration: "none",
          }}
        >
          Add to Your Browser — Free
        </a>
        <p style={{ marginTop: 14, fontSize: 13, opacity: 0.7 }}>
          Works on Chrome, Edge, Brave &amp; Opera · No account needed
        </p>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: "28px 40px",
          borderTop: `1px solid ${C.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 13,
          color: C.muted,
          flexWrap: "wrap",
          gap: 12,
          background: C.cream,
        }}
      >
        <span>© 2026 TrueStar</span>
        <span>gettruestar.com</span>
        <Link href="/use-cases" style={{ color: C.muted, textDecoration: "none" }}>Use Cases</Link>
        <Link href="/compare" style={{ color: C.muted, textDecoration: "none" }}>Compare</Link>
        <a href="/blog" style={{ color: C.muted, textDecoration: "none" }}>Blog</a>
        <a href="/privacy" style={{ color: C.muted, textDecoration: "none" }}>Privacy Policy</a>
      </footer>
    </>
  );
}
