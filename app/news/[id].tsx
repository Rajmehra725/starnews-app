import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Share,
} from "react-native";

import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { io } from "socket.io-client";
import {
  AntDesign,
  Feather,
  FontAwesome,
} from "@expo/vector-icons";

const { width } = Dimensions.get("window");

let socket: any;

export default function NewsDetailPage() {
  const { id } = useLocalSearchParams();

  const [news, setNews] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [visitorId, setVisitorId] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const viewedRef = useRef(false);

  // VISITOR ID
  useEffect(() => {
    const vid = "user_" + Math.random().toString(36).substring(2, 8);
    setVisitorId(vid);
  }, []);

  // FETCH NEWS
  const fetchNews = async () => {
    const res = await axios.get(
      "https://starnewsbackend.onrender.com/api/news"
    );

    const found = res.data.find((n: any) => n._id === id);
    setNews(found);
  };

  // FETCH COMMENTS
  const fetchComments = async () => {
    const res = await axios.get(
      `https://starnewsbackend.onrender.com/api/news/${id}/comments`
    );

    setComments(res.data?.comments || res.data || []);
  };

  // SOCKET
  useEffect(() => {
    socket = io("https://starnewsbackend.onrender.com");

    socket.on("commentAdded", (data: any) => {
      setComments((prev) => [data, ...prev]);
    });

    socket.on("likeUpdated", ({ newsId, likes }: any) => {
      if (newsId === id) {
        setNews((prev: any) => ({ ...prev, likes }));
      }
    });

    socket.on("viewsUpdated", ({ newsId, views }: any) => {
      if (newsId === id) {
        setNews((prev: any) => ({ ...prev, views }));
      }
    });

    socket.on("shareUpdated", ({ newsId, shares }: any) => {
      if (newsId === id) {
        setNews((prev: any) => ({ ...prev, shares }));
      }
    });

    return () => socket.disconnect();
  }, [id]);

  // LOAD DATA
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchNews(), fetchComments()]);
      setLoading(false);
    };

    load();
  }, [id]);

  // VIEW COUNT
  useEffect(() => {
    if (!id || viewedRef.current) return;

    viewedRef.current = true;

    axios.post(
      `https://starnewsbackend.onrender.com/api/news/${id}/view`,
      { userId: visitorId }
    );
  }, [id, visitorId]);

  // LIKE
  const handleLike = async () => {
    await axios.post(
      `https://starnewsbackend.onrender.com/api/news/${id}/like`,
      { userId: visitorId }
    );
  };

  // COMMENT
 const handleComment = async () => {
  if (!text || text.trim().length < 1) return;

  try {
    await axios.post(
      `https://starnewsbackend.onrender.com/api/news/${id}/comment`,
      {
        text: text.trim(),
        visitorId,
      }
    );

    setText("");
  } catch (err: any) {
    console.log("COMMENT ERROR:", err?.response?.data);
  }
};
  // SHARE FIXED
  const handleShare = async () => {
    if (!news) return;

    const url = "https://starnewsbackend.onrender.com/news/" + id;

    const message = `${news.title}\n\n${news.description}\n\n${url}`;

    try {
      await Share.share({
        message,
      });

      await axios.post(
        `https://starnewsbackend.onrender.com/api/news/${id}/share`
      );
    } catch (e) {
      console.log(e);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="red" />
      </View>
    );
  }

  if (!news) {
    return (
      <View style={styles.center}>
        <Text>News Not Found</Text>
      </View>
    );
  }

  return (
  <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

  {/* HEADER */}
  <View style={styles.header}>
    <Text style={styles.headerText}>STAR NEWS</Text>
    <View style={styles.liveBadge}>
      <Text style={styles.liveText}>LIVE</Text>
    </View>
  </View>

  {/* MAIN CARD */}
  <View style={styles.card}>

    {/* IMAGE */}
    {news.featuredImage && (
      <Image source={{ uri: news.featuredImage }} style={styles.image} />
    )}

    {/* TITLE */}
    <Text style={styles.title}>{news.title}</Text>

    {/* DATE */}
    <Text style={styles.date}>
      {new Date(news.createdAt).toLocaleString()}
    </Text>

    {/* SOCIAL */}
    <View style={styles.socialRow}>
      <FontAwesome name="instagram" size={18} color="#E1306C" />
      <FontAwesome name="facebook" size={18} color="#1877F2" />
      <FontAwesome name="youtube-play" size={18} color="red" />
      <FontAwesome name="twitter" size={18} color="black" />
      <FontAwesome name="whatsapp" size={18} color="green" />
    </View>

    {/* DESCRIPTION */}
    <Text style={styles.desc}>{news.description}</Text>

    {/* CONTENT */}
    <Text style={styles.content}>{news.content}</Text>

    {/* ACTION BAR */}
    <View style={styles.actions}>

      <TouchableOpacity onPress={handleLike} style={styles.actionItem}>
        <AntDesign name="heart" size={20} color="#ff3b30" />
        <Text style={styles.actionText}>{news.likes}</Text>
      </TouchableOpacity>

      <View style={styles.actionItem}>
        <Feather name="eye" size={20} color="#555" />
        <Text style={styles.actionText}>{news.views}</Text>
      </View>

      <TouchableOpacity onPress={handleShare} style={styles.actionItem}>
        <Feather name="share-2" size={20} color="#28a745" />
        <Text style={styles.actionText}>{news.shares}</Text>
      </TouchableOpacity>

      <View style={styles.actionItem}>
        <FontAwesome name="comment-o" size={20} color="#555" />
        <Text style={styles.actionText}>{comments.length}</Text>
      </View>

    </View>

  </View>

  {/* COMMENTS CARD */}
  <View style={styles.card}>

    <Text style={styles.commentTitle}>
      💬 Comments ({comments.length})
    </Text>

    <TextInput
      value={text}
      onChangeText={setText}
      placeholder="Write your comment..."
      placeholderTextColor="#999"
      style={styles.input}
    />

    <TouchableOpacity onPress={handleComment} style={styles.btn}>
      <Text style={styles.btnText}>Post Comment</Text>
    </TouchableOpacity>

    {comments.slice(0, showAll ? comments.length : 5).map((c, i) => (
      <View key={i} style={styles.comment}>
        
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {c.visitorId?.charAt(0).toUpperCase()}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.username}>User</Text>
          <Text style={styles.commentText}>{c.text}</Text>
        </View>

      </View>
    ))}

    {comments.length > 5 && (
      <TouchableOpacity onPress={() => setShowAll(!showAll)}>
        <Text style={styles.viewMore}>
          {showAll ? "Show Less" : "View More"}
        </Text>
      </TouchableOpacity>
    )}

  </View>

