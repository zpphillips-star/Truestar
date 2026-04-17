// ─────────────────────────────────────────────
// TrueStar Brand Tokens
// Single source of truth for all design values.
// Import anywhere: import { colors, type, radius } from '../lib/brand'
// ─────────────────────────────────────────────

export const colors = {
  // ── Primary palette ──
  amber:   '#E7A545',   // Star mark, accent, loader spinner
  forest:  '#189E01',   // Great match, positive, success
  lime:    '#72B800',   // Secondary positive, tags
  red:     '#CC010A',   // Poor match, negative, warnings
  plum:    '#883A61',   // Top pick, premium accent

  // ── Neutrals ──
  ink:     '#38301f',   // Primary text, dark surfaces
  ink2:    '#6a5a3a',   // Secondary text, muted labels
  cream:   '#F4EFE6',   // Page background (never pure white)
  tan:     '#E0D8CA',   // Borders, dividers
  white:   '#FFFFFF',   // Card surfaces

  // ── Semantic aliases ──
  textPrimary:    '#38301f',
  textSecondary:  '#6a5a3a',
  textMuted:      '#b0a898',
  bgPage:         '#F4EFE6',
  bgCard:         '#FFFFFF',
  bgResult:       '#ede8de',   // Page background — result stage
  bgWeights:      '#f0ece3',   // Page background — weights stage
  bgSelectedItem: '#fdf5f4',   // Selected restaurant row tint
  bgDark:         '#38301f',
  border:         '#E0D8CA',

  // ── Score badge colors ──
  badgeGreatBg:   '#e8f5e0',
  badgeGreatText: '#189E01',
  badgeOkayBg:    '#fef3df',
  badgeOkayText:  '#9a6010',
  badgePoorBg:    '#fde8e8',
  badgePoorText:  '#CC010A',
  badgeTopBg:     '#f0e4f0',
  badgeTopText:   '#883A61',
};

export const type = {
  // Lato font weights
  light:   300,
  regular: 400,
  bold:    700,

  // Scale
  xs:   '10px',
  sm:   '12px',
  base: '14px',
  md:   '15px',
  lg:   '18px',
  xl:   '24px',
  xxl:  '32px',

  // Tracking for labels
  labelTracking: '0.18em',
};

export const radius = {
  sm:   '8px',
  md:   '12px',
  lg:   '16px',
  xl:   '20px',
  pill: '99px',
};

export const spacing = {
  1:  '4px',
  2:  '8px',
  3:  '12px',
  4:  '16px',
  5:  '20px',
  6:  '24px',
  8:  '32px',
  10: '40px',
  12: '48px',
  16: '64px',
};

export const shadow = {
  card:  '0 2px 16px rgba(56,48,31,0.06)',
  modal: '0 4px 32px rgba(56,48,31,0.12)',
};

// ── Score thresholds ──
export function scoreLabel(score) {
  if (score >= 4.0) return { label: 'Great match',  color: colors.forest, bg: colors.badgeGreatBg };
  if (score >= 2.5) return { label: 'Okay match',   color: colors.badgeOkayText, bg: colors.badgeOkayBg };
  return              { label: 'Not a match',  color: colors.red,    bg: colors.badgePoorBg };
}

