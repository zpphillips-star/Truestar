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
  document.querySelectorAll('button.w8nwRe, [jsaction*="pane.review.expandReview"]').forEach(btn => {
    try { btn.click(); } catch (e) {}
  });

  const reviews = [];
  const seen = new Set();

  document.querySelectorAll('div[data-review-id]').forEach(container => {
    const starEl = container.querySelector('[aria-label*="star"], [aria-label*="Star"], [aria-label*=" stars"]');
    const textEl = container.querySelector('span.wiI7pd, span[class*="review"], .MyEned span');
    const text = textEl?.innerText?.trim();
    if (!text || text.length < 15 || seen.has(text)) return;
    seen.add(text);
    const ratingMatch = starEl?.getAttribute('aria-label')?.match(/(\d+(\.\d+)?)/);
    reviews.push({ rating: ratingMatch ? parseFloat(ratingMatch[1]) : 3, text: text.substring(0, 600) });
  });

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

// ── Prompt builder ───────────────────────────────────────────────────────────

function tsBuildPrompt(restaurant, reviews, weights) {
  const active = TS_CATEGORIES.filter(c => weights[c.id] > 0);
  const weightDesc = active.map(c => c.label + ': ' + weights[c.id] + '%').join(', ');
  const reviewsText = reviews.map((r, i) => 'Review ' + i + ' (' + r.rating + ' stars): "' + r.text + '"').join('\n');

  return 'You are TrueStar, a sharp but friendly restaurant rating analyzer. Speak casually, clearly, and specifically.\n\n'
    + 'Restaurant: ' + restaurant.name + '\n'
    + 'Official Google Rating: ' + restaurant.rating + ' (' + restaurant.total + ' total reviews)\n\n'
    + 'Reviews:\n' + reviewsText + '\n\n'
    + 'User cares about (weights add to 100%):\n' + weightDesc + '\n\n'
    + 'Category definitions:\n'
    + '- food: taste, flavor, dishes, cooking, ingredients, freshness\n'
    + '- price: cost, value, expensive, cheap, portions, worth it\n'
    + '- service: staff, waiters, attentiveness, speed, hospitality\n'
    + '- ambiance: decor, atmosphere, vibe, noise, cleanliness, views\n\n'
    + 'YOUR JOB:\n'
    + '1. Tag each review with which categories it mentions\n'
    + '2. A review COUNTS if it mentions at least one category the user cares about (weight > 0)\n'
    + '3. A review is OMITTED if it only talks about things the user does not care about (weight = 0)\n'
    + '4. For each active category, calculate the average star rating from reviews that mention it\n'
    + '5. TrueStar = weighted average using only active categories\n'
    + '6. Be specific. Mention real details from the reviews.\n\n'
    + 'Return ONLY raw JSON (no markdown, no code blocks):\n'
    + '{\n'
    + '  "reviewTags": [{"index": 0, "categories": ["food","service"], "counted": true, "reason": "..."}],\n'
    + '  "categoryScores": {"food": 4.2, "price": 3.8, "service": null, "ambiance": null},\n'
    + '  "categoryMentions": {"food": 4, "price": 2, "service": 0, "ambiance": 0},\n'
    + '  "reviewsCounted": 4,\n'
    + '  "reviewsExcluded": 1,\n'
    + '  "trueScore": 4.1,\n'
    + '  "headline": "One punchy sentence about what the TrueStar score reveals",\n'
    + '  "whyAdjusted": "Specific explanation of why the score changed",\n'
    + '  "keptSummary": "What the counted reviews mostly said",\n'
    + '  "omittedSummary": "What the omitted reviews focused on and why they did not matter"\n'
    + '}';
}

// ── Sidebar injection ────────────────────────────────────────────────────────

