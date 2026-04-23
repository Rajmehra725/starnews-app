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
   VIDEO TYPE
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
     SEARCH FILTER (FIXED)
  ======================= */
  useEffect(() => {
    const result = videos.filter((v) =>
      (v.title || "")
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase())
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

  const copyLink = () => {
    Alert.alert("Copied", "Link copied 👍");
  };

  const liveVideos = filtered.filter((v) => v.type === "live");
  const normalVideos = filtered.filter((v) => v.type !== "live");

  return (
    <ScrollView style={styles.container}>

      {/* HEADER */}
      <Text style={styles.title}>🎥 Star News YouTube</Text>

      {/* SEARCH */}
      <View style={styles.searchBox}>
        <Feather name="search" size={18} color="#94a3b8" />
        <TextInput
          placeholder="Search videos..."
          placeholderTextColor="#94a3b8"
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
          autoCapitalize="none"
          style={styles.input}
        />
      </View>

      {/* 🔴 LIVE SECTION */}
      <Text style={styles.sectionTitle}>🔴 Live Now</Text>

      {liveVideos.length === 0 ? (
        <Text style={styles.noData}>No live stream available</Text>
      ) : (
        liveVideos.map((v) => (
          <View key={v._id} style={styles.card}>

            <View style={styles.liveBadge}>
              <Text style={{ color: "#fff", fontSize: 10 }}>LIVE</Text>
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
              <TouchableOpacity onPress={copyLink}>
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

      {/* 📺 VIDEOS */}
      <Text style={styles.sectionTitle}>📺 Videos</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#38bdf8" />
      ) : filtered.length === 0 ? (
        <Text style={styles.noData}>
          😕 No videos found for "{search}"
        </Text>
      ) : (
        normalVideos.map((v) => (
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
              <TouchableOpacity onPress={copyLink}>
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
   STYLES
======================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 12,
    marginTop: 50,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#38bdf8",
    textAlign: "center",
    marginBottom: 10,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },

  input: {
    marginLeft: 8,
    color: "#fff",
    flex: 1,
  },

  sectionTitle: {
    color: "#94a3b8",
    marginVertical: 10,
    fontSize: 14,
  },

  card: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    marginBottom: 15,
    overflow: "hidden",
  },

  imageWrapper: {
    height: 200,
    position: "relative",
  },

  thumbnail: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },

  videoTitle: {
    color: "#fff",
    padding: 10,
    fontSize: 14,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },

  actionText: {
    color: "#38bdf8",
    fontSize: 13,
  },

  liveBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "red",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    zIndex: 10,
  },

  noData: {
    color: "#94a3b8",
    textAlign: "center",
    marginVertical: 10,
  },
});