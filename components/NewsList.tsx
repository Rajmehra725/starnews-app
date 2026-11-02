import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { io } from "socket.io-client";
import { BrandColors } from "@/constants/theme";
import { apiClient, API_BASE_URL, NewsArticle } from "@/_services/api";
import NewsCard from "@/components/NewsCard";
import FeaturedNewsCard from "@/components/FeaturedNewsCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";

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

    // Socket.IO realtime listeners
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

  // Filter news articles based on selected category / status
  const displayedNews = React.useMemo(() => {
    let list = [...newsList];
    
    // Only show published news if status is set, or all if not set
    list = list.filter((n) => n.status !== "draft");

    if (filterCategory && filterCategory.toLowerCase() !== "all" && filterCategory.toLowerCase() !== "home") {
      list = list.filter((n) =>
        n.category?.toLowerCase().includes(filterCategory.toLowerCase()) ||
        n.title?.toLowerCase().includes(filterCategory.toLowerCase())
      );
    }

    return list;
  }, [newsList, filterCategory]);

  const topStory = displayedNews.length > 0 ? displayedNews[0] : null;
  const remainingNews = displayedNews.slice(1);

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

          {/* Featured Top Story */}
          {topStory && (
            <View style={styles.leadSection}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionRedBar} />
                <Text style={styles.sectionTitle}>प्रमुख समाचार (TOP STORY)</Text>
              </View>
              <FeaturedNewsCard article={topStory} />
            </View>
          )}

          {remainingNews.length > 0 && (
            <View style={styles.sectionHeader}>
              <View style={styles.sectionRedBar} />
              <Text style={styles.sectionTitle}>ताज़ा खबरें (LATEST NEWS)</Text>
            </View>
          )}
        </>
      }
      renderItem={({ item }) => {
        handleTrackView(item._id);
        return <NewsCard article={item} />;
      }}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Ionicons name="newspaper-outline" size={44} color={BrandColors.textMuted} />
          <Text style={styles.emptyTitle}>फिलहाल कोई खबर उपलब्ध नहीं है</Text>
          <Text style={styles.emptySubtitle}>कृपया कुछ समय बाद पुनः देखें।</Text>
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
    marginTop: 6,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 14,
    marginTop: 12,
    marginBottom: 10,
    gap: 8,
  },
  sectionRedBar: {
    width: 4,
    height: 18,
    borderRadius: 2,
    backgroundColor: BrandColors.primary,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: BrandColors.charcoal,
    letterSpacing: 0.6,
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
    fontSize: 13,
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
});