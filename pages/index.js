import { useState, useCallback } from "react";

const CATEGORIES = [
  { id: "food", label: "Food Quality", emoji: "🍽️", color: "#c0392b", desc: "Taste, cooking, ingredients" },
  { id: "price", label: "Price & Value", emoji: "💰", color: "#1a6e3c", desc: "Worth the money, portions" },
  { id: "service", label: "Service", emoji: "🤝", color: "#1a4a8a", desc: "Staff, attentiveness" },
  { id: "ambiance", label: "Ambiance", emoji: "✨", color: "#7b3fa0", desc: "Vibe, decor, atmosphere" },
];

const DEFAULT_WEIGHTS = { food: 70, price: 30, service: 0, ambiance: 0 };

function StarRow({ rating, size = 16, color = "#d4a017" }) {
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
            <polygon points="10,1.5 12.6,7.2 18.9,7.8 14.2,12 15.8,18.2 10,14.8 4.2,18.2 5.8,12 1.1,7.8 7.4,7.2" fill={`url(#${id})`} />
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
      border: `2px solid ${active ? cat.color + "55" : "#e8e4de"}`,
      background: active ? cat.color + "07" : "#faf9f7",
      transition: "all 0.2s",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>{cat.emoji}</span>
          <div>
            <div style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 14, color: active ? cat.color : "#777" }}>{cat.label}</div>
            <div style={{ fontFamily: "sans-serif", fontSize: 11, color: "#aaa" }}>{cat.desc}</div>
          </div>
        </div>
        <div style={{
          minWidth: 52, textAlign: "center", padding: "4px 10px",
          background: active ? cat.color : "#eee", borderRadius: 99,
          fontFamily: "sans-serif", fontWeight: 700, fontSize: 15,
          color: active ? "#fff" : "#bbb", transition: "all 0.2s",
        }}>{value}%</div>
      </div>
      <input type="range" min={0} max={100} step={5} value={value}
        onChange={(e) => onChange(cat.id, parseInt(e.target.value))}
        style={{ width: "100%", accentColor: cat.color, cursor: "pointer" }} />
      <div style={{ height: 4, borderRadius: 99, background: "#e0dbd5", marginTop: 4, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${value}%`, background: active ? cat.color : "#ccc", borderRadius: 99, transition: "width 0.15s" }} />
      </div>
    </div>
  );
}

// Collapsed summary pill shown when a step is done and result is showing
function CollapsedStep({ num, label, summary, onEdit }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 14,
      border: "1.5px solid #e8e4de",
      marginBottom: 10, padding: "12px 18px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{
          width: 24, height: 24, borderRadius: "50%",
          background: "#1a1a1a", color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 700, fontFamily: "sans-serif", flexShrink: 0,
        }}>✓</span>
        <div>
          <div style={{ fontFamily: "sans-serif", fontSize: 11, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
          <div style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 600, color: "#1a1a1a", marginTop: 1 }}>{summary}</div>
        </div>
      </div>
      <button onClick={onEdit} style={{
        background: "none", border: "1.5px solid #e0dbd4", borderRadius: 8,
        padding: "5px 12px", fontFamily: "sans-serif", fontSize: 12,
        color: "#888", cursor: "pointer", fontWeight: 600, flexShrink: 0,
      }}>Edit</button>
    </div>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [weights, setWeights] = useState(DEFAULT_WEIGHTS);
  const [stage, setStage] = useState("search");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showKept, setShowKept] = useState(false);
  const [showOmitted, setShowOmitted] = useState(false);
  const [showCalc, setShowCalc] = useState(false);
  const [error, setError] = useState(null);

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
      const revRes = await fetch(`/api/reviews?placeId=${selected.place_id}`);
      const revData = await revRes.json();
      if (!revRes.ok) throw new Error(revData.error || "Failed to fetch reviews");

      const reviews = revData.result?.reviews || [];

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

  return (
    <div style={{ minHeight: "100vh", background: "#f7f4ef", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <style>{`
        * { box-sizing: border-box; }
        input[type=range] { height: 4px; }
        .step-card { transition: all 0.3s ease; }
        @keyframes spin { from { transform: rotate(0) } to { transform: rotate(360deg) } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>

      {/* Header */}
      <div style={{ paddingTop: 48, paddingBottom: 6, textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
          <svg width="26" height="26" viewBox="0 0 28 28">
            <polygon points="14,2 17,10 26,10.5 19.5,16.5 21.8,25.5 14,21 6.2,25.5 8.5,16.5 2,10.5 11,10" fill="none" stroke="#c0392b" strokeWidth="1.8" />
            <polygon points="14,7 16,12.5 21.5,13 17,17 18.5,22.5 14,19.5 9.5,22.5 11,17 6.5,13 12,12.5" fill="#c0392b" opacity="0.2" />
          </svg>
          <span style={{ fontFamily: "Georgia, serif", fontSize: 28, fontWeight: 700, color: "#1a1a1a", letterSpacing: "-0.02em" }}>TrueStar</span>
        </div>
        <p style={{ margin: "6px 0 0", fontFamily: "sans-serif", fontSize: 13, color: "#9a9690", letterSpacing: "0.04em" }}>Your preferences. Your rating.</p>
      </div>

      <div style={{ width: "100%", maxWidth: 540, padding: "24px 18px 60px" }}>

        {error && (
          <div style={{ background: "#fde8e8", border: "1.5px solid #c0392b", borderRadius: 12, padding: "12px 16px", marginBottom: 16, fontFamily: "sans-serif", fontSize: 14, color: "#c0392b", animation: "fadeIn 0.3s ease" }}>
            {error}
          </div>
        )}

        {/* ── STEP 1: Search ── */}
        {isResult ? (
          <CollapsedStep
            num={1} label="Restaurant"
            summary={selected?.name}
            onEdit={() => { setStage("search"); setResult(null); setSearchResults([]); setSelected(null); setQuery(""); setLocation(""); }}
          />
        ) : (
          <div className="step-card" style={{
            background: "#fff", borderRadius: 20,
            boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
            border: `2px solid ${stage === "search" ? "#c0392b" : "#ece9e4"}`,
            marginBottom: 14,
          }}>
            <div style={{ padding: "18px 22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span style={{ width: 26, height: 26, borderRadius: "50%", background: stage === "search" ? "#c0392b" : "#1a1a1a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, fontFamily: "sans-serif", flexShrink: 0 }}>
                  {stage !== "search" ? "✓" : "1"}
                </span>
                <span style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: 15, color: "#1a1a1a" }}>Find a restaurant</span>
              </div>
              <input value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="Restaurant name (e.g. Nobu, Shake Shack)"
                style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #e0dbd5", borderRadius: 10, fontSize: 14, fontFamily: "sans-serif", background: "#faf9f7", outline: "none", marginBottom: 10 }} />
              <input value={location} onChange={(e) => setLocation(e.target.value)}
                placeholder="City or neighborhood (e.g. Seattle, Brooklyn)"
                onKeyDown={(e) => e.key === "Enter" && searchRestaurants()}
                style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #e0dbd5", borderRadius: 10, fontSize: 14, fontFamily: "sans-serif", background: "#faf9f7", outline: "none", marginBottom: 12 }} />
              <button onClick={searchRestaurants} disabled={searching || !query || !location}
                style={{ width: "100%", padding: "13px", background: !query || !location ? "#ddd" : "#1a1a1a", color: "#fff", border: "none", borderRadius: 10, fontFamily: "sans-serif", fontSize: 14, fontWeight: 700, cursor: !query || !location ? "not-allowed" : "pointer" }}>
                {searching ? "Searching..." : "Search Restaurants"}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Pick ── */}
        {isResult ? (
          <CollapsedStep
            num={2} label="Selected"
            summary={`${selected?.name} · ${selected?.rating}★ official`}
            onEdit={() => { setStage("pick"); setResult(null); }}
          />
        ) : (
          (stage === "pick" || stage === "weights") && searchResults.length > 0 && (
            <div className="step-card" style={{
              background: "#fff", borderRadius: 20,
              boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
              border: `2px solid ${stage === "pick" ? "#c0392b" : "#ece9e4"}`,
              marginBottom: 14, animation: "fadeIn 0.3s ease",
            }}>
              <div style={{ padding: "18px 22px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <span style={{ width: 26, height: 26, borderRadius: "50%", background: stage === "pick" ? "#c0392b" : "#1a1a1a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, fontFamily: "sans-serif", flexShrink: 0 }}>
                    {stage !== "pick" ? "✓" : "2"}
                  </span>
                  <span style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: 15, color: "#1a1a1a" }}>Pick a restaurant</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {searchResults.map((r) => (
                    <div key={r.place_id} onClick={() => pickRestaurant(r)}
                      style={{ padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${selected?.place_id === r.place_id ? "#c0392b" : "#e8e4de"}`, background: selected?.place_id === r.place_id ? "#fdf5f4" : "#faf9f7", cursor: "pointer", transition: "all 0.15s" }}>
                      <div style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: 14, color: "#1a1a1a" }}>{r.name}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                        <StarRow rating={r.rating || 0} size={12} color="#d4a017" />
                        <span style={{ fontFamily: "sans-serif", fontSize: 12, color: "#888" }}>{r.rating} · {r.user_ratings_total?.toLocaleString()} reviews</span>
                      </div>
                      <div style={{ fontFamily: "sans-serif", fontSize: 12, color: "#aaa", marginTop: 2 }}>{r.formatted_address}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        )}

        {/* ── STEP 3: Weights ── */}
        {isResult ? (
          <CollapsedStep
            num={3} label="Your priorities"
            summary={activeWeightSummary}
            onEdit={() => { setStage("weights"); setResult(null); }}
          />
        ) : (
          (stage === "weights") && selected && (
            <div className="step-card" style={{
              background: "#fff", borderRadius: 20,
              boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
              border: `2px solid #c0392b`,
              marginBottom: 14, animation: "fadeIn 0.3s ease",
            }}>
              <div style={{ padding: "18px 22px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <span style={{ width: 26, height: 26, borderRadius: "50%", background: "#c0392b", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, fontFamily: "sans-serif", flexShrink: 0 }}>3</span>
                  <span style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: 15, color: "#1a1a1a" }}>Set your priorities</span>
                  <div style={{ marginLeft: "auto", padding: "4px 12px", borderRadius: 99, background: total === 100 ? "#1a6e3c15" : "#c0392b15", border: `1.5px solid ${total === 100 ? "#1a6e3c" : "#c0392b"}`, fontFamily: "sans-serif", fontWeight: 700, fontSize: 13, color: total === 100 ? "#1a6e3c" : "#c0392b" }}>
                    {total}% {total === 100 ? "✓" : ""}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
                  {CATEGORIES.map((cat) => (
                    <WeightSlider key={cat.id} cat={cat} value={weights[cat.id]} onChange={handleWeight} />
                  ))}
                </div>
                <button onClick={analyze} disabled={total !== 100}
                  style={{ width: "100%", padding: "14px", background: total !== 100 ? "#ddd" : "#c0392b", color: "#fff", border: "none", borderRadius: 12, fontFamily: "sans-serif", fontSize: 15, fontWeight: 700, cursor: total !== 100 ? "not-allowed" : "pointer", letterSpacing: "0.02em", transition: "background 0.2s" }}>
                  {total !== 100 ? `Adjust to 100% (${total}% now)` : "Get My TrueStar Rating →"}
                </button>
              </div>
            </div>
          )
        )}

        {/* ── STEP 4: Result ── */}
        {stage === "result" && (
          <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 4px 32px rgba(0,0,0,0.10)", border: "2px solid #ece9e4", overflow: "hidden", animation: "fadeIn 0.4s ease" }}>
            {loading ? (
              <div style={{ padding: "60px 24px", textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 14, display: "inline-block", animation: "spin 1.2s linear infinite" }}>⭐</div>
                <p style={{ fontFamily: "Georgia, serif", color: "#888", fontSize: 16, margin: 0, fontStyle: "italic" }}>Reading reviews with your priorities in mind…</p>
              </div>
            ) : result ? (
              <>
                {/* Score Header */}
                <div style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)", padding: "28px 26px" }}>
                  <h2 style={{ margin: "0 0 4px", fontFamily: "Georgia, serif", fontSize: 22, color: "#fff", fontWeight: 700 }}>{selected?.name}</h2>
                  <div style={{ fontFamily: "sans-serif", fontSize: 11, color: "#666", marginBottom: 24 }}>{selected?.formatted_address}</div>

                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "sans-serif", fontSize: 10, color: "#666", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>Google Rating</div>
                      <div style={{ fontFamily: "Georgia, serif", fontSize: 34, color: "#888", fontWeight: 700, lineHeight: 1 }}>{selected?.rating?.toFixed(1)}</div>
                      <div style={{ marginTop: 6 }}><StarRow rating={selected?.rating || 0} size={14} color="#666" /></div>
                      <div style={{ fontFamily: "sans-serif", fontSize: 11, color: "#555", marginTop: 4 }}>{selected?.user_ratings_total?.toLocaleString()} reviews</div>
                    </div>

                    <div style={{ padding: "0 20px", textAlign: "center" }}>
                      <div style={{ width: 1, height: 70, background: "#333", margin: "0 auto 8px" }} />
                      <div style={{ fontSize: 18, color: diff > 0 ? "#4caf76" : diff < 0 ? "#e87070" : "#555", fontWeight: 700 }}>
                        {diff > 0 ? `+${diff}` : diff !== 0 ? diff : "—"}
                      </div>
                    </div>

                    <div style={{ flex: 1, textAlign: "right" }}>
                      <div style={{ fontFamily: "sans-serif", fontSize: 10, color: "#c0392b", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>TrueStar</div>
                      <div style={{ fontFamily: "Georgia, serif", fontSize: 44, color: "#fff", fontWeight: 700, lineHeight: 1 }}>{result.trueScore?.toFixed(1)}</div>
                      <div style={{ marginTop: 6 }}><StarRow rating={result.trueScore || 0} size={16} color="#d4a017" /></div>
                      <div style={{ fontFamily: "sans-serif", fontSize: 11, color: "#666", marginTop: 4 }}>{result.reviewsCounted} reviews counted</div>
                    </div>
                  </div>
                </div>

                {/* Headline */}
                <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #ece9e4", background: "#fdfcfa" }}>
                  <p style={{ margin: 0, fontFamily: "Georgia, serif", fontSize: 16, color: "#1a1a1a", fontStyle: "italic", lineHeight: 1.7 }}>"{result.headline}"</p>
                </div>

                {/* Why it changed */}
                <div style={{ padding: "16px 24px 0" }}>
                  <div style={{ padding: "14px 16px", borderRadius: 12, background: "#f8f6f2", border: "1.5px solid #e0dbd4", marginBottom: 10 }}>
                    <div style={{ fontFamily: "sans-serif", fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                      Why your score {diff < 0 ? "dropped" : diff > 0 ? "rose" : "stayed the same"}
                    </div>
                    <div style={{ fontFamily: "sans-serif", fontSize: 13, color: "#444", lineHeight: 1.65 }}>{result.whyAdjusted}</div>
                  </div>
                </div>

                {/* Kept / Omitted summaries */}
                <div style={{ padding: "0 24px" }}>
                  <div style={{ padding: "14px 16px", borderRadius: 12, background: "#f0faf4", border: "1.5px solid #c3e6d0", marginBottom: 10 }}>
                    <div style={{ fontFamily: "sans-serif", fontSize: 11, fontWeight: 700, color: "#1a6e3c", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                      ✅ {result.reviewsCounted} review{result.reviewsCounted !== 1 ? "s" : ""} counted
                    </div>
                    <div style={{ fontFamily: "sans-serif", fontSize: 13, color: "#333", lineHeight: 1.65 }}>{result.keptSummary}</div>
                  </div>

                  <div style={{ padding: "14px 16px", borderRadius: 12, background: "#fdf0f0", border: "1.5px solid #f0d0d0", marginBottom: 16 }}>
                    <div style={{ fontFamily: "sans-serif", fontSize: 11, fontWeight: 700, color: "#c0392b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                      🚫 {result.reviewsExcluded} review{result.reviewsExcluded !== 1 ? "s" : ""} omitted
                    </div>
                    <div style={{ fontFamily: "sans-serif", fontSize: 13, color: "#333", lineHeight: 1.65 }}>{result.omittedSummary}</div>
                  </div>
                </div>

                {/* Calculation */}
                <div style={{ padding: "0 24px 12px" }}>
                  <button onClick={() => setShowCalc(!showCalc)} style={{ width: "100%", padding: "10px 14px", background: "#f8f6f2", border: "1.5px solid #e0dbd4", borderRadius: 10, fontFamily: "sans-serif", fontSize: 13, color: "#1a1a1a", cursor: "pointer", fontWeight: 600, textAlign: "left" }}>
                    {showCalc ? "▲" : "▼"} How your TrueStar was calculated
                  </button>
                  {showCalc && (
                    <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                      {calcRows.map((row) => (
                        <div key={row.id} style={{ padding: "12px 14px", borderRadius: 10, background: "#fff", border: "1px solid #e0dbd4" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <div style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: 13, color: row.color }}>{row.label}</div>
                            <div style={{ fontFamily: "sans-serif", fontSize: 12, color: "#888" }}>{row.mentions != null ? `${row.mentions} mention${row.mentions === 1 ? "" : "s"}` : ""}</div>
                          </div>
                          <div style={{ fontFamily: "sans-serif", fontSize: 13, color: "#444" }}>
                            {row.score.toFixed(1)} × {row.weight}% = <strong>{row.contribution.toFixed(2)}</strong>
                          </div>
                        </div>
                      ))}
                      <div style={{ padding: "12px 14px", borderRadius: 10, background: "#1a1a1a", color: "#fff" }}>
                        <div style={{ fontFamily: "sans-serif", fontSize: 11, opacity: 0.6, marginBottom: 4 }}>Final score</div>
                        <div style={{ fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 700 }}>
                          {calcRows.reduce((sum, row) => sum + row.contribution, 0).toFixed(2)} → {result.trueScore.toFixed(1)}
                        </div>
                      </div>
                      {missingActiveCategories.length > 0 && (
                        <div style={{ padding: "10px 12px", borderRadius: 10, background: "#fff7e8", border: "1px solid #f0d9a7", fontFamily: "sans-serif", fontSize: 12, color: "#7a5a00", lineHeight: 1.6 }}>
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
                      <button onClick={() => setShowKept(!showKept)} style={{ width: "100%", padding: "10px 14px", background: "#f0faf4", border: "1.5px solid #c3e6d0", borderRadius: 10, fontFamily: "sans-serif", fontSize: 13, color: "#1a6e3c", cursor: "pointer", fontWeight: 600, textAlign: "left" }}>
                        {showKept ? "▲" : "▼"} Dig into the {keptReviews.length} review{keptReviews.length === 1 ? "" : "s"} that counted
                      </button>
                      {showKept && (
                        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
                          {keptReviews.map(({ review, index, tag }) => (
                            <div key={index} style={{ padding: "12px 14px", borderRadius: 10, background: "#fff", border: "1px solid #e0dbd4" }}>
                              <StarRow rating={review.rating} size={13} color="#d4a017" />
                              <p style={{ margin: "8px 0 0", fontFamily: "sans-serif", fontSize: 13, color: "#444", lineHeight: 1.6 }}>{review.text}</p>
                              {tag?.reason && <div style={{ marginTop: 6, fontFamily: "sans-serif", fontSize: 12, color: "#1a6e3c" }}>Why it counted: {tag.reason}</div>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Omitted reviews */}
                  {omittedReviews.length > 0 && (
                    <div style={{ marginBottom: 8 }}>
                      <button onClick={() => setShowOmitted(!showOmitted)} style={{ width: "100%", padding: "10px 14px", background: "#fdf0f0", border: "1.5px solid #f0d0d0", borderRadius: 10, fontFamily: "sans-serif", fontSize: 13, color: "#c0392b", cursor: "pointer", fontWeight: 600, textAlign: "left" }}>
                        {showOmitted ? "▲" : "▼"} See the {omittedReviews.length} review{omittedReviews.length === 1 ? "" : "s"} that didn't count
                      </button>
                      {showOmitted && (
                        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
                          {omittedReviews.map(({ review, index, tag }) => (
                            <div key={index} style={{ padding: "12px 14px", borderRadius: 10, background: "#fdf5f5", border: "1px solid #f0d0d0" }}>
                              <StarRow rating={review.rating} size={13} color="#ccc" />
                              <p style={{ margin: "8px 0 0", fontFamily: "sans-serif", fontSize: 13, color: "#999", lineHeight: 1.6 }}>{review.text}</p>
                              {tag?.reason && <div style={{ marginTop: 6, fontFamily: "sans-serif", fontSize: 12, color: "#c0392b" }}>Why omitted: {tag.reason}</div>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ padding: "8px 24px 24px", display: "flex", gap: 10 }}>
                  <button onClick={() => { setStage("weights"); setResult(null); }} style={{ flex: 1, padding: "12px", background: "#fff", border: "1.5px solid #e0dbd4", borderRadius: 10, fontFamily: "sans-serif", fontSize: 13, color: "#666", cursor: "pointer", fontWeight: 600 }}>← Adjust weights</button>
                  <button onClick={reset} style={{ flex: 1, padding: "12px", background: "#1a1a1a", border: "none", borderRadius: 10, fontFamily: "sans-serif", fontSize: 13, color: "#fff", cursor: "pointer", fontWeight: 600 }}>New search →</button>
                </div>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
