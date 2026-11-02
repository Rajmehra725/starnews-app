import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { BrandColors } from "@/constants/theme";

export default function LoadingSkeleton() {
  const shimmerAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0.3,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [shimmerAnim]);

  return (
    <View style={styles.container}>
      {[1, 2, 3].map((key) => (
        <View key={key} style={styles.card}>
          <Animated.View style={[styles.imagePlaceholder, { opacity: shimmerAnim }]} />
          <View style={styles.content}>
            <Animated.View style={[styles.badgeLine, { opacity: shimmerAnim }]} />
            <Animated.View style={[styles.titleLine1, { opacity: shimmerAnim }]} />
            <Animated.View style={[styles.titleLine2, { opacity: shimmerAnim }]} />
            <View style={styles.footerRow}>
              <Animated.View style={[styles.metaLine, { opacity: shimmerAnim }]} />
              <Animated.View style={[styles.actionLine, { opacity: shimmerAnim }]} />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  card: {
    backgroundColor: BrandColors.white,
    borderRadius: 14,
    marginHorizontal: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BrandColors.border,
    overflow: "hidden",
  },
  imagePlaceholder: {
    width: "100%",
    height: 195,
    backgroundColor: "#E2E8F0",
  },
  content: {
    padding: 14,
    gap: 10,
  },
  badgeLine: {
    width: 70,
    height: 16,
    borderRadius: 4,
    backgroundColor: "#E2E8F0",
  },
  titleLine1: {
    width: "90%",
    height: 18,
    borderRadius: 4,
    backgroundColor: "#E2E8F0",
  },
  titleLine2: {
    width: "60%",
    height: 18,
    borderRadius: 4,
    backgroundColor: "#E2E8F0",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  metaLine: {
    width: 80,
    height: 14,
    borderRadius: 4,
    backgroundColor: "#E2E8F0",
  },
  actionLine: {
    width: 40,
    height: 14,
    borderRadius: 4,
    backgroundColor: "#E2E8F0",
  },
});
