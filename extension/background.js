// TrueStar — Background Service Worker
// Handles cross-origin API calls to gettruestar.com

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === "ANALYZE") {
    fetch("https://www.gettruestar.com/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: request.prompt })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) { sendResponse({ success: true, data: data }); })
    .catch(function(err) { sendResponse({ success: false, error: err.message }); });
    return true;
  }
});
