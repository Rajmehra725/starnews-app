import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { BrandColors, Shadows } from "@/constants/theme";
import { NewsArticle, formatTimeAgo, formatMetricCount, getFullMediaUrl } from "@/_services/api";

const { width } = Dimensions.get("window");

interface FeaturedNewsCardProps {
  article: NewsArticle;
}

export default function FeaturedNewsCard({ article }: FeaturedNewsCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: "/news/[id]",
      params: { id: article._id },
    });
  };

  const imageUrl = getFullMediaUrl(article.featuredImage || (article.images && article.images[0]));
  const categoryName = article.category || "Top Story";

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.92}
      onPress={handlePress}
    >
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        contentFit="cover"
        transition={300}
      />
      
      {/* High-contrast gradient overlay */}
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.5)", "rgba(10,10,10,0.96)"]}
        locations={[0, 0.45, 1]}
        style={styles.gradient}
      >
        <View style={styles.topBadges}>
          <View style={styles.leadBadge}>
            <MaterialCommunityIcons name="star-four-points" size={13} color="#FFF" />
            <Text style={styles.leadBadgeText}>TOP STORY</Text>
          </View>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{categoryName.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.bottomContent}>
          <Text style={styles.title} numberOfLines={3}>
            {article.title}
          </Text>

          <View style={styles.metaRow}>
            <View style={styles.timeTag}>
              <Ionicons name="time-outline" size={13} color="#E5E7EB" />
              <Text style={styles.timeText}>{formatTimeAgo(article.createdAt)}</Text>
            </View>

            <View style={styles.viewsTag}>
              <Ionicons name="eye-outline" size={13} color="#E5E7EB" />
              <Text style={styles.viewsText}>{formatMetricCount(article.views)} views</Text>
            </View>

            <View style={styles.readPill}>
              <Text style={styles.readPillText}>Read Now</Text>
              <Ionicons name="arrow-forward" size={11} color="#FFF" />
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 250,
    marginHorizontal: 14,
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#111",
    ...Shadows.md,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    padding: 16,
    justifyContent: "space-between",
  },
  topBadges: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  leadBadge: {
    backgroundColor: BrandColors.primary,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 4,
  },
  leadBadgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.8,
  },
  categoryBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 4,
  },
  categoryBadgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  bottomContent: {
    gap: 10,
  },
  title: {
    fontSize: 19,
    fontWeight: "900",
    color: "#FFFFFF",
    lineHeight: 25,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timeTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timeText: {
    color: "#E5E7EB",
    fontSize: 12,
    fontWeight: "500",
  },
  viewsTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewsText: {
    color: "#E5E7EB",
    fontSize: 12,
    fontWeight: "500",
  },
  readPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: BrandColors.primaryDark,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  readPillText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "700",
  },
});
