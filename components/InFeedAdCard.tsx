import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BrandColors, Shadows } from "@/constants/theme";
import { apiClient, AdItem, getFullMediaUrl } from "@/_services/api";

const { width } = Dimensions.get("window");

interface InFeedAdCardProps {
  index?: number;
}

export default function InFeedAdCard({ index = 0 }: InFeedAdCardProps) {
  const [ad, setAd] = useState<AdItem | null>(null);

  useEffect(() => {
    let isMounted = true;
    apiClient
      .get<AdItem[]>("/api/ads/active")
      .then((res) => {
        if (!isMounted) return;
        const list = Array.isArray(res.data) ? res.data : [];
        if (list.length > 0) {
          const selected = list[index % list.length];
          setAd(selected);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [index]);

  const handlePress = () => {
    if (ad?.link) {
      Linking.openURL(ad.link).catch(() => {});
    }
  };

  if (!ad || !ad.image) {
    // Elegant fallback newsroom advertisement banner
    return (
      <TouchableOpacity
        style={styles.fallbackContainer}
        activeOpacity={0.9}
        onPress={() => Linking.openURL("https://wa.me/917987667358?text=I%20want%20to%20advertise%20on%20Star%20News%20Networks").catch(() => {})}
      >
        <View style={styles.badgeRow}>
          <Text style={styles.adTag}>विज्ञापन / SPONSORED</Text>
          <MaterialCommunityIcons name="bullhorn" size={14} color={BrandColors.primary} />
        </View>
        <Text style={styles.fallbackTitle}>
          अपने व्यापार एवं प्रतिष्ठान का विज्ञापन स्टार न्यूज़ पर प्रसारित कराएं
        </Text>
        <Text style={styles.fallbackSubtitle}>
          लाखों पाठकों तक त्वरित पहुंच | ब्यूरो विज्ञापन डेस्क: +91 7987667358
        </Text>
      </TouchableOpacity>
    );
  }

  const imageUrl = getFullMediaUrl(ad.image);

  return (
    <View style={styles.container}>
      <View style={styles.badgeRow}>
        <Text style={styles.adTag}>विज्ञापन / ADVERTISEMENT</Text>
      </View>

      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={handlePress}
      >
        <Image
          source={{ uri: imageUrl }}
          style={styles.adImage}
          contentFit="cover"
          transition={250}
        />
        {ad.title ? (
          <View style={styles.adTitleBox}>
            <Text style={styles.adTitleText} numberOfLines={1}>
              {ad.title}
            </Text>
          </View>
        ) : null}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 14,
    marginVertical: 10,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  adTag: {
    fontSize: 10,
    fontWeight: "800",
    color: BrandColors.textMuted,
    letterSpacing: 0.8,
  },
  card: {
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: BrandColors.border,
    backgroundColor: "#F3F4F6",
    ...Shadows.sm,
  },
  adImage: {
    width: "100%",
    height: 120,
  },
  adTitleBox: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: BrandColors.white,
  },
  adTitleText: {
    fontSize: 12,
    fontWeight: "700",
    color: BrandColors.charcoal,
  },
  fallbackContainer: {
    marginHorizontal: 14,
    marginVertical: 10,
    padding: 14,
    borderRadius: 12,
    backgroundColor: BrandColors.primaryGhost,
    borderWidth: 1,
    borderColor: BrandColors.primaryLight,
    ...Shadows.sm,
  },
  fallbackTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: BrandColors.primaryDark,
    lineHeight: 18,
    marginTop: 4,
  },
  fallbackSubtitle: {
    fontSize: 11,
    color: BrandColors.textSecondary,
    marginTop: 4,
    fontWeight: "500",
  },
});
