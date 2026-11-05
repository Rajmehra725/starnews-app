import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  FlatList,
  RefreshControl,
  Dimensions,
  StatusBar,
  Share,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { BrandColors, BrandIdentity, Shadows } from "@/constants/theme";
import { apiClient, YouTubeItem, formatTimeAgo } from "@/_services/api";
import { getVideoId, getThumbnail } from "./live";
import StarHeader from "@/components/StarHeader";
import { StarPageLoader } from "@/components/StarBrandLoader";

const { width } = Dimensions.get("window");

export default function VideoNewsScreen() {
  const [videos, setVideos] = useState<YouTubeItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "live" | "panna" | "ground">("all");

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get<YouTubeItem[]>("/api/youtube/all");
      setVideos(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log("Videos fetch error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchVideos();
  };

  const filteredVideos = useMemo(() => {
    return videos.filter((v) => {
      const title = (v.title || v.channelName || "Star News").toLowerCase();
      const matchesSearch = search.trim() ? title.includes(search.toLowerCase()) : true;

      if (!matchesSearch) return false;
      if (activeTab === "all") return true;
      if (activeTab === "live") return v.type === "live";
      if (activeTab === "panna") return title.includes("पन्ना") || title.includes("panna") || true;
      if (activeTab === "ground") return title.includes("रिपोर्ट") || title.includes("ground") || true;
      return true;
    });
  }, [videos, search, activeTab]);

  const handleOpenVideo = (item: YouTubeItem) => {
    // Navigate to Live tab where embedded player plays it
    router.push("/(tabs)/live");
  };

  const handleShareVideo = async (item: YouTubeItem) => {
    const title = item.title || item.channelName || "स्टार न्यूज़ वीडियो";
    try {
      await Share.share({
        title,
        message: `📹 ${title}\n\nस्टार न्यूज़ नेटवर्क पर वीडियो देखें:\n${item.link}`,
      });
    } catch {}
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor={BrandColors.primaryDark} />

      {/* Unified Star Header */}
      <StarHeader
        variant="video"
        title="स्टार वीडियो हब"
        subtitle="पन्ना, मध्य प्रदेश एवं राष्ट्रीय बुलेटिन"
        onLivePress={() => router.push("/(tabs)/live")}
      />

      {/* Video Filter & Search Controls */}
      <View style={styles.subFilterBar}>
        {/* Search Field */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={16} color={BrandColors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="वीडियो समाचार खोजें (Search video news)..."
            placeholderTextColor={BrandColors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={16} color={BrandColors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Tab Filters */}
        <View style={styles.tabsRow}>
          {[
            { id: "all", label: "सभी वीडियो" },
            { id: "live", label: "🔴 लाइव" },
            { id: "panna", label: "पन्ना बुलेटिन" },
            { id: "ground", label: "ग्राउंड रिपोर्ट" },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.filterChip, activeTab === tab.id && styles.activeFilterChip]}
              onPress={() => setActiveTab(tab.id as any)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  activeTab === tab.id && styles.activeFilterChipText,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Videos List with StarPageLoader */}
      {loading && videos.length === 0 ? (
        <StarPageLoader
          message="स्टार न्यूज़ वीडियो लोड हो रहे हैं..."
          onRetry={fetchVideos}
        />
      ) : (
        <FlatList
          data={filteredVideos}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[BrandColors.primary]}
              tintColor={BrandColors.primary}
            />
          }
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const thumb = getThumbnail(item.link);
            const isLive = item.type === "live";
            const title = item.title || item.channelName || "स्टार न्यूज़ वीडियो बुलेटिन";

            return (
              <TouchableOpacity
                style={styles.card}
                activeOpacity={0.9}
                onPress={() => handleOpenVideo(item)}
              >
                <View style={styles.thumbWrap}>
                  <Image source={{ uri: thumb }} style={styles.thumb} contentFit="cover" />
                  <View style={styles.overlay} />

                  <View style={styles.playBtn}>
                    <Ionicons name="play" size={24} color="#FFF" style={{ marginLeft: 2 }} />
                  </View>

                  <View style={[styles.badge, isLive && styles.liveBadge]}>
                    <Text style={styles.badgeText}>{isLive ? "🔴 LIVE" : "VIDEO"}</Text>
                  </View>
                </View>

                <View style={styles.info}>
                  <Text style={styles.title} numberOfLines={2}>
                    {title}
                  </Text>

                  <View style={styles.footerRow}>
                    <View style={styles.ytBadge}>
                      <MaterialCommunityIcons name="youtube" size={16} color="#DC2626" />
                      <Text style={styles.ytText}>{item.channelName || "Star News Network"}</Text>
                    </View>

                    <View style={styles.actionGroup}>
                      <TouchableOpacity
                        style={styles.shareBtn}
                        onPress={() => handleShareVideo(item)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Ionicons name="share-social-outline" size={16} color={BrandColors.textSecondary} />
                      </TouchableOpacity>

                      <Text style={styles.watchText}>देखें →</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={styles.center}>
              <MaterialCommunityIcons name="television-off" size={48} color={BrandColors.textMuted} />
              <Text style={styles.emptyTitle}>कोई वीडियो समाचार नहीं मिला</Text>
              <Text style={styles.emptySubtitle}>कृपया कोई अन्य फ़िल्टर चुनें या पुनः लोड करें।</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BrandColors.primaryDark,
  },
  subFilterBar: {
    backgroundColor: BrandColors.primaryDark,
    paddingHorizontal: 14,
    paddingBottom: 12,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    ...Shadows.md,
  },
  header: {
    backgroundColor: BrandColors.primaryDark,
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    ...Shadows.md,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  brandLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: BrandColors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#FFF",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#FFF",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 10,
    color: "#FCA5A5",
    fontWeight: "600",
    marginTop: 1,
  },
  liveNavBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(229, 9, 20, 0.8)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FFF",
  },
  liveNavText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "900",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 38,
    gap: 8,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: BrandColors.charcoal,
  },
  tabsRow: {
    flexDirection: "row",
    gap: 6,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.14)",
  },
  activeFilterChip: {
    backgroundColor: "#FFF",
  },
  filterChipText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "700",
  },
  activeFilterChipText: {
    color: BrandColors.primaryDark,
  },
  listContent: {
    padding: 12,
    paddingBottom: 90,
    backgroundColor: BrandColors.background,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: BrandColors.border,
    ...Shadows.sm,
  },
  thumbWrap: {
    width: "100%",
    height: 190,
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
  playBtn: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -22 }, { translateY: -22 }],
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(229, 9, 20, 0.92)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
  },
  badge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
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
    padding: 12,
    gap: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "800",
    color: BrandColors.charcoal,
    lineHeight: 20,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: BrandColors.borderLight,
    paddingTop: 8,
  },
  ytBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ytText: {
    fontSize: 11,
    fontWeight: "600",
    color: BrandColors.textSecondary,
  },
  actionGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  shareBtn: {
    padding: 2,
  },
  watchText: {
    fontSize: 12,
    fontWeight: "800",
    color: BrandColors.primary,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: BrandColors.background,
    gap: 10,
  },
  loadingText: {
    fontSize: 13,
    color: BrandColors.textSecondary,
    fontWeight: "600",
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: BrandColors.charcoal,
  },
  emptySubtitle: {
    fontSize: 12,
    color: BrandColors.textSecondary,
    textAlign: "center",
  },
});