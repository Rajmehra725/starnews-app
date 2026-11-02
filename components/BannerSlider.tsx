import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { Video, ResizeMode } from "expo-av";
import { BrandColors, Shadows } from "@/constants/theme";
import { apiClient, getFullMediaUrl, BannerItem } from "@/_services/api";

const { width } = Dimensions.get("window");

export default function BannerSlider() {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await apiClient.get<BannerItem[]>("/api/banners");
      const data = Array.isArray(res.data) ? res.data : [];
      setBanners(data);
    } catch (e) {
      console.log("Banner Error:", e);
    } finally {
      setLoading(false);
    }
  };

  const getUrl = (banner: BannerItem) => {
    return getFullMediaUrl(banner.url || banner.image);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color={BrandColors.primary} />
      </View>
    );
  }

  if (!banners.length) return null;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.labelBadge}>
          <Text style={styles.labelText}>SPONSORED</Text>
        </View>
        <View style={styles.dotsRow}>
          {banners.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === activeIndex ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
      </View>

      <Carousel
        loop
        autoPlay
        autoPlayInterval={5000}
        scrollAnimationDuration={900}
        width={width - 28}
        height={165}
        data={banners}
        onSnapToItem={(index) => setActiveIndex(index)}
        renderItem={({ item }) => {
          const mediaUrl = getUrl(item);
          return (
            <View style={styles.card}>
              {item.type === "video" ? (
                <Video
                  source={{ uri: mediaUrl }}
                  style={styles.media}
                  shouldPlay
                  isMuted
                  isLooping
                  resizeMode={ResizeMode.COVER}
                />
              ) : (
                <Image
                  source={{ uri: mediaUrl }}
                  style={styles.media}
                  resizeMode="cover"
                />
              )}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 14,
    marginVertical: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  labelBadge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  labelText: {
    fontSize: 9,
    fontWeight: "800",
    color: BrandColors.textMuted,
    letterSpacing: 0.6,
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dot: {
    height: 4,
    borderRadius: 2,
  },
  activeDot: {
    width: 14,
    backgroundColor: BrandColors.primary,
  },
  inactiveDot: {
    width: 4,
    backgroundColor: BrandColors.border,
  },
  card: {
    width: width - 28,
    height: 165,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#1F2937",
    ...Shadows.sm,
  },
  media: {
    width: "100%",
    height: "100%",
  },
  loaderContainer: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
});