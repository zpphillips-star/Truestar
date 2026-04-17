import { colors } from "../lib/brand";

export default function WeightSlider({ cat, value, onChange }) {
  const active = value > 0;
  return (
    <div style={{
      padding: "14px 16px", borderRadius: 14,
      border: "2px solid " + (active ? cat.color : colors.border),
      background: active ? cat.color + "0d" : colors.white,
      transition: "all 0.2s",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>{cat.emoji}</span>
          <div>
            <div style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: 14, color: active ? cat.color : colors.textMuted }}>{cat.label}</div>
            <div style={{ fontFamily: "sans-serif", fontSize: 11, color: colors.textMuted }}>{cat.desc}</div>
          </div>
        </div>
        <div style={{
          minWidth: 56, textAlign: "center", padding: "5px 12px",
          background: active ? cat.color : "#eee",
          borderRadius: 99,
          fontFamily: "sans-serif", fontWeight: 700, fontSize: 15,
          color: active ? "#fff" : "#bbb",
          transition: "all 0.2s",
          boxShadow: active ? "0 2px 8px " + cat.color + "44" : "none",
        }}>{value}%</div>
      </div>
      <input
        type="range" min={0} max={100} step={5} value={value}
        onChange={(e) => onChange(cat.id, parseInt(e.target.value))}
        style={{ width: "100%", accentColor: cat.color, cursor: "pointer" }}
      />
      <div style={{ height: 5, borderRadius: 99, background: colors.tan, marginTop: 5, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: value + "%",
          background: active ? cat.color : "#ccc",
          borderRadius: 99, transition: "width 0.15s",
          boxShadow: active ? "0 0 6px " + cat.color + "88" : "none",
        }} />
      </div>
    </div>
  );
}
