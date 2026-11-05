import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BrandColors, Shadows } from "@/constants/theme";

export interface CategoryItem {
  id: string;
  name: string;
  hindi: string;
  icon?: string;
  isSpecial?: boolean;
}

export const HOME_CATEGORIES: CategoryItem[] = [
  { id: "panna", name: "Panna", hindi: "📍 पन्ना", isSpecial: true },
  { id: "all", name: "All", hindi: "ताज़ा खबरें" },
  { id: "madhya pradesh", name: "Madhya Pradesh", hindi: "मध्य प्रदेश" },
  { id: "satna", name: "Satna", hindi: "सतना" },
  { id: "chhatarpur", name: "Chhatarpur", hindi: "छतरपुर" },
  { id: "desh", name: "Desh", hindi: "देश-दुनिया" },
  { id: "politics", name: "Politics", hindi: "राजनीति" },
  { id: "crime", name: "Crime", hindi: "अपराध" },
  { id: "education", name: "Education", hindi: "शिक्षा" },
  { id: "sports", name: "Sports", hindi: "खेल" },
  { id: "entertainment", name: "Entertainment", hindi: "मनोरंजन" },
  { id: "business", name: "Business", hindi: "व्यापार" },
];

interface CategoryBarProps {
  categories?: (string | CategoryItem)[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryBar({
  categories = HOME_CATEGORIES,
  selectedCategory,
  onSelectCategory,
}: CategoryBarProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((item) => {
          const catId = typeof item === "string" ? item.toLowerCase() : item.id.toLowerCase();
          const catLabel = typeof item === "string" ? item : item.hindi;
          const isSpecial = typeof item === "object" && item.isSpecial;
          const isSelected = selectedCategory.toLowerCase() === catId;

          return (
            <TouchableOpacity
              key={catId}
              style={[
                styles.chip,
                isSpecial && styles.specialChip,
                isSelected && styles.activeChip,
              ]}
              onPress={() => onSelectCategory(catId)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.chipText,
                  isSpecial && styles.specialChipText,
                  isSelected && styles.activeChipText,
                ]}
              >
                {catLabel}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: BrandColors.white,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.borderLight,
    ...Shadows.sm,
  },
  scrollContent: {
    paddingHorizontal: 12,
    gap: 7,
  },
  chip: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: BrandColors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  specialChip: {
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0",
  },
  activeChip: {
    backgroundColor: BrandColors.primary,
    borderColor: BrandColors.primaryDark,
    ...Shadows.brandGlow,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "700",
    color: BrandColors.textSecondary,
  },
  specialChipText: {
    color: "#065F46",
    fontWeight: "800",
  },
  activeChipText: {
    color: BrandColors.white,
    fontWeight: "900",
  },
});
