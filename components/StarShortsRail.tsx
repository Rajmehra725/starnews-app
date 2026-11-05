import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { BrandColors, Shadows } from "@/constants/theme";
import { apiClient, YouTubeItem } from "@/_services/api";
import { getThumbnail } from "@/app/(tabs)/live";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.36; // ~135px on most phones
const CARD_HEIGHT = CARD_WIDTH * 1.6; // ~216px portrait 9:16 ratio

export default function StarShortsRail() {
  const [shorts, setShorts] = useState<YouTubeItem[]>([]);

  useEffect(() => {
    apiClient
      .get<YouTubeItem[]>("/api/youtube/all")
      .then((res) => {
        if (Array.isArray(res.data)) {
          // Reverse or prioritize videos for shorts feed
          setShorts(res.data.slice(0, 10));
        }
      })
      .catch(() => {});
  }, []);

  if (shorts.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.iconBadge}>
            <MaterialCommunityIcons name="lightning-bolt" size={14} color="#FFF" />
          </View>
          <View>
            <View style={styles.titleRow}>
              <Text style={styles.sectionTitle}>स्टार शॉर्ट्स</Text>
              <View style={styles.shortsBadge}>
                <Text style={styles.shortsBadgeText}>SHORTS</Text>
              </View>
            </View>
            <Text style={styles.sectionSubtitle}>त्वरित वीडियो समाचार • पन्ना एवं म.प्र.</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.viewAllBtn}
          onPress={() => router.push("/shorts")}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.viewAllText}>सभी देखें</Text>
          <Ionicons name="chevron-forward" size={12} color={BrandColors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + 10}
      >
        {shorts.map((item, index) => {
          const thumb = getThumbnail(item.link);
          const title = item.title || item.channelName || "स्टार न्यूज़ त्वरित अपडेट";

          return (
            <TouchableOpacity
              key={item._id}
              style={styles.card}
              activeOpacity={0.88}
              onPress={() =>
                router.push({
                  pathname: "/shorts",
                  params: { initialIndex: String(index) },
                })
              }
            >
              <Image source={{ uri: thumb }} style={styles.thumb} contentFit="cover" />

              {/* Dark Gradient Overlay */}
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.3)", "rgba(0,0,0,0.92)"]}
                style={styles.gradient}
              />

              {/* Top Tag */}
              <View style={styles.topTag}>
                <MaterialCommunityIcons name="play-circle" size={12} color="#FFF" />
                <Text style={styles.topTagText}>शॉर्ट्स</Text>
              </View>

              {/* Center Play Icon Circle */}
              <View style={styles.centerPlay}>
                <Ionicons name="play" size={16} color="#FFF" style={{ marginLeft: 2 }} />
              </View>

              {/* Bottom Info */}
              <View style={styles.bottomInfo}>
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {title}
                </Text>
                <View style={styles.cardMeta}>
                  <Text style={styles.bureauTag}>स्टार न्यूज़</Text>
                  <Text style={styles.watchText}>देखें</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 12,
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconBadge: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: BrandColors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: BrandColors.charcoal,
    letterSpacing: 0.4,
  },
  shortsBadge: {
    backgroundColor: "#DC2626",
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 3,
  },
  shortsBadgeText: {
    color: "#FFF",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  sectionSubtitle: {
    fontSize: 10,
    color: BrandColors.textMuted,
    fontWeight: "600",
    marginTop: 1,
  },
  viewAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: "700",
    color: BrandColors.primary,
  },
  scrollContent: {
    paddingHorizontal: 12,
    gap: 10,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 14,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    ...Shadows.sm,
  },
  thumb: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  topTag: {
    position: "absolute",
    top: 8,
    left: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  topTagText: {
    color: "#FFF",
    fontSize: 9,
    fontWeight: "800",
  },
  centerPlay: {
    position: "absolute",
    top: "38%",
    left: "50%",
    transform: [{ translateX: -16 }, { translateY: -16 }],
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(229, 9, 20, 0.85)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#FFF",
  },
  bottomInfo: {
    position: "absolute",
    bottom: 8,
    left: 8,
    right: 8,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#FFF",
    lineHeight: 15,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  bureauTag: {
    fontSize: 9,
    fontWeight: "700",
    color: "#FCA5A5",
  },
  watchText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#FFF",
  },
});
