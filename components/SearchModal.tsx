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
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { BrandColors } from "@/constants/theme";
import { NewsArticle } from "@/_services/api";
import NewsCard from "@/components/NewsCard";

interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
  newsList: NewsArticle[];
}

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
    
    return newsList.filter((item) => {
      const matchesQuery = query.trim()
        ? item.title?.toLowerCase().includes(query.toLowerCase()) ||
          item.description?.toLowerCase().includes(query.toLowerCase()) ||
          item.content?.toLowerCase().includes(query.toLowerCase())
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

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safe}>
        {/* Search Header */}
        <View style={styles.header}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color={BrandColors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="खोजें... (Search news, topics, location)"
              placeholderTextColor={BrandColors.textMuted}
              value={query}
              onChangeText={setQuery}
              autoFocus
              returnKeyType="search"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery("")} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close-circle" size={18} color={BrandColors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        {/* Categories Bar in Search */}
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
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

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
                  : "समाचार खोजने के लिए टाइप करें"}
              </Text>
              <Text style={styles.emptySubtitle}>
                {query.trim()
                  ? `"${query}" के लिए कोई खबर नहीं मिली। कृपया कोई दूसरा कीवर्ड खोजें।`
                  : "शीर्षक, स्थान या विषय लिखकर खोजें"}
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
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: BrandColors.charcoal,
    height: "100%",
  },
  cancelBtn: {
    paddingHorizontal: 4,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "700",
    color: BrandColors.primary,
  },
  categoryContainer: {
    backgroundColor: BrandColors.white,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.borderLight,
  },
  categoryList: {
    paddingHorizontal: 14,
    gap: 8,
  },
  catChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: BrandColors.border,
  },
  activeCatChip: {
    backgroundColor: BrandColors.primary,
    borderColor: BrandColors.primaryDark,
  },
  catText: {
    fontSize: 12,
    fontWeight: "600",
    color: BrandColors.textSecondary,
  },
  activeCatText: {
    color: "#FFF",
  },
  resultsList: {
    paddingVertical: 12,
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
    fontSize: 16,
    fontWeight: "700",
    color: BrandColors.charcoal,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 13,
    color: BrandColors.textSecondary,
    textAlign: "center",
    lineHeight: 18,
  },
});
