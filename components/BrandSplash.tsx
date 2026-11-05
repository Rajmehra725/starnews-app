import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { BrandColors } from "@/constants/theme";

const { width } = Dimensions.get("window");

interface BrandSplashProps {
  onAnimationComplete?: () => void;
  isReady: boolean;
}

export default function BrandSplash({
  onAnimationComplete,
  isReady,
}: BrandSplashProps) {
  // Animation drivers
  const logoScale = useRef(new Animated.Value(0.85)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslate = useRef(new Animated.Value(14)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Entrance animation sequence
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 500,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(textTranslate, {
        toValue: 0,
        duration: 500,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(progressWidth, {
        toValue: 1,
        duration: 1100,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  // When app resources & data are ready, perform smooth cross-fade exit
  useEffect(() => {
    if (isReady) {
      const exitTimer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(containerOpacity, {
            toValue: 0,
            duration: 380,
            useNativeDriver: true,
          }),
          Animated.timing(logoScale, {
            toValue: 1.06,
            duration: 380,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (onAnimationComplete) {
            onAnimationComplete();
          }
        });
      }, 700); // lightweight delay, max ~1.1s total

      return () => clearTimeout(exitTimer);
    }
  }, [isReady]);

  const barWidthInterpolation = progressWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: containerOpacity,
        },
      ]}
      pointerEvents={isReady ? "none" : "auto"}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={BrandColors.primaryDark}
        translucent
      />

      {/* Subtle radial glow */}
      <View style={styles.glowCircle} />

      <View style={styles.centerContent}>
        {/* Animated Brand Logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: logoScale }],
              opacity: logoOpacity,
            },
          ]}
        >
          <Image
            source={require("../assets/images/icon.png")}
            style={styles.logoImage}
            contentFit="contain"
            priority="high"
          />
        </Animated.View>

        {/* Brand Text & Typography */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: textOpacity,
              transform: [{ translateY: textTranslate }],
            },
          ]}
        >
          <View style={styles.brandTitleRow}>
            <Text style={styles.brandTitleWhite}>STAR </Text>
            <Text style={styles.brandTitleRed}>NEWS</Text>
          </View>
          <Text style={styles.brandSubTitle}>NETWORKS</Text>

          {/* Hindi Tagline */}
          <View style={styles.taglineBadge}>
            <Text style={styles.taglineHindi}>
              Local • Live • Trusted | लोकल • लाइव • भरोसेमंद
            </Text>
          </View>
        </Animated.View>

        {/* Professional Minimal Loading Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: barWidthInterpolation,
                },
              ]}
            />
          </View>
          <Text style={styles.loadingCaption}>
            पन्ना एवं बुंदेलखंड का सबसे भरोसेमंद डिजिटल न्यूज़ नेटवर्क...
          </Text>
        </View>
      </View>

      {/* Footer bureau accreditation */}
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>
          PANNA • SATNA • CHHATARPUR • MADHYA PRADESH
        </Text>
        <Text style={styles.footerSubText}>STAR NEWS NETWORKS 2.0</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: BrandColors.primaryDark, // Premium Star News Red branding
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 999999,
    elevation: 999999,
  },
  glowCircle: {
    position: "absolute",
    width: width * 1.3,
    height: width * 1.3,
    borderRadius: (width * 1.3) / 2,
    backgroundColor: "rgba(227, 30, 36, 0.12)",
    top: "18%",
    alignSelf: "center",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    width: "100%",
  },
  logoContainer: {
    width: 140,
    height: 140,
    borderRadius: 28,
    backgroundColor: "#16181E",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(227, 30, 36, 0.45)",
    shadowColor: BrandColors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
    marginBottom: 20,
    overflow: "hidden",
  },
  logoImage: {
    width: 110,
    height: 110,
  },
  textContainer: {
    alignItems: "center",
  },
  brandTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  brandTitleWhite: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 1.5,
  },
  brandTitleRed: {
    fontSize: 28,
    fontWeight: "900",
    color: BrandColors.primary,
    letterSpacing: 1.5,
  },
  brandSubTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#9CA3AF",
    letterSpacing: 5.5,
    marginTop: 2,
  },
  taglineBadge: {
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.07)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  taglineHindi: {
    fontSize: 13,
    fontWeight: "600",
    color: "#E5E7EB",
    letterSpacing: 0.3,
  },
  progressContainer: {
    marginTop: 48,
    alignItems: "center",
    width: "70%",
    maxWidth: 240,
  },
  progressTrack: {
    width: "100%",
    height: 3,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: BrandColors.primary,
    borderRadius: 2,
  },
  loadingCaption: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 10,
    fontWeight: "500",
  },
  footerContainer: {
    paddingBottom: Platform.OS === "ios" ? 44 : 28,
    alignItems: "center",
    gap: 4,
  },
  footerText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#6B7280",
    letterSpacing: 1.2,
  },
  footerSubText: {
    fontSize: 9,
    fontWeight: "800",
    color: "rgba(227, 30, 36, 0.8)",
    letterSpacing: 1.5,
  },
});
