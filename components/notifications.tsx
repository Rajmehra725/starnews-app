import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { BrandColors, Shadows } from "@/constants/theme";
import {
  apiClient,
  getFullMediaUrl,
  formatTimeAgo,
  NotificationItem,
} from "@/_services/api";

export default function Notifications() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiClient.get<{ data: NotificationItem[] } | NotificationItem[]>("/api/notification");
      const list = Array.isArray(res.data)
        ? res.data
        : (res.data as any)?.data || [];
      setNotifications(list);
    } catch (err) {
      console.log("Fetch Notifications Error:", err);
      setNotifications([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const handleNotificationPress = async (item: NotificationItem) => {
    // Mark as read in backend
    try {
      await apiClient.put(`/api/notification/read/${item._id}`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === item._id ? { ...n, isRead: true } : n))
      );
    } catch {
      // ignore
    }

    // Deep link to associated news if newsId is present
    if (item.newsId) {
      router.push({
        pathname: "/news/[id]",
        params: { id: item.newsId },
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={styles.bellIconBox}>
            <Ionicons name="notifications" size={18} color="#FFF" />
          </View>
          <View>
            <Text style={styles.headerTitle}>ताज़ा अलर्ट (NEWS ALERTS)</Text>
            <Text style={styles.headerSubtitle}>ब्रेकिंग एवं महत्वपूर्ण समाचार सूचनाएं</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh}>
          <Ionicons name="refresh" size={18} color={BrandColors.primary} />
        </TouchableOpacity>
      </View>

      {loading && notifications.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={BrandColors.primary} />
          <Text style={styles.loadingText}>नोटिफिकेशन लोड हो रहे हैं...</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[BrandColors.primary]}
            />
          }
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const isBreaking = item.type === "breaking";
            const imageUrl = item.image ? getFullMediaUrl(item.image) : null;

            return (
              <TouchableOpacity
                style={[
                  styles.notificationCard,
                  !item.isRead && styles.unreadCard,
                  isBreaking && styles.breakingCard,
                ]}
                activeOpacity={0.88}
                onPress={() => handleNotificationPress(item)}
              >
                {!item.isRead && <View style={styles.unreadDot} />}

                <View style={styles.cardHeader}>
                  <View
                    style={[
                      styles.iconCircle,
                      isBreaking ? styles.breakingIconCircle : styles.generalIconCircle,
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={isBreaking ? "flash" : "newspaper-variant"}
                      size={18}
                      color="#FFF"
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <View style={styles.tagTimeRow}>
                      <View style={[styles.typeBadge, isBreaking && styles.breakingTypeBadge]}>
                        <Text style={styles.typeBadgeText}>
                          {isBreaking ? "🔴 BREAKING ALERT" : "NEWS ALERT"}
                        </Text>
                      </View>
                      <Text style={styles.timeAgoText}>{formatTimeAgo(item.createdAt)}</Text>
                    </View>

                    <Text style={styles.titleText}>{item.title}</Text>
                    <Text style={styles.messageText}>{item.message}</Text>
                  </View>

                  {imageUrl && (
                    <Image source={{ uri: imageUrl }} style={styles.thumbImage} contentFit="cover" />
                  )}
                </View>

                {item.newsId && (
                  <View style={styles.openNewsAction}>
                    <Text style={styles.openNewsText}>पूरी खबर पढ़ें (Read Article)</Text>
                    <Ionicons name="arrow-forward" size={12} color={BrandColors.primary} />
                  </View>
                )}
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="notifications-off-outline" size={48} color={BrandColors.textMuted} />
              <Text style={styles.emptyTitle}>कोई नया नोटिफिकेशन नहीं है</Text>
              <Text style={styles.emptySubtitle}>ब्रेकिंग अलर्ट यहां दिखाई देंगे।</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrandColors.background,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.border,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  bellIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: BrandColors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: BrandColors.charcoal,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 10,
    color: BrandColors.textSecondary,
    marginTop: 2,
  },
  refreshBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    padding: 14,
    paddingBottom: 80,
    gap: 10,
  },
  notificationCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: BrandColors.border,
    position: "relative",
    ...Shadows.sm,
  },
  unreadCard: {
    backgroundColor: "#FFFBFB",
    borderColor: "#FECACA",
  },
  breakingCard: {
    borderLeftWidth: 4,
    borderLeftColor: BrandColors.primary,
  },
  unreadDot: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: BrandColors.primary,
  },
  cardHeader: {
    flexDirection: "row",
    gap: 10,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  generalIconCircle: {
    backgroundColor: BrandColors.charcoal,
  },
  breakingIconCircle: {
    backgroundColor: BrandColors.primary,
  },
  tagTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  typeBadge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  breakingTypeBadge: {
    backgroundColor: "#FEE2E2",
  },
  typeBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: BrandColors.primaryDark,
  },
  timeAgoText: {
    fontSize: 10,
    color: BrandColors.textMuted,
    marginRight: 14,
  },
  titleText: {
    fontSize: 13,
    fontWeight: "800",
    color: BrandColors.charcoal,
    lineHeight: 18,
    marginBottom: 3,
  },
  messageText: {
    fontSize: 12,
    color: BrandColors.textSecondary,
    lineHeight: 16,
  },
  thumbImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
    marginLeft: 6,
  },
  openNewsAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    borderTopWidth: 1,
    borderTopColor: BrandColors.borderLight,
    paddingTop: 8,
    marginTop: 8,
    gap: 4,
  },
  openNewsText: {
    fontSize: 11,
    fontWeight: "700",
    color: BrandColors.primary,
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
});