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
};

const PERSONAS = [
  {
    id: "the-foodie",
    emoji: "🍽️",
    label: "The Foodie",
    tagline: "When the plate is everything",
    headline: "Find restaurants obsessed with food quality — not just hype",
    keywords: "best food quality restaurants, highest rated food near me, food lover restaurant finder",
    description:
      "You've walked out of a 4.8★ place because the pasta was from a box. Google rewards crowd-pleasing popularity, not culinary craft. The Foodie profile weights food quality at 70% so TrueStar surfaces the places that reviewers rave about for the actual cooking — not the Instagram-worthy décor or the attentive host.",
    howItHelps:
      "TrueStar's AI reads recent reviews and extracts a dedicated food-quality score separate from service, value, and vibe. Crank food to max and you'll find the hidden gems that serious eaters know about — the cramped 15-seat spot with the extraordinary handmade ramen, the strip-mall Thai place that regulars drive 40 minutes for.",
    weights: [
      { label: "Food Quality", value: 70, color: C.orange },
      { label: "Service", value: 10, color: C.amber },
      { label: "Value", value: 10, color: C.green },
      { label: "Ambiance", value: 10, color: "#3a9fd4" },
    ],
    tip: "Pair with a Google Maps search for \u2018authentic\u2019 or a specific cuisine to filter for intent, then let TrueStar re-rank by food quality.",
  },
  {
    id: "budget-traveler",
    emoji: "💸",
    label: "The Budget Traveler",
    tagline: "Maximum flavor, minimum spend",
    headline: "Stretch every dollar without sacrificing a great meal",
    keywords: "best cheap restaurants, best value restaurants near me, budget eats, affordable good food",
    description:
      "You're on the road, the per-diem is tight, and you're not about to waste it on a mediocre $22 burger just because TripAdvisor ranked it highly. Price/value is your north star: a place that charges fair prices and delivers what it promises beats a flashy restaurant any day of the week.",
    howItHelps:
      "Set Value to 60% and TrueStar surfaces the places where reviewers consistently say \u201cincredible for the price,\u201d \u201chuge portions,\u201d or \u201cbetter than restaurants twice as expensive.\u201d Perfect for travelers, students, and anyone who believes a great meal shouldn\u2019t require a special occasion budget.",
    weights: [
      { label: "Food Quality", value: 20, color: C.orange },
      { label: "Service", value: 10, color: C.amber },
      { label: "Value", value: 60, color: C.green },
      { label: "Ambiance", value: 10, color: "#3a9fd4" },
    ],
    tip: "Sort Google Maps results by distance or open now, then let TrueStar re-rank — your next great cheap eat is probably closer than you think.",
  },
  {
    id: "date-night",
    emoji: "🕯️",
    label: "Date Night",
    tagline: "The vibe has to be perfect",
    headline: "Find restaurants with the ambiance that sets the mood",
    keywords: "best date night restaurants, romantic restaurants near me, best ambiance restaurant, best vibe restaurant",
    description:
      "The food can be good \u2014 it needs to be \u2014 but the evening lives or dies on atmosphere. Soft lighting, a noise level you can actually have a conversation in, the kind of space that makes the night feel intentional. Google\u2019s star rating lumps all of this together with \u201cparking was easy\u201d and \u201cserver was nice,\u201d obscuring the places that truly nail the experience.",
    howItHelps:
      "With Ambiance at 55% and Food Quality at 35%, TrueStar re-ranks Google Maps results to float the restaurants reviewers describe as \u201cintimate,\u201d \u201cromantic,\u201d \u201cbeautiful space,\u201d or \u201cperfect for a special occasion.\u201d Skip the loud sports bar with great wings \u2014 this profile finds places worth dressing up for.",
    weights: [
      { label: "Food Quality", value: 35, color: C.orange },
      { label: "Service", value: 10, color: C.amber },
      { label: "Value", value: 0, color: C.green },
      { label: "Ambiance", value: 55, color: "#3a9fd4" },
    ],
    tip: "Search Google Maps for a neighbourhood you like, switch to the TrueStar Date Night profile, and browse the re-ranked list before making your reservation.",
  },
  {
    id: "business-lunch",
    emoji: "💼",
    label: "Business Lunch",
    tagline: "Close the deal, not just the tab",
    headline: "Reliable service and speed for meetings that matter",
    keywords: "best business lunch restaurants, professional lunch spots, quick service restaurants, power lunch near me",
    description:
      "You have 60 minutes, a client across the table, and absolutely no patience for a server who disappears for 20 minutes or a kitchen that takes 45 minutes for a salad. Attentive service and reasonable pacing aren't luxuries — they're requirements. Food should be solid, but the experience needs to be professional and predictable.",
    howItHelps:
      "TrueStar's Service score is built from review language about attentiveness, speed, accuracy, and professionalism. Weight Service at 50% and Food Quality at 40% and you'll surface the spots your colleagues trust: places where you'll be seated promptly, the order will be right, and you'll be back at your desk on time.",
    weights: [
      { label: "Food Quality", value: 40, color: C.orange },
      { label: "Service", value: 50, color: C.amber },
      { label: "Value", value: 5, color: C.green },
      { label: "Ambiance", value: 5, color: "#3a9fd4" },
    ],
    tip: "Check the restaurant's hours before you go — TrueStar works on any Google Maps restaurant result, so filter for 'open for lunch' and re-rank from there.",
  },
  {
    id: "family-dinner",
    emoji: "👨‍👩‍👧‍👦",
    label: "Family Dinner",
    tagline: "Everyone happy, budget intact",
    headline: "Kid-friendly restaurants that don't break the bank",
    keywords: "kid-friendly restaurants near me, family restaurants, best family dining, restaurants good for kids",
    description:
      "You're feeding four people including at least one who will only eat plain pasta and one who will spill their drink. You need: food that works for a range of palates, prices that don't require a second mortgage, and ideally a space where noise from your table isn't everyone else's problem. Google's reviews treat all of this equally with romantic dinner reviews — the scores get muddied.",
    howItHelps:
      "A 45% Value / 35% Food weighting surfaces the restaurants reviewers praise for being family-friendly \u2014 casual enough to relax in, large enough portions to satisfy everyone, and priced for a group order. TrueStar also picks up on review language about kids\u2019 menus, high chairs, and \u201cgreat for groups,\u201d so the AI score naturally reflects family-suitability.",
    weights: [
      { label: "Food Quality", value: 35, color: C.orange },
      { label: "Service", value: 15, color: C.amber },
      { label: "Value", value: 45, color: C.green },
      { label: "Ambiance", value: 5, color: "#3a9fd4" },
    ],
    tip: "Filter Google Maps for \u201cfamily-friendly\u201d or \u201ccasual dining,\u201d then apply the Family Dinner profile to find the places other parents swear by.",
  },
];

