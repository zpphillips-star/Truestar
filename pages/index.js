import { useState, useCallback, useEffect } from "react";
import { Logo } from "../components/Logo";
import StarSpinner from "../components/StarSpinner";
import { colors } from "../lib/brand";

const CATEGORIES = [
  { id: "food",     label: "Food Quality",  emoji: "🍽️", color: colors.red,    desc: "Taste, cooking, ingredients" },
  { id: "price",    label: "Price & Value", emoji: "💰", color: colors.forest, desc: "Worth the money, portions" },
  { id: "service",  label: "Service",       emoji: "🤝", color: "#1a4a8a",     desc: "Staff, attentiveness" },
  { id: "ambiance", label: "Ambiance",      emoji: "✨", color: colors.plum,   desc: "Vibe, decor, atmosphere" },
];

const DEFAULT_WEIGHTS = { food: 70, price: 30, service: 0, ambiance: 0 };

// Rating stars using the brand amber
function StarRow({ rating, size = 16, color = colors.amber }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((s) => {
        const pct = Math.min(1, Math.max(0, rating - (s - 1)));
        const id = `grad${s}${size}${color.replace(/[^a-z0-9]/gi, "")}`;
        return (
          <svg key={s} width={size} height={size} viewBox="0 0 20 20">
            <defs>
              <linearGradient id={id} x1="0" x2="1" y1="0" y2="0">
                <stop offset={`${pct * 100}%`} stopColor={color} />
                <stop offset={`${pct * 100}%`} stopColor="#ddd" />
              </linearGradient>
            </defs>
            <polygon
              points="10,1.5 12.6,7.2 18.9,7.8 14.2,12 15.8,18.2 10,14.8 4.2,18.2 5.8,12 1.1,7.8 7.4,7.2"
              fill={`url(#${id})`}
            />
          </svg>
        );
      })}
    </span>
  );
}

