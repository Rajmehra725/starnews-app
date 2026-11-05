import React, { useEffect, useState, useMemo, useRef } from "react";
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
  Dimensions,
  Share,
  Platform,
  RefreshControl,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import { router } from "expo-router";
import { BrandColors, BrandIdentity, Shadows, Typography } from "@/constants/theme";
import { apiClient, YouTubeItem, formatTimeAgo } from "@/_services/api";
import StarHeader from "@/components/StarHeader";
import { StarVideoLoader } from "@/components/StarBrandLoader";
import StarVideoPlayer from "@/components/StarVideoPlayer";

const { width, height } = Dimensions.get("window");

export const getVideoId = (url: string) => {
  if (!url) return "";
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );
  return match ? match[1] : "";
};

export const getThumbnail = (url: string) => {
  const id = getVideoId(url);
  return id
    ? `https://img.youtube.com/vi/${id}/hqdefault.jpg`
    : "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800";
};

export default function LiveTVScreen() {
  const [videos, setVideos] = useState<YouTubeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "live" | "panna" | "ground">("all");
  const [currentPlayingVideo, setCurrentPlayingVideo] = useState<YouTubeItem | null>(null);
  const [fullscreenModal, setFullscreenModal] = useState(false);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get<YouTubeItem[]>("/api/youtube/all");
      const list = Array.isArray(res.data) ? res.data : [];
      setVideos(list);
      // Default to first video or first live video as active
      if (list.length > 0 && !currentPlayingVideo) {
        const liveVideo = list.find((v) => v.type === "live") || list[0];
        setCurrentPlayingVideo(liveVideo);
      }
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

  const handleShareVideo = async (item: YouTubeItem) => {
    const title = item.title || item.channelName || "Star News Live Bulletin";
    try {
      await Share.share({
        title,
        message: `🔴 ${title}\n\nस्टार न्यूज़ नेटवर्क लाइव बुलेटिन देखें:\n${item.link}`,
      });
    } catch (e) {
      console.log("Share video error:", e);
    }
  };

  const handleExternalOpen = (url: string) => {
    if (!url) return;
    Linking.openURL(url).catch((err) => console.log("Failed to open video link:", err));
  };

  const activeVideoId = currentPlayingVideo ? getVideoId(currentPlayingVideo.link) : "";
  const embedUrl = activeVideoId
    ? `https://www.youtube-nocookie.com/embed/${activeVideoId}?autoplay=1&playsinline=1&rel=0&modestbranding=1`
    : "";

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor={BrandColors.primaryDark} />

      {/* Editorial Header */}
      <StarHeader
        variant="live"
        title="STAR LIVE 24×7"
        subtitle="सीधा प्रसारण • पन्ना एवं मध्य प्रदेश"
      />

      <View style={styles.header}>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={16} color={BrandColors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="लाइव बुलेटिन या वीडियो खोजें (Search live news)..."
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

        {/* Filter Chips */}
        <View style={styles.chipsRow}>
          {[
            { id: "all", label: "सभी वीडियो" },
            { id: "live", label: "🔴 लाइव टीवी" },
            { id: "panna", label: "पन्ना बुलेटिन" },
            { id: "ground", label: "ग्राउंड रिपोर्ट" },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.filterChip, activeTab === tab.id && styles.activeFilterChip]}
              onPress={() => setActiveTab(tab.id as any)}
              activeOpacity={0.8}
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

      {/* Main Stream Player & Feed */}
      {loading && videos.length === 0 ? (
        <StarVideoLoader label="स्टार लाइव टीवी 24×7 कनेक्ट हो रहा है..." />
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
          ListHeaderComponent={
            <View style={styles.playerContainer}>
              {/* Active Embedded Player */}
              <View style={styles.videoPlayerCard}>
                <View style={styles.playerWrapper}>
                  {activeVideoId ? (
                    <StarVideoPlayer
                      videoId={activeVideoId}
                      title={currentPlayingVideo?.title || "Star News Live TV"}
                      style={styles.webview}
                      autoplay={true}
                      showControls={true}
                    />
                  ) : (
                    <View style={styles.playerPlaceholder}>
                      <Ionicons name="tv-outline" size={48} color="#94A3B8" />
                      <Text style={styles.placeholderText}>वीडियो चुनने के लिए नीचे सूची देखें</Text>
                    </View>
                  )}

                  {/* Player Top Overlay Controls */}
                  <View style={styles.playerControlsOverlay} pointerEvents="box-none">
                    <View style={styles.liveFloatingBadge}>
                      <View style={styles.liveRedPill}>
                        <View style={styles.pulsingWhiteDot} />
                        <Text style={styles.liveRedPillText}>24×7 BROADCAST</Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={styles.fullscreenBtn}
                      onPress={() => setFullscreenModal(true)}
                    >
                      <MaterialCommunityIcons name="fullscreen" size={20} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Player Metadata & Quick Actions */}
                <View style={styles.playerMeta}>
                  <View style={styles.playerMetaHeader}>
                    <View style={styles.reporterPill}>
                      <MaterialCommunityIcons name="shield-check" size={13} color={BrandColors.primary} />
                      <Text style={styles.reporterPillText}>आधिकारिक प्रसारण • स्टार न्यूज़ नेटवर्क</Text>
                    </View>
                    <Text style={styles.playerTimeText}>
                      {formatTimeAgo(currentPlayingVideo?.createdAt)}
                    </Text>
                  </View>

                  <Text style={styles.playerTitle} numberOfLines={2}>
                    {currentPlayingVideo?.title ||
                      currentPlayingVideo?.channelName ||
                      "स्टार न्यूज़ नेटवर्क - 24×7 लाइव प्रसारण"}
                  </Text>

                  {/* Quick Action Bar */}
                  <View style={styles.playerActionRow}>
                    <TouchableOpacity
                      style={styles.playerActionButton}
                      onPress={() => currentPlayingVideo && handleShareVideo(currentPlayingVideo)}
                    >
                      <Ionicons name="share-social-outline" size={16} color={BrandColors.charcoal} />
                      <Text style={styles.playerActionText}>शेयर करें</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.playerActionButton}
                      onPress={() => currentPlayingVideo && handleExternalOpen(currentPlayingVideo.link)}
                    >
                      <MaterialCommunityIcons name="youtube" size={18} color="#DC2626" />
                      <Text style={styles.playerActionText}>YouTube पर देखें</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.playerActionButton, styles.actionPrimary]}
                      onPress={() => Linking.openURL("https://wa.me/917987667358")}
                    >
                      <Ionicons name="logo-whatsapp" size={16} color="#FFF" />
                      <Text style={styles.actionPrimaryText}>खबर भेजें</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Feed Divider Title */}
              <View style={styles.feedHeaderRow}>
                <View style={styles.feedRedBar} />
                <Text style={styles.feedSectionTitle}>
                  {activeTab === "live"
                    ? "लाइव बुलेटिन एवं चैनल्स"
                    : activeTab === "panna"
                    ? "पन्ना जिला विशेष वीडियो"
                    : "ताज़ा वीडियो समाचार (LATEST VIDEOS)"}
                </Text>
                <Text style={styles.feedCountText}>({filteredVideos.length})</Text>
              </View>
            </View>
          }
          renderItem={({ item }) => {
            const thumb = getThumbnail(item.link);
            const isLive = item.type === "live";
            const isCurrentlyPlaying = currentPlayingVideo?._id === item._id;
            const videoTitle = item.title || item.channelName || "स्टार न्यूज़ बुलेटिन";

            return (
              <TouchableOpacity
                style={[styles.videoCard, isCurrentlyPlaying && styles.playingCardBorder]}
                activeOpacity={0.88}
                onPress={() => setCurrentPlayingVideo(item)}
              >
                <View style={styles.cardThumbWrap}>
                  <Image source={{ uri: thumb }} style={styles.cardThumb} contentFit="cover" />
                  <View style={styles.cardOverlay} />

                  {/* Play Button Icon */}
                  <View style={[styles.cardPlayBtn, isCurrentlyPlaying && styles.cardActivePlayBtn]}>
                    <Ionicons
                      name={isCurrentlyPlaying ? "volume-high" : "play"}
                      size={18}
                      color="#FFF"
                      style={{ marginLeft: isCurrentlyPlaying ? 0 : 2 }}
                    />
                  </View>

                  {/* Live or HD Badge */}
                  <View style={[styles.cardBadge, isLive && styles.cardLiveBadge]}>
                    <Text style={styles.cardBadgeText}>{isLive ? "🔴 LIVE" : "VIDEO"}</Text>
                  </View>
                </View>

                <View style={styles.cardInfo}>
                  <View style={styles.cardMetaRow}>
                    <Text style={styles.channelName}>{item.channelName || "Star News"}</Text>
                    <Text style={styles.cardTime}>{formatTimeAgo(item.createdAt)}</Text>
                  </View>

                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {videoTitle}
                  </Text>

                  <View style={styles.cardFooter}>
                    <View style={styles.statusIndicator}>
                      {isCurrentlyPlaying ? (
                        <View style={styles.nowPlayingRow}>
                          <View style={styles.nowPlayingDot} />
                          <Text style={styles.nowPlayingText}>प्लेयर में सक्रिय</Text>
                        </View>
                      ) : (
                        <Text style={styles.tapToPlayText}>चलाने के लिए टैप करें</Text>
                      )}
                    </View>

                    <TouchableOpacity
                      style={styles.cardShareBtn}
                      onPress={() => handleShareVideo(item)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Ionicons name="share-social-outline" size={15} color={BrandColors.textSecondary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="television-off" size={48} color={BrandColors.textMuted} />
              <Text style={styles.emptyTitle}>कोई वीडियो समाचार नहीं मिला</Text>
              <Text style={styles.emptySubtitle}>कृपया कोई अन्य फ़िल्टर चुनें या पुनः लोड करें।</Text>
              <TouchableOpacity style={styles.retryBtn} onPress={fetchVideos}>
                <Text style={styles.retryBtnText}>पुनः लोड करें</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      {/* Fullscreen Video Modal */}
      <Modal
        visible={fullscreenModal}
        animationType="fade"
        onRequestClose={() => setFullscreenModal(false)}
      >
        <SafeAreaView style={styles.fullscreenSafe}>
          <StatusBar barStyle="light-content" backgroundColor="#000" />
          <View style={styles.fullscreenHeader}>
            <TouchableOpacity
              style={styles.fullscreenCloseBtn}
              onPress={() => setFullscreenModal(false)}
            >
              <Ionicons name="close" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.fullscreenTitle} numberOfLines={1}>
              {currentPlayingVideo?.title || "Star News Live TV"}
            </Text>
          </View>

          <View style={styles.fullscreenVideoWrap}>
            {activeVideoId ? (
              <StarVideoPlayer
                videoId={activeVideoId}
                title={currentPlayingVideo?.title || "Star News Live TV"}
                style={styles.fullscreenWebview}
                autoplay={true}
                showControls={true}
              />
            ) : null}
          </View>
        </SafeAreaView>
      </Modal>
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
  brandTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFF",
    letterSpacing: 0.5,
  },
  liveIndicatorPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 4,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.6)",
  },
  pulsingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#EF4444",
  },
  liveIndicatorText: {
    color: "#FFF",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  brandSub: {
    fontSize: 10,
    color: "#FCA5A5",
    fontWeight: "600",
    marginTop: 1,
  },
  helplineBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.16)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 5,
  },
  helplineBtnText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "700",
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
  chipsRow: {
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
    backgroundColor: BrandColors.background,
    paddingBottom: 90,
  },
  playerContainer: {
    marginBottom: 8,
  },
  videoPlayerCard: {
    backgroundColor: "#FFF",
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: BrandColors.border,
    ...Shadows.md,
  },
  playerWrapper: {
    width: "100%",
    height: width * 0.56, // 16:9 ratio
    backgroundColor: "#000",
    position: "relative",
  },
  webview: {
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
  },
  playerPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  placeholderText: {
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "600",
  },
  playerControlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    padding: 10,
    pointerEvents: "box-none",
  },
  liveFloatingBadge: {
    alignSelf: "flex-start",
  },
  liveRedPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BrandColors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    gap: 5,
  },
  pulsingWhiteDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FFF",
  },
  liveRedPillText: {
    color: "#FFF",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  fullscreenBtn: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    padding: 6,
    borderRadius: 6,
  },
  playerMeta: {
    padding: 12,
  },
  playerMetaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  reporterPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: BrandColors.primaryGhost,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
  },
  reporterPillText: {
    fontSize: 10,
    fontWeight: "700",
    color: BrandColors.primaryDark,
  },
  playerTimeText: {
    fontSize: 11,
    color: BrandColors.textMuted,
    fontWeight: "500",
  },
  playerTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: BrandColors.charcoal,
    lineHeight: 21,
    marginBottom: 10,
  },
  playerActionRow: {
    flexDirection: "row",
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: BrandColors.borderLight,
    paddingTop: 10,
  },
  playerActionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 5,
  },
  playerActionText: {
    fontSize: 11,
    fontWeight: "700",
    color: BrandColors.charcoal,
  },
  actionPrimary: {
    backgroundColor: "#16A34A",
    marginLeft: "auto",
  },
  actionPrimaryText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFF",
  },
  feedHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 14,
    marginTop: 18,
    marginBottom: 10,
    gap: 8,
  },
  feedRedBar: {
    width: 4,
    height: 18,
    borderRadius: 2,
    backgroundColor: BrandColors.primary,
  },
  feedSectionTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: BrandColors.charcoal,
    letterSpacing: 0.5,
  },
  feedCountText: {
    fontSize: 12,
    fontWeight: "600",
    color: BrandColors.textMuted,
  },
  videoCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginHorizontal: 12,
    marginBottom: 10,
    padding: 9,
    borderWidth: 1,
    borderColor: BrandColors.border,
    gap: 10,
    ...Shadows.sm,
  },
  playingCardBorder: {
    borderColor: BrandColors.primary,
    backgroundColor: "#FFF9F9",
  },
  cardThumbWrap: {
    width: 120,
    height: 82,
    borderRadius: 8,
    backgroundColor: "#000",
    overflow: "hidden",
    position: "relative",
  },
  cardThumb: {
    width: "100%",
    height: "100%",
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  cardPlayBtn: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -14 }, { translateY: -14 }],
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(229, 9, 20, 0.88)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardActivePlayBtn: {
    backgroundColor: "#16A34A",
  },
  cardBadge: {
    position: "absolute",
    top: 5,
    left: 5,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
  },
  cardLiveBadge: {
    backgroundColor: BrandColors.primary,
  },
  cardBadgeText: {
    color: "#FFF",
    fontSize: 8,
    fontWeight: "900",
  },
  cardInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  cardMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  channelName: {
    fontSize: 10,
    fontWeight: "700",
    color: BrandColors.primaryDark,
    textTransform: "uppercase",
  },
  cardTime: {
    fontSize: 10,
    color: BrandColors.textMuted,
    fontWeight: "500",
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: BrandColors.charcoal,
    lineHeight: 18,
    marginVertical: 3,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  nowPlayingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  nowPlayingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#16A34A",
  },
  nowPlayingText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#16A34A",
  },
  tapToPlayText: {
    fontSize: 10,
    color: BrandColors.textMuted,
    fontWeight: "500",
  },
  cardShareBtn: {
    padding: 3,
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
  emptyContainer: {
    alignItems: "center",
    padding: 30,
    gap: 8,
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
  retryBtn: {
    backgroundColor: BrandColors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  retryBtnText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
  },
  fullscreenSafe: {
    flex: 1,
    backgroundColor: "#000",
  },
  fullscreenHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  fullscreenCloseBtn: {
    padding: 4,
  },
  fullscreenTitle: {
    flex: 1,
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
  },
  fullscreenVideoWrap: {
    flex: 1,
    backgroundColor: "#000",
  },
  fullscreenWebview: {
    flex: 1,
    backgroundColor: "#000",
  },
});
