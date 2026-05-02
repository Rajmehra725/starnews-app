import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ActivityIndicator,
  Linking,
} from "react-native";


import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { io } from "socket.io-client";
import Swiper from "react-native-swiper";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import Advertisement from "@/components/Advertisement";

const { width } = Dimensions.get("window");
const COLORS = {
  primary: "#dc2626",
  dark: "#111827",
  light: "#f3f4f6",
  white: "#ffffff",
  gray: "#6b7280",
};

const scale = (size: number): number => (width / 375) * size;

const API = "https://starnewsbackend.onrender.com/api/news";
const SOCKET_URL = "https://starnewsbackend.onrender.com";

let socket: any;

export default function NewsDetail() {
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [news, setNews] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  const viewedRef = useRef(false);

  /* ⏱ TIME AGO */
  const timeAgo = (date: string) => {
    if (!date) return "";
    const sec = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (sec < 60) return "Just now";
    if (sec < 3600) return Math.floor(sec / 60) + "m ago";
    if (sec < 86400) return Math.floor(sec / 3600) + "h ago";
    return Math.floor(sec / 86400) + "d ago";
  };

  /* FETCH */
  const fetchData = async () => {
    try {
      setLoading(true);

      const [newsRes, commentRes] = await Promise.all([
        axios.get(API),
        axios.get(`${API}/${id}/comments`).catch(() => ({ data: [] })),
      ]);

      const found = newsRes.data.find((n: any) => n._id === id);

      setNews(found || null);
      setComments(commentRes.data || []);
    } catch (err) {
      console.log("API ERROR");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchData();
  }, [id]);

  /* SOCKET */
  useEffect(() => {
    socket = io(SOCKET_URL);

    socket.on("commentAdded", (c: any) => {
      setComments((prev) => [c, ...prev]);
    });

    socket.on("likeUpdated", ({ newsId, likes }: any) => {
      if (newsId === id) setNews((p: any) => ({ ...p, likes }));
    });

    socket.on("viewsUpdated", ({ newsId, views }: any) => {
      if (newsId === id) setNews((p: any) => ({ ...p, views }));
    });

    return () => socket.disconnect();
  }, [id]);

  /* VIEW */
  useEffect(() => {
    if (!id || viewedRef.current) return;

    viewedRef.current = true;

    axios.post(`${API}/${id}/view`, { userId: "guest" }).catch(() => {});
  }, [id]);

  /* ACTIONS */
  const handleLike = async () => {
    await axios.post(`${API}/${id}/like`, { userId: "guest" }).catch(() => {});
  };

  const handleShare = async () => {
    await axios.post(`${API}/${id}/share`).catch(() => {});
  };

  const handleComment = async () => {
    if (!text) return;

    await axios
      .post(`${API}/${id}/comment`, {
        text,
        visitorId: "guest",
      })
      .catch(() => {});

    setText("");
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#dc2626" />
      </View>
    );
  }

  if (!news) {
    return <Text style={{ padding: 20 }}>News not found</Text>;
  }

  const isBreaking =
    Date.now() - new Date(news.createdAt).getTime() < 2 * 60 * 60 * 1000;

  return (
    <ScrollView style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.logo}>STAR NEWS</Text>
        <Text style={styles.live}>LIVE</Text>
      </View>

      {/* IMAGE */}
      {news.featuredImage && (
        <Image source={{ uri: news.featuredImage }} style={styles.image} />
      )}

      {isBreaking && (
        <View style={styles.breakingBox}>
          <Text style={styles.breakingText}>BREAKING</Text>
        </View>
      )}

      {/* TITLE */}
      <Text style={styles.title}>{news.title}</Text>

      {/* TIME */}
      <Text style={styles.time}>
        {timeAgo(news.createdAt)} •{" "}
        {new Date(news.createdAt).toLocaleString()}
      </Text>

      {/* REPORTER */}
      <View style={styles.reporter}>
        <Image
          source={require("@/assets/images/Reporter.jpg")}
          style={styles.reporterImg}
        />
        <View>
          <Text style={styles.reporterName}>Prakash Shrivastava</Text>
          <Text style={styles.reporterLoc}>STAR NEWS</Text>
        </View>
      </View>

      {/* SOCIAL */}
    <View style={styles.socialRow}>

  {/* Instagram */}
  <TouchableOpacity
    onPress={() =>
      Linking.openURL(
        "https://www.instagram.com/reel/DSEzE6VjA1u/?igsh=enR1OGZ0ZmN4enhz"
      )
    }
  >
    <Ionicons name="logo-instagram" size={22} color="#E1306C" />
  </TouchableOpacity>

  {/* Facebook */}
  <TouchableOpacity
    onPress={() =>
      Linking.openURL("https://www.facebook.com/share/1Dj3yMqD7R/")
    }
  >
    <Ionicons name="logo-facebook" size={22} color="#1877f2" />
  </TouchableOpacity>

  {/* YouTube */}
  <TouchableOpacity
    onPress={() =>
      Linking.openURL(
        "https://youtube.com/@starnewsnetworks88?si=HHAEJevcHq48Fdrh"
      )
    }
  >
    <Ionicons name="logo-youtube" size={22} color="#ff0000" />
  </TouchableOpacity>

  {/* Twitter / X */}
  <TouchableOpacity
    onPress={() => Linking.openURL("https://x.com/starnews88")}
  >
    <Ionicons name="logo-twitter" size={22} color="#000" />
  </TouchableOpacity>

  {/* WhatsApp */}
  <TouchableOpacity
    onPress={() => Linking.openURL("https://wa.me/917987667358")}
  >
    <Ionicons name="logo-whatsapp" size={22} color="#25D366" />
  </TouchableOpacity>