function WeightSlider({ cat, value, onChange }) {
  const active = value > 0;
  return (
    <div style={{
      padding: "14px 16px", borderRadius: 14,
      border: `2px solid ${active ? cat.color : colors.border}`,
      background: active ? cat.color + "0d" : colors.white,
      transition: "all 0.2s",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>{cat.emoji}</span>
          <div>
            <div style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: 14, color: active ? cat.color : colors.textMuted }}>{cat.label}</div>
            <div style={{ fontFamily: "sans-serif", fontSize: 11, color: colors.textMuted }}>{cat.desc}</div>
          </div>
        </div>
        <div style={{
          minWidth: 56, textAlign: "center", padding: "5px 12px",
          background: active ? cat.color : "#eee",
          borderRadius: 99,
          fontFamily: "sans-serif", fontWeight: 700, fontSize: 15,
          color: active ? "#fff" : "#bbb",
          transition: "all 0.2s",
          boxShadow: active ? `0 2px 8px ${cat.color}44` : "none",
        }}>{value}%</div>
      </div>
      <input
        type="range" min={0} max={100} step={5} value={value}
        onChange={(e) => onChange(cat.id, parseInt(e.target.value))}
        style={{ width: "100%", accentColor: cat.color, cursor: "pointer" }}
      />
      <div style={{ height: 5, borderRadius: 99, background: colors.tan, marginTop: 5, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${value}%`,
          background: active ? cat.color : "#ccc",
          borderRadius: 99, transition: "width 0.15s",
          boxShadow: active ? `0 0 6px ${cat.color}88` : "none",
        }} />
      </div>
    </div>
  );
}

function CollapsedStep({ label, summary, onEdit }) {
  return (
    <div style={{
      background: colors.white, borderRadius: 14,
      border: `1.5px solid ${colors.border}`,
      marginBottom: 10, padding: "12px 18px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      boxShadow: "0 1px 6px rgba(56,48,31,0.04)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{
          width: 24, height: 24, borderRadius: "50%",
          background: colors.forest, color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 700, fontFamily: "sans-serif", flexShrink: 0,
        }}>✓</span>
        <div>
          <div style={{ fontFamily: "sans-serif", fontSize: 11, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
          <div style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 600, color: colors.ink, marginTop: 1 }}>{summary}</div>
        </div>
      </div>
      <button onClick={onEdit} style={{
        background: "none", border: `1.5px solid ${colors.border}`, borderRadius: 8,
        padding: "5px 12px", fontFamily: "sans-serif", fontSize: 12,
        color: colors.textMuted, cursor: "pointer", fontWeight: 600, flexShrink: 0,
      }}>Edit</button>
    </div>
  );
}

// Score diff pill — bold use of green/red
function DiffBadge({ diff }) {
  if (diff === 0) return null;
  const up = diff > 0;
  return (
    <div style={{
      padding: "8px 16px", borderRadius: 99,
      background: up ? colors.forest : colors.red,
      fontFamily: "sans-serif", fontWeight: 700, fontSize: 17,
      color: "#fff",
      boxShadow: up ? `0 2px 12px ${colors.forest}66` : `0 2px 12px ${colors.red}66`,
      letterSpacing: "0.01em",
    }}>
      {up ? "+" : ""}{diff} ★
    </div>
  );
}

// Top match badge — uses plum for premium feel
function TopMatchBadge({ score }) {
  if (score < 4.5) return null;
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "4px 12px", borderRadius: 99,
      background: colors.badgeTopBg,
      border: `1px solid ${colors.plum}44`,
      fontFamily: "sans-serif", fontSize: 11, fontWeight: 700,
      color: colors.plum,
    }}>
      ★ Top match
    </div>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [weights, setWeights] = useState(() => {
    try {
      const saved = localStorage.getItem("ts_weights");
      return saved ? JSON.parse(saved) : DEFAULT_WEIGHTS;
    } catch { return DEFAULT_WEIGHTS; }
  });
  useEffect(() => {
    try { localStorage.setItem("ts_weights", JSON.stringify(weights)); } catch {}
  }, [weights]);
  const [stage, setStage] = useState("search");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showKept, setShowKept] = useState(false);
  const [showOmitted, setShowOmitted] = useState(false);
  const [showCalc, setShowCalc] = useState(false);
  const [error, setError] = useState(null);
  const [totalFlash, setTotalFlash] = useState(false);

  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  const activeWeightSummary = CATEGORIES.filter(c => weights[c.id] > 0).map(c => `${c.label} ${weights[c.id]}%`).join(" · ");

  const handleWeight = useCallback((id, newVal) => {
    setWeights((prev) => {
      const others = CATEGORIES.filter((c) => c.id !== id);
      const remaining = 100 - newVal;
      const currentOtherTotal = others.reduce((a, c) => a + prev[c.id], 0);
      const next = { ...prev, [id]: newVal };
      if (currentOtherTotal === 0) {
        const each = Math.floor(remaining / others.length);
        const leftover = remaining - each * others.length;
        others.forEach((c, i) => { next[c.id] = each + (i === 0 ? leftover : 0); });
      } else {
        let distributed = 0;
        others.forEach((c, i) => {
          if (i < others.length - 1) {
            const share = Math.round((prev[c.id] / currentOtherTotal) * remaining);
            next[c.id] = share;
            distributed += share;
          } else {
            next[c.id] = remaining - distributed;
          }
        });
      }
      Object.keys(next).forEach((k) => { if (next[k] < 0) next[k] = 0; });
      const newTotal = Object.values(next).reduce((a, b) => a + b, 0);
      if (newTotal === 100) {
        setTotalFlash(true);
        setTimeout(() => setTotalFlash(false), 600);
      }
      return next;
    });
  }, []);

  const searchRestaurants = async () => {
    if (!query || !location) return;
    setSearching(true);
    setError(null);
    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`);
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        setSearchResults(data.results.slice(0, 6));
        setStage("pick");
      } else {
        setError("No results found. Try a different search.");
      }
    } catch {
      setError("Search failed. Check your connection.");
    }
    setSearching(false);
  };

  const pickRestaurant = (r) => {
    setSelected(r);
    setStage("weights");
    setResult(null);
    setShowKept(false);
    setShowOmitted(false);
    setShowCalc(false);
  };

  const analyze = async () => {
    if (!selected || total !== 100) return;
    setLoading(true);
    setStage("result");
    setError(null);
    setShowKept(false);
    setShowOmitted(false);
    setShowCalc(false);

    try {
      const CACHE_TTL = 30 * 60 * 1000;
      const cacheKey = "ts_reviews_" + selected.place_id;
      let reviews;
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const { data, ts } = JSON.parse(cached);
          if (Date.now() - ts < CACHE_TTL) { reviews = data; }
        }
      } catch {}

      if (!reviews) {
        const revRes = await fetch(`/api/reviews?placeId=${selected.place_id}`);
        const revData = await revRes.json();
        if (!revRes.ok) throw new Error(revData.error || "Failed to fetch reviews");
        reviews = revData.result?.reviews || [];
        try {
          localStorage.setItem(cacheKey, JSON.stringify({ data: reviews, ts: Date.now() }));
        } catch {}
      }

      if (reviews.length === 0) {
        setResult({
          trueScore: selected.rating || 3,
          headline: "Not enough review data to analyze.",
          whyAdjusted: "No review text was available from Google for this restaurant.",
          keptSummary: "No reviews were available.",
          omittedSummary: "Nothing was omitted.",
          categoryScores: {}, categoryMentions: {},
          reviewTags: [], reviewsCounted: 0, reviewsExcluded: 0, _reviews: [],
        });
        setLoading(false);
        return;
      }

      const activeWeights = CATEGORIES.filter((c) => weights[c.id] > 0);
      const weightDesc = activeWeights.map((c) => `${c.label}: ${weights[c.id]}%`).join(", ");
      const reviewsText = reviews.map((r, i) => `Review ${i} (${r.rating} stars): "${r.text}"`).join("\n");

      const prompt = `You are TrueStar, a sharp but friendly restaurant rating analyzer. Speak casually, clearly, and specifically.

Restaurant: ${selected.name}
Official Google Rating: ${selected.rating} (${selected.user_ratings_total} total reviews)

Reviews:
${reviewsText}

User cares about (weights add to 100%):
${weightDesc}

Category definitions:
- food: taste, flavor, dishes, cooking, ingredients, freshness
- price: cost, value, expensive, cheap, portions, worth it
- service: staff, waiters, attentiveness, speed, hospitality
- ambiance: decor, atmosphere, vibe, noise, cleanliness, views

YOUR JOB:
1. Tag each review with which categories it mentions
2. A review COUNTS if it mentions at least one category the user cares about (weight > 0)
3. A review is OMITTED if it only talks about things the user doesn't care about (weight = 0)
4. For each active category, calculate the average star rating from reviews that mention it
5. TrueStar = weighted average using only active categories
6. Be specific. Mention real details from the reviews.

Return ONLY raw JSON (no markdown, no code blocks):
{
  "reviewTags": [{"index": 0, "categories": ["food","service"], "counted": true, "reason": "Counted because it mentions bland food and slow service"}],
  "categoryScores": {"food": 4.2, "price": 3.8, "service": null, "ambiance": null},
  "categoryMentions": {"food": 4, "price": 2, "service": 0, "ambiance": 0},
  "reviewsCounted": 4,
  "reviewsExcluded": 1,
  "trueScore": 4.1,
  "headline": "One punchy sentence about what the TrueStar score reveals",
  "whyAdjusted": "Specific explanation of why the score changed based on the user's weighted priorities",
  "keptSummary": "What the counted reviews mostly said and how they affected the score",
  "omittedSummary": "What the omitted reviews focused on and why they didn't matter for this user"
}`;

      const aiRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const aiData = await aiRes.json();
      if (!aiRes.ok) throw new Error(aiData.error || "AI analysis failed");

      const text = aiData.content?.find((b) => b.type === "text")?.text;
      if (!text) throw new Error("No text content returned from AI");

      let parsed;
      try {
        parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      } catch {
        throw new Error("AI returned invalid JSON");
      }

      const safeCategoryScores = parsed.categoryScores || {};
      const safeReviewTags = Array.isArray(parsed.reviewTags) ? parsed.reviewTags : [];

      let scoreSum = 0, weightSum = 0;
      activeWeights.forEach((c) => {
        const s = safeCategoryScores[c.id];
        if (s != null && !isNaN(Number(s))) {
          scoreSum += Number(s) * weights[c.id];
          weightSum += weights[c.id];
        }
      });

      const computedTrueScore = weightSum > 0 ? Math.round((scoreSum / weightSum) * 10) / 10 : selected.rating;

      setResult({
        reviewTags: safeReviewTags,
        categoryScores: safeCategoryScores,
        categoryMentions: parsed.categoryMentions || {},
        reviewsCounted: safeReviewTags.filter((t) => t.counted).length,
        reviewsExcluded: safeReviewTags.filter((t) => !t.counted).length,
        trueScore: computedTrueScore,
        headline: parsed.headline || "Here's your personalized TrueStar score.",
        whyAdjusted: parsed.whyAdjusted || "Score adjusted based on your priorities.",
        keptSummary: parsed.keptSummary || "Reviews matching your priorities were counted.",
        omittedSummary: parsed.omittedSummary || "Reviews about other topics were not counted.",
        _reviews: reviews,
      });
    } catch (e) {
      setError(`Analysis failed: ${e.message}`);
      setStage("weights");
    }
    setLoading(false);
  };

  const reset = () => {
    setQuery(""); setLocation(""); setSelected(null);
    setSearchResults([]); setStage("search");
    setResult(null); setWeights(DEFAULT_WEIGHTS);
    setShowKept(false); setShowOmitted(false); setShowCalc(false); setError(null);
  };

  const diff = result && selected ? +(result.trueScore - selected.rating).toFixed(1) : 0;

  const reviewsWithTags = result?._reviews?.map((review, index) => {
    const tag = result.reviewTags?.find((t) => Number(t.index) === index) || { index, categories: [], counted: true, reason: "" };
    return { review, index, tag };
  }) || [];

  const keptReviews = reviewsWithTags.filter((item) => item.tag.counted !== false);
  const omittedReviews = reviewsWithTags.filter((item) => item.tag.counted === false);

  const calcRows = result
    ? CATEGORIES.filter((c) => weights[c.id] > 0 && result.categoryScores?.[c.id] != null && !isNaN(Number(result.categoryScores[c.id]))).map((c) => {
        const score = Number(result.categoryScores[c.id]);
        const weight = weights[c.id];
        return { id: c.id, label: c.label, color: c.color, score, weight, contribution: (score * weight) / 100, mentions: result.categoryMentions?.[c.id] ?? null };
      })
    : [];

  const missingActiveCategories = result
    ? CATEGORIES.filter((c) => weights[c.id] > 0 && (result.categoryScores?.[c.id] == null || isNaN(Number(result.categoryScores?.[c.id]))))
    : [];

  const isResult = stage === "result";

  // Page bg shifts subtly by stage
  const pageBg = isResult ? "#ede8de" : stage === "weights" ? "#f0ece3" : colors.cream;

  return (
    <div style={{ minHeight: "100vh", background: pageBg, display: "flex", flexDirection: "column", alignItems: "center", transition: "background 0.6s ease" }}>
      <style>{`
        * { box-sizing: border-box; }
        input[type=range] { height: 4px; }
        .step-card { transition: all 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes flashGreen { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        .total-flash { animation: flashGreen 0.5s ease; }
        button:hover { opacity: 0.88; }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ paddingTop: 48, paddingBottom: 6, textAlign: "center" }}>
        <Logo size={32} starColor={colors.amber} textColor={colors.ink} gap={14} />
        <p style={{ margin: "8px 0 0", fontFamily: "sans-serif", fontSize: 11, color: colors.textMuted, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 300 }}>
          Your preferences. Your rating.
        </p>
      </div>

      <div style={{ width: "100%", maxWidth: 540, padding: "24px 18px 60px" }}>

        {error && (
          <div style={{ background: colors.badgePoorBg, border: `1.5px solid ${colors.red}`, borderRadius: 12, padding: "12px 16px", marginBottom: 16, fontFamily: "sans-serif", fontSize: 14, color: colors.red, animation: "fadeIn 0.3s ease" }}>
            {error}
          </div>
        )}

        {/* ── STEP 1: Search ── */}
        {isResult ? (
          <CollapsedStep label="Restaurant" summary={selected?.name}
            onEdit={() => { setStage("search"); setResult(null); setSearchResults([]); setSelected(null); setQuery(""); setLocation(""); }} />
        ) : (
          <div className="step-card" style={{
            background: colors.white, borderRadius: 20,
            boxShadow: "0 2px 16px rgba(56,48,31,0.06)",
            border: `2px solid ${stage === "search" ? colors.red : colors.border}`,
            marginBottom: 14,
          }}>
            <div style={{ padding: "18px 22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span style={{ width: 26, height: 26, borderRadius: "50%", background: stage === "search" ? colors.red : colors.ink, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, fontFamily: "sans-serif", flexShrink: 0 }}>
                  {stage !== "search" ? "✓" : "1"}
                </span>
                <span style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: 15, color: colors.ink }}>Find a restaurant</span>
              </div>
              <input value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="Restaurant name (e.g. Nobu, Shake Shack)"
                style={{ width: "100%", padding: "12px 14px", border: `1.5px solid ${colors.border}`, borderRadius: 10, fontSize: 14, fontFamily: "sans-serif", background: colors.cream, outline: "none", marginBottom: 10 }} />
              <input value={location} onChange={(e) => setLocation(e.target.value)}
                placeholder="City or neighborhood (e.g. Seattle, Brooklyn)"
                onKeyDown={(e) => e.key === "Enter" && searchRestaurants()}
                style={{ width: "100%", padding: "12px 14px", border: `1.5px solid ${colors.border}`, borderRadius: 10, fontSize: 14, fontFamily: "sans-serif", background: colors.cream, outline: "none", marginBottom: 12 }} />
              <button onClick={searchRestaurants} disabled={searching || !query || !location}
                style={{ width: "100%", padding: "13px", background: !query || !location ? "#ddd" : colors.ink, color: "#fff", border: "none", borderRadius: 10, fontFamily: "sans-serif", fontSize: 14, fontWeight: 700, cursor: !query || !location ? "not-allowed" : "pointer", transition: "opacity 0.15s" }}>
                {searching ? "Searching..." : "Search Restaurants"}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Pick ── */}
        {isResult ? (
          <CollapsedStep label="Selected" summary={`${selected?.name} · ${selected?.rating}★ official`}
            onEdit={() => { setStage("pick"); setResult(null); }} />
        ) : (
          (stage === "pick" || stage === "weights") && searchResults.length > 0 && (
            <div className="step-card" style={{
              background: colors.white, borderRadius: 20,
              boxShadow: "0 2px 16px rgba(56,48,31,0.06)",
              border: `2px solid ${stage === "pick" ? colors.red : colors.border}`,
              marginBottom: 14, animation: "fadeIn 0.3s ease",
            }}>
              <div style={{ padding: "18px 22px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <span style={{ width: 26, height: 26, borderRadius: "50%", background: stage === "pick" ? colors.red : colors.ink, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, fontFamily: "sans-serif", flexShrink: 0 }}>
                    {stage !== "pick" ? "✓" : "2"}
                  </span>
                  <span style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: 15, color: colors.ink }}>Pick a restaurant</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {searchResults.map((r) => (
                    <div key={r.place_id} onClick={() => pickRestaurant(r)}
                      style={{ padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${selected?.place_id === r.place_id ? colors.red : colors.border}`, background: selected?.place_id === r.place_id ? "#fdf5f4" : colors.cream, cursor: "pointer", transition: "all 0.15s" }}>
                      <div style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: 14, color: colors.ink }}>{r.name}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                        <StarRow rating={r.rating || 0} size={13} color={colors.amber} />
                        {/* Rating number in amber */}
                        <span style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 700, color: colors.amber }}>{r.rating}</span>
                        <span style={{ fontFamily: "sans-serif", fontSize: 12, color: colors.textMuted }}>· {r.user_ratings_total?.toLocaleString()} reviews</span>
                      </div>
                      <div style={{ fontFamily: "sans-serif", fontSize: 12, color: colors.textMuted, marginTop: 2 }}>{r.formatted_address}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        )}

        {/* ── STEP 3: Weights ── */}
        {isResult ? (
          <CollapsedStep label="Your priorities" summary={activeWeightSummary}
            onEdit={() => { setStage("weights"); setResult(null); }} />
        ) : (
          (stage === "weights") && selected && (
            <div className="step-card" style={{
              background: colors.white, borderRadius: 20,
              boxShadow: "0 2px 16px rgba(56,48,31,0.06)",
              border: `2px solid ${colors.red}`,
              marginBottom: 14, animation: "fadeIn 0.3s ease",
            }}>
              <div style={{ padding: "18px 22px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <span style={{ width: 26, height: 26, borderRadius: "50%", background: colors.red, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, fontFamily: "sans-serif", flexShrink: 0 }}>3</span>
                  <span style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: 15, color: colors.ink }}>Set your priorities</span>
                  {/* Total pill — flashes green when 100% hit */}
                  <div
                    className={totalFlash ? "total-flash" : ""}
                    style={{
                      marginLeft: "auto", padding: "5px 14px", borderRadius: 99,
                      background: total === 100 ? colors.forest : colors.badgePoorBg,
                      border: `1.5px solid ${total === 100 ? colors.forest : colors.red}`,
                      fontFamily: "sans-serif", fontWeight: 700, fontSize: 13,
                      color: total === 100 ? "#fff" : colors.red,
                      transition: "all 0.3s ease",
                      boxShadow: total === 100 ? `0 2px 10px ${colors.forest}55` : "none",
                    }}>
                    {total}% {total === 100 ? "✓" : ""}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
                  {CATEGORIES.map((cat) => (
                    <WeightSlider key={cat.id} cat={cat} value={weights[cat.id]} onChange={handleWeight} />
                  ))}
                </div>
                <button onClick={analyze} disabled={total !== 100}
                  style={{ width: "100%", padding: "14px", background: total !== 100 ? "#ddd" : colors.red, color: "#fff", border: "none", borderRadius: 12, fontFamily: "sans-serif", fontSize: 15, fontWeight: 700, cursor: total !== 100 ? "not-allowed" : "pointer", letterSpacing: "0.02em", transition: "all 0.2s", boxShadow: total === 100 ? `0 4px 16px ${colors.red}44` : "none" }}>
                  {total !== 100 ? `Adjust to 100% (${total}% now)` : "Get My TrueStar Rating →"}
                </button>
              </div>
            </div>
          )
        )}

        {/* ── STEP 4: Result ── */}
        {stage === "result" && (
          <div style={{ background: colors.white, borderRadius: 20, boxShadow: "0 4px 32px rgba(56,48,31,0.10)", border: `2px solid ${colors.border}`, overflow: "hidden", animation: "fadeIn 0.4s ease" }}>
            {loading ? (
              <div style={{ padding: "60px 24px", textAlign: "center" }}>
                <StarSpinner size={56} color={colors.amber} label="Reading reviews with your priorities in mind…" />
              </div>
            ) : result ? (
              <>
                {/* ── Score Header — ink dark surface ── */}
                <div style={{ background: colors.ink, padding: "28px 26px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                    <div>
                      <h2 style={{ margin: "0 0 3px", fontFamily: "sans-serif", fontSize: 22, color: "#fff", fontWeight: 700 }}>{selected?.name}</h2>
                      <div style={{ fontFamily: "sans-serif", fontSize: 11, color: "#666" }}>{selected?.formatted_address}</div>
                    </div>
                    {/* Top match badge — plum, only for 4.5+ */}
                    <TopMatchBadge score={result.trueScore} />
                  </div>

                  <div style={{ display: "flex", alignItems: "center" }}>
                    {/* Google rating */}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "sans-serif", fontSize: 10, color: "#666", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>Google</div>
                      <div style={{ fontFamily: "sans-serif", fontSize: 32, color: "#888", fontWeight: 700, lineHeight: 1 }}>{selected?.rating?.toFixed(1)}</div>
                      <div style={{ marginTop: 5 }}><StarRow rating={selected?.rating || 0} size={13} color="#666" /></div>
                      <div style={{ fontFamily: "sans-serif", fontSize: 11, color: "#555", marginTop: 4 }}>{selected?.user_ratings_total?.toLocaleString()} reviews</div>
                    </div>

                    {/* Diff badge — bold color */}
                    <div style={{ padding: "0 16px" }}>
                      <DiffBadge diff={diff} />
                    </div>

                    {/* TrueStar score — amber, glowing */}
                    <div style={{ flex: 1, textAlign: "right" }}>
                      <div style={{ fontFamily: "sans-serif", fontSize: 10, color: colors.amber, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>TrueStar</div>
                      <div style={{ fontFamily: "sans-serif", fontSize: 44, color: colors.amber, fontWeight: 700, lineHeight: 1, textShadow: `0 0 20px ${colors.amber}66` }}>
                        {result.trueScore?.toFixed(1)}
                      </div>
                      <div style={{ marginTop: 5 }}><StarRow rating={result.trueScore || 0} size={15} color={colors.amber} /></div>
                      <div style={{ fontFamily: "sans-serif", fontSize: 11, color: "#666", marginTop: 4 }}>{result.reviewsCounted} reviews counted</div>
                    </div>
                  </div>
                </div>

                {/* Headline */}
                <div style={{ padding: "20px 24px 16px", borderBottom: `1px solid ${colors.border}`, background: "#faf7f2" }}>
                  <p style={{ margin: 0, fontFamily: "sans-serif", fontSize: 15, color: colors.ink, fontStyle: "italic", lineHeight: 1.7 }}>"{result.headline}"</p>
                </div>

                {/* Why it changed */}
                <div style={{ padding: "16px 24px 0" }}>
                  <div style={{ padding: "14px 16px", borderRadius: 12, background: colors.cream, border: `1.5px solid ${colors.border}`, marginBottom: 10 }}>
                    <div style={{ fontFamily: "sans-serif", fontSize: 11, fontWeight: 700, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                      Why your score {diff < 0 ? "dropped" : diff > 0 ? "rose" : "stayed the same"}
                    </div>
                    <div style={{ fontFamily: "sans-serif", fontSize: 13, color: colors.textSecondary, lineHeight: 1.65 }}>{result.whyAdjusted}</div>
                  </div>
                </div>

                {/* Kept / Omitted — bold green and red */}
                <div style={{ padding: "0 24px" }}>
                  <div style={{ padding: "14px 16px", borderRadius: 12, background: colors.badgeGreatBg, border: `2px solid ${colors.forest}`, marginBottom: 10 }}>
                    <div style={{ fontFamily: "sans-serif", fontSize: 11, fontWeight: 700, color: colors.forest, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                      ✅ {result.reviewsCounted} review{result.reviewsCounted !== 1 ? "s" : ""} counted
                    </div>
                    <div style={{ fontFamily: "sans-serif", fontSize: 13, color: colors.ink, lineHeight: 1.65 }}>{result.keptSummary}</div>
                  </div>

                  <div style={{ padding: "14px 16px", borderRadius: 12, background: colors.badgePoorBg, border: `2px solid ${colors.red}`, marginBottom: 16 }}>
                    <div style={{ fontFamily: "sans-serif", fontSize: 11, fontWeight: 700, color: colors.red, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                      🚫 {result.reviewsExcluded} review{result.reviewsExcluded !== 1 ? "s" : ""} omitted
                    </div>
                    <div style={{ fontFamily: "sans-serif", fontSize: 13, color: colors.ink, lineHeight: 1.65 }}>{result.omittedSummary}</div>
                  </div>
                </div>

                {/* Calculation */}
                <div style={{ padding: "0 24px 12px" }}>
                  <button onClick={() => setShowCalc(!showCalc)} style={{ width: "100%", padding: "10px 14px", background: colors.cream, border: `1.5px solid ${colors.border}`, borderRadius: 10, fontFamily: "sans-serif", fontSize: 13, color: colors.ink, cursor: "pointer", fontWeight: 600, textAlign: "left" }}>
                    {showCalc ? "▲" : "▼"} How your TrueStar was calculated
                  </button>
                  {showCalc && (
                    <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                      {calcRows.map((row) => (
                        <div key={row.id} style={{ padding: "12px 14px", borderRadius: 10, background: colors.white, border: `1.5px solid ${row.color}44` }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <div style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: 13, color: row.color }}>{row.label}</div>
                            <div style={{ fontFamily: "sans-serif", fontSize: 12, color: colors.textMuted }}>{row.mentions != null ? `${row.mentions} mention${row.mentions === 1 ? "" : "s"}` : ""}</div>
                          </div>
                          <div style={{ fontFamily: "sans-serif", fontSize: 13, color: colors.textSecondary }}>
                            {row.score.toFixed(1)} × {row.weight}% = <strong style={{ color: row.color }}>{row.contribution.toFixed(2)}</strong>
                          </div>
                          {/* Mini bar */}
                          <div style={{ height: 4, borderRadius: 99, background: colors.tan, marginTop: 8, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${(row.score / 5) * 100}%`, background: row.color, borderRadius: 99 }} />
                          </div>
                        </div>
                      ))}
                      <div style={{ padding: "14px 16px", borderRadius: 10, background: colors.ink, color: "#fff" }}>
                        <div style={{ fontFamily: "sans-serif", fontSize: 11, color: colors.amber, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>TrueStar Score</div>
                        <div style={{ fontFamily: "sans-serif", fontSize: 28, fontWeight: 700, color: colors.amber }}>
                          {result.trueScore.toFixed(1)}
                        </div>
                      </div>
                      {missingActiveCategories.length > 0 && (
                        <div style={{ padding: "10px 12px", borderRadius: 10, background: colors.badgeOkayBg, border: `1px solid ${colors.amber}88`, fontFamily: "sans-serif", fontSize: 12, color: colors.badgeOkayText, lineHeight: 1.6 }}>
                          Not enough review evidence for: <strong>{missingActiveCategories.map((c) => c.label).join(", ")}</strong>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Kept reviews */}
                <div style={{ padding: "0 24px 10px" }}>
                  {keptReviews.length > 0 && (
                    <div style={{ marginBottom: 8 }}>
                      <button onClick={() => setShowKept(!showKept)} style={{ width: "100%", padding: "10px 14px", background: colors.badgeGreatBg, border: `1.5px solid ${colors.forest}`, borderRadius: 10, fontFamily: "sans-serif", fontSize: 13, color: colors.forest, cursor: "pointer", fontWeight: 600, textAlign: "left" }}>
                        {showKept ? "▲" : "▼"} Dig into the {keptReviews.length} review{keptReviews.length === 1 ? "" : "s"} that counted
                      </button>
                      {showKept && (
                        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
                          {keptReviews.map(({ review, index, tag }) => (
                            <div key={index} style={{ padding: "12px 14px", borderRadius: 10, background: colors.white, border: `1px solid ${colors.forest}33` }}>
                              <StarRow rating={review.rating} size={13} color={colors.amber} />
                              <p style={{ margin: "8px 0 0", fontFamily: "sans-serif", fontSize: 13, color: colors.textSecondary, lineHeight: 1.6 }}>{review.text}</p>
                              {tag?.reason && <div style={{ marginTop: 6, fontFamily: "sans-serif", fontSize: 12, color: colors.forest, fontWeight: 600 }}>Why it counted: {tag.reason}</div>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Omitted reviews */}
                  {omittedReviews.length > 0 && (
                    <div style={{ marginBottom: 8 }}>
                      <button onClick={() => setShowOmitted(!showOmitted)} style={{ width: "100%", padding: "10px 14px", background: colors.badgePoorBg, border: `1.5px solid ${colors.red}`, borderRadius: 10, fontFamily: "sans-serif", fontSize: 13, color: colors.red, cursor: "pointer", fontWeight: 600, textAlign: "left" }}>
                        {showOmitted ? "▲" : "▼"} See the {omittedReviews.length} review{omittedReviews.length === 1 ? "" : "s"} that didn't count
                      </button>
                      {showOmitted && (
                        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
                          {omittedReviews.map(({ review, index, tag }) => (
                            <div key={index} style={{ padding: "12px 14px", borderRadius: 10, background: "#fdf5f5", border: `1px solid ${colors.red}33` }}>
                              <StarRow rating={review.rating} size={13} color="#ccc" />
                              <p style={{ margin: "8px 0 0", fontFamily: "sans-serif", fontSize: 13, color: colors.textMuted, lineHeight: 1.6 }}>{review.text}</p>
                              {tag?.reason && <div style={{ marginTop: 6, fontFamily: "sans-serif", fontSize: 12, color: colors.red, fontWeight: 600 }}>Why omitted: {tag.reason}</div>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ padding: "8px 24px 24px", display: "flex", gap: 10 }}>
                  <button onClick={() => { setStage("weights"); setResult(null); }} style={{ flex: 1, padding: "12px", background: colors.white, border: `1.5px solid ${colors.border}`, borderRadius: 10, fontFamily: "sans-serif", fontSize: 13, color: colors.textMuted, cursor: "pointer", fontWeight: 600 }}>← Adjust weights</button>
                  <button onClick={reset} style={{ flex: 1, padding: "12px", background: colors.ink, border: "none", borderRadius: 10, fontFamily: "sans-serif", fontSize: 13, color: "#fff", cursor: "pointer", fontWeight: 600 }}>New search →</button>
                </div>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}


