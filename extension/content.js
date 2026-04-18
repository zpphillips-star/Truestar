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
  // h1 selectors — Maps paints these slowly
  const nameEl = document.querySelector('h1.DUwDvf, h1[class*="fontHeadlineLarge"], h1[class*="tAiQdd"]');
  // Page title is faster: "Restaurant Name - Google Maps"
  const titleName = document.title.replace(/\s*[-–—]\s*Google Maps.*$/i, '').trim();
  const name = nameEl?.textContent?.trim() || (titleName && titleName !== 'Google Maps' ? titleName : null);
  // Rating — try multiple selectors
  const ratingEl = document.querySelector(
    'div.F7nice > span > span[aria-hidden], ' +
    'span.ceNzKf[aria-label], ' +
    'div[jsaction*="pane.rating"] span[aria-hidden]'
  );
  // Also try pulling from the aria-label on the review count button: "4.7 stars 1,234 reviews"
  const reviewBtn = document.querySelector('button[jsaction*="review"], [data-item-id*="rating"]');
  const ariaRating = reviewBtn?.getAttribute('aria-label')?.match(/^([\d.]+)\s*star/i)?.[1];
  const rating = ratingEl?.textContent?.trim() || ariaRating || null;

  const totalEl = document.querySelector('div.F7nice > span:last-child > span[aria-label]');
  return {
    name: name || null,
    rating: rating || '?',
    total: totalEl?.getAttribute('aria-label')?.match(/[\d,]+/)?.[0]?.replace(',', '') || '?'
  };
}

// ── Review scraping ─────────────────────────────────────────────────────────

// Converts Google's relative date strings to years (approximate)
function tsParseAgeYears(dateText) {
  if (!dateText) return 0;
  var t = dateText.toLowerCase();
  if (t.includes('hour') || t.includes('minute') || t.includes('second') || t === 'just now') return 0;
  if (t.includes('day'))   { var n = parseInt(t) || 1; return n / 365; }
  if (t.includes('week'))  { var n = parseInt(t) || 1; return n / 52; }
  if (t.includes('month')) { var n = parseInt(t) || 1; return n / 12; }
  if (t.includes('year'))  { var n = parseInt(t) || 1; return n; }
  return 0; // unknown format — include it
}

