import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ActivityIndicator,
  Share,
  Platform,
  Alert,
  Modal,
} from "react-native";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { io } from "socket.io-client";
import * as Speech from "expo-speech";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { BrandColors, BrandIdentity, Shadows } from "@/constants/theme";
import {
  apiClient,
  API_BASE_URL,
  getFullMediaUrl,
  formatTimeAgo,
  formatMetricCount,
  NewsArticle,
  NewsComment,
} from "@/_services/api";
import NewsCard from "@/components/NewsCard";
import StarHeader from "@/components/StarHeader";
import { StarFullScreenLoader, StarButtonLoader } from "@/components/StarBrandLoader";

const { width, height } = Dimensions.get("window");

const SAVED_ARTICLES_KEY = "@starnews_saved_articles";

export default function NewsDetail() {
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [comments, setComments] = useState<NewsComment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [commenterName, setCommenterName] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [viewsCount, setViewsCount] = useState(0);
  const [sharesCount, setSharesCount] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1);
  const [relatedNews, setRelatedNews] = useState<NewsArticle[]>([]);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [activeModalImage, setActiveModalImage] = useState<string | null>(null);

  const viewedRef = useRef(false);

  /* FETCH NEWS DETAILS */
  const fetchData = async () => {
    try {
      setLoading(true);
      const [newsRes, commentsRes] = await Promise.all([
        apiClient.get<NewsArticle[]>("/api/news"),
        apiClient.get<NewsComment[]>(`/api/news/${id}/comments`).catch(() => ({ data: [] })),
      ]);

      const found = (newsRes.data || []).find((n) => n._id === id);

      if (found) {
        setArticle(found);
        setLikesCount(found.likes || 0);
        setViewsCount(found.views || 0);
        setSharesCount(found.shares || 0);

        // Related stories (same category or recent)
        const related = (newsRes.data || [])
          .filter((n) => n._id !== id && (n.category === found.category || !found.category))
          .slice(0, 4);
        setRelatedNews(related);
      }

      setComments(Array.isArray(commentsRes.data) ? commentsRes.data : []);
    } catch (err) {
      console.log("Fetch News Detail Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchData();

    // Check if saved
    AsyncStorage.getItem(SAVED_ARTICLES_KEY).then((raw) => {
      if (raw) {
        try {
          const list = JSON.parse(raw);
          if (Array.isArray(list)) {
            setIsBookmarked(list.some((item) => item._id === id));
          }
        } catch (e) {}
      }
    });
  }, [id]);

  /* VIEW TRACKING */
  useEffect(() => {
    if (!id || viewedRef.current) return;
    viewedRef.current = true;

    apiClient
      .post(`/api/news/${id}/view`, { userId: `reader_${Date.now()}` })
      .then((res) => {
        if (res.data?.views) setViewsCount(res.data.views);
      })
      .catch(() => {});
  }, [id]);

  /* REALTIME SOCKET */
  useEffect(() => {
    const socket = io(API_BASE_URL, { transports: ["websocket"] });

    socket.emit("joinNews", id);

    socket.on("likeUpdated", (data: { newsId: string; likes: number }) => {
      if (data.newsId === id) setLikesCount(data.likes);
    });

    socket.on("viewsUpdated", (data: { newsId: string; views: number }) => {
      if (data.newsId === id) setViewsCount(data.views);
    });

    socket.on("shareUpdated", (data: { newsId: string; shares: number }) => {
      if (data.newsId === id) setSharesCount(data.shares);
    });

    socket.on("newComment", (data: { newsId: string; comment: NewsComment }) => {
      if (data.newsId === id) {
        setComments((prev) => [data.comment, ...prev]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  // Clean speech when leaving screen
  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  /* LIKE ACTION */
  const handleLike = async () => {
    try {
      const nextLiked = !isLiked;
      setIsLiked(nextLiked);
      setLikesCount((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));

      await apiClient.post(`/api/news/${id}/like`, { userId: "app_reader" });
    } catch (err) {
      console.log("Like error:", err);
    }
  };

  /* SHARE ACTION */
  const handleShare = async () => {
    if (!article) return;
    try {
      await Share.share({
        title: article.title,
        message: `🔴 ${article.title}\n\nस्टार न्यूज़ नेटवर्क पर पूरी खबर पढ़ें:\nhttps://starnewsnetworks.com/news/${article._id}`,
      });

      apiClient.post(`/api/news/${id}/share`, { userId: "app_reader" }).catch(() => {});
      setSharesCount((prev) => prev + 1);
    } catch (e) {
      console.log("Share error:", e);
    }
  };

  /* BOOKMARK ACTION */
  const handleToggleBookmark = async () => {
    if (!article) return;
    try {
      const raw = await AsyncStorage.getItem(SAVED_ARTICLES_KEY);
      let list: NewsArticle[] = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(list)) list = [];

      const exists = list.some((item) => item._id === article._id);
      let nextList: NewsArticle[];
      if (exists) {
        nextList = list.filter((item) => item._id !== article._id);
        setIsBookmarked(false);
        Alert.alert("बुकमार्क हटाया गया", "समाचार सहेजी गई सूची से हटा दिया गया है।");
      } else {
        nextList = [article, ...list];
        setIsBookmarked(true);
        Alert.alert("बुकमार्क सहेजा गया 🔖", "समाचार सहेजे गए अनुभाग में जोड़ दिया गया है।");
      }
      await AsyncStorage.setItem(SAVED_ARTICLES_KEY, JSON.stringify(nextList));
    } catch (e) {
      console.log("Bookmark error:", e);
    }
  };

  /* TEXT TO SPEECH (AUDIO NEWS READER) */
  const toggleSpeech = async () => {
    if (isPlayingAudio) {
      await Speech.stop();
      setIsPlayingAudio(false);
      return;
    }

    if (!article) return;
    const textToRead = `${article.title}. ${article.description || ""}. ${article.content || ""}`;

    setIsPlayingAudio(true);
    Speech.speak(textToRead, {
      language: "hi-IN",
      pitch: 1.0,
      rate: 0.9,
      onDone: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false),
    });
  };

  /* POST COMMENT */
  const handlePostComment = async () => {
    if (!commentText.trim()) {
      Alert.alert("टिप्पणी लिखें", "कृपया अपनी राय या टिप्पणी दर्ज करें।");
      return;
    }

    try {
      setSubmittingComment(true);
      const name = commenterName.trim() || "पाठक (Reader)";
      const res = await apiClient.post(`/api/news/${id}/comment`, {
        text: commentText.trim(),
        name,
        visitorId: `visitor_${Date.now()}`,
      });

      if (Array.isArray(res.data)) {
        setComments(res.data);
      } else {
        setComments((prev) => [
          {
            _id: `c_${Date.now()}`,
            text: commentText.trim(),
            name,
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ]);
      }

      setCommentText("");
      Alert.alert("सफलता", "आपकी टिप्पणी प्रकाशित कर दी गई है।");
    } catch (err) {
      Alert.alert("त्रुटि", "टिप्पणी सबमिट करने में विफल। पुनः प्रयास करें।");
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return <StarFullScreenLoader message="समाचार लेख लोड हो रहा है..." />;
  }

  if (!article) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={BrandColors.primary} />
        <Text style={styles.notFoundText}>समाचार नहीं मिला (News Not Found)</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>वापस जाएं (Go Back)</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const imageUrl = getFullMediaUrl(article.featuredImage || (article.images && article.images[0]));
  const isBreaking = article.breaking || Date.now() - new Date(article.createdAt).getTime() < 3 * 3600 * 1000;
  const isPanna =
    article.category?.toLowerCase().includes("panna") ||
    article.title?.toLowerCase().includes("पन्ना") ||
    article.title?.toLowerCase().includes("panna");

  const additionalImages = (article.images || []).filter((img) => getFullMediaUrl(img) !== imageUrl);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Unified Star Header for Article Reading */}
      <StarHeader
        variant="news-detail"
        title={article.title}
        isBookmarked={isBookmarked}
        onBookmarkPress={handleToggleBookmark}
        onSharePress={handleShare}
        onFontSizePress={() =>
          setFontSizeMultiplier((prev) => (prev === 1 ? 1.15 : prev === 1.15 ? 1.3 : 1))
        }
        onBackPress={() => router.back()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Category and Breaking Tags */}
        <View style={styles.topMetaContainer}>
          <View style={[styles.categoryPill, isPanna && styles.pannaCategoryPill]}>
            <Text style={styles.categoryPillText}>
              {isPanna ? "पन्ना विशेष" : (article.category || "विशेष खबर").toUpperCase()}
            </Text>
          </View>

          {isBreaking && (
            <View style={styles.breakingTag}>
              <MaterialCommunityIcons name="flash" size={13} color="#FFF" />
              <Text style={styles.breakingTagText}>BREAKING NEWS</Text>
            </View>
          )}
        </View>

        {/* Main Headline */}
        <Text style={[styles.mainHeadline, { fontSize: 22 * fontSizeMultiplier }]}>
          {article.title}
        </Text>

        {/* Bureau & Reporter Accreditation */}
        <View style={styles.bylineCard}>
          <View style={styles.bureauAvatar}>
            <MaterialCommunityIcons name="newspaper-variant" size={20} color="#FFF" />
          </View>
          <View style={styles.bylineInfo}>
            <View style={styles.bureauChiefRow}>
              <Text style={styles.reporterName}>
                {isPanna ? "पन्ना ब्यूरो • प्रकाश श्रीवास्तव" : "स्टार न्यूज़ नेटवर्क ब्यूरो"}
              </Text>
              <MaterialCommunityIcons name="check-decagram" size={14} color="#2563EB" />
            </View>
            <Text style={styles.publishDate}>
              प्रकाशित:{" "}
              {new Date(article.createdAt).toLocaleString("hi-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              • {formatTimeAgo(article.createdAt)}
            </Text>
          </View>
        </View>

        {/* Large Featured Image */}
        <TouchableOpacity
          style={styles.imageBox}
          activeOpacity={0.9}
          onPress={() => {
            setActiveModalImage(imageUrl);
            setImageModalVisible(true);
          }}
        >
          <Image
            source={{ uri: imageUrl }}
            style={styles.heroImage}
            contentFit="cover"
            transition={300}
          />
          <View style={styles.zoomHintPill}>
            <Ionicons name="expand" size={12} color="#FFF" />
            <Text style={styles.zoomHintText}>टैप कर बड़ा देखें</Text>
          </View>
        </TouchableOpacity>

        {/* Multiple Additional Images Gallery Strip (if present) */}
        {additionalImages.length > 0 && (
          <View style={styles.galleryStrip}>
            <Text style={styles.galleryStripTitle}>फोटो गैलरी ({additionalImages.length + 1} चित्र)</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.galleryScroll}>
              <TouchableOpacity
                style={styles.galleryThumb}
                onPress={() => {
                  setActiveModalImage(imageUrl);
                  setImageModalVisible(true);
                }}
              >
                <Image source={{ uri: imageUrl }} style={styles.galleryImage} contentFit="cover" />
              </TouchableOpacity>
              {additionalImages.map((img, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.galleryThumb}
                  onPress={() => {
                    setActiveModalImage(getFullMediaUrl(img));
                    setImageModalVisible(true);
                  }}
                >
                  <Image source={{ uri: getFullMediaUrl(img) }} style={styles.galleryImage} contentFit="cover" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Listen to Article (Audio News Reader TTS) */}
        <TouchableOpacity style={styles.audioBar} onPress={toggleSpeech} activeOpacity={0.85}>
          <View style={styles.audioIconBox}>
            <Ionicons
              name={isPlayingAudio ? "pause" : "volume-high"}
              size={18}
              color={BrandColors.primary}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.audioTitle}>
              {isPlayingAudio ? "ऑडियो चल रहा है (Listening...)" : "खबर सुनें (Listen to Article)"}
            </Text>
            <Text style={styles.audioSubtitle}>हिंदी आवाज़ में सुनें पूरी रिपोर्ट</Text>
          </View>
          <Ionicons
            name={isPlayingAudio ? "stop-circle" : "play-circle"}
            size={26}
            color={BrandColors.primary}
          />
        </TouchableOpacity>

        {/* Reader Engagement Stats Bar */}
        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Ionicons name="eye-outline" size={16} color={BrandColors.textSecondary} />
            <Text style={styles.statText}>{formatMetricCount(viewsCount)} व्यूज</Text>
          </View>

          <View style={styles.statItem}>
            <Ionicons name="heart-outline" size={16} color={BrandColors.textSecondary} />
            <Text style={styles.statText}>{formatMetricCount(likesCount)} लाइक्स</Text>
          </View>

          <View style={styles.statItem}>
            <Ionicons name="share-social-outline" size={16} color={BrandColors.textSecondary} />
            <Text style={styles.statText}>{formatMetricCount(sharesCount)} शेयर्स</Text>
          </View>
        </View>

        {/* Lead / Short Summary */}
        {article.description ? (
          <View style={styles.leadBox}>
            <Text style={[styles.leadText, { fontSize: 16 * fontSizeMultiplier }]}>
              {article.description}
            </Text>
          </View>
        ) : null}

        {/* Main Article Body Text */}
        {article.content ? (
          <Text style={[styles.bodyText, { fontSize: 16 * fontSizeMultiplier }]}>
            {article.content}
          </Text>
        ) : null}

        {/* Rich Multi-Sections if published with rich layout */}
        {article.sections && article.sections.length > 0 && (
          <View style={styles.sectionsContainer}>
            {article.sections.map((sec, idx) => (
              <View key={idx} style={styles.sectionBlock}>
                {sec.heading ? (
                  <Text style={[styles.sectionHeading, { fontSize: 18 * fontSizeMultiplier }]}>
                    {sec.heading}
                  </Text>
                ) : null}
                {sec.image ? (
                  <Image
                    source={{ uri: getFullMediaUrl(sec.image) }}
                    style={styles.sectionImage}
                    contentFit="cover"
                  />
                ) : null}
                <Text style={[styles.sectionContent, { fontSize: 16 * fontSizeMultiplier }]}>
                  {sec.content}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Interactive Action Bar (Like, Save, WhatsApp Share) */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionBtn, isLiked && styles.likedBtn]}
            onPress={handleLike}
          >
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={18}
              color={isLiked ? "#DC2626" : BrandColors.charcoal}
            />
            <Text style={[styles.actionBtnText, isLiked && styles.likedText]}>
              {likesCount} लाइक
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, isBookmarked && styles.bookmarkedBtn]}
            onPress={handleToggleBookmark}
          >
            <Ionicons
              name={isBookmarked ? "bookmark" : "bookmark-outline"}
              size={18}
              color={isBookmarked ? BrandColors.primary : BrandColors.charcoal}
            />
            <Text style={[styles.actionBtnText, isBookmarked && styles.bookmarkedText]}>
              {isBookmarked ? "सहेजा गया" : "सेव करें"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.whatsappBtn]}
            onPress={handleShare}
          >
            <Ionicons name="share-social" size={18} color="#FFF" />
            <Text style={styles.whatsappBtnText}>शेयर करें</Text>
          </TouchableOpacity>
        </View>

        {/* Reader Comments Section */}
        <View style={styles.commentsContainer}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderBar} />
            <Text style={styles.sectionHeaderTitle}>पाठक प्रतिक्रिया ({comments.length})</Text>
          </View>

          {/* Comment Form */}
          <View style={styles.commentInputBox}>
            <TextInput
              style={styles.nameInput}
              placeholder="आपका नाम (Your Name)"
              placeholderTextColor={BrandColors.textMuted}
              value={commenterName}
              onChangeText={setCommenterName}
            />
            <TextInput
              style={styles.commentTextInput}
              placeholder="इस खबर पर अपनी राय लिखें..."
              placeholderTextColor={BrandColors.textMuted}
              value={commentText}
              onChangeText={setCommentText}
              multiline
            />
            <TouchableOpacity
              style={styles.submitCommentBtn}
              onPress={handlePostComment}
              disabled={submittingComment}
            >
              {submittingComment ? (
                <StarButtonLoader label="भेजा जा रहा है..." color="#FFF" />
              ) : (
                <>
                  <Text style={styles.submitCommentText}>प्रतिक्रिया भेजें</Text>
                  <Ionicons name="send" size={13} color="#FFF" />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Comments List */}
          {comments.map((comment, index) => (
            <View key={comment._id || index} style={styles.commentCard}>
              <View style={styles.commentHeader}>
                <View style={styles.commentAvatar}>
                  <Text style={styles.avatarLetter}>
                    {(comment.name || "P")[0].toUpperCase()}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.commentUser}>{comment.name || "पाठक"}</Text>
                  <Text style={styles.commentTime}>
                    {comment.createdAt ? formatTimeAgo(comment.createdAt) : "हाल ही में"}
                  </Text>
                </View>
              </View>
              <Text style={styles.commentBody}>{comment.text}</Text>
            </View>
          ))}
        </View>

        {/* Related News Recommendations */}
        {relatedNews.length > 0 && (
          <View style={styles.relatedContainer}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionHeaderBar} />
              <Text style={styles.sectionHeaderTitle}>संबंधित खबरें (RELATED STORIES)</Text>
            </View>
            {relatedNews.map((rel) => (
              <NewsCard key={rel._id} article={rel} variant="compact" />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Full-Screen Image Lightbox Modal */}
      <Modal
        visible={imageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setImageModalVisible(false)}
      >
        <SafeAreaView style={styles.imageModalContainer}>
          <TouchableOpacity
            style={styles.imageModalCloseBtn}
            onPress={() => setImageModalVisible(false)}
          >
            <Ionicons name="close" size={26} color="#FFF" />
          </TouchableOpacity>
          {activeModalImage && (
            <Image
              source={{ uri: activeModalImage }}
              style={styles.modalFullImage}
              contentFit="contain"
            />
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BrandColors.white,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: BrandColors.background,
    padding: 24,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: BrandColors.textSecondary,
    fontWeight: "600",
  },
  notFoundText: {
    fontSize: 16,
    fontWeight: "700",
    color: BrandColors.charcoal,
  },
  backBtn: {
    backgroundColor: BrandColors.primary,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 8,
  },
  backBtnText: {
    color: "#FFF",
    fontWeight: "700",
  },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.border,
    backgroundColor: BrandColors.white,
  },
  navBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  navBrand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  navBrandText: {
    fontSize: 16,
    fontWeight: "900",
    color: BrandColors.charcoal,
    letterSpacing: 0.5,
  },
  livePill: {
    backgroundColor: BrandColors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  livePillText: {
    color: "#FFF",
    fontSize: 9,
    fontWeight: "900",
  },
  navActions: {
    flexDirection: "row",
    gap: 8,
  },
  scrollContent: {
    paddingBottom: 60,
  },
  topMetaContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingTop: 14,
    gap: 8,
  },
  categoryPill: {
    backgroundColor: BrandColors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  pannaCategoryPill: {
    backgroundColor: "#059669",
  },
  categoryPillText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  breakingTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#B91C1C",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  breakingTagText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "800",
  },
  mainHeadline: {
    fontSize: 22,
    fontWeight: "900",
    color: BrandColors.charcoal,
    lineHeight: 31,
    paddingHorizontal: 14,
    paddingTop: 10,
    letterSpacing: -0.2,
  },
  bylineCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  bureauAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: BrandColors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  bylineInfo: {
    flex: 1,
  },
  bureauChiefRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  reporterName: {
    fontSize: 13,
    fontWeight: "800",
    color: BrandColors.charcoal,
  },
  publishDate: {
    fontSize: 11,
    color: BrandColors.textMuted,
    marginTop: 2,
  },
  imageBox: {
    width: "100%",
    height: 240,
    backgroundColor: "#0F172A",
    marginBottom: 12,
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  zoomHintPill: {
    position: "absolute",
    bottom: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  zoomHintText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "700",
  },
  galleryStrip: {
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  galleryStripTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: BrandColors.charcoal,
    marginBottom: 8,
  },
  galleryScroll: {
    gap: 8,
  },
  galleryThumb: {
    width: 80,
    height: 60,
    borderRadius: 6,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: BrandColors.border,
  },
  galleryImage: {
    width: "100%",
    height: "100%",
  },
  audioBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5F5",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 12,
    marginHorizontal: 14,
    marginBottom: 14,
    padding: 10,
    gap: 10,
  },
  audioIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },
  audioTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: BrandColors.primaryDark,
  },
  audioSubtitle: {
    fontSize: 11,
    color: BrandColors.textSecondary,
    marginTop: 1,
  },
  statsBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 10,
    marginHorizontal: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: BrandColors.borderLight,
    marginBottom: 14,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: 12,
    fontWeight: "600",
    color: BrandColors.textSecondary,
  },
  leadBox: {
    backgroundColor: "#F8FAFC",
    borderLeftWidth: 4,
    borderLeftColor: BrandColors.primary,
    padding: 12,
    marginHorizontal: 14,
    marginBottom: 14,
    borderRadius: 4,
  },
  leadText: {
    fontSize: 16,
    fontWeight: "600",
    color: BrandColors.charcoal,
    lineHeight: 25,
  },
  bodyText: {
    fontSize: 16,
    color: "#1E293B",
    lineHeight: 28,
    paddingHorizontal: 14,
    marginBottom: 16,
    letterSpacing: 0.1,
  },
  sectionsContainer: {
    paddingHorizontal: 14,
    gap: 16,
    marginBottom: 16,
  },
  sectionBlock: {
    gap: 8,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: "800",
    color: BrandColors.charcoal,
    lineHeight: 25,
  },
  sectionImage: {
    width: "100%",
    height: 195,
    borderRadius: 8,
  },
  sectionContent: {
    fontSize: 16,
    color: "#1E293B",
    lineHeight: 27,
  },
  actionRow: {
    flexDirection: "row",
    paddingHorizontal: 14,
    gap: 10,
    marginVertical: 14,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F5F9",
    paddingVertical: 11,
    borderRadius: 8,
    gap: 6,
  },
  likedBtn: {
    backgroundColor: "#FEE2E2",
  },
  bookmarkedBtn: {
    backgroundColor: "#FEF2F2",
  },
  whatsappBtn: {
    backgroundColor: BrandColors.primary,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: BrandColors.charcoal,
  },
  likedText: {
    color: "#DC2626",
  },
  bookmarkedText: {
    color: BrandColors.primary,
  },
  whatsappBtnText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FFF",
  },
  commentsContainer: {
    paddingHorizontal: 14,
    marginTop: 18,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionHeaderBar: {
    width: 4,
    height: 18,
    borderRadius: 2,
    backgroundColor: BrandColors.primary,
  },
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: BrandColors.charcoal,
    letterSpacing: 0.5,
  },
  commentInputBox: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: BrandColors.border,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    gap: 10,
  },
  nameInput: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: BrandColors.border,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: BrandColors.charcoal,
  },
  commentTextInput: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: BrandColors.border,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: BrandColors.charcoal,
    minHeight: 65,
    textAlignVertical: "top",
  },
  submitCommentBtn: {
    backgroundColor: BrandColors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 6,
    gap: 6,
  },
  submitCommentText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "800",
  },
  commentCard: {
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BrandColors.borderLight,
    marginBottom: 10,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  commentAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: BrandColors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLetter: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "800",
  },
  commentUser: {
    fontSize: 12,
    fontWeight: "700",
    color: BrandColors.charcoal,
  },
  commentTime: {
    fontSize: 10,
    color: BrandColors.textMuted,
  },
  commentBody: {
    fontSize: 13,
    color: "#374151",
    lineHeight: 18,
  },
  relatedContainer: {
    marginTop: 20,
  },
  imageModalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  imageModalCloseBtn: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 999,
    padding: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
  },
  modalFullImage: {
    width: width,
    height: height * 0.75,
  },
});