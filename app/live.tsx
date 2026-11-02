import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  StatusBar,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { BrandColors, Shadows } from "@/constants/theme";
import { apiClient, YouTubeItem } from "@/_services/api";

const getVideoId = (url: string) => {
  if (!url) return "";
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  return match ? match[1] : "";
};

const getThumbnail = (url: string) => {
  const id = getVideoId(url);
  return id
    ? `https://img.youtube.com/vi/${id}/hqdefault.jpg`
    : "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800";
};

export default function LiveScreen() {
  const [videos, setVideos] = useState<YouTubeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get<YouTubeItem[]>("/api/youtube/all");
      setVideos(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log("Live stream fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleOpenVideo = (link: string) => {
    if (!link) return;
    Linking.openURL(link).catch((e) => console.log(e));
  };

  const filtered = videos.filter((v) =>
    v.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor={BrandColors.primaryDark} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.navRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#FFF" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <View style={styles.liveTagRow}>
              <View style={styles.liveDot} />
              <Text style={styles.liveTagText}>24×7 LIVE BROADCAST</Text>
            </View>
            <Text style={styles.headerTitle}>स्टार लाइव टीवी (LIVE TV)</Text>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={17} color={BrandColors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="लाइव बुलेटिन खोजें..."
            placeholderTextColor={BrandColors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={BrandColors.primary} />
          <Text style={styles.loadingText}>लाइव प्रसारण लोड हो रहा है...</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id}
          refreshing={refreshing}
          onRefresh={fetchVideos}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const thumb = getThumbnail(item.link);
            const isLive = item.type === "live";

            return (
              <TouchableOpacity
                style={styles.card}
                activeOpacity={0.9}
                onPress={() => handleOpenVideo(item.link)}
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
                    {item.title}
                  </Text>
                  <View style={styles.footerRow}>
                    <View style={styles.ytBadge}>
                      <MaterialCommunityIcons name="youtube" size={16} color="#DC2626" />
                      <Text style={styles.ytText}>Star News Networks</Text>
                    </View>
                    <Text style={styles.watchText}>Watch Live →</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={styles.center}>
              <MaterialCommunityIcons name="television-off" size={48} color={BrandColors.textMuted} />
              <Text style={styles.emptyTitle}>कोई लाइव प्रसारण उपलब्ध नहीं है</Text>
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
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingTop: 6,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  liveTagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#EF4444",
  },
  liveTagText: {
    color: "#FCA5A5",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#FFF",
    letterSpacing: 0.5,
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
  listContent: {
    padding: 14,
    paddingBottom: 60,
    backgroundColor: BrandColors.background,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: BrandColors.border,
    ...Shadows.sm,
  },
  thumbWrap: {
    width: "100%",
    height: 185,
    backgroundColor: "#000",
    position: "relative",
  },
  thumb: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  playBtn: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -22 }, { translateY: -22 }],
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(227, 30, 36, 0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  liveBadge: {
    backgroundColor: BrandColors.primary,
  },
  badgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "800",
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
  watchText: {
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
});