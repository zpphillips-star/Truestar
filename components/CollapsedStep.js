import { colors } from "../lib/brand";

export default function CollapsedStep({ label, summary, onEdit }) {
  return (
    <div style={{
      background: colors.white, borderRadius: 14,
      border: "1.5px solid " + colors.border,
      marginBottom: 10, padding: "12px 18px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      boxShadow: "0 1px 6px rgba(56,48,31,0.04)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{
          width: 24, height: 24, borderRadius: "50%",
          background: colors.forest, color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 700, fontFamily: "sans-serif", flexShrink: 0,
        }}>&#10003;</span>
        <div>
          <div style={{ fontFamily: "sans-serif", fontSize: 11, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
          <div style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 600, color: colors.ink, marginTop: 1 }}>{summary}</div>
        </div>
      </div>
      <button onClick={onEdit} style={{
        background: "none", border: "1.5px solid " + colors.border, borderRadius: 8,
        padding: "5px 12px", fontFamily: "sans-serif", fontSize: 12,
        color: colors.textMuted, cursor: "pointer", fontWeight: 600, flexShrink: 0,
      }}>Edit</button>
    </div>
  );
}
