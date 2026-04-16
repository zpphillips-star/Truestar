// ─────────────────────────────────────────────
// StarSpinner — animated TrueStar loader
// Uses the exact traced star path from the logo file.
//
// Usage:
//   import StarSpinner from '../components/StarSpinner'
//
//   <StarSpinner />                          // default 56px amber
//   <StarSpinner size={40} />                // custom size
//   <StarSpinner size={64} color="#189E01" /> // custom color
//   <StarSpinner label="Finding restaurants…" />
// ─────────────────────────────────────────────

import { colors } from '../lib/brand';

const STAR_PATH = "M 57.47,0.00 L 54.41,1.53 L 42.91,37.55 L 3.45,44.06 L 0.00,46.74 L 2.30,49.04 L 26.82,56.32 L 36.78,61.30 L 37.16,65.90 L 30.27,95.79 L 31.42,100.00 L 56.32,75.86 L 60.54,76.25 L 73.56,86.59 L 91.19,96.17 L 92.34,92.34 L 79.31,62.84 L 78.93,57.85 L 109.58,35.63 L 108.05,32.95 L 69.73,34.48 Z";
const STAR_VB_W = 109.58;
const STAR_VB_H = 100;

const keyframes = `
  @keyframes truestar-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
`;

export default function StarSpinner({
  size    = 56,
  color   = colors.amber,
  label   = null,
  speed   = '3s',
  style   = {},
}) {
  const w = (STAR_VB_W / STAR_VB_H) * size;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        ...style,
      }}
    >
      <style>{keyframes}</style>

      <svg
        width={w}
        height={size}
        viewBox={`0 0 ${STAR_VB_W} ${STAR_VB_H}`}
        style={{
          animation: `truestar-spin ${speed} cubic-bezier(0.4, 0, 0.6, 1) infinite`,
        }}
      >
        <path d={STAR_PATH} fill={color} />
      </svg>

      {label && (
        <p
          style={{
            fontFamily: 'sans-serif',
            fontSize: '13px',
            fontWeight: 300,
            color: colors.textMuted,
            textAlign: 'center',
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          {label}
        </p>
      )}
    </div>
  );
}