function WeightBar({ label, value, color }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.ink2 }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 900, color: color }}>{value}%</span>
      </div>
      <div style={{ height: 8, borderRadius: 4, background: C.border, overflow: "hidden" }}>
        <div
          style={{
            width: `${value}%`,
            height: "100%",
            background: color,
            borderRadius: 4,
            transition: "width 0.4s ease",
          }}
        />
      </div>
    </div>
  );
}

function PersonaCard({ persona, index }) {
  const isEven = index % 2 === 0;
  return (
    <section
      id={persona.id}
      style={{
        background: isEven ? C.white : C.cream,
        padding: "72px 24px",
        scrollMarginTop: 72,
      }}
    >
      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          display: "flex",
          gap: 64,
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        {/* Left: text */}
        <div style={{ flex: "1 1 380px", minWidth: 280 }}>
          {/* Label badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: C.cream,
              border: `1px solid ${C.border}`,
              borderRadius: 20,
              padding: "6px 14px",
              marginBottom: 20,
            }}
          >
            <span style={{ fontSize: 18 }}>{persona.emoji}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.ink2 }}>{persona.label}</span>
            <span style={{ fontSize: 12, color: C.muted }}>·</span>
            <span style={{ fontSize: 12, color: C.muted, fontStyle: "italic" }}>{persona.tagline}</span>
          </div>

          <h2
            style={{
              fontSize: 32,
              fontWeight: 900,
              lineHeight: 1.2,
              color: C.ink,
              marginBottom: 16,
            }}
          >
            {persona.headline}
          </h2>

          <p style={{ fontSize: 16, color: "#555", lineHeight: 1.75, marginBottom: 24 }}>
            {persona.description}
          </p>

          <h3 style={{ fontSize: 15, fontWeight: 900, color: C.ink, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>
            How TrueStar helps
          </h3>
          <p style={{ fontSize: 15, color: "#666", lineHeight: 1.7, marginBottom: 24 }}>
            {persona.howItHelps}
          </p>

          {/* Tip */}
          <div
            style={{
              background: "#FFF8EE",
              border: `1px solid #f0d8a0`,
              borderLeft: `4px solid ${C.amber}`,
              borderRadius: 6,
              padding: "12px 16px",
              fontSize: 13,
              color: C.ink2,
              lineHeight: 1.6,
            }}
          >
            <strong>💡 Pro tip:</strong> {persona.tip}
          </div>
        </div>

        {/* Right: weight card */}
        <div style={{ flex: "0 0 300px", minWidth: 260 }}>
          <div
            style={{
              background: C.white,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: "24px 24px 20px",
              boxShadow: "0 2px 16px rgba(56,48,31,0.07)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 20,
                paddingBottom: 14,
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              <span style={{ fontSize: 22 }}>{persona.emoji}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 900, color: C.ink }}>{persona.label} Profile</div>
                <div style={{ fontSize: 11, color: C.muted }}>Example TrueStar weight settings</div>
              </div>
            </div>

            {persona.weights.map((w) => (
              <WeightBar key={w.label} label={w.label} value={w.value} color={w.color} />
            ))}

            <div
              style={{
                marginTop: 20,
                paddingTop: 14,
                borderTop: `1px solid ${C.border}`,
                fontSize: 12,
                color: C.muted,
                lineHeight: 1.5,
              }}
            >
              Weights must total 100%. Adjust any time in the TrueStar extension popup.
            </div>
          </div>

          <a
            href="https://chromewebstore.google.com/detail/truestar/bondnchgjfoofjjdlmpkponeppngnolh"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              textAlign: "center",
              marginTop: 16,
              background: C.orange,
              color: C.white,
              padding: "13px 20px",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 14,
              textDecoration: "none",
            }}
          >
            Try this profile — Free
          </a>
        </div>
      </div>
    </section>
  );
}

