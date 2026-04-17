import { CATEGORIES } from "./constants";

export function buildPrompt(selected, reviews, weights) {
  const activeWeights = CATEGORIES.filter((c) => weights[c.id] > 0);
  const weightDesc = activeWeights.map((c) => c.label + ": " + weights[c.id] + "%").join(", ");
  const reviewsText = reviews.map((r, i) => "Review " + i + " (" + r.rating + " stars): \"" + r.text + "\"").join("\n");

  return (
    "You are TrueStar, a sharp but friendly restaurant rating analyzer. Speak casually, clearly, and specifically.\n\n" +
    "Restaurant: " + selected.name + "\n" +
    "Official Google Rating: " + selected.rating + " (" + selected.user_ratings_total + " total reviews)\n\n" +
    "Reviews:\n" + reviewsText + "\n\n" +
    "User cares about (weights add to 100%):\n" + weightDesc + "\n\n" +
    "Category definitions:\n" +
    "- food: taste, flavor, dishes, cooking, ingredients, freshness\n" +
    "- price: cost, value, expensive, cheap, portions, worth it\n" +
    "- service: staff, waiters, attentiveness, speed, hospitality\n" +
    "- ambiance: decor, atmosphere, vibe, noise, cleanliness, views\n\n" +
    "YOUR JOB:\n" +
    "1. Tag each review with which categories it mentions\n" +
    "2. A review COUNTS if it mentions at least one category the user cares about (weight > 0)\n" +
    "3. A review is OMITTED if it only talks about things the user doesn't care about (weight = 0)\n" +
    "4. For each active category, calculate the average star rating from reviews that mention it\n" +
    "5. TrueStar = weighted average using only active categories\n" +
    "6. Be specific. Mention real details from the reviews.\n\n" +
    "Return ONLY raw JSON (no markdown, no code blocks):\n" +
    "{\n" +
    "  \"reviewTags\": [{\"index\": 0, \"categories\": [\"food\",\"service\"], \"counted\": true, \"reason\": \"Counted because it mentions bland food and slow service\"}],\n" +
    "  \"categoryScores\": {\"food\": 4.2, \"price\": 3.8, \"service\": null, \"ambiance\": null},\n" +
    "  \"categoryMentions\": {\"food\": 4, \"price\": 2, \"service\": 0, \"ambiance\": 0},\n" +
    "  \"reviewsCounted\": 4,\n" +
    "  \"reviewsExcluded\": 1,\n" +
    "  \"trueScore\": 4.1,\n" +
    "  \"headline\": \"One punchy sentence about what the TrueStar score reveals\",\n" +
    "  \"whyAdjusted\": \"Specific explanation of why the score changed based on the user's weighted priorities\",\n" +
    "  \"keptSummary\": \"What the counted reviews mostly said and how they affected the score\",\n" +
    "  \"omittedSummary\": \"What the omitted reviews focused on and why they didn't matter for this user\"\n" +
    "}"
  );
}
