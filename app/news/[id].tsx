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
} from "react-native";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { io } from "socket.io-client";
import Swiper from "react-native-swiper";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import Advertisement from "@/components/Advertisement";

const { width } = Dimensions.get("window");

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
        <Ionicons name="logo-instagram" size={22} color="#E1306C" />
        <Ionicons name="logo-facebook" size={22} color="#1877f2" />
        <Ionicons name="logo-youtube" size={22} color="#ff0000" />
        <Ionicons name="logo-twitter" size={22} color="#000" />
        <Ionicons name="logo-whatsapp" size={22} color="#25D366" />
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
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  /* HEADER */
  header: {
    backgroundColor: "#dc2626",
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 6,
  },

  logo: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  live: {
    backgroundColor: "#fff",
    color: "#dc2626",
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 50,
    fontWeight: "bold",
    fontSize: 12,
  },

  /* HERO IMAGE */
  image: {
    width: "100%",
    height: 260,
  },

  /* BREAKING */
  breakingBox: {
    position: "absolute",
    top: 220,
    left: 14,
    backgroundColor: "#dc2626",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    elevation: 5,
  },

  breakingText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },

  /* TITLE 🔥 */
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#111827",
    paddingHorizontal: 16,
    marginTop: 14,
    lineHeight: 34,
  },

  /* META */
  time: {
    color: "#6b7280",
    paddingHorizontal: 16,
    marginTop: 6,
    fontSize: 12,
  },

  /* REPORTER */
  reporter: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
  },

  reporterImg: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 12,
    borderWidth: 2,
    borderColor: "#dc2626",
  },

  reporterName: {
    fontWeight: "800",
    fontSize: 15,
  },

  reporterLoc: {
    fontSize: 12,
    color: "#6b7280",
  },

  /* SOCIAL CARD */
  socialRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 12,
    backgroundColor: "#fff",
    paddingVertical: 12,
    marginHorizontal: 14,
    borderRadius: 14,
    elevation: 4,
  },

  /* DESCRIPTION */
  desc: {
    color: "#dc2626",
    fontWeight: "800",
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 8,
  },

  /* CONTENT */
  content: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    fontSize: 16,
    lineHeight: 26,
    color: "#374151",
  },
contents: {
    paddingHorizontal: 16,
    paddingTop : 16,
    paddingBottom: 14,
    fontSize: 26,
    lineHeight: 26,
    color: "#dc2626",
    fontWeight:"900",
  },
  /* SLIDER */
  sliderImg: {
    width: width - 24,
    height: 220,
    borderRadius: 14,
    marginHorizontal: 12,
  },

  /* SECTION CARD */
  sectionBox: {
    backgroundColor: "#fff",
    marginHorizontal: 14,
    marginVertical: 10,
    padding: 14,
    borderRadius: 14,
    elevation: 3,
  },

  sectionHeading: {
    fontSize: 19,
    fontWeight: "900",
    marginBottom: 6,
    color: "#111827",
  },

  sectionImg: {
    width: "100%",
    height: 190,
    borderRadius: 12,
    marginVertical: 10,
  },

  sectionText: {
    fontSize: 15,
    lineHeight: 24,
    color: "#374151",
  },

  /* ACTION BAR */
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 14,
    marginHorizontal: 14,
    elevation: 4,
  },

  actionBtn: {
    alignItems: "center",
  },

  /* INPUT */
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginHorizontal: 14,
    marginTop: 14,
    borderRadius: 14,
    padding: 14,
    backgroundColor: "#fff",
  },

  /* BUTTON */
  btn: {
    backgroundColor: "#dc2626",
    marginHorizontal: 14,
    marginTop: 10,
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
    elevation: 4,
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },

  /* COMMENTS */
  comment: {
    backgroundColor: "#fff",
    marginHorizontal: 14,
    marginTop: 10,
    padding: 14,
    borderRadius: 14,
    elevation: 2,
  },

  commentUser: {
    fontWeight: "800",
    marginBottom: 4,
  },

  commentTime: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 6,
  },
});