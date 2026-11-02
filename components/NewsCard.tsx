import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { BrandColors, Typography, Shadows } from "@/constants/theme";
import { NewsArticle, formatTimeAgo, formatMetricCount, getFullMediaUrl } from "@/_services/api";

interface NewsCardProps {
  article: NewsArticle;
  variant?: "standard" | "compact" | "horizontal";
  onPress?: () => void;
}

export default function NewsCard({ article, variant = "standard", onPress }: NewsCardProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push({
        pathname: "/news/[id]",
        params: { id: article._id },
      });
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        title: article.title,
        message: `📰 ${article.title}\n\nRead more on Star News Networks:\nhttps://starnewsnetworks.com/news/${article._id}`,
      });
    } catch (e) {
      console.log("Share error:", e);
    }
  };

  const imageUrl = getFullMediaUrl(article.featuredImage || (article.images && article.images[0]));
  const isBreaking = article.breaking || (Date.now() - new Date(article.createdAt).getTime() < 3 * 3600 * 1000);
  const categoryName = article.category || "General";

  if (variant === "compact") {
    return (
      <TouchableOpacity
        style={styles.compactContainer}
        activeOpacity={0.88}
        onPress={handlePress}
      >
        <Image
          source={{ uri: imageUrl }}
          style={styles.compactImage}
          contentFit="cover"
          transition={250}
        />
        <View style={styles.compactContent}>
          <View style={styles.metaRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{categoryName}</Text>
            </View>
            <Text style={styles.timeText}>{formatTimeAgo(article.createdAt)}</Text>
          </View>
          <Text style={styles.compactTitle} numberOfLines={2}>
            {article.title}
          </Text>
          <View style={styles.footerRow}>
            <View style={styles.metricItem}>
              <Ionicons name="eye-outline" size={13} color={BrandColors.textMuted} />
              <Text style={styles.metricText}>{formatMetricCount(article.views)}</Text>
            </View>
            <TouchableOpacity onPress={handleShare} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="share-social-outline" size={15} color={BrandColors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.9}
      onPress={handlePress}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={300}
        />
        
        {/* Category & Breaking Badges */}
        <View style={styles.badgeContainer}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{categoryName.toUpperCase()}</Text>
          </View>
          {isBreaking && (
            <View style={styles.breakingBadge}>
              <MaterialCommunityIcons name="flash" size={12} color="#FFF" />
              <Text style={styles.breakingBadgeText}>BREAKING</Text>
            </View>
          )}
        </View>

        {/* Timestamp Overlay */}
        <View style={styles.timeOverlay}>
          <Ionicons name="time-outline" size={11} color="#FFF" />
          <Text style={styles.timeOverlayText}>{formatTimeAgo(article.createdAt)}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {article.title}
        </Text>

        {article.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {article.description}
          </Text>
        ) : null}

        <View style={styles.divider} />

        <View style={styles.bottomBar}>
          <View style={styles.metricsGroup}>
            <View style={styles.metricItem}>
              <Ionicons name="eye-outline" size={14} color={BrandColors.textSecondary} />
              <Text style={styles.metricText}>{formatMetricCount(article.views)} views</Text>
            </View>
            <View style={styles.metricDot} />
            <View style={styles.metricItem}>
              <Ionicons name="heart-outline" size={14} color={BrandColors.textSecondary} />
              <Text style={styles.metricText}>{formatMetricCount(article.likes)}</Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.shareIconButton}
              onPress={handleShare}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="share-social-outline" size={17} color={BrandColors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: BrandColors.white,
    borderRadius: 14,
    marginHorizontal: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BrandColors.border,
    overflow: "hidden",
    ...Shadows.sm,
  },
  imageWrapper: {
    width: "100%",
    height: 195,
    backgroundColor: "#1A1A1A",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  badgeContainer: {
    position: "absolute",
    top: 12,
    left: 12,
    flexDirection: "row",
    gap: 6,
  },
  categoryBadge: {
    backgroundColor: BrandColors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  categoryBadgeText: {
    color: BrandColors.white,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  breakingBadge: {
    backgroundColor: BrandColors.liveBadge,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  breakingBadgeText: {
    color: BrandColors.white,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  timeOverlay: {
    position: "absolute",
    bottom: 8,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.72)",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  timeOverlayText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "600",
  },
  content: {
    padding: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: BrandColors.charcoal,
    lineHeight: 22,
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: BrandColors.textSecondary,
    lineHeight: 18,
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: BrandColors.borderLight,
    marginVertical: 8,
  },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  metricsGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  metricItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metricDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: BrandColors.border,
    marginHorizontal: 8,
  },
  metricText: {
    fontSize: 12,
    color: BrandColors.textSecondary,
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  shareIconButton: {
    padding: 4,
  },

  // Compact variant styles
  compactContainer: {
    flexDirection: "row",
    backgroundColor: BrandColors.white,
    borderRadius: 10,
    marginHorizontal: 14,
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: BrandColors.border,
    gap: 12,
    ...Shadows.sm,
  },
  compactImage: {
    width: 100,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#222",
  },
  compactContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timeText: {
    fontSize: 11,
    color: BrandColors.textMuted,
    fontWeight: "500",
  },
  compactTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: BrandColors.charcoal,
    lineHeight: 18,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