</View>

      {/* DESCRIPTION */}
      <Text style={styles.desc}>{news.description}</Text>

      {/* AD */}
      <Advertisement />

      {/* CONTENT */}
      <Text style={styles.contents}>स्टार पन्ना न्यूज़ ब्यूरो </Text>
      <Text style={styles.content}>{news.content}</Text>

      {/* SLIDER */}
      {news.images?.length > 0 && (
        <Swiper height={230} autoplay>
          {news.images.map((img: string, i: number) => (
            <Image key={i} source={{ uri: img }} style={styles.sliderImg} />
          ))}
        </Swiper>
      )}

      {/* 🔥 SECTIONS */}
      {news.sections?.map((sec: any, i: number) => (
        <View key={i} style={styles.sectionBox}>
          
          {sec.heading && (
            <Text style={styles.sectionHeading}>{sec.heading}</Text>
          )}

          {sec.image && (
            <Image source={{ uri: sec.image }} style={styles.sectionImg} />
          )}

          <Text style={styles.sectionText}>{sec.content}</Text>
        </View>
      ))}

      {/* ACTIONS */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={handleLike} style={styles.actionBtn}>
          <Ionicons name="heart-outline" size={20} />
          <Text>{news.likes}</Text>
        </TouchableOpacity>

        <View style={styles.actionBtn}>
          <Ionicons name="eye-outline" size={20} />
          <Text>{news.views}</Text>
        </View>

        <TouchableOpacity onPress={handleShare} style={styles.actionBtn}>
          <Ionicons name="share-social-outline" size={20} />
          <Text>{news.shares}</Text>
        </TouchableOpacity>

        <View style={styles.actionBtn}>
          <Ionicons name="chatbubble-outline" size={20} />
          <Text>{comments.length}</Text>
        </View>
      </View>

      {/* COMMENT BOX */}
      <TextInput
        placeholder="Write comment..."
        value={text}
        onChangeText={setText}
        style={styles.input}
      />

      <TouchableOpacity style={styles.btn} onPress={handleComment}>
        <Text style={styles.btnText}>Post Comment</Text>
      </TouchableOpacity>

      {/* COMMENTS */}
      {comments.map((c, i) => (
        <View key={i} style={styles.comment}>
          <Text style={styles.commentUser}>User</Text>
          <Text>{c.text}</Text>
          <Text style={styles.commentTime}>
            {timeAgo(c.createdAt)}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

/* 🎨 STYLES */
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  /* 🔴 HEADER */
  header: {
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 10,
  },

  logo: {
    color: COLORS.white,
    fontSize: scale(24),
    fontWeight: "900",
    letterSpacing: 2,
  },

  live: {
    backgroundColor: COLORS.white,
    color: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 50,
    fontWeight: "900",
    fontSize: scale(12),
  },

  /* 🖼 HERO IMAGE */
  image: {
    width: "100%",
    height: scale(260),
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  /* 🚨 BREAKING */
  breakingBox: {
    position: "absolute",
    top: scale(210),
    left: 0,
    backgroundColor: "#ff0000",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    elevation: 10,
  },

  breakingText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: scale(13),
    letterSpacing: 1,
  },

  /* 📰 TITLE */
  title: {
    fontSize: scale(30),
    fontWeight: "900",
    color: COLORS.dark,
    paddingHorizontal: 16,
    marginTop: 16,
    lineHeight: scale(36),
  },

  /* ⏱ TIME */
  time: {
    color: COLORS.gray,
    paddingHorizontal: 16,
    marginTop: 6,
    fontSize: scale(12),
  },

  /* 👨‍💼 REPORTER */
  reporter: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 14,
    borderRadius: 14,
    elevation: 4,
  },

  reporterImg: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },

  reporterName: {
    fontWeight: "900",
    fontSize: scale(16),
  },

  reporterLoc: {
    fontSize: scale(12),
    color: COLORS.gray,
  },

  /* 🌐 SOCIAL */
  socialRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 14,
    backgroundColor: "#fff",
    paddingVertical: 14,
    marginHorizontal: 14,
    borderRadius: 20,
    elevation: 6,
  },

  /* 📄 DESCRIPTION */
  desc: {
    color: COLORS.primary,
    fontWeight: "900",
    paddingHorizontal: 16,
    fontSize: scale(16),
    marginBottom: 8,
  },

  /* 🧾 CONTENT */
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    fontSize: scale(17),
    lineHeight: scale(28),
    color: "#374151",
    textAlign: "justify",
  },

  contents: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    fontSize: scale(24),
    color: COLORS.primary,
    fontWeight: "900",
  },

  /* 🎞 SLIDER */
  sliderImg: {
    width: width - 24,
    height: scale(220),
    borderRadius: 14,
    marginHorizontal: 12,
  },

  /* 🧾 SECTION */
  sectionBox: {
    backgroundColor: "#fff",
    marginHorizontal: 14,
    marginVertical: 12,
    padding: 16,
    borderRadius: 18,
    elevation: 6,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },

  sectionHeading: {
    fontSize: scale(19),
    fontWeight: "900",
    marginBottom: 6,
    color: COLORS.dark,
  },

  sectionImg: {
    width: "100%",
    height: scale(190),
    borderRadius: 12,
    marginVertical: 10,
  },

  sectionText: {
    fontSize: scale(16),
    lineHeight: scale(26),
    color: "#374151",
    textAlign: "justify",
  },

  /* ❤️ ACTION BAR */
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    marginTop: 14,
    paddingVertical: 16,
    borderRadius: 20,
    marginHorizontal: 14,
    elevation: 6,
  },

  actionBtn: {
    alignItems: "center",
    backgroundColor: "#f9fafb",
    padding: 10,
    borderRadius: 12,
  },

  /* ✍️ INPUT */
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginHorizontal: 14,
    marginTop: 14,
    borderRadius: 16,
    padding: 14,
    backgroundColor: "#fff",
  },

  /* 🔴 BUTTON */
  btn: {
    backgroundColor: COLORS.primary,
    marginHorizontal: 14,
    marginTop: 12,
    padding: 16,
    borderRadius: 20,
    alignItems: "center",
    elevation: 6,
  },

  btnText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: scale(16),
    letterSpacing: 1,
  },

  /* 💬 COMMENTS */
  comment: {
    backgroundColor: "#fff",
    marginHorizontal: 14,
    marginTop: 12,
    padding: 16,
    borderRadius: 16,
    elevation: 3,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },

  commentUser: {
    fontWeight: "900",
    marginBottom: 6,
  },

  commentTime: {
    fontSize: scale(11),
    color: COLORS.gray,
    marginTop: 6,
  },

  /* ➖ DIVIDER */
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 12,
    marginHorizontal: 16,
  },
});