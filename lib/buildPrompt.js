import { CATEGORIES } from "./constants";

export function buildPrompt(selected, reviews, weights) {
  const activeWeights = CATEGORIES.filter((c) => weights[c.id] > 0);
  const weightDesc = activeWeights.map((c) => c.label + ": " + weights[c.id] + "%").join(", ");
  const reviewsText = reviews.slice(0, 50).map((r, i) => "Review " + i + " (" + r.rating + " stars): \"" + r.text + "\"").join("\n");

  return (
    "You are TrueStar, a restaurant rating analyzer focused on what the user actually cares about.\n\n" +
    "Restaurant: " + selected.name + "\n" +
    "Official Google Rating: " + selected.rating + " (" + selected.user_ratings_total + " total reviews, spanning years)\n\n" +
    "Reviews (most recent only):\n" + reviewsText + "\n\n" +
    "User cares ONLY about: " + weightDesc + "\n" +
    "IMPORTANT: The user has set all other categories to 0%. Do NOT mention or discuss any category the user did not weight above 0%. Your entire analysis — headline, whyAdjusted, keptSummary, omittedSummary — must stay strictly focused on: " + weightDesc + "\n\n" +
    "Category definitions:\n" +
    "- food: taste, flavor, dishes, cooking, ingredients, freshness\n" +
    "- price: cost, value, expensive, cheap, portions, worth it\n" +
    "- service: staff, waiters, attentiveness, speed, hospitality\n" +
    "- ambiance: decor, atmosphere, vibe, noise, cleanliness, views\n\n" +
    "YOUR JOB:\n" +
    "STEP 1 — FILTER: Go through every review. A review is ONLY counted if it explicitly mentions at least one active category (weight > 0). If a review talks only about categories the user set to 0%, it is EXCLUDED entirely.\n" +
    "STEP 2 — SCORE: For each active category, calculate the average star rating using ONLY the counted reviews that mention that category.\n" +
    "STEP 3 — TRUESCORE: Weighted average of category scores using the user's weights. Active categories only.\n" +
    "STEP 4 — EXPLAIN: Be specific. Quote real details. Never mention a category the user didn't ask about.\n\n" +
    "Return ONLY raw JSON (no markdown, no code blocks):\n" +
    "{\n" +
    "  \"categoryScores\": {\"food\": 4.2, \"price\": null, \"service\": null, \"ambiance\": null},\n" +
    "  \"categoryMentions\": {\"food\": 14, \"price\": 0, \"service\": 0, \"ambiance\": 0},\n" +
    "  \"reviewsCounted\": 22,\n" +
    "  \"reviewsExcluded\": 8,\n" +
    "  \"trueScore\": 4.1,\n" +
    "  \"headline\": \"One punchy sentence focused only on the user's chosen categories\",\n" +
    "  \"whyAdjusted\": \"Why the TrueStar score differs from Google's average — only discuss the user's chosen categories\",\n" +
    "  \"keptSummary\": \"What the counted reviews said about the user's chosen categories specifically\",\n" +
    "  \"omittedSummary\": \"What topics the excluded reviews focused on (do NOT start with a number or count)\"\n" +
    "}"
  );
}
