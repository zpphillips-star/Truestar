import { colors } from "../lib/brand";

export default function DiffBadge({ diff }) {
  if (diff === 0) return null;
  const up = diff > 0;
  return (
    <div style={{
      padding: "8px 16px", borderRadius: 99,
      background: up ? colors.forest : colors.red,
      fontFamily: "sans-serif", fontWeight: 700, fontSize: 17,
      color: "#fff",
      boxShadow: up ? "0 2px 12px " + colors.forest + "66" : "0 2px 12px " + colors.red + "66",
      letterSpacing: "0.01em",
    }}>
      {up ? "+" : ""}{diff} &#9733;
    </div>
  );
}