function tsInjectSidebar() {
  if (document.getElementById('truestar-sidebar')) return;

  var fab = document.createElement('button');
  fab.id = 'truestar-fab';
  fab.innerHTML = '&#11088;';
  fab.title = 'TrueStar — Your rating';
  document.body.appendChild(fab);

  var sidebar = document.createElement('div');
  sidebar.id = 'truestar-sidebar';
  sidebar.innerHTML = ''
    + '<div class="ts-header">'
    + '  <span class="ts-logo">&#11088; TrueStar</span>'
    + '  <button class="ts-close-btn" id="ts-close">&#10005;</button>'
    + '</div>'
    + '<div class="ts-restaurant-name" id="ts-restaurant-name">Loading...</div>'
    + '<div class="ts-section-label">What do you care about?</div>'
    + '<div id="ts-sliders"></div>'
    + '<button class="ts-analyze-btn" id="ts-analyze">Analyze</button>'
    + '<div id="ts-results" class="ts-results"></div>';
  document.body.appendChild(sidebar);

  tsRenderSliders();

  fab.addEventListener('click', tsToggleSidebar);
  document.getElementById('ts-close').addEventListener('click', tsCloseSidebar);
  document.getElementById('ts-analyze').addEventListener('click', tsRunAnalysis);

  tsRestaurant = tsGetRestaurantInfo();
  var nameEl = document.getElementById('ts-restaurant-name');
  if (nameEl) nameEl.textContent = tsRestaurant.name;
}

// ── Sliders ──────────────────────────────────────────────────────────────────

function tsRenderSliders() {
  var container = document.getElementById('ts-sliders');
  if (!container) return;

  var html = '';
  TS_CATEGORIES.forEach(function(cat) {
    html += '<div class="ts-slider-row">'
      + '<div class="ts-slider-label-row">'
      + '<span>' + cat.emoji + ' ' + cat.label + '</span>'
      + '<span class="ts-weight-num" id="ts-val-' + cat.id + '">' + tsWeights[cat.id] + '%</span>'
      + '</div>'
      + '<input type="range" class="ts-slider" id="ts-slider-' + cat.id + '"'
      + ' min="0" max="100" value="' + tsWeights[cat.id] + '" data-cat="' + cat.id + '">'
      + '</div>';
  });
  container.innerHTML = html;

  TS_CATEGORIES.forEach(function(cat) {
    document.getElementById('ts-slider-' + cat.id).addEventListener('input', function(e) {
      tsWeights[cat.id] = parseInt(e.target.value);
      tsNormalize(cat.id);
      tsUpdateSliders();
    });
  });
}

function tsNormalize(changedId) {
  var changed = tsWeights[changedId];
  var others = TS_CATEGORIES.filter(function(c) { return c.id !== changedId; });
  var othersTotal = others.reduce(function(s, c) { return s + tsWeights[c.id]; }, 0);
  var remaining = 100 - changed;
  if (othersTotal === 0) {
    others.forEach(function(c) { tsWeights[c.id] = Math.floor(remaining / others.length); });
  } else {
    others.forEach(function(c) { tsWeights[c.id] = Math.round((tsWeights[c.id] / othersTotal) * remaining); });
  }
  var total = Object.values(tsWeights).reduce(function(a, b) { return a + b; }, 0);
  if (total !== 100) tsWeights[others[0].id] += (100 - total);
}

function tsUpdateSliders() {
  TS_CATEGORIES.forEach(function(cat) {
    var s = document.getElementById('ts-slider-' + cat.id);
    var v = document.getElementById('ts-val-' + cat.id);
    if (s) s.value = tsWeights[cat.id];
    if (v) v.textContent = tsWeights[cat.id] + '%';
  });
}

// ── Sidebar open/close ───────────────────────────────────────────────────────

function tsToggleSidebar() {
  if (tsSidebarOpen) { tsCloseSidebar(); } else { tsOpenSidebar(); }
}

function tsOpenSidebar() {
  var s = document.getElementById('truestar-sidebar');
  if (!s) return;
  tsRestaurant = tsGetRestaurantInfo();
  var el = document.getElementById('ts-restaurant-name');
  if (el) el.textContent = tsRestaurant.name;
  s.classList.add('ts-open');
  tsSidebarOpen = true;
}

function tsCloseSidebar() {
  var s = document.getElementById('truestar-sidebar');
  if (s) s.classList.remove('ts-open');
  tsSidebarOpen = false;
}

// ── Analysis ─────────────────────────────────────────────────────────────────

