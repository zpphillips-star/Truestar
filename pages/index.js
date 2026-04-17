import { useState, useEffect } from "react";
import { Logo } from "../components/Logo";
import StarSpinner from "../components/StarSpinner";
import StarRow from "../components/StarRow";
import WeightSlider from "../components/WeightSlider";
import CollapsedStep from "../components/CollapsedStep";
import DiffBadge from "../components/DiffBadge";
import TopMatchBadge from "../components/TopMatchBadge";
import { colors, shadow, type as t, radius, spacing } from "../lib/brand";
import { CATEGORIES } from "../lib/constants";
import { buildPrompt } from "../lib/buildPrompt";
import { useWeights } from "../hooks/useWeights";

export default function Home() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const { weights, handleWeight, total, totalFlash, resetWeights } = useWeights();
  const [stage, setStage] = useState("search");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showKept, setShowKept] = useState(false);
  const [showOmitted, setShowOmitted] = useState(false);
  const [showCalc, setShowCalc] = useState(false);
  const [error, setError] = useState(null);

  const activeWeightSummary = CATEGORIES.filter(c => weights[c.id] > 0).map(c => c.label + " " + weights[c.id] + "%").join(" · ");

  const searchRestaurants = async () => {
    if (!query || !location) return;
    setSearching(true);
    setError(null);
    try {
      const res = await fetch("/api/search?query=" + encodeURIComponent(query) + "&location=" + encodeURIComponent(location));
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
        const revRes = await fetch("/api/reviews?placeId=" + selected.place_id);
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

      const prompt = buildPrompt(selected, reviews, weights);

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
      const activeWeights = CATEGORIES.filter((c) => weights[c.id] > 0);

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
        headline: parsed.headline || "Here is your personalized TrueStar score.",
        whyAdjusted: parsed.whyAdjusted || "Score adjusted based on your priorities.",
        keptSummary: parsed.keptSummary || "Reviews matching your priorities were counted.",
        omittedSummary: parsed.omittedSummary || "Reviews about other topics were not counted.",
        _reviews: reviews,
      });
    } catch (e) {
      setError("Analysis failed: " + e.message);
      setStage("weights");
    }
    setLoading(false);
  };

  const reset = () => {
    setQuery(""); setLocation(""); setSelected(null);
    setSearchResults([]); setStage("search");
    setResult(null); resetWeights();
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
  const pageBg = isResult ? colors.bgResult : stage === "weights" ? colors.bgWeights : colors.cream;

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

      <div style={{ paddingTop: 48, paddingBottom: 6, textAlign: "center" }}>
        <Logo size={32} starColor={colors.amber} textColor={colors.ink} gap={14} />
        <p style={{ margin: "8px 0 0", fontFamily: "'Lato', sans-serif", fontSize: t.sm, color: colors.textMuted, letterSpacing: t.labelTracking, textTransform: "uppercase", fontWeight: t.light }}>
          Your preferences. Your rating.
        </p>
      </div>

      <div style={{ width: "100%", maxWidth: 540, padding: "24px 18px 60px" }}>

        {error && (
          <div style={{ background: colors.badgePoorBg, border: "1.5px solid " + colors.red, borderRadius: radius.md, padding: "12px 16px", marginBottom: 16, fontFamily: "'Lato', sans-serif", fontSize: t.base, color: colors.red, animation: "fadeIn 0.3s ease" }}>
            {error}
          </div>
        )}

        {/* STEP 1: Search */}
        {isResult ? (
          <CollapsedStep label="Restaurant" summary={selected?.name}
            onEdit={() => { setStage("search"); setResult(null); setSearchResults([]); setSelected(null); setQuery(""); setLocation(""); }} />
        ) : (
          <div className="step-card" style={{
            background: colors.white, borderRadius: radius.xl,
            boxShadow: shadow.card,
            border: "2px solid " + (stage === "search" ? colors.red : colors.border),
            marginBottom: 14,
          }}>
            <div style={{ padding: "18px 22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span style={{ width: 26, height: 26, borderRadius: radius.pill, background: stage === "search" ? colors.red : colors.ink, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: t.sm, fontWeight: t.bold, fontFamily: "'Lato', sans-serif", flexShrink: 0 }}>
                  {stage !== "search" ? "✓" : "1"}
                </span>
                <span style={{ fontFamily: "'Lato', sans-serif", fontWeight: t.bold, fontSize: t.md, color: colors.ink }}>Find a restaurant</span>
              </div>
              <input value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="Restaurant name (e.g. Nobu, Shake Shack)"
                style={{ width: "100%", padding: "12px 14px", border: "1.5px solid " + colors.border, borderRadius: radius.sm, fontSize: t.base, fontFamily: "'Lato', sans-serif", background: colors.cream, outline: "none", marginBottom: 10 }} />
              <input value={location} onChange={(e) => setLocation(e.target.value)}
                placeholder="City or neighborhood (e.g. Seattle, Brooklyn)"
                onKeyDown={(e) => e.key === "Enter" && searchRestaurants()}
                style={{ width: "100%", padding: "12px 14px", border: "1.5px solid " + colors.border, borderRadius: radius.sm, fontSize: t.base, fontFamily: "'Lato', sans-serif", background: colors.cream, outline: "none", marginBottom: 12 }} />
              <button onClick={searchRestaurants} disabled={searching || !query || !location}
                style={{ width: "100%", padding: "13px", background: !query || !location ? "#ddd" : colors.ink, color: "#fff", border: "none", borderRadius: radius.sm, fontFamily: "'Lato', sans-serif", fontSize: t.base, fontWeight: t.bold, cursor: !query || !location ? "not-allowed" : "pointer", transition: "opacity 0.15s" }}>
                {searching ? "Searching..." : "Search Restaurants"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Pick */}
        {isResult ? (
          <CollapsedStep label="Selected" summary={selected?.name + " · " + selected?.rating + "★ official"}
            onEdit={() => { setStage("pick"); setResult(null); }} />
        ) : (
          (stage === "pick" || stage === "weights") && searchResults.length > 0 && (
            <div className="step-card" style={{
              background: colors.white, borderRadius: radius.xl,
              boxShadow: shadow.card,
              border: "2px solid " + (stage === "pick" ? colors.red : colors.border),
              marginBottom: 14, animation: "fadeIn 0.3s ease",
            }}>
              <div style={{ padding: "18px 22px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <span style={{ width: 26, height: 26, borderRadius: radius.pill, background: stage === "pick" ? colors.red : colors.ink, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: t.sm, fontWeight: t.bold, fontFamily: "'Lato', sans-serif", flexShrink: 0 }}>
                    {stage !== "pick" ? "✓" : "2"}
                  </span>
                  <span style={{ fontFamily: "'Lato', sans-serif", fontWeight: t.bold, fontSize: t.md, color: colors.ink }}>Pick a restaurant</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {searchResults.map((r) => (
                    <div key={r.place_id} onClick={() => pickRestaurant(r)}
                      style={{ padding: "12px 14px", borderRadius: radius.md, border: "1.5px solid " + (selected?.place_id === r.place_id ? colors.red : colors.border), background: selected?.place_id === r.place_id ? "#fdf5f4" : colors.cream, cursor: "pointer", transition: "all 0.15s" }}>
                      <div style={{ fontFamily: "'Lato', sans-serif", fontWeight: t.bold, fontSize: t.base, color: colors.ink }}>{r.name}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                        <StarRow rating={r.rating || 0} size={13} color={colors.amber} />
                        <span style={{ fontFamily: "'Lato', sans-serif", fontSize: t.base, fontWeight: t.bold, color: colors.amber }}>{r.rating}</span>
                        <span style={{ fontFamily: "'Lato', sans-serif", fontSize: t.sm, color: colors.textMuted }}>· {r.user_ratings_total?.toLocaleString()} reviews</span>
                      </div>
                      <div style={{ fontFamily: "'Lato', sans-serif", fontSize: t.sm, color: colors.textMuted, marginTop: 2 }}>{r.formatted_address}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        )}

        {/* STEP 3: Weights */}
        {isResult ? (
          <CollapsedStep label="Your priorities" summary={activeWeightSummary}
            onEdit={() => { setStage("weights"); setResult(null); }} />
        ) : (
          stage === "weights" && selected && (
            <div className="step-card" style={{
              background: colors.white, borderRadius: radius.xl,
              boxShadow: shadow.card,
              border: "2px solid " + colors.red,
              marginBottom: 14, animation: "fadeIn 0.3s ease",
            }}>
              <div style={{ padding: "18px 22px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <span style={{ width: 26, height: 26, borderRadius: radius.pill, background: colors.red, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: t.sm, fontWeight: t.bold, fontFamily: "'Lato', sans-serif", flexShrink: 0 }}>3</span>
                  <span style={{ fontFamily: "'Lato', sans-serif", fontWeight: t.bold, fontSize: t.md, color: colors.ink }}>Set your priorities</span>
                  <div
                    className={totalFlash ? "total-flash" : ""}
                    style={{
                      marginLeft: "auto", padding: "5px 14px", borderRadius: radius.pill,
                      background: total === 100 ? colors.forest : colors.badgePoorBg,
                      border: "1.5px solid " + (total === 100 ? colors.forest : colors.red),
                      fontFamily: "'Lato', sans-serif", fontWeight: t.bold, fontSize: t.base,
                      color: total === 100 ? "#fff" : colors.red,
                      transition: "all 0.3s ease",
                      boxShadow: total === 100 ? "0 2px 10px " + colors.forest + "55" : "none",
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
                  style={{ width: "100%", padding: "14px", background: total !== 100 ? "#ddd" : colors.red, color: "#fff", border: "none", borderRadius: radius.md, fontFamily: "'Lato', sans-serif", fontSize: t.md, fontWeight: t.bold, cursor: total !== 100 ? "not-allowed" : "pointer", letterSpacing: "0.02em", transition: "all 0.2s", boxShadow: total === 100 ? "0 4px 16px " + colors.red + "44" : "none" }}>
                  {total !== 100 ? "Adjust to 100% (" + total + "% now)" : "Get My TrueStar Rating →"}
                </button>
              </div>
            </div>
          )
        )}

        {/* STEP 4: Result */}
        {stage === "result" && (
          <div style={{ background: colors.white, borderRadius: radius.xl, boxShadow: shadow.modal, border: "2px solid " + colors.border, overflow: "hidden", animation: "fadeIn 0.4s ease" }}>
            {loading ? (
              <div style={{ padding: "60px 24px", textAlign: "center" }}>
                <StarSpinner size={56} color={colors.amber} label="Reading reviews with your priorities in mind…" />
              </div>
            ) : result ? (
              <>
                {/* Score Header */}
                <div style={{ background: colors.ink, padding: "28px 26px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                    <div>
                      <h2 style={{ margin: "0 0 3px", fontFamily: "'Lato', sans-serif", fontSize: t.xl, color: "#fff", fontWeight: t.bold }}>{selected?.name}</h2>
                      <div style={{ fontFamily: "'Lato', sans-serif", fontSize: t.sm, color: "#666" }}>{selected?.formatted_address}</div>
                    </div>
                    <TopMatchBadge score={result.trueScore} />
                  </div>

                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Lato', sans-serif", fontSize: t.xs, color: "#666", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>Google</div>
                      <div style={{ fontFamily: "'Lato', sans-serif", fontSize: t.xxl, color: "#888", fontWeight: t.bold, lineHeight: 1 }}>{selected?.rating?.toFixed(1)}</div>
                      <div style={{ marginTop: 5 }}><StarRow rating={selected?.rating || 0} size={13} color="#666" /></div>
                      <div style={{ fontFamily: "'Lato', sans-serif", fontSize: t.sm, color: "#555", marginTop: 4 }}>{selected?.user_ratings_total?.toLocaleString()} reviews</div>
                    </div>
                    <div style={{ padding: "0 16px" }}>
                      <DiffBadge diff={diff} />
                    </div>
                    <div style={{ flex: 1, textAlign: "right" }}>
                      <div style={{ fontFamily: "'Lato', sans-serif", fontSize: t.xs, color: colors.amber, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>TrueStar</div>
                      <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "44px", color: colors.amber, fontWeight: t.bold, lineHeight: 1, textShadow: "0 0 20px " + colors.amber + "66" }}>
                        {result.trueScore?.toFixed(1)}
                      </div>
                      <div style={{ marginTop: 5 }}><StarRow rating={result.trueScore || 0} size={15} color={colors.amber} /></div>
                      <div style={{ fontFamily: "'Lato', sans-serif", fontSize: t.sm, color: "#666", marginTop: 4 }}>{result.reviewsCounted} reviews counted</div>
                    </div>
                  </div>
                </div>

                {/* Headline */}
                <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid " + colors.border, background: "#faf7f2" }}>
                  <p style={{ margin: 0, fontFamily: "'Lato', sans-serif", fontSize: t.md, color: colors.ink, fontStyle: "italic", lineHeight: 1.7 }}>"{result.headline}"</p>
                </div>

                {/* Why it changed */}
                <div style={{ padding: "16px 24px 0" }}>
                  <div style={{ padding: "14px 16px", borderRadius: radius.md, background: colors.cream, border: "1.5px solid " + colors.border, marginBottom: 10 }}>
                    <div style={{ fontFamily: "'Lato', sans-serif", fontSize: t.sm, fontWeight: t.bold, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                      Why your score {diff < 0 ? "dropped" : diff > 0 ? "rose" : "stayed the same"}
                    </div>
                    <div style={{ fontFamily: "'Lato', sans-serif", fontSize: t.base, color: colors.textSecondary, lineHeight: 1.65 }}>{result.whyAdjusted}</div>
                  </div>
                </div>

                {/* Kept / Omitted */}
                <div style={{ padding: "0 24px" }}>
                  <div style={{ padding: "14px 16px", borderRadius: radius.md, background: colors.badgeGreatBg, border: "2px solid " + colors.forest, marginBottom: 10 }}>
                    <div style={{ fontFamily: "'Lato', sans-serif", fontSize: t.sm, fontWeight: t.bold, color: colors.forest, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                      ✅ {result.reviewsCounted} review{result.reviewsCounted !== 1 ? "s" : ""} counted
                    </div>
                    <div style={{ fontFamily: "'Lato', sans-serif", fontSize: t.base, color: colors.ink, lineHeight: 1.65 }}>{result.keptSummary}</div>
                  </div>
                  <div style={{ padding: "14px 16px", borderRadius: radius.md, background: colors.badgePoorBg, border: "2px solid " + colors.red, marginBottom: 16 }}>
                    <div style={{ fontFamily: "'Lato', sans-serif", fontSize: t.sm, fontWeight: t.bold, color: colors.red, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                      🚫 {result.reviewsExcluded} review{result.reviewsExcluded !== 1 ? "s" : ""} omitted
                    </div>
                    <div style={{ fontFamily: "'Lato', sans-serif", fontSize: t.base, color: colors.ink, lineHeight: 1.65 }}>{result.omittedSummary}</div>
                  </div>
                </div>

                {/* Calculation breakdown */}
                <div style={{ padding: "0 24px 12px" }}>
                  <button onClick={() => setShowCalc(!showCalc)} style={{ width: "100%", padding: "10px 14px", background: colors.cream, border: "1.5px solid " + colors.border, borderRadius: radius.sm, fontFamily: "'Lato', sans-serif", fontSize: t.base, color: colors.ink, cursor: "pointer", fontWeight: 600, textAlign: "left" }}>
                    {showCalc ? "▲" : "▼"} How your TrueStar was calculated
                  </button>
                  {showCalc && (
                    <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                      {calcRows.map((row) => (
                        <div key={row.id} style={{ padding: "12px 14px", borderRadius: radius.sm, background: colors.white, border: "1.5px solid " + row.color + "44" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <div style={{ fontFamily: "'Lato', sans-serif", fontWeight: t.bold, fontSize: t.base, color: row.color }}>{row.label}</div>
                            <div style={{ fontFamily: "'Lato', sans-serif", fontSize: t.sm, color: colors.textMuted }}>{row.mentions != null ? row.mentions + " mention" + (row.mentions === 1 ? "" : "s") : ""}</div>
                          </div>
                          <div style={{ fontFamily: "'Lato', sans-serif", fontSize: t.base, color: colors.textSecondary }}>
                            {row.score.toFixed(1)} × {row.weight}% = <strong style={{ color: row.color }}>{row.contribution.toFixed(2)}</strong>
                          </div>
                          <div style={{ height: 4, borderRadius: radius.pill, background: colors.tan, marginTop: 8, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: (row.score / 5 * 100) + "%", background: row.color, borderRadius: radius.pill }} />
                          </div>
                        </div>
                      ))}
                      <div style={{ padding: "14px 16px", borderRadius: radius.sm, background: colors.ink, color: "#fff" }}>
                        <div style={{ fontFamily: "'Lato', sans-serif", fontSize: t.sm, color: colors.amber, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>TrueStar Score</div>
                        <div style={{ fontFamily: "'Lato', sans-serif", fontSize: t.xxl, fontWeight: t.bold, color: colors.amber }}>
                          {result.trueScore.toFixed(1)}
                        </div>
                      </div>
                      {missingActiveCategories.length > 0 && (
                        <div style={{ padding: "10px 12px", borderRadius: radius.sm, background: colors.badgeOkayBg, border: "1px solid " + colors.amber + "88", fontFamily: "'Lato', sans-serif", fontSize: t.sm, color: colors.badgeOkayText, lineHeight: 1.6 }}>
                          Not enough review evidence for: <strong>{missingActiveCategories.map((c) => c.label).join(", ")}</strong>. These categories were skipped in the calculation.
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Kept reviews detail */}
                <div style={{ padding: "0 24px 12px" }}>
                  <button onClick={() => setShowKept(!showKept)} style={{ width: "100%", padding: "10px 14px", background: colors.badgeGreatBg, border: "1.5px solid " + colors.forest + "44", borderRadius: radius.sm, fontFamily: "'Lato', sans-serif", fontSize: t.base, color: colors.forest, cursor: "pointer", fontWeight: 600, textAlign: "left" }}>
                    {showKept ? "▲" : "▼"} See {keptReviews.length} counted review{keptReviews.length !== 1 ? "s" : ""}
                  </button>
                  {showKept && (
                    <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                      {keptReviews.map(({ review, index, tag }) => (
                        <div key={index} style={{ padding: "12px 14px", borderRadius: radius.sm, background: colors.white, border: "1.5px solid " + colors.forest + "33" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                            <StarRow rating={review.rating || 0} size={12} color={colors.amber} />
                            <span style={{ fontFamily: "'Lato', sans-serif", fontSize: t.sm, color: colors.textMuted }}>{review.author_name}</span>
                            {tag.categories?.map((c) => (
                              <span key={c} style={{ fontFamily: "'Lato', sans-serif", fontSize: t.xs, fontWeight: t.bold, padding: "1px 7px", borderRadius: radius.pill, background: colors.badgeGreatBg, color: colors.forest }}>{c}</span>
                            ))}
                          </div>
                          <div style={{ fontFamily: "'Lato', sans-serif", fontSize: t.sm, color: colors.ink, lineHeight: 1.6 }}>{review.text}</div>
                          {tag.reason && <div style={{ fontFamily: "'Lato', sans-serif", fontSize: t.sm, color: colors.textMuted, marginTop: 4, fontStyle: "italic" }}>{tag.reason}</div>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Omitted reviews detail */}
                {omittedReviews.length > 0 && (
                  <div style={{ padding: "0 24px 24px" }}>
                    <button onClick={() => setShowOmitted(!showOmitted)} style={{ width: "100%", padding: "10px 14px", background: colors.badgePoorBg, border: "1.5px solid " + colors.red + "44", borderRadius: radius.sm, fontFamily: "'Lato', sans-serif", fontSize: t.base, color: colors.red, cursor: "pointer", fontWeight: 600, textAlign: "left" }}>
                      {showOmitted ? "▲" : "▼"} See {omittedReviews.length} omitted review{omittedReviews.length !== 1 ? "s" : ""}
                    </button>
                    {showOmitted && (
                      <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                        {omittedReviews.map(({ review, index, tag }) => (
                          <div key={index} style={{ padding: "12px 14px", borderRadius: radius.sm, background: colors.white, border: "1.5px solid " + colors.red + "22", opacity: 0.8 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                              <StarRow rating={review.rating || 0} size={12} color="#aaa" />
                              <span style={{ fontFamily: "'Lato', sans-serif", fontSize: t.sm, color: colors.textMuted }}>{review.author_name}</span>
                            </div>
                            <div style={{ fontFamily: "'Lato', sans-serif", fontSize: t.sm, color: colors.textMuted, lineHeight: 1.6 }}>{review.text}</div>
                            {tag.reason && <div style={{ fontFamily: "'Lato', sans-serif", fontSize: t.sm, color: colors.red, marginTop: 4, fontStyle: "italic" }}>{tag.reason}</div>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Start over */}
                <div style={{ padding: "0 24px 28px", textAlign: "center" }}>
                  <button onClick={reset} style={{ padding: "10px 28px", background: "none", border: "1.5px solid " + colors.border, borderRadius: radius.pill, fontFamily: "'Lato', sans-serif", fontSize: t.base, color: colors.textMuted, cursor: "pointer", fontWeight: 600 }}>
                    Start over
                  </button>
                </div>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
