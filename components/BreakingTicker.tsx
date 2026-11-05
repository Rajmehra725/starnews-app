import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { io } from "socket.io-client";
import { router } from "expo-router";
import { BrandColors, Shadows } from "@/constants/theme";
import { apiClient, API_BASE_URL, BreakingItem } from "@/_services/api";

export default function BreakingTicker() {
  const [items, setItems] = useState<BreakingItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Pulse animation for the FLASH indicator
  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();
    return () => pulseLoop.stop();
  }, [pulseAnim]);

  // Fetch breaking news from backend
  const fetchBreaking = async () => {
    try {
      const res = await apiClient.get<BreakingItem[]>("/api/breaking");
      const active = (res.data || [])
        .filter((b) => b.isActive)
        .sort((a, b) => (b.priority || 0) - (a.priority || 0));
      setItems(active);
    } catch (err) {
      console.log("Breaking News Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBreaking();

    const socket = io(API_BASE_URL, { transports: ["websocket"] });
    socket.on("breakingUpdated", () => {
      fetchBreaking();
    });

    const interval = setInterval(fetchBreaking, 30000);

    return () => {
      socket.disconnect();
      clearInterval(interval);
    };
  }, []);

  // Text cycling animation (smooth slide and cross-fade)
  useEffect(() => {
    if (items.length <= 1) return;

    const timer = setInterval(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -8,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
        slideAnim.setValue(8);
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [items, fadeAnim, slideAnim]);

  if (loading && items.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={BrandColors.primary} />
        <Text style={styles.loadingText}>ताज़ा ब्रेकिंग अपडेट लोड हो रहे हैं...</Text>
      </View>
    );
  }

  if (items.length === 0) {
    return null;
  }

  const currentItem = items[currentIndex] || items[0];

  return (
    <View style={styles.wrapper}>
      {/* High-impact Aaj Tak-style Breaking Badge */}
      <View style={styles.badge}>
        <Animated.View style={[styles.liveDot, { opacity: pulseAnim }]} />
        <MaterialCommunityIcons name="flash" size={15} color="#FFF" />
        <Text style={styles.badgeText}>ब्रेकिंग</Text>
      </View>

      {/* Marquee Headline Text with slide animation */}
      <TouchableOpacity
        style={styles.textContainer}
        activeOpacity={0.8}
        onPress={() => {
          // If the item has priority or matches a news item, we can allow readers to tap
        }}
      >
        <Animated.Text
          style={[
            styles.headlineText,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
          numberOfLines={1}
        >
          {currentItem.text}
        </Animated.Text>
      </TouchableOpacity>

      {/* Live Counter Badge */}
      {items.length > 1 && (
        <View style={styles.counterBadge}>
          <Text style={styles.counterText}>
            {currentIndex + 1}/{items.length}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 8,
    marginHorizontal: 12,
    marginVertical: 8,
    overflow: "hidden",
    height: 40,
    elevation: 3,
    shadowColor: BrandColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },
  badge: {
    backgroundColor: BrandColors.primary,
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FFF",
  },
  badgeText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  headlineText: {
    fontSize: 13,
    fontWeight: "700",
    color: BrandColors.charcoal,
    lineHeight: 18,
  },
  counterBadge: {
    paddingRight: 10,
    paddingLeft: 4,
  },
  counterText: {
    fontSize: 10,
    fontWeight: "800",
    color: BrandColors.primaryDark,
    backgroundColor: BrandColors.primaryGhost,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    gap: 8,
  },
  loadingText: {
    fontSize: 11,
    color: BrandColors.textSecondary,
    fontWeight: "600",
  },
});