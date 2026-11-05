import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Modal,
  FlatList,
  TextInput,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { BrandColors, BrandIdentity, Shadows, Typography } from "@/constants/theme";

export type StarHeaderVariant =
  | "home"
  | "category"
  | "news-detail"
  | "search"
  | "video"
  | "shorts"
  | "live"
  | "epaper"
  | "notifications"
  | "profile"
  | "compact";

export interface StarHeaderProps {
  variant?: StarHeaderVariant;
  title?: string;
  subtitle?: string;
  currentDistrict?: string;
  onDistrictPress?: () => void;
  onDistrictChange?: (district: string) => void;
  onSearchPress?: () => void;
  onNotificationsPress?: () => void;
  onLivePress?: () => void;
  onBackPress?: () => void;
  onSharePress?: () => void;
  onBookmarkPress?: () => void;
  isBookmarked?: boolean;
  onFontSizePress?: () => void;
  unreadNotifications?: boolean;
  searchQuery?: string;
  onSearchQueryChange?: (q: string) => void;
  onSearchClear?: () => void;
  rightActions?: React.ReactNode;
}

export const AVAILABLE_DISTRICTS = [
  { id: "पन्ना", name: "पन्ना (Panna)", isPrimary: true },
  { id: "सतना", name: "सतना (Satna)", isPrimary: false },
  { id: "छतरपुर", name: "छतरपुर (Chhatarpur)", isPrimary: false },
  { id: "रीवा", name: "रीवा (Rewa)", isPrimary: false },
  { id: "कटनी", name: "कटनी (Katni)", isPrimary: false },
  { id: "बुंदेलखंड", name: "समग्र बुंदेलखंड (Bundelkhand)", isPrimary: false },
];

