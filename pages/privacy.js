import Head from "next/head";

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy — TrueStar</title>
        <meta name="description" content="TrueStar privacy policy. We don't collect, store, or share your data. Your preferences stay on your device." />
        <link rel="icon" href="/icon128.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Lato', -apple-system, BlinkMacSystemFont, sans-serif; background: #F4EFE6; color: #2D2D2D; }
        a { cursor: pointer; color: #E63946; text-decoration: none; }
        a:hover { opacity: 0.88; text-decoration: underline; }
        h2 { font-size: 22px; font-weight: 700; margin-bottom: 10px; margin-top: 36px; color: #2D2D2D; }
        p { font-size: 16px; line-height: 1.75; color: #444; margin-bottom: 14px; }
        ul { padding-left: 22px; margin-bottom: 14px; }
        ul li { font-size: 16px; line-height: 1.75; color: #444; margin-bottom: 6px; }
      `}</style>

      {/* Nav */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", borderBottom: "1px solid #E5DDD0", background: "#F4EFE6" }}>
        <a href="/" style={{ color: "inherit", textDecoration: "none" }}>
          <svg width="221" height="28" viewBox="0 0 789.7 100" xmlns="http://www.w3.org/2000/svg"><path d="M 57.47,0.00 L 54.41,1.53 L 42.91,37.55 L 3.45,44.06 L 0.00,46.74 L 2.30,49.04 L 26.82,56.32 L 36.78,61.30 L 37.16,65.90 L 30.27,95.79 L 31.42,100.00 L 56.32,75.86 L 60.54,76.25 L 73.56,86.59 L 91.19,96.17 L 92.34,92.34 L 79.31,62.84 L 78.93,57.85 L 109.58,35.63 L 108.05,32.95 L 69.73,34.48 Z" fill="#E7A545"/><g transform="translate(127.6,0)" fill="#38301f"><path d="M 22.5,0.0 L 19.5,2.4 L 17.8,7.7 L 13.0,16.6 L 6.5,23.1 L 0.0,27.8 L 0.0,31.4 L 2.4,33.1 L 10.7,33.1 L 13.0,36.7 L 13.6,68.0 L 12.4,82.8 L 15.4,91.1 L 18.9,94.7 L 24.3,97.6 L 33.7,98.2 L 46.2,92.9 L 48.5,90.5 L 48.5,87.6 L 46.7,85.8 L 43.8,85.8 L 37.3,88.8 L 31.4,88.2 L 27.8,85.2 L 26.0,81.7 L 24.9,76.9 L 24.9,37.3 L 26.0,34.3 L 27.8,33.1 L 45.0,32.5 L 46.7,30.8 L 46.7,26.0 L 44.4,24.3 L 28.4,24.3 L 26.0,21.9 L 25.4,16.6 L 26.6,11.8 L 26.6,2.4 L 25.4,0.6 Z" fillRule="evenodd"/><path d="M 95.3,23.7 L 87.6,29.0 L 82.2,31.4 L 79.9,33.7 L 79.9,36.7 L 81.7,38.5 L 85.2,39.6 L 88.2,42.6 L 89.3,45.6 L 89.9,55.0 L 88.8,66.9 L 89.9,72.2 L 89.9,83.4 L 88.8,88.2 L 86.4,90.5 L 80.5,91.7 L 79.3,93.5 L 79.3,95.9 L 81.7,97.6 L 100.6,97.0 L 111.8,97.6 L 114.2,96.4 L 114.8,93.5 L 111.8,91.1 L 107.7,91.1 L 104.1,89.9 L 101.8,86.4 L 101.2,72.2 L 102.4,64.5 L 101.2,58.0 L 101.2,47.9 L 104.1,42.0 L 108.3,37.9 L 111.8,36.1 L 116.0,36.1 L 122.5,39.6 L 129.0,39.1 L 132.0,35.5 L 132.5,30.2 L 128.4,24.9 L 125.4,23.7 L 121.9,23.7 L 113.0,27.2 L 104.7,34.3 L 102.4,34.3 L 100.6,32.5 L 100.0,25.4 L 98.2,23.7 Z" fillRule="evenodd"/><path d="M 161.5,28.4 L 162.1,32.0 L 168.6,34.3 L 172.2,40.2 L 173.4,81.7 L 176.3,89.3 L 179.3,92.9 L 187.6,97.6 L 194.7,98.2 L 204.7,95.3 L 217.2,88.2 L 219.5,88.2 L 221.3,90.5 L 221.9,96.4 L 223.7,98.2 L 229.0,98.2 L 243.2,91.1 L 243.8,88.2 L 242.0,86.4 L 236.7,85.8 L 233.7,82.8 L 232.5,79.3 L 232.0,63.9 L 233.1,55.6 L 232.0,35.5 L 234.3,28.4 L 232.0,24.9 L 210.7,24.9 L 208.3,26.6 L 207.7,28.4 L 210.1,31.4 L 216.0,32.5 L 219.5,36.7 L 221.3,73.4 L 219.5,78.7 L 216.6,81.7 L 207.7,87.0 L 201.8,88.2 L 192.3,86.4 L 188.8,83.4 L 185.8,78.1 L 184.0,51.5 L 185.2,30.2 L 184.0,25.4 L 178.1,23.7 L 173.4,25.4 L 164.5,26.0 Z" fillRule="evenodd"/><path d="M 298.8,23.1 L 292.9,24.9 L 287.6,27.8 L 278.1,36.7 L 274.0,43.2 L 269.8,55.6 L 269.8,66.3 L 271.6,74.0 L 277.5,85.8 L 284.0,92.3 L 291.7,97.0 L 301.2,99.4 L 310.1,99.4 L 318.3,96.4 L 324.9,92.3 L 330.2,86.4 L 330.2,81.7 L 326.6,82.2 L 321.9,87.0 L 315.4,89.9 L 305.3,90.5 L 298.2,88.2 L 294.7,85.8 L 287.0,76.9 L 283.4,66.3 L 283.4,58.6 L 286.4,56.2 L 290.5,55.6 L 326.0,55.6 L 328.4,55.0 L 330.8,52.7 L 330.8,47.9 L 329.6,42.6 L 326.6,36.1 L 320.7,29.6 L 310.7,24.3 L 305.9,23.1 Z M 317.8,41.4 L 317.8,45.0 L 317.2,46.2 L 314.2,49.1 L 313.0,49.7 L 310.1,50.3 L 289.9,50.3 L 287.6,49.7 L 286.4,49.1 L 285.2,47.9 L 284.6,46.2 L 285.2,43.2 L 288.2,37.9 L 294.1,32.0 L 296.4,30.8 L 300.6,29.6 L 304.7,29.6 L 308.9,30.8 L 312.4,33.1 L 314.8,35.5 L 316.0,37.3 Z" fillRule="evenodd"/><path d="M 383.4,23.7 L 373.4,27.2 L 368.0,32.0 L 364.5,39.1 L 363.9,48.5 L 365.7,53.3 L 370.4,59.2 L 375.1,62.7 L 392.9,70.4 L 398.8,75.7 L 400.0,78.7 L 400.0,85.2 L 397.0,89.9 L 394.7,91.7 L 389.9,93.5 L 385.2,93.5 L 379.3,91.7 L 365.7,77.5 L 362.7,79.3 L 362.7,84.0 L 364.5,93.5 L 367.5,97.0 L 375.7,97.0 L 383.4,99.4 L 390.5,99.4 L 398.8,96.4 L 404.1,92.3 L 408.3,85.8 L 410.1,76.3 L 407.1,66.3 L 401.8,60.4 L 393.5,55.6 L 380.5,50.9 L 375.1,46.2 L 373.4,41.4 L 374.0,36.7 L 378.7,31.4 L 381.7,30.2 L 388.2,30.2 L 391.7,31.4 L 403.0,43.2 L 404.7,43.2 L 406.5,41.4 L 404.7,29.6 L 402.4,26.0 L 395.9,26.0 Z" fillRule="evenodd"/><path d="M 463.3,0.0 L 460.9,2.4 L 455.6,14.8 L 447.9,23.1 L 441.4,27.8 L 441.4,30.8 L 444.4,33.1 L 452.1,33.1 L 454.4,36.1 L 455.0,68.0 L 453.8,82.8 L 455.0,87.6 L 456.8,91.1 L 462.1,95.9 L 467.5,98.2 L 475.1,98.2 L 485.8,94.1 L 489.9,90.5 L 490.5,88.8 L 488.8,85.8 L 485.8,85.8 L 478.7,88.8 L 475.1,88.8 L 471.0,87.0 L 467.5,81.7 L 466.3,76.9 L 466.3,36.7 L 466.9,34.9 L 469.2,33.1 L 485.2,33.1 L 488.2,30.2 L 488.2,26.6 L 485.8,24.3 L 473.4,24.9 L 469.8,24.3 L 467.5,21.9 L 466.9,17.2 L 468.0,13.0 L 468.0,2.4 L 466.3,0.0 Z" fillRule="evenodd"/><path d="M 527.8,29.0 L 522.5,33.1 L 520.1,36.7 L 519.5,43.2 L 521.9,46.2 L 530.2,46.2 L 534.3,42.6 L 537.3,34.9 L 540.2,32.0 L 548.5,30.2 L 552.7,31.4 L 557.4,36.1 L 559.8,46.2 L 559.2,53.3 L 556.2,56.2 L 538.5,62.7 L 532.0,63.9 L 524.9,68.0 L 520.1,72.8 L 518.3,76.9 L 518.3,85.8 L 520.7,91.1 L 526.6,96.4 L 534.9,99.4 L 547.3,96.4 L 558.6,89.9 L 560.4,90.5 L 562.7,94.1 L 568.0,98.2 L 575.7,97.6 L 582.8,92.3 L 584.6,89.9 L 584.6,87.6 L 583.4,86.4 L 578.7,88.2 L 574.0,88.2 L 571.0,84.0 L 570.4,38.5 L 566.3,29.6 L 561.5,25.4 L 555.0,23.1 L 545.6,23.1 L 539.1,24.3 Z M 557.4,62.1 L 558.6,63.3 L 559.2,65.1 L 559.2,79.9 L 558.6,81.7 L 557.4,82.8 L 557.4,83.4 L 553.3,87.0 L 550.3,88.8 L 547.3,89.9 L 544.4,90.5 L 541.4,90.5 L 539.6,89.9 L 536.1,88.2 L 534.3,86.4 L 533.1,84.6 L 532.5,82.8 L 532.5,76.9 L 533.1,75.1 L 534.9,72.8 L 537.3,70.4 L 539.6,68.6 L 546.2,65.1 L 553.8,62.1 L 556.2,61.5 Z" fillRule="evenodd"/><path d="M 623.7,23.7 L 616.0,29.0 L 610.7,31.4 L 608.3,33.7 L 608.3,36.7 L 610.1,38.5 L 615.4,40.8 L 617.8,44.4 L 618.3,46.7 L 617.8,66.9 L 618.9,73.4 L 618.3,86.4 L 616.0,89.9 L 609.5,91.7 L 608.3,92.9 L 608.3,95.9 L 610.1,97.6 L 640.8,97.6 L 643.2,95.9 L 643.8,94.1 L 643.2,92.9 L 640.8,91.1 L 636.7,91.1 L 633.1,89.9 L 631.4,88.2 L 630.2,84.0 L 630.8,60.4 L 629.6,54.4 L 630.2,46.7 L 633.1,41.4 L 640.8,36.1 L 645.0,36.1 L 651.5,39.6 L 658.0,39.1 L 660.9,34.9 L 661.5,30.8 L 660.4,27.8 L 657.4,24.9 L 654.4,23.7 L 650.9,23.7 L 642.0,27.2 L 633.1,34.3 L 630.8,34.3 L 629.0,32.0 L 629.0,26.6 L 627.8,24.3 Z" fillRule="evenodd"/></g></svg>
        </a>
        <a
          href="https://chromewebstore.google.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ background: "#E63946", color: "#fff", padding: "10px 22px", borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: "none" }}
        >
          Add to Chrome — Free
        </a>
      </nav>

      {/* Content */}
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "60px 24px 80px" }}>
        <h1 style={{ fontSize: 40, fontWeight: 900, lineHeight: 1.15, marginBottom: 8, letterSpacing: -0.5 }}>Privacy Policy</h1>
        <p style={{ fontSize: 14, color: "#999", marginBottom: 40 }}>Last updated: April 17, 2025</p>

        <p>
          TrueStar is built with a simple privacy principle: <strong>your data stays on your device.</strong> We don't collect it, we don't store it, and we don't sell it.
        </p>

        <h2>What we collect</h2>
        <p>Nothing. TrueStar does not collect any personal information, browsing history, location data, or usage analytics.</p>

        <h2>What stays on your device</h2>
        <p>Your rating preferences (food quality weight, service weight, value weight, vibe weight) are stored locally using your browser's built-in storage (<code>chrome.storage.local</code>). This data:</p>
        <ul>
          <li>Never leaves your device</li>
          <li>Is never transmitted to us or any third party</li>
          <li>Can be cleared at any time by removing the extension</li>
        </ul>

        <h2>How the AI analysis works</h2>
        <p>
          When you request a TrueStar score for a restaurant, the extension reads review text from the Google Maps page you are viewing and sends it to the <a href="https://www.anthropic.com" target="_blank" rel="noopener noreferrer">Anthropic Claude API</a> for analysis. This request:
        </p>
        <ul>
          <li>Contains only the public review text visible on that Google Maps page</li>
          <li>Does not include your name, account information, location, or any identifying data</li>
          <li>Is processed by Anthropic under their <a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noopener noreferrer">privacy policy</a></li>
        </ul>
        <p>We do not log, store, or have access to these API requests.</p>

        <h2>Third-party services</h2>
        <p>TrueStar uses the following third-party service:</p>
        <ul>
          <li><strong>Anthropic Claude API</strong> — for natural language analysis of review text. See <a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noopener noreferrer">Anthropic's Privacy Policy</a>.</li>
        </ul>
        <p>TrueStar does not use Google Analytics, advertising networks, tracking pixels, or any other data collection services.</p>

        <h2>Permissions</h2>
        <p>TrueStar requests the following browser permissions:</p>
        <ul>
          <li><strong>Access to maps.google.com</strong> — to read restaurant review content from pages you are actively viewing. The extension only activates on Google Maps restaurant pages.</li>
          <li><strong>Storage</strong> — to save your rating preferences locally between sessions.</li>
        </ul>

        <h2>Children's privacy</h2>
        <p>TrueStar does not knowingly collect any information from children under the age of 13. The extension collects no personal data from any users.</p>

        <h2>Changes to this policy</h2>
        <p>If we make material changes to this policy, we will update the date at the top of this page. Continued use of the extension after any changes constitutes acceptance of the updated policy.</p>

        <h2>Contact</h2>
        <p>
          Questions about this privacy policy? Email us at{" "}
          <a href="mailto:hello@gettruestar.com">hello@gettruestar.com</a>.
        </p>

        <div style={{ marginTop: 56, paddingTop: 32, borderTop: "1px solid #E5DDD0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <a href="/" style={{ fontSize: 14, color: "#888", textDecoration: "none" }}>← Back to TrueStar</a>
          <a
            href="https://chromewebstore.google.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ background: "#E63946", color: "#fff", padding: "12px 28px", borderRadius: 8, fontWeight: 700, fontSize: 15, textDecoration: "none" }}
          >
            Add to Chrome — Free
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #E5DDD0", padding: "28px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, background: "#F4EFE6" }}>
        <p style={{ fontSize: 13, color: "#aaa", margin: 0 }}>© 2025 TrueStar. Free. Private. No account needed.</p>
        <div style={{ display: "flex", gap: 24 }}>
          <a href="/privacy" style={{ fontSize: 13, color: "#888", textDecoration: "none" }}>Privacy Policy</a>
        </div>
      </footer>
    </>
  );
}
