// TrueStar Chrome Extension — Content Script
// Runs on Google Maps. Injects sidebar, scrapes reviews, calls API.

const TS_CATEGORIES = [
  { id: 'food',     label: 'Food Quality', emoji: '🍽️', desc: 'Taste, cooking, ingredients' },
  { id: 'price',    label: 'Price & Value', emoji: '💰', desc: 'Worth the money, portions' },
  { id: 'service',  label: 'Service',       emoji: '🤝', desc: 'Staff, attentiveness, speed' },
  { id: 'ambiance', label: 'Ambiance',      emoji: '✨', desc: 'Decor, atmosphere, vibe' },
];

let tsWeights = { food: 40, price: 20, service: 25, ambiance: 15 };
let tsSidebarOpen = false;
let tsRestaurant = null;

// ── Detect restaurant page ──────────────────────────────────────────────────

function tsIsRestaurantPage() {
  return window.location.href.includes('/maps/place/');
}

function tsGetRestaurantInfo() {
  const nameEl = document.querySelector('h1.DUwDvf, h1[class*="fontHeadlineLarge"]');
  const ratingEl = document.querySelector('div.F7nice > span > span[aria-hidden]');
  const totalEl = document.querySelector('div.F7nice > span:last-child > span[aria-label]');
  return {
    name: nameEl?.textContent?.trim() || 'This Restaurant',
    rating: ratingEl?.textContent?.trim() || '?',
    total: totalEl?.getAttribute('aria-label')?.match(/[\d,]+/)?.[0]?.replace(',', '') || '?'
  };
}

// ── Review scraping ─────────────────────────────────────────────────────────

function tsScrapeReviews() {
  // Expand any truncated reviews first
  document.querySelectorAll('button.w8nwRe, [jsaction*="pane.review.expandReview"]').forEach(btn => {
    try { btn.click(); } catch (e) {}
  });

  const reviews = [];
  const seen = new Set();

  // Strategy 1: data-review-id containers
  document.querySelectorAll('div[data-review-id]').forEach(container => {
    const starEl = container.querySelector('[aria-label*="star"], [aria-label*="Star"], [aria-label*=" stars"]');
    const textEl = container.querySelector('span.wiI7pd, span[class*="review"], .MyEned span');
    const text = textEl?.innerText?.trim();
    if (!text || text.length < 15 || seen.has(text)) return;
    seen.add(text);
    const ratingMatch = starEl?.getAttribute('aria-label')?.match(/(\d+(\.\d+)?)/);
    reviews.push({ rating: ratingMatch ? parseFloat(ratingMatch[1]) : 3, text: text.substring(0, 600) });
  });

  // Strategy 2: fallback — any .wiI7pd spans
  if (reviews.length === 0) {
    document.querySelectorAll('span.wiI7pd').forEach(el => {
      const text = el.innerText?.trim();
      if (!text || text.length < 15 || seen.has(text)) return;
      seen.add(text);
      reviews.push({ rating: 3, text: text.substring(0, 600) });
    });
  }

  return reviews;
}

// ── Prompt builder (matches web app exactly) ────────────────────────────────

function tsBuildPrompt(restaurant, reviews, weights) {
  const active = TS_CATEGORIES.filter(c => weights[c.id] > 0);
  const weightDesc = active.map(c => `${c.label}: ${weights[c.id]}%`).join(', ');
  const reviewsText = reviews.map((r, i) => `Review ${i} (${r.rating} stars): "${r.text}"`).join('\n');

  return `You are TrueStar, a sharp but friendly restaurant rating analyzer. Speak casually, clearly, and specifically.

Restaurant: ${restaurant.name}
Official Google Rating: ${restaurant.rating} (${restaurant.total} total reviews)

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
  "reviewTags": [{"index": 0, "categories": ["food","service"], "counted": true, "reason": "..."}],
  "categoryScores": {"food": 4.2, "price": 3.8, "service": null, "ambiance": null},
  "categoryMentions": {"food": 4, "price": 2, "service": 0, "ambiance": 0},
  "reviewsCounted": 4,
  "reviewsExcluded": 1,
  "trueScore": 4.1,
  "headline": "One punchy sentence about what the TrueStar score reveals",
  "whyAdjusted": "Specific explanation of why the score changed",
  "keptSummary": "What the counted reviews mostly said",
  "omittedSummary": "What the omitted reviews focused on and why they didn't matter"
}`;
}

// ── Sidebar injection ────────────────────────────────────────────────────────

