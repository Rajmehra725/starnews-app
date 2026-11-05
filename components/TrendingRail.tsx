import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { BrandColors, Shadows } from "@/constants/theme";
import { NewsArticle, formatMetricCount, getFullMediaUrl } from "@/_services/api";

const CARD_WIDTH = Dimensions.get("window").width * 0.72;

interface TrendingRailProps {
  articles: NewsArticle[];
}

export default function TrendingRail({ articles }: TrendingRailProps) {
  const router = useRouter();

  if (!articles || articles.length === 0) return null;

  // Sort by views + likes to find top 6 trending
  const trendingList = [...articles]
    .sort((a, b) => ((b.views || 0) + (b.likes || 0)) - ((a.views || 0) + (a.likes || 0)))
    .slice(0, 6);

  if (trendingList.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons name="fire" size={20} color={BrandColors.primary} />
          <Text style={styles.sectionTitle}>ट्रेंडिंग खबरें (TRENDING NOW)</Text>
        </View>
        <TouchableOpacity
          style={styles.viewAllBtn}
          onPress={() => router.push("/(tabs)/trending")}
        >
          <Text style={styles.viewAllText}>सभी देखें</Text>
          <Ionicons name="chevron-forward" size={13} color={BrandColors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + 12}
      >
        {trendingList.map((item, index) => {
          const imgUrl = getFullMediaUrl(item.featuredImage || (item.images && item.images[0]));
          const rank = index + 1;

          return (
            <TouchableOpacity
              key={item._id}
              style={styles.card}
              activeOpacity={0.88}
              onPress={() =>
                router.push({
                  pathname: "/news/[id]",
                  params: { id: item._id },
                })
              }
            >
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: imgUrl }}
                  style={styles.cardImage}
                  contentFit="cover"
                  transition={200}
                />
                {/* Ranking Badge */}
                <View
                  style={[
                    styles.rankBadge,
                    rank === 1
                      ? styles.rankFirst
                      : rank === 2
                      ? styles.rankSecond
                      : rank === 3
                      ? styles.rankThird
                      : styles.rankOther,
                  ]}
                >
                  <Text style={styles.rankText}>#{rank}</Text>
                </View>

                {/* Views Pill */}
                <View style={styles.viewsPill}>
                  <Ionicons name="eye-outline" size={11} color="#FFF" />
                  <Text style={styles.viewsPillText}>{formatMetricCount(item.views)}</Text>
                </View>
              </View>

              <View style={styles.content}>
                <Text style={styles.categoryText}>
                  {(item.category || "General").toUpperCase()}
                </Text>
                <Text style={styles.title} numberOfLines={2}>
                  {item.title}
                </Text>
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
    marginVertical: 14,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 14,
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
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
  scrollList: {
    paddingHorizontal: 14,
    gap: 12,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: BrandColors.white,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: BrandColors.border,
    ...Shadows.sm,
  },
  imageContainer: {
    height: 125,
    width: "100%",
    position: "relative",
    backgroundColor: "#111",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  rankBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  rankFirst: {
    backgroundColor: BrandColors.primary,
  },
  rankSecond: {
    backgroundColor: "#EA580C",
  },
  rankThird: {
    backgroundColor: "#D97706",
  },
  rankOther: {
    backgroundColor: "rgba(0,0,0,0.75)",
  },
  rankText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#FFF",
  },
  viewsPill: {
    position: "absolute",
    bottom: 6,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.65)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  viewsPillText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFF",
  },
  content: {
    padding: 10,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: "800",
    color: BrandColors.primary,
    marginBottom: 4,
  },
  title: {
    fontSize: 13,
    fontWeight: "700",
    color: BrandColors.charcoal,
    lineHeight: 18,
  },
});
