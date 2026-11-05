import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Dimensions,
  ActivityIndicator,
  Share,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import ImageZoom from "react-native-image-pan-zoom";
import * as Haptics from "expo-haptics";

import { BrandColors, Shadows } from "@/constants/theme";
import { apiClient, getFullMediaUrl, EpaperItem } from "@/_services/api";
import StarHeader from "@/components/StarHeader";
import { StarEpaperLoader } from "@/components/StarBrandLoader";

const { width, height } = Dimensions.get("window");

export default function EpaperScreen() {
  const [epapers, setEpapers] = useState<EpaperItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedEpaper, setSelectedEpaper] = useState<EpaperItem | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [filterMode, setFilterMode] = useState<"all" | "today" | "week">("all");

  const fetchEpaper = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get<{ epapers: EpaperItem[] }>("/api/epaper");
      const list = res.data?.epapers || (Array.isArray(res.data) ? res.data : []);
      setEpapers(list);
    } catch (err) {
      console.log("Epaper Error:", err);
      setEpapers([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEpaper();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEpaper();
  };

  const filteredEpapers = useMemo(() => {
    if (filterMode === "all") return epapers;
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const sevenDays = 7 * oneDay;

    return epapers.filter((item) => {
      const pubDate = new Date(item.publishDate || item.createdAt || now).getTime();
      const diff = now - pubDate;
      if (filterMode === "today") return diff <= oneDay * 2;
      if (filterMode === "week") return diff <= sevenDays;
      return true;
    });
  }, [epapers, filterMode]);

  const handleOpenEdition = (epaper: EpaperItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedEpaper(epaper);
    setCurrentPageIndex(0);
    setViewerVisible(true);
  };

  const handlePageChange = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentPageIndex(index);
  };

  const handleSharePage = async () => {
    if (!selectedEpaper) return;
    try {
      await Share.share({
        title: selectedEpaper.title,
        message: `📰 स्टार न्यूज़ नेटवर्क डिजिटल ई-पेपर (${selectedEpaper.title})\nपृष्ठ संख्या: ${
          currentPageIndex + 1
        }\n\nपढ़ें संपूर्ण डिजिटल संस्करण: https://starnewsnetworks.com/epaper`,
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor={BrandColors.primaryDark} />

      {/* Unified Star Header */}
      <StarHeader
        variant="epaper"
        title="डिजिटल ई-पेपर (E-PAPER)"
        subtitle="स्टार न्यूज़ दैनिक प्रिंट संस्करण • पन्ना"
      />

      {/* Edition Date Filter Chips Bar */}
      <View style={styles.subFilterBar}>
        <View style={styles.filterBar}>
          {[
            { id: "all", label: "सभी अंक (All)" },
            { id: "today", label: "आज का अंक (Today)" },
            { id: "week", label: "इस सप्ताह (Weekly)" },
          ].map((f) => (
            <TouchableOpacity
              key={f.id}
              style={[styles.filterChip, filterMode === f.id && styles.activeFilterChip]}
              onPress={() => setFilterMode(f.id as any)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  filterMode === f.id && styles.activeFilterChipText,
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Content */}
      {loading ? (
        <StarEpaperLoader message="ई-पेपर संस्करण लोड हो रहे हैं..." />
      ) : (
        <FlatList
          data={filteredEpapers}
          keyExtractor={(item) => item._id}
          refreshing={refreshing}
          onRefresh={onRefresh}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const firstPage =
              item.pages && item.pages.length > 0 ? getFullMediaUrl(item.pages[0].url) : null;
            const pageCount = item.pages ? item.pages.length : 0;
            const publishDateStr = new Date(
              item.publishDate || item.createdAt || Date.now()
            ).toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            });

            return (
              <TouchableOpacity
                style={styles.editionCard}
                activeOpacity={0.9}
                onPress={() => handleOpenEdition(item)}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.paperBadge}>
                    <Text style={styles.paperBadgeText}>दैनिक पन्ना संस्करण</Text>
                  </View>
                  <Text style={styles.dateText}>{publishDateStr}</Text>
                </View>

                <View style={styles.cardBody}>
                  {firstPage ? (
                    <Image
                      source={{ uri: firstPage }}
                      style={styles.thumbnail}
                      contentFit="cover"
                      transition={250}
                    />
                  ) : (
                    <View style={styles.placeholderThumbnail}>
                      <MaterialCommunityIcons
                        name="newspaper"
                        size={40}
                        color={BrandColors.textMuted}
                      />
                    </View>
                  )}

                  <View style={styles.editionInfo}>
                    <Text style={styles.editionTitle}>{item.title}</Text>
                    <View style={styles.metaBadgeRow}>
                      <View style={styles.pagesPill}>
                        <Ionicons name="document-text-outline" size={13} color={BrandColors.primary} />
                        <Text style={styles.pagesPillText}>{pageCount} पृष्ठ (Pages)</Text>
                      </View>
                      <View style={styles.formatPill}>
                        <Text style={styles.formatPillText}>HD Print</Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={styles.readButton}
                      onPress={() => handleOpenEdition(item)}
                    >
                      <Ionicons name="book-outline" size={15} color="#FFF" />
                      <Text style={styles.readButtonText}>ई-पेपर पढ़ें (Read Now)</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={styles.center}>
              <MaterialCommunityIcons
                name="newspaper-variant-outline"
                size={48}
                color={BrandColors.textMuted}
              />
              <Text style={styles.emptyTitle}>कोई ई-पेपर संस्करण उपलब्ध नहीं है</Text>
              <Text style={styles.emptySubtitle}>
                नया संस्करण प्रकाशित होने पर यहां दिखाई देगा।
              </Text>
            </View>
          }
        />
      )}

      {/* Full Screen E-Paper Reader Modal with Pinch-To-Zoom */}
      <Modal
        visible={viewerVisible}
        animationType="slide"
        onRequestClose={() => setViewerVisible(false)}
      >
        <SafeAreaView style={styles.modalSafe} edges={["top", "bottom"]}>
          {/* Top Viewer Bar */}
          <View style={styles.viewerHeader}>
            <TouchableOpacity style={styles.viewerCloseBtn} onPress={() => setViewerVisible(false)}>
              <Ionicons name="close" size={22} color="#FFF" />
            </TouchableOpacity>

            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={styles.viewerTitle} numberOfLines={1}>
                {selectedEpaper?.title || "ई-पेपर"}
              </Text>
              <Text style={styles.viewerPageIndicator}>
                पृष्ठ {currentPageIndex + 1} / {selectedEpaper?.pages?.length || 1} • स्टार न्यूज़
              </Text>
            </View>

            <TouchableOpacity style={styles.viewerShareBtn} onPress={handleSharePage}>
              <Ionicons name="share-social-outline" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* Current Page Display with ImageZoom */}
          <View style={styles.pageViewer}>
            {selectedEpaper?.pages && selectedEpaper.pages[currentPageIndex] ? (
              <ImageZoom
                cropWidth={width}
                cropHeight={height - 180}
                imageWidth={width}
                imageHeight={height - 180}
                minScale={1}
                maxScale={4}
                enableDoubleClickZoom
                useNativeDriver
              >
                <Image
                  source={{
                    uri: getFullMediaUrl(selectedEpaper.pages[currentPageIndex].url),
                  }}
                  style={styles.fullPageImage}
                  contentFit="contain"
                />
              </ImageZoom>
            ) : (
              <View style={styles.center}>
                <Text style={{ color: "#FFF" }}>पृष्ठ उपलब्ध नहीं है</Text>
              </View>
            )}

            {/* Pinch Zoom Hint Pill */}
            <View style={styles.zoomHintBadge} pointerEvents="none">
              <Ionicons name="search" size={11} color="rgba(255,255,255,0.85)" />
              <Text style={styles.zoomHintText}>पिंच या डबल-टैप करके ज़ूम करें</Text>
            </View>
          </View>

          {/* Bottom Navigation Strip with Micro Page Previews */}
          <View style={styles.viewerFooter}>
            <TouchableOpacity
              style={[styles.pageNavBtn, currentPageIndex === 0 && styles.disabledNavBtn]}
              disabled={currentPageIndex === 0}
              onPress={() => handlePageChange(Math.max(0, currentPageIndex - 1))}
            >
              <Ionicons name="chevron-back" size={16} color="#FFF" />
              <Text style={styles.navBtnText}>पिछला</Text>
            </TouchableOpacity>

            {/* Page Thumbnails Strip */}
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={selectedEpaper?.pages || []}
              keyExtractor={(_, i) => String(i)}
              contentContainerStyle={styles.thumbnailsStrip}
              renderItem={({ item, index }) => {
                const isActive = index === currentPageIndex;
                const pageThumb = getFullMediaUrl(item.url);

                return (
                  <TouchableOpacity
                    style={[styles.thumbCard, isActive && styles.activeThumbCard]}
                    onPress={() => handlePageChange(index)}
                  >
                    <Image source={{ uri: pageThumb }} style={styles.microThumb} contentFit="cover" />
                    <View style={[styles.microBadge, isActive && styles.activeMicroBadge]}>
                      <Text style={[styles.microText, isActive && styles.activeMicroText]}>
                        P{index + 1}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />

            <TouchableOpacity
              style={[
                styles.pageNavBtn,
                selectedEpaper?.pages &&
                  currentPageIndex >= selectedEpaper.pages.length - 1 &&
                  styles.disabledNavBtn,
              ]}
              disabled={
                !selectedEpaper?.pages ||
                currentPageIndex >= selectedEpaper.pages.length - 1
              }
              onPress={() => handlePageChange(currentPageIndex + 1)}
            >
              <Text style={styles.navBtnText}>अगला</Text>
              <Ionicons name="chevron-forward" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BrandColors.primaryDark,
  },
  subFilterBar: {
    backgroundColor: BrandColors.primaryDark,
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    ...Shadows.sm,
  },
  header: {
    backgroundColor: BrandColors.primaryDark,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingTop: 6,
    marginBottom: 10,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: BrandColors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "900",
    color: "#FFF",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.75)",
    marginTop: 2,
  },
  filterBar: {
    flexDirection: "row",
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
  activeFilterChip: {
    backgroundColor: "#FFF",
  },
  filterChipText: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "700",
  },
  activeFilterChipText: {
    color: BrandColors.primaryDark,
    fontWeight: "800",
  },
  listContent: {
    padding: 14,
    paddingBottom: 80,
    backgroundColor: BrandColors.background,
  },
  editionCard: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BrandColors.border,
    ...Shadows.sm,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.borderLight,
    paddingBottom: 8,
  },
  paperBadge: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  paperBadgeText: {
    color: BrandColors.primaryDark,
    fontSize: 10,
    fontWeight: "800",
  },
  dateText: {
    fontSize: 11,
    color: BrandColors.textMuted,
    fontWeight: "600",
  },
  cardBody: {
    flexDirection: "row",
    gap: 14,
  },
  thumbnail: {
    width: 105,
    height: 140,
    borderRadius: 8,
    backgroundColor: "#1E293B",
  },
  placeholderThumbnail: {
    width: 105,
    height: 140,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  editionInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  editionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: BrandColors.charcoal,
    lineHeight: 20,
  },
  metaBadgeRow: {
    flexDirection: "row",
    gap: 8,
    marginVertical: 8,
  },
  pagesPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  pagesPillText: {
    fontSize: 11,
    fontWeight: "700",
    color: BrandColors.charcoal,
  },
  formatPill: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  formatPillText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#2563EB",
  },
  readButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: BrandColors.primary,
    paddingVertical: 9,
    borderRadius: 8,
    gap: 6,
  },
  readButtonText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "800",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    gap: 10,
  },
  loadingText: {
    fontSize: 13,
    color: BrandColors.textSecondary,
    fontWeight: "600",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: BrandColors.charcoal,
  },
  emptySubtitle: {
    fontSize: 13,
    color: BrandColors.textSecondary,
  },

  // Modal Viewer Styles
  modalSafe: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  viewerHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1E293B",
  },
  viewerCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  viewerTitle: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "800",
  },
  viewerPageIndicator: {
    color: "#94A3B8",
    fontSize: 11,
    marginTop: 2,
  },
  viewerShareBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  pageViewer: {
    flex: 1,
    backgroundColor: "#020617",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  fullPageImage: {
    width: "100%",
    height: "100%",
  },
  zoomHintBadge: {
    position: "absolute",
    bottom: 12,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  zoomHintText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 10,
    fontWeight: "700",
  },
  viewerFooter: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#0F172A",
    borderTopWidth: 1,
    borderTopColor: "#1E293B",
    gap: 8,
  },
  pageNavBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BrandColors.primary,
    paddingHorizontal: 9,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 3,
  },
  disabledNavBtn: {
    backgroundColor: "#334155",
  },
  navBtnText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "700",
  },
  thumbnailsStrip: {
    gap: 6,
    paddingHorizontal: 2,
    alignItems: "center",
  },
  thumbCard: {
    width: 38,
    height: 52,
    borderRadius: 5,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#334155",
    backgroundColor: "#1E293B",
    position: "relative",
  },
  activeThumbCard: {
    borderColor: BrandColors.primary,
    borderWidth: 2,
  },
  microThumb: {
    width: "100%",
    height: "100%",
  },
  microBadge: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.75)",
    alignItems: "center",
    paddingVertical: 1,
  },
  activeMicroBadge: {
    backgroundColor: BrandColors.primary,
  },
  microText: {
    color: "#94A3B8",
    fontSize: 8,
    fontWeight: "800",
  },
  activeMicroText: {
    color: "#FFF",
  },
});