function tsInjectSidebar() {
  if (document.getElementById('truestar-sidebar')) return;

  // FAB button
  const fab = document.createElement('button');
  fab.id = 'truestar-fab';
  fab.innerHTML = '⭐';
  fab.title = 'TrueStar — Your rating';
  document.body.appendChild(fab);

  // Sidebar panel
  const sidebar = document.createElement('div');
  sidebar.id = 'truestar-sidebar';
  sidebar.innerHTML = `
    <div class="ts-header">
      <span class="ts-logo">⭐ TrueStar</span>
      <button class="ts-close-btn" id="ts-close">✕</button>
    </div>
    <div class="ts-restaurant-name" id="ts-restaurant-name">Loading…</div>
    <div class="ts-section-label">What do you care about?</div>
    <div id="ts-sliders"></div>
    <button class="ts-analyze-btn" id="ts-analyze">Analyze</button>
    <div id="ts-results" class="ts-results"></div>
  `;
  document.body.appendChild(sidebar);

  tsRenderSliders();

  fab.addEventListener('click', tsToggleSidebar);
  document.getElementById('ts-close').addEventListener('click', tsCloseSidebar);
  document.getElementById('ts-analyze').addEventListener('click', tsRunAnalysis);

  tsRestaurant = tsGetRestaurantInfo();
  const nameEl = document.getElementById('ts-restaurant-name');
  if (nameEl) nameEl.textContent = tsRestaurant.name;
}

// ── Sliders ──────────────────────────────────────────────────────────────────

function tsRenderSliders() {
  const container = document.getElementById('ts-sliders');
  if (!container) return;
  container.innerHTML = TS_CATEGORIES.map(cat => `
    <div class="ts-slider-row">
      <div class="ts-slider-label-row">
        <span>${cat.emoji} ${cat.label}</span>
        <span class="ts-weight-num" id="ts-val-${cat.id}">${tsWeights[cat.id]}%</span>
      </div>
      <input type="range" class="ts-slider" id="ts-slider-${cat.id}"
             min="0" max="100" value="${tsWeights[cat.id]}" data-cat="${cat.id}">
    </div>
  `).join('');

  TS_CATEGORIES.forEach(cat => {
    document.getElementById(`ts-slider-${cat.id}`).addEventListener('input', e => {
      tsWeights[cat.id] = parseInt(e.target.value);
      tsNormalize(cat.id);
      tsUpdateSliders();
    });
  });
}

function tsNormalize(changedId) {
  const changed = tsWeights[changedId];
  const others = TS_CATEGORIES.filter(c => c.id !== changedId);
  const othersTotal = others.reduce((s, c) => s + tsWeights[c.id], 0);
  const remaining = 100 - changed;
  if (othersTotal === 0) {
    others.forEach(c => tsWeights[c.id] = Math.floor(remaining / others.length));
  } else {
    others.forEach(c => { tsWeights[c.id] = Math.round((tsWeights[c.id] / othersTotal) * remaining); });
  }
  const total = Object.values(tsWeights).reduce((a, b) => a + b, 0);
  if (total !== 100) tsWeights[others[0].id] += (100 - total);
}

function tsUpdateSliders() {
  TS_CATEGORIES.forEach(cat => {
    const s = document.getElementById(`ts-slider-${cat.id}`);
    const v = document.getElementById(`ts-val-${cat.id}`);
    if (s) s.value = tsWeights[cat.id];
    if (v) v.textContent = `${tsWeights[cat.id]}%`;
  });
}

// ── Sidebar open/close ───────────────────────────────────────────────────────

function tsToggleSidebar() {
  tsSidebarOpen ? tsCloseSidebar() : tsOpenSidebar();
}

function tsOpenSidebar() {
  const s = document.getElementById('truestar-sidebar');
  if (!s) return;
  tsRestaurant = tsGetRestaurantInfo();
  const el = document.getElementById('ts-restaurant-name');
  if (el) el.textContent = tsRestaurant.name;
  s.classList.add('ts-open');
  tsSidebarOpen = true;
}

function tsCloseSidebar() {
  document.getElementById('truestar-sidebar')?.classList.remove('ts-open');
  tsSidebarOpen = false;
}

// ── Analysis ─────────────────────────────────────────────────────────────────

async function tsRunAnalysis() {
  const btn = document.getElementById('ts-analyze');
  const resultsEl = document.getElementById('ts-results');

  btn.textContent = 'Analyzing…';
  btn.disabled = true;
  resultsEl.innerHTML = '';

  const reviews = tsScrapeReviews();

  if (reviews.length === 0) {
    resultsEl.innerHTML = `<div class="ts-error">No reviews found. Make sure you can see reviews on this page, then try again.</div>`;
    btn.textContent = 'Analyze';
    btn.disabled = false;
    return;
  }

  const prompt = tsBuildPrompt(tsRestaurant, reviews, tsWeights);

  chrome.runtime.sendMessage({ type: 'ANALYZE', prompt }, response => {
    btn.textContent = 'Analyze';
    btn.disabled = false;

    if (!response?.success) {
      resultsEl.innerHTML = `<div class="ts-error">Analysis failed. Check your connection and try again.</div>`;
      return;
    }

    try {
      const text = response.data.content?.find(b => b.type === 'text')?.text;
      const parsed = JSON.parse(text.replace(/
