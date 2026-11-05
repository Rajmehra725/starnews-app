import React, { useEffect, useState } from "react";
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
import { apiClient, GalleryAlbum, getFullMediaUrl } from "@/_services/api";

const CARD_WIDTH = Dimensions.get("window").width * 0.46;

export default function GalleryPreviewRail() {
  const router = useRouter();
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);

  useEffect(() => {
    let isMounted = true;
    apiClient
      .get<{ success: boolean; albums: GalleryAlbum[] }>("/api/gallery")
      .then((res) => {
        if (!isMounted) return;
        const list = res.data?.albums || (Array.isArray(res.data) ? res.data : []);
        setAlbums(list.slice(0, 6));
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  if (!albums || albums.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons name="image-multiple" size={18} color={BrandColors.primary} />
          <Text style={styles.sectionTitle}>फोटो गैलरी (PHOTO STORIES)</Text>
        </View>
        <TouchableOpacity style={styles.viewAllBtn} onPress={() => router.push("/gallery")}>
          <Text style={styles.viewAllText}>सभी एलबम</Text>
          <Ionicons name="chevron-forward" size={13} color={BrandColors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        {albums.map((album) => {
          const firstImg = album.images?.[0];
          const coverUrl = getFullMediaUrl(typeof firstImg === "string" ? firstImg : firstImg?.url);
          const count = album.images?.length || 0;

          return (
            <TouchableOpacity
              key={album._id}
              style={styles.card}
              activeOpacity={0.88}
              onPress={() => router.push("/gallery")}
            >
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: coverUrl }}
                  style={styles.image}
                  contentFit="cover"
                  transition={200}
                />
                <View style={styles.countBadge}>
                  <Ionicons name="camera-outline" size={11} color="#FFF" />
                  <Text style={styles.countText}>{count} Photos</Text>
                </View>
              </View>

              <View style={styles.body}>
                <Text style={styles.title} numberOfLines={2}>
                  {album.title}
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
    marginVertical: 12,
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
  imageWrapper: {
    height: 110,
    width: "100%",
    position: "relative",
    backgroundColor: "#111",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  countBadge: {
    position: "absolute",
    bottom: 6,
    right: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  countText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#FFF",
  },
  body: {
    padding: 8,
  },
  title: {
    fontSize: 12,
    fontWeight: "700",
    color: BrandColors.charcoal,
    lineHeight: 16,
  },
});
