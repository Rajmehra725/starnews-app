import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Easing,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Image } from "expo-image";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { BrandColors, BrandIdentity, Shadows } from "@/constants/theme";

const { width } = Dimensions.get("window");

// ============================================================================
// 1. STAR BRAND LOADER (Core Distinctive Animated Brand Experience)
// ============================================================================

export interface StarBrandLoaderProps {
  message?: string;
  subMessage?: string;
  theme?: "dark" | "light";
  showTagline?: boolean;
  size?: "small" | "medium" | "large";
}

export function StarBrandLoader({
  message = "समाचार लोड हो रहे हैं...",
  subMessage = "पन्ना • सतना • छतरपुर • मध्य प्रदेश ब्यूरो",
  theme = "dark",
  showTagline = true,
  size = "medium",
}: StarBrandLoaderProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const dot1Anim = useRef(new Animated.Value(0.2)).current;
  const dot2Anim = useRef(new Animated.Value(0.2)).current;
  const dot3Anim = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    // 1. Subtle scale pulse
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.06,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    // 2. Continuous Star Ring Rotation
    const rotate = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    // 3. Moving Progress Line
    const progress = Animated.loop(
      Animated.sequence([
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(progressAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
      ])
    );

    // 4. Staggered Dots Animation
    const dots = Animated.loop(
      Animated.stagger(180, [
        Animated.sequence([
          Animated.timing(dot1Anim, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dot1Anim, { toValue: 0.2, duration: 400, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(dot2Anim, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dot2Anim, { toValue: 0.2, duration: 400, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(dot3Anim, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dot3Anim, { toValue: 0.2, duration: 400, useNativeDriver: true }),
        ]),
      ])
    );

    pulse.start();
    rotate.start();
    progress.start();
    dots.start();

    return () => {
      pulse.stop();
      rotate.stop();
      progress.stop();
      dots.stop();
    };
  }, [pulseAnim, rotateAnim, progressAnim, dot1Anim, dot2Anim, dot3Anim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const isLight = theme === "light";
  const logoDimensions = size === "small" ? 54 : size === "large" ? 96 : 74;

  return (
    <View style={styles.centerContainer}>
      {/* Animated Star Emblem */}
      <Animated.View
        style={[
          styles.emblemContainer,
          {
            width: logoDimensions + 20,
            height: logoDimensions + 20,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        {/* Rotating Dashed Red Accent Ring */}
        <Animated.View
          style={[
            styles.rotatingAura,
            {
              width: logoDimensions + 18,
              height: logoDimensions + 18,
              borderRadius: (logoDimensions + 18) / 2,
              borderColor: isLight ? "rgba(229, 9, 20, 0.45)" : "rgba(255, 255, 255, 0.35)",
              transform: [{ rotate: spin }],
            },
          ]}
        />

        {/* Central Logo Badge */}
        <View
          style={[
            styles.emblemBadge,
            {
              width: logoDimensions,
              height: logoDimensions,
              borderRadius: logoDimensions / 2,
              backgroundColor: isLight ? BrandColors.primary : BrandColors.primaryDark,
            },
          ]}
        >
          <Image
            source={require("../assets/images/icon.png")}
            style={{ width: logoDimensions * 0.72, height: logoDimensions * 0.72 }}
            contentFit="contain"
          />
        </View>
      </Animated.View>

      {/* Brand Text Block */}
      <View style={styles.brandTitleRow}>
        <Text style={[styles.titleStar, isLight && styles.titleStarLight]}>STAR </Text>
        <Text style={styles.titleNews}>NEWS</Text>
      </View>
      <Text style={[styles.titleNetworks, isLight && styles.titleNetworksLight]}>
        NETWORKS
      </Text>

      {/* Tagline */}
      {showTagline && (
        <View style={styles.taglineBox}>
          <Text style={[styles.taglineText, isLight && styles.taglineTextLight]}>
            LOCAL • LIVE • TRUSTED
          </Text>
          <Text style={[styles.taglineHindi, isLight && styles.taglineHindiLight]}>
            {BrandIdentity.taglineHindi}
          </Text>
        </View>
      )}

      {/* Animated Red Loading Line */}
      <View style={styles.progressTrack}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progressWidth,
              backgroundColor: isLight ? BrandColors.primary : "#EF4444",
            },
          ]}
        />
      </View>

      {/* Status Message & Pulsing Dots */}
      <View style={styles.messageRow}>
        <Text style={[styles.messageText, isLight && styles.messageTextLight]}>
          {message}
        </Text>
        <View style={styles.dotsRow}>
          <Animated.View
            style={[
              styles.dot,
              { opacity: dot1Anim, backgroundColor: isLight ? BrandColors.primary : "#FFF" },
            ]}
          />
          <Animated.View
            style={[
              styles.dot,
              { opacity: dot2Anim, backgroundColor: isLight ? BrandColors.primary : "#FFF" },
            ]}
          />
          <Animated.View
            style={[
              styles.dot,
              { opacity: dot3Anim, backgroundColor: isLight ? BrandColors.primary : "#FFF" },
            ]}
          />
        </View>
      </View>

      {subMessage ? (
        <Text style={[styles.subMessageText, isLight && styles.subMessageTextLight]}>
          {subMessage}
        </Text>
      ) : null}
    </View>
  );
}

// ============================================================================
// 2. STAR FULL SCREEN LOADER (Major screen initialization & session loads)
// ============================================================================

export interface StarFullScreenLoaderProps {
  message?: string;
  error?: string | null;
  onRetry?: () => void;
  theme?: "dark" | "light";
}

export function StarFullScreenLoader({
  message = "स्टार न्यूज़ नेटवर्क लोड हो रहा है...",
  error = null,
  onRetry,
  theme = "dark",
}: StarFullScreenLoaderProps) {
  const isLight = theme === "light";

  if (error) {
    return (
      <View style={[styles.fullScreen, isLight ? styles.fullScreenLight : styles.fullScreenDark]}>
        <View style={styles.errorIconWrap}>
          <Ionicons name="cloud-offline-outline" size={44} color={BrandColors.primary} />
        </View>
        <Text style={[styles.errorTitle, isLight && styles.errorTitleLight]}>
          नेटवर्क कनेक्शन त्रुटि
        </Text>
        <Text style={[styles.errorSubtitle, isLight && styles.errorSubtitleLight]}>
          {error}
        </Text>
        {onRetry && (
          <TouchableOpacity style={styles.retryButton} onPress={onRetry} activeOpacity={0.85}>
            <Ionicons name="refresh" size={16} color="#FFF" />
            <Text style={styles.retryText}>पुनः लोड करें (Retry)</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={[styles.fullScreen, isLight ? styles.fullScreenLight : styles.fullScreenDark]}>
      {/* Background Ambience Glow */}
      <View style={styles.glowCircle} />
      <StarBrandLoader message={message} theme={theme} size="large" />
    </View>
  );
}

// ============================================================================
// 3. STAR PAGE LOADER (In-screen content list loading with error handling)
// ============================================================================

export interface StarPageLoaderProps {
  message?: string;
  error?: string | null;
  onRetry?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function StarPageLoader({
  message = "सामग्री लोड हो रही है...",
  error = null,
  onRetry,
  style,
}: StarPageLoaderProps) {
  if (error) {
    return (
      <View style={[styles.pageLoaderContainer, style]}>
        <Ionicons name="alert-circle-outline" size={38} color={BrandColors.primary} />
        <Text style={styles.pageErrorText}>{error}</Text>
        {onRetry && (
          <TouchableOpacity style={styles.retryButtonSmall} onPress={onRetry}>
            <Ionicons name="refresh" size={14} color="#FFF" />
            <Text style={styles.retryTextSmall}>पुनः प्रयास करें</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={[styles.pageLoaderContainer, style]}>
      <StarBrandLoader message={message} theme="light" size="small" showTagline={false} />
    </View>
  );
}

// ============================================================================
// 4. STAR INLINE LOADER (Small operations: bookmarks, save, share, micro actions)
// ============================================================================

export interface StarInlineLoaderProps {
  message?: string;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export function StarInlineLoader({
  message = "कृपया प्रतीक्षा करें...",
  color = BrandColors.primary,
  style,
}: StarInlineLoaderProps) {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const rotate = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1800,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    rotate.start();
    return () => rotate.stop();
  }, [rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={[styles.inlineRow, style]}>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <MaterialCommunityIcons name="star-four-points" size={18} color={color} />
      </Animated.View>
      <Text style={[styles.inlineText, { color }]}>{message}</Text>
    </View>
  );
}

// ============================================================================
// 5. STAR BUTTON LOADER (Designed for touchable action buttons)
// ============================================================================

export interface StarButtonLoaderProps {
  label?: string;
  color?: string;
}

export function StarButtonLoader({
  label = "लोड हो रहा है...",
  color = "#FFF",
}: StarButtonLoaderProps) {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const rotate = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1400,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    rotate.start();
    return () => rotate.stop();
  }, [rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.buttonLoaderRow}>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <MaterialCommunityIcons name="star-four-points" size={16} color={color} />
      </Animated.View>
      <Text style={[styles.buttonLoaderText, { color }]}>{label}</Text>
    </View>
  );
}

// ============================================================================
// 6. STAR SKELETON LOADER (Branded Shimmer Placeholder Cards)
// ============================================================================

export function StarSkeletonLoader({ count = 3 }: { count?: number }) {
  const shimmerAnim = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 0.95,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0.35,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [shimmerAnim]);

  return (
    <View style={styles.skeletonContainer}>
      {Array.from({ length: count }).map((_, idx) => (
        <View key={idx} style={styles.skeletonCard}>
          {/* Image Placeholder with Star Watermark */}
          <View style={styles.skeletonImageArea}>
            <Animated.View style={[styles.skeletonImageFill, { opacity: shimmerAnim }]} />
            <View style={styles.skeletonWatermark}>
              <MaterialCommunityIcons name="star-four-points" size={24} color="#CBD5E1" />
              <Text style={styles.skeletonBrandText}>STAR NEWS</Text>
            </View>
          </View>

          {/* Text Content Lines */}
          <View style={styles.skeletonContent}>
            <Animated.View
              style={[
                styles.skeletonBadgeLine,
                { opacity: shimmerAnim, backgroundColor: "#FEE2E2" },
              ]}
            />
            <Animated.View
              style={[styles.skeletonTitleLine1, { opacity: shimmerAnim }]}
            />
            <Animated.View
              style={[styles.skeletonTitleLine2, { opacity: shimmerAnim }]}
            />
            <View style={styles.skeletonFooterRow}>
              <Animated.View
                style={[styles.skeletonMetaLine, { opacity: shimmerAnim }]}
              />
              <Animated.View
                style={[styles.skeletonActionLine, { opacity: shimmerAnim }]}
              />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

// ============================================================================
// 7. STAR IMAGE LOADER (Placeholder while remote images load)
// ============================================================================

export function StarImageLoader({ style }: { style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.imagePlaceholderWrap, style]}>
      <View style={styles.imagePlaceholderIcon}>
        <MaterialCommunityIcons name="star-four-points" size={22} color={BrandColors.primary} />
      </View>
      <Text style={styles.imagePlaceholderText}>STAR NEWS NETWORKS</Text>
      <Text style={styles.imagePlaceholderSub}>पन्ना • म.प्र.</Text>
    </View>
  );
}

// ============================================================================
// 8. STAR VIDEO LOADER (Video buffering & player loading)
// ============================================================================

export function StarVideoLoader({
  label = "स्टार न्यूज़ वीडियो बफर हो रहा है...",
}: {
  label?: string;
}) {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const rotate = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    rotate.start();
    return () => rotate.stop();
  }, [rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.videoLoaderOverlay}>
      <View style={styles.videoLoaderBadge}>
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <MaterialCommunityIcons name="star-four-points" size={26} color="#FFF" />
        </Animated.View>
      </View>
      <View style={styles.videoBadgeTag}>
        <View style={styles.livePulseDot} />
        <Text style={styles.videoBadgeTagText}>LIVE • 24×7</Text>
      </View>
      <Text style={styles.videoLoaderText}>{label}</Text>
    </View>
  );
}

// ============================================================================
// 9. STAR EPAPER LOADER (Digital page loading)
// ============================================================================

export function StarEpaperLoader({
  message = "स्टार न्यूज़ ई-पेपर पृष्ठ लोड हो रहा है...",
}: {
  message?: string;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.1, duration: 600, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [scaleAnim]);

  return (
    <View style={styles.epaperLoaderContainer}>
      <Animated.View
        style={[styles.epaperIconWrap, { transform: [{ scale: scaleAnim }] }]}
      >
        <MaterialCommunityIcons name="newspaper-variant" size={36} color={BrandColors.primary} />
      </Animated.View>
      <Text style={styles.epaperBrandHeader}>स्टार न्यूज़ दैनिक ई-पेपर</Text>
      <Text style={styles.epaperLoaderText}>{message}</Text>
    </View>
  );
}

// ============================================================================
// 10. STAR REFRESH LOADER (For Custom Pull-To-Refresh Indicators)
// ============================================================================

export function StarRefreshLoader() {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const rotate = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    rotate.start();
    return () => rotate.stop();
  }, [rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.refreshLoaderContainer}>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <MaterialCommunityIcons name="star-four-points" size={20} color={BrandColors.primary} />
      </Animated.View>
      <Text style={styles.refreshLoaderText}>ताज़ा खबरें अपडेट हो रही हैं...</Text>
    </View>
  );
}

// ============================================================================
// BACKWARDS-COMPATIBILITY ALIASES FOR EXISTING CALLS
// ============================================================================
export const BrandLoadingScreen = StarFullScreenLoader;
export const ScreenLoader = StarPageLoader;
export const ImageLoaderPlaceholder = StarImageLoader;
export const VideoLoader = StarVideoLoader;
export const EpaperLoader = StarEpaperLoader;

// ============================================================================
// STYLES
// ============================================================================
const styles = StyleSheet.create({
  centerContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  emblemContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    position: "relative",
  },
  rotatingAura: {
    position: "absolute",
    borderWidth: 2,
    borderStyle: "dashed",
  },
  emblemBadge: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.4)",
    ...Shadows.md,
  },
  brandTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleStar: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FFF",
    letterSpacing: 1,
  },
  titleStarLight: {
    color: BrandColors.charcoal,
  },
  titleNews: {
    fontSize: 22,
    fontWeight: "900",
    color: BrandColors.primary,
    letterSpacing: 1,
  },
  titleNetworks: {
    fontSize: 10,
    fontWeight: "900",
    color: "#FCA5A5",
    letterSpacing: 3,
    marginTop: 2,
  },
  titleNetworksLight: {
    color: BrandColors.textSecondary,
  },
  taglineBox: {
    alignItems: "center",
    marginTop: 6,
  },
  taglineText: {
    fontSize: 11,
    fontWeight: "800",
    color: "rgba(255,255,255,0.9)",
    letterSpacing: 1.5,
  },
  taglineTextLight: {
    color: BrandColors.textSecondary,
  },
  taglineHindi: {
    fontSize: 11,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "600",
    marginTop: 2,
  },
  taglineHindiLight: {
    color: BrandColors.textMuted,
  },
  progressTrack: {
    width: 140,
    height: 3,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 2,
    overflow: "hidden",
    marginTop: 18,
    marginBottom: 10,
  },
  progressBar: {
    height: "100%",
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  messageText: {
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(255,255,255,0.95)",
  },
  messageTextLight: {
    color: BrandColors.charcoal,
  },
  dotsRow: {
    flexDirection: "row",
    gap: 3,
    alignItems: "center",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  subMessageText: {
    fontSize: 10,
    color: "rgba(255,255,255,0.6)",
    marginTop: 6,
    fontWeight: "600",
  },
  subMessageTextLight: {
    color: BrandColors.textMuted,
  },

  // Full Screen
  fullScreen: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 99999,
  },
  fullScreenDark: {
    backgroundColor: BrandColors.primaryDark,
  },
  fullScreenLight: {
    backgroundColor: BrandColors.background,
  },
  glowCircle: {
    position: "absolute",
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: (width * 1.2) / 2,
    backgroundColor: "rgba(229, 9, 20, 0.35)",
  },
  errorIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  errorTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#FFF",
    marginBottom: 6,
  },
  errorTitleLight: {
    color: BrandColors.charcoal,
  },
  errorSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    textAlign: "center",
    paddingHorizontal: 30,
    lineHeight: 18,
    marginBottom: 20,
  },
  errorSubtitleLight: {
    color: BrandColors.textSecondary,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: BrandColors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "800",
  },

  // Page Loader
  pageLoaderContainer: {
    paddingVertical: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  pageErrorText: {
    fontSize: 13,
    color: BrandColors.textSecondary,
    textAlign: "center",
    marginVertical: 10,
    paddingHorizontal: 24,
  },
  retryButtonSmall: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: BrandColors.primary,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 6,
  },
  retryTextSmall: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
  },

  // Inline Loader
  inlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  inlineText: {
    fontSize: 12,
    fontWeight: "700",
  },

  // Button Loader
  buttonLoaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  buttonLoaderText: {
    fontSize: 13,
    fontWeight: "800",
  },

  // Skeleton
  skeletonContainer: {
    paddingVertical: 10,
  },
  skeletonCard: {
    backgroundColor: BrandColors.white,
    borderRadius: 14,
    marginHorizontal: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BrandColors.border,
    overflow: "hidden",
  },
  skeletonImageArea: {
    width: "100%",
    height: 185,
    backgroundColor: "#F1F5F9",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  skeletonImageFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#E2E8F0",
  },
  skeletonWatermark: {
    alignItems: "center",
    opacity: 0.65,
  },
  skeletonBrandText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#94A3B8",
    letterSpacing: 1.5,
    marginTop: 2,
  },
  skeletonContent: {
    padding: 14,
    gap: 10,
  },
  skeletonBadgeLine: {
    width: 80,
    height: 16,
    borderRadius: 4,
  },
  skeletonTitleLine1: {
    width: "92%",
    height: 18,
    borderRadius: 4,
    backgroundColor: "#E2E8F0",
  },
  skeletonTitleLine2: {
    width: "65%",
    height: 18,
    borderRadius: 4,
    backgroundColor: "#E2E8F0",
  },
  skeletonFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  skeletonMetaLine: {
    width: 80,
    height: 14,
    borderRadius: 4,
    backgroundColor: "#E2E8F0",
  },
  skeletonActionLine: {
    width: 44,
    height: 14,
    borderRadius: 4,
    backgroundColor: "#E2E8F0",
  },

  // Image Placeholder
  imagePlaceholderWrap: {
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: BrandColors.borderLight,
    padding: 12,
  },
  imagePlaceholderIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  imagePlaceholderText: {
    fontSize: 10,
    fontWeight: "900",
    color: BrandColors.primaryDark,
    letterSpacing: 1,
  },
  imagePlaceholderSub: {
    fontSize: 9,
    color: BrandColors.textMuted,
    marginTop: 1,
  },

  // Video Loader Overlay
  videoLoaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.78)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    padding: 16,
  },
  videoLoaderBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: BrandColors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  videoBadgeTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(229, 9, 20, 0.4)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 8,
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FFF",
  },
  videoBadgeTagText: {
    color: "#FFF",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  videoLoaderText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },

  // E-Paper Loader
  epaperLoaderContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  epaperIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  epaperBrandHeader: {
    fontSize: 13,
    fontWeight: "800",
    color: BrandColors.charcoal,
    marginBottom: 4,
  },
  epaperLoaderText: {
    fontSize: 11,
    color: BrandColors.textSecondary,
    fontWeight: "600",
  },

  // Refresh Loader
  refreshLoaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
  },
  refreshLoaderText: {
    fontSize: 11,
    fontWeight: "700",
    color: BrandColors.primaryDark,
  },
});
