/**
 * Visual design tokens — strict palette (premium wellness, dark, minimal).
 * Typography & spacing scale for RTL-first layouts.
 */

/** Assistant (Google Fonts) — load in App via @expo-google-fonts/assistant */
export const fonts = {
  regular: 'Assistant_400Regular',
  medium: 'Assistant_500Medium',
  semiBold: 'Assistant_600SemiBold',
} as const;

export const theme = {
  background: '#0B0F1A',
  backgroundSecondary: '#111827',
  /** Slightly lifted panels */
  surfaceElevated: 'rgba(255,255,255,0.06)',
  /** Focus / selection surfaces */
  surfaceFocus: 'rgba(124, 154, 255, 0.1)',
  cardSurface: 'rgba(255,255,255,0.04)',
  text: '#FFFFFF',
  textSecondary: '#9CA3AF',
  textMuted: 'rgba(156, 163, 175, 0.75)',
  /** Primary accent */
  accent: '#7C9AFF',
  /** Secondary glow / highlights */
  accentGlow: '#22D3EE',
  success: '#34D399',
  primary: '#7C9AFF',
  primaryGradientStart: '#7C9AFF',
  primaryGradientEnd: '#22D3EE',
  surface: '#111827',
  surfaceBorder: 'rgba(255,255,255,0.08)',
  divider: 'rgba(255,255,255,0.1)',
  radiusSm: 10,
  radiusMd: 16,
  radiusLg: 18,
  radiusXl: 22,
  /** Main background: dark blue → subtle purple */
  gradientBase: ['#0B0F1A', '#151032', '#1E1B4B'] as const,
  /** Ambient accent glow layer (low opacity) */
  gradientAccent: [
    'rgba(124, 154, 255, 0.08)',
    'rgba(34, 211, 238, 0.06)',
    'transparent',
  ] as const,
  breathRing: 'rgba(124, 154, 255, 0.35)',
  breathGlow: 'rgba(124, 154, 255, 0.1)',
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 4,
  },
  cardShadowStrong: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 20,
    elevation: 6,
  },
} as const;

export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

/** Typography — Assistant weights only; airy line-heights for Hebrew RTL */
export const typography = {
  heroTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 30,
    lineHeight: 38,
    color: theme.text,
  },
  screenTitle: {
    fontFamily: fonts.medium,
    fontSize: 23,
    lineHeight: 30,
    color: theme.text,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 22,
    color: theme.textSecondary,
  },
  caption: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 18,
    color: theme.textSecondary,
  },
  anchor: {
    fontFamily: fonts.medium,
    fontSize: 31,
    lineHeight: 37,
    color: theme.text,
  },
} as const;
