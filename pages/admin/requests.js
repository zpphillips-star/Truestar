import Head from "next/head";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

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
  red: "#CC010A",
  redBg: "#fde8e8",
};

const STATUSES = [
  { value: "pending",  label: "📥 Requested",    color: "#6a5a3a", bg: "#f0ece3" },
  { value: "approved", label: "✅ Up Next",       color: "#9a6010", bg: "#fef3df" },
  { value: "building", label: "🔨 Building",      color: "#1a6fa8", bg: "#e0f0ff" },
  { value: "shipped",  label: "🚀 Shipped",       color: C.green,   bg: C.greenBg },
  { value: "deferred", label: "⏸ Deferred",      color: C.muted,   bg: "#f5f5f5" },
];

function statusCfg(s) {
  return STATUSES.find(x => x.value === s) || STATUSES[0];
}

function StatusPill({ status }) {
  const cfg = statusCfg(status);
  return (
    <span style={{ display: "inline-block", background: cfg.bg, color: cfg.color, borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>
      {cfg.label}
    </span>
  );
}

// Inline editable field
function EditableField({ value: initVal, onSave, multiline, placeholder, style }) {
  const [val, setVal] = useState(initVal || "");
  const [editing, setEditing] = useState(false);
  const inputRef = useRef();

  useEffect(() => { setVal(initVal || ""); }, [initVal]);
  useEffect(() => { if (editing && inputRef.current) inputRef.current.focus(); }, [editing]);

  function handleSave() {
    setEditing(false);
    if (val !== initVal) onSave(val);
  }

  if (editing) {
    const props = {
      ref: inputRef,
      value: val,
      onChange: e => setVal(e.target.value),
      onBlur: handleSave,
      onKeyDown: e => { if (e.key === "Enter" && !multiline) handleSave(); if (e.key === "Escape") { setVal(initVal || ""); setEditing(false); } },
      style: { width: "100%", padding: "4px 8px", borderRadius: 6, border: `1.5px solid ${C.orange}`, fontSize: 13, fontFamily: "inherit", ...(style || {}) },
      placeholder,
    };
    return multiline ? <textarea rows={3} {...props} /> : <input type="text" {...props} />;
  }

  return (
    <div
      onClick={() => setEditing(true)}
      title="Click to edit"
      style={{
        cursor: "text",
        padding: "4px 6px",
        borderRadius: 6,
        border: "1.5px solid transparent",
        fontSize: 13,
        color: val ? C.ink : C.muted,
        lineHeight: 1.4,
        minHeight: 26,
        ":hover": { borderColor: C.border },
        ...(style || {}),
      }}
    >
      {val || <em style={{ color: C.muted }}>{placeholder || "Click to edit…"}</em>}
    </div>
  );
}

function RequestRow({ req, adminKey, onUpdate }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function update(fields) {
    setSaving(true);
    try {
      const res = await fetch(`/api/feature-requests?id=${req.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
        body: JSON.stringify(fields),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 1200);
        onUpdate(req.id, fields);
      }
    } finally {
      setSaving(false);
    }
  }

  const cfg = statusCfg(req.status);

  return (
    <tr style={{ borderBottom: `1px solid ${C.border}`, background: req.status === "deferred" ? "#fafaf8" : C.white }}>
      {/* Votes */}
      <td style={{ padding: "14px 12px", textAlign: "center", verticalAlign: "top" }}>
        <div style={{ fontWeight: 900, fontSize: 18, color: req.votes >= 5 ? C.orange : C.ink2 }}>{req.votes}</div>
        <div style={{ fontSize: 10, color: C.muted }}>votes</div>
      </td>

      {/* Title + Description */}
      <td style={{ padding: "14px 12px", verticalAlign: "top", maxWidth: 280 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: C.ink, marginBottom: 4, lineHeight: 1.3 }}>{req.title}</div>
        {req.description && (
          <div style={{ fontSize: 12, color: C.ink2, lineHeight: 1.5 }}>{req.description}</div>
        )}
        {req.image_url && (
          <a href={req.image_url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: 6 }}>
            <img src={req.image_url} alt="attachment" style={{ maxWidth: 120, maxHeight: 80, borderRadius: 6, border: `1px solid ${C.border}`, display: "block" }} />
          </a>
        )}
        <div style={{ fontSize: 10, color: C.muted, marginTop: 6 }}>
          {new Date(req.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </div>
      </td>

      {/* Status */}
      <td style={{ padding: "14px 12px", verticalAlign: "top" }}>
        <select
          value={req.status}
          onChange={e => update({ status: e.target.value })}
          style={{
            padding: "6px 10px",
            borderRadius: 8,
            border: `1.5px solid ${C.border}`,
            background: cfg.bg,
            color: cfg.color,
            fontSize: 12,
            fontWeight: 700,
            fontFamily: "inherit",
            cursor: "pointer",
          }}
        >
          {STATUSES.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </td>

      {/* ZAP Score */}
      <td style={{ padding: "14px 12px", verticalAlign: "top", textAlign: "center" }}>
        <input
          type="number"
          min={1}
          max={10}
          defaultValue={req.zap_score || ""}
          placeholder="—"
          onBlur={e => {
            const v = parseInt(e.target.value);
            if (!isNaN(v) && v !== req.zap_score) update({ zap_score: v });
          }}
          style={{ width: 52, padding: "5px 8px", borderRadius: 6, border: `1.5px solid ${C.border}`, textAlign: "center", fontSize: 14, fontWeight: 700, fontFamily: "inherit" }}
        />
      </td>

      {/* ZAP Notes */}
      <td style={{ padding: "14px 12px", verticalAlign: "top", minWidth: 200 }}>
        <EditableField
          value={req.zap_notes}
          placeholder="Add notes…"
          multiline
          onSave={val => update({ zap_notes: val })}
        />
      </td>

      {/* Saving indicator */}
      <td style={{ padding: "14px 12px", verticalAlign: "top", textAlign: "center" }}>
        {saving && <span style={{ fontSize: 11, color: C.amber }}>saving…</span>}
        {saved && <span style={{ fontSize: 11, color: C.green }}>✓ saved</span>}
      </td>
    </tr>
  );
}

export default function AdminRequests() {
  const [adminKey, setAdminKey] = useState("");
  const [keyInput, setKeyInput] = useState("");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("votes"); // votes | date

  // Restore key from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem("ts_admin_key");
    if (saved) { setAdminKey(saved); fetchRequests(saved); }
  }, []);

  async function fetchRequests(key) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/feature-requests", {
        headers: { "x-admin-key": key },
      });
      if (res.status === 401) { setError("Invalid admin key."); setAdminKey(""); return; }
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load requests.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogin(e) {
    e.preventDefault();
    sessionStorage.setItem("ts_admin_key", keyInput);
    setAdminKey(keyInput);
    fetchRequests(keyInput);
  }

  function handleUpdate(id, fields) {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, ...fields } : r));
  }

  const filtered = requests
    .filter(r => filter === "all" || r.status === filter)
    .sort((a, b) => sortBy === "votes"
      ? b.votes - a.votes || new Date(b.created_at) - new Date(a.created_at)
      : new Date(b.created_at) - new Date(a.created_at)
    );

  const counts = {};
  for (const r of requests) counts[r.status] = (counts[r.status] || 0) + 1;

  // ── Login gate ─────────────────────────────────────────────────────────
  if (!adminKey) {
    return (
      <>
        <Head><title>Admin — TrueStar</title></Head>
        <style jsx global>{`* { box-sizing: border-box; margin: 0; padding: 0; } body { font-family: 'Lato', -apple-system, sans-serif; background: ${C.cream}; color: ${C.ink}; }`}</style>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <form onSubmit={handleLogin} style={{ background: C.white, borderRadius: 16, padding: "40px 36px", border: `1px solid ${C.border}`, width: "100%", maxWidth: 360 }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>⭐</div>
              <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 6 }}>TrueStar Admin</h1>
              <p style={{ color: C.ink2, fontSize: 14 }}>Feature request dashboard</p>
            </div>
            {error && <div style={{ background: C.redBg, color: C.red, borderRadius: 8, padding: "8px 12px", fontSize: 13, marginBottom: 16 }}>{error}</div>}
            <input
              type="password"
              placeholder="Admin key"
              value={keyInput}
              onChange={e => setKeyInput(e.target.value)}
              required
              style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: `1.5px solid ${C.border}`, fontSize: 15, marginBottom: 14, fontFamily: "inherit" }}
            />
            <button
              type="submit"
              style={{ width: "100%", background: C.orange, color: "#fff", padding: "12px", borderRadius: 8, fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer" }}
            >
              Enter
            </button>
          </form>
        </div>
      </>
    );
  }

  // ── Main dashboard ─────────────────────────────────────────────────────
  return (
    <>
      <Head>
        <title>Feature Requests Admin — TrueStar</title>
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Lato', -apple-system, sans-serif; background: ${C.cream}; color: ${C.ink}; }
        select, input, textarea { font-family: inherit; }
        tr:hover td { background: #fafaf5 !important; }
      `}</style>

      {/* Header */}
      <header style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Link href="/" style={{ textDecoration: "none", color: C.ink, fontSize: 16, fontWeight: 900 }}>⭐ TrueStar</Link>
          <span style={{ color: C.muted }}>›</span>
          <span style={{ fontWeight: 700, fontSize: 15 }}>Feature Requests</span>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Link href="/roadmap" target="_blank" style={{ fontSize: 13, color: C.ink2, textDecoration: "none", border: `1px solid ${C.border}`, padding: "6px 12px", borderRadius: 6 }}>
            👁 Public View ↗
          </Link>
          <button
            onClick={() => fetchRequests(adminKey)}
            style={{ background: "none", border: `1px solid ${C.border}`, padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontSize: 13, color: C.ink2 }}
          >
            ↻ Refresh
          </button>
          <button
            onClick={() => { sessionStorage.removeItem("ts_admin_key"); setAdminKey(""); }}
            style={{ background: "none", border: `1px solid ${C.border}`, padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontSize: 13, color: C.muted }}
          >
            Log out
          </button>
        </div>
      </header>

      <main style={{ padding: "28px 32px" }}>
        {/* Stat pills */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
          {[{ label: `All (${requests.length})`, value: "all" }, ...STATUSES.map(s => ({ label: `${s.label} (${counts[s.value] || 0})`, value: s.value }))].map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                border: `1.5px solid ${filter === f.value ? C.orange : C.border}`,
                background: filter === f.value ? "#fdf0ec" : C.white,
                color: filter === f.value ? C.orange : C.ink2,
                fontWeight: filter === f.value ? 700 : 400,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              {f.label}
            </button>
          ))}

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: C.ink2 }}>
            Sort by:
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{ padding: "5px 10px", borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 13, background: C.white }}
            >
              <option value="votes">Most Votes</option>
              <option value="date">Newest</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: C.muted }}>Loading requests…</div>
        ) : error ? (
          <div style={{ background: C.redBg, color: C.red, borderRadius: 8, padding: "12px 16px" }}>{error}</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: C.muted }}>No requests found.</div>
        ) : (
          <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f5f0e8", borderBottom: `1px solid ${C.border}` }}>
                  {["Votes", "Request", "Status", "Score /10", "ZAP Notes", ""].map(h => (
                    <th key={h} style={{ padding: "10px 12px", textAlign: h === "Votes" || h === "Score /10" || h === "" ? "center" : "left", fontSize: 11, fontWeight: 700, color: C.ink2, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <RequestRow key={r.id} req={r} adminKey={adminKey} onUpdate={handleUpdate} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}