</ScrollView>
  );
}

/* ========== STYLES ========== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },

  header: {
    backgroundColor: "#d32f2f",
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },

  liveBadge: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  liveText: {
    color: "#d32f2f",
    fontSize: 12,
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "#fff",
    margin: 12,
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  image: {
    width: "100%",
    height: 220,
    borderRadius: 10,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    color: "#111",
  },

  date: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },

  socialRow: {
    flexDirection: "row",
    gap: 15,
    marginTop: 10,
  },

  desc: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#d32f2f",
  },

  content: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: "#333",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingVertical: 10,
  },

  actionItem: {
    alignItems: "center",
  },

  actionText: {
    fontSize: 12,
    marginTop: 3,
    color: "#444",
  },

  commentTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fafafa",
  },

  btn: {
    backgroundColor: "#d32f2f",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },

  comment: {
    flexDirection: "row",
    marginTop: 10,
    gap: 10,
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#d32f2f",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#fff",
    fontWeight: "bold",
  },

  username: {
    fontWeight: "bold",
    fontSize: 13,
  },

  commentText: {
    fontSize: 14,
    color: "#444",
  },
 center: { flex: 1, justifyContent: "center", alignItems: "center" },
  viewMore: {
    color: "#d32f2f",
    marginTop: 10,
    textAlign: "center",
    fontWeight: "500",
  },
});