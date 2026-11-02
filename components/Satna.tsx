import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BrandColors } from "@/constants/theme";
import { apiClient, NewsArticle } from "@/_services/api";
import NewsCard from "@/components/NewsCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";

export default function SatnaNews() {
  const [newsList, setNewsList] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNews = async () => {
    try {
      const res = await apiClient.get<NewsArticle[]>("/api/satna");
      const data = Array.isArray(res.data) ? res.data : [];
      setNewsList(data);
    } catch (err) {
      console.log("Satna News Fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNews();
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.cityHeader}>
        <View style={styles.redBadge} />
        <Text style={styles.cityTitle}>सतना की विशेष खबरें (SATNA SPECIAL)</Text>
      </View>

      <FlatList
        data={newsList}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[BrandColors.primary]}
          />
        }
        renderItem={({ item }) => (
          <NewsCard
            article={{
              ...item,
              category: item.category || "सतना",
            }}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="location-outline" size={44} color={BrandColors.textMuted} />
            <Text style={styles.emptyText}>सतना क्षेत्र की कोई खबर उपलब्ध नहीं है</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrandColors.background,
  },
  cityHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 14,
    marginVertical: 12,
    gap: 8,
  },
  redBadge: {
    width: 4,
    height: 18,
    borderRadius: 2,
    backgroundColor: BrandColors.primary,
  },
  cityTitle: {
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
  emptyText: {
    fontSize: 14,
    color: BrandColors.textSecondary,
    fontWeight: "600",
  },
});