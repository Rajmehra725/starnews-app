import React, { useState, useEffect } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BrandColors, Shadows } from "@/constants/theme";
import { NewsArticle, formatTimeAgo, formatMetricCount, getFullMediaUrl } from "@/_services/api";

const SAVED_KEY = "@starnews_saved_articles";

interface NewsCardProps {
  article: NewsArticle;
  variant?: "standard" | "compact" | "horizontal" | "editorial";
  onPress?: () => void;
}

export default function NewsCard({ article, variant = "standard", onPress }: NewsCardProps) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(SAVED_KEY).then((raw) => {
      if (raw) {
        try {
          const list = JSON.parse(raw);
          if (Array.isArray(list)) {
            setIsSaved(list.some((item) => item._id === article._id));
          }
        } catch {}
      }
    });
  }, [article._id]);

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

  const handleShare = async (e: any) => {
    e?.stopPropagation?.();
    try {
      await Share.share({
        title: article.title,
        message: `📰 ${article.title}\n\nस्टार न्यूज़ पर पूरी खबर पढ़ें:\nhttps://starnewsnetworks.com/news/${article._id}`,
      });
    } catch (e) {
      console.log("Share error:", e);
    }
  };

  const handleToggleBookmark = async (e: any) => {
    e?.stopPropagation?.();
    try {
      const raw = await AsyncStorage.getItem(SAVED_KEY);
      let list: NewsArticle[] = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(list)) list = [];

      const exists = list.some((item) => item._id === article._id);
      let nextList: NewsArticle[];
      if (exists) {
        nextList = list.filter((item) => item._id !== article._id);
        setIsSaved(false);
      } else {
        nextList = [article, ...list];
        setIsSaved(true);
      }
      await AsyncStorage.setItem(SAVED_KEY, JSON.stringify(nextList));
    } catch {}
  };

  const imageUrl = getFullMediaUrl(article.featuredImage || (article.images && article.images[0]));
  const isBreaking = article.breaking || (Date.now() - new Date(article.createdAt).getTime() < 3 * 3600 * 1000);
  const categoryName = article.category || "ताज़ा खबर";
  const isPanna =
    article.category?.toLowerCase().includes("panna") ||
    article.title?.toLowerCase().includes("पन्ना") ||
    article.title?.toLowerCase().includes("panna");

  // COMPACT VARIANT (Used in search, trending, side rails)
  if (variant === "compact") {
    return (
      <TouchableOpacity
        style={styles.compactContainer}
        activeOpacity={0.88}
        onPress={handlePress}
      >
        <View style={styles.compactImageWrap}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.compactImage}
            contentFit="cover"
            transition={200}
          />
          {isBreaking && (
            <View style={styles.compactBreakingDot} />
          )}
        </View>

        <View style={styles.compactContent}>
          <View style={styles.metaRow}>
            <View style={[styles.categoryBadge, isPanna && styles.pannaCategoryBadge]}>
              <Text style={styles.categoryBadgeText}>
                {isPanna ? "पन्ना" : categoryName}
              </Text>
            </View>
            <Text style={styles.timeText}>{formatTimeAgo(article.createdAt)}</Text>
          </View>

          <Text style={styles.compactTitle} numberOfLines={2}>
            {article.title}
          </Text>

          <View style={styles.footerRow}>
            <View style={styles.metricItem}>
              <Ionicons name="eye-outline" size={12} color={BrandColors.textMuted} />
              <Text style={styles.metricText}>{formatMetricCount(article.views)}</Text>
            </View>

            <View style={styles.actionIconsRow}>
              <TouchableOpacity
                onPress={handleToggleBookmark}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name={isSaved ? "bookmark" : "bookmark-outline"}
                  size={14}
                  color={isSaved ? BrandColors.primary : BrandColors.textSecondary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleShare}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="share-social-outline" size={14} color={BrandColors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // STANDARD EDITORIAL CARD
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.92}
      onPress={handlePress}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={250}
        />

        {/* Category & Breaking Badges */}
        <View style={styles.badgeContainer}>
          <View style={[styles.categoryBadge, isPanna && styles.pannaCategoryBadge]}>
            <Text style={styles.categoryBadgeText}>
              {isPanna ? "पन्ना विशेष" : categoryName.toUpperCase()}
            </Text>
          </View>

          {isBreaking && (
            <View style={styles.breakingBadge}>
              <MaterialCommunityIcons name="flash" size={12} color="#FFF" />
              <Text style={styles.breakingBadgeText}>ब्रेकिंग</Text>
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

        {/* Bureau & Reporter Accreditation */}
        <View style={styles.bureauLine}>
          <Text style={styles.bureauAuthor}>स्टार न्यूज़ ब्यूरो</Text>
          <Text style={styles.dotDivider}>•</Text>
          <Text style={styles.bureauDistrict}>{isPanna ? "पन्ना (Panna)" : "मध्य प्रदेश"}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.bottomBar}>
          <View style={styles.metricsGroup}>
            <View style={styles.metricItem}>
              <Ionicons name="eye-outline" size={13} color={BrandColors.textSecondary} />
              <Text style={styles.metricText}>{formatMetricCount(article.views)} व्यूज</Text>
            </View>
            <View style={styles.metricDot} />
            <View style={styles.metricItem}>
              <Ionicons name="heart-outline" size={13} color={BrandColors.textSecondary} />
              <Text style={styles.metricText}>{formatMetricCount(article.likes)}</Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleToggleBookmark}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name={isSaved ? "bookmark" : "bookmark-outline"}
                size={16}
                color={isSaved ? BrandColors.primary : BrandColors.charcoal}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleShare}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="share-social-outline" size={16} color={BrandColors.primary} />
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
    marginHorizontal: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: BrandColors.border,
    overflow: "hidden",
    ...Shadows.sm,
  },
  imageWrapper: {
    width: "100%",
    height: 195,
    backgroundColor: "#0F172A",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  badgeContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    flexDirection: "row",
    gap: 6,
  },
  categoryBadge: {
    backgroundColor: BrandColors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  pannaCategoryBadge: {
    backgroundColor: "#059669",
  },
  categoryBadgeText: {
    color: BrandColors.white,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  breakingBadge: {
    backgroundColor: BrandColors.liveBadge,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
  },
  breakingBadgeText: {
    color: BrandColors.white,
    fontSize: 10,
    fontWeight: "900",
  },
  timeOverlay: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(15, 23, 42, 0.78)",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
  },
  timeOverlayText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "600",
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: BrandColors.charcoal,
    lineHeight: 22,
    marginBottom: 5,
  },
  description: {
    fontSize: 13,
    color: BrandColors.textSecondary,
    lineHeight: 18,
    marginBottom: 6,
  },
  bureauLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  bureauAuthor: {
    fontSize: 11,
    color: BrandColors.primaryDark,
    fontWeight: "700",
  },
  dotDivider: {
    fontSize: 11,
    color: BrandColors.textMuted,
  },
  bureauDistrict: {
    fontSize: 11,
    color: BrandColors.textMuted,
    fontWeight: "500",
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
    fontSize: 11,
    color: BrandColors.textSecondary,
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  actionButton: {
    padding: 4,
  },

  // Compact variant styles
  compactContainer: {
    flexDirection: "row",
    backgroundColor: BrandColors.white,
    borderRadius: 12,
    marginHorizontal: 12,
    marginBottom: 9,
    padding: 9,
    borderWidth: 1,
    borderColor: BrandColors.border,
    gap: 10,
    ...Shadows.sm,
  },
  compactImageWrap: {
    width: 105,
    height: 82,
    borderRadius: 8,
    backgroundColor: "#0F172A",
    overflow: "hidden",
    position: "relative",
  },
  compactImage: {
    width: "100%",
    height: "100%",
  },
  compactBreakingDot: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: BrandColors.primary,
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
    fontSize: 10,
    color: BrandColors.textMuted,
    fontWeight: "500",
  },
  compactTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: BrandColors.charcoal,
    lineHeight: 18,
    marginVertical: 2,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actionIconsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
});
