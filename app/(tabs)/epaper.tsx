import React, { useEffect, useState } from "react";
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
import { BrandColors, Shadows } from "@/constants/theme";
import { apiClient, getFullMediaUrl, EpaperItem } from "@/_services/api";

const { width, height } = Dimensions.get("window");

export default function EpaperScreen() {
  const [epapers, setEpapers] = useState<EpaperItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedEpaper, setSelectedEpaper] = useState<EpaperItem | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [viewerVisible, setViewerVisible] = useState(false);

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

  const handleOpenEdition = (epaper: EpaperItem) => {
    setSelectedEpaper(epaper);
    setCurrentPageIndex(0);
    setViewerVisible(true);
  };

  const handleSharePage = async () => {
    if (!selectedEpaper) return;
    try {
      await Share.share({
        title: selectedEpaper.title,
        message: `📰 स्टार न्यूज़ नेटवर्क डिजिटल ई-पेपर (${selectedEpaper.title})\n\nपढ़ें डिजिटल संस्करण: https://starnewsnetworks.com/epaper`,
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor={BrandColors.primaryDark} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.iconBox}>
            <MaterialCommunityIcons name="newspaper-variant" size={20} color="#FFF" />
          </View>
          <View>
            <Text style={styles.title}>डिजिटल ई-पेपर (E-PAPER)</Text>
            <Text style={styles.subtitle}>स्टार न्यूज़ नेटवर्क दैनिक प्रिंट संस्करण</Text>
          </View>
        </View>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={BrandColors.primary} />
          <Text style={styles.loadingText}>ई-पेपर संस्करण लोड हो रहे हैं...</Text>
        </View>
      ) : (
        <FlatList
          data={epapers}
          keyExtractor={(item) => item._id}
          refreshing={refreshing}
          onRefresh={onRefresh}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const firstPage = item.pages && item.pages.length > 0 ? getFullMediaUrl(item.pages[0].url) : null;
            const pageCount = item.pages ? item.pages.length : 0;
            const publishDateStr = new Date(item.publishDate || item.createdAt || Date.now()).toLocaleDateString("en-IN", {
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
                    <Text style={styles.paperBadgeText}>दैनिक संस्करण</Text>
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
                      <MaterialCommunityIcons name="newspaper" size={40} color={BrandColors.textMuted} />
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
              <MaterialCommunityIcons name="newspaper-variant-outline" size={48} color={BrandColors.textMuted} />
              <Text style={styles.emptyTitle}>कोई ई-पेपर संस्करण उपलब्ध नहीं है</Text>
              <Text style={styles.emptySubtitle}>नया संस्करण प्रकाशित होने पर यहां दिखाई देगा।</Text>
            </View>
          }
        />
      )}

      {/* Full Screen E-Paper Reader Modal */}
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
                पृष्ठ {currentPageIndex + 1} / {selectedEpaper?.pages?.length || 1}
              </Text>
            </View>

            <TouchableOpacity style={styles.viewerShareBtn} onPress={handleSharePage}>
              <Ionicons name="share-social-outline" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* Current Page Display */}
          <View style={styles.pageViewer}>
            {selectedEpaper?.pages && selectedEpaper.pages[currentPageIndex] ? (
              <Image
                source={{ uri: getFullMediaUrl(selectedEpaper.pages[currentPageIndex].url) }}
                style={styles.fullPageImage}
                contentFit="contain"
              />
            ) : (
              <View style={styles.center}>
                <Text style={{ color: "#FFF" }}>पृष्ठ उपलब्ध नहीं है</Text>
              </View>
            )}
          </View>

          {/* Bottom Navigation Strip */}
          <View style={styles.viewerFooter}>
            <TouchableOpacity
              style={[styles.pageNavBtn, currentPageIndex === 0 && styles.disabledNavBtn]}
              disabled={currentPageIndex === 0}
              onPress={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
            >
              <Ionicons name="chevron-back" size={18} color="#FFF" />
              <Text style={styles.navBtnText}>पिछला (Prev)</Text>
            </TouchableOpacity>

            {/* Page Selector Strip */}
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={selectedEpaper?.pages || []}
              keyExtractor={(_, i) => String(i)}
              contentContainerStyle={styles.thumbnailsStrip}
              renderItem={({ index }) => (
                <TouchableOpacity
                  style={[
                    styles.thumbPill,
                    index === currentPageIndex && styles.activeThumbPill,
                  ]}
                  onPress={() => setCurrentPageIndex(index)}
                >
                  <Text
                    style={[
                      styles.thumbText,
                      index === currentPageIndex && styles.activeThumbText,
                    ]}
                  >
                    P{index + 1}
                  </Text>
                </TouchableOpacity>
              )}
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
              onPress={() => setCurrentPageIndex((prev) => prev + 1)}
            >
              <Text style={styles.navBtnText}>अगला (Next)</Text>
              <Ionicons name="chevron-forward" size={18} color="#FFF" />
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
  header: {
    backgroundColor: BrandColors.primaryDark,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingTop: 6,
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
  },
  fullPageImage: {
    width: "100%",
    height: "100%",
  },
  viewerFooter: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#0F172A",
    borderTopWidth: 1,
    borderTopColor: "#1E293B",
    gap: 10,
  },
  pageNavBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BrandColors.primary,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 6,
    gap: 4,
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
    paddingHorizontal: 4,
    alignItems: "center",
  },
  thumbPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#1E293B",
  },
  activeThumbPill: {
    backgroundColor: BrandColors.primary,
  },
  thumbText: {
    color: "#94A3B8",
    fontSize: 11,
    fontWeight: "700",
  },
  activeThumbText: {
    color: "#FFF",
  },
});