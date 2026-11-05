import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Share,
  Platform,
  ActivityIndicator,
  ViewToken,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { BrandColors, Shadows } from "@/constants/theme";
import { apiClient, YouTubeItem } from "@/_services/api";
import { StarFullScreenLoader } from "@/components/StarBrandLoader";
import StarVideoPlayer from "@/components/StarVideoPlayer";
import { getVideoId, getThumbnail } from "@/app/(tabs)/live";

const { width, height } = Dimensions.get("window");
const SAVED_SHORTS_KEY = "@starnews_saved_shorts";

export default function ShortsScreen() {
  const insets = useSafeAreaInsets();
  const { initialIndex } = useLocalSearchParams<{ initialIndex?: string }>();
  const flatListRef = useRef<FlatList>(null);

  const [shorts, setShorts] = useState<YouTubeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [likedShorts, setLikedShorts] = useState<Record<string, boolean>>({});
  const [savedShorts, setSavedShorts] = useState<Record<string, boolean>>({});
  const [isMuted, setIsMuted] = useState(false);
  const [expandedTitles, setExpandedTitles] = useState<Record<string, boolean>>({});

  // Fetch YouTube shorts / clips
  useEffect(() => {
    const fetchShorts = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get<YouTubeItem[]>("/api/youtube/all");
        const list = Array.isArray(res.data) ? res.data : [];
        setShorts(list);

        // Load saved shorts from storage
        const savedJson = await AsyncStorage.getItem(SAVED_SHORTS_KEY);
        if (savedJson) {
          setSavedShorts(JSON.parse(savedJson));
        }
      } catch (err) {
        console.log("Shorts fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchShorts();
  }, []);

  // Jump to initial index if provided
  useEffect(() => {
    if (initialIndex && shorts.length > 0) {
      const idx = parseInt(initialIndex, 10);
      if (!isNaN(idx) && idx >= 0 && idx < shorts.length) {
        setActiveIndex(idx);
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({ index: idx, animated: false });
        }, 150);
      }
    }
  }, [initialIndex, shorts.length]);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setActiveIndex(viewableItems[0].index);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 75,
  }).current;

  const toggleLike = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLikedShorts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSave = async (item: YouTubeItem) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const updated = { ...savedShorts, [item._id]: !savedShorts[item._id] };
    setSavedShorts(updated);
    try {
      await AsyncStorage.setItem(SAVED_SHORTS_KEY, JSON.stringify(updated));
    } catch {}
  };

  const handleShare = async (item: YouTubeItem) => {
    const title = item.title || item.channelName || "स्टार न्यूज़ त्वरित शॉर्ट्स";
    try {
      await Share.share({
        title,
        message: `⚡ स्टार न्यूज़ शॉर्ट्स: ${title}\n\nपन्ना एवं म.प्र. की ताज़ा खबरें सीधे देखें:\n${item.link}`,
      });
    } catch {}
  };

  const toggleExpanded = (id: string) => {
    setExpandedTitles((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return <StarFullScreenLoader message="स्टार शॉर्ट्स लोड हो रहे हैं..." theme="dark" />;
  }

  if (shorts.length === 0) {
    return (
      <View style={styles.centerDark}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <Ionicons name="videocam-off-outline" size={54} color="rgba(255,255,255,0.5)" />
        <Text style={styles.emptyTitle}>कोई शॉर्ट्स वीडियो उपलब्ध नहीं है</Text>
        <TouchableOpacity style={styles.backBtnLight} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>वापस जाएं (Go Back)</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Top Fixed Floating Header */}
      <View style={[styles.floatingHeader, { top: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.headerCircleBtn}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.brandCenter}>
          <Text style={styles.brandTitle}>⭐ स्टार शॉर्ट्स</Text>
          <Text style={styles.brandSub}>STAR NEWS NETWORKS</Text>
        </View>

        <View style={styles.counterBadge}>
          <Text style={styles.counterText}>
            {activeIndex + 1}/{shorts.length}
          </Text>
        </View>
      </View>

      {/* Vertical Paged FlatList */}
      <FlatList
        ref={flatListRef}
        data={shorts}
        keyExtractor={(item) => item._id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, index) => ({
          length: height,
          offset: height * index,
          index,
        })}
        renderItem={({ item, index }) => {
          const isActive = index === activeIndex;
          const vidId = getVideoId(item.link);
          const thumb = getThumbnail(item.link);
          const title = item.title || item.channelName || "स्टार न्यूज़ त्वरित अपडेट";
          const isLiked = !!likedShorts[item._id];
          const isSaved = !!savedShorts[item._id];
          const isExpanded = !!expandedTitles[item._id];

          return (
            <View style={styles.shortItem}>
              {/* Media Player Layer */}
              {isActive && vidId ? (
                <View style={styles.videoPlayerContainer}>
                  <StarVideoPlayer
                    videoId={vidId}
                    title={title}
                    autoplay={true}
                    isMuted={isMuted}
                    showControls={false}
                    loop={true}
                    style={styles.webView}
                  />
                </View>
              ) : (
                <Image source={{ uri: thumb }} style={styles.backdropImage} contentFit="cover" />
              )}

              {/* Bottom & Top Gradients for readability */}
              <LinearGradient
                colors={["rgba(0,0,0,0.6)", "transparent"]}
                style={styles.topGradient}
                pointerEvents="none"
              />
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.95)"]}
                style={styles.bottomGradient}
                pointerEvents="none"
              />

              {/* Right Vertical Action Bar */}
              <View style={[styles.rightActions, { bottom: insets.bottom + 90 }]}>
                {/* Like Button */}
                <TouchableOpacity style={styles.actionBtn} onPress={() => toggleLike(item._id)}>
                  <View style={[styles.actionIconWrap, isLiked && styles.likedWrap]}>
                    <Ionicons
                      name={isLiked ? "heart" : "heart-outline"}
                      size={26}
                      color={isLiked ? "#EF4444" : "#FFF"}
                    />
                  </View>
                  <Text style={styles.actionLabel}>{isLiked ? "पसंद" : "लाइक"}</Text>
                </TouchableOpacity>

                {/* Bookmark Button */}
                <TouchableOpacity style={styles.actionBtn} onPress={() => toggleSave(item)}>
                  <View style={[styles.actionIconWrap, isSaved && styles.savedWrap]}>
                    <Ionicons
                      name={isSaved ? "bookmark" : "bookmark-outline"}
                      size={24}
                      color={isSaved ? "#F59E0B" : "#FFF"}
                    />
                  </View>
                  <Text style={styles.actionLabel}>{isSaved ? "सहेजा" : "सहेजें"}</Text>
                </TouchableOpacity>

                {/* Share Button */}
                <TouchableOpacity style={styles.actionBtn} onPress={() => handleShare(item)}>
                  <View style={styles.actionIconWrap}>
                    <Ionicons name="share-social-outline" size={24} color="#FFF" />
                  </View>
                  <Text style={styles.actionLabel}>शेयर</Text>
                </TouchableOpacity>

                {/* Sound / Mute Toggle */}
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => setIsMuted((prev) => !prev)}
                >
                  <View style={styles.actionIconWrap}>
                    <Ionicons
                      name={isMuted ? "volume-mute-outline" : "volume-high-outline"}
                      size={24}
                      color="#FFF"
                    />
                  </View>
                  <Text style={styles.actionLabel}>{isMuted ? "म्यूट" : "ध्वनि"}</Text>
                </TouchableOpacity>
              </View>

              {/* Bottom Editorial Content */}
              <View style={[styles.bottomDetails, { bottom: insets.bottom + 16 }]}>
                {/* Category & Bureau Pills */}
                <View style={styles.badgeRow}>
                  <View style={styles.pannaBadge}>
                    <Ionicons name="location-sharp" size={11} color="#FFF" />
                    <Text style={styles.pannaBadgeText}>पन्ना • विशेष बुलेटिन</Text>
                  </View>
                  <View style={styles.verifiedBadge}>
                    <MaterialCommunityIcons name="check-decagram" size={13} color="#38BDF8" />
                    <Text style={styles.verifiedText}>स्टार न्यूज़ नेटवर्क</Text>
                  </View>
                </View>

                {/* Headline (tap to expand/collapse) */}
                <TouchableOpacity activeOpacity={0.85} onPress={() => toggleExpanded(item._id)}>
                  <Text
                    style={styles.shortHeadline}
                    numberOfLines={isExpanded ? undefined : 3}
                  >
                    {title}
                  </Text>
                </TouchableOpacity>

                {/* Audio Byline */}
                <View style={styles.audioRow}>
                  <MaterialCommunityIcons name="music" size={14} color="#FCA5A5" />
                  <Text style={styles.audioText} numberOfLines={1}>
                    स्टार न्यूज़ नेटवर्क • लोकल • लाइव • भरोसेमंद ऑडियो
                  </Text>
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  centerDark: {
    flex: 1,
    backgroundColor: "#0A0A0A",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  loaderText: {
    color: "#FFF",
    fontSize: 14,
    marginTop: 12,
    fontWeight: "700",
  },
  emptyTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "800",
    marginTop: 16,
  },
  backBtnLight: {
    marginTop: 18,
    backgroundColor: BrandColors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backBtnText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 13,
  },
  floatingHeader: {
    position: "absolute",
    left: 14,
    right: 14,
    zIndex: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  brandCenter: {
    alignItems: "center",
  },
  brandTitle: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  brandSub: {
    color: "#FCA5A5",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
  },
  counterBadge: {
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  counterText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "800",
  },
  shortItem: {
    width,
    height,
    position: "relative",
    backgroundColor: "#000",
    justifyContent: "center",
  },
  videoPlayerContainer: {
    width,
    height,
    backgroundColor: "#000",
    justifyContent: "center",
  },
  webView: {
    width,
    height,
    backgroundColor: "#000",
  },
  backdropImage: {
    width,
    height,
    backgroundColor: "#000",
  },
  topGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 140,
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 320,
  },
  rightActions: {
    position: "absolute",
    right: 14,
    alignItems: "center",
    gap: 16,
    zIndex: 20,
  },
  actionBtn: {
    alignItems: "center",
  },
  actionIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
    ...Shadows.sm,
  },
  likedWrap: {
    backgroundColor: "rgba(239, 68, 68, 0.25)",
    borderColor: "#EF4444",
  },
  savedWrap: {
    backgroundColor: "rgba(245, 158, 11, 0.25)",
    borderColor: "#F59E0B",
  },
  actionLabel: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 4,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  bottomDetails: {
    position: "absolute",
    left: 14,
    right: 84, // reserve room for action buttons on right
    zIndex: 20,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
    flexWrap: "wrap",
  },
  pannaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#059669",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  pannaBadgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "800",
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  verifiedText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "800",
  },
  shortHeadline: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "800",
    lineHeight: 22,
    textShadowColor: "rgba(0,0,0,0.9)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  audioRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 8,
  },
  audioText: {
    color: "#FCA5A5",
    fontSize: 11,
    fontWeight: "600",
  },
});
