import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Share,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import { TapGestureHandler } from "react-native-gesture-handler";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

type News = {
  _id: string;
  title: string;
  description: string;
  featuredImage: string;
  likes: number;
  shares: number;
  views: number;
  createdAt: string;
  breaking?: boolean;
  category?: string;
  location?: string;
};

const API = "https://starnewsbackend.onrender.com/api/satna";

export default function NewsList() {
  const router = useRouter();

  const [newsList, setNewsList] = useState<News[]>([]);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [refreshing, setRefreshing] = useState(false);

  const viewedRef = useRef<Set<string>>(new Set());
  const lastTap = useRef<number | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  /* 🔄 FETCH */
  const fetchNews = async () => {
    try {
      const res = await axios.get<News[]>(API);
      setNewsList(res.data);
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  /* 🔄 REFRESH */
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNews();
    setRefreshing(false);
  };

  /* ⏱ TIME AGO */
  const timeAgo = (date: string) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;
    if (seconds < 172800) return "Yesterday";

    return `${Math.floor(seconds / 86400)} days ago`;
  };

  /* 👁 VIEW */
  const handleView = async (id: string) => {
    if (viewedRef.current.has(id)) return;
    viewedRef.current.add(id);

    try {
      await axios.post(`${API}/${id}/view`, { userId: "guest" });
    } catch {}
  };

  /* ❤️ LIKE */
  const handleLike = async (id: string) => {
    setLiked((p) => ({ ...p, [id]: !p[id] }));
    try {
      await axios.post(`${API}/${id}/like`, { userId: "guest" });
    } catch {}
  };

  /* 🔁 SHARE */
  const handleShare = async (item: News) => {
    try {
      await Share.share({
        message: `${item.title}\n\nRead more on Star News`,
      });
    } catch {}
  };

  /* ❤️ DOUBLE TAP */
  const handleDoubleTap = (id: string) => {
    const now = Date.now();
    if (lastTap.current && now - lastTap.current < 300) {
      handleLike(id);
    }
    lastTap.current = now;
  };

  const openNews = (id: string) => {
    router.push({
      pathname: "/news/[id]",
      params: { id },
    });
  };

  /* 📰 CARD */
  const renderCard = ({ item }: { item: News }) => {
    handleView(item._id);

    const isBreaking =
      item.breaking ||
      Date.now() - new Date(item.createdAt).getTime() < 2 * 60 * 60 * 1000;

    return (
      <TapGestureHandler
        numberOfTaps={2}
        onActivated={() => handleDoubleTap(item._id)}
      >
        <TouchableOpacity
          activeOpacity={0.95}
          onPress={() => openNews(item._id)}
          style={styles.card}
        >
          {/* IMAGE */}
          <Image source={{ uri: item.featuredImage }} style={styles.image} />

          {/* 🔴 BREAKING */}
          {isBreaking && (
            <View style={styles.breaking}>
              <Text style={styles.breakingText}>BREAKING</Text>
            </View>
          )}

          {/* BODY */}
          <View style={styles.body}>
            
            {/* CATEGORY + TIME */}
            <View style={styles.topRow}>
              {item.category && (
                <Text style={styles.category}>{item.category}</Text>
              )}
              <Text style={styles.time}>
                {timeAgo(item.createdAt)}
              </Text>
            </View>

            {/* TITLE */}
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>

            {/* LOCATION */}
            {item.location && (
              <Text style={styles.location}>📍 {item.location}</Text>
            )}

            {/* DESC */}
            <Text style={styles.desc} numberOfLines={2}>
              {item.description}
            </Text>

            {/* ICON ROW */}
            <View style={styles.row}>
              
              {/* LIKE */}
              <TouchableOpacity onPress={() => handleLike(item._id)}>
                <View style={styles.iconRow}>
                  <Ionicons
                    name={liked[item._id] ? "heart" : "heart-outline"}
                    size={18}
                    color={liked[item._id] ? "#ef4444" : "#64748b"}
                  />
                  <Text style={styles.meta}>{item.likes}</Text>
                </View>
              </TouchableOpacity>

              {/* VIEWS */}
              <View style={styles.iconRow}>
                <Ionicons name="eye-outline" size={18} color="#64748b" />
                <Text style={styles.meta}>{item.views}</Text>
              </View>

              {/* SHARE */}
              <TouchableOpacity onPress={() => handleShare(item)}>
                <View style={styles.iconRow}>
                  <MaterialCommunityIcons
                    name="share-variant-outline"
                    size={18}
                    color="#64748b"
                  />
                  <Text style={styles.meta}>{item.shares}</Text>
                </View>
              </TouchableOpacity>

            </View>
          </View>
        </TouchableOpacity>
      </TapGestureHandler>
    );
  };

  return (
    <FlatList
      data={newsList}
      keyExtractor={(item) => item._id}
      renderItem={renderCard}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20 }}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 14,
    overflow: "hidden",
    elevation: 2,
  },

  image: {
    width: "100%",
    height: 180,
  },

  body: {
    padding: 12,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  category: {
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    fontSize: 10,
    fontWeight: "bold",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },

  time: {
    color: "#64748b",
    fontSize: 11,
  },

  title: {
    color: "#111",
    fontSize: 16,
    fontWeight: "700",
  },

  location: {
    color: "#334155",
    fontSize: 12,
    marginTop: 4,
  },

  desc: {
    color: "#475569",
    marginTop: 5,
    fontSize: 13,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  meta: {
    color: "#64748b",
    fontSize: 12,
  },

  breaking: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#dc2626",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },

  breakingText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
});