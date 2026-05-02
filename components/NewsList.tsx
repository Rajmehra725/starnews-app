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

const API = "https://starnewsbackend.onrender.com/api/news";

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

  /* 🔴 BREAKING FILTER (TOP HEADLINES) */
  const breakingNews = newsList.filter((item) => item.breaking);

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
          <Image source={{ uri: item.featuredImage }} style={styles.image} />

          {isBreaking && (
            <View style={styles.breaking}>
              <Text style={styles.breakingText}>BREAKING</Text>
            </View>
          )}

          <View style={styles.body}>
            <View style={styles.topRow}>
              {item.category && (
                <Text style={styles.category}>{item.category}</Text>
              )}
              <Text style={styles.time}>{timeAgo(item.createdAt)}</Text>
            </View>

            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>

            {item.location && (
              <Text style={styles.location}>📍 {item.location}</Text>
            )}

            <Text style={styles.desc} numberOfLines={2}>
              {item.description}
            </Text>

            <View style={styles.row}>
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

              <View style={styles.iconRow}>
                <Ionicons name="eye-outline" size={18} color="#64748b" />
                <Text style={styles.meta}>{item.views}</Text>
              </View>

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
      ListHeaderComponent={
        <View style={{ padding: 10 }}>

          {/* 🔥 TOP HEADLINES = BREAKING ONLY */}
          <Text style={styles.sectionTitle}>🔥 Top Breaking Headlines</Text>

          <FlatList
            horizontal
            data={breakingNews}
            keyExtractor={(i) => i._id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => openNews(item._id)}
                style={styles.headlineCard}
              >
                <Image
                  source={{ uri: item.featuredImage }}
                  style={styles.headlineImage}
                />

                <View style={styles.headlineOverlay}>
                  <Text style={styles.headlineText} numberOfLines={2}>
                    {item.title}
                  </Text>

                  <Text style={styles.headlineTag}>BREAKING</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  /* 📱 APP BACKGROUND */
  container: {
    backgroundColor: "#eef2f7",
  },

  /* 📰 MAIN NEWS CARD (Ultra Premium) */
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    marginBottom: 18,
    overflow: "hidden",

    shadowColor: "#000",
    shadowOpacity: 0.14,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },

  image: {
    width: "100%",
    height: 210,
  },

  body: {
    padding: 16,
  },

  /* 🧭 TOP ROW (clean + spaced) */
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  /* 🔴 CATEGORY BADGE (TV style pill improved) */
  category: {
    backgroundColor: "#e11d48",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 30,

    color: "#fff",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
  },

  time: {
    color: "#64748b",
    fontSize: 11,
    fontWeight: "600",
  },

  /* 🧠 TITLE (news headline strong hierarchy) */
  title: {
    color: "#0f172a",
    fontSize: 19,
    fontWeight: "900",
    lineHeight: 26,
  },

  location: {
    marginTop: 6,
    color: "#475569",
    fontSize: 12,
    fontWeight: "600",
  },

  desc: {
    marginTop: 10,
    color: "#64748b",
    fontSize: 13,
    lineHeight: 20,
  },

  /* ⚡ ACTION BAR (balanced spacing) */
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    alignItems: "center",
  },

  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  meta: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "600",
  },

  /* 🔥 BREAKING BADGE (TV flash style + glow) */
  breaking: {
    position: "absolute",
    top: 14,
    left: 14,

    backgroundColor: "#ff0000",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,

    shadowColor: "#ff0000",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },

  breakingText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  /* 🔥 SECTION TITLE (broadcast header style) */
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0f172a",
    marginBottom: 14,
    letterSpacing: 0.6,
  },

  /* 🧭 HEADLINES CARD (Aaj Tak style premium thumbnail) */
  headlineCard: {
    width: 250,
    height: 155,
    marginRight: 14,
    borderRadius: 18,
    overflow: "hidden",

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 7 },
    elevation: 7,
  },

  headlineImage: {
    width: "100%",
    height: "100%",
  },

  /* 🖤 DARK GRADIENT OVERLAY (more premium feel) */
  headlineOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 12,

    backgroundColor: "rgba(0,0,0,0.7)",
  },

  headlineText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 17,
  },

  headlineTag: {
    marginTop: 5,
    color: "#ffd60a",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  /* 📊 PRESS EFFECT (modern UX feel) */
  cardPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.92,
  },
});