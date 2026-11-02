/**
 * Star News Networks - Brand Theme & Design Tokens
 * BRAND: STAR NEWS NETWORKS
 * TAGLINE: LOCAL | LIVE | TRUSTED
 */

export const BrandColors = {
  // Primary Brand Colors
  primary: "#E31E24",       // Signature Indian News Red
  primaryDark: "#B5121B",   // Deep Red / Header & Accents
  primaryLight: "#FEE2E2",  // Soft Red Tint
  primaryGhost: "#FFF1F2",  // Subdued Red Background
  
  // Neutral Colors
  white: "#FFFFFF",
  background: "#F5F6F8",    // Crisp light background
  cardBg: "#FFFFFF",
  charcoal: "#171717",      // Primary Text
  textSecondary: "#525965", // Readable secondary text
  textMuted: "#8C93A0",     // Timestamps & metadata
  border: "#E5E7EB",        // Clean divider lines
  borderLight: "#F0F2F5",
  
  // Status & Accents
  liveRed: "#DC2626",
  liveBadge: "#B91C1C",
  success: "#16A34A",
  warning: "#D97706",
  info: "#2563EB",
  gold: "#EAB308",
  
  // Dark mode / Overlays
  overlay: "rgba(0,0,0,0.6)",
  overlayHeavy: "rgba(0,0,0,0.85)",
  darkSurface: "#18181B",
  darkCard: "#27272A",
};

export const Colors = {
  light: {
    text: BrandColors.charcoal,
    background: BrandColors.background,
    tint: BrandColors.primary,
    icon: BrandColors.textSecondary,
    tabIconDefault: BrandColors.textMuted,
    tabIconSelected: BrandColors.primary,
  },
  dark: {
    text: "#F4F4F5",
    background: "#09090B",
    tint: BrandColors.primary,
    icon: "#A1A1AA",
    tabIconDefault: "#71717A",
    tabIconSelected: "#EF4444",
  },
};

export const Typography = {
  titleLarge: {
    fontSize: 22,
    fontWeight: "800" as const,
    color: BrandColors.charcoal,
    lineHeight: 28,
  },
  titleMedium: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: BrandColors.charcoal,
    lineHeight: 24,
  },
  headline: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: BrandColors.charcoal,
    lineHeight: 22,
  },
  body: {
    fontSize: 14,
    fontWeight: "400" as const,
    color: BrandColors.charcoal,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: "500" as const,
    color: BrandColors.textSecondary,
    lineHeight: 16,
  },
  badge: {
    fontSize: 10,
    fontWeight: "800" as const,
    letterSpacing: 0.5,
  },
};

export const Shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
};
