import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

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
};

const API = "https://starnewsbackend.onrender.com/api/news";

export default function NewsList() {
  const router = useRouter();

  const [newsList, setNewsList] = useState<News[]>([]);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [showOld, setShowOld] = useState(false);

  const viewedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await axios.get<News[]>(API);
      setNewsList(res.data);
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  // ⏰ 24 HOURS FILTER
  const isOldNews = (date: string) => {
    return Date.now() - new Date(date).getTime() > 24 * 60 * 60 * 1000;
  };

  const latestNews = newsList.filter((n) => !isOldNews(n.createdAt));
  const oldNews = newsList.filter((n) => isOldNews(n.createdAt));

  const handleView = async (id: string) => {
    if (viewedRef.current.has(id)) return;
    viewedRef.current.add(id);

    try {
      await axios.post(`${API}/${id}/view`, { userId: "guest" });
    } catch {}
  };

  const handleLike = async (id: string) => {
    setLiked((p) => ({ ...p, [id]: !p[id] }));

    try {
      await axios.post(`${API}/${id}/like`, { userId: "guest" });
    } catch {}
  };

  const openNews = (id: string) => {
    router.push({
  pathname: "/news/[id]",
  params: { id },
});
  };

  // 📰 CARD (LATEST)
  const renderCard = ({ item }: { item: News }) => {
    handleView(item._id);

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => openNews(item._id)}
        style={styles.card}
      >
        <Image source={{ uri: item.featuredImage }} style={styles.image} />

        {item.breaking && (
          <View style={styles.breaking}>
            <Text style={styles.breakingText}>🔴 BREAKING</Text>
          </View>
        )}

        <View style={styles.body}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>

          <Text style={styles.desc} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.row}>
            <TouchableOpacity onPress={() => handleLike(item._id)}>
              <Text style={{ color: liked[item._id] ? "red" : "#fff" }}>
                ❤️ {item.likes}
              </Text>
            </TouchableOpacity>

            <Text style={styles.meta}>👁 {item.views}</Text>
            <Text style={styles.meta}>🔁 {item.shares}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // 🧱 GRID (OLD NEWS)
  const renderGrid = ({ item }: { item: News }) => {
    handleView(item._id);

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => openNews(item._id)}
        style={styles.gridCard}
      >
        <Image source={{ uri: item.featuredImage }} style={styles.gridImage} />

        <Text numberOfLines={2} style={styles.gridTitle}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View>

      {/* 🆕 LATEST NEWS */}
      <Text style={styles.heading}>🆕 Latest News</Text>

      <FlatList
        data={latestNews}
        keyExtractor={(item) => item._id}
        renderItem={renderCard}
        scrollEnabled={false}
      />

      {/* 🔘 TOGGLE OLD */}
      {oldNews.length > 0 && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowOld(!showOld)}
        >
          <Text style={styles.buttonText}>
            {showOld ? "Hide Old News" : "Show Old News"}
          </Text>
        </TouchableOpacity>
      )}

      {/* 📰 OLD NEWS GRID */}
      {showOld && (
        <>
          <Text style={styles.heading}>📰 Old News</Text>

          <FlatList
            data={oldNews}
            keyExtractor={(item) => item._id}
            renderItem={renderGrid}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            scrollEnabled={false}
          />
        </>
      )}

    </View>
  );
}
const styles = StyleSheet.create({
  heading: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },

  card: {
    backgroundColor: "#1e293b",
    borderRadius: 14,
    marginBottom: 12,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: 180,
  },

  body: {
    padding: 10,
  },

  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  desc: {
    color: "#94a3b8",
    marginTop: 5,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  meta: {
    color: "#cbd5f5",
  },

  button: {
    backgroundColor: "#334155",
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  breaking: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "red",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },

  breakingText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },

  gridCard: {
    width: "48%",
    backgroundColor: "#0f172a",
    marginBottom: 10,
    borderRadius: 10,
    overflow: "hidden",
  },

  gridImage: {
    width: "100%",
    height: 100,
  },

  gridTitle: {
    color: "#fff",
    fontSize: 12,
    padding: 5,
  },
});