import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "../components/Logo";

const C = {
  cream: "#F4EFE6",
  ink: "#38301f",
  ink2: "#6a5a3a",
  muted: "#b0a898",
  border: "#E0D8CA",
  white: "#FFFFFF",
  orange: "#E8563A",
  amber: "#E7A545",
  green: "#189E01",
  greenBg: "#e8f5e0",
  plum: "#883A61",
  plumBg: "#f0e4f0",
};

const STATUS_CONFIG = {
  pending:  { label: "Requested",    emoji: "📥", color: C.ink2,  bg: "#f0ece3" },
  approved: { label: "Up Next",      emoji: "✅", color: "#9a6010", bg: "#fef3df" },
  building: { label: "Building Now", emoji: "🔨", color: "#1a6fa8", bg: "#e0f0ff" },
  shipped:  { label: "Shipped",      emoji: "🚀", color: C.green,  bg: C.greenBg },
  deferred: { label: "Deferred",     emoji: "⏸",  color: C.muted,  bg: "#f5f5f5" },
};

function Nav() {
  return (
    <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", borderBottom: `1px solid ${C.border}`, background: C.cream }}>
      <Link href="/" style={{ textDecoration: "none" }}>
        <Logo size={22} starColor={C.amber} textColor={C.ink} />
      </Link>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <Link href="/roadmap" style={{ color: C.orange, textDecoration: "none", fontSize: 14, fontWeight: 700 }}>Roadmap</Link>
        <Link href="/submit" style={{ background: C.orange, color: "#fff", padding: "8px 18px", borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
          Suggest a Feature
        </Link>
      </div>
    </nav>
  );
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: cfg.bg, color: cfg.color, borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>
      {cfg.emoji} {cfg.label}
    </span>
  );
}

function RequestCard({ req, onVote }) {
  const [votes, setVotes] = useState(req.votes);
  const [voted, setVoted] = useState(false);
  const [voting, setVoting] = useState(false);

  async function handleVote() {
    if (voted || voting) return;
    setVoting(true);
    try {
      const res = await fetch(`/api/vote?id=${req.id}`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setVotes(data.votes);
        setVoted(true);
        if (onVote) onVote(req.id, data.votes);
      }
    } finally {
      setVoting(false);
    }
  }

  return (
    <div style={{ background: C.white, borderRadius: 12, padding: "20px 24px", border: `1px solid ${C.border}`, display: "flex", gap: 16, alignItems: "flex-start" }}>
      {/* Vote button */}
      <button
        onClick={handleVote}
        disabled={voted || voting}
        title={voted ? "Voted!" : "Upvote this idea"}
        style={{
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          background: voted ? C.greenBg : "#f5f0e8",
          border: `1.5px solid ${voted ? C.green : C.border}`,
          borderRadius: 8,
          padding: "8px 10px",
          cursor: voted ? "default" : "pointer",
          minWidth: 44,
          transition: "all 0.15s",
        }}
      >
        <span style={{ fontSize: 14 }}>{voted ? "✓" : "▲"}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: voted ? C.green : C.ink2 }}>{votes}</span>
      </button>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 6 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: C.ink, lineHeight: 1.3 }}>{req.title}</h3>
          <StatusBadge status={req.status} />
        </div>
        {req.description && (
          <p style={{ fontSize: 14, color: C.ink2, lineHeight: 1.5, marginBottom: 8 }}>{req.description}</p>
        )}
        {req.zap_notes && req.status !== "pending" && (
          <p style={{ fontSize: 13, color: "#1a6fa8", fontStyle: "italic", marginTop: 4 }}>
            💬 {req.zap_notes}
          </p>
        )}
        <div style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>
          {new Date(req.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </div>
      </div>
    </div>
  );
}

