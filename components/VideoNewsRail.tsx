import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Linking,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { BrandColors, Shadows } from "@/constants/theme";
import { apiClient, YouTubeItem } from "@/_services/api";
import { getVideoId, getThumbnail } from "@/app/(tabs)/live";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.65;

export default function VideoNewsRail() {
  const [videos, setVideos] = useState<YouTubeItem[]>([]);

  useEffect(() => {
    apiClient
      .get<YouTubeItem[]>("/api/youtube/all")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setVideos(res.data.slice(0, 8));
        }
      })
      .catch(() => {});
  }, []);

  if (videos.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.redIconBadge}>
            <Ionicons name="play" size={13} color="#FFF" style={{ marginLeft: 1 }} />
          </View>
          <Text style={styles.sectionTitle}>वीडियो न्यूज़ (VIDEO NEWS)</Text>
        </View>

        <TouchableOpacity
          style={styles.viewAllBtn}
          onPress={() => router.push("/(tabs)/categories")}
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
        snapToInterval={CARD_WIDTH + 12}
      >
        {videos.map((item) => {
          const thumb = getThumbnail(item.link);
          const title = item.title || item.channelName || "स्टार न्यूज़ वीडियो बुलेटिन";
          const isLive = item.type === "live";

          return (
            <TouchableOpacity
              key={item._id}
              style={styles.videoCard}
              activeOpacity={0.9}
              onPress={() => router.push("/(tabs)/live")}
            >
              <View style={styles.thumbWrap}>
                <Image source={{ uri: thumb }} style={styles.thumb} contentFit="cover" />
                <View style={styles.overlay} />

                {/* Play Button */}
                <View style={styles.playButton}>
                  <Ionicons name="play" size={18} color="#FFF" style={{ marginLeft: 2 }} />
                </View>

                {/* Badge */}
                <View style={[styles.badge, isLive && styles.liveBadge]}>
                  <Text style={styles.badgeText}>{isLive ? "🔴 LIVE" : "VIDEO"}</Text>
                </View>
              </View>

              <View style={styles.info}>
                <Text style={styles.videoTitle} numberOfLines={2}>
                  {title}
                </Text>
                <View style={styles.footerRow}>
                  <View style={styles.ytTag}>
                    <MaterialCommunityIcons name="youtube" size={13} color="#DC2626" />
                    <Text style={styles.ytTagText}>Star News</Text>
                  </View>
                  <Text style={styles.watchLiveText}>देखें →</Text>
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
    gap: 7,
  },
  redIconBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: BrandColors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: BrandColors.charcoal,
    letterSpacing: 0.5,
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
    gap: 12,
  },
  videoCard: {
    width: CARD_WIDTH,
    backgroundColor: "#FFF",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: BrandColors.border,
    ...Shadows.sm,
  },
  thumbWrap: {
    width: "100%",
    height: 125,
    backgroundColor: "#0F172A",
    position: "relative",
  },
  thumb: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.22)",
  },
  playButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -18 }, { translateY: -18 }],
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(229, 9, 20, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  badge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 3,
  },
  liveBadge: {
    backgroundColor: BrandColors.primary,
  },
  badgeText: {
    color: "#FFF",
    fontSize: 9,
    fontWeight: "900",
  },
  info: {
    padding: 10,
    gap: 6,
  },
  videoTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: BrandColors.charcoal,
    lineHeight: 17,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: BrandColors.borderLight,
    paddingTop: 6,
  },
  ytTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ytTagText: {
    fontSize: 10,
    fontWeight: "700",
    color: BrandColors.textSecondary,
  },
  watchLiveText: {
    fontSize: 11,
    fontWeight: "800",
    color: BrandColors.primary,
  },
});
