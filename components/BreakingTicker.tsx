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
import { BrandColors } from "@/constants/theme";
import { apiClient, API_BASE_URL, BreakingItem } from "@/_services/api";

export default function BreakingTicker() {
  const [items, setItems] = useState<BreakingItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Pulse animation for the LIVE indicator
  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
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
      const active = (res.data || []).filter((b) => b.isActive);
      setItems(active);
    } catch (err) {
      console.log("Breaking News Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBreaking();

    // Listen for live socket updates
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

  // Text cycling animation
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
    }, 4500);

    return () => clearInterval(timer);
  }, [items, fadeAnim, slideAnim]);

  if (loading && items.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={BrandColors.primary} />
        <Text style={styles.loadingText}>ताज़ा अपडेट लोड हो रहे हैं...</Text>
      </View>
    );
  }

  if (items.length === 0) {
    return null;
  }

  const currentItem = items[currentIndex] || items[0];

  return (
    <View style={styles.wrapper}>
      {/* Red News Channel Badge */}
      <View style={styles.badge}>
        <Animated.View style={[styles.liveDot, { opacity: pulseAnim }]} />
        <MaterialCommunityIcons name="flash" size={14} color="#FFF" />
        <Text style={styles.badgeText}>BREAKING</Text>
      </View>

      {/* Headline Text with animation */}
      <View style={styles.textContainer}>
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
      </View>

      {/* Counter Badge if multiple */}
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
    borderColor: "#FCA5A5",
    borderRadius: 8,
    marginHorizontal: 14,
    marginVertical: 10,
    overflow: "hidden",
    height: 42,
    elevation: 2,
    shadowColor: BrandColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.8,
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
  },
  counterBadge: {
    paddingRight: 10,
  },
  counterText: {
    fontSize: 10,
    fontWeight: "700",
    color: BrandColors.textMuted,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    gap: 8,
  },
  loadingText: {
    fontSize: 12,
    color: BrandColors.textSecondary,
    fontWeight: "500",
  },
});