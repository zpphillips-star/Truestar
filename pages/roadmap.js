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
    icon: "↑",
    accentColor: "#b09070",
    color: "#6a5a3a",
    cardBg: "#fdfaf5",
    colBg: "#f5f0e8",
    description: "Community ideas, sorted by votes",
  },
  {
    key: "approved",
    label: "Up Next",
    icon: "→",
    accentColor: "#E7A545",
    color: "#9a6010",
    cardBg: "#fffdf7",
    colBg: "#fef9ed",
    description: "Confirmed and planned",
  },
  {
    key: "building",
    label: "In Progress",
    icon: "⚙",
    accentColor: "#3a9fd4",
    color: "#1a6fa8",
    cardBg: "#f7fbff",
    colBg: "#edf6ff",
    description: "Actively being built",
  },
  {
    key: "shipped",
    label: "Shipped",
    icon: "✓",
    accentColor: "#189E01",
    color: "#0f7a00",
    cardBg: "#f7fdf5",
    colBg: "#edfae8",
    description: "Live in TrueStar",
  },
];

function KanbanCard({ req }) {
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
      }
    } finally {
      setVoting(false);
    }
  }

  return (
    <div style={{
      background: C.white,
      borderRadius: 8,
      padding: "12px 14px",
      border: `1px solid ${C.border}`,
      boxShadow: "0 1px 4px rgba(56,48,31,0.06)",
      marginBottom: 8,
      transition: "box-shadow 0.15s",
    }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: C.ink, lineHeight: 1.45, marginBottom: 6 }}>
        {req.title}
      </p>
      {req.description && (
        <p style={{
          fontSize: 12, color: C.ink2, lineHeight: 1.5, marginBottom: 8,
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {req.description}
        </p>
      )}
      {req.image_url && (
        <a href={req.image_url} target="_blank" rel="noopener noreferrer" style={{ display: "block", marginBottom: 8 }}>
          <img src={req.image_url} alt="" style={{ width: "100%", maxHeight: 90, objectFit: "cover", borderRadius: 5, border: `1px solid ${C.border}` }} />
        </a>
      )}
      {req.zap_notes && req.status !== "pending" && (
        <p style={{ fontSize: 11, color: "#1a6fa8", fontStyle: "italic", marginBottom: 8, lineHeight: 1.4 }}>
          {req.zap_notes}
        </p>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
        <span style={{ fontSize: 11, color: C.muted }}>
          {new Date(req.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </span>
        <button
          onClick={handleVote}
          disabled={voted || voting}
          title={voted ? "Voted!" : "Upvote this idea"}
          style={{
            display: "flex", alignItems: "center", gap: 5,
            background: voted ? "#edfae8" : "#f5f0e8",
            border: `1.5px solid ${voted ? C.green : C.border}`,
            borderRadius: 20, padding: "3px 10px",
            cursor: voted ? "default" : "pointer",
            fontSize: 12, fontWeight: 700,
            color: voted ? C.green : C.ink2,
            transition: "all 0.15s",
          }}
        >
          <span style={{ fontSize: 10 }}>{voted ? "✓" : "▲"}</span>
          <span>{votes}</span>
        </button>
      </div>
    </div>
  );
}

function KanbanColumn({ col, cards }) {
  return (
    <div style={{ flex: "1 1 0", minWidth: 220, maxWidth: 340, display: "flex", flexDirection: "column" }}>
      {/* Colored accent bar */}
      <div style={{ height: 4, borderRadius: "4px 4px 0 0", background: col.accentColor }} />

      {/* Header */}
      <div style={{
        background: C.white,
        borderLeft: `1px solid ${C.border}`,
        borderRight: `1px solid ${C.border}`,
        padding: "12px 14px 10px",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{
              width: 22, height: 22, borderRadius: "50%",
              background: col.accentColor,
              color: "#fff", fontSize: 11, fontWeight: 900,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              {col.icon}
            </span>
            <span style={{ fontWeight: 900, fontSize: 14, color: C.ink }}>{col.label}</span>
          </div>
          <span style={{
            background: "#f0ebe2", color: C.ink2,
            borderRadius: 20, padding: "2px 8px",
            fontSize: 11, fontWeight: 700, minWidth: 22, textAlign: "center",
          }}>
            {cards.length}
          </span>
        </div>
        <p style={{ fontSize: 11, color: C.muted }}>{col.description}</p>
      </div>

      {/* Cards area */}
      <div style={{
        flex: 1,
        background: col.colBg,
        border: `1px solid ${C.border}`,
        borderTop: "none",
        borderRadius: "0 0 8px 8px",
        padding: cards.length > 0 ? "10px 10px 6px" : "20px 10px",
        minHeight: 80,
      }}>
        {cards.length === 0 ? (
          <div style={{
            textAlign: "center", color: C.muted, fontSize: 12,
            border: `1.5px dashed ${C.border}`, borderRadius: 6,
            padding: "16px 10px",
          }}>
            Nothing here yet
          </div>
        ) : (
          cards.map(r => <KanbanCard key={r.id} req={r} />)
        )}
      </div>
    </div>
  );
}

export default function Roadmap({ byStatus }) {
  const [data] = useState(byStatus);
  const totalRequests = Object.values(data).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <>
      <Head>
        <title>Roadmap — TrueStar</title>
        <meta name="description" content="See what TrueStar is building, what has shipped, and vote on ideas you want most." />
        <link rel="icon" href="/icon128.png" />
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Lato', -apple-system, BlinkMacSystemFont, sans-serif; background: ${C.cream}; color: ${C.ink}; }
        button { font-family: inherit; }
        .board-scroll::-webkit-scrollbar { height: 6px; }
        .board-scroll::-webkit-scrollbar-track { background: transparent; }
        .board-scroll::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
      `}</style>

      {/* Nav */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 40px", borderBottom: `1px solid ${C.border}`, background: C.cream }}>
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

      {/* Page header */}
      <div style={{ padding: "32px 40px 28px", borderBottom: `1px solid ${C.border}`, background: C.cream }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 900, lineHeight: 1.15, marginBottom: 6 }}>Product Roadmap</h1>
            <p style={{ color: C.ink2, fontSize: 14 }}>
              {totalRequests} idea{totalRequests !== 1 ? "s" : ""} submitted &nbsp;·&nbsp; Most-voted get built first &nbsp;·&nbsp; Vote below
            </p>
          </div>
          {/* Flow indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.muted, fontWeight: 600 }}>
            {COLUMNS.map((col, i) => (
              <span key={col.key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  background: C.white, border: `1px solid ${C.border}`,
                  borderRadius: 20, padding: "4px 10px", fontSize: 12,
                  color: col.color, fontWeight: 700,
                  borderTop: `2px solid ${col.accentColor}`,
                }}>
                  {col.label}
                </span>
                {i < COLUMNS.length - 1 && (
                  <span style={{ color: C.border, fontSize: 14 }}>›</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Kanban board */}
      <div
        className="board-scroll"
        style={{
          display: "flex",
          gap: 12,
          padding: "28px 40px 48px",
          overflowX: "auto",
          alignItems: "flex-start",
        }}
      >
        {COLUMNS.map(col => (
          <KanbanColumn
            key={col.key}
            col={col}
            cards={data[col.key] || []}
          />
        ))}
      </div>

      <footer style={{ padding: "24px 40px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, color: C.muted, flexWrap: "wrap", gap: 12, background: C.cream }}>
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