export default function UseCases() {
  const pageUrl = "https://gettruestar.com/use-cases";
  const pageTitle = "TrueStar Use Cases — Find Restaurants for Every Occasion";
  const pageDesc =
    "Whether you're a foodie chasing quality, a budget traveler watching every dollar, planning a romantic date night, hosting a business lunch, or feeding the whole family — TrueStar re-weights Google Maps ratings to match your priorities.";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": pageTitle,
    "description": pageDesc,
    "url": pageUrl,
    "isPartOf": {
      "@type": "WebSite",
      "name": "TrueStar",
      "url": "https://gettruestar.com",
    },
    "about": {
      "@type": "SoftwareApplication",
      "name": "TrueStar",
      "applicationCategory": "BrowserApplication",
      "operatingSystem": "Chrome, Edge, Brave, Opera",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
      },
      "url": "https://gettruestar.com",
      "downloadUrl":
        "https://chromewebstore.google.com/detail/truestar/bondnchgjfoofjjdlmpkponeppngnolh",
    },
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "TrueStar Use Cases",
    "description": "Different ways to use TrueStar to find the perfect restaurant for your situation.",
    "url": pageUrl,
    "numberOfItems": PERSONAS.length,
    "itemListElement": PERSONAS.map((p, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": p.label,
      "description": p.description,
      "url": `${pageUrl}#${p.id}`,
    })),
  };

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta
          name="keywords"
          content="truestar use cases, restaurant finder chrome extension, find restaurants by food quality, romantic restaurant finder, best value restaurants, family restaurant finder, business lunch spots, personalized restaurant ratings"
        />
        <link rel="canonical" href={pageUrl} />

        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:image" content="https://gettruestar.com/icon128.png" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="TrueStar" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image" content="https://gettruestar.com/icon128.png" />

        {/* hreflang */}
        <link rel="alternate" hreflang="en" href={pageUrl} />
        <link rel="alternate" hreflang="x-default" href={pageUrl} />

        <link rel="icon" href="/icon128.png" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap"
          rel="stylesheet"
        />

        {/* JSON-LD: WebPage */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* JSON-LD: ItemList */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
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
        @media (max-width: 760px) {
          .persona-grid { flex-direction: column !important; gap: 32px !important; }
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
          {/* Inline SVG logo matching homepage */}
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
          <Link href="/use-cases" style={{ color: C.orange, textDecoration: "none", fontSize: 14, fontWeight: 700 }}>
            Use Cases
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
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
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
            <span>⚡</span>
            <span>One extension, every dining situation</span>
          </div>

          <h1
            style={{
              fontSize: 48,
              fontWeight: 900,
              lineHeight: 1.1,
              color: C.ink,
              marginBottom: 20,
              letterSpacing: -1,
            }}
          >
            The right restaurant<br />
            <span style={{ color: C.orange }}>for every occasion.</span>
          </h1>

          <p
            style={{
              fontSize: 18,
              color: "#555",
              lineHeight: 1.7,
              marginBottom: 36,
              maxWidth: 580,
              margin: "0 auto 36px",
            }}
          >
            Google rates every restaurant the same way — for everyone. TrueStar lets you re-weight what matters:{" "}
            <strong>food quality, service, value, and ambiance.</strong> Here&rsquo;s how different diners use it.
          </p>

          {/* Persona jump links */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              justifyContent: "center",
            }}
          >
            {PERSONAS.map((p) => (
              <a
                key={p.id}
                href={`#${p.id}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: C.white,
                  border: `1px solid ${C.border}`,
                  borderRadius: 20,
                  padding: "8px 16px",
                  fontSize: 13,
                  fontWeight: 700,
                  color: C.ink2,
                  textDecoration: "none",
                  transition: "border-color 0.15s",
                }}
              >
                <span>{p.emoji}</span>
                <span>{p.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Persona sections */}
      <main>
        {PERSONAS.map((persona, index) => (
          <PersonaCard key={persona.id} persona={persona} index={index} />
        ))}
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
          Stop letting Google pick your next meal.
        </h2>
        <p
          style={{
            fontSize: 18,
            opacity: 0.9,
            marginBottom: 36,
            maxWidth: 480,
            margin: "0 auto 36px",
            lineHeight: 1.6,
          }}
        >
          Set your weights once. TrueStar does the rest — on any restaurant on Google Maps, instantly, for free.
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
        <a href="/blog" style={{ color: C.muted, textDecoration: "none" }}>Blog</a>
        <a href="/privacy" style={{ color: C.muted, textDecoration: "none" }}>Privacy Policy</a>
      </footer>
    </>
  );
}
