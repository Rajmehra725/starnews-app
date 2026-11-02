import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { BrandColors, Shadows } from "@/constants/theme";
import { NewsArticle } from "@/_services/api";
import NewsCard from "@/components/NewsCard";

const SAVED_ARTICLES_KEY = "@starnews_saved_articles";

export default function SavedArticlesScreen() {
  const [savedArticles, setSavedArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSavedArticles = async () => {
    try {
      setLoading(true);
      const json = await AsyncStorage.getItem(SAVED_ARTICLES_KEY);
      if (json) {
        const parsed = JSON.parse(json);
        if (Array.isArray(parsed)) {
          setSavedArticles(parsed);
        }
      } else {
        setSavedArticles([]);
      }
    } catch (e) {
      console.log("Error loading saved articles:", e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSavedArticles();
    }, [])
  );

  const handleClearAll = () => {
    if (savedArticles.length === 0) return;
    Alert.alert(
      "बुकमार्क हटाएं",
      "क्या आप सहेजे गए सभी समाचारों को हटाना चाहते हैं?",
      [
        { text: "रद्द करें", style: "cancel" },
        {
          text: "सभी हटाएं",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem(SAVED_ARTICLES_KEY);
            setSavedArticles([]);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor={BrandColors.primaryDark} />

      {/* Top Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>सहेजे गए समाचार</Text>
          <Text style={styles.headerSubtitle}>
            {savedArticles.length} लेख बुकमार्क किए गए
          </Text>
        </View>

        {savedArticles.length > 0 && (
          <TouchableOpacity style={styles.clearBtn} onPress={handleClearAll}>
            <Ionicons name="trash-outline" size={18} color="#FFF" />
            <Text style={styles.clearBtnText}>हटाएं</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      {savedArticles.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="bookmark-outline" size={48} color={BrandColors.primary} />
          </View>
          <Text style={styles.emptyTitle}>कोई सहेजा गया समाचार नहीं</Text>
          <Text style={styles.emptyDesc}>
            किसी भी समाचार पर बुकमार्क आइकन दबाकर उसे बाद में पढ़ने के लिए यहाँ सहेजें।
          </Text>
          <TouchableOpacity
            style={styles.exploreBtn}
            onPress={() => router.replace("/(tabs)")}
          >
            <Text style={styles.exploreBtnText}>ताज़ा खबरें पढ़ें</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={savedArticles}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <NewsCard
              article={item}
              onPress={() => router.push(`/news/${item._id}`)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BrandColors.background,
  },
  header: {
    backgroundColor: BrandColors.primaryDark,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "800",
  },
  headerSubtitle: {
    color: "#FCA5A5",
    fontSize: 12,
    marginTop: 1,
  },
  clearBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  clearBtnText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
  },
  listContent: {
    padding: 12,
    gap: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: BrandColors.charcoal,
    textAlign: "center",
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    color: BrandColors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  exploreBtn: {
    backgroundColor: BrandColors.primary,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 8,
    ...Shadows.sm,
  },
  exploreBtnText: {
    color: "#FFF",
    fontWeight: "800",
    fontSize: 15,
  },
});
