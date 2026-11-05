/**
 * Star News Networks - Brand Theme & Design Tokens
 * BRAND: STAR NEWS
 * PARENT BRAND: STAR NEWS NETWORKS
 * TAGLINE: Local • Live • Trusted (लोकल • लाइव • भरोसेमंद)
 * PRIMARY COVERAGE: Panna, Madhya Pradesh
 * REGIONAL COVERAGE: Satna, Chhatarpur & Bundelkhand
 */

export const BrandIdentity = {
  name: "Star News",
  fullName: "Star News Networks",
  tagline: "Local • Live • Trusted",
  taglineHindi: "लोकल • लाइव • भरोसेमंद",
  primaryLocation: "पन्ना (Panna, MP)",
  primaryRegion: "मध्य प्रदेश (Madhya Pradesh)",
  bureauChief: "प्रकाश श्रीवास्तव",
  bureauTitle: "जिला ब्यूरो प्रमुख, पन्ना",
  helplinePhone: "+91 7987667358",
  helplineDisplay: "7987667358",
  helplineEmail: "starnewsnetworks1988@gmail.com",
};

export const BrandColors = {
  // Signature Aaj Tak-grade News Red & Accents
  primary: "#E50914",       // Vivid Signature Indian News Red
  primaryDark: "#B71C1C",   // Deep Editorial Header Red
  primaryDeep: "#7F1D1D",   // Regal Crimson
  primaryLight: "#FEE2E2",  // Soft Red Tint
  primaryGhost: "#FFF5F5",  // Subdued Red Background
  
  // Neutral Colors & Surfaces
  white: "#FFFFFF",
  background: "#F8FAFC",    // Crisp editorial slate background
  surfaceLight: "#FFFFFF",
  cardBg: "#FFFFFF",
  charcoal: "#0F172A",      // Primary high-contrast text
  textSecondary: "#475569", // Readable editorial secondary text
  textMuted: "#64748B",     // Timestamps & metadata
  border: "#E2E8F0",        // Clean divider lines
  borderLight: "#F1F5F9",
  
  // Status, Live & Broadcast Accents
  liveRed: "#EF4444",       // Pulsing live indicator
  liveBadge: "#DC2626",
  breakingFlash: "#E11D48",
  success: "#16A34A",
  warning: "#D97706",
  info: "#2563EB",
  gold: "#F59E0B",
  
  // Dark mode / Overlays
  overlay: "rgba(0,0,0,0.6)",
  overlayHeavy: "rgba(0,0,0,0.85)",
  overlayLight: "rgba(0,0,0,0.35)",
  darkSurface: "#090D16",
  darkCard: "#131B2E",
  darkBorder: "#1E293B",
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
    text: "#F8FAFC",
    background: BrandColors.darkSurface,
    tint: BrandColors.primary,
    icon: "#94A3B8",
    tabIconDefault: "#64748B",
    tabIconSelected: BrandColors.primary,
  },
};

export const Typography = {
  heroHeadline: {
    fontSize: 22,
    fontWeight: "900" as const,
    color: BrandColors.charcoal,
    lineHeight: 30,
    letterSpacing: -0.3,
  },
  titleLarge: {
    fontSize: 20,
    fontWeight: "800" as const,
    color: BrandColors.charcoal,
    lineHeight: 27,
  },
  titleMedium: {
    fontSize: 17,
    fontWeight: "700" as const,
    color: BrandColors.charcoal,
    lineHeight: 24,
  },
  headline: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: BrandColors.charcoal,
    lineHeight: 22,
  },
  body: {
    fontSize: 15,
    fontWeight: "400" as const,
    color: BrandColors.charcoal,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 13,
    fontWeight: "400" as const,
    color: BrandColors.textSecondary,
    lineHeight: 19,
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
    letterSpacing: 0.6,
  },
};

export const Shadows = {
  sm: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  brandGlow: {
    shadowColor: BrandColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
};
