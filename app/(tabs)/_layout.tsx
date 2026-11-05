import React from "react";
import { View, Platform, StyleSheet, Text } from "react-native";
import { Tabs } from "expo-router";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { BrandColors, Shadows } from "@/constants/theme";
import { HapticTab } from "@/components/haptic-tab";

function TabBarIndicator({ focused }: { focused: boolean }) {
  if (!focused) return null;
  return <View style={styles.topIndicator} />;
}

function LiveBeaconDot() {
  return (
    <View style={styles.beaconDotWrap}>
      <View style={styles.beaconDot} />
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: BrandColors.primary,
        tabBarInactiveTintColor: "#64748B",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          height: Platform.OS === "ios" ? 84 : 64,
          paddingBottom: Platform.OS === "ios" ? 24 : 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: "#E2E8F0",
          elevation: 12,
          shadowColor: "#0F172A",
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.08,
          shadowRadius: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "800",
          marginTop: 2,
          letterSpacing: 0.2,
        },
      }}
    >
      {/* 1. होम (Home) */}
      <Tabs.Screen
        name="index"
        options={{
          title: "होम",
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconWrapper}>
              <TabBarIndicator focused={focused} />
              <MaterialCommunityIcons
                name={focused ? "home-variant" : "home-variant-outline"}
                size={23}
                color={color}
              />
            </View>
          ),
        }}
      />

      {/* 2. वीडियो (Video) */}
      <Tabs.Screen
        name="categories"
        options={{
          title: "वीडियो",
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconWrapper}>
              <TabBarIndicator focused={focused} />
              <MaterialCommunityIcons
                name={focused ? "play-box-multiple" : "play-box-multiple-outline"}
                size={22}
                color={color}
              />
            </View>
          ),
        }}
      />

      {/* 3. लाइव (Live) - With Pulsing Live Beacon */}
      <Tabs.Screen
        name="live"
        options={{
          title: "लाइव",
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconWrapper}>
              <TabBarIndicator focused={focused} />
              <View style={styles.liveIconBadgeContainer}>
                <MaterialCommunityIcons
                  name={focused ? "broadcast" : "broadcast"}
                  size={22}
                  color={focused ? BrandColors.primary : color}
                />
                <LiveBeaconDot />
              </View>
            </View>
          ),
        }}
      />

      {/* 4. ई-पेपर (E-Paper) */}
      <Tabs.Screen
        name="epaper"
        options={{
          title: "ई-पेपर",
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconWrapper}>
              <TabBarIndicator focused={focused} />
              <MaterialCommunityIcons
                name={focused ? "book-open-page-variant" : "book-open-page-variant-outline"}
                size={22}
                color={color}
              />
            </View>
          ),
        }}
      />

      {/* 5. प्रोफाइल (Profile / Bureau) */}
      <Tabs.Screen
        name="settings"
        options={{
          title: "प्रोफाइल",
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconWrapper}>
              <TabBarIndicator focused={focused} />
              <Ionicons
                name={focused ? "person-circle" : "person-circle-outline"}
                size={23}
                color={color}
              />
            </View>
          ),
        }}
      />

      {/* Trending kept registered for direct links, hidden from tab bar */}
      <Tabs.Screen
        name="trending"
        options={{
          href: null,
          title: "ट्रेंडिंग",
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    width: 32,
    height: 28,
  },
  topIndicator: {
    position: "absolute",
    top: -8,
    width: 22,
    height: 3,
    borderRadius: 2,
    backgroundColor: BrandColors.primary,
  },
  liveIconBadgeContainer: {
    position: "relative",
  },
  beaconDotWrap: {
    position: "absolute",
    top: -2,
    right: -4,
    backgroundColor: "#FFF",
    borderRadius: 5,
    padding: 1,
  },
  beaconDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: BrandColors.primary,
  },
});