function Section({ title, subtitle, emoji, requests, onVote, accent }) {
  if (requests.length === 0) return null;
  return (
    <section style={{ marginBottom: 52 }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: C.ink, display: "flex", alignItems: "center", gap: 8 }}>
          <span>{emoji}</span> {title}
          <span style={{ fontSize: 13, fontWeight: 600, color: C.muted, marginLeft: 4 }}>({requests.length})</span>
        </h2>
        {subtitle && <p style={{ fontSize: 14, color: C.ink2, marginTop: 4 }}>{subtitle}</p>}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {requests.map(r => <RequestCard key={r.id} req={r} onVote={onVote} />)}
      </div>
    </section>
  );
}

export default function Roadmap({ building, topRequested, shipped }) {
  function handleVote() {} // could update local state for realtime feel if needed

  return (
    <>
      <Head>
        <title>Roadmap — TrueStar</title>
        <meta name="description" content="See what TrueStar is building, what's been shipped, and vote on the ideas you want most." />
        <link rel="icon" href="/icon128.png" />
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Lato', -apple-system, BlinkMacSystemFont, sans-serif; background: ${C.cream}; color: ${C.ink}; }
        button { font-family: inherit; }
      `}</style>

      <Nav />

      <main style={{ maxWidth: 760, margin: "0 auto", padding: "56px 24px" }}>
        {/* Header */}
        <div style={{ marginBottom: 48, textAlign: "center" }}>
          <h1 style={{ fontSize: 40, fontWeight: 900, lineHeight: 1.1, marginBottom: 14 }}>
            What we&apos;re building
          </h1>
          <p style={{ color: C.ink2, fontSize: 17, lineHeight: 1.6, maxWidth: 520, margin: "0 auto 24px" }}>
            We review all requests weekly. The most-requested ideas get built first. Vote for what matters to you.
          </p>
          <Link
            href="/submit"
            style={{ display: "inline-block", background: C.orange, color: "#fff", padding: "12px 28px", borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: "none" }}
          >
            💡 Suggest a Feature
          </Link>
        </div>

        {/* Building Now */}
        <Section
          emoji="🔨"
          title="Building Now"
          subtitle="These are in active development."
          requests={building}
          onVote={handleVote}
        />

        {/* Top Requested */}
        <Section
          emoji="📥"
          title="Top Requested"
          subtitle="The most-voted ideas — these are next in line."
          requests={topRequested}
          onVote={handleVote}
        />

        {/* Shipped */}
        <Section
          emoji="🚀"
          title="Shipped"
          subtitle="Ideas that made it into TrueStar."
          requests={shipped}
          onVote={handleVote}
        />

        {building.length === 0 && topRequested.length === 0 && shipped.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🌱</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>No requests yet</h2>
            <p style={{ color: C.ink2, marginBottom: 24 }}>Be the first to suggest something!</p>
            <Link href="/submit" style={{ background: C.orange, color: "#fff", padding: "12px 28px", borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
              Submit an Idea
            </Link>
          </div>
        )}
      </main>

      <footer style={{ padding: "28px 40px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, color: C.muted, flexWrap: "wrap", gap: 12 }}>
        <span>© 2026 TrueStar</span>
        <Link href="/submit" style={{ color: C.muted, textDecoration: "none" }}>Suggest a Feature</Link>
        <Link href="/privacy" style={{ color: C.muted, textDecoration: "none" }}>Privacy Policy</Link>
      </footer>
    </>
  );
}

export async function getServerSideProps() {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const headers = { apikey: key, Authorization: `Bearer ${key}` };

  async function fetchStatus(status) {
    const r = await fetch(
      `${base}/rest/v1/feature_requests?status=eq.${status}&select=*&order=votes.desc,created_at.desc`,
      { headers }
    );
    return r.ok ? r.json() : [];
  }

  const [building, pending, approved, shipped] = await Promise.all([
    fetchStatus("building"),
    fetchStatus("pending"),
    fetchStatus("approved"),
    fetchStatus("shipped"),
  ]);

  // Top requested = pending + approved, sorted by votes, max 20
  const topRequested = [...approved, ...pending]
    .sort((a, b) => b.votes - a.votes || new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 20);

  return {
    props: {
      building,
      topRequested,
      shipped: shipped.slice(0, 10),
    },
  };
}
