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
};

const COLUMNS = [
  {
    key: "pending",
    label: "Requested",
    emoji: "��",
    color: "#6a5a3a",
    bg: "#f0ece3",
    headerBg: "#e8e2d6",
    description: "Community ideas",
  },
  {
    key: "approved",
    label: "Up Next",
    emoji: "✅",
    color: "#9a6010",
    bg: "#fef3df",
    headerBg: "#fde8b8",
    description: "Planned for soon",
  },
  {
    key: "building",
    label: "Building",
    emoji: "🔨",
    color: "#1a6fa8",
    bg: "#e0f0ff",
    headerBg: "#b8dcf8",
    description: "In active development",
  },
  {
    key: "shipped",
    label: "Shipped",
    emoji: "🚀",
    color: "#189E01",
    bg: "#e8f5e0",
    headerBg: "#c4e8b8",
    description: "Live in TrueStar",
  },
];

function KanbanCard({ req, onVote }) {
  const [votes, setVotes] = useState(req.votes);
  const [voted, setVoted] = useState(false);
  const [voting, setVoting] = useState(false);

  async function handleVote(e) {
    e.stopPropagation();
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
    <div style={{
      background: C.white,
      borderRadius: 10,
      padding: "14px 14px 12px",
      border: `1px solid ${C.border}`,
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      marginBottom: 10,
    }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: C.ink, lineHeight: 1.4, marginBottom: req.description ? 6 : 10 }}>
        {req.title}
      </p>
      {req.description && (
        <p style={{ fontSize: 12, color: C.ink2, lineHeight: 1.45, marginBottom: 10, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {req.description}
        </p>
      )}
      {req.image_url && (
        <a href={req.image_url} target="_blank" rel="noopener noreferrer" style={{ display: "block", marginBottom: 8 }}>
          <img src={req.image_url} alt="" style={{ width: "100%", maxHeight: 100, objectFit: "cover", borderRadius: 6, border: `1px solid ${C.border}` }} />
        </a>
      )}
      {req.zap_notes && req.status !== "pending" && (
        <p style={{ fontSize: 11, color: "#1a6fa8", fontStyle: "italic", marginBottom: 8, lineHeight: 1.4 }}>
          💬 {req.zap_notes}
        </p>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, color: C.muted }}>
          {new Date(req.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </span>
        <button
          onClick={handleVote}
          disabled={voted || voting}
          title={voted ? "Voted!" : "Upvote"}
          style={{
            display: "flex", alignItems: "center", gap: 4,
            background: voted ? C.greenBg : "#f5f0e8",
            border: `1.5px solid ${voted ? C.green : C.border}`,
            borderRadius: 20, padding: "3px 9px",
            cursor: voted ? "default" : "pointer",
            fontSize: 12, fontWeight: 700,
            color: voted ? C.green : C.ink2,
            transition: "all 0.15s",
          }}
        >
          <span>{voted ? "✓" : "▲"}</span>
          <span>{votes}</span>
        </button>
      </div>
    </div>
  );
}

function KanbanColumn({ col, cards, onVote }) {
  return (
    <div style={{
      flex: "0 0 260px",
      display: "flex",
      flexDirection: "column",
      minHeight: 400,
    }}>
      {/* Column header */}
      <div style={{
        background: col.headerBg,
        borderRadius: "10px 10px 0 0",
        padding: "12px 14px",
        borderBottom: `2px solid ${col.border || col.bg}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 16 }}>{col.emoji}</span>
            <span style={{ fontWeight: 900, fontSize: 14, color: col.color }}>{col.label}</span>
          </div>
          <span style={{
            background: col.bg, color: col.color,
            borderRadius: 20, padding: "2px 8px",
            fontSize: 11, fontWeight: 700,
          }}>
            {cards.length}
          </span>
        </div>
        <p style={{ fontSize: 11, color: col.color, opacity: 0.75, marginTop: 3 }}>{col.description}</p>
      </div>

      {/* Cards */}
      <div style={{
        flex: 1,
        background: col.bg,
        borderRadius: "0 0 10px 10px",
        padding: "10px 10px 10px",
        minHeight: 200,
      }}>
        {cards.length === 0 ? (
          <div style={{ textAlign: "center", padding: "28px 0", color: col.color, opacity: 0.5, fontSize: 12 }}>
            Nothing here yet
          </div>
        ) : (
          cards.map(r => <KanbanCard key={r.id} req={r} onVote={onVote} />)
        )}
      </div>
    </div>
  );
}

export default function Roadmap({ byStatus }) {
  const [data, setData] = useState(byStatus);

  function handleVote(id, newVotes) {
    setData(prev => {
      const next = { ...prev };
      for (const key of Object.keys(next)) {
        next[key] = next[key].map(r => r.id === id ? { ...r, votes: newVotes } : r);
        // Re-sort pending by votes
        if (key === "pending") {
          next[key] = [...next[key]].sort((a, b) => b.votes - a.votes);
        }
      }
      return next;
    });
  }

  const totalRequests = Object.values(data).reduce((sum, arr) => sum + arr.length, 0);

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
        .board-scroll::-webkit-scrollbar { height: 6px; }
        .board-scroll::-webkit-scrollbar-track { background: ${C.cream}; }
        .board-scroll::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
      `}</style>

      {/* Nav */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", borderBottom: `1px solid ${C.border}`, background: C.cream }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <Logo size={22} starColor={C.amber} textColor={C.ink} />
        </Link>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Link href="/roadmap" style={{ color: C.orange, textDecoration: "none", fontSize: 14, fontWeight: 700 }}>Roadmap</Link>
          <Link href="/submit" style={{ background: C.orange, color: "#fff", padding: "8px 18px", borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
            💡 Suggest a Feature
          </Link>
        </div>
      </nav>

      {/* Page header */}
      <div style={{ padding: "36px 40px 24px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 900, lineHeight: 1.1, marginBottom: 6 }}>What we&apos;re building</h1>
          <p style={{ color: C.ink2, fontSize: 15 }}>
            {totalRequests} idea{totalRequests !== 1 ? "s" : ""} submitted · Most-voted get built first · Vote for what matters to you
          </p>
        </div>
        <Link
          href="/submit"
          style={{ display: "inline-block", background: C.orange, color: "#fff", padding: "10px 22px", borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: "none", whiteSpace: "nowrap" }}
        >
          💡 Suggest a Feature
        </Link>
      </div>

      {/* Kanban board */}
      <div
        className="board-scroll"
        style={{
          display: "flex",
          gap: 16,
          padding: "0 40px 48px",
          overflowX: "auto",
          alignItems: "flex-start",
        }}
      >
        {COLUMNS.map(col => (
          <KanbanColumn
            key={col.key}
            col={col}
            cards={data[col.key] || []}
            onVote={handleVote}
          />
        ))}
      </div>

      <footer style={{ padding: "24px 40px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, color: C.muted, flexWrap: "wrap", gap: 12 }}>
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

  const [pending, approved, building, shipped] = await Promise.all([
    fetchStatus("pending"),
    fetchStatus("approved"),
    fetchStatus("building"),
    fetchStatus("shipped"),
  ]);

  return {
    props: {
      byStatus: { pending, approved, building, shipped },
    },
  };
}
