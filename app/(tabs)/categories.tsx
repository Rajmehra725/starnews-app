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
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const API = "https://starnewsbackend.onrender.com/api/news";

export default function CategoryNews() {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [filteredNews, setFilteredNews] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"news" | "panchang">("news");

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    const res = await axios.get(API);
    setNewsList(res.data);
    setFilteredNews(res.data);
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

  /* FILTER LOGIC (CATEGORY + SEARCH COMBINED) */
  const applyFilter = (cat: string, text: string) => {
    let data = newsList;

    if (cat !== "All") {
      data = data.filter((i) => i.category === cat);
    }

    if (text.trim()) {
      data = data.filter((i) =>
        i.title.toLowerCase().includes(text.toLowerCase())
      );
    }

    setFilteredNews(data);
  };

  /* CATEGORY CLICK */
  const filterCategory = (cat: string) => {
    setSelectedCategory(cat);
    applyFilter(cat, search);
  };

  /* SEARCH (REAL TIME FIXED) */
  const handleSearch = (text: string) => {
    setSearch(text);
    applyFilter(selectedCategory, text);
  };

  /* PANCHANG */
  const openPanchang = () => setView("panchang");
  const backToNews = () => setView("news");

  /* TIME */
  const timeAgo = (date: string) => {
    const sec = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (sec < 60) return "now";
    if (sec < 3600) return `${Math.floor(sec / 60)}m`;
    if (sec < 86400) return `${Math.floor(sec / 3600)}h`;
    return `${Math.floor(sec / 86400)}d`;
  };

  /* NEWS CARD */
  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Image source={{ uri: item.featuredImage }} style={styles.image} />
      <Text style={styles.title} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.time}>{timeAgo(item.createdAt)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        {view === "panchang" ? (
          <TouchableOpacity onPress={backToNews}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 22 }} />
        )}

        <Text style={styles.logo}>
          {view === "news" ? "📰 News App" : "📅 Panchang"}
        </Text>

        {view === "news" ? (
          <TouchableOpacity onPress={openPanchang}>
            <Ionicons name="calendar" size={22} color="#fff" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 22 }} />
        )}
      </View>

      {/* SEARCH */}
      {view === "news" && (
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#666" />
          <TextInput
            placeholder="Search latest news..."
            value={search}
            onChangeText={handleSearch}
            style={styles.searchInput}
          />
        </View>
      )}

      {/* CATEGORY */}
      {view === "news" && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryWrap}
        >
          {categories.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => filterCategory(c)}
              style={[
                styles.catCard,
                selectedCategory === c && styles.catActive,
              ]}
            >
              <Text
                style={[
                  styles.catText,
                  selectedCategory === c && styles.catTextActive,
                ]}
              >
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* BODY */}
      {view === "news" ? (
        <FlatList
          data={filteredNews}
          keyExtractor={(i, idx) => i._id || idx.toString()}
          renderItem={renderItem}
          numColumns={4}
          contentContainerStyle={styles.grid}
        />
      ) : (
        <View style={styles.panchang}>
          <Text style={styles.pTitle}>Today's Panchang</Text>

          <View style={styles.pCard}>
            <Text>🌅 Sunrise: 06:10 AM</Text>
            <Text>🌇 Sunset: 06:45 PM</Text>
            <Text>🌙 Tithi: Shukla Paksha</Text>
            <Text>⭐ Nakshatra: Rohini</Text>
            <Text>🪐 Yoga: Siddhi</Text>
          </View>
        </View>
      )}

    </View>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 45,
    paddingHorizontal: 12,
    paddingBottom: 10,
    backgroundColor: "#111827",
  },

  logo: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  /* SEARCH */
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    elevation: 2,
  },

  searchInput: {
    flex: 1,
    padding: 8,
  },

  /* CATEGORY */
  categoryWrap: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },

  catCard: {
    backgroundColor: "#e5e7eb",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },

  catActive: {
    backgroundColor: "#2563eb",
  },

  catText: {
    fontSize: 12,
    color: "#333",
  },

  catTextActive: {
    color: "#fff",
    fontWeight: "600",
  },

  /* GRID RESPONSIVE */
  grid: {
    padding: 6,
  },

  card: {
    width: width / 4 - 10,
    backgroundColor: "#fff",
    margin: 4,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 2,
  },

  image: {
    width: "100%",
    height: 65,
  },

  title: {
    fontSize: 10,
    paddingHorizontal: 4,
    paddingTop: 4,
    fontWeight: "600",
  },

  time: {
    fontSize: 9,
    color: "#666",
    paddingHorizontal: 4,
    paddingBottom: 4,
  },

  /* PANCHANG */
  panchang: {
    padding: 15,
  },

  pTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },

  pCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    elevation: 3,
  },
});