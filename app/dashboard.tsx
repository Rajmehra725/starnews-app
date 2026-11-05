import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Platform,
  StatusBar,
  RefreshControl,
  Switch,
  useWindowDimensions,
} from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { BrandColors, Shadows } from "@/constants/theme";
import { StarPageLoader, StarButtonLoader } from "@/components/StarBrandLoader";
import {
  apiClient,
  API_BASE_URL,
  getFullMediaUrl,
  formatTimeAgo,
  formatMetricCount,
  NewsArticle,
  BreakingItem,
  BannerItem,
  EpaperItem,
  GalleryAlbum,
  NotificationItem,
  SubmittedNewsItem,
  IdCardItem,
  YouTubeItem,
  AdItem,
  ContactItem,
} from "@/_services/api";

type AdminTab =
  | "overview"
  | "news"
  | "breaking"
  | "categories"
  | "media"
  | "analytics"
  | "logs"
  | "banners"
  | "epaper"
  | "gallery"
  | "citizen"
  | "notifications"
  | "idcards"
  | "youtube"
  | "ads"
  | "comments"
  | "contacts"
  | "settings";

export default function AdminDashboard() {
  const { width, height } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;
  const isMobile = width < 768;
  const isSmallMobile = width < 390;

  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(isDesktop);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Auto-sync sidebar when transitioning across desktop breakpoint
  useEffect(() => {
    setSidebarOpen(isDesktop);
  }, [isDesktop]);

  const handleSelectTab = useCallback(
    (tab: AdminTab) => {
      setActiveTab(tab);
      if (!isDesktop) {
        setSidebarOpen(false);
      }
    },
    [isDesktop]
  );

  // Data States
  const [newsList, setNewsList] = useState<NewsArticle[]>([]);
  const [breakingList, setBreakingList] = useState<BreakingItem[]>([]);
  const [bannerList, setBannerList] = useState<BannerItem[]>([]);
  const [epaperList, setEpaperList] = useState<EpaperItem[]>([]);
  const [galleryList, setGalleryList] = useState<GalleryAlbum[]>([]);
  const [citizenNews, setCitizenNews] = useState<SubmittedNewsItem[]>([]);
  const [notificationList, setNotificationList] = useState<NotificationItem[]>([]);
  const [idCardList, setIdCardList] = useState<IdCardItem[]>([]);
  const [youtubeList, setYoutubeList] = useState<YouTubeItem[]>([]);
  const [adsList, setAdsList] = useState<AdItem[]>([]);
  const [contactList, setContactList] = useState<ContactItem[]>([]);

  // Categories State
  const [categoriesList, setCategoriesList] = useState<{ id: string; name: string; hindi: string; isActive: boolean; order: number }[]>([
    { id: "1", name: "Madhya Pradesh", hindi: "मध्य प्रदेश", isActive: true, order: 1 },
    { id: "2", name: "Panna", hindi: "पन्ना", isActive: true, order: 2 },
    { id: "3", name: "Satna", hindi: "सतना", isActive: true, order: 3 },
    { id: "4", name: "Chhatarpur", hindi: "छतरपुर", isActive: true, order: 4 },
    { id: "5", name: "Rewa", hindi: "रीवा", isActive: true, order: 5 },
    { id: "6", name: "Bundelkhand", hindi: "बुंदेलखंड", isActive: true, order: 6 },
    { id: "7", name: "Crime", hindi: "अपराध (Crime)", isActive: true, order: 7 },
    { id: "8", name: "Politics", hindi: "राजनीति (Politics)", isActive: true, order: 8 },
    { id: "9", name: "Education", hindi: "शिक्षा (Education)", isActive: true, order: 9 },
    { id: "10", name: "Sports", hindi: "खेल (Sports)", isActive: true, order: 10 },
  ]);
  const [newCatName, setNewCatName] = useState("");
  const [newCatHindi, setNewCatHindi] = useState("");
  const [catModalVisible, setCatModalVisible] = useState(false);

  // Media Library State
  const [mediaSearchQuery, setMediaSearchQuery] = useState("");
  const [mediaTypeFilter, setMediaTypeFilter] = useState<"all" | "news" | "banner" | "gallery" | "epaper" | "ads">("all");
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | null>(null);

  // Activity Logs State
  const [activityLogs, setActivityLogs] = useState<{ id: string; action: string; details: string; timestamp: string; actor: string }[]>([]);
  const [logFilter, setLogFilter] = useState<"all" | "NEWS" | "BANNER" | "BREAKING" | "BROADCAST" | "EPAPER">("all");

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");

  // News Modal States
  const [newsModalVisible, setNewsModalVisible] = useState(false);
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [newsTitle, setNewsTitle] = useState("");
  const [newsDescription, setNewsDescription] = useState("");
  const [newsCategory, setNewsCategory] = useState("Madhya Pradesh");
  const [newsContent, setNewsContent] = useState("");
  const [newsStatus, setNewsStatus] = useState<"published" | "draft">("published");
  const [newsFeaturedImage, setNewsFeaturedImage] = useState<string | null>(null);
  const [submittingNews, setSubmittingNews] = useState(false);

  // Breaking Modal States
  const [breakingModalVisible, setBreakingModalVisible] = useState(false);
  const [breakingText, setBreakingText] = useState("");
  const [breakingPriority, setBreakingPriority] = useState("1");
  const [editingBreakingId, setEditingBreakingId] = useState<string | null>(null);

  // Push Notification Composer States
  const [notifModalVisible, setNotifModalVisible] = useState(false);
  const [notifTitle, setNotifTitle] = useState("");
  const [notifMessage, setNotifMessage] = useState("");
  const [notifType, setNotifType] = useState("breaking");
  const [notifNewsId, setNotifNewsId] = useState("");
  const [sendingNotif, setSendingNotif] = useState(false);

  // Citizen News Filter
  const [citizenFilter, setCitizenFilter] = useState<"all" | "pending" | "approved">("all");

  // Banner Modal States
  const [bannerModalVisible, setBannerModalVisible] = useState(false);
  const [bannerImageUri, setBannerImageUri] = useState<string | null>(null);
  const [submittingBanner, setSubmittingBanner] = useState(false);

  // Epaper Modal States
  const [epaperModalVisible, setEpaperModalVisible] = useState(false);
  const [epaperTitle, setEpaperTitle] = useState("");
  const [epaperPublishDate, setEpaperPublishDate] = useState(new Date().toISOString().split("T")[0]);
  const [epaperPages, setEpaperPages] = useState<string[]>([]);
  const [submittingEpaper, setSubmittingEpaper] = useState(false);

  // Gallery Modal States
  const [galleryModalVisible, setGalleryModalVisible] = useState(false);
  const [galleryTitle, setGalleryTitle] = useState("");
  const [galleryDescription, setGalleryDescription] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [submittingGallery, setSubmittingGallery] = useState(false);

  // YouTube Modal States
  const [youtubeModalVisible, setYoutubeModalVisible] = useState(false);
  const [youtubeChannelName, setYoutubeChannelName] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [submittingYoutube, setSubmittingYoutube] = useState(false);

  // ID Card Modal States
  const [idCardModalVisible, setIdCardModalVisible] = useState(false);
  const [idCardName, setIdCardName] = useState("");
  const [idCardDesignation, setIdCardDesignation] = useState("संवाददाता (Reporter)");
  const [idCardOrg, setIdCardOrg] = useState("Star News Networks");
  const [idCardPhoto, setIdCardPhoto] = useState<string | null>(null);
  const [submittingIdCard, setSubmittingIdCard] = useState(false);

  // In-Feed Ad Modal States
  const [adModalVisible, setAdModalVisible] = useState(false);
  const [adTitle, setAdTitle] = useState("");
  const [adPosition, setAdPosition] = useState("top");
  const [adImage, setAdImage] = useState<string | null>(null);
  const [submittingAd, setSubmittingAd] = useState(false);

  // Fetch All Admin Data
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [
        newsRes,
        breakingRes,
        bannerRes,
        epaperRes,
        galleryRes,
        citizenRes,
        notifRes,
        idCardRes,
        ytRes,
        adsRes,
        contactRes,
      ] = await Promise.allSettled([
        apiClient.get("/api/news"),
        apiClient.get("/api/breaking"),
        apiClient.get("/api/banners"),
        apiClient.get("/api/epaper"),
        apiClient.get("/api/gallery"),
        apiClient.get("/api/newsSubmit"),
        apiClient.get("/api/notification"),
        apiClient.get("/api/idcards"),
        apiClient.get("/api/youtube/all"),
        apiClient.get("/api/ads"),
        apiClient.get("/api/contact"),
      ]);

      if (newsRes.status === "fulfilled" && Array.isArray(newsRes.value.data)) {
        setNewsList(newsRes.value.data);
      }
      if (breakingRes.status === "fulfilled" && Array.isArray(breakingRes.value.data)) {
        setBreakingList(breakingRes.value.data);
      }
      if (bannerRes.status === "fulfilled" && Array.isArray(bannerRes.value.data)) {
        setBannerList(bannerRes.value.data);
      }
      if (epaperRes.status === "fulfilled") {
        const ep = epaperRes.value.data?.epapers || epaperRes.value.data;
        if (Array.isArray(ep)) setEpaperList(ep);
      }
      if (galleryRes.status === "fulfilled") {
        const gal = galleryRes.value.data?.albums || galleryRes.value.data;
        if (Array.isArray(gal)) setGalleryList(gal);
      }
      if (citizenRes.status === "fulfilled" && Array.isArray(citizenRes.value.data)) {
        setCitizenNews(citizenRes.value.data);
      }
      if (notifRes.status === "fulfilled") {
        const notifs = Array.isArray(notifRes.value.data)
          ? notifRes.value.data
          : notifRes.value.data?.data || [];
        setNotificationList(notifs);
      }
      if (idCardRes.status === "fulfilled" && Array.isArray(idCardRes.value.data)) {
        setIdCardList(idCardRes.value.data);
      }
      if (ytRes.status === "fulfilled" && Array.isArray(ytRes.value.data)) {
        setYoutubeList(ytRes.value.data);
      }
      if (adsRes.status === "fulfilled" && Array.isArray(adsRes.value.data)) {
        setAdsList(adsRes.value.data);
      }
      if (contactRes.status === "fulfilled" && Array.isArray(contactRes.value.data)) {
        setContactList(contactRes.value.data);
      }
    } catch (err) {
      console.log("Admin Data Fetch Error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const handleLogout = async () => {
    Alert.alert("लॉगआउट", "क्या आप वाकई न्यूज़रूम पोर्टल से बाहर निकलना चाहते हैं?", [
      { text: "रद्द करें", style: "cancel" },
      {
        text: "लॉगआउट करें",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("starnews_admin_session");
          router.replace("/login");
        },
      },
    ]);
  };

  /* ================= IMAGE PICKER ================= */
  const pickFeaturedImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setNewsFeaturedImage(result.assets[0].uri);
      }
    } catch (e) {
      Alert.alert("त्रुटि", "छवि चयन में असमर्थ।");
    }
  };

  /* ================= NEWS MANAGEMENT ACTIONS ================= */
  const handleOpenCreateNews = () => {
    setEditingNewsId(null);
    setNewsTitle("");
    setNewsDescription("");
    setNewsCategory("Madhya Pradesh");
    setNewsContent("");
    setNewsStatus("published");
    setNewsFeaturedImage(null);
    setNewsModalVisible(true);
  };

  const handleOpenEditNews = (item: NewsArticle) => {
    setEditingNewsId(item._id);
    setNewsTitle(item.title);
    setNewsDescription(item.description || "");
    setNewsCategory(item.category || "Madhya Pradesh");
    setNewsContent(item.content || "");
    setNewsStatus(item.status === "draft" ? "draft" : "published");
    setNewsFeaturedImage(item.featuredImage ? getFullMediaUrl(item.featuredImage) : null);
    setNewsModalVisible(true);
  };

  const handleSaveNews = async () => {
    if (!newsTitle.trim() || !newsCategory.trim()) {
      Alert.alert("अनिवार्य फ़ील्ड", "शीर्षक (Title) और श्रेणी (Category) अनिवार्य हैं।");
      return;
    }

    try {
      setSubmittingNews(true);
      const formData = new FormData();
      formData.append("title", newsTitle.trim());
      formData.append("description", newsDescription.trim());
      formData.append("category", newsCategory.trim());
      formData.append("content", newsContent.trim());
      formData.append("status", newsStatus);

      if (newsFeaturedImage && !newsFeaturedImage.startsWith("http")) {
        const filename = newsFeaturedImage.split("/").pop() || "photo.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;
        formData.append("featuredImage", {
          uri: newsFeaturedImage,
          name: filename,
          type,
        } as any);
      }

      if (editingNewsId) {
        await apiClient.put(`/api/news/${editingNewsId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Alert.alert("सफलता", "समाचार सफलतापूर्वक अपडेट किया गया।");
      } else {
        await apiClient.post("/api/news", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (newsStatus === "published") {
          Alert.alert(
            "प्रकाशित एवं नोटिफिकेशन प्रेषित! 🎉",
            "समाचार प्रकाशित कर दिया गया है एवं सभी पंजीकृत उपयोगकर्ता उपकरणों को स्वतः पुश नोटिफिकेशन भेजा गया है।"
          );
        } else {
          Alert.alert("ड्राफ्ट सहेजा गया 📝", "समाचार को ड्राफ्ट के रूप में सहेज लिया गया है।");
        }
      }

      setNewsModalVisible(false);
      loadDashboardData();
    } catch (err: any) {
      console.log("Save News Error:", err?.response?.data || err?.message);
      Alert.alert("त्रुटि", "समाचार सहेजने में विफल। कृपया पुनः प्रयास करें।");
    } finally {
      setSubmittingNews(false);
    }
  };

  const handleDeleteNews = (id: string, title: string) => {
    Alert.alert("समाचार हटाएं", `क्या आप वाकई "${title}" को हटाना चाहते हैं?`, [
      { text: "रद्द करें", style: "cancel" },
      {
        text: "हटाएं",
        style: "destructive",
        onPress: async () => {
          try {
            await apiClient.delete(`/api/news/${id}`);
            setNewsList((prev) => prev.filter((n) => n._id !== id));
            Alert.alert("सफलता", "समाचार हटा दिया गया।");
          } catch (e) {
            Alert.alert("त्रुटि", "समाचार हटाने में विफल।");
          }
        },
      },
    ]);
  };

  /* ================= BREAKING NEWS ACTIONS ================= */
  const handleSaveBreaking = async () => {
    if (!breakingText.trim()) {
      Alert.alert("त्रुटि", "कृपया ब्रेकिंग न्यूज़ टेक्स्ट लिखें।");
      return;
    }

    try {
      if (editingBreakingId) {
        await apiClient.put(`/api/breaking/${editingBreakingId}`, {
          text: breakingText.trim(),
          priority: parseInt(breakingPriority, 10) || 1,
        });
        Alert.alert("सफलता", "ब्रेकिंग न्यूज़ अपडेट हो गई।");
      } else {
        await apiClient.post("/api/breaking", {
          text: breakingText.trim(),
          priority: parseInt(breakingPriority, 10) || 1,
          isActive: true,
        });
        Alert.alert("सफलता", "नई ब्रेकिंग न्यूज़ जोड़ दी गई है।");
      }

      setBreakingModalVisible(false);
      setBreakingText("");
      setEditingBreakingId(null);
      loadDashboardData();
    } catch (e) {
      Alert.alert("त्रुटि", "कार्रवाई विफल हुई।");
    }
  };

  const handleToggleBreaking = async (id: string) => {
    try {
      await apiClient.patch(`/api/breaking/toggle/${id}`);
      setBreakingList((prev) =>
        prev.map((b) => (b._id === id ? { ...b, isActive: !b.isActive } : b))
      );
    } catch (e) {
      Alert.alert("त्रुटि", "टॉगल विफल।");
    }
  };

  const handleDeleteBreaking = (id: string) => {
    Alert.alert("ब्रेकिंग न्यूज़ हटाएं", "क्या आप इसे हटाना चाहते हैं?", [
      { text: "रद्द करें", style: "cancel" },
      {
        text: "हटाएं",
        style: "destructive",
        onPress: async () => {
          try {
            await apiClient.delete(`/api/breaking/${id}`);
            setBreakingList((prev) => prev.filter((b) => b._id !== id));
          } catch (e) {
            Alert.alert("त्रुटि", "हटाने में विफल।");
          }
        },
      },
    ]);
  };

  /* ================= PUSH NOTIFICATION DISPATCH ================= */
  const handleSendNotification = async () => {
    if (!notifTitle.trim() || !notifMessage.trim()) {
      Alert.alert("अनिवार्य", "शीर्षक और संदेश अनिवार्य हैं।");
      return;
    }

    try {
      setSendingNotif(true);
      await apiClient.post("/api/notification", {
        title: notifTitle.trim(),
        message: notifMessage.trim(),
        type: notifType,
        newsId: notifNewsId.trim() || undefined,
      });

      Alert.alert("सफलता", "पुश नोटिफिकेशन सफलतापूर्वक भेज दिया गया!");
      setNotifModalVisible(false);
      setNotifTitle("");
      setNotifMessage("");
      setNotifNewsId("");
      loadDashboardData();
    } catch (e) {
      Alert.alert("त्रुटि", "नोटिफिकेशन भेजने में विफल।");
    } finally {
      setSendingNotif(false);
    }
  };

  /* ================= CITIZEN SUBMIT ACTIONS ================= */
  const handleApproveCitizen = async (id: string) => {
    try {
      await apiClient.put(`/api/newsSubmit/approve/${id}`);
      setCitizenNews((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status: "approved" } : c))
      );
      Alert.alert("सफलता", "संवाददाता खबर स्वीकृत की गई।");
    } catch (e) {
      Alert.alert("त्रुटि", "स्वीकृति विफल।");
    }
  };

  const handleRejectCitizen = async (id: string) => {
    try {
      await apiClient.put(`/api/newsSubmit/reject/${id}`);
      setCitizenNews((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status: "rejected" } : c))
      );
      Alert.alert("अस्वीकृत", "संवाददाता खबर अस्वीकृत कर दी गई।");
    } catch (e) {
      Alert.alert("त्रुटि", "अस्वीकृति विफल।");
    }
  };

  const handleDeleteCitizen = async (id: string) => {
    try {
      await apiClient.delete(`/api/newsSubmit/${id}`);
      setCitizenNews((prev) => prev.filter((c) => c._id !== id));
    } catch (e) {
      Alert.alert("त्रुटि", "हटाने में विफल।");
    }
  };

  /* ================= BANNER & EPAPER & GALLERY ACTIONS ================= */
  const handleDeleteBanner = async (id: string) => {
    Alert.alert("बैनर हटाएं", "क्या आप इस बैनर को हटाना चाहते हैं?", [
      { text: "रद्द करें", style: "cancel" },
      {
        text: "हटाएं",
        style: "destructive",
        onPress: async () => {
          try {
            await apiClient.delete(`/api/banners/${id}`);
            setBannerList((prev) => prev.filter((b) => b._id !== id));
          } catch (e) {
            Alert.alert("त्रुटि", "हटाने में विफल।");
          }
        },
      },
    ]);
  };

  const handleDeleteEpaper = async (id: string) => {
    Alert.alert("ई-पेपर हटाएं", "क्या आप इस संस्करण को हटाना चाहते हैं?", [
      { text: "रद्द करें", style: "cancel" },
      {
        text: "हटाएं",
        style: "destructive",
        onPress: async () => {
          try {
            await apiClient.delete(`/api/epaper/${id}`);
            setEpaperList((prev) => prev.filter((e) => e._id !== id));
          } catch (e) {
            Alert.alert("त्रुटि", "हटाने में विफल।");
          }
        },
      },
    ]);
  };

  const handleDeleteGallery = async (id: string) => {
    Alert.alert("एल्बम हटाएं", "क्या आप इस गैलरी एल्बम को हटाना चाहते हैं?", [
      { text: "रद्द करें", style: "cancel" },
      {
        text: "हटाएं",
        style: "destructive",
        onPress: async () => {
          try {
            await apiClient.delete(`/api/gallery/${id}`);
            setGalleryList((prev) => prev.filter((g) => g._id !== id));
          } catch (e) {
            Alert.alert("त्रुटि", "हटाने में विफल।");
          }
        },
      },
    ]);
  };

  const handleDeleteIdCard = async (id: string) => {
    try {
      await apiClient.delete(`/api/idcards/${id}`);
      setIdCardList((prev) => prev.filter((c) => c._id !== id));
    } catch (e) {
      Alert.alert("त्रुटि", "हटाने में विफल।");
    }
  };

  const handleDeleteYoutube = async (id: string) => {
    try {
      await apiClient.delete(`/api/youtube/delete/${id}`);
      setYoutubeList((prev) => prev.filter((y) => y._id !== id));
    } catch (e) {
      Alert.alert("त्रुटि", "हटाने में विफल।");
    }
  };

  const handleDeleteContact = async (id: string) => {
    try {
      await apiClient.delete(`/api/contact/${id}`);
      setContactList((prev) => prev.filter((c) => c._id !== id));
    } catch (e) {
      Alert.alert("त्रुटि", "हटाने में विफल।");
    }
  };

  /* ================= BANNER CREATION ================= */
  const pickBannerImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.85,
      });
      if (!result.canceled && result.assets?.[0]) {
        setBannerImageUri(result.assets[0].uri);
      }
    } catch (e) {
      Alert.alert("त्रुटि", "छवि चयन में असमर्थ।");
    }
  };

  const handleSaveBanner = async () => {
    if (!bannerImageUri) {
      Alert.alert("अनिवार्य", "कृपया बैनर छवि का चयन करें।");
      return;
    }
    try {
      setSubmittingBanner(true);
      const formData = new FormData();
      const filename = bannerImageUri.split("/").pop() || "banner.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;
      formData.append("image", { uri: bannerImageUri, name: filename, type } as any);

      await apiClient.post("/api/banners", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Alert.alert("सफलता", "नया बैनर सफलतापूर्वक अपलोड किया गया!");
      setBannerModalVisible(false);
      setBannerImageUri(null);
      loadDashboardData();
    } catch (e) {
      Alert.alert("त्रुटि", "बैनर अपलोड विफल रहा।");
    } finally {
      setSubmittingBanner(false);
    }
  };

  /* ================= E-PAPER CREATION ================= */
  const pickEpaperPages = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.85,
      });
      if (!result.canceled && result.assets) {
        const uris = result.assets.map((a) => a.uri);
        setEpaperPages((prev) => [...prev, ...uris]);
      }
    } catch (e) {
      Alert.alert("त्रुटि", "पृष्ठ चयन में असमर्थ।");
    }
  };

  const handleSaveEpaper = async () => {
    if (!epaperTitle.trim() || epaperPages.length === 0) {
      Alert.alert("अनिवार्य", "संस्करण शीर्षक और कम से कम 1 पृष्ठ छवि आवश्यक है।");
      return;
    }
    try {
      setSubmittingEpaper(true);
      const formData = new FormData();
      formData.append("title", epaperTitle.trim());
      formData.append("publishDate", epaperPublishDate);

      epaperPages.forEach((uri, idx) => {
        const filename = uri.split("/").pop() || `page_${idx + 1}.jpg`;
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;
        formData.append("pages", { uri, name: filename, type } as any);
      });

      await apiClient.post("/api/epaper", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Alert.alert("सफलता", "ई-पेपर संस्करण सफलतापूर्वक प्रकाशित किया गया!");
      setEpaperModalVisible(false);
      setEpaperTitle("");
      setEpaperPages([]);
      loadDashboardData();
    } catch (e) {
      Alert.alert("त्रुटि", "ई-पेपर प्रकाशन विफल रहा।");
    } finally {
      setSubmittingEpaper(false);
    }
  };

  /* ================= GALLERY ALBUM CREATION ================= */
  const pickGalleryImages = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.85,
      });
      if (!result.canceled && result.assets) {
        const uris = result.assets.map((a) => a.uri);
        setGalleryImages((prev) => [...prev, ...uris]);
      }
    } catch (e) {
      Alert.alert("त्रुटि", "तस्वीरें चयन में असमर्थ।");
    }
  };

  const handleSaveGallery = async () => {
    if (!galleryTitle.trim() || galleryImages.length === 0) {
      Alert.alert("अनिवार्य", "एल्बम का नाम और कम से कम 1 फ़ोटो आवश्यक है।");
      return;
    }
    try {
      setSubmittingGallery(true);
      const formData = new FormData();
      formData.append("title", galleryTitle.trim());
      formData.append("description", galleryDescription.trim());

      galleryImages.forEach((uri, idx) => {
        const filename = uri.split("/").pop() || `photo_${idx + 1}.jpg`;
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;
        formData.append("images", { uri, name: filename, type } as any);
      });

      await apiClient.post("/api/gallery", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Alert.alert("सफलता", "फोटो एल्बम सफलतापूर्वक तैयार किया गया!");
      setGalleryModalVisible(false);
      setGalleryTitle("");
      setGalleryDescription("");
      setGalleryImages([]);
      loadDashboardData();
    } catch (e) {
      Alert.alert("त्रुटि", "एल्बम अपलोड विफल रहा।");
    } finally {
      setSubmittingGallery(false);
    }
  };

  /* ================= YOUTUBE VIDEO ADDITION ================= */
  const handleSaveYoutube = async () => {
    if (!youtubeChannelName.trim() || !youtubeLink.trim()) {
      Alert.alert("अनिवार्य", "चैनल/शीर्षक और यूट्यूब लिंक अनिवार्य हैं।");
      return;
    }
    try {
      setSubmittingYoutube(true);
      await apiClient.post("/api/youtube/add", {
        channelName: youtubeChannelName.trim(),
        link: youtubeLink.trim(),
      });
      Alert.alert("सफलता", "यूट्यूब लिंक सफलतापूर्वक जोड़ा गया!");
      setYoutubeModalVisible(false);
      setYoutubeChannelName("");
      setYoutubeLink("");
      loadDashboardData();
    } catch (e) {
      Alert.alert("त्रुटि", "यूट्यूब लिंक जोड़ने में विफल।");
    } finally {
      setSubmittingYoutube(false);
    }
  };

  /* ================= PRESS ID CARD CREATION ================= */
  const pickIdCardPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.85,
      });
      if (!result.canceled && result.assets?.[0]) {
        setIdCardPhoto(result.assets[0].uri);
      }
    } catch (e) {
      Alert.alert("त्रुटि", "तस्वीर चयन में असमर्थ।");
    }
  };

  const handleSaveIdCard = async () => {
    if (!idCardName.trim() || !idCardDesignation.trim()) {
      Alert.alert("अनिवार्य", "संवाददाता का नाम और पद अनिवार्य हैं।");
      return;
    }
    try {
      setSubmittingIdCard(true);
      const formData = new FormData();
      formData.append("name", idCardName.trim());
      formData.append("designation", idCardDesignation.trim());
      formData.append("organization", idCardOrg.trim() || "Star News Networks");

      if (idCardPhoto) {
        const filename = idCardPhoto.split("/").pop() || "id_photo.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;
        formData.append("photo", { uri: idCardPhoto, name: filename, type } as any);
      }

      await apiClient.post("/api/idcards", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Alert.alert("सफलता", "प्रेस आईडी कार्ड सफलतापूर्वक जारी किया गया!");
      setIdCardModalVisible(false);
      setIdCardName("");
      setIdCardPhoto(null);
      loadDashboardData();
    } catch (e) {
      Alert.alert("त्रुटि", "आईडी कार्ड जारी करने में विफल।");
    } finally {
      setSubmittingIdCard(false);
    }
  };

  /* ================= IN-FEED ADS CRUD ================= */
  const pickAdImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.85,
      });
      if (!result.canceled && result.assets?.[0]) {
        setAdImage(result.assets[0].uri);
      }
    } catch (e) {
      Alert.alert("त्रुटि", "विज्ञापन छवि चयन में असमर्थ।");
    }
  };

  const handleSaveAd = async () => {
    if (!adTitle.trim()) {
      Alert.alert("अनिवार्य", "विज्ञापन शीर्षक अनिवार्य है।");
      return;
    }
    try {
      setSubmittingAd(true);
      const formData = new FormData();
      formData.append("title", adTitle.trim());
      formData.append("position", adPosition);
      formData.append("isActive", "true");

      if (adImage) {
        const filename = adImage.split("/").pop() || "ad.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;
        formData.append("image", { uri: adImage, name: filename, type } as any);
      }

      await apiClient.post("/api/ads", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Alert.alert("सफलता", "विज्ञापन सफलतापूर्वक सहेजा गया!");
      setAdModalVisible(false);
      setAdTitle("");
      setAdImage(null);
      loadDashboardData();
    } catch (e) {
      Alert.alert("त्रुटि", "विज्ञापन सहेजने में विफल।");
    } finally {
      setSubmittingAd(false);
    }
  };

  const handleToggleAd = async (id: string) => {
    try {
      await apiClient.patch(`/api/ads/toggle/${id}`);
      setAdsList((prev) =>
        prev.map((a) => (a._id === id ? { ...a, isActive: !a.isActive } : a))
      );
    } catch (e) {
      Alert.alert("त्रुटि", "विज्ञापन स्थिति बदलने में विफल।");
    }
  };

  const handleDeleteAd = async (id: string) => {
    Alert.alert("विज्ञापन हटाएं", "क्या आप इस विज्ञापन को हटाना चाहते हैं?", [
      { text: "रद्द करें", style: "cancel" },
      {
        text: "हटाएं",
        style: "destructive",
        onPress: async () => {
          try {
            await apiClient.delete(`/api/ads/${id}`);
            setAdsList((prev) => prev.filter((a) => a._id !== id));
          } catch (e) {
            Alert.alert("त्रुटि", "हटाने में विफल।");
          }
        },
      },
    ]);
  };

  /* ================= FILTERED NEWS LIST ================= */
  const filteredNewsList = useMemo(() => {
    return newsList.filter((n) => {
      const matchesSearch = searchQuery.trim()
        ? n.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.category?.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "published"
          ? n.status === "published" || n.status === "publish"
          : n.status === "draft";
      return matchesSearch && matchesStatus;
    });
  }, [newsList, searchQuery, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const totalNews = newsList.length;
    const publishedNews = newsList.filter(
      (n) => n.status === "published" || n.status === "publish"
    ).length;
    const draftNews = newsList.filter((n) => n.status === "draft").length;
    const totalViews = newsList.reduce((acc, curr) => acc + (curr.views || 0), 0);
    const totalShares = newsList.reduce((acc, curr) => acc + (curr.shares || 0), 0);
    const activeBreaking = breakingList.filter((b) => b.isActive).length;
    const pendingCitizen = citizenNews.filter((c) => c.status === "pending").length;

    return {
      totalNews,
      publishedNews,
      draftNews,
      totalViews,
      totalShares,
      activeBreaking,
      pendingCitizen,
      bannersCount: bannerList.length,
      epapersCount: epaperList.length,
      galleryCount: galleryList.length,
    };
  }, [newsList, breakingList, citizenNews, bannerList, epaperList, galleryList]);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor="#09090B" />

      {/* TOP CMS NAVBAR */}
      <View style={styles.topNav}>
        <View style={styles.topNavLeft}>
          <TouchableOpacity
            style={styles.menuToggle}
            onPress={() => setSidebarOpen(!sidebarOpen)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="menu" size={24} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.navBrandBlock}>
            <View style={[styles.navLogo, isSmallMobile && { width: 28, height: 28 }]}>
              <MaterialCommunityIcons name="broadcast" size={isSmallMobile ? 15 : 18} color="#FFF" />
            </View>
            <View>
              <Text style={[styles.navBrandText, isSmallMobile && { fontSize: 11 }]}>
                STAR NEWS NETWORKS
              </Text>
              {!isSmallMobile && (
                <Text style={styles.navSubBrand}>NEWSROOM CMS CONTROL</Text>
              )}
            </View>
          </View>
        </View>

        <View style={[styles.topNavRight, isSmallMobile && { gap: 6 }]}>
          {!isMobile ? (
            <View style={styles.liveDeskPill}>
              <View style={styles.liveGreenDot} />
              <Text style={styles.liveDeskText}>DESK LIVE 24×7</Text>
            </View>
          ) : !isSmallMobile ? (
            <View style={[styles.liveDeskPill, { paddingHorizontal: 6, paddingVertical: 3 }]}>
              <View style={styles.liveGreenDot} />
              <Text style={[styles.liveDeskText, { fontSize: 8 }]}>LIVE</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.quickAddNewsBtn, isSmallMobile && { paddingHorizontal: 8 }]}
            onPress={handleOpenCreateNews}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="add-circle" size={16} color="#FFF" />
            {!isSmallMobile && <Text style={styles.quickAddNewsText}>खबर लिखें</Text>}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.refreshIconBtn}
            onPress={onRefresh}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="refresh" size={18} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.exitBtn}
            onPress={handleLogout}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="log-out-outline" size={19} color="#FCA5A5" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.mainLayout}>
        {/* MOBILE/TABLET DRAWER BACKDROP */}
        {!isDesktop && sidebarOpen && (
          <TouchableOpacity
            style={styles.drawerBackdrop}
            activeOpacity={1}
            onPress={() => setSidebarOpen(false)}
          />
        )}

        {/* SIDEBAR NAVIGATION */}
        {sidebarOpen && (
          <View
            style={[
              styles.sidebar,
              !isDesktop && styles.sidebarDrawer,
              !isDesktop && { width: Math.min(width * 0.82, 280) },
            ]}
          >
            {!isDesktop && (
              <View style={styles.drawerHeader}>
                <View style={styles.drawerHeaderBrand}>
                  <View style={styles.navLogo}>
                    <MaterialCommunityIcons name="broadcast" size={16} color="#FFF" />
                  </View>
                  <Text style={styles.drawerHeaderTitle}>स्टार न्यूज़ नेविगेशन</Text>
                </View>
                <TouchableOpacity
                  style={styles.drawerCloseBtn}
                  onPress={() => setSidebarOpen(false)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="close" size={22} color="#FFF" />
                </TouchableOpacity>
              </View>
            )}

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sidebarScroll}>
              <View style={styles.sidebarSectionLabel}>
                <Text style={styles.sidebarLabelText}>संपादकीय डेस्क (EDITORIAL)</Text>
              </View>

              <SidebarItem
                icon="grid-outline"
                label="डैशबोर्ड (Overview)"
                active={activeTab === "overview"}
                onPress={() => handleSelectTab("overview")}
              />

              <SidebarItem
                icon="newspaper-outline"
                label="समाचार प्रबंधन (News)"
                badge={String(stats.totalNews)}
                active={activeTab === "news"}
                onPress={() => handleSelectTab("news")}
              />

              <SidebarItem
                icon="flash-outline"
                label="ब्रेकिंग न्यूज़ (Breaking)"
                badge={String(stats.activeBreaking)}
                badgeColor={BrandColors.primary}
                active={activeTab === "breaking"}
                onPress={() => handleSelectTab("breaking")}
              />

              <SidebarItem
                icon="people-outline"
                label="नागरिक रिपोर्ट (Citizen)"
                badge={stats.pendingCitizen > 0 ? String(stats.pendingCitizen) : undefined}
                badgeColor="#EAB308"
                active={activeTab === "citizen"}
                onPress={() => handleSelectTab("citizen")}
              />

              <View style={styles.sidebarSectionLabel}>
                <Text style={styles.sidebarLabelText}>मीडिया एवं प्रचार (MEDIA & ADS)</Text>
              </View>

              <SidebarItem
                icon="newspaper-outline"
                label="ई-पेपर संस्करण (E-Paper)"
                badge={String(stats.epapersCount)}
                active={activeTab === "epaper"}
                onPress={() => handleSelectTab("epaper")}
              />

              <SidebarItem
                icon="images-outline"
                label="फोटो गैलरी (Albums)"
                badge={String(stats.galleryCount)}
                active={activeTab === "gallery"}
                onPress={() => handleSelectTab("gallery")}
              />

              <SidebarItem
                icon="megaphone-outline"
                label="बैनर विज्ञापन (Banners)"
                badge={String(stats.bannersCount)}
                active={activeTab === "banners"}
                onPress={() => handleSelectTab("banners")}
              />

              <SidebarItem
                icon="tv-outline"
                label="यूट्यूब एवं लाइव (YouTube)"
                badge={String(youtubeList.length)}
                active={activeTab === "youtube"}
                onPress={() => handleSelectTab("youtube")}
              />

              <SidebarItem
                icon="pricetag-outline"
                label="इन-फ़ीड विज्ञापन (Ads)"
                badge={String(adsList.length)}
                active={activeTab === "ads"}
                onPress={() => handleSelectTab("ads")}
              />

              <View style={styles.sidebarSectionLabel}>
                <Text style={styles.sidebarLabelText}>संचार एवं व्यवस्था (SYSTEM)</Text>
              </View>

              <SidebarItem
                icon="notifications-outline"
                label="पुश नोटिफिकेशन (Alerts)"
                active={activeTab === "notifications"}
                onPress={() => handleSelectTab("notifications")}
              />

              <SidebarItem
                icon="card-outline"
                label="प्रेस आईडी कार्ड (ID Cards)"
                badge={String(idCardList.length)}
                active={activeTab === "idcards"}
                onPress={() => handleSelectTab("idcards")}
              />

              <SidebarItem
                icon="mail-outline"
                label="संपर्क संदेश (Contacts)"
                badge={String(contactList.length)}
                active={activeTab === "contacts"}
                onPress={() => handleSelectTab("contacts")}
              />

              <SidebarItem
                icon="settings-outline"
                label="व्यवस्था एवं लॉगआउट"
                active={activeTab === "settings"}
                onPress={() => handleSelectTab("settings")}
              />
            </ScrollView>
          </View>
        )}

        {/* CONTENT AREA */}
        <View style={styles.contentArea}>
          {loading && !refreshing ? (
            <StarPageLoader
              message="स्टार न्यूज़ CMS डेटा लोड हो रहा है..."
              onRetry={loadDashboardData}
            />
          ) : (
            <ScrollView
              contentContainerStyle={styles.contentScroll}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
              showsVerticalScrollIndicator={false}
            >
              {/* TAB 1: OVERVIEW */}
              {activeTab === "overview" && (
                <View style={styles.tabContainer}>
                  <View style={styles.pageHeader}>
                    <Text style={styles.pageTitle}>संपादकीय सारांश (Dashboard Overview)</Text>
                    <Text style={styles.pageSubtitle}>
                      स्टार न्यूज़ नेटवर्क रीयल-टाइम न्यूज़ एनालिटिक्स
                    </Text>
                  </View>

                  {/* KPI Cards Grid */}
                  <View style={styles.kpiGrid}>
                    <KpiCard
                      icon="newspaper"
                      title="कुल समाचार (Total News)"
                      value={String(stats.totalNews)}
                      color="#DC2626"
                      subValue={`${stats.publishedNews} प्रकाशित • ${stats.draftNews} ड्राफ्ट`}
                      style={{ minWidth: isSmallMobile ? "100%" : isTablet ? "47%" : isDesktop ? "31%" : "47%" }}
                    />
                    <KpiCard
                      icon="eye"
                      title="कुल व्यूज (Total Views)"
                      value={formatMetricCount(stats.totalViews)}
                      color="#2563EB"
                      subValue={`${stats.totalViews.toLocaleString()} वास्तविक पाठक`}
                      style={{ minWidth: isSmallMobile ? "100%" : isTablet ? "47%" : isDesktop ? "31%" : "47%" }}
                    />
                    <KpiCard
                      icon="share-social"
                      title="कुल शेयर्स (Shares)"
                      value={formatMetricCount(stats.totalShares)}
                      color="#7C3AED"
                      subValue="सोशल मीडिया शेयर"
                      style={{ minWidth: isSmallMobile ? "100%" : isTablet ? "47%" : isDesktop ? "31%" : "47%" }}
                    />
                    <KpiCard
                      icon="flash"
                      title="सक्रिय ब्रेकिंग (Breaking)"
                      value={String(stats.activeBreaking)}
                      color="#EA580C"
                      subValue="लाइव टिकर में सक्रिय"
                      style={{ minWidth: isSmallMobile ? "100%" : isTablet ? "47%" : isDesktop ? "31%" : "47%" }}
                    />
                    <KpiCard
                      icon="person-add"
                      title="संवाददाता रिपोर्ट्स"
                      value={String(citizenNews.length)}
                      color="#0D9488"
                      subValue={`${stats.pendingCitizen} स्वीकृति हेतु लंबित`}
                      style={{ minWidth: isSmallMobile ? "100%" : isTablet ? "47%" : isDesktop ? "31%" : "47%" }}
                    />
                    <KpiCard
                      icon="book"
                      title="ई-पेपर संस्करण"
                      value={String(stats.epapersCount)}
                      color="#4F46E5"
                      subValue="डिजिटल प्रिंट संस्करण"
                      style={{ minWidth: isSmallMobile ? "100%" : isTablet ? "47%" : isDesktop ? "31%" : "47%" }}
                    />
                  </View>

                  {/* Quick Action Buttons */}
                  <View style={styles.quickActionsBar}>
                    <TouchableOpacity
                      style={[
                        styles.actionBigBtn,
                        { backgroundColor: BrandColors.primary },
                        isSmallMobile && { minWidth: "100%" },
                      ]}
                      onPress={handleOpenCreateNews}
                    >
                      <Ionicons name="create" size={18} color="#FFF" />
                      <Text style={styles.actionBigBtnText}>नई खबर लिखें (Write News)</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionBigBtn, { backgroundColor: "#B91C1C" }]}
                      onPress={() => {
                        setEditingBreakingId(null);
                        setBreakingText("");
                        setBreakingModalVisible(true);
                      }}
                    >
                      <Ionicons name="flash" size={18} color="#FFF" />
                      <Text style={styles.actionBigBtnText}>ब्रेकिंग न्यूज़ जोड़ें</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionBigBtn, { backgroundColor: "#1E293B" }]}
                      onPress={() => setNotifModalVisible(true)}
                    >
                      <Ionicons name="notifications" size={18} color="#FFF" />
                      <Text style={styles.actionBigBtnText}>पुश अलर्ट भेजें (Push Alert)</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Recent News Table Preview */}
                  <View style={styles.tableCard}>
                    <View style={styles.tableCardHeader}>
                      <Text style={styles.tableCardTitle}>हालिया समाचार (Recent Articles)</Text>
                      <TouchableOpacity onPress={() => setActiveTab("news")}>
                        <Text style={styles.seeAllText}>सभी देखें ({newsList.length}) →</Text>
                      </TouchableOpacity>
                    </View>

                    {newsList.slice(0, 5).map((item) => (
                      <View key={item._id} style={styles.miniNewsRow}>
                        <Image
                          source={{ uri: getFullMediaUrl(item.featuredImage) }}
                          style={styles.miniNewsThumb}
                          contentFit="cover"
                        />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.miniNewsTitle} numberOfLines={1}>
                            {item.title}
                          </Text>
                          <Text style={styles.miniNewsMeta}>
                            {item.category || "General"} • {formatTimeAgo(item.createdAt)} • 👁️ {item.views || 0}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.statusPillSmall,
                            item.status === "draft" ? styles.draftPill : styles.publishedPill,
                          ]}
                        >
                          <Text style={styles.statusPillSmallText}>
                            {item.status === "draft" ? "ड्राफ्ट" : "प्रकाशित"}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* TAB 2: NEWS MANAGEMENT */}
              {activeTab === "news" && (
                <View style={styles.tabContainer}>
                  <View style={styles.pageHeaderRow}>
                    <View>
                      <Text style={styles.pageTitle}>समाचार प्रबंधन (News Articles)</Text>
                      <Text style={styles.pageSubtitle}>
                        सभी प्रकाशित एवं ड्राफ्ट समाचारों का संपादन व नियंत्रण
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.primaryAddBtn}
                      onPress={handleOpenCreateNews}
                    >
                      <Ionicons name="add" size={18} color="#FFF" />
                      <Text style={styles.primaryAddBtnText}>नई खबर जोड़ें</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Search & Status Filters */}
                  <View style={[styles.filterBar, isMobile && { flexDirection: "column", alignItems: "stretch" }]}>
                    <View style={styles.filterSearchBox}>
                      <Ionicons name="search" size={16} color={BrandColors.textMuted} />
                      <TextInput
                        style={styles.filterSearchInput}
                        placeholder="खबर खोजें..."
                        placeholderTextColor={BrandColors.textMuted}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                      />
                    </View>

                    <View style={[styles.statusFilterGroup, isMobile && { alignSelf: "stretch", justifyContent: "space-around" }]}>
                      {(["all", "published", "draft"] as const).map((st) => (
                        <TouchableOpacity
                          key={st}
                          style={[
                            styles.statusFilterBtn,
                            statusFilter === st && styles.activeStatusFilterBtn,
                            isMobile && { flex: 1, alignItems: "center" },
                          ]}
                          onPress={() => setStatusFilter(st)}
                        >
                          <Text
                            style={[
                              styles.statusFilterText,
                              statusFilter === st && styles.activeStatusFilterText,
                            ]}
                          >
                            {st === "all" ? "सभी" : st === "published" ? "प्रकाशित" : "ड्राफ्ट"}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* News List Items */}
                  {filteredNewsList.map((item) => (
                    <View key={item._id} style={[styles.newsAdminCard, isMobile && { gap: 10, padding: 10 }]}>
                      <Image
                        source={{ uri: getFullMediaUrl(item.featuredImage) }}
                        style={[styles.newsAdminThumb, isSmallMobile && { width: 58, height: 58 }]}
                        contentFit="cover"
                      />
                      <View style={{ flex: 1, gap: 3 }}>
                        <View style={[styles.newsAdminMetaRow, isSmallMobile && { flexWrap: "wrap", gap: 4 }]}>
                          <View style={styles.adminCatBadge}>
                            <Text style={styles.adminCatBadgeText}>{item.category || "General"}</Text>
                          </View>
                          <View
                            style={[
                              styles.statusPillSmall,
                              item.status === "draft" ? styles.draftPill : styles.publishedPill,
                            ]}
                          >
                            <Text style={styles.statusPillSmallText}>
                              {item.status === "draft" ? "ड्राफ्ट" : "लाइव"}
                            </Text>
                          </View>
                          <Text style={styles.adminDateText}>{formatTimeAgo(item.createdAt)}</Text>
                        </View>

                        <Text
                          style={[
                            styles.newsAdminTitle,
                            isSmallMobile && { fontSize: 12, lineHeight: 16 },
                          ]}
                          numberOfLines={2}
                        >
                          {item.title}
                        </Text>

                        <View style={[styles.newsAdminMetrics, isSmallMobile && { flexWrap: "wrap", gap: 6 }]}>
                          <Text style={styles.newsMetricText}>👁️ {item.views || 0}</Text>
                          <Text style={styles.newsMetricText}>❤️ {item.likes || 0}</Text>
                          <Text style={styles.newsMetricText}>💬 {item.comments?.length || 0}</Text>
                        </View>
                      </View>

                      {/* Edit & Delete Actions */}
                      <View style={[styles.adminActionGroup, isMobile && { flexDirection: "column", gap: 6 }]}>
                        <TouchableOpacity
                          style={styles.editActionBtn}
                          onPress={() => handleOpenEditNews(item)}
                          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                        >
                          <Ionicons name="create-outline" size={17} color="#2563EB" />
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.deleteActionBtn}
                          onPress={() => handleDeleteNews(item._id, item.title)}
                          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                        >
                          <Ionicons name="trash-outline" size={17} color="#DC2626" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* TAB 3: BREAKING NEWS */}
              {activeTab === "breaking" && (
                <View style={styles.tabContainer}>
                  <View style={styles.pageHeaderRow}>
                    <View>
                      <Text style={styles.pageTitle}>ब्रेकिंग न्यूज़ टिकर (Breaking Tickers)</Text>
                      <Text style={styles.pageSubtitle}>
                        ऐप के शीर्ष पर लाल टिकर में चलने वाली ताज़ा सूचनाएं
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={[styles.primaryAddBtn, { backgroundColor: BrandColors.primary }]}
                      onPress={() => {
                        setEditingBreakingId(null);
                        setBreakingText("");
                        setBreakingPriority("1");
                        setBreakingModalVisible(true);
                      }}
                    >
                      <Ionicons name="add" size={18} color="#FFF" />
                      <Text style={styles.primaryAddBtnText}>नया टिकर जोड़ें</Text>
                    </TouchableOpacity>
                  </View>

                  {breakingList.map((item) => (
                    <View key={item._id} style={styles.breakingAdminCard}>
                      <View style={styles.breakingHeaderRow}>
                        <View style={styles.breakingPillActive}>
                          <Text style={styles.breakingPillActiveText}>प्राथमिकता #{item.priority}</Text>
                        </View>
                        <View style={styles.switchRow}>
                          <Text style={styles.switchLabel}>
                            {item.isActive ? "सक्रिय (Live)" : "निष्क्रिय (Hidden)"}
                          </Text>
                          <Switch
                            value={item.isActive}
                            onValueChange={() => handleToggleBreaking(item._id)}
                            trackColor={{ false: "#D1D5DB", true: "#FCA5A5" }}
                            thumbColor={item.isActive ? BrandColors.primary : "#9CA3AF"}
                          />
                        </View>
                      </View>

                      <Text style={styles.breakingCardText}>{item.text}</Text>

                      <View style={styles.breakingFooter}>
                        <Text style={styles.breakingTime}>{formatTimeAgo(item.createdAt)}</Text>
                        <TouchableOpacity
                          style={styles.deleteActionBtn}
                          onPress={() => handleDeleteBreaking(item._id)}
                        >
                          <Ionicons name="trash-outline" size={16} color="#DC2626" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* TAB 4: BANNERS */}
              {activeTab === "banners" && (
                <View style={styles.tabContainer}>
                  <View style={styles.pageHeaderRow}>
                    <View>
                      <Text style={styles.pageTitle}>बैनर विज्ञापन प्रबंधन (Banners)</Text>
                      <Text style={styles.pageSubtitle}>होम स्क्रीन पर प्रदर्शित होने वाले बैनर</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.primaryAddBtn}
                      onPress={() => {
                        setBannerImageUri(null);
                        setBannerModalVisible(true);
                      }}
                    >
                      <Ionicons name="add" size={18} color="#FFF" />
                      <Text style={styles.primaryAddBtnText}>नया बैनर जोड़ें</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.bannerGrid}>
                    {bannerList.map((b) => (
                      <View
                        key={b._id}
                        style={[
                          styles.bannerAdminCard,
                          { width: isDesktop ? "31.5%" : isTablet ? "48%" : "100%" },
                        ]}
                      >
                        <Image
                          source={{ uri: getFullMediaUrl(b.url || b.image) }}
                          style={styles.bannerAdminImg}
                          contentFit="cover"
                        />
                        <View style={styles.bannerAdminInfo}>
                          <Text style={styles.bannerAdminStats}>
                            👁️ {b.views || 0} व्यूज • ❤️ {b.likes || 0}
                          </Text>
                          <TouchableOpacity
                            style={styles.deleteActionBtn}
                            onPress={() => handleDeleteBanner(b._id)}
                          >
                            <Ionicons name="trash-outline" size={16} color="#DC2626" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* TAB 5: E-PAPER */}
              {activeTab === "epaper" && (
                <View style={styles.tabContainer}>
                  <View style={styles.pageHeaderRow}>
                    <View>
                      <Text style={styles.pageTitle}>ई-पेपर संस्करण (E-Paper Editions)</Text>
                      <Text style={styles.pageSubtitle}>दैनिक डिजिटल समाचार पत्र संस्करण</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.primaryAddBtn}
                      onPress={() => {
                        setEpaperTitle("");
                        setEpaperPublishDate(new Date().toISOString().split("T")[0]);
                        setEpaperPages([]);
                        setEpaperModalVisible(true);
                      }}
                    >
                      <Ionicons name="add" size={18} color="#FFF" />
                      <Text style={styles.primaryAddBtnText}>नया संस्करण जोड़ें</Text>
                    </TouchableOpacity>
                  </View>

                  {epaperList.map((ep) => (
                    <View key={ep._id} style={styles.epaperAdminCard}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.epaperAdminTitle}>{ep.title}</Text>
                        <Text style={styles.epaperAdminMeta}>
                          प्रकाशित: {new Date(ep.publishDate || ep.createdAt || Date.now()).toLocaleDateString("hi-IN")} • {ep.pages?.length || 0} पृष्ठ
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.deleteActionBtn}
                        onPress={() => handleDeleteEpaper(ep._id)}
                      >
                        <Ionicons name="trash-outline" size={18} color="#DC2626" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              {/* TAB 6: GALLERY */}
              {activeTab === "gallery" && (
                <View style={styles.tabContainer}>
                  <View style={styles.pageHeaderRow}>
                    <View>
                      <Text style={styles.pageTitle}>फोटो एल्बम गैलरी (Photo Albums)</Text>
                      <Text style={styles.pageSubtitle}>विशेष आयोजनों के छायाचित्र संग्रह</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.primaryAddBtn}
                      onPress={() => {
                        setGalleryTitle("");
                        setGalleryDescription("");
                        setGalleryImages([]);
                        setGalleryModalVisible(true);
                      }}
                    >
                      <Ionicons name="add" size={18} color="#FFF" />
                      <Text style={styles.primaryAddBtnText}>नया एल्बम बनाएं</Text>
                    </TouchableOpacity>
                  </View>

                  {galleryList.map((gal) => (
                    <View key={gal._id} style={styles.epaperAdminCard}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.epaperAdminTitle}>{gal.title}</Text>
                        <Text style={styles.epaperAdminMeta}>
                          {gal.images?.length || 0} फोटोज़ • {gal.description || "कोई विवरण नहीं"}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.deleteActionBtn}
                        onPress={() => handleDeleteGallery(gal._id)}
                      >
                        <Ionicons name="trash-outline" size={18} color="#DC2626" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              {/* TAB 7: CITIZEN NEWS */}
              {activeTab === "citizen" && (
                <View style={styles.tabContainer}>
                  <View style={styles.pageHeader}>
                    <Text style={styles.pageTitle}>नागरिक एवं रिपोर्टर सबमिशन</Text>
                    <Text style={styles.pageSubtitle}>
                      संवाददाताओं द्वारा भेजी गई खबरों की समीक्षा एवं अनुमोदन
                    </Text>
                  </View>

                  {citizenNews.map((item) => (
                    <View key={item._id} style={styles.citizenCard}>
                      <View style={styles.citizenHeader}>
                        <View style={styles.citizenReporterInfo}>
                          <Text style={styles.reporterNameText}>{item.name || "नागरिक रिपोर्टर"}</Text>
                          <Text style={styles.reporterPhoneText}>📱 {item.mobile || "N/A"}</Text>
                          <Text style={styles.reporterLocationText}>📍 {item.district || item.location || "सामान्य"}</Text>
                        </View>
                        <View
                          style={[
                            styles.statusPillSmall,
                            item.status === "pending"
                              ? styles.pendingPill
                              : item.status === "approved"
                              ? styles.publishedPill
                              : styles.draftPill,
                          ]}
                        >
                          <Text style={styles.statusPillSmallText}>
                            {item.status === "pending"
                              ? "लंबित (Pending)"
                              : item.status === "approved"
                              ? "स्वीकृत (Approved)"
                              : "अस्वीकृत (Rejected)"}
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.citizenTitle}>{item.title}</Text>
                      <Text style={styles.citizenBody} numberOfLines={3}>
                        {item.content}
                      </Text>

                      {/* Approval Actions */}
                      <View style={styles.citizenActionRow}>
                        {item.status === "pending" && (
                          <>
                            <TouchableOpacity
                              style={styles.approveBtn}
                              onPress={() => handleApproveCitizen(item._id)}
                            >
                              <Ionicons name="checkmark-circle" size={16} color="#FFF" />
                              <Text style={styles.approveBtnText}>स्वीकृत करें (Approve)</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={styles.rejectBtn}
                              onPress={() => handleRejectCitizen(item._id)}
                            >
                              <Ionicons name="close-circle" size={16} color="#FFF" />
                              <Text style={styles.rejectBtnText}>अस्वीकृत करें (Reject)</Text>
                            </TouchableOpacity>
                          </>
                        )}

                        <TouchableOpacity
                          style={styles.deleteActionBtn}
                          onPress={() => handleDeleteCitizen(item._id)}
                        >
                          <Ionicons name="trash-outline" size={16} color="#DC2626" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* TAB 8: PUSH NOTIFICATIONS COMPOSER & HISTORY */}
              {activeTab === "notifications" && (
                <View style={styles.tabContainer}>
                  <View style={styles.pageHeaderRow}>
                    <View>
                      <Text style={styles.pageTitle}>पुश नोटिफिकेशन (Push Broadcasts)</Text>
                      <Text style={styles.pageSubtitle}>
                        सभी पंजीकृत उपयोगकर्ताओं को तत्काल अलर्ट संदेश भेजें
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.primaryAddBtn}
                      onPress={() => setNotifModalVisible(true)}
                    >
                      <Ionicons name="send" size={16} color="#FFF" />
                      <Text style={styles.primaryAddBtnText}>नया अलर्ट भेजें</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Sent History */}
                  <View style={styles.tableCard}>
                    <Text style={styles.tableCardTitle}>प्रेषित नोटिफिकेशन इतिहास</Text>
                    {notificationList.map((notif) => (
                      <View key={notif._id} style={styles.notifHistoryRow}>
                        <View style={styles.notifHistoryIcon}>
                          <Ionicons name="notifications" size={18} color={BrandColors.primary} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.notifHistoryTitle}>{notif.title}</Text>
                          <Text style={styles.notifHistoryMessage}>{notif.message}</Text>
                          <Text style={styles.notifHistoryTime}>{formatTimeAgo(notif.createdAt)}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* TAB 9: PRESS ID CARDS */}
              {activeTab === "idcards" && (
                <View style={styles.tabContainer}>
                  <View style={styles.pageHeaderRow}>
                    <View>
                      <Text style={styles.pageTitle}>प्रेस पहचान पत्र (Press ID Cards)</Text>
                      <Text style={styles.pageSubtitle}>स्टार न्यूज़ नेटवर्क अधिकृत पत्रकार परिचय पत्र</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.primaryAddBtn}
                      onPress={() => {
                        setIdCardName("");
                        setIdCardDesignation("संवाददाता (Reporter)");
                        setIdCardOrg("Star News Networks");
                        setIdCardPhoto(null);
                        setIdCardModalVisible(true);
                      }}
                    >
                      <Ionicons name="add" size={18} color="#FFF" />
                      <Text style={styles.primaryAddBtnText}>आईडी कार्ड जारी करें</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.idCardGrid}>
                    {idCardList.map((card) => (
                      <View
                        key={card._id}
                        style={[
                          styles.pressIdCard,
                          { width: isDesktop ? "31.5%" : isTablet ? "48%" : "100%" },
                        ]}
                      >
                        <View style={styles.pressIdHeader}>
                          <Text style={styles.pressIdOrg}>STAR NEWS NETWORKS</Text>
                          <Text style={styles.pressIdEmpId}>{card.employeeId}</Text>
                        </View>
                        <View style={styles.pressIdBody}>
                          {card.photoUrl ? (
                            <Image
                              source={{ uri: getFullMediaUrl(card.photoUrl) }}
                              style={styles.pressIdPhoto}
                            />
                          ) : (
                            <View style={styles.pressIdPhotoPlaceholder}>
                              <Ionicons name="person" size={24} color="#FFF" />
                            </View>
                          )}
                          <View style={{ flex: 1 }}>
                            <Text style={styles.pressIdName}>{card.name}</Text>
                            <Text style={styles.pressIdRole}>{card.designation}</Text>
                            <Text style={styles.pressIdValid}>वैध: {card.validTill}</Text>
                          </View>
                          <TouchableOpacity
                            style={styles.deleteActionBtn}
                            onPress={() => handleDeleteIdCard(card._id)}
                          >
                            <Ionicons name="trash-outline" size={16} color="#DC2626" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* TAB 10: YOUTUBE & LIVE STREAMS */}
              {activeTab === "youtube" && (
                <View style={styles.tabContainer}>
                  <View style={styles.pageHeaderRow}>
                    <View>
                      <Text style={styles.pageTitle}>यूट्यूब एवं लाइव चैनल (Live Videos)</Text>
                      <Text style={styles.pageSubtitle}>वीडियो बुलेटिन और लाइव स्ट्रीम लिंक प्रबंधन</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.primaryAddBtn}
                      onPress={() => {
                        setYoutubeChannelName("");
                        setYoutubeLink("");
                        setYoutubeModalVisible(true);
                      }}
                    >
                      <Ionicons name="add" size={18} color="#FFF" />
                      <Text style={styles.primaryAddBtnText}>नया लिंक जोड़ें</Text>
                    </TouchableOpacity>
                  </View>

                  {youtubeList.map((yt) => (
                    <View key={yt._id} style={styles.epaperAdminCard}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.epaperAdminTitle}>{yt.title}</Text>
                        <Text style={styles.epaperAdminMeta}>{yt.link}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.deleteActionBtn}
                        onPress={() => handleDeleteYoutube(yt._id)}
                      >
                        <Ionicons name="trash-outline" size={18} color="#DC2626" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              {/* TAB 11: ADS */}
              {activeTab === "ads" && (
                <View style={styles.tabContainer}>
                  <View style={styles.pageHeaderRow}>
                    <View>
                      <Text style={styles.pageTitle}>इन-फ़ीड विज्ञापन (In-Feed Ads)</Text>
                      <Text style={styles.pageSubtitle}>समाचार सूची में प्रदर्शित प्रायोजित विज्ञापन</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.primaryAddBtn}
                      onPress={() => {
                        setAdTitle("");
                        setAdPosition("top");
                        setAdImage(null);
                        setAdModalVisible(true);
                      }}
                    >
                      <Ionicons name="add" size={18} color="#FFF" />
                      <Text style={styles.primaryAddBtnText}>नया विज्ञापन जोड़ें</Text>
                    </TouchableOpacity>
                  </View>

                  {adsList.map((ad) => (
                    <View key={ad._id} style={styles.epaperAdminCard}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.epaperAdminTitle}>{ad.title || "प्रायोजित विज्ञापन"}</Text>
                        <Text style={styles.epaperAdminMeta}>
                          स्थिति: {ad.position || "infeed"} • क्लिक्स: {ad.clicks || 0}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                        <Switch
                          value={ad.isActive}
                          onValueChange={() => handleToggleAd(ad._id)}
                          trackColor={{ false: "#D1D5DB", true: "#FCA5A5" }}
                          thumbColor={ad.isActive ? BrandColors.primary : "#9CA3AF"}
                        />
                        <TouchableOpacity
                          style={styles.deleteActionBtn}
                          onPress={() => handleDeleteAd(ad._id)}
                        >
                          <Ionicons name="trash-outline" size={18} color="#DC2626" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* TAB 12: CONTACTS */}
              {activeTab === "contacts" && (
                <View style={styles.tabContainer}>
                  <View style={styles.pageHeader}>
                    <Text style={styles.pageTitle}>पाठक संपर्क संदेश (Contact Inquiries)</Text>
                    <Text style={styles.pageSubtitle}>पाठकों द्वारा हेल्पलाइन पर भेजे गए संदेश</Text>
                  </View>

                  {contactList.map((c) => (
                    <View key={c._id} style={styles.contactCard}>
                      <View style={styles.contactHeader}>
                        <View>
                          <Text style={styles.contactName}>{c.name}</Text>
                          <Text style={styles.contactPhone}>📱 {c.phone}</Text>
                        </View>
                        <TouchableOpacity
                          style={styles.deleteActionBtn}
                          onPress={() => handleDeleteContact(c._id)}
                        >
                          <Ionicons name="trash-outline" size={16} color="#DC2626" />
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.contactMessage}>{c.message}</Text>
                      <Text style={styles.contactTime}>{formatTimeAgo(c.createdAt)}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* TAB 13: SETTINGS & LOGOUT */}
              {activeTab === "settings" && (
                <View style={styles.tabContainer}>
                  <View style={styles.pageHeader}>
                    <Text style={styles.pageTitle}>व्यवस्थापक सेटिंग्स (Admin Portal Settings)</Text>
                    <Text style={styles.pageSubtitle}>संपादकीय कंट्रोल डेस्क एवं सुरक्षा कॉन्फ़िगरेशन</Text>
                  </View>

                  <View style={styles.tableCard}>
                    <Text style={styles.tableCardTitle}>सुरक्षा एवं न्यूज़रूम क्रेडेंशियल्स</Text>
                    <View style={styles.settingRow}>
                      <Text style={styles.settingLabel}>अधिकृत व्यवस्थापक यूज़र:</Text>
                      <Text style={styles.settingVal}>admin</Text>
                    </View>
                    <View style={styles.settingRow}>
                      <Text style={styles.settingLabel}>सिस्टम सर्वर स्थिति:</Text>
                      <Text style={[styles.settingVal, { color: "#16A34A" }]}>● ऑनलाइन (Online)</Text>
                    </View>
                    <View style={styles.settingRow}>
                      <Text style={styles.settingLabel}>पुश टोकन सेवा:</Text>
                      <Text style={[styles.settingVal, { color: "#16A34A" }]}>Expo Push Server Active</Text>
                    </View>

                    <TouchableOpacity style={styles.logoutBigBtn} onPress={handleLogout}>
                      <Ionicons name="log-out" size={18} color="#FFF" />
                      <Text style={styles.logoutBigBtnText}>न्यूज़रूम पोर्टल से लॉगआउट करें</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </ScrollView>
          )}
        </View>
      </View>

      {/* ================= MODAL: CREATE / EDIT NEWS ARTICLE ================= */}
      <Modal
        visible={newsModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setNewsModalVisible(false)}
      >
        <SafeAreaView style={styles.modalSafe}>
          <View style={[styles.modalInnerContainer, isDesktop && styles.desktopModalInner]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setNewsModalVisible(false)} style={styles.modalCloseBtn}>
                <Ionicons name="close" size={24} color={BrandColors.charcoal} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {editingNewsId ? "समाचार संपादित करें (Edit News)" : "नया समाचार प्रकाशित करें (New Article)"}
              </Text>
            <TouchableOpacity
              style={styles.modalSaveBtn}
              onPress={handleSaveNews}
              disabled={submittingNews}
            >
              {submittingNews ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.modalSaveText}>
                  {newsStatus === "published" ? "प्रकाशित करें 🚀" : "ड्राफ्ट सहेजें 📝"}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalScroll} keyboardShouldPersistTaps="handled">
            {/* Title */}
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>समाचार मुख्य शीर्षक (Headline) *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="उदा. पन्ना में राष्ट्रीय राजमार्ग पर बड़ा हादसा..."
                placeholderTextColor={BrandColors.textMuted}
                value={newsTitle}
                onChangeText={setNewsTitle}
              />
            </View>

            {/* Category Dropdown/Selector */}
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>श्रेणी (Category) *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catPillRow}>
                {[
                  "Madhya Pradesh",
                  "Panna",
                  "Satna",
                  "Chhatarpur",
                  "Desh",
                  "Crime",
                  "Politics",
                  "Sports",
                  "Entertainment",
                ].map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.catSelectPill, newsCategory === c && styles.activeCatSelectPill]}
                    onPress={() => setNewsCategory(c)}
                  >
                    <Text style={[styles.catSelectText, newsCategory === c && styles.activeCatSelectText]}>
                      {c}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Short Description */}
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>संक्षिप्त विवरण / लीड (Short Summary)</Text>
              <TextInput
                style={[styles.textInput, { height: 60 }]}
                placeholder="समाचार का मुख्य सार (1-2 पंक्तियाँ)..."
                placeholderTextColor={BrandColors.textMuted}
                value={newsDescription}
                onChangeText={setNewsDescription}
                multiline
              />
            </View>

            {/* Main Content */}
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>विस्तृत समाचार सामग्री (Article Body)</Text>
              <TextInput
                style={[styles.textInput, { height: 140, textAlignVertical: "top" }]}
                placeholder="पूरी खबर का विवरण यहां लिखें..."
                placeholderTextColor={BrandColors.textMuted}
                value={newsContent}
                onChangeText={setNewsContent}
                multiline
              />
            </View>

            {/* Featured Image Picker */}
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>मुख्य फ़ीचर्ड छवि (Featured Image)</Text>
              <TouchableOpacity style={styles.imagePickerBtn} onPress={pickFeaturedImage}>
                <Ionicons name="camera-outline" size={20} color={BrandColors.primary} />
                <Text style={styles.imagePickerText}>
                  {newsFeaturedImage ? "छवि बदलें (Change Image)" : "गैलरी से छवि चुनें (Pick Image)"}
                </Text>
              </TouchableOpacity>

              {newsFeaturedImage && (
                <View style={styles.imagePreviewWrap}>
                  <Image source={{ uri: newsFeaturedImage }} style={styles.imagePreview} contentFit="cover" />
                  <TouchableOpacity
                    style={styles.removeImageBtn}
                    onPress={() => setNewsFeaturedImage(null)}
                  >
                    <Ionicons name="close" size={16} color="#FFF" />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Status Selection: Publish vs Draft */}
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>प्रकाशन स्थिति (Publication Status)</Text>
              <View style={styles.statusToggleRow}>
                <TouchableOpacity
                  style={[styles.statusToggleBtn, newsStatus === "published" && styles.activePublishBtn]}
                  onPress={() => setNewsStatus("published")}
                >
                  <Ionicons
                    name="globe"
                    size={18}
                    color={newsStatus === "published" ? "#FFF" : BrandColors.charcoal}
                  />
                  <Text style={[styles.statusToggleText, newsStatus === "published" && styles.activeStatusToggleText]}>
                    तत्काल प्रकाशित करें (Publish Live)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.statusToggleBtn, newsStatus === "draft" && styles.activeDraftBtn]}
                  onPress={() => setNewsStatus("draft")}
                >
                  <Ionicons
                    name="document-text"
                    size={18}
                    color={newsStatus === "draft" ? "#FFF" : BrandColors.charcoal}
                  />
                  <Text style={[styles.statusToggleText, newsStatus === "draft" && styles.activeStatusToggleText]}>
                    ड्राफ्ट के रूप में सहेजें (Save Draft)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* ================= LIVE PUSH NOTIFICATION PREVIEW ================= */}
            <View style={styles.notificationPreviewCard}>
              <View style={styles.notifPreviewHeader}>
                <MaterialCommunityIcons name="cellphone-message" size={20} color={BrandColors.primary} />
                <Text style={styles.notifPreviewTitle}>
                  ऑटोमैटिक पुश नोटिफिकेशन पूर्वावलोकन (Push Alert Preview)
                </Text>
              </View>

              {newsStatus === "published" ? (
                <View style={styles.mockDeviceAlert}>
                  <View style={styles.mockAlertHeader}>
                    <View style={styles.mockAppBadge}>
                      <MaterialCommunityIcons name="broadcast" size={10} color="#FFF" />
                      <Text style={styles.mockAppName}>STAR NEWS NETWORKS</Text>
                    </View>
                    <Text style={styles.mockTime}>अभी (Now)</Text>
                  </View>

                  <Text style={styles.mockHeadline}>
                    📰 {newsCategory || "General"} | {newsTitle || "समाचार का मुख्य शीर्षक यहाँ दिखेगा"}
                  </Text>
                  <Text style={styles.mockBody} numberOfLines={2}>
                    {newsDescription || "विस्तृत खबर पढ़ने के लिए स्टार न्यूज़ ऐप खोलें..."}
                  </Text>

                  <View style={styles.autoDispatchNotice}>
                    <Ionicons name="flash" size={13} color="#16A34A" />
                    <Text style={styles.autoDispatchText}>
                      ⚡ प्रकाशन पर यह अलर्ट सभी पंजीकृत मोबाइल उपकरणों पर तुरंत स्वतः भेजा जाएगा।
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={styles.mockDraftNotice}>
                  <Ionicons name="information-circle-outline" size={18} color="#D97706" />
                  <Text style={styles.mockDraftText}>
                    📝 ड्राफ्ट स्थिति में कोई पुश नोटिफिकेशन नहीं भेजा जाएगा।
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
      {/* ================= MODAL: ADD / EDIT BREAKING TICKER ================= */}
      <Modal
        visible={breakingModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setBreakingModalVisible(false)}
      >
        <View style={styles.promptOverlay}>
          <View style={styles.promptCard}>
            <Text style={styles.promptTitle}>
              {editingBreakingId ? "ब्रेकिंग टिकर संपादित करें" : "नया ब्रेकिंग न्यूज़ टिकर"}
            </Text>

            <TextInput
              style={[styles.textInput, { height: 75, marginTop: 12 }]}
              placeholder="ब्रेकिंग हेडलाइन टेक्स्ट दर्ज करें..."
              placeholderTextColor={BrandColors.textMuted}
              value={breakingText}
              onChangeText={setBreakingText}
              multiline
            />

            <TextInput
              style={[styles.textInput, { marginTop: 10 }]}
              placeholder="प्राथमिकता नंबर (उदा. 1, 2, 3)"
              placeholderTextColor={BrandColors.textMuted}
              value={breakingPriority}
              onChangeText={setBreakingPriority}
              keyboardType="numeric"
            />

            <View style={styles.promptBtnRow}>
              <TouchableOpacity
                style={styles.promptCancelBtn}
                onPress={() => setBreakingModalVisible(false)}
              >
                <Text style={styles.promptCancelText}>रद्द करें</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.promptSubmitBtn} onPress={handleSaveBreaking}>
                <Text style={styles.promptSubmitText}>सहेजें (Save)</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ================= MODAL: PUSH NOTIFICATION COMPOSER ================= */}
      <Modal
        visible={notifModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setNotifModalVisible(false)}
      >
        <SafeAreaView style={styles.modalSafe}>
          <View style={[styles.modalInnerContainer, isDesktop && styles.desktopModalInner]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setNotifModalVisible(false)} style={styles.modalCloseBtn}>
                <Ionicons name="close" size={24} color={BrandColors.charcoal} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>पुश नोटिफिकेशन कंपोज़र (Push Broadcast)</Text>
            <TouchableOpacity
              style={[styles.modalSaveBtn, { backgroundColor: BrandColors.primary }]}
              onPress={handleSendNotification}
              disabled={sendingNotif}
            >
              {sendingNotif ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.modalSaveText}>प्रसारित करें (Send) 🚀</Text>
              )}
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalScroll}>
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>अलर्ट शीर्षक (Notification Title) *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="उदा. 📰 Star News Networks | Breaking News"
                placeholderTextColor={BrandColors.textMuted}
                value={notifTitle}
                onChangeText={setNotifTitle}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>अलर्ट संदेश (Message Body) *</Text>
              <TextInput
                style={[styles.textInput, { height: 80 }]}
                placeholder="सभी ऐप उपयोगकर्ताओं को भेजा जाने वाला मुख्य संदेश..."
                placeholderTextColor={BrandColors.textMuted}
                value={notifMessage}
                onChangeText={setNotifMessage}
                multiline
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>अलर्ट प्रकार (Type)</Text>
              <View style={styles.statusToggleRow}>
                {["breaking", "general", "special"].map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.statusToggleBtn, notifType === t && styles.activePublishBtn]}
                    onPress={() => setNotifType(t)}
                  >
                    <Text style={[styles.statusToggleText, notifType === t && styles.activeStatusToggleText]}>
                      {t.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>संबंधित समाचार आईडी (Associated News ID - Optional)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="टैप करने पर सीधे इस समाचार पर ले जाने हेतु ID..."
                placeholderTextColor={BrandColors.textMuted}
                value={notifNewsId}
                onChangeText={setNotifNewsId}
              />
            </View>

            {/* Audience Info */}
            <View style={styles.audienceInfoCard}>
              <Ionicons name="people" size={18} color="#2563EB" />
              <View style={{ flex: 1 }}>
                <Text style={styles.audienceTitle}>लक्षित दर्शक (Target Audience):</Text>
                <Text style={styles.audienceDesc}>
                  स्टार न्यूज़ नेटवर्क ऐप इंस्टॉल करने वाले एवं नोटिफिकेशन अनुमति देने वाले सभी पात्र उपकरण।
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>

      {/* ================= MODAL: ADD BANNER ================= */}
      <Modal
        visible={bannerModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setBannerModalVisible(false)}
      >
        <View style={styles.promptOverlay}>
          <View style={styles.promptCard}>
            <Text style={styles.promptTitle}>नया बैनर विज्ञापन जोड़ें (Add Banner)</Text>

            <TouchableOpacity style={[styles.imagePickerBtn, { marginTop: 14 }]} onPress={pickBannerImage}>
              <Ionicons name="image-outline" size={20} color={BrandColors.primary} />
              <Text style={styles.imagePickerText}>
                {bannerImageUri ? "छवि बदलें (Change Image)" : "बैनर छवि चुनें (Pick Image)"}
              </Text>
            </TouchableOpacity>

            {bannerImageUri && (
              <View style={[styles.imagePreviewWrap, { marginTop: 10, height: 120 }]}>
                <Image source={{ uri: bannerImageUri }} style={styles.imagePreview} contentFit="contain" />
                <TouchableOpacity
                  style={styles.removeImageBtn}
                  onPress={() => setBannerImageUri(null)}
                >
                  <Ionicons name="close" size={16} color="#FFF" />
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.promptBtnRow}>
              <TouchableOpacity
                style={styles.promptCancelBtn}
                onPress={() => setBannerModalVisible(false)}
              >
                <Text style={styles.promptCancelText}>रद्द करें</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.promptSubmitBtn, { backgroundColor: BrandColors.primary }]}
                onPress={handleSaveBanner}
                disabled={submittingBanner}
              >
                {submittingBanner ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.promptSubmitText}>अपलोड करें (Save)</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ================= MODAL: ADD E-PAPER ================= */}
      <Modal
        visible={epaperModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setEpaperModalVisible(false)}
      >
        <SafeAreaView style={styles.modalSafe}>
          <View style={[styles.modalInnerContainer, isDesktop && styles.desktopModalInner]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setEpaperModalVisible(false)} style={styles.modalCloseBtn}>
                <Ionicons name="close" size={24} color={BrandColors.charcoal} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>नया ई-पेपर संस्करण प्रकाशित करें</Text>
            <TouchableOpacity
              style={[styles.modalSaveBtn, { backgroundColor: BrandColors.primary }]}
              onPress={handleSaveEpaper}
              disabled={submittingEpaper}
            >
              {submittingEpaper ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.modalSaveText}>प्रकाशित करें 🚀</Text>
              )}
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalScroll}>
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>संस्करण शीर्षक (Edition Title) *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="उदा. स्टार न्यूज़ पन्ना दैनिक संस्करण..."
                placeholderTextColor={BrandColors.textMuted}
                value={epaperTitle}
                onChangeText={setEpaperTitle}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>प्रकाशन दिनांक (Publish Date YYYY-MM-DD)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="2026-11-02"
                placeholderTextColor={BrandColors.textMuted}
                value={epaperPublishDate}
                onChangeText={setEpaperPublishDate}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>ई-पेपर पृष्ठ छवियां (Pages - {epaperPages.length} चयनित) *</Text>
              <TouchableOpacity style={styles.imagePickerBtn} onPress={pickEpaperPages}>
                <Ionicons name="images-outline" size={20} color={BrandColors.primary} />
                <Text style={styles.imagePickerText}>गैलरी से पृष्ठ चुनें (Pick Multiple Pages)</Text>
              </TouchableOpacity>

              {epaperPages.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginTop: 10 }}>
                  {epaperPages.map((uri, idx) => (
                    <View key={idx} style={{ width: 80, height: 110, borderRadius: 6, overflow: "hidden", borderWidth: 1, borderColor: "#E5E7EB" }}>
                      <Image source={{ uri }} style={{ width: "100%", height: "100%" }} contentFit="cover" />
                      <View style={{ position: "absolute", bottom: 2, right: 2, backgroundColor: "rgba(0,0,0,0.6)", paddingHorizontal: 4, borderRadius: 4 }}>
                        <Text style={{ color: "#FFF", fontSize: 10 }}>P.{idx + 1}</Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>

      {/* ================= MODAL: ADD GALLERY ALBUM ================= */}
      <Modal
        visible={galleryModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setGalleryModalVisible(false)}
      >
        <SafeAreaView style={styles.modalSafe}>
          <View style={[styles.modalInnerContainer, isDesktop && styles.desktopModalInner]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setGalleryModalVisible(false)} style={styles.modalCloseBtn}>
                <Ionicons name="close" size={24} color={BrandColors.charcoal} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>नया फोटो एल्बम बनाएं</Text>
            <TouchableOpacity
              style={[styles.modalSaveBtn, { backgroundColor: BrandColors.primary }]}
              onPress={handleSaveGallery}
              disabled={submittingGallery}
            >
              {submittingGallery ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.modalSaveText}>सहेजें (Save) 📸</Text>
              )}
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalScroll}>
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>एल्बम का नाम (Album Title) *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="उदा. पन्ना गौरव दिवस समारोह 2026..."
                placeholderTextColor={BrandColors.textMuted}
                value={galleryTitle}
                onChangeText={setGalleryTitle}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>एल्बम विवरण (Description)</Text>
              <TextInput
                style={[styles.textInput, { height: 70 }]}
                placeholder="छायाचित्र संग्रह का संक्षिप्त विवरण..."
                placeholderTextColor={BrandColors.textMuted}
                value={galleryDescription}
                onChangeText={setGalleryDescription}
                multiline
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>तस्वीरें (Photos - {galleryImages.length} चयनित) *</Text>
              <TouchableOpacity style={styles.imagePickerBtn} onPress={pickGalleryImages}>
                <Ionicons name="images-outline" size={20} color={BrandColors.primary} />
                <Text style={styles.imagePickerText}>गैलरी से तस्वीरें चुनें (Pick Photos)</Text>
              </TouchableOpacity>

              {galleryImages.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginTop: 10 }}>
                  {galleryImages.map((uri, idx) => (
                    <View key={idx} style={{ width: 80, height: 80, borderRadius: 6, overflow: "hidden" }}>
                      <Image source={{ uri }} style={{ width: "100%", height: "100%" }} contentFit="cover" />
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>

      {/* ================= MODAL: ADD YOUTUBE LINK ================= */}
      <Modal
        visible={youtubeModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setYoutubeModalVisible(false)}
      >
        <View style={styles.promptOverlay}>
          <View style={styles.promptCard}>
            <Text style={styles.promptTitle}>यूट्यूब चैनल या वीडियो जोड़ें</Text>

            <TextInput
              style={[styles.textInput, { marginTop: 12 }]}
              placeholder="चैनल या बुलेटिन का नाम *"
              placeholderTextColor={BrandColors.textMuted}
              value={youtubeChannelName}
              onChangeText={setYoutubeChannelName}
            />

            <TextInput
              style={[styles.textInput, { marginTop: 10 }]}
              placeholder="यूट्यूब लिंक (URL) *"
              placeholderTextColor={BrandColors.textMuted}
              value={youtubeLink}
              onChangeText={setYoutubeLink}
              autoCapitalize="none"
            />

            <View style={styles.promptBtnRow}>
              <TouchableOpacity
                style={styles.promptCancelBtn}
                onPress={() => setYoutubeModalVisible(false)}
              >
                <Text style={styles.promptCancelText}>रद्द करें</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.promptSubmitBtn, { backgroundColor: BrandColors.primary }]}
                onPress={handleSaveYoutube}
                disabled={submittingYoutube}
              >
                {submittingYoutube ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.promptSubmitText}>जोड़ें (Add)</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ================= MODAL: CREATE PRESS ID CARD ================= */}
      <Modal
        visible={idCardModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIdCardModalVisible(false)}
      >
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIdCardModalVisible(false)} style={styles.modalCloseBtn}>
              <Ionicons name="close" size={24} color={BrandColors.charcoal} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>प्रेस पहचान पत्र जारी करें</Text>
            <TouchableOpacity
              style={[styles.modalSaveBtn, { backgroundColor: BrandColors.primary }]}
              onPress={handleSaveIdCard}
              disabled={submittingIdCard}
            >
              {submittingIdCard ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.modalSaveText}>जारी करें 🪪</Text>
              )}
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalScroll}>
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>पत्रकार का पूरा नाम (Full Name) *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="उदा. राहुल शर्मा"
                placeholderTextColor={BrandColors.textMuted}
                value={idCardName}
                onChangeText={setIdCardName}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>पद / दायित्व (Designation) *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="उदा. विशेष संवाददाता / ब्यूरो चीफ"
                placeholderTextColor={BrandColors.textMuted}
                value={idCardDesignation}
                onChangeText={setIdCardDesignation}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>संस्थान का नाम (Organization)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Star News Networks"
                placeholderTextColor={BrandColors.textMuted}
                value={idCardOrg}
                onChangeText={setIdCardOrg}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>पासपोर्ट साइज फोटो (Photo)</Text>
              <TouchableOpacity style={styles.imagePickerBtn} onPress={pickIdCardPhoto}>
                <Ionicons name="camera-outline" size={20} color={BrandColors.primary} />
                <Text style={styles.imagePickerText}>
                  {idCardPhoto ? "फोटो बदलें" : "फोटो चुनें"}
                </Text>
              </TouchableOpacity>

              {idCardPhoto && (
                <View style={[styles.imagePreviewWrap, { width: 100, height: 120, marginTop: 10 }]}>
                  <Image source={{ uri: idCardPhoto }} style={styles.imagePreview} contentFit="cover" />
                  <TouchableOpacity
                    style={styles.removeImageBtn}
                    onPress={() => setIdCardPhoto(null)}
                  >
                    <Ionicons name="close" size={16} color="#FFF" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* ================= MODAL: CREATE IN-FEED AD ================= */}
      <Modal
        visible={adModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAdModalVisible(false)}
      >
        <View style={styles.promptOverlay}>
          <View style={styles.promptCard}>
            <Text style={styles.promptTitle}>नया इन-फ़ीड विज्ञापन जोड़ें</Text>

            <TextInput
              style={[styles.textInput, { marginTop: 12 }]}
              placeholder="विज्ञापन शीर्षक *"
              placeholderTextColor={BrandColors.textMuted}
              value={adTitle}
              onChangeText={setAdTitle}
            />

            <View style={{ marginTop: 10 }}>
              <Text style={styles.inputLabel}>प्रदर्शन स्थान (Position)</Text>
              <View style={styles.statusToggleRow}>
                {["top", "middle", "bottom", "sidebar"].map((pos) => (
                  <TouchableOpacity
                    key={pos}
                    style={[styles.statusToggleBtn, adPosition === pos && styles.activePublishBtn]}
                    onPress={() => setAdPosition(pos)}
                  >
                    <Text style={[styles.statusToggleText, adPosition === pos && styles.activeStatusToggleText]}>
                      {pos.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity style={[styles.imagePickerBtn, { marginTop: 10 }]} onPress={pickAdImage}>
              <Ionicons name="image-outline" size={20} color={BrandColors.primary} />
              <Text style={styles.imagePickerText}>
                {adImage ? "छवि बदलें" : "विज्ञापन छवि चुनें"}
              </Text>
            </TouchableOpacity>

            {adImage && (
              <View style={[styles.imagePreviewWrap, { marginTop: 10, height: 100 }]}>
                <Image source={{ uri: adImage }} style={styles.imagePreview} contentFit="contain" />
                <TouchableOpacity
                  style={styles.removeImageBtn}
                  onPress={() => setAdImage(null)}
                >
                  <Ionicons name="close" size={16} color="#FFF" />
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.promptBtnRow}>
              <TouchableOpacity
                style={styles.promptCancelBtn}
                onPress={() => setAdModalVisible(false)}
              >
                <Text style={styles.promptCancelText}>रद्द करें</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.promptSubmitBtn, { backgroundColor: BrandColors.primary }]}
                onPress={handleSaveAd}
                disabled={submittingAd}
              >
                {submittingAd ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.promptSubmitText}>सहेजें (Save)</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* ================= SUB-COMPONENTS ================= */

function SidebarItem({
  icon,
  label,
  active,
  onPress,
  badge,
  badgeColor,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active: boolean;
  onPress: () => void;
  badge?: string;
  badgeColor?: string;
}) {
  return (
    <TouchableOpacity
      style={[styles.sidebarItem, active && styles.activeSidebarItem]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons
        name={icon}
        size={18}
        color={active ? "#FFF" : "#94A3B8"}
        style={styles.sidebarIcon}
      />
      <Text style={[styles.sidebarItemText, active && styles.activeSidebarItemText]}>
        {label}
      </Text>
      {badge && (
        <View style={[styles.sidebarBadge, { backgroundColor: badgeColor || "#334155" }]}>
          <Text style={styles.sidebarBadgeText}>{badge}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

function KpiCard({
  icon,
  title,
  value,
  color,
  subValue,
  style,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
  color: string;
  subValue: string;
  style?: any;
}) {
  return (
    <View style={[styles.kpiCard, style]}>
      <View style={styles.kpiTop}>
        <Text style={styles.kpiTitle} numberOfLines={1}>{title}</Text>
        <View style={[styles.kpiIconBox, { backgroundColor: color + "18" }]}>
          <Ionicons name={icon} size={18} color={color} />
        </View>
      </View>
      <Text style={styles.kpiValue}>{value}</Text>
      <Text style={styles.kpiSub} numberOfLines={2}>{subValue}</Text>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#09090B",
  },
  topNav: {
    height: 58,
    backgroundColor: "#18181B",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#27272A",
  },
  topNavLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuToggle: {
    padding: 4,
  },
  navBrandBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  navLogo: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: BrandColors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  navBrandText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  navSubBrand: {
    color: "#FCA5A5",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  topNavRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  liveDeskPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 5,
  },
  liveGreenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#22C55E",
  },
  liveDeskText: {
    color: "#FFF",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  quickAddNewsBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BrandColors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  quickAddNewsText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "800",
  },
  refreshIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: "#27272A",
    alignItems: "center",
    justifyContent: "center",
  },
  exitBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: "#27272A",
    alignItems: "center",
    justifyContent: "center",
  },
  mainLayout: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: BrandColors.background,
  },
  sidebar: {
    width: 250,
    backgroundColor: "#18181B",
    borderRightWidth: 1,
    borderRightColor: "#27272A",
  },
  sidebarDrawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 100,
    ...Shadows.lg,
  },
  drawerBackdrop: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.65)",
    zIndex: 90,
  },
  drawerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#27272A",
    backgroundColor: "#111113",
  },
  drawerHeaderBrand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  drawerHeaderTitle: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "800",
  },
  drawerCloseBtn: {
    padding: 4,
  },
  sidebarScroll: {
    paddingVertical: 12,
  },
  sidebarSectionLabel: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 6,
  },
  sidebarLabelText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#71717A",
    letterSpacing: 0.8,
  },
  sidebarItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  activeSidebarItem: {
    backgroundColor: BrandColors.primary,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  sidebarIcon: {
    width: 20,
  },
  sidebarItemText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
    color: "#CBD5E1",
  },
  activeSidebarItemText: {
    color: "#FFF",
    fontWeight: "800",
  },
  sidebarBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  sidebarBadgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "800",
  },
  contentArea: {
    flex: 1,
    backgroundColor: BrandColors.background,
  },
  contentScroll: {
    padding: 16,
    paddingBottom: 80,
  },
  centerLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: BrandColors.textSecondary,
    fontWeight: "600",
  },
  tabContainer: {
    gap: 16,
  },
  pageHeader: {
    marginBottom: 4,
  },
  pageHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: BrandColors.charcoal,
  },
  pageSubtitle: {
    fontSize: 12,
    color: BrandColors.textSecondary,
    marginTop: 2,
  },
  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  kpiCard: {
    flex: 1,
    minWidth: 150,
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: BrandColors.border,
    ...Shadows.sm,
  },
  kpiTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  kpiTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: BrandColors.textSecondary,
    flex: 1,
  },
  kpiIconBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: "900",
    color: BrandColors.charcoal,
  },
  kpiSub: {
    fontSize: 10,
    color: BrandColors.textMuted,
    marginTop: 4,
  },
  quickActionsBar: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  actionBigBtn: {
    flex: 1,
    minWidth: 140,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  actionBigBtnText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "800",
  },
  tableCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: BrandColors.border,
    gap: 10,
    ...Shadows.sm,
  },
  tableCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  tableCardTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: BrandColors.charcoal,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: "700",
    color: BrandColors.primary,
  },
  miniNewsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.borderLight,
    gap: 10,
  },
  miniNewsThumb: {
    width: 44,
    height: 38,
    borderRadius: 6,
    backgroundColor: "#1E293B",
  },
  miniNewsTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: BrandColors.charcoal,
  },
  miniNewsMeta: {
    fontSize: 10,
    color: BrandColors.textMuted,
    marginTop: 2,
  },
  statusPillSmall: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  publishedPill: {
    backgroundColor: "#DCFCE7",
  },
  draftPill: {
    backgroundColor: "#FEF3C7",
  },
  pendingPill: {
    backgroundColor: "#FEF08A",
  },
  statusPillSmallText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#166534",
  },
  primaryAddBtn: {
    backgroundColor: BrandColors.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
  },
  primaryAddBtnText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "800",
  },
  filterBar: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    alignItems: "center",
  },
  filterSearchBox: {
    flex: 1,
    minWidth: 160,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    borderWidth: 1,
    borderColor: BrandColors.border,
    gap: 8,
  },
  filterSearchInput: {
    flex: 1,
    fontSize: 12,
    color: BrandColors.charcoal,
  },
  statusFilterGroup: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BrandColors.border,
    overflow: "hidden",
  },
  statusFilterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  activeStatusFilterBtn: {
    backgroundColor: BrandColors.primary,
  },
  statusFilterText: {
    fontSize: 11,
    fontWeight: "700",
    color: BrandColors.textSecondary,
  },
  activeStatusFilterText: {
    color: "#FFF",
  },
  newsAdminCard: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 12,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: BrandColors.border,
    gap: 12,
    alignItems: "center",
    ...Shadows.sm,
  },
  newsAdminThumb: {
    width: 74,
    height: 64,
    borderRadius: 6,
    backgroundColor: "#1E293B",
  },
  newsAdminMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  adminCatBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  adminCatBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: BrandColors.primaryDark,
  },
  adminDateText: {
    fontSize: 10,
    color: BrandColors.textMuted,
  },
  newsAdminTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: BrandColors.charcoal,
    lineHeight: 18,
  },
  newsAdminMetrics: {
    flexDirection: "row",
    gap: 10,
  },
  newsMetricText: {
    fontSize: 10,
    color: BrandColors.textMuted,
  },
  adminActionGroup: {
    flexDirection: "row",
    gap: 6,
  },
  editActionBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteActionBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
  },

  // Breaking
  breakingAdminCard: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: BrandColors.border,
    gap: 8,
    ...Shadows.sm,
  },
  breakingHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  breakingPillActive: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  breakingPillActiveText: {
    fontSize: 10,
    fontWeight: "800",
    color: BrandColors.primaryDark,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  switchLabel: {
    fontSize: 11,
    color: BrandColors.textSecondary,
    fontWeight: "600",
  },
  breakingCardText: {
    fontSize: 13,
    fontWeight: "700",
    color: BrandColors.charcoal,
    lineHeight: 18,
  },
  breakingFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: BrandColors.borderLight,
    paddingTop: 8,
  },
  breakingTime: {
    fontSize: 10,
    color: BrandColors.textMuted,
  },

  // Banners
  bannerGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  bannerAdminCard: {
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: BrandColors.border,
  },
  bannerAdminImg: {
    width: "100%",
    height: 110,
    backgroundColor: "#1E293B",
  },
  bannerAdminInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
  },
  bannerAdminStats: {
    fontSize: 10,
    color: BrandColors.textMuted,
  },

  // Epaper & Gallery
  epaperAdminCard: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: BrandColors.border,
  },
  epaperAdminTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: BrandColors.charcoal,
  },
  epaperAdminMeta: {
    fontSize: 11,
    color: BrandColors.textMuted,
    marginTop: 2,
  },

  // Citizen
  citizenCard: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: BrandColors.border,
    gap: 8,
    ...Shadows.sm,
  },
  citizenHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  citizenReporterInfo: {
    gap: 2,
  },
  reporterNameText: {
    fontSize: 13,
    fontWeight: "800",
    color: BrandColors.charcoal,
  },
  reporterPhoneText: {
    fontSize: 11,
    color: BrandColors.textSecondary,
  },
  reporterLocationText: {
    fontSize: 10,
    color: BrandColors.textMuted,
  },
  citizenTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: BrandColors.charcoal,
  },
  citizenBody: {
    fontSize: 12,
    color: BrandColors.textSecondary,
    lineHeight: 17,
  },
  citizenActionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: BrandColors.borderLight,
    paddingTop: 8,
  },
  approveBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#16A34A",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  approveBtnText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "800",
  },
  rejectBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DC2626",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  rejectBtnText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "800",
  },

  // Notifications History
  notifHistoryRow: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.borderLight,
  },
  notifHistoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },
  notifHistoryTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: BrandColors.charcoal,
  },
  notifHistoryMessage: {
    fontSize: 11,
    color: BrandColors.textSecondary,
    marginTop: 1,
  },
  notifHistoryTime: {
    fontSize: 9,
    color: BrandColors.textMuted,
    marginTop: 2,
  },

  // ID Cards
  idCardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  pressIdCard: {
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: BrandColors.border,
    ...Shadows.sm,
  },
  pressIdHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.borderLight,
    paddingBottom: 4,
  },
  pressIdOrg: {
    fontSize: 10,
    fontWeight: "900",
    color: BrandColors.primaryDark,
  },
  pressIdEmpId: {
    fontSize: 10,
    fontWeight: "800",
    color: BrandColors.charcoal,
  },
  pressIdBody: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  pressIdPhoto: {
    width: 44,
    height: 52,
    borderRadius: 4,
    backgroundColor: "#1E293B",
  },
  pressIdPhotoPlaceholder: {
    width: 44,
    height: 52,
    borderRadius: 4,
    backgroundColor: BrandColors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  pressIdName: {
    fontSize: 12,
    fontWeight: "800",
    color: BrandColors.charcoal,
  },
  pressIdRole: {
    fontSize: 10,
    color: BrandColors.textSecondary,
  },
  pressIdValid: {
    fontSize: 9,
    color: BrandColors.textMuted,
    marginTop: 2,
  },

  // Contacts
  contactCard: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: BrandColors.border,
    gap: 6,
  },
  contactHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  contactName: {
    fontSize: 13,
    fontWeight: "800",
    color: BrandColors.charcoal,
  },
  contactPhone: {
    fontSize: 11,
    color: BrandColors.textSecondary,
  },
  contactMessage: {
    fontSize: 12,
    color: BrandColors.charcoal,
    lineHeight: 18,
  },
  contactTime: {
    fontSize: 10,
    color: BrandColors.textMuted,
  },

  // Settings
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.borderLight,
  },
  settingLabel: {
    fontSize: 13,
    color: BrandColors.textSecondary,
    fontWeight: "600",
  },
  settingVal: {
    fontSize: 13,
    color: BrandColors.charcoal,
    fontWeight: "700",
  },
  logoutBigBtn: {
    backgroundColor: BrandColors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    marginTop: 14,
  },
  logoutBigBtnText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "800",
  },

  // Modals
  modalSafe: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  modalInnerContainer: {
    flex: 1,
    width: "100%",
  },
  desktopModalInner: {
    width: "100%",
    maxWidth: 740,
    alignSelf: "center",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.border,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: BrandColors.charcoal,
  },
  modalSaveBtn: {
    backgroundColor: BrandColors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
  modalSaveText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "800",
  },
  modalScroll: {
    padding: 16,
    paddingBottom: 60,
    gap: 14,
  },
  formGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: BrandColors.charcoal,
    letterSpacing: 0.5,
  },
  textInput: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: BrandColors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: BrandColors.charcoal,
  },
  catPillRow: {
    gap: 8,
    paddingVertical: 4,
  },
  catSelectPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: BrandColors.border,
  },
  activeCatSelectPill: {
    backgroundColor: BrandColors.primary,
    borderColor: BrandColors.primaryDark,
  },
  catSelectText: {
    fontSize: 11,
    fontWeight: "700",
    color: BrandColors.textSecondary,
  },
  activeCatSelectText: {
    color: "#FFF",
  },
  imagePickerBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: BrandColors.primary,
    backgroundColor: "#FFF5F5",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  imagePickerText: {
    color: BrandColors.primaryDark,
    fontSize: 12,
    fontWeight: "800",
  },
  imagePreviewWrap: {
    position: "relative",
    width: "100%",
    height: 160,
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 8,
  },
  imagePreview: {
    width: "100%",
    height: "100%",
  },
  removeImageBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.7)",
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  statusToggleRow: {
    flexDirection: "row",
    gap: 10,
  },
  statusToggleBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BrandColors.border,
    backgroundColor: "#F9FAFB",
    gap: 6,
  },
  activePublishBtn: {
    backgroundColor: "#16A34A",
    borderColor: "#15803D",
  },
  activeDraftBtn: {
    backgroundColor: "#D97706",
    borderColor: "#B45309",
  },
  statusToggleText: {
    fontSize: 11,
    fontWeight: "800",
    color: BrandColors.charcoal,
  },
  activeStatusToggleText: {
    color: "#FFF",
  },

  // Notification Preview Card
  notificationPreviewCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BrandColors.border,
    padding: 14,
    gap: 10,
  },
  notifPreviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  notifPreviewTitle: {
    fontSize: 12,
    fontWeight: "900",
    color: BrandColors.charcoal,
  },
  mockDeviceAlert: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 4,
  },
  mockAlertHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  mockAppBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BrandColors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    gap: 3,
  },
  mockAppName: {
    color: "#FFF",
    fontSize: 8,
    fontWeight: "900",
  },
  mockTime: {
    fontSize: 9,
    color: BrandColors.textMuted,
  },
  mockHeadline: {
    fontSize: 12,
    fontWeight: "800",
    color: BrandColors.charcoal,
  },
  mockBody: {
    fontSize: 11,
    color: BrandColors.textSecondary,
    lineHeight: 15,
  },
  autoDispatchNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 6,
  },
  autoDispatchText: {
    fontSize: 10,
    color: "#16A34A",
    fontWeight: "700",
    flex: 1,
  },
  mockDraftNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 10,
    backgroundColor: "#FFFBEB",
    borderRadius: 6,
  },
  mockDraftText: {
    fontSize: 11,
    color: "#92400E",
    fontWeight: "600",
  },

  // Audience Card
  audienceInfoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    padding: 12,
    borderRadius: 8,
    gap: 10,
  },
  audienceTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#1E40AF",
  },
  audienceDesc: {
    fontSize: 11,
    color: "#3B82F6",
    marginTop: 2,
  },

  // Prompts
  promptOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  promptCard: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 18,
    gap: 8,
  },
  promptTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: BrandColors.charcoal,
  },
  promptBtnRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 10,
  },
  promptCancelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  promptCancelText: {
    fontSize: 12,
    fontWeight: "700",
    color: BrandColors.textSecondary,
  },
  promptSubmitBtn: {
    backgroundColor: BrandColors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  promptSubmitText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "800",
  },
});