export default function StarHeader({
  variant = "home",
  title,
  subtitle,
  currentDistrict = "पन्ना",
  onDistrictPress,
  onDistrictChange,
  onSearchPress,
  onNotificationsPress,
  onLivePress,
  onBackPress,
  onSharePress,
  onBookmarkPress,
  isBookmarked = false,
  onFontSizePress,
  unreadNotifications = false,
  searchQuery = "",
  onSearchQueryChange,
  onSearchClear,
  rightActions,
}: StarHeaderProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [districtModalOpen, setDistrictModalOpen] = useState(false);

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.35,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  const todayHindi = new Date().toLocaleDateString("hi-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleDistrictSelect = (d: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDistrictModalOpen(false);
    if (onDistrictChange) {
      onDistrictChange(d);
    }
  };

  const handleDefaultLivePress = () => {
    if (onLivePress) {
      onLivePress();
    } else {
      router.push("/(tabs)/live");
    }
  };

  const handleDefaultBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  // ============================================================================
  // VARIANT: HOME (Full Rich Editorial Masthead)
  // ============================================================================
  if (variant === "home") {
    return (
      <View style={styles.masthead}>
        {/* Top News Ticker Strip: LIVE 24×7 + Date + Tagline */}
        <View style={styles.topUtilityRow}>
          <TouchableOpacity
            style={styles.liveBeaconPill}
            activeOpacity={0.8}
            onPress={handleDefaultLivePress}
          >
            <Animated.View style={[styles.liveDot, { opacity: pulseAnim }]} />
            <Text style={styles.liveText}>LIVE 24×7</Text>
          </TouchableOpacity>

          <Text style={styles.todayDateText} numberOfLines={1}>
            {todayHindi}
          </Text>

          <View style={styles.taglinePill}>
            <Text style={styles.taglineText}>LOCAL • LIVE • TRUSTED</Text>
          </View>
        </View>

        {/* Main Brand Row: Logo + STAR NEWS NETWORKS + Location Dropdown + Actions */}
        <View style={styles.brandRow}>
          {/* Left: Official Star News Emblem + Channel Typography */}
          <View style={styles.brandLeft}>
            <View style={styles.emblemBadge}>
              <Image
                source={require("../assets/images/icon.png")}
                style={styles.emblemImg}
                contentFit="contain"
              />
            </View>
            <View>
              <View style={styles.titleWithStarRow}>
                <Text style={styles.brandTitleWhite}>STAR </Text>
                <Text style={styles.brandTitleRed}>NEWS</Text>
              </View>
              <Text style={styles.brandSubTitle}>NETWORKS</Text>
              <Text style={styles.bureauBadge}>पन्ना ब्यूरो • म.प्र.</Text>
            </View>
          </View>

          {/* Right: District Selector Pill + Quick Action Buttons */}
          <View style={styles.brandRight}>
            {/* Location Selector Pill */}
            <TouchableOpacity
              style={styles.locationPill}
              activeOpacity={0.8}
              onPress={() => {
                if (onDistrictPress) {
                  onDistrictPress();
                } else {
                  setDistrictModalOpen(true);
                }
              }}
            >
              <Ionicons name="location-sharp" size={12} color="#FFF" />
              <Text style={styles.locationPillText}>{currentDistrict}</Text>
              <Ionicons name="chevron-down" size={11} color="rgba(255,255,255,0.75)" />
            </TouchableOpacity>

            {/* Search Icon */}
            <TouchableOpacity
              style={styles.circleActionBtn}
              onPress={onSearchPress}
              activeOpacity={0.75}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="search" size={17} color="#FFF" />
            </TouchableOpacity>

            {/* Notifications Icon with Unread Badge */}
            <TouchableOpacity
              style={styles.circleActionBtn}
              onPress={onNotificationsPress}
              activeOpacity={0.75}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="notifications" size={17} color="#FFF" />
              {unreadNotifications && <View style={styles.unreadDot} />}
            </TouchableOpacity>

            {/* Live TV Shortcut */}
            <TouchableOpacity
              style={styles.liveShortcutBtn}
              onPress={handleDefaultLivePress}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="television-play" size={15} color="#FFF" />
              <Text style={styles.liveShortcutText}>लाइव</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Signature Red Accent Notch Line */}
        <View style={styles.signatureAccentBar}>
          <View style={styles.accentGlow} />
          <View style={styles.accentNotch}>
            <MaterialCommunityIcons name="star-four-points" size={10} color="#FACC15" />
          </View>
        </View>

        {/* District Switcher Modal */}
        <Modal
          visible={districtModalOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setDistrictModalOpen(false)}
        >
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setDistrictModalOpen(false)}
          >
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <View style={styles.modalTitleRow}>
                  <Ionicons name="location" size={18} color={BrandColors.primary} />
                  <Text style={styles.modalTitle}>क्षेत्र / जिला चुनें (Select District)</Text>
                </View>
                <TouchableOpacity onPress={() => setDistrictModalOpen(false)}>
                  <Ionicons name="close" size={20} color={BrandColors.textSecondary} />
                </TouchableOpacity>
              </View>

              <Text style={styles.modalSubtitle}>
                स्टार न्यूज़ नेटवर्क द्वारा प्रासंगिक स्थानीय समाचार प्राथमिकता से दिखाए जाएंगे:
              </Text>

              {AVAILABLE_DISTRICTS.map((item) => {
                const isSelected = currentDistrict === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.districtRow, isSelected && styles.activeDistrictRow]}
                    onPress={() => handleDistrictSelect(item.id)}
                  >
                    <View style={styles.districtNameRow}>
                      <Ionicons
                        name={isSelected ? "radio-button-on" : "radio-button-off"}
                        size={18}
                        color={isSelected ? BrandColors.primary : BrandColors.textMuted}
                      />
                      <Text
                        style={[
                          styles.districtNameText,
                          isSelected && styles.activeDistrictNameText,
                        ]}
                      >
                        {item.name}
                      </Text>
                    </View>
                    {item.isPrimary && (
                      <View style={styles.hqBadge}>
                        <Text style={styles.hqBadgeText}>मुख्यालय</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }

  // ============================================================================
  // VARIANT: NEWS DETAILS (Article Reader Header)
  // ============================================================================
  if (variant === "news-detail") {
    return (
      <View style={styles.compactMasthead}>
        <View style={styles.compactNavRow}>
          <TouchableOpacity
            style={styles.compactCircleBtn}
            onPress={handleDefaultBack}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="arrow-back" size={22} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.compactBrandCenter}>
            <View style={styles.microBrandRow}>
              <Image
                source={require("../assets/images/icon.png")}
                style={styles.microEmblem}
                contentFit="contain"
              />
              <Text style={styles.compactBrandTitle}>STAR NEWS NETWORKS</Text>
            </View>
            <Text style={styles.compactSub}>पन्ना • म.प्र. ब्यूरो</Text>
          </View>

          <View style={styles.compactActions}>
            {onFontSizePress && (
              <TouchableOpacity
                style={styles.compactActionBtn}
                onPress={onFontSizePress}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              >
                <MaterialCommunityIcons name="format-size" size={20} color="#FFF" />
              </TouchableOpacity>
            )}

            {onBookmarkPress && (
              <TouchableOpacity
                style={styles.compactActionBtn}
                onPress={onBookmarkPress}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              >
                <Ionicons
                  name={isBookmarked ? "bookmark" : "bookmark-outline"}
                  size={20}
                  color={isBookmarked ? "#FACC15" : "#FFF"}
                />
              </TouchableOpacity>
            )}

            {onSharePress && (
              <TouchableOpacity
                style={styles.compactActionBtn}
                onPress={onSharePress}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              >
                <Ionicons name="share-social-outline" size={20} color="#FFF" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Accent Bar */}
        <View style={styles.signatureAccentBar} />
      </View>
    );
  }

  // ============================================================================
  // VARIANT: LIVE TV (24x7 Broadcast Hub Header)
  // ============================================================================
  if (variant === "live") {
    return (
      <View style={styles.compactMasthead}>
        <View style={styles.compactNavRow}>
          <View style={styles.liveHeaderLeft}>
            <View style={styles.emblemBadgeSmall}>
              <Image
                source={require("../assets/images/icon.png")}
                style={styles.emblemImgSmall}
                contentFit="contain"
              />
            </View>
            <View>
              <View style={styles.titleWithStarRow}>
                <Text style={styles.brandTitleWhite}>STAR </Text>
                <Text style={styles.brandTitleRed}>LIVE 24×7</Text>
              </View>
              <Text style={styles.compactSub}>सीधा प्रसारण • पन्ना एवं मध्य प्रदेश</Text>
            </View>
          </View>

          <View style={styles.liveStatusTag}>
            <Animated.View style={[styles.liveDot, { opacity: pulseAnim }]} />
            <Text style={styles.liveStatusTagText}>ON AIR</Text>
          </View>
        </View>

        <View style={styles.signatureAccentBar} />
      </View>
    );
  }

  // ============================================================================
  // VARIANT: VIDEO & SHORTS (Video Hub Header)
  // ============================================================================
  if (variant === "video" || variant === "shorts") {
    return (
      <View style={styles.compactMasthead}>
        <View style={styles.compactNavRow}>
          <View style={styles.compactBrandCenterLeft}>
            <View style={styles.emblemBadgeSmall}>
              <MaterialCommunityIcons name="play-box-multiple" size={18} color="#FFF" />
            </View>
            <View>
              <Text style={styles.compactBrandTitle}>
                {variant === "shorts" ? "⭐ स्टार शॉर्ट्स" : "स्टार वीडियो हब"}
              </Text>
              <Text style={styles.compactSub}>STAR NEWS NETWORKS VIDEO</Text>
            </View>
          </View>

          <View style={styles.compactActions}>
            <TouchableOpacity
              style={styles.liveShortcutBtn}
              onPress={handleDefaultLivePress}
            >
              <Animated.View style={[styles.liveDot, { opacity: pulseAnim }]} />
              <Text style={styles.liveShortcutText}>लाइव टीवी</Text>
            </TouchableOpacity>

            {rightActions}
          </View>
        </View>

        <View style={styles.signatureAccentBar} />
      </View>
    );
  }

  // ============================================================================
  // VARIANT: EPAPER (Digital Newspaper Header)
  // ============================================================================
  if (variant === "epaper") {
    return (
      <View style={styles.compactMasthead}>
        <View style={styles.compactNavRow}>
          <View style={styles.compactBrandCenterLeft}>
            <View style={styles.emblemBadgeSmall}>
              <MaterialCommunityIcons name="newspaper-variant" size={18} color="#FFF" />
            </View>
            <View>
              <Text style={styles.compactBrandTitle}>डिजिटल ई-पेपर (E-PAPER)</Text>
              <Text style={styles.compactSub}>दैनिक प्रिंट संस्करण • पन्ना ब्यूरो</Text>
            </View>
          </View>

          <View style={styles.epaperPrintTag}>
            <Text style={styles.epaperPrintTagText}>HD PRINT</Text>
          </View>
        </View>

        <View style={styles.signatureAccentBar} />
      </View>
    );
  }

  // ============================================================================
  // VARIANT: SEARCH (Integrated search field in header)
  // ============================================================================
  if (variant === "search") {
    return (
      <View style={styles.searchMasthead}>
        <View style={styles.searchRow}>
          <TouchableOpacity
            style={styles.compactCircleBtn}
            onPress={handleDefaultBack}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="arrow-back" size={20} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.searchFieldBox}>
            <Ionicons name="search" size={17} color={BrandColors.primary} />
            <TextInput
              style={styles.searchInput}
              placeholder="पन्ना, मध्य प्रदेश या खबर खोजें..."
              placeholderTextColor={BrandColors.textMuted}
              value={searchQuery}
              onChangeText={onSearchQueryChange}
              autoFocus
              returnKeyType="search"
            />
            {searchQuery.length > 0 && onSearchClear && (
              <TouchableOpacity onPress={onSearchClear}>
                <Ionicons name="close-circle" size={17} color={BrandColors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.signatureAccentBar} />
      </View>
    );
  }

  // ============================================================================
  // VARIANT: COMPACT / GENERAL / NOTIFICATIONS / PROFILE
  // ============================================================================
  return (
    <View style={styles.compactMasthead}>
      <View style={styles.compactNavRow}>
        <TouchableOpacity
          style={styles.compactCircleBtn}
          onPress={handleDefaultBack}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.compactBrandCenterLeft}>
          <Text style={styles.compactBrandTitle} numberOfLines={1}>
            {title || "STAR NEWS NETWORKS"}
          </Text>
          <Text style={styles.compactSub} numberOfLines={1}>
            {subtitle || "लोकल • लाइव • भरोसेमंद | पन्ना ब्यूरो"}
          </Text>
        </View>

        {rightActions && <View style={styles.compactActions}>{rightActions}</View>}
      </View>

      <View style={styles.signatureAccentBar} />
    </View>
  );
}

// ============================================================================
// STYLES
// ============================================================================
const styles = StyleSheet.create({
  // Master Masthead
  masthead: {
    backgroundColor: BrandColors.primaryDark,
    paddingTop: Platform.OS === "android" ? 6 : 8,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    ...Shadows.md,
    overflow: "hidden",
  },
  topUtilityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.12)",
  },
  liveBeaconPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(229, 9, 20, 0.8)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
    borderWidth: 0.5,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FFF",
  },
  liveText: {
    color: "#FFF",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  todayDateText: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.85)",
    fontWeight: "600",
  },
  taglinePill: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  taglineText: {
    color: "#FCA5A5",
    fontSize: 8.5,
    fontWeight: "800",
    letterSpacing: 0.8,
  },

  // Main Brand Row
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  brandLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  emblemBadge: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: BrandColors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#FFF",
    ...Shadows.sm,
  },
  emblemImg: {
    width: 32,
    height: 32,
  },
  titleWithStarRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  brandTitleWhite: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFF",
    letterSpacing: 0.5,
  },
  brandTitleRed: {
    fontSize: 18,
    fontWeight: "900",
    color: "#EF4444",
    letterSpacing: 0.5,
  },
  brandSubTitle: {
    fontSize: 8.5,
    fontWeight: "900",
    color: "#FCA5A5",
    letterSpacing: 2,
    marginTop: -2,
  },
  bureauBadge: {
    fontSize: 9.5,
    fontWeight: "700",
    color: "rgba(255,255,255,0.7)",
    marginTop: 2,
  },

  // Brand Right Area
  brandRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  locationPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.16)",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 3,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  locationPillText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "800",
  },
  circleActionBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  unreadDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: BrandColors.primary,
    borderWidth: 1.5,
    borderColor: BrandColors.primaryDark,
  },
  liveShortcutBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BrandColors.primary,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.35)",
  },
  liveShortcutText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "800",
  },

  // Signature Red Accent Notch Bar
  signatureAccentBar: {
    height: 3,
    backgroundColor: BrandColors.primary,
    position: "relative",
  },
  accentGlow: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "30%",
    backgroundColor: "#F87171",
  },
  accentNotch: {
    position: "absolute",
    left: 48,
    top: -4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: BrandColors.primaryDark,
    alignItems: "center",
    justifyContent: "center",
  },

  // Compact Masthead Variants
  compactMasthead: {
    backgroundColor: BrandColors.primaryDark,
    paddingTop: 8,
    paddingBottom: 2,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    ...Shadows.sm,
  },
  compactNavRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingBottom: 10,
  },
  compactCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  compactBrandCenter: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 8,
  },
  microBrandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  microEmblem: {
    width: 18,
    height: 18,
  },
  compactBrandCenterLeft: {
    flex: 1,
    marginLeft: 10,
    flexDirection: "column",
  },
  compactBrandTitle: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  compactSub: {
    color: "#FCA5A5",
    fontSize: 10,
    fontWeight: "600",
    marginTop: 1,
  },
  compactActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  compactActionBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },

  // Live TV Header Extra
  liveHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  emblemBadgeSmall: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: BrandColors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FFF",
  },
  emblemImgSmall: {
    width: 24,
    height: 24,
  },
  liveStatusTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(229, 9, 20, 0.9)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 5,
    borderWidth: 1,
    borderColor: "#FFF",
  },
  liveStatusTagText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  epaperPrintTag: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  epaperPrintTagText: {
    color: "#1D4ED8",
    fontSize: 10,
    fontWeight: "900",
  },

  // Search Masthead
  searchMasthead: {
    backgroundColor: BrandColors.primaryDark,
    paddingTop: 8,
    paddingBottom: 2,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingBottom: 10,
    gap: 10,
  },
  searchFieldBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
    gap: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: BrandColors.charcoal,
    height: "100%",
  },

  // District Selector Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 18,
    ...Shadows.lg,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  modalTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: BrandColors.charcoal,
  },
  modalSubtitle: {
    fontSize: 12,
    color: BrandColors.textSecondary,
    marginBottom: 14,
    lineHeight: 17,
  },
  districtRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 6,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: BrandColors.borderLight,
  },
  activeDistrictRow: {
    backgroundColor: "#FEE2E2",
    borderColor: BrandColors.primary,
  },
  districtNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  districtNameText: {
    fontSize: 13,
    fontWeight: "700",
    color: BrandColors.charcoal,
  },
  activeDistrictNameText: {
    color: BrandColors.primaryDark,
    fontWeight: "900",
  },
  hqBadge: {
    backgroundColor: BrandColors.primaryDark,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  hqBadgeText: {
    color: "#FFF",
    fontSize: 9,
    fontWeight: "800",
  },
});
