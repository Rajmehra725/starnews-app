import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";

const { width } = Dimensions.get("window");

interface NotificationType {
  _id: string;
  title: string;
  message: string;
  type: string; // "breaking" | "general" | etc
  image?: string;
  isRead: boolean;
  createdAt: string;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const API = "https://starnewsbackend.onrender.com/api/notification";

  // 🔥 Fetch
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API);

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.data || [];

      setNotifications(data);
    } catch (err) {
      console.log("Fetch Error:", err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Pull Refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  // 🔥 Screen focus fetch (no interval spam)
  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [])
  );

  // 🕒 Time
  const formatTime = (date: string) => {
    const now = new Date();
    const d = new Date(date);
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000);

    if (diff < 60) return "अभी अभी";
    if (diff < 3600) return `${Math.floor(diff / 60)} मिनट पहले`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} घंटे पहले`;
    return `${Math.floor(diff / 86400)} दिन पहले`;
  };

  // 🔴 Mark Read
  const markRead = async (id: string) => {
    try {
      await axios.put(`${API}/read/${id}`);

      // fast UI update
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        )
      );
    } catch (err) {
      console.log("Read Error:", err);
    }
  };

  // 🔔 Render
  const renderItem = ({ item }: { item: NotificationType }) => {
    const isBreaking = item.type === "breaking";

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={[
          styles.card,
          isBreaking && styles.breakingCard,
          !item.isRead && styles.unreadBorder,
        ]}
        onPress={() => markRead(item._id)}
      >
        {/* 🔴 Unread Dot */}
        {!item.isRead && <View style={styles.dot} />}

        {/* ⚡ Icon */}
        <View style={styles.iconBox}>
          <Ionicons
            name={isBreaking ? "flash" : "notifications"}
            size={22}
            color={isBreaking ? "#D71920" : "#fff"}
          />
        </View>

        {/* 📄 Content */}
        <View style={styles.content}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.desc} numberOfLines={2}>
            {item.message}
          </Text>

          {/* 🔥 Breaking Badge */}
          {isBreaking && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>BREAKING</Text>
            </View>
          )}

          <Text style={styles.time}>
            {formatTime(item.createdAt)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        
        {/* 🔴 HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>Star News</Text>
            <Text style={styles.tagline}>ताज़ा खबरें ⚡</Text>
          </View>

          <TouchableOpacity
            style={styles.refreshBtn}
            onPress={fetchNotifications}
          >
            <Ionicons name="refresh" size={22} color="#D71920" />
          </TouchableOpacity>
        </View>

        {/* 🔄 Loader */}
        {loading && notifications.length === 0 && (
          <ActivityIndicator
            size="large"
            color="#D71920"
            style={{ marginTop: 20 }}
          />
        )}

        {/* 📭 Empty */}
        {!loading && notifications.length === 0 && (
          <Text style={styles.empty}>कोई नोटिफिकेशन नहीं</Text>
        )}

        {/* 📩 List */}
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#D71920"
            />
          }
        />
      </View>
    </SafeAreaView>
  );
}

/* 🎨 AajTak Style */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0B0B0B",
  },

  container: {
    flex: 1,
    paddingHorizontal: width * 0.04,
    paddingTop: 14,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  logo: {
    fontSize: width * 0.065,
    fontWeight: "900",
    color: "#D71920",
  },

  tagline: {
    color: "#aaa",
    fontSize: width * 0.032,
  },

  refreshBtn: {
    backgroundColor: "#1A1A1A",
    padding: 10,
    borderRadius: 50,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#1A1A1A",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    alignItems: "center",
  },

  breakingCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#D71920",
  },

  unreadBorder: {
    borderWidth: 1,
    borderColor: "#D71920",
  },

  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#0B0B0B",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  content: {
    flex: 1,
  },

  title: {
    color: "#fff",
    fontSize: width * 0.04,
    fontWeight: "800",
  },

  desc: {
    color: "#bbb",
    fontSize: width * 0.033,
    marginTop: 3,
  },

  time: {
    color: "#FFD700",
    fontSize: width * 0.028,
    marginTop: 6,
  },

  badge: {
    backgroundColor: "#D71920",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 5,
    alignSelf: "flex-start",
  },

  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "900",
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D71920",
    position: "absolute",
    left: 8,
    top: 8,
  },

  empty: {
    color: "#777",
    textAlign: "center",
    marginTop: 40,
  },
});