function tsRunAnalysis() {
  var btn = document.getElementById('ts-analyze');
  var resultsEl = document.getElementById('ts-results');

  btn.textContent = 'Analyzing...';
  btn.disabled = true;
  resultsEl.innerHTML = '';

  var reviews = tsScrapeReviews();

  if (reviews.length === 0) {
    resultsEl.innerHTML = '<div class="ts-error">No reviews found. Make sure you can see reviews on this page, then try again.</div>';
    btn.textContent = 'Analyze';
    btn.disabled = false;
    return;
  }

  var prompt = tsBuildPrompt(tsRestaurant, reviews, tsWeights);

  chrome.runtime.sendMessage({ type: 'ANALYZE', prompt: prompt }, function(response) {
    btn.textContent = 'Analyze';
    btn.disabled = false;

    if (!response || !response.success) {
      resultsEl.innerHTML = '<div class="ts-error">Analysis failed. Check your connection and try again.</div>';
      return;
    }

    try {
      var blocks = response.data.content;
      var textBlock = null;
      for (var i = 0; i < blocks.length; i++) {
        if (blocks[i].type === 'text') { textBlock = blocks[i].text; break; }
      }
      var cleaned = textBlock.replace(/```json/g, '').replace(/```/g, '').trim();
      var parsed = JSON.parse(cleaned);
      tsDisplayResults(parsed, reviews.length);
    } catch (e) {
      resultsEl.innerHTML = '<div class="ts-error">Could not parse results. Try again.</div>';
    }
  });
}

function tsDisplayResults(data, totalReviews) {
  var resultsEl = document.getElementById('ts-results');
  var score = data.trueScore || 0;
  var fullStars = Math.round(score);
  var stars = '';
  for (var i = 0; i < fullStars; i++) stars += '★';
  for (var j = fullStars; j < 5; j++) stars += '☆';

  var bars = '';
  TS_CATEGORIES.forEach(function(c) {
    if (tsWeights[c.id] <= 0) return;
    if (!data.categoryScores || data.categoryScores[c.id] == null) return;
    var s = data.categoryScores[c.id];
    var pct = (s / 5) * 100;
    var mentions = (data.categoryMentions && data.categoryMentions[c.id]) ? data.categoryMentions[c.id] : 0;
    bars += '<div class="ts-cat-row">'
      + '<div class="ts-cat-name">' + c.emoji + ' ' + c.label + ' <span class="ts-cat-mentions">' + mentions + 'x</span></div>'
      + '<div class="ts-bar-wrap"><div class="ts-bar" style="width:' + pct.toFixed(1) + '%"></div></div>'
      + '<div class="ts-cat-score">' + s.toFixed(1) + '</div>'
      + '</div>';
  });

  var html = '<div class="ts-score-block">'
    + '<div class="ts-big-score">' + score.toFixed(1) + '</div>'
    + '<div class="ts-stars">' + stars + '</div>'
    + '<div class="ts-score-label">TrueStar Score</div>'
    + '</div>'
    + '<div class="ts-headline">' + (data.headline || '') + '</div>'
    + '<div class="ts-count">' + (data.reviewsCounted || 0) + ' of ' + totalReviews + ' reviews counted</div>'
    + '<div class="ts-bars">' + bars + '</div>';

  if (data.whyAdjusted) {
    html += '<div class="ts-insight"><strong>Why:</strong> ' + data.whyAdjusted + '</div>';
  }
  if (data.omittedSummary) {
    html += '<div class="ts-insight ts-muted"><strong>Ignored:</strong> ' + data.omittedSummary + '</div>';
  }

  resultsEl.innerHTML = html;
}

// ── Init ─────────────────────────────────────────────────────────────────────

function tsInit() {
  if (!tsIsRestaurantPage()) {
    var observer = new MutationObserver(function() {
      if (tsIsRestaurantPage() && !document.getElementById('truestar-fab')) {
        tsInjectSidebar();
      }
    });
    observer.observe(document.body, { childList: true, subtree: false });
    return;
  }
  tsInjectSidebar();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', tsInit);
} else {
  tsInit();
}
