import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { BrandColors } from "@/constants/theme";

interface CategoryBarProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryBar({
  categories,
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
        {categories.map((cat) => {
          const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, isSelected && styles.activeChip]}
              onPress={() => onSelectCategory(cat.toLowerCase())}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, isSelected && styles.activeChipText]}>
                {cat}
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
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.borderLight,
  },
  scrollContent: {
    paddingHorizontal: 14,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: BrandColors.border,
  },
  activeChip: {
    backgroundColor: BrandColors.primary,
    borderColor: BrandColors.primaryDark,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "700",
    color: BrandColors.textSecondary,
  },
  activeChipText: {
    color: BrandColors.white,
  },
});
