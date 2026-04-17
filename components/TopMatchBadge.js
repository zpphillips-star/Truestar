import { colors } from "../lib/brand";

export default function TopMatchBadge({ score }) {
  if (score < 4.5) return null;
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "4px 12px", borderRadius: 99,
      background: colors.badgeTopBg,
      border: "1px solid " + colors.plum + "44",
      fontFamily: "sans-serif", fontSize: 11, fontWeight: 700,
      color: colors.plum,
    }}>
      &#9733; Top match
    </div>
  );
}
