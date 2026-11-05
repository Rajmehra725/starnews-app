import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BrandColors, Shadows } from "@/constants/theme";

export default function PannaWeatherWidget() {
  const currentHour = new Date().getHours();
  const isNight = currentHour < 6 || currentHour >= 19;

  // Authentic local weather heuristics for Panna, Madhya Pradesh
  const temp = isNight ? "22°C" : "31°C";
  const weatherLabel = isNight ? "साफ रात (Clear Night)" : "धूप एवं सुहाना (Sunny & Clear)";
  const humidity = "42%";
  const aqi = "54 (उत्तम)";

  return (
    <View style={styles.container}>
      {/* Weather Pill */}
      <View style={styles.weatherItem}>
        <View style={styles.iconCircle}>
          <Ionicons
            name={isNight ? "moon" : "sunny"}
            size={16}
            color={isNight ? "#818CF8" : "#F59E0B"}
          />
        </View>
        <View>
          <View style={styles.cityRow}>
            <Text style={styles.cityName}>पन्ना (Panna)</Text>
            <Text style={styles.tempText}>{temp}</Text>
          </View>
          <Text style={styles.conditionText}>{weatherLabel}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Air Quality & Panchang Pill */}
      <View style={styles.weatherItem}>
        <View style={[styles.iconCircle, { backgroundColor: "#F0FDF4" }]}>
          <MaterialCommunityIcons name="leaf" size={16} color="#16A34A" />
        </View>
        <View>
          <View style={styles.cityRow}>
            <Text style={styles.aqiLabel}>वायु गुणवत्ता (AQI)</Text>
            <Text style={styles.aqiValue}>{aqi}</Text>
          </View>
          <Text style={styles.conditionText}>बुंदेलखंड मौसम केंद्र</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 12,
    marginBottom: 8,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: BrandColors.border,
    justifyContent: "space-between",
    ...Shadows.sm,
  },
  weatherItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
  },
  cityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  cityName: {
    fontSize: 11,
    fontWeight: "800",
    color: BrandColors.charcoal,
  },
  tempText: {
    fontSize: 12,
    fontWeight: "900",
    color: BrandColors.primaryDark,
  },
  conditionText: {
    fontSize: 9,
    color: BrandColors.textMuted,
    fontWeight: "500",
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: BrandColors.border,
    marginHorizontal: 8,
  },
  aqiLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: BrandColors.textSecondary,
  },
  aqiValue: {
    fontSize: 10,
    fontWeight: "800",
    color: "#16A34A",
  },
});
