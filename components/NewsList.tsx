import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { io } from "socket.io-client";
import { BrandColors, Shadows } from "@/constants/theme";
import { apiClient, API_BASE_URL, NewsArticle } from "@/_services/api";

import NewsCard from "@/components/NewsCard";
import FeaturedNewsCard from "@/components/FeaturedNewsCard";
import TrendingRail from "@/components/TrendingRail";
import VideoNewsRail from "@/components/VideoNewsRail";
import StarShortsRail from "@/components/StarShortsRail";
import PremiumStoryCard from "@/components/PremiumStoryCard";
import EpaperPreviewCard from "@/components/EpaperPreviewCard";
import GalleryPreviewRail from "@/components/GalleryPreviewRail";
import InFeedAdCard from "@/components/InFeedAdCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";

const { width } = Dimensions.get("window");
const PANNA_CARD_WIDTH = width * 0.72;

interface NewsListProps {
  filterCategory?: string;
  headerComponent?: React.ReactElement;
  onScrollToTop?: () => void;
}

export default function NewsList({
  filterCategory,
  headerComponent,
}: NewsListProps) {
  const router = useRouter();
  const listRef = useRef<FlatList>(null);
  const viewedRef = useRef<Set<string>>(new Set());

  const [newsList, setNewsList] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    try {
      setError(null);
      const res = await apiClient.get<NewsArticle[]>("/api/news");
      const data = Array.isArray(res.data) ? res.data : [];
      setNewsList(data);
    } catch (err: any) {
      console.log("News Fetch Error:", err?.message);
      setError("समाचार लोड करने में असमर्थ। कृपया पुनः प्रयास करें।");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();

    // Socket.IO realtime listeners for views and likes
    const socket = io(API_BASE_URL, { transports: ["websocket"] });

    socket.on("viewsUpdated", ({ newsId, views }: { newsId: string; views: number }) => {
      setNewsList((prev) =>
        prev.map((n) => (n._id === newsId ? { ...n, views } : n))
      );
    });

    socket.on("likeUpdated", ({ newsId, likes }: { newsId: string; likes: number }) => {
      setNewsList((prev) =>
        prev.map((n) => (n._id === newsId ? { ...n, likes } : n))
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [fetchNews]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNews();
  };

  const handleTrackView = async (id: string) => {
    if (viewedRef.current.has(id)) return;
    viewedRef.current.add(id);

    try {
      await apiClient.post(`/api/news/${id}/view`, { userId: "app_user" });
    } catch {
      // silently handle
    }
  };

  // Filter published news
  const displayedNews = useMemo(() => {
    let list = [...newsList].filter((n) => n.status !== "draft");

    if (
      filterCategory &&
      filterCategory.toLowerCase() !== "all" &&
      filterCategory.toLowerCase() !== "home"
    ) {
      const catLower = filterCategory.toLowerCase();
      list = list.filter(
        (n) =>
          n.category?.toLowerCase().includes(catLower) ||
          n.title?.toLowerCase().includes(catLower) ||
          n.description?.toLowerCase().includes(catLower)
      );
    }

    return list;
  }, [newsList, filterCategory]);

  // Extract Panna-focused local news
  const pannaNews = useMemo(() => {
    return newsList
      .filter((n) => n.status !== "draft")
      .filter(
        (n) =>
          n.category?.toLowerCase().includes("panna") ||
          n.title?.toLowerCase().includes("पन्ना") ||
          n.title?.toLowerCase().includes("panna") ||
          n.description?.toLowerCase().includes("पन्ना")
      );
  }, [newsList]);

  // Top lead story & remaining news
  const topStory = displayedNews.length > 0 ? displayedNews[0] : null;
  const premiumStory = displayedNews.length > 1 ? displayedNews[1] : null;
  const remainingNews = displayedNews.slice(2);

  if (loading && newsList.length === 0) {
    return (
      <View style={styles.container}>
        {headerComponent}
        <LoadingSkeleton />
      </View>
    );
  }

  if (error && newsList.length === 0) {
    return (
      <View style={styles.container}>
        {headerComponent}
        <View style={styles.errorContainer}>
          <Ionicons name="cloud-offline-outline" size={48} color={BrandColors.primary} />
          <Text style={styles.errorTitle}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchNews}>
            <Text style={styles.retryText}>पुनः लोड करें (Retry)</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <FlatList
      ref={listRef}
      data={remainingNews}
      keyExtractor={(item) => item._id}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[BrandColors.primary]}
          tintColor={BrandColors.primary}
        />
      }
      ListHeaderComponent={
        <>
          {headerComponent}

          {/* Featured Top Lead Story */}
          {topStory && (
            <View style={styles.leadSection}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionRedBar} />
                <Text style={styles.sectionTitle}>बड़ी खबरें (TOP STORIES)</Text>
              </View>
              <FeaturedNewsCard article={topStory} />
            </View>
          )}

          {/* पन्ना की ताज़ा खबरें (Dedicated Panna Local News Section) */}
          {pannaNews.length > 0 && !filterCategory && (
            <View style={styles.pannaSection}>
              <View style={styles.sectionHeaderBetween}>
                <View style={styles.sectionHeaderLeft}>
                  <View style={styles.pannaGreenBar} />
                  <Ionicons name="location-sharp" size={16} color="#059669" />
                  <Text style={styles.sectionTitle}>पन्ना की ताज़ा खबरें (PANNA SPECIAL)</Text>
                </View>
                <View style={styles.pannaCountBadge}>
                  <Text style={styles.pannaCountText}>{pannaNews.length} अपडेट्स</Text>
                </View>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.pannaScroll}
                snapToInterval={PANNA_CARD_WIDTH + 12}
                decelerationRate="fast"
              >
                {pannaNews.slice(0, 6).map((item) => (
                  <View key={`panna_${item._id}`} style={{ width: PANNA_CARD_WIDTH }}>
                    <NewsCard article={item} variant="compact" />
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Trending News Horizontal Rail */}
          {displayedNews.length > 2 && (
            <TrendingRail articles={displayedNews} />
          )}

          {/* Aaj Tak style Video News Rail */}
          <VideoNewsRail />

          {/* Star Shorts Vertical Reels */}
          <StarShortsRail />

          {/* Digital Editorial Premium Story */}
          {premiumStory && (
            <PremiumStoryCard article={premiumStory} />
          )}

          {/* Today's E-Paper Edition Preview */}
          <EpaperPreviewCard />

          {/* Latest Headlines Section Divider */}
          {remainingNews.length > 0 && (
            <View style={styles.sectionHeader}>
              <View style={styles.sectionRedBar} />
              <Text style={styles.sectionTitle}>
                {filterCategory
                  ? `${filterCategory.toUpperCase()} के ताज़ा समाचार`
                  : "ताज़ा समाचार (LATEST HEADLINES)"}
              </Text>
            </View>
          )}
        </>
      }
      renderItem={({ item, index }) => {
        handleTrackView(item._id);
        const shouldShowAd = index > 0 && index % 4 === 0;

        return (
          <View>
            <NewsCard article={item} />
            {shouldShowAd && <InFeedAdCard index={Math.floor(index / 4)} />}
          </View>
        );
      }}
      ListFooterComponent={
        <>
          {/* Photo Gallery Carousel at bottom of feed */}
          <GalleryPreviewRail />

          <View style={styles.feedEnd}>
            <View style={styles.feedEndLogoRow}>
              <MaterialCommunityIcons name="broadcast" size={16} color={BrandColors.primary} />
              <Text style={styles.feedEndBrand}>स्टार न्यूज़ नेटवर्क (STAR NEWS)</Text>
            </View>
            <Text style={styles.feedEndText}>लोकल • लाइव • भरोसेमंद पत्रकारिता • पन्ना, म.प्र.</Text>
          </View>
        </>
      }
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Ionicons name="newspaper-outline" size={44} color={BrandColors.textMuted} />
          <Text style={styles.emptyTitle}>फिलहाल कोई खबर उपलब्ध नहीं है</Text>
          <Text style={styles.emptySubtitle}>कृपया कुछ समय बाद पुनः देखें या दूसरा विषय चुनें।</Text>
        </View>
      }
      contentContainerStyle={styles.listContent}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrandColors.background,
  },
  listContent: {
    paddingBottom: 90,
  },
  leadSection: {
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 8,
    gap: 8,
  },
  sectionHeaderBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 12,
    marginTop: 14,
    marginBottom: 8,
  },
  sectionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sectionRedBar: {
    width: 4,
    height: 18,
    borderRadius: 2,
    backgroundColor: BrandColors.primary,
  },
  pannaGreenBar: {
    width: 4,
    height: 18,
    borderRadius: 2,
    backgroundColor: "#059669",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: BrandColors.charcoal,
    letterSpacing: 0.5,
  },
  pannaCountBadge: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  pannaCountText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#065F46",
  },
  pannaSection: {
    marginVertical: 6,
  },
  pannaScroll: {
    paddingHorizontal: 12,
    gap: 10,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
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
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 24,
    gap: 12,
  },
  errorTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: BrandColors.charcoal,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: BrandColors.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "800",
  },
  feedEnd: {
    paddingVertical: 24,
    alignItems: "center",
    gap: 4,
  },
  feedEndLogoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  feedEndBrand: {
    fontSize: 12,
    fontWeight: "800",
    color: BrandColors.charcoal,
  },
  feedEndText: {
    fontSize: 11,
    fontWeight: "600",
    color: BrandColors.textMuted,
  },
});
