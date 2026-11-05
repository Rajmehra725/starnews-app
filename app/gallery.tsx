import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Modal,
  ActivityIndicator,
  StatusBar,
  TextInput,
  Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { BrandColors, Shadows } from "@/constants/theme";
import { apiClient, getFullMediaUrl, GalleryAlbum } from "@/_services/api";
import StarHeader from "@/components/StarHeader";
import { StarPageLoader } from "@/components/StarBrandLoader";

const { width } = Dimensions.get("window");
const IMAGE_SIZE = (width - 44) / 3;

export default function GalleryScreen() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get<{ albums: GalleryAlbum[] }>("/api/gallery");
      const list = res.data?.albums || (Array.isArray(res.data) ? res.data : []);
      setAlbums(list);
    } catch {
      setAlbums([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchGallery();
  };

  const filteredAlbums = albums.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenLightbox = (album: GalleryAlbum, index: number) => {
    setSelectedAlbum(album);
    setActiveImageIndex(index);
  };

  const handleShareImage = async () => {
    if (!selectedAlbum || activeImageIndex === null) return;
    const currentImg = selectedAlbum.images[activeImageIndex];
    try {
      await Share.share({
        title: selectedAlbum.title,
        message: `📸 स्टार न्यूज़ नेटवर्क फोटो गैलरी: ${selectedAlbum.title}\n${getFullMediaUrl(currentImg.url)}`,
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
        variant="compact"
        title="फोटो गैलरी (PHOTO GALLERY)"
        subtitle="स्टार न्यूज़ नेटवर्क छायाचित्र संग्रह • पन्ना"
        onBackPress={() => router.back()}
      />

      {/* Search Field */}
      <View style={styles.searchBarWrap}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={17} color={BrandColors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="एल्बम खोजें (Search albums)..."
            placeholderTextColor={BrandColors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={17} color={BrandColors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Gallery List */}
      {loading ? (
        <StarPageLoader message="फोटो गैलरी लोड हो रही है..." onRetry={fetchGallery} />
      ) : (
        <FlatList
          data={filteredAlbums}
          keyExtractor={(item) => item._id}
          refreshing={refreshing}
          onRefresh={onRefresh}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.albumCard}>
              <View style={styles.albumHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.albumTitle}>{item.title}</Text>
                  {item.description ? (
                    <Text style={styles.albumDesc}>{item.description}</Text>
                  ) : null}
                </View>
                <View style={styles.countBadge}>
                  <Ionicons name="images-outline" size={12} color={BrandColors.primaryDark} />
                  <Text style={styles.countText}>{item.images?.length || 0} फोटो</Text>
                </View>
              </View>

              {/* Photos 3-Column Grid */}
              <View style={styles.photoGrid}>
                {item.images?.map((img, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.photoWrap}
                    activeOpacity={0.85}
                    onPress={() => handleOpenLightbox(item, idx)}
                  >
                    <Image
                      source={{ uri: getFullMediaUrl(img.url) }}
                      style={styles.gridImage}
                      contentFit="cover"
                      transition={200}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.center}>
              <MaterialCommunityIcons name="image-multiple-outline" size={48} color={BrandColors.textMuted} />
              <Text style={styles.emptyTitle}>कोई एल्बम उपलब्ध नहीं है</Text>
            </View>
          }
        />
      )}

      {/* Lightbox Full Screen Modal */}
      <Modal
        visible={activeImageIndex !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveImageIndex(null)}
      >
        <SafeAreaView style={styles.lightboxContainer}>
          <View style={styles.lightboxHeader}>
            <TouchableOpacity
              style={styles.lightboxBtn}
              onPress={() => setActiveImageIndex(null)}
            >
              <Ionicons name="close" size={24} color="#FFF" />
            </TouchableOpacity>

            <Text style={styles.lightboxTitle} numberOfLines={1}>
              {selectedAlbum?.title} ({(activeImageIndex ?? 0) + 1} / {selectedAlbum?.images?.length || 1})
            </Text>

            <TouchableOpacity style={styles.lightboxBtn} onPress={handleShareImage}>
              <Ionicons name="share-social-outline" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* Full Screen Image */}
          <View style={styles.lightboxImageWrap}>
            {selectedAlbum && activeImageIndex !== null && selectedAlbum.images[activeImageIndex] && (
              <Image
                source={{ uri: getFullMediaUrl(selectedAlbum.images[activeImageIndex].url) }}
                style={styles.fullScreenImage}
                contentFit="contain"
              />
            )}
          </View>

          {/* Navigation Controls */}
          {selectedAlbum && selectedAlbum.images.length > 1 && (
            <View style={styles.lightboxFooter}>
              <TouchableOpacity
                style={[styles.navArrow, activeImageIndex === 0 && styles.disabledArrow]}
                disabled={activeImageIndex === 0}
                onPress={() => setActiveImageIndex((prev) => (prev !== null ? Math.max(0, prev - 1) : 0))}
              >
                <Ionicons name="chevron-back" size={24} color="#FFF" />
                <Text style={styles.navArrowText}>पिछली</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.navArrow,
                  activeImageIndex === selectedAlbum.images.length - 1 && styles.disabledArrow,
                ]}
                disabled={activeImageIndex === selectedAlbum.images.length - 1}
                onPress={() =>
                  setActiveImageIndex((prev) =>
                    prev !== null ? Math.min(selectedAlbum.images.length - 1, prev + 1) : 0
                  )
                }
              >
                <Text style={styles.navArrowText}>अगली</Text>
                <Ionicons name="chevron-forward" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
          )}
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
  searchBarWrap: {
    backgroundColor: BrandColors.primaryDark,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    ...Shadows.sm,
  },
  header: {
    backgroundColor: BrandColors.primaryDark,
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 12,
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingTop: 6,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#FFF",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.75)",
    marginTop: 2,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 42,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: BrandColors.charcoal,
  },
  listContent: {
    padding: 14,
    paddingBottom: 60,
    backgroundColor: BrandColors.background,
  },
  albumCard: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BrandColors.border,
    ...Shadows.sm,
  },
  albumHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 10,
  },
  albumTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: BrandColors.charcoal,
  },
  albumDesc: {
    fontSize: 12,
    color: BrandColors.textSecondary,
    marginTop: 3,
  },
  countBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  countText: {
    fontSize: 11,
    fontWeight: "700",
    color: BrandColors.primaryDark,
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  photoWrap: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#F1F5F9",
  },
  gridImage: {
    width: "100%",
    height: "100%",
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

  // Lightbox
  lightboxContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
  },
  lightboxHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "space-between",
  },
  lightboxBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  lightboxTitle: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "700",
    maxWidth: width * 0.6,
  },
  lightboxImageWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImage: {
    width: "100%",
    height: "100%",
  },
  lightboxFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  navArrow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  disabledArrow: {
    opacity: 0.3,
  },
  navArrowText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
  },
});