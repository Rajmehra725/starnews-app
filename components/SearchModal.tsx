import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { BrandColors, Shadows } from "@/constants/theme";
import { NewsArticle } from "@/_services/api";
import NewsCard from "@/components/NewsCard";

interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
  newsList: NewsArticle[];
}

const TRENDING_SEARCH_TAGS = [
  "📍 पन्ना",
  "💎 हीरा खदान",
  "अमानगंज",
  "पवई",
  "गुन्नौर",
  "मध्य प्रदेश",
  "अपराध",
  "राजनीति",
  "मौसम",
];

export default function SearchModal({
  visible,
  onClose,
  newsList,
}: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");

  const categories = useMemo(() => {
    const set = new Set(newsList.map((n) => n.category).filter(Boolean));
    return ["All", ...(Array.from(set) as string[])];
  }, [newsList]);

  const filteredNews = useMemo(() => {
    if (!query.trim() && selectedCat === "All") return [];

    const cleanQuery = query.replace("📍 ", "").replace("💎 ", "").trim().toLowerCase();

    return newsList.filter((item) => {
      const matchesQuery = cleanQuery
        ? item.title?.toLowerCase().includes(cleanQuery) ||
          item.description?.toLowerCase().includes(cleanQuery) ||
          item.content?.toLowerCase().includes(cleanQuery) ||
          item.category?.toLowerCase().includes(cleanQuery)
        : true;

      const matchesCat =
        selectedCat === "All" ||
        item.category?.toLowerCase() === selectedCat.toLowerCase();

      return matchesQuery && matchesCat;
    });
  }, [newsList, query, selectedCat]);

  const handleSelectArticle = (id: string) => {
    onClose();
    router.push({
      pathname: "/news/[id]",
      params: { id },
    });
  };

  const handleQuickTagPress = (tag: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setQuery(tag);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" />

        {/* Search Header */}
        <View style={styles.header}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color={BrandColors.primary} />
            <TextInput
              style={styles.input}
              placeholder="पन्ना, मध्य प्रदेश या विषय खोजें..."
              placeholderTextColor={BrandColors.textMuted}
              value={query}
              onChangeText={setQuery}
              autoFocus
              returnKeyType="search"
            />
            {query.length > 0 && (
              <TouchableOpacity
                onPress={() => setQuery("")}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close-circle" size={18} color={BrandColors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>रद्द करें</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Trending Suggestions Bar */}
        <View style={styles.trendingContainer}>
          <View style={styles.trendingHeader}>
            <MaterialCommunityIcons name="fire" size={14} color={BrandColors.primary} />
            <Text style={styles.trendingTitle}>लोकप्रिय खोज (Trending):</Text>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={TRENDING_SEARCH_TAGS}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.trendingList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.trendTag,
                  query.includes(item.replace("📍 ", "").replace("💎 ", "")) &&
                    styles.activeTrendTag,
                ]}
                onPress={() => handleQuickTagPress(item)}
              >
                <Text
                  style={[
                    styles.trendTagText,
                    query.includes(item.replace("📍 ", "").replace("💎 ", "")) &&
                      styles.activeTrendTagText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Category Filters Bar */}
        {categories.length > 1 && (
          <View style={styles.categoryContainer}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={categories}
              keyExtractor={(item) => item}
              contentContainerStyle={styles.categoryList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.catChip,
                    selectedCat === item && styles.activeCatChip,
                  ]}
                  onPress={() => setSelectedCat(item)}
                >
                  <Text
                    style={[
                      styles.catText,
                      selectedCat === item && styles.activeCatText,
                    ]}
                  >
                    {item === "All" ? "सभी श्रेणियां" : item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* Results Info Bar */}
        {filteredNews.length > 0 && (
          <View style={styles.resultCountBar}>
            <Text style={styles.resultCountText}>
              कुल {filteredNews.length} समाचार प्राप्त हुए
            </Text>
          </View>
        )}

        {/* Results List */}
        <FlatList
          data={filteredNews}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.resultsList}
          renderItem={({ item }) => (
            <NewsCard
              article={item}
              variant="compact"
              onPress={() => handleSelectArticle(item._id)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name={query.trim() ? "search-outline" : "newspaper-outline"}
                size={48}
                color={BrandColors.textMuted}
              />
              <Text style={styles.emptyTitle}>
                {query.trim()
                  ? "कोई परिणाम नहीं मिला (No Results Found)"
                  : "स्टार न्यूज़ नेटवर्क में खोजें"}
              </Text>
              <Text style={styles.emptySubtitle}>
                {query.trim()
                  ? `"${query}" के लिए कोई खबर नहीं मिली। कृपया कोई अन्य शब्द खोजें।`
                  : "पन्ना, मध्य प्रदेश, अपराध, राजनीति या स्थानीय समाचार कीवर्ड टाइप करें"}
              </Text>
            </View>
          }
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BrandColors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: BrandColors.white,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.border,
    gap: 10,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
    borderWidth: 1,
    borderColor: BrandColors.borderLight,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: BrandColors.charcoal,
    height: "100%",
  },
  cancelBtn: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "700",
    color: BrandColors.primary,
  },
  trendingContainer: {
    backgroundColor: BrandColors.white,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.borderLight,
  },
  trendingHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 14,
    marginBottom: 6,
  },
  trendingTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: BrandColors.textSecondary,
  },
  trendingList: {
    paddingHorizontal: 14,
    gap: 6,
  },
  trendTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#FEE2E2",
  },
  activeTrendTag: {
    backgroundColor: BrandColors.primary,
  },
  trendTagText: {
    fontSize: 11,
    fontWeight: "700",
    color: BrandColors.primaryDark,
  },
  activeTrendTagText: {
    color: "#FFF",
  },
  categoryContainer: {
    backgroundColor: BrandColors.white,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.borderLight,
  },
  categoryList: {
    paddingHorizontal: 14,
    gap: 8,
  },
  catChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: BrandColors.border,
  },
  activeCatChip: {
    backgroundColor: BrandColors.primary,
    borderColor: BrandColors.primaryDark,
  },
  catText: {
    fontSize: 11,
    fontWeight: "600",
    color: BrandColors.textSecondary,
  },
  activeCatText: {
    color: "#FFF",
  },
  resultCountBar: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#F8FAFC",
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.borderLight,
  },
  resultCountText: {
    fontSize: 11,
    fontWeight: "700",
    color: BrandColors.textSecondary,
  },
  resultsList: {
    paddingVertical: 8,
    flexGrow: 1,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    paddingHorizontal: 30,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: BrandColors.charcoal,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 12,
    color: BrandColors.textSecondary,
    textAlign: "center",
    lineHeight: 18,
  },
});
