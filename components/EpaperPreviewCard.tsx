import React, { useEffect, useState } from "react";
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
import { apiClient, EpaperItem, getFullMediaUrl } from "@/_services/api";

const { width } = Dimensions.get("window");

export default function EpaperPreviewCard() {
  const router = useRouter();
  const [latestEpaper, setLatestEpaper] = useState<EpaperItem | null>(null);

  useEffect(() => {
    let isMounted = true;
    apiClient
      .get<{ success: boolean; epapers: EpaperItem[] }>("/api/epaper")
      .then((res) => {
        if (!isMounted) return;
        const list = res.data?.epapers || (Array.isArray(res.data) ? res.data : []);
        if (list.length > 0) {
          setLatestEpaper(list[0]);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  if (!latestEpaper) return null;

  const firstPage = latestEpaper.pages?.[0];
  const coverUrl = getFullMediaUrl(typeof firstPage === "string" ? firstPage : firstPage?.url);
  const editionDate = new Date(
    latestEpaper.publishDate || latestEpaper.createdAt || Date.now()
  ).toLocaleDateString("hi-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons
            name="book-open-page-variant"
            size={18}
            color={BrandColors.primary}
          />
          <Text style={styles.sectionTitle}>आज का ई-पेपर (DAILY E-PAPER)</Text>
        </View>
        <TouchableOpacity
          style={styles.viewAllBtn}
          onPress={() => router.push("/(tabs)/epaper")}
        >
          <Text style={styles.viewAllText}>सभी संस्करण</Text>
          <Ionicons name="chevron-forward" size={13} color={BrandColors.primary} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => router.push("/(tabs)/epaper")}
      >
        <View style={styles.coverWrapper}>
          <Image
            source={{ uri: coverUrl }}
            style={styles.coverImage}
            contentFit="cover"
            transition={200}
          />
          <View style={styles.pageCountBadge}>
            <Text style={styles.pageCountText}>
              {latestEpaper.pages?.length || 1} पृष्ठ (Pages)
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.dateBadge}>
            <Ionicons name="calendar-outline" size={12} color={BrandColors.primary} />
            <Text style={styles.dateText}>{editionDate}</Text>
          </View>

          <Text style={styles.title} numberOfLines={2}>
            {latestEpaper.title || "स्टार न्यूज़ डिजिटल दैनिक समाचार पत्र"}
          </Text>

          <Text style={styles.subtitle}>
            रीवा, सतना, पन्ना एवं संपूर्ण बुंदेलखंड संस्करण
          </Text>

          <View style={styles.actionBtn}>
            <Text style={styles.actionBtnText}>ई-पेपर पढ़ें</Text>
            <Ionicons name="arrow-forward" size={13} color="#FFF" />
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
  card: {
    flexDirection: "row",
    backgroundColor: BrandColors.white,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: BrandColors.border,
    padding: 10,
    gap: 12,
    ...Shadows.sm,
  },
  coverWrapper: {
    width: 105,
    height: 135,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#F3F4F6",
    position: "relative",
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  pageCountBadge: {
    position: "absolute",
    bottom: 4,
    left: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingVertical: 2,
    borderRadius: 4,
    alignItems: "center",
  },
  pageCountText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#FFF",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  dateBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    backgroundColor: BrandColors.primaryGhost,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  dateText: {
    fontSize: 11,
    fontWeight: "700",
    color: BrandColors.primary,
  },
  title: {
    fontSize: 14,
    fontWeight: "800",
    color: BrandColors.charcoal,
    lineHeight: 19,
    marginTop: 4,
  },
  subtitle: {
    fontSize: 11,
    color: BrandColors.textSecondary,
    marginBottom: 6,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: BrandColors.primary,
    paddingVertical: 7,
    borderRadius: 6,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FFF",
  },
});
