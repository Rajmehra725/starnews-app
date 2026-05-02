import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
  RefreshControl,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const API = "https://starnewsbackend.onrender.com/api/news";

const COLORS = {
  primary: "#dc2626",
  dark: "#111827",
  light: "#f4f6f8",
  white: "#ffffff",
  gray: "#6b7280",
};

const scale = (size: number) => (width / 375) * size;

export default function CategoryNews() {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [filteredNews, setFilteredNews] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await axios.get(API);
      setNewsList(res.data);
      applyFilter(selectedCategory, search, res.data);
    } catch (err) {
      console.log("API Error");
    }
  };

  /* 🧠 FILTER ENGINE (CATEGORY + SEARCH) */
  const applyFilter = (cat: string, text: string, data = newsList) => {
    let filtered = data;

    if (cat !== "All") {
      filtered = filtered.filter((i) => i.category === cat);
    }

    if (text.trim()) {
      filtered = filtered.filter((i) =>
        i.title.toLowerCase().includes(text.toLowerCase())
      );
    }

    setFilteredNews(filtered);
  };

  /* 🔥 CATEGORY CHANGE */
  const filterCategory = (cat: string) => {
    setSelectedCategory(cat);
    applyFilter(cat, search);
  };

  /* 🔍 SEARCH */
  useEffect(() => {
    const t = setTimeout(() => {
      applyFilter(selectedCategory, search);
    }, 300);

    return () => clearTimeout(t);
  }, [search]);

  /* 🔄 ONLY SELECTED CATEGORY REFRESH */
  const onRefresh = async () => {
    setRefreshing(true);

    try {
      const res = await axios.get(API);

      setNewsList(res.data);

      // 👇 only refresh current category data
      let data = res.data;

      if (selectedCategory !== "All") {
        data = data.filter((i: any) => i.category === selectedCategory);
      }

      setFilteredNews(data);
    } catch (e) {}

    setRefreshing(false);
  };

  /* ⏱ TIME */
  const timeAgo = (date: string) => {
    const sec = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

    if (sec < 60) return "now";
    if (sec < 3600) return `${Math.floor(sec / 60)}m`;
    if (sec < 86400) return `${Math.floor(sec / 3600)}h`;
    return `${Math.floor(sec / 86400)}d`;
  };

  /* CATEGORIES */
  const categories = [
    "All",
    "Politics",
    "Crime",
    "Sports",
    "Education",
    "Local",
    "Health",
    "Forest",
    "Share Market",
    "Finance",
    "Crime Offence",
  ];

  /* CARD */
  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.85}>
      <Image source={{ uri: item.featuredImage }} style={styles.image} />

      <View style={styles.badge}>
        <Text style={styles.badgeText}>{item.category || "News"}</Text>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {item.title}
      </Text>

      <Text style={styles.time}>{timeAgo(item.createdAt)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.logo}>📰 STAR NEWS</Text>

        <View style={styles.liveBadge}>
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      {/* SEARCH */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color="#666" />
        <TextInput
          placeholder="Search news..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* 🔥 CATEGORY (FIXED UI) */}
      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => filterCategory(c)}
              style={[
                styles.categoryCard,
                selectedCategory === c && styles.categoryActive,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === c && styles.categoryTextActive,
                ]}
              >
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* FEATURED */}
      {filteredNews[0] && (
        <View style={styles.featured}>
          <Image
            source={{ uri: filteredNews[0].featuredImage }}
            style={styles.featuredImage}
          />
          <View style={styles.featuredOverlay}>
            <Text style={styles.featuredText} numberOfLines={2}>
              {filteredNews[0].title}
            </Text>
          </View>
        </View>
      )}

      {/* LIST */}
      <FlatList
        data={filteredNews}
        keyExtractor={(i, idx) => i._id || idx.toString()}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.grid}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#dc2626"]}
          />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>No news found 🔍</Text>
        }
      />
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 45,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: COLORS.primary,
    elevation: 10,
  },

  logo: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
  },

  liveBadge: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  liveText: {
    color: COLORS.primary,
    fontWeight: "900",
    fontSize: 10,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    elevation: 4,
  },

  searchInput: {
    flex: 1,
    padding: 10,
  },

  /* 🔥 CATEGORY FIXED UI */
  categoryContainer: {
    marginVertical: 8,
    paddingHorizontal: 8,
  },

  categoryCard: {
    backgroundColor: "#e5e7eb",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 22,
    marginRight: 8,
    elevation: 2,
  },

  categoryActive: {
    backgroundColor: COLORS.primary,
  },

  categoryText: {
    fontSize: 12,
    color: "#333",
    fontWeight: "600",
  },

  categoryTextActive: {
    color: "#fff",
    fontWeight: "900",
  },

  featured: {
    margin: 12,
    borderRadius: 16,
    overflow: "hidden",
  },

  featuredImage: {
    width: "100%",
    height: 190,
  },

  featuredOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
  },

  featuredText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16,
  },

  grid: {
    paddingHorizontal: 8,
  },

  card: {
    width: width / 2 - 14,
    backgroundColor: "#fff",
    margin: 6,
    borderRadius: 14,
    overflow: "hidden",
    elevation: 4,
  },

  image: {
    width: "100%",
    height: 120,
  },

  badge: {
    position: "absolute",
    top: 6,
    left: 6,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },

  badgeText: {
    color: "#fff",
    fontSize: 8,
    fontWeight: "700",
  },

  title: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingTop: 6,
    fontWeight: "800",
  },

  time: {
    fontSize: 10,
    color: COLORS.gray,
    paddingHorizontal: 8,
    paddingBottom: 8,
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: COLORS.gray,
  },
});