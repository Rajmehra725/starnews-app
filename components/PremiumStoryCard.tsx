import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { BrandColors, Shadows } from "@/constants/theme";
import { NewsArticle, formatTimeAgo, formatMetricCount, getFullMediaUrl } from "@/_services/api";

interface PremiumStoryCardProps {
  article: NewsArticle;
}

export default function PremiumStoryCard({ article }: PremiumStoryCardProps) {
  const router = useRouter();

  if (!article) return null;

  const imageUrl = getFullMediaUrl(article.featuredImage || (article.images && article.images[0]));

  return (
    <View style={styles.container}>
      {/* Editorial Section Label */}
      <View style={styles.sectionHeader}>
        <View style={styles.goldBadge}>
          <MaterialCommunityIcons name="crown" size={14} color="#D97706" />
          <Text style={styles.goldBadgeText}>डिजिटल प्रीमियम स्टोरी</Text>
        </View>
        <Text style={styles.exclusiveText}>EXCLUSIVE</Text>
      </View>

      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.92}
        onPress={() =>
          router.push({
            pathname: "/news/[id]",
            params: { id: article._id },
          })
        }
      >
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            contentFit="cover"
            transition={250}
          />
          <View style={styles.categoryPill}>
            <Text style={styles.categoryPillText}>
              {(article.category || "Special Report").toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.title} numberOfLines={2}>
            {article.title}
          </Text>

          {article.description ? (
            <Text style={styles.description} numberOfLines={2}>
              {article.description}
            </Text>
          ) : null}

          <View style={styles.metaRow}>
            <View style={styles.metaLeft}>
              <Ionicons name="time-outline" size={12} color={BrandColors.textMuted} />
              <Text style={styles.timeText}>{formatTimeAgo(article.createdAt)}</Text>
              <View style={styles.dot} />
              <Ionicons name="eye-outline" size={12} color={BrandColors.textMuted} />
              <Text style={styles.viewsText}>{formatMetricCount(article.views)}</Text>
            </View>

            <View style={styles.readBtn}>
              <Text style={styles.readBtnText}>पूरी रिपोर्ट पढ़ें</Text>
              <Ionicons name="arrow-forward" size={12} color="#D97706" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 14,
    marginVertical: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  goldBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  goldBadgeText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#92400E",
  },
  exclusiveText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#B45309",
    letterSpacing: 1.2,
  },
  card: {
    backgroundColor: "#FFFBEB", // Soft warm gold-neutral tint
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "#FDE68A",
    ...Shadows.md,
  },
  imageWrapper: {
    height: 160,
    width: "100%",
    position: "relative",
    backgroundColor: "#111",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  categoryPill: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: "rgba(15, 23, 42, 0.85)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  categoryPillText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#FDE68A",
  },
  body: {
    padding: 14,
  },
  title: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1F2937",
    lineHeight: 22,
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 18,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "rgba(253, 230, 138, 0.6)",
    paddingTop: 8,
  },
  metaLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: BrandColors.textMuted,
    marginHorizontal: 3,
  },
  timeText: {
    fontSize: 11,
    color: BrandColors.textSecondary,
    fontWeight: "600",
  },
  viewsText: {
    fontSize: 11,
    color: BrandColors.textSecondary,
    fontWeight: "600",
  },
  readBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  readBtnText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#B45309",
  },
});