function tsScrapeReviews() {
  // Expand any collapsed reviews first
  document.querySelectorAll('button.w8nwRe, [jsaction*="pane.review.expandReview"]').forEach(btn => {
    try { btn.click(); } catch (e) {}
  });

  // Try to scroll the reviews panel to trigger lazy loading
  var scrollPanel = document.querySelector('[role="feed"]')
    || document.querySelector('.m6QErb.DxyBCb')
    || document.querySelector('.m6QErb[aria-label]');
  if (scrollPanel) { scrollPanel.scrollTop += 1200; }

  const reviews = [];
  const seen = new Set();

  document.querySelectorAll('div[data-review-id]').forEach(container => {
    const starEl = container.querySelector('[aria-label*="star"], [aria-label*="Star"], [aria-label*=" stars"]');
    const textEl = container.querySelector('span.wiI7pd, span[class*="review"], .MyEned span');
    const dateEl = container.querySelector('span.rsqaWe, span[class*="date"], .DU9Pgb span');
    const text = textEl?.innerText?.trim();
    if (!text || text.length < 15 || seen.has(text)) return;
    // Filter reviews older than 3 years
    var dateText = dateEl?.innerText?.trim() || '';
    if (dateText && tsParseAgeYears(dateText) > 3) return;
    seen.add(text);
    const ratingMatch = starEl?.getAttribute('aria-label')?.match(/(\d+(\.\d+)?)/);
    reviews.push({ rating: ratingMatch ? parseFloat(ratingMatch[1]) : 3, text: text.substring(0, 600), date: dateText });
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
  // Use the most recent reviews — recency is a feature, not a limitation
  const capped = reviews.slice(0, 50);
  const reviewsText = capped.map((r, i) => 'Review ' + i + ' (' + r.rating + ' stars): "' + r.text + '"').join('\n');

  return 'You are TrueStar, a restaurant rating analyzer focused on recent experience.\n\n'
    + 'Restaurant: ' + restaurant.name + '\n'
    + 'Reviews analyzed (most recent only):\n' + reviewsText + '\n\n'
    + 'User cares ONLY about: ' + weightDesc + '\n'
    + 'IMPORTANT: The user has set all other categories to 0%. Do NOT mention or discuss any category the user did not weight above 0%. Your entire analysis — headline, whyAdjusted, everything — must stay strictly focused on: ' + weightDesc + '\n\n'
    + 'Category definitions:\n'
    + '- food: taste, flavor, dishes, cooking, ingredients, freshness\n'
    + '- price: cost, value, expensive, cheap, portions, worth it\n'
    + '- service: staff, waiters, attentiveness, speed, hospitality\n'
    + '- ambiance: decor, atmosphere, vibe, noise, cleanliness, views\n\n'
    + 'TASK: Analyze the reviews and return ONLY a raw JSON object (no markdown, no backticks, no explanation).\n'
    + 'For each active category: count how many reviews mention it, average their star ratings.\n'
    + 'TrueStar score = weighted average across active categories only.\n'
    + 'headline: one punchy sentence about the restaurant, focused only on the user\'s chosen categories.\n'
    + 'whyAdjusted: explain what the recent reviews say about the user\'s chosen categories. Do NOT mention Google, do NOT compare to any other rating. Only discuss what you found in these reviews.\n\n'
    + '{\n'
    + '  "categoryScores": {"food": 4.2, "price": null, "service": null, "ambiance": null},\n'
    + '  "categoryMentions": {"food": 14, "price": 0, "service": 0, "ambiance": 0},\n'
    + '  "reviewsCounted": 22,\n'
    + '  "reviewsExcluded": 8,\n'
    + '  "trueScore": 4.1,\n'
    + '  "headline": "One punchy sentence about the restaurant focused only on what the user cares about",\n'
    + '  "whyAdjusted": "What the recent reviews say about the user\'s chosen categories — no Google comparison",\n'
    + '  "omittedSummary": "What topics the excluded reviews focused on (do NOT include a count or number)"\n'
    + '}';
}

// ── Sidebar injection ────────────────────────────────────────────────────────

function tsInjectSidebar() {
  if (document.getElementById('truestar-sidebar')) return;

  var fab = document.createElement('button');
  fab.id = 'truestar-fab';
  fab.innerHTML = '<svg width="24" height="22" viewBox="0 0 109.58 100"><path d="M 57.47,0.00 L 54.41,1.53 L 42.91,37.55 L 3.45,44.06 L 0.00,46.74 L 2.30,49.04 L 26.82,56.32 L 36.78,61.30 L 37.16,65.90 L 30.27,95.79 L 31.42,100.00 L 56.32,75.86 L 60.54,76.25 L 73.56,86.59 L 91.19,96.17 L 92.34,92.34 L 79.31,62.84 L 78.93,57.85 L 109.58,35.63 L 108.05,32.95 L 69.73,34.48 Z" fill="#E7A545"/></svg>';
  fab.title = 'TrueStar — Your rating';
  document.body.appendChild(fab);

  var sidebar = document.createElement('div');
  sidebar.id = 'truestar-sidebar';
  sidebar.innerHTML = ''
    + '<div class="ts-header">'
    + '  <span class="ts-logo"><svg width="20" height="18" viewBox="0 0 109.58 100" style="vertical-align:middle;margin-right:6px"><path d="M 57.47,0.00 L 54.41,1.53 L 42.91,37.55 L 3.45,44.06 L 0.00,46.74 L 2.30,49.04 L 26.82,56.32 L 36.78,61.30 L 37.16,65.90 L 30.27,95.79 L 31.42,100.00 L 56.32,75.86 L 60.54,76.25 L 73.56,86.59 L 91.19,96.17 L 92.34,92.34 L 79.31,62.84 L 78.93,57.85 L 109.58,35.63 L 108.05,32.95 L 69.73,34.48 Z" fill="#E7A545"/></svg>TrueStar</span>'
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

function tsUpdateSliderTrack(el) {
  var pct = ((el.value - el.min) / (el.max - el.min)) * 100;
  el.style.background = 'linear-gradient(to right, #E7A545 0%, #E7A545 ' + pct + '%, #E0DDD8 ' + pct + '%, #E0DDD8 100%)';
}

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
    var slider = document.getElementById('ts-slider-' + cat.id);
    slider.addEventListener('input', function(e) {
      tsWeights[cat.id] = parseInt(e.target.value);
      tsNormalize(cat.id);
      tsUpdateSliders();
    });
    tsUpdateSliderTrack(slider);
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
    if (s) { s.value = tsWeights[cat.id]; tsUpdateSliderTrack(s); }
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

// ── Auto-load reviews ────────────────────────────────────────────────────────

function tsClickReviewsTab() {
  // Try several selectors Google Maps uses for the Reviews tab
  var tab = document.querySelector('button[aria-label*="Reviews"]')
    || Array.from(document.querySelectorAll('button[role="tab"]')).find(function(b) {
         return b.textContent.trim().toLowerCase().includes('review');
       })
    || document.querySelector('[jsaction*="pane.reviews"]');
  if (tab) { try { tab.click(); } catch(e) {} }
}

function tsGetScrollPanel() {
  return document.querySelector('[role="feed"]')
    || document.querySelector('.m6QErb.DxyBCb.kA9KIf')
    || document.querySelector('.m6QErb.DxyBCb')
    || document.querySelector('.m6QErb[aria-label]');
}

// Scroll the reviews panel, collecting reviews at every step (handles Maps virtualization)
function tsAutoLoadReviews(onDone) {
  var btn = document.getElementById('ts-analyze');
  var resultsEl = document.getElementById('ts-results');

  tsClickReviewsTab();

  var collected = {};  // keyed by text — survives DOM removal
  var attempts = 0;
  var maxAttempts = 60;
  var maxReviews  = 100;
  var lastCount = 0;
  var stableRounds = 0;

  btn.textContent = 'Loading reviews...';
  resultsEl.innerHTML = '<div class="ts-loading">📜 ' + tsGetTagline() + '</div>';

  function collectNow() {
    // Expand collapsed reviews
    document.querySelectorAll('button.w8nwRe, [jsaction*="pane.review.expandReview"]').forEach(function(b) {
      try { b.click(); } catch(e) {}
    });
    document.querySelectorAll('div[data-review-id]').forEach(function(container) {
      var starEl = container.querySelector('[aria-label*="star"], [aria-label*="Star"], [aria-label*=" stars"]');
      var textEl = container.querySelector('span.wiI7pd, span[class*="review"], .MyEned span');
      var text = textEl ? textEl.innerText.trim() : null;
      if (!text || text.length < 15 || collected[text]) return;
      var ratingMatch = starEl ? starEl.getAttribute('aria-label').match(/(\d+(\.\d+)?)/) : null;
      collected[text] = { rating: ratingMatch ? parseFloat(ratingMatch[1]) : 3, text: text.substring(0, 600) };
    });
  }

  function scrollStep() {
    collectNow(); // grab whatever is in the DOM right now before scrolling removes it

    var collectedCount = Object.keys(collected).length;
    if (btn) btn.textContent = 'Loading… (' + collectedCount + ' reviews)';

    if (collectedCount === lastCount) {
      stableRounds++;
    } else {
      stableRounds = 0;
    }
    lastCount = collectedCount;

    if (stableRounds >= 8 || attempts >= maxAttempts || collectedCount >= maxReviews) {
      btn.textContent = 'Analyzing...';
      resultsEl.innerHTML = '';
      onDone(Object.values(collected));
      return;
    }

    var panel = tsGetScrollPanel();
    if (panel) panel.scrollTop = panel.scrollHeight;
    attempts++;
    setTimeout(scrollStep, 1500);
  }

  setTimeout(scrollStep, 1200);
}

// ── Rotating taglines (daily) ─────────────────────────────────────────────────
var TS_TAGLINES = [
  "Pulling the most recent reviews — because we've all seen an unrecognizable 10-year-old profile picture.",
  "Reading fresh reviews, not the ones from when this place still had a fax number.",
  "Skipping the 2014 reviews — the chef has probably changed since then.",
  "Recent reviews only — because that 5-star from 2011 isn't feeding anyone today.",
  "Grabbing the latest takes — old reviews are like old Yelp photos: deeply suspicious.",
  "Loading fresh opinions — the internet never forgets, but we only care about lately.",
  "Pulling recent reviews — not the ones your uncle wrote after the place 'really found itself.'",
  "Recent reviews only — restaurants evolve. Some for better. Some for worse. Let's find out."
];
function tsGetTagline() {
  var dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  return TS_TAGLINES[dayOfYear % TS_TAGLINES.length];
}

// ── Analysis ─────────────────────────────────────────────────────────────────

function tsRunAnalysis() {
  var btn = document.getElementById('ts-analyze');
  var resultsEl = document.getElementById('ts-results');

  btn.textContent = 'Loading…';
  btn.disabled = true;
  resultsEl.innerHTML = '';

  // Auto-load all reviews first (reviews passed directly from scroll collector)
  tsAutoLoadReviews(function(reviews) {

    if (reviews.length === 0) {
      resultsEl.innerHTML = '<div class="ts-error">No reviews found. Make sure you can see reviews on this page, then try again.</div>';
      btn.textContent = 'Analyze';
      btn.disabled = false;
      return;
    }

    var prompt = tsBuildPrompt(tsRestaurant, reviews, tsWeights);

    // Guard: chrome.runtime can become undefined if extension is reloaded while tab is open
    if (!chrome.runtime) {
      resultsEl.innerHTML = '<div class="ts-error">Extension was reloaded — please refresh this tab and try again.</div>';
      btn.textContent = 'Analyze';
      btn.disabled = false;
      return;
    }

    chrome.runtime.sendMessage({ type: 'ANALYZE', prompt: prompt }, function(response) {
      btn.textContent = 'Analyze';
      btn.disabled = false;

      if (!response || !response.success) {
        resultsEl.innerHTML = '<div class="ts-error">Analysis failed. Check your connection and try again.</div>';
      return;
    }

    try {
      console.log('[TrueStar] raw response:', JSON.stringify(response));

      // Check for API-level errors (rate limit, server error, etc.)
      if (response.data && response.data.error) {
        var apiErr = response.data.error.toLowerCase();
        if (apiErr.includes('too many') || apiErr.includes('rate')) {
          resultsEl.innerHTML = '<div class="ts-error">Too many requests — wait a moment and try again.</div>';
        } else {
          resultsEl.innerHTML = '<div class="ts-error">API error: ' + response.data.error + '</div>';
        }
        return;
      }

      var blocks = response.data.content;
      var textBlock = null;
      for (var i = 0; i < blocks.length; i++) {
        if (blocks[i].type === 'text') { textBlock = blocks[i].text; break; }
      }
      console.log('[TrueStar] raw text block:', textBlock);
      var cleaned = textBlock.replace(/```json/gi, '').replace(/```/g, '').trim();
      var jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found in response');
      var parsed = JSON.parse(jsonMatch[0]);
      tsDisplayResults(parsed, Math.min(reviews.length, 50));
    } catch (e) {
      console.error('[TrueStar] parse error:', e);
      console.error('[TrueStar] full response was:', JSON.stringify(response));
      resultsEl.innerHTML = '<div class="ts-error">Could not parse results. Try again.</div>';
    }
    }); // end sendMessage
  }); // end tsAutoLoadReviews
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
      + '<div class="ts-cat-name">' + c.emoji + ' ' + c.label + ' <span class="ts-cat-mentions">' + mentions + ' reviews</span></div>'
      + '<div class="ts-bar-wrap"><div class="ts-bar" style="width:' + pct.toFixed(1) + '%"></div></div>'
      + '<div class="ts-cat-score">' + s.toFixed(1) + '</div>'
      + '</div>';
  });

  var html = '<div class="ts-score-block">'
    + '<div class="ts-big-score">' + score.toFixed(1) + '</div>'
    + '<div class="ts-stars">' + stars + '</div>'
    + '<div class="ts-score-label">TrueStar Score</div>'
    + (tsRestaurant.rating && tsRestaurant.rating !== '?' ? '<div class="ts-google-compare">vs. Google ' + tsRestaurant.rating + ' ★</div>' : '')
    + '</div>'
    + '<div class="ts-headline">' + (data.headline || '') + '</div>'
    + '<div class="ts-count">' + (data.reviewsCounted || 0) + ' recent reviews address your preferences.</div>'
    + '<div class="ts-bars">' + bars + '</div>';

  if (data.whyAdjusted) {
    html += '<div class="ts-insight"><strong>Why:</strong> ' + data.whyAdjusted + '</div>';
  }
  if (data.omittedSummary && !data.omittedSummary.toLowerCase().includes('no review')) {
    // Strip any leading "N reviews [verb] " pattern Claude might include
    var ignoredText = data.omittedSummary
      .replace(/^\d+\s+reviews?\s+\w+\s*/i, '')
      .replace(/^./, function(c) { return c.toUpperCase(); });
    html += '<div class="ts-insight ts-muted"><strong>Ignored:</strong> ' + ignoredText + '</div>';
  }

  resultsEl.innerHTML = html;
}

// ── Init ─────────────────────────────────────────────────────────────────────

function tsRefreshForNewPlace() {
  // Retry until both name AND rating are found (up to 15x, 300ms gaps)
  var attempts = 0;
  var nameTimer = setInterval(function() {
    var info = tsGetRestaurantInfo();
    attempts++;
    var gotName = info.name;
    var gotRating = info.rating && info.rating !== '?';
    if ((gotName && gotRating) || attempts >= 15) {
      clearInterval(nameTimer);
      tsRestaurant = {
        name: info.name || document.title.replace(/\s*[-–—]\s*Google Maps.*$/i, '').trim() || 'Unknown Restaurant',
        rating: gotRating ? info.rating : tsRestaurant.rating,
        total: info.total
      };
      var nameEl = document.getElementById('ts-restaurant-name');
      if (nameEl) nameEl.textContent = tsRestaurant.name;
    }
  }, 300);

  // Clear old results only on new location — not on sidebar open/close
  var resultsEl = document.getElementById('ts-results');
  if (resultsEl) resultsEl.innerHTML = '';
  var btn = document.getElementById('ts-analyze');
  if (btn) { btn.textContent = 'Analyze'; btn.disabled = false; }
}

function tsInit() {
  let lastUrl = window.location.href;

  // Inject immediately if already on a restaurant page
  if (tsIsRestaurantPage() && !document.getElementById('truestar-fab')) {
    tsInjectSidebar();
  }

  // Poll for URL changes (SPA — Maps doesn't fire popstate reliably)
  setInterval(function() {
    var currentUrl = window.location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      if (tsIsRestaurantPage()) {
        if (!document.getElementById('truestar-fab')) {
          setTimeout(tsInjectSidebar, 600);
        } else {
          // Sidebar already exists — just refresh for the new place
          setTimeout(tsRefreshForNewPlace, 600);
        }
      }
    }
  }, 500);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', tsInit);
} else {
  tsInit();
}
