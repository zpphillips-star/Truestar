import { colors } from "../lib/brand";

export default function StarRow({ rating, size = 16, color = colors.amber }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((s) => {
        const pct = Math.min(1, Math.max(0, rating - (s - 1)));
        const id = "grad" + s + size + color.replace(/[^a-z0-9]/gi, "");
        return (
          <svg key={s} width={size} height={size} viewBox="0 0 20 20">
            <defs>
              <linearGradient id={id} x1="0" x2="1" y1="0" y2="0">
                <stop offset={pct * 100 + "%"} stopColor={color} />
                <stop offset={pct * 100 + "%"} stopColor="#ddd" />
              </linearGradient>
            </defs>
            <polygon
              points="10,1.5 12.6,7.2 18.9,7.8 14.2,12 15.8,18.2 10,14.8 4.2,18.2 5.8,12 1.1,7.8 7.4,7.2"
              fill={"url(#" + id + ")"}
            />
          </svg>
        );
      })}
    </span>
  );
}
