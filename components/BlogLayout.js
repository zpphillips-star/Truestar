import Head from "next/head";
import Link from "next/link";

const EXTENSION_URL =
  "https://chromewebstore.google.com/detail/truestar/bondnchgjfoofjjdlmpkponeppngnolh";
const SITE_URL = "https://gettruestar.com";

export default function BlogLayout({ children, meta }) {
  const {
    title,
    description,
    slug,
    publishDate,
    readingTime = "4 min read",
  } = meta;

  const canonicalUrl = `${SITE_URL}/blog/${slug}`;
  const ogImage = `${SITE_URL}/og-image.png`;

  return (
    <>
      <Head>
        <title>{title} — TrueStar</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:title" content={`${title} — TrueStar`} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="TrueStar" />
        <meta property="article:published_time" content={publishDate} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${title} — TrueStar`} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />

        {/* JSON-LD Article structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: title,
              description: description,
              image: ogImage,
              url: canonicalUrl,
              datePublished: publishDate,
              publisher: {
                "@type": "Organization",
                name: "TrueStar",
                url: SITE_URL,
                logo: {
                  "@type": "ImageObject",
                  url: ogImage,
                },
              },
            }),
          }}
        />

        {/* JSON-LD BreadcrumbList structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: SITE_URL,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Blog",
                  item: `${SITE_URL}/blog`,
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: title,
                  item: canonicalUrl,
                },
              ],
            }),
          }}
        />

        <link rel="icon" href="/icon128.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
      </Head>

      <style jsx global>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        body {
          font-family: "Lato", -apple-system, BlinkMacSystemFont, sans-serif;
          background: #f4efe6;
          color: #2d2d2d;
        }
        a {
          cursor: pointer;
        }
        a:hover {
          opacity: 0.88;
        }
        .blog-body h2 {
          font-size: 22px;
          font-weight: 900;
          margin: 36px 0 12px;
          color: #2d2d2d;
        }
        .blog-body h3 {
          font-size: 18px;
          font-weight: 700;
          margin: 28px 0 10px;
          color: #2d2d2d;
        }
        .blog-body p {
          font-size: 17px;
          line-height: 1.75;
          color: #444;
          margin-bottom: 20px;
        }
        .blog-body ul,
        .blog-body ol {
          margin: 0 0 20px 24px;
        }
        .blog-body li {
          font-size: 17px;
          line-height: 1.75;
          color: #444;
          margin-bottom: 8px;
        }
        .blog-body a {
          color: #e8563a;
          text-decoration: underline;
        }
        .blog-body strong {
          font-weight: 700;
          color: #2d2d2d;
        }
        .blog-cta-box {
          background: #e8563a;
          color: #fff;
          border-radius: 12px;
          padding: 28px 32px;
          margin: 40px 0;
          text-align: center;
        }
        .blog-cta-box p {
          color: rgba(255, 255, 255, 0.9) !important;
          margin-bottom: 16px;
        }
        .blog-cta-btn {
          display: inline-block;
          background: #fff;
          color: #e8563a !important;
          padding: 12px 28px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 15px;
          text-decoration: none !important;
        }
        .blog-breadcrumb {
          font-size: 13px;
          color: #999;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }
        .blog-breadcrumb a {
          color: #6a5a3a;
          text-decoration: none;
        }
        .blog-breadcrumb a:hover {
          color: #E8563A;
          opacity: 1;
        }
        .blog-breadcrumb span {
          color: #bbb;
        }
        @media (max-width: 600px) {
          .blog-nav-links {
            display: none !important;
          }
        }
      `}</style>

      {/* Nav */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "18px 40px",
          borderBottom: "1px solid #E5DDD0",
          background: "#F4EFE6",
        }}
      >
        <Link
          href="/"
          style={{ textDecoration: "none", color: "#2D2D2D", display: "flex", alignItems: "center" }}
        >
          <svg
            width="140"
            height="18"
            viewBox="0 0 789.7 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 57.47,0.00 L 54.41,1.53 L 42.91,37.55 L 3.45,44.06 L 0.00,46.74 L 2.30,49.04 L 26.82,56.32 L 36.78,61.30 L 37.16,65.90 L 30.27,95.79 L 31.42,100.00 L 56.32,75.86 L 60.54,76.25 L 73.56,86.59 L 91.19,96.17 L 92.34,92.34 L 79.31,62.84 L 78.93,57.85 L 109.58,35.63 L 108.05,32.95 L 69.73,34.48 Z"
              fill="#E7A545"
            />
            <g transform="translate(127.6,0)" fill="#38301f">
              <path
                d="M 22.5,0.0 L 19.5,2.4 L 17.8,7.7 L 13.0,16.6 L 6.5,23.1 L 0.0,27.8 L 0.0,31.4 L 2.4,33.1 L 10.7,33.1 L 13.0,36.7 L 13.6,68.0 L 12.4,82.8 L 15.4,91.1 L 18.9,94.7 L 24.3,97.6 L 33.7,98.2 L 46.2,92.9 L 48.5,90.5 L 48.5,87.6 L 46.7,85.8 L 43.8,85.8 L 37.3,88.8 L 31.4,88.2 L 27.8,85.2 L 26.0,81.7 L 24.9,76.9 L 24.9,37.3 L 26.0,34.3 L 27.8,33.1 L 45.0,32.5 L 46.7,30.8 L 46.7,26.0 L 44.4,24.3 L 28.4,24.3 L 26.0,21.9 L 25.4,16.6 L 26.6,11.8 L 26.6,2.4 L 25.4,0.6 Z"
                fillRule="evenodd"
              />
              <path
                d="M 95.3,23.7 L 87.6,29.0 L 82.2,31.4 L 79.9,33.7 L 79.9,36.7 L 81.7,38.5 L 85.2,39.6 L 88.2,42.6 L 89.3,45.6 L 89.9,55.0 L 88.8,66.9 L 89.9,72.2 L 89.9,83.4 L 88.8,88.2 L 86.4,90.5 L 80.5,91.7 L 79.3,93.5 L 79.3,95.9 L 81.7,97.6 L 100.6,97.0 L 111.8,97.6 L 114.2,96.4 L 114.8,93.5 L 111.8,91.1 L 107.7,91.1 L 104.1,89.9 L 101.8,86.4 L 101.2,72.2 L 102.4,64.5 L 101.2,58.0 L 101.2,47.9 L 104.1,42.0 L 108.3,37.9 L 111.8,36.1 L 116.0,36.1 L 122.5,39.6 L 129.0,39.1 L 132.0,35.5 L 132.5,30.2 L 128.4,24.9 L 125.4,23.7 L 121.9,23.7 L 113.0,27.2 L 104.7,34.3 L 102.4,34.3 L 100.6,32.5 L 100.0,25.4 L 98.2,23.7 Z"
                fillRule="evenodd"
              />
              <path
                d="M 161.5,28.4 L 162.1,32.0 L 168.6,34.3 L 172.2,40.2 L 173.4,81.7 L 176.3,89.3 L 179.3,92.9 L 187.6,97.6 L 194.7,98.2 L 204.7,95.3 L 217.2,88.2 L 219.5,88.2 L 221.3,90.5 L 221.9,96.4 L 223.7,98.2 L 229.0,98.2 L 243.2,91.1 L 243.8,88.2 L 242.0,86.4 L 236.7,85.8 L 233.7,82.8 L 232.5,79.3 L 232.0,63.9 L 233.1,55.6 L 232.0,35.5 L 234.3,28.4 L 232.0,24.9 L 210.7,24.9 L 208.3,26.6 L 207.7,28.4 L 210.1,31.4 L 216.0,32.5 L 219.5,36.7 L 221.3,73.4 L 219.5,78.7 L 216.6,81.7 L 207.7,87.0 L 201.8,88.2 L 192.3,86.4 L 188.8,83.4 L 185.8,78.1 L 184.0,51.5 L 185.2,30.2 L 184.0,25.4 L 178.1,23.7 L 173.4,25.4 L 164.5,26.0 Z"
                fillRule="evenodd"
              />
              <path
                d="M 298.8,23.1 L 292.9,24.9 L 287.6,27.8 L 278.1,36.7 L 274.0,43.2 L 269.8,55.6 L 269.8,66.3 L 271.6,74.0 L 277.5,85.8 L 284.0,92.3 L 291.7,97.0 L 301.2,99.4 L 310.1,99.4 L 318.3,96.4 L 324.9,92.3 L 330.2,86.4 L 330.2,81.7 L 326.6,82.2 L 321.9,87.0 L 315.4,89.9 L 305.3,90.5 L 298.2,88.2 L 294.7,85.8 L 287.0,76.9 L 283.4,66.3 L 283.4,58.6 L 286.4,56.2 L 290.5,55.6 L 326.0,55.6 L 328.4,55.0 L 330.8,52.7 L 330.8,47.9 L 329.6,42.6 L 326.6,36.1 L 320.7,29.6 L 310.7,24.3 L 305.9,23.1 Z M 317.8,41.4 L 317.8,45.0 L 317.2,46.2 L 314.2,49.1 L 313.0,49.7 L 310.1,50.3 L 289.9,50.3 L 287.6,49.7 L 286.4,49.1 L 285.2,47.9 L 284.6,46.2 L 285.2,43.2 L 288.2,37.9 L 294.1,32.0 L 296.4,30.8 L 300.6,29.6 L 304.7,29.6 L 308.9,30.8 L 312.4,33.1 L 314.8,35.5 L 316.0,37.3 Z"
                fillRule="evenodd"
              />
              <path
                d="M 383.4,23.7 L 373.4,27.2 L 368.0,32.0 L 364.5,39.1 L 363.9,48.5 L 365.7,53.3 L 370.4,59.2 L 375.1,62.7 L 392.9,70.4 L 398.8,75.7 L 400.0,78.7 L 400.0,85.2 L 397.0,89.9 L 394.7,91.7 L 389.9,93.5 L 385.2,93.5 L 379.3,91.7 L 365.7,77.5 L 362.7,79.3 L 362.7,84.0 L 364.5,93.5 L 367.5,97.0 L 375.7,97.0 L 383.4,99.4 L 390.5,99.4 L 398.8,96.4 L 404.1,92.3 L 408.3,85.8 L 410.1,76.3 L 407.1,66.3 L 401.8,60.4 L 393.5,55.6 L 380.5,50.9 L 375.1,46.2 L 373.4,41.4 L 374.0,36.7 L 378.7,31.4 L 381.7,30.2 L 388.2,30.2 L 391.7,31.4 L 403.0,43.2 L 404.7,43.2 L 406.5,41.4 L 404.7,29.6 L 402.4,26.0 L 395.9,26.0 Z"
                fillRule="evenodd"
              />
              <path
                d="M 463.3,0.0 L 460.9,2.4 L 455.6,14.8 L 447.9,23.1 L 441.4,27.8 L 441.4,30.8 L 444.4,33.1 L 452.1,33.1 L 454.4,36.1 L 455.0,68.0 L 453.8,82.8 L 455.0,87.6 L 456.8,91.1 L 462.1,95.9 L 467.5,98.2 L 475.1,98.2 L 485.8,94.1 L 489.9,90.5 L 490.5,88.8 L 488.8,85.8 L 485.8,85.8 L 478.7,88.8 L 475.1,88.8 L 471.0,87.0 L 467.5,81.7 L 466.3,76.9 L 466.3,36.7 L 466.9,34.9 L 469.2,33.1 L 485.2,33.1 L 488.2,30.2 L 488.2,26.6 L 485.8,24.3 L 473.4,24.9 L 469.8,24.3 L 467.5,21.9 L 466.9,17.2 L 468.0,13.0 L 468.0,2.4 L 466.3,0.0 Z"
                fillRule="evenodd"
              />
              <path
                d="M 527.8,29.0 L 522.5,33.1 L 520.1,36.7 L 519.5,43.2 L 521.9,46.2 L 530.2,46.2 L 534.3,42.6 L 537.3,34.9 L 540.2,32.0 L 548.5,30.2 L 552.7,31.4 L 557.4,36.1 L 559.8,46.2 L 559.2,53.3 L 556.2,56.2 L 538.5,62.7 L 532.0,63.9 L 524.9,68.0 L 520.1,72.8 L 518.3,76.9 L 518.3,85.8 L 520.7,91.1 L 526.6,96.4 L 534.9,99.4 L 547.3,96.4 L 558.6,89.9 L 560.4,90.5 L 562.7,94.1 L 568.0,98.2 L 575.7,97.6 L 582.8,92.3 L 584.6,89.9 L 584.6,87.6 L 583.4,86.4 L 578.7,88.2 L 574.0,88.2 L 571.0,84.0 L 570.4,38.5 L 566.3,29.6 L 561.5,25.4 L 555.0,23.1 L 545.6,23.1 L 539.1,24.3 Z M 557.4,62.1 L 558.6,63.3 L 559.2,65.1 L 559.2,79.9 L 558.6,81.7 L 557.4,82.8 L 557.4,83.4 L 553.3,87.0 L 550.3,88.8 L 547.3,89.9 L 544.4,90.5 L 541.4,90.5 L 539.6,89.9 L 536.1,88.2 L 534.3,86.4 L 533.1,84.6 L 532.5,82.8 L 532.5,76.9 L 533.1,75.1 L 534.9,72.8 L 537.3,70.4 L 539.6,68.6 L 546.2,65.1 L 553.8,62.1 L 556.2,61.5 Z"
                fillRule="evenodd"
              />
              <path
                d="M 623.7,23.7 L 616.0,29.0 L 610.7,31.4 L 608.3,33.7 L 608.3,36.7 L 610.1,38.5 L 615.4,40.8 L 617.8,44.4 L 618.3,46.7 L 617.8,66.9 L 618.9,73.4 L 618.3,86.4 L 616.0,89.9 L 609.5,91.7 L 608.3,92.9 L 608.3,95.9 L 610.1,97.6 L 640.8,97.6 L 643.2,95.9 L 643.8,94.1 L 643.2,92.9 L 640.8,91.1 L 636.7,91.1 L 633.1,89.9 L 631.4,88.2 L 630.2,84.0 L 630.8,60.4 L 629.6,54.4 L 630.2,46.7 L 633.1,41.4 L 640.8,36.1 L 645.0,36.1 L 651.5,39.6 L 658.0,39.1 L 660.9,34.9 L 661.5,30.8 L 660.4,27.8 L 657.4,24.9 L 654.4,23.7 L 650.9,23.7 L 642.0,27.2 L 633.1,34.3 L 630.8,34.3 L 629.0,32.0 L 629.0,26.6 L 627.8,24.3 Z"
                fillRule="evenodd"
              />
            </g>
          </svg>
        </Link>

        <div
          className="blog-nav-links"
          style={{ display: "flex", gap: 16, alignItems: "center" }}
        >
          <Link
            href="/blog"
            style={{
              color: "#6a5a3a",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Blog
          </Link>
          <a
            href={EXTENSION_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "#E8563A",
              color: "#fff",
              padding: "10px 22px",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 14,
              textDecoration: "none",
            }}
          >
            Add to Browser — Free
          </a>
        </div>
      </nav>

      {/* Article */}
      <main
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "60px 24px 80px",
        }}
      >
        <nav aria-label="Breadcrumb" className="blog-breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/blog">Blog</Link>
          <span>/</span>
          <span style={{ color: "#2d2d2d" }}>{title}</span>
        </nav>

        <Link
          href="/blog"
          style={{
            fontSize: 14,
            color: "#E8563A",
            textDecoration: "none",
            display: "inline-block",
            marginBottom: 32,
          }}
        >
          ← All Articles
        </Link>

        <div className="blog-body">{children}</div>
      </main>

      {/* Footer */}
      <footer
        style={{
          padding: "28px 40px",
          borderTop: "1px solid #E5DDD0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 13,
          color: "#aaa",
          flexWrap: "wrap",
          gap: 12,
          background: "#F4EFE6",
        }}
      >
        <span>© 2026 TrueStar</span>
        <Link href="/blog" style={{ color: "#aaa", textDecoration: "none" }}>
          Blog
        </Link>
        <Link href="/privacy" style={{ color: "#aaa", textDecoration: "none" }}>
          Privacy Policy
        </Link>
      </footer>
    </>
  );
}
