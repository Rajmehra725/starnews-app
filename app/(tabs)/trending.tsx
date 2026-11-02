import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BrandColors, Shadows } from "@/constants/theme";
import { apiClient, NewsArticle } from "@/_services/api";
import NewsCard from "@/components/NewsCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";

export default function TrendingScreen() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCat, setSelectedCat] = useState("All");
  const [rankingMode, setRankingMode] = useState<"views" | "likes">("views");

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get<NewsArticle[]>("/api/news");
      setNews(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log("Trending fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNews();
  };

  const categories = useMemo(() => {
    const set = new Set(news.map((n) => n.category).filter(Boolean));
    return ["All", ...(Array.from(set) as string[])];
  }, [news]);

  const sortedNews = useMemo(() => {
    let list = [...news].filter((n) => n.status !== "draft");

    if (selectedCat !== "All") {
      list = list.filter((n) => n.category?.toLowerCase() === selectedCat.toLowerCase());
    }

    if (rankingMode === "views") {
      list.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else {
      list.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    }

    return list;
  }, [news, selectedCat, rankingMode]);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor={BrandColors.primaryDark} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <View style={styles.flameIconBox}>
            <Ionicons name="flame" size={20} color="#FFF" />
          </View>
          <View>
            <Text style={styles.headerTitle}>ट्रेंडिंग समाचार (TRENDING)</Text>
            <Text style={styles.headerSubtitle}>सर्वाधिक पढ़े और पसंद किए गए समाचार</Text>
          </View>
        </View>

        {/* Toggle Mode: Most Viewed vs Most Liked */}
        <View style={styles.modeSwitch}>
          <TouchableOpacity
            style={[styles.modeBtn, rankingMode === "views" && styles.activeModeBtn]}
            onPress={() => setRankingMode("views")}
          >
            <Ionicons
              name="eye"
              size={14}
              color={rankingMode === "views" ? BrandColors.primaryDark : "rgba(255,255,255,0.7)"}
            />
            <Text style={[styles.modeText, rankingMode === "views" && styles.activeModeText]}>
              सर्वाधिक व्यूज (Top Viewed)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeBtn, rankingMode === "likes" && styles.activeModeBtn]}
            onPress={() => setRankingMode("likes")}
          >
            <Ionicons
              name="heart"
              size={14}
              color={rankingMode === "likes" ? BrandColors.primaryDark : "rgba(255,255,255,0.7)"}
            />
            <Text style={[styles.modeText, rankingMode === "likes" && styles.activeModeText]}>
              लोकप्रिय (Most Liked)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Category Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.catChip, selectedCat === cat && styles.activeCatChip]}
              onPress={() => setSelectedCat(cat)}
            >
              <Text style={[styles.catChipText, selectedCat === cat && styles.activeCatChipText]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Trending List */}
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <FlatList
          data={sortedNews}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[BrandColors.primary]}
            />
          }
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => (
            <View style={styles.rankedItem}>
              {/* Rank Badge */}
              <View style={[styles.rankBadge, index < 3 && styles.topRankBadge]}>
                <Text style={styles.rankNumber}>#{index + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <NewsCard article={item} variant="compact" />
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="trending-down-outline" size={44} color={BrandColors.textMuted} />
              <Text style={styles.emptyTitle}>कोई ट्रेंडिंग खबर उपलब्ध नहीं है</Text>
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
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingTop: 6,
  },
  flameIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: BrandColors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#FFF",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.75)",
    marginTop: 2,
  },
  modeSwitch: {
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    borderRadius: 8,
    padding: 3,
  },
  modeBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 7,
    borderRadius: 6,
    gap: 6,
  },
  activeModeBtn: {
    backgroundColor: "#FFF",
  },
  modeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.8)",
  },
  activeModeText: {
    color: BrandColors.primaryDark,
  },
  catScroll: {
    gap: 8,
  },
  catChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  activeCatChip: {
    backgroundColor: "#FFF",
  },
  catChipText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFF",
  },
  activeCatChipText: {
    color: BrandColors.primaryDark,
  },
  listContent: {
    paddingVertical: 14,
    paddingBottom: 80,
    backgroundColor: BrandColors.background,
  },
  rankedItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 14,
  },
  rankBadge: {
    width: 32,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
  },
  topRankBadge: {},
  rankNumber: {
    fontSize: 13,
    fontWeight: "900",
    color: BrandColors.primary,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: BrandColors.charcoal,
  },
});