import { useState, useCallback } from "react";

const CATEGORIES = [
  { id: "food",     label: "Food Quality",  emoji: "🍽️", color: "#c0392b", desc: "Taste, cooking, ingredients" },
  { id: "price",    label: "Price & Value", emoji: "💰", color: "#1a6e3c", desc: "Worth the money, portions" },
  { id: "service",  label: "Service",       emoji: "🤝", color: "#1a4a8a", desc: "Staff, attentiveness" },
  { id: "ambiance", label: "Ambiance",      emoji: "✨", color: "#7b3fa0", desc: "Vibe, decor, atmosphere" },
];

const DEFAULT_WEIGHTS = { food: 70, price: 30, service: 0, ambiance: 0 };

function StarRow({ rating, size = 16, color = "#d4a017" }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {[1,2,3,4,5].map(s => {
        const pct = Math.min(1, Math.max(0, rating - (s-1)));
        const id = `s${s}${size}${color.replace(/[#.]/g,"")}`;
        return (
          <svg key={s} width={size} height={size} viewBox="0 0 20 20">
            <defs>
              <linearGradient id={id} x1="0" x2="1" y1="0" y2="0">
                <stop offset={`${pct*100}%`} stopColor={color} />
                <stop offset={`${pct*100}%`} stopColor="#ddd" />
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
        onChange={e => onChange(cat.id, parseInt(e.target.value))}
        style={{ width: "100%", accentColor: cat.color, cursor: "pointer" }} />
      <div style={{ height: 4, borderRadius: 99, background: "#e0dbd5", marginTop: 4, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${value}%`, background: active ? cat.color : "#ccc", borderRadius: 99, transition: "width 0.15s" }} />
      </div>
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
  const [error, setError] = useState(null);

  const total = Object.values(weights).reduce((a, b) => a + b, 0);

  const handleWeight = useCallback((id, newVal) => {
    setWeights(prev => {
      const others = CATEGORIES.filter(c => c.id !== id);
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
      Object.keys(next).forEach(k => { if (next[k] < 0) next[k] = 0; });
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
  };

  const analyze = async () => {
    if (!selected || total !== 100) return;
    setLoading(true);
    setStage("result");
    setError(null);

    try {
      const revRes = await fetch(`/api/reviews?placeId=${selected.place_id}`);
      const revData = await revRes.json();

      if (!revRes.ok) {
        throw new Error(revData.error || "Failed to fetch reviews");
      }

      const reviews = revData.result?.reviews || [];

      if (reviews.length === 0) {
        setResult({
          trueScore: selected.rating || 3,
          headline: "Not enough review text available for analysis.",
          keptSummary: "No reviews were available to analyze.",
          omittedSummary: "No reviews were omitted.",
          categoryScores: {},
          reviewTags: [],
          reviewsCounted: 0,
          reviewsExcluded: 0,
          _reviews: [],
        });
        setLoading(false);
        return;
      }

      const activeWeights = CATEGORIES.filter(c => weights[c.id] > 0);
      const weightDesc = activeWeights.map(c => `${c.label}: ${weights[c.id]}%`).join(", ");
      const reviewsText = reviews.map((r, i) => `Review ${i} (${r.rating} stars): "${r.text}"`).join("\n");

      const prompt = `You are TrueStar, a restaurant rating analyzer.

Restaurant: ${selected.name}
Official Rating: ${selected.rating} (${selected.user_ratings_total} total reviews)

Reviews:
${reviewsText}

User preference weights (total 100%):
${weightDesc}

Categories:
- food: taste, flavor, dishes, cooking, ingredients, freshness
- price: cost, value, expensive, cheap, portions, worth it
- service: staff, waiters, rudeness, attentiveness, speed
- ambiance: decor, atmosphere, vibe, noise, cleanliness

RULES:
1. Tag each review with categories it mentions
2. A review is COUNTED if it mentions at least one active category (weight > 0)
3. A review is EXCLUDED if it ONLY mentions inactive categories (weight = 0)
4. For each active category, average the star ratings from reviews mentioning that category
5. TrueStar = sum of (categoryScore x weight/100) for active categories only
6. categoryScores must be a number (not null) for active categories that have reviews
7. trueScore must be a valid number between 1 and 5

Return ONLY valid JSON with no markdown and no code blocks:
{
  "reviewTags": [{"index": 0, "categories": ["food"], "counted": true}],
  "categoryScores": {"food": 4.5, "price": 3.8, "service": null, "ambiance": null},
  "reviewsCounted": 4,
  "reviewsExcluded": 1,
  "trueScore": 4.2,
  "headline": "<one sharp sentence summarizing the TrueStar score>",
  "keptSummary": "<one sentence explaining which reviews were counted and why>",
  "omittedSummary": "<one sentence explaining which reviews were omitted and why>"
}`;

      const aiRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const aiData = await aiRes.json();

      if (!aiRes.ok) {
        throw new Error(aiData.error || "AI analysis failed");
      }

      const text = aiData.content?.find(b => b.type === "text")?.text || "{}";
      const jsonStr = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(jsonStr);

      // Fix NaN: recalculate trueScore ourselves to be safe
      let calculatedScore = 0;
      let totalWeight = 0;
      activeWeights.forEach(c => {
        const score = parsed.categoryScores?.[c.id];
        if (score && !isNaN(score)) {
          calculatedScore += score * (weights[c.id] / 100);
          totalWeight += weights[c.id];
        }
      });
      if (totalWeight > 0) {
        parsed.trueScore = Math.round((calculatedScore / totalWeight * 100) * 10) / 10;
      } else {
        parsed.trueScore = selected.rating;
      }

      parsed._reviews = reviews;
      setResult(parsed);

    } catch (e) {
      console.error("Analyze error:", e);
      setError(`Analysis failed: ${e.message}`);
      setStage("weights");
    }
    setLoading(false);
  };

  const reset = () => {
    setQuery(""); setLocation(""); setSelected(null);
    setSearchResults([]); setStage("search");
    setResult(null); setWeights(DEFAULT_WEIGHTS);
    setShowKept(false); setShowOmitted(false); setError(null);
  };

  const diff = result && selected ? +(result.trueScore - selected.rating).toFixed(1) : 0;
  const keptReviews = result?._reviews?.filter((_, i) => result.reviewTags?.find(t => t.index === i)?.counted !== false) || [];
  const omittedReviews = result?._reviews?.filter((_, i) => result.reviewTags?.find(t => t.index === i)?.counted === false) || [];

  return (
    <div style={{ minHeight: "100vh", background: "#f7f4ef", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <style>{`* { box-sizing: border-box; } input[type=range] { height: 4px; }`}</style>

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
          <div style={{ background: "#fde8e8", border: "1.5px solid #c0392b", borderRadius: 12, padding: "12px 16px", marginBottom: 16, fontFamily: "sans-serif", fontSize: 14, color: "#c0392b" }}>
            {error}
          </div>
        )}

        {/* Step 1 — Search */}
        <div style={{
          background: "#fff", borderRadius: 20, boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
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
            <input value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Restaurant name (e.g. Nobu, Shake Shack)"
              style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #e0dbd5", borderRadius: 10, fontSize: 14, fontFamily: "sans-serif", background: "#faf9f7", outline: "none", marginBottom: 10 }} />
            <input value={location} onChange={e => setLocation(e.target.value)}
              placeholder="City or neighborhood (e.g. Seattle, Brooklyn)"
              onKeyDown={e => e.key === "Enter" && searchRestaurants()}
              style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #e0dbd5", borderRadius: 10, fontSize: 14, fontFamily: "sans-serif", background: "#faf9f7", outline: "none", marginBottom: 12 }} />
            <button onClick={searchRestaurants} disabled={searching || !query || !location}
              style={{ width: "100%", padding: "13px", background: (!query || !location) ? "#ddd" : "#1a1a1a", color: "#fff", border: "none", borderRadius: 10, fontFamily: "sans-serif", fontSize: 14, fontWeight: 700, cursor: (!query || !location) ? "not-allowed" : "pointer" }}>
              {searching ? "Searching..." : "Search Restaurants"}
            </button>
          </div>
        </div>

        {/* Step 2 — Pick */}
        {(stage === "pick" || stage === "weights" || stage === "result") && searchResults.length > 0 && (
          <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 16px rgba(0,0,0,0.05)", border: `2px solid ${stage === "pick" ? "#c0392b" : "#ece9e4"}`, marginBottom: 14 }}>
            <div style={{ padding: "18px 22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span style={{ width: 26, height: 26, borderRadius: "50%", background: stage === "pick" ? "#c0392b" : "#1a1a1a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, fontFamily: "sans-serif", flexShrink: 0 }}>
                  {stage !== "pick" ? "✓" : "2"}
                </span>
                <span style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: 15, color: "#1a1a1a" }}>Pick a restaurant</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {searchResults.map(r => (
                  <div key={r.place_id} onClick={() => pickRestaurant(r)}
                    style={{ padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${selected?.place_id === r.place_id ? "#c0392b" : "#e8e4de"}`, background: selected?.place_id === r.place_id ? "#fdf5f4" : "#faf9f7", cursor: "pointer" }}>
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
        )}

        {/* Step 3 — Weights */}
        {(stage === "weights" || stage === "result") && selected && (
          <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 16px rgba(0,0,0,0.05)", border: `2px solid ${stage === "weights" ? "#c0392b" : "#ece9e4"}`, marginBottom: 14 }}>
            <div style={{ padding: "18px 22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span style={{ width: 26, height: 26, borderRadius: "50%", background: stage === "weights" ? "#c0392b" : "#1a1a1a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, fontFamily: "sans-serif", flexShrink: 0 }}>
                  {stage === "result" ? "✓" : "3"}
                </span>
                <span style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: 15, color: "#1a1a1a" }}>Set your priorities</span>
                <div style={{ marginLeft: "auto", padding: "4px 12px", borderRadius: 99, background: total === 100 ? "#1a6e3c15" : "#c0392b15", border: `1.5px solid ${total === 100 ? "#1a6e3c" : "#c0392b"}`, fontFamily: "sans-serif", fontWeight: 700, fontSize: 13, color: total === 100 ? "#1a6e3c" : "#c0392b" }}>
                  {total}% {total === 100 ? "✓" : ""}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
                {CATEGORIES.map(cat => <WeightSlider key={cat.id} cat={cat} value={weights[cat.id]} onChange={handleWeight} />)}
              </div>
              {stage === "weights" && (
                <button onClick={analyze} disabled={total !== 100}
                  style={{ width: "100%", padding: "14px", background: total !== 100 ? "#ddd" : "#1a1a1a", color: "#fff", border: "none", borderRadius: 12, fontFamily: "sans-serif", fontSize: 15, fontWeight: 700, cursor: total !== 100 ? "not-allowed" : "pointer" }}>
                  {total !== 100 ? `Adjust to 100% (${total}% now)` : "Get My TrueStar Rating →"}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 4 — Result */}
        {stage === "result" && (
          <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 20px rgba(0,0,0,0.07)", border: "2px solid #ece9e4", overflow: "hidden" }}>
            {loading ? (
              <div style={{ padding: "52px 24px", textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 14, display: "inline-block", animation: "spin 1.2s linear infinite" }}>⭐</div>
                <p style={{ fontFamily: "sans-serif", color: "#888", fontSize: 15, margin: 0 }}>Analyzing reviews with your preferences…</p>
                <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
              </div>
            ) : result && (
              <>
                {/* Score Header */}
                <div style={{ background: "#1a1a1a", padding: "24px 26px" }}>
                  <h2 style={{ margin: "0 0 4px", fontFamily: "Georgia, serif", fontSize: 22, color: "#fff", fontWeight: 700 }}>{selected?.name}</h2>
                  <div style={{ fontFamily: "sans-serif", fontSize: 11, color: "#555", marginBottom: 18 }}>{selected?.formatted_address}</div>

                  <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                    {/* Official */}
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontFamily: "sans-serif", fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Google</div>
                      <div style={{ fontFamily: "Georgia, serif", fontSize: 28, color: "#777", fontWeight: 700 }}>{selected?.rating?.toFixed(1)}</div>
                      <StarRow rating={selected?.rating || 0} size={13} color="#555" />
                    </div>

                    {/* Arrow */}
                    <div style={{ flex: 1, textAlign: "center" }}>
                      <div style={{ fontFamily: "sans-serif", fontSize: 22, color: diff > 0 ? "#4caf76" : diff < 0 ? "#e87070" : "#555" }}>
                        {diff > 0 ? "▲" : diff < 0 ? "▼" : "="} <span style={{ fontSize: 15, fontWeight: 700 }}>{diff > 0 ? "+" : ""}{diff !== 0 ? diff : "no change"}</span>
                      </div>
                    </div>

                    {/* TrueStar */}
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontFamily: "sans-serif", fontSize: 10, color: "#c0392b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>TrueStar</div>
                      <div style={{ fontFamily: "Georgia, serif", fontSize: 28, color: "#fff", fontWeight: 700 }}>{result.trueScore?.toFixed(1)}</div>
                      <StarRow rating={result.trueScore || 0} size={13} color="#d4a017" />
                    </div>
                  </div>
                </div>

                {/* Headline */}
                <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #ece9e4" }}>
                  <p style={{ margin: 0, fontFamily: "Georgia, serif", fontSize: 15, color: "#1a1a1a", fontStyle: "italic", lineHeight: 1.65 }}>"{result.headline}"</p>
                </div>

                {/* Category Scores */}
                <div style={{ padding: "16px 24px", borderBottom: "1px solid #ece9e4" }}>
                  {CATEGORIES.filter(c => weights[c.id] > 0).map(c => {
                    const score = result.categoryScores?.[c.id];
                    const hasScore = score && !isNaN(score);
                    return (
                      <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span>{c.emoji}</span>
                          <span style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 600, color: c.color }}>{c.label}</span>
                          <span style={{ fontSize: 11, padding: "1px 7px", borderRadius: 99, background: c.color + "18", color: c.color, fontFamily: "sans-serif", fontWeight: 700 }}>{weights[c.id]}%</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          {hasScore && <StarRow rating={score} size={12} color={c.color} />}
                          <span style={{ fontFamily: "Georgia, serif", fontSize: 16, fontWeight: 700, color: hasScore ? c.color : "#bbb" }}>
                            {hasScore ? score.toFixed(1) : "—"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Reviews Summary */}
                <div style={{ padding: "16px 24px", borderBottom: "1px solid #ece9e4", background: "#faf9f7" }}>
                  <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                    <div style={{ flex: 1, padding: "10px 14px", borderRadius: 10, background: "#e8f5ee", border: "1px solid #c3e6d0" }}>
                      <div style={{ fontFamily: "sans-serif", fontSize: 11, fontWeight: 700, color: "#1a6e3c", marginBottom: 2 }}>✅ {keptReviews.length} REVIEWS COUNTED</div>
                      <div style={{ fontFamily: "sans-serif", fontSize: 12, color: "#444", lineHeight: 1.5 }}>{result.keptSummary}</div>
                    </div>
                  </div>
                  <div style={{ flex: 1, padding: "10px 14px", borderRadius: 10, background: "#fdf0f0", border: "1px solid #f0d0d0" }}>
                    <div style={{ fontFamily: "sans-serif", fontSize: 11, fontWeight: 700, color: "#c0392b", marginBottom: 2 }}>🚫 {omittedReviews.length} REVIEWS OMITTED</div>
                    <div style={{ fontFamily: "sans-serif", fontSize: 12, color: "#444", lineHeight: 1.5 }}>{result.omittedSummary}</div>
                  </div>
                </div>

                {/* Expandable Reviews */}
                <div style={{ padding: "16px 24px" }}>
                  {keptReviews.length > 0 && (
                    <div style={{ marginBottom: 10 }}>
                      <button onClick={() => setShowKept(!showKept)}
                        style={{ width: "100%", padding: "10px", background: "#e8f5ee", border: "1px solid #c3e6d0", borderRadius: 10, fontFamily: "sans-serif", fontSize: 13, color: "#1a6e3c", cursor: "pointer", fontWeight: 600 }}>
                        {showKept ? "▲ Hide" : "▼ See"} {keptReviews.length} reviews that counted
                      </button>
                      {showKept && (
                        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
                          {keptReviews.map((rev, i) => (
                            <div key={i} style={{ padding: "12px 14px", borderRadius: 10, background: "#fff", border: "1px solid #e0dbd4" }}>
                              <StarRow rating={rev.rating} size={12} color="#d4a017" />
                              <p style={{ margin: "6px 0 0", fontFamily: "sans-serif", fontSize: 13, color: "#444", lineHeight: 1.6 }}>{rev.text}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {omittedReviews.length > 0 && (
                    <div style={{ marginBottom: 10 }}>
                      <button onClick={() => setShowOmitted(!showOmitted)}
                        style={{ width: "100%", padding: "10px", background: "#fdf0f0", border: "1px solid #f0d0d0", borderRadius: 10, fontFamily: "sans-serif", fontSize: 13, color: "#c0392b", cursor: "pointer", fontWeight: 600 }}>
                        {showOmitted ? "▲ Hide" : "▼ See"} {omittedReviews.length} reviews that were omitted
                      </button>
                      {showOmitted && (
                        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
                          {omittedReviews.map((rev, i) => (
                            <div key={i} style={{ padding: "12px 14px", borderRadius: 10, background: "#fdf5f5", border: "1px solid #f0d0d0", opacity: 0.8 }}>
                              <StarRow rating={rev.rating} size={12} color="#ccc" />
                              <p style={{ margin: "6px 0 0", fontFamily: "sans-serif", fontSize: 13, color: "#888", lineHeight: 1.6 }}>{rev.text}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ padding: "0 24px 24px", display: "flex", gap: 10 }}>
                  <button onClick={() => { setStage("weights"); setResult(null); }}
                    style={{ flex: 1, padding: "10px", background: "#fff", border: "1.5px solid #e0dbd4", borderRadius: 10, fontFamily: "sans-serif", fontSize: 13, color: "#666", cursor: "pointer", fontWeight: 600 }}>← Adjust weights</button>
                  <button onClick={reset}
                    style={{ flex: 1, padding: "10px", background: "#1a1a1a", border: "none", borderRadius: 10, fontFamily: "sans-serif", fontSize: 13, color: "#fff", cursor: "pointer", fontWeight: 600 }}>New search →</button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
