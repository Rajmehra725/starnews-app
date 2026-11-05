import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Share,
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

  const handleShare = async (e: any) => {
    e?.stopPropagation?.();
    try {
      await Share.share({
        title: article.title,
        message: `🔴 ${article.title}\n\nपूरी खबर पढ़ें स्टार न्यूज़ पर:\nhttps://starnewsnetworks.com/news/${article._id}`,
      });
    } catch {
      // ignore
    }
  };

  const imageUrl = getFullMediaUrl(article.featuredImage || (article.images && article.images[0]));
  const categoryName = article.category || "बड़ी खबर";
  const isPanna =
    article.category?.toLowerCase().includes("panna") ||
    article.title?.toLowerCase().includes("पन्ना") ||
    article.title?.toLowerCase().includes("panna");

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.93}
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
        colors={["rgba(0,0,0,0.25)", "rgba(15,23,42,0.45)", "rgba(10,14,24,0.97)"]}
        locations={[0, 0.4, 1]}
        style={styles.gradient}
      >
        {/* Top Badges */}
        <View style={styles.topBadges}>
          <View style={styles.leadBadge}>
            <MaterialCommunityIcons name="flash" size={13} color="#FFF" />
            <Text style={styles.leadBadgeText}>मुख्य समाचार (HEADLINE)</Text>
          </View>

          {isPanna && (
            <View style={styles.pannaBadge}>
              <Ionicons name="location-sharp" size={11} color="#FFF" />
              <Text style={styles.pannaBadgeText}>पन्ना विशेष</Text>
            </View>
          )}

          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{categoryName.toUpperCase()}</Text>
          </View>
        </View>

        {/* Bottom Headline & Metadata */}
        <View style={styles.bottomContent}>
          <Text style={styles.title} numberOfLines={3}>
            {article.title}
          </Text>

          {article.description ? (
            <Text style={styles.leadDescription} numberOfLines={2}>
              {article.description}
            </Text>
          ) : null}

          {/* Bureau accreditation & time */}
          <View style={styles.bureauRow}>
            <Text style={styles.bureauText}>पन्ना ब्यूरो • स्टार न्यूज़ नेटवर्क</Text>
            <Text style={styles.dotSeparator}>•</Text>
            <Text style={styles.timeText}>{formatTimeAgo(article.createdAt)}</Text>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metricsGroup}>
              <View style={styles.metricItem}>
                <Ionicons name="eye-outline" size={13} color="#E2E8F0" />
                <Text style={styles.metricText}>{formatMetricCount(article.views)} व्यूज</Text>
              </View>
              <View style={styles.metricItem}>
                <Ionicons name="heart-outline" size={13} color="#E2E8F0" />
                <Text style={styles.metricText}>{formatMetricCount(article.likes)}</Text>
              </View>
            </View>

            <View style={styles.actionPillsRow}>
              <TouchableOpacity
                style={styles.sharePill}
                onPress={handleShare}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="share-social-outline" size={13} color="#FFF" />
                <Text style={styles.sharePillText}>शेयर</Text>
              </TouchableOpacity>

              <View style={styles.readPill}>
                <Text style={styles.readPillText}>विस्तार से पढ़ें</Text>
                <Ionicons name="arrow-forward" size={12} color="#FFF" />
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 275,
    marginHorizontal: 12,
    marginBottom: 14,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    ...Shadows.md,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    padding: 14,
    justifyContent: "space-between",
  },
  topBadges: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    flexWrap: "wrap",
  },
  leadBadge: {
    backgroundColor: BrandColors.primary,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  leadBadgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  pannaBadge: {
    backgroundColor: "#059669",
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 4,
  },
  pannaBadgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "800",
  },
  categoryBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.22)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  categoryBadgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  bottomContent: {
    gap: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFFFFF",
    lineHeight: 25,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  leadDescription: {
    fontSize: 12,
    color: "#CBD5E1",
    lineHeight: 17,
  },
  bureauRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  bureauText: {
    fontSize: 11,
    color: "#FCA5A5",
    fontWeight: "700",
  },
  dotSeparator: {
    color: "#94A3B8",
    fontSize: 11,
  },
  timeText: {
    color: "#CBD5E1",
    fontSize: 11,
    fontWeight: "500",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.14)",
    paddingTop: 8,
    marginTop: 4,
  },
  metricsGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  metricItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metricText: {
    color: "#E2E8F0",
    fontSize: 11,
    fontWeight: "600",
  },
  actionPillsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sharePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sharePillText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "700",
  },
  readPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: BrandColors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  readPillText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "800",
  },
});
