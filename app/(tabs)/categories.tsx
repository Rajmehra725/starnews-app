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
} from "react-native";
import { Image } from "expo-image";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { BrandColors, Shadows } from "@/constants/theme";
import { apiClient, YouTubeItem } from "@/_services/api";

const { width } = Dimensions.get("window");

const getVideoId = (url: string) => {
  if (!url) return "";
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  return match ? match[1] : "";
};

const getThumbnail = (url: string) => {
  const id = getVideoId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800";
};

export default function VideoNewsScreen() {
  const [videos, setVideos] = useState<YouTubeItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "live" | "video">("all");

  const fetchVideos = async () => {
    try {
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
      const matchesSearch = search.trim()
        ? v.title.toLowerCase().includes(search.toLowerCase())
        : true;
      const matchesTab =
        activeTab === "all" ? true : v.type === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [videos, search, activeTab]);

  const handleOpenVideo = (link: string) => {
    if (!link) return;
    Linking.openURL(link).catch((err) => console.log("Failed to open link:", err));
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor={BrandColors.primaryDark} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>STAR LIVE TV</Text>
          </View>
          <Text style={styles.title}>वीडियो एवं लाइव प्रसारण</Text>
        </View>

        {/* Search Field */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={17} color={BrandColors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="वीडियो बुलेटिन खोजें (Search video news)..."
            placeholderTextColor={BrandColors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={17} color={BrandColors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Tab Filters */}
        <View style={styles.tabsRow}>
          {(["all", "live", "video"] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.filterChip, activeTab === tab && styles.activeFilterChip]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.filterChipText, activeTab === tab && styles.activeFilterChipText]}>
                {tab === "all" ? "सभी वीडियो (All)" : tab === "live" ? "🔴 लाइव (Live)" : "📹 रिपोर्ट्स (Reports)"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Videos Feed */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={BrandColors.primary} />
          <Text style={styles.loadingText}>वीडियो लोड हो रहे हैं...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredVideos}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[BrandColors.primary]}
            />
          }
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const thumb = getThumbnail(item.link);
            const isLive = item.type === "live";

            return (
              <TouchableOpacity
                style={styles.videoCard}
                activeOpacity={0.9}
                onPress={() => handleOpenVideo(item.link)}
              >
                <View style={styles.thumbnailWrapper}>
                  <Image source={{ uri: thumb }} style={styles.thumbnail} contentFit="cover" />
                  
                  {/* Dark Overlay */}
                  <View style={styles.videoOverlay} />

                  {/* Play Button Icon */}
                  <View style={styles.playIconBox}>
                    <Ionicons name="play" size={26} color="#FFF" style={{ marginLeft: 2 }} />
                  </View>

                  {/* Badge */}
                  <View style={[styles.typeBadge, isLive && styles.liveTypeBadge]}>
                    <Text style={styles.typeBadgeText}>
                      {isLive ? "🔴 LIVE STREAM" : "NEWS CLIP"}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardInfo}>
                  <Text style={styles.videoTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <View style={styles.cardFooter}>
                    <View style={styles.channelBadge}>
                      <MaterialCommunityIcons name="youtube" size={16} color="#EF4444" />
                      <Text style={styles.channelText}>Star News Networks 88</Text>
                    </View>
                    <View style={styles.watchNowBtn}>
                      <Text style={styles.watchNowText}>Watch on YouTube</Text>
                      <Ionicons name="open-outline" size={13} color={BrandColors.primary} />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="videocam-outline" size={48} color={BrandColors.textMuted} />
              <Text style={styles.emptyTitle}>कोई वीडियो उपलब्ध नहीं है</Text>
              <Text style={styles.emptySubtitle}>कृपया कुछ समय बाद पुनः देखें।</Text>
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
  header: {
    backgroundColor: BrandColors.primaryDark,
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 12,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 6,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#EF4444",
  },
  liveText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.8,
  },
  title: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 42,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: BrandColors.charcoal,
  },
  tabsRow: {
    flexDirection: "row",
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
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
    padding: 14,
    paddingBottom: 80,
    backgroundColor: BrandColors.background,
  },
  videoCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: BrandColors.border,
    ...Shadows.sm,
  },
  thumbnailWrapper: {
    width: "100%",
    height: 190,
    position: "relative",
    backgroundColor: "#000",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
  },
  playIconBox: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -25 }],
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(227, 30, 36, 0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  typeBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  liveTypeBadge: {
    backgroundColor: BrandColors.primary,
  },
  typeBadgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "800",
  },
  cardInfo: {
    padding: 12,
    gap: 8,
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: BrandColors.charcoal,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: BrandColors.borderLight,
    paddingTop: 8,
  },
  channelBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  channelText: {
    fontSize: 11,
    fontWeight: "600",
    color: BrandColors.textSecondary,
  },
  watchNowBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  watchNowText: {
    fontSize: 11,
    fontWeight: "700",
    color: BrandColors.primary,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    gap: 10,
    backgroundColor: BrandColors.background,
  },
  loadingText: {
    fontSize: 13,
    color: BrandColors.textSecondary,
    fontWeight: "600",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: BrandColors.charcoal,
  },
  emptySubtitle: {
    fontSize: 13,
    color: BrandColors.textSecondary,
  },
});