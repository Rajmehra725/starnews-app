import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Linking,
  Alert,
} from "react-native";
import axios from "axios";
import { Ionicons, Feather } from "@expo/vector-icons";

/* =======================
   DEBOUNCE HOOK
======================= */
const useDebounce = (value: string, delay = 300) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
};

/* =======================
   TYPE
======================= */
type Video = {
  _id: string;
  title: string;
  link: string;
  type?: "video" | "live";
};

/* =======================
   HELPERS
======================= */
const getVideoId = (url: string) => {
  const match = url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]+)/);
  return match ? match[1] : "";
};

const getThumbnail = (url: string) => {
  const id = getVideoId(url);
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
};

/* =======================
   MAIN COMPONENT
======================= */
export default function YoutubeScreen() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [filtered, setFiltered] = useState<Video[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "live" | "video">("all");

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://starnewsbackend.onrender.com/api/youtube/all"
      );
      setVideos(res.data);
      setFiltered(res.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     SEARCH FILTER
  ======================= */
  useEffect(() => {
    const result = videos.filter((v) =>
      (v.title || "").toLowerCase().includes(debouncedSearch.toLowerCase())
    );
    setFiltered(result);
  }, [debouncedSearch, videos]);

  const openVideo = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert("Error", "Cannot open video");
    }
  };

  const liveVideos = filtered.filter((v) => v.type === "live");
  const normalVideos = filtered.filter((v) => v.type !== "live");

  const displayedVideos =
    activeTab === "live"
      ? liveVideos
      : activeTab === "video"
      ? normalVideos
      : filtered;

  return (
    <ScrollView style={styles.container}>

      {/* TITLE */}
      <Text style={styles.title}>🎥 Star News Live</Text>

      {/* SEARCH */}
      <View style={styles.searchBox}>
        <Feather name="search" size={18} color="#94a3b8" />
        <TextInput
          placeholder="Search videos..."
          placeholderTextColor="#94a3b8"
          value={search}
          onChangeText={setSearch}
          style={styles.input}
        />
      </View>

      {/* TABS */}
      <View style={styles.tabRow}>
        {["all", "live", "video"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab as any)}
            style={[
              styles.tab,
              activeTab === tab && styles.activeTab,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* FEATURED */}
      <View style={styles.featuredCard}>
        <Text style={styles.featuredLabel}>🔥 FEATURED</Text>
        <Text style={styles.featuredText}>
          Watch Latest Breaking & Live News Videos
        </Text>
      </View>

      {/* LIVE SECTION */}
      <Text style={styles.sectionTitle}>🔴 Live Now</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#38bdf8" />
      ) : liveVideos.length === 0 ? (
        <Text style={styles.noData}>No live stream available</Text>
      ) : (
        liveVideos.map((v) => (
          <View key={v._id} style={styles.card}>

            <View style={styles.liveBadge}>
              <Text style={styles.liveText}>LIVE</Text>
            </View>

            <TouchableOpacity onPress={() => openVideo(v.link)}>
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: getThumbnail(v.link) }}
                  style={styles.thumbnail}
                />
                <View style={styles.overlay}>
                  <Ionicons name="play-circle" size={60} color="#fff" />
                </View>
              </View>
            </TouchableOpacity>

            <Text style={styles.videoTitle}>{v.title}</Text>

            <View style={styles.actions}>
              <TouchableOpacity onPress={() => Alert.alert("Copied")}>
                <Text style={styles.actionText}>📋 Copy</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => openVideo(v.link)}>
                <Text style={[styles.actionText, { color: "#ef4444" }]}>
                  ▶ Watch Live
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        ))
      )}

      {/* VIDEOS */}
      <Text style={styles.sectionTitle}>📺 Videos</Text>

      {displayedVideos.length === 0 ? (
        <Text style={styles.noData}>No videos found</Text>
      ) : (
        displayedVideos.map((v) => (
          <View key={v._id} style={styles.card}>

            <TouchableOpacity onPress={() => openVideo(v.link)}>
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: getThumbnail(v.link) }}
                  style={styles.thumbnail}
                />
                <View style={styles.overlay}>
                  <Ionicons name="play-circle" size={60} color="#fff" />
                </View>
              </View>
            </TouchableOpacity>

            <Text style={styles.videoTitle}>{v.title}</Text>

            <View style={styles.actions}>
              <TouchableOpacity onPress={() => Alert.alert("Copied")}>
                <Text style={styles.actionText}>📋 Copy</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => openVideo(v.link)}>
                <Text style={[styles.actionText, { color: "#ef4444" }]}>
                  ▶ Watch
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        ))
      )}

    </ScrollView>
  );
}

/* =======================
   STYLES (PRO DARK NEWS UI)
======================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#070b14",
    padding: 14,
    marginTop: 50,
  },

  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#38bdf8",
    textAlign: "center",
    marginBottom: 12,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(30,41,59,0.8)",
    padding: 12,
    borderRadius: 14,
    marginBottom: 14,
  },

  input: {
    marginLeft: 10,
    color: "#fff",
    flex: 1,
  },

  /* TABS */
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 14,
  },

  tab: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#111c2e",
  },

  activeTab: {
    backgroundColor: "#ef4444",
  },

  tabText: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "700",
  },

  activeTabText: {
    color: "#fff",
  },

  featuredCard: {
    backgroundColor: "#111c2e",
    padding: 14,
    borderRadius: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#ef4444",
  },

  featuredLabel: {
    color: "#ef4444",
    fontWeight: "900",
  },

  featuredText: {
    color: "#fff",
    marginTop: 4,
    fontWeight: "700",
  },

  sectionTitle: {
    color: "#94a3b8",
    marginVertical: 12,
    fontWeight: "700",
  },

  card: {
    backgroundColor: "#0f1a2e",
    borderRadius: 18,
    marginBottom: 16,
    overflow: "hidden",
  },

  imageWrapper: {
    height: 210,
    position: "relative",
  },

  thumbnail: {
    width: "100%",
    height: "100%",
  },

  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "flex-end",
    padding: 12,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  videoTitle: {
    color: "#fff",
    fontWeight: "800",
    padding: 10,
  },

  liveBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#ff0000",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    zIndex: 10,
  },

  liveText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 10,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
  },

  actionText: {
    color: "#38bdf8",
    fontWeight: "600",
  },

  noData: {
    color: "#64748b",
    textAlign: "center",
    marginVertical: 20,
  },
});