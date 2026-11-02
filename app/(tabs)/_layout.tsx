import React from "react";
import { View, Platform, StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { BrandColors } from "@/constants/theme";
import { HapticTab } from "@/components/haptic-tab";

function TabBarIndicator({ focused }: { focused: boolean }) {
  if (!focused) return null;
  return <View style={styles.topIndicator} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: BrandColors.primary,
        tabBarInactiveTintColor: "#8C93A0",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          height: Platform.OS === "ios" ? 82 : 64,
          paddingBottom: Platform.OS === "ios" ? 22 : 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "800",
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "मुख्य (Home)",
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconWrapper}>
              <TabBarIndicator focused={focused} />
              <MaterialCommunityIcons
                name={focused ? "newspaper-variant" : "newspaper-variant-outline"}
                size={22}
                color={color}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="categories"
        options={{
          title: "वीडियो (Videos)",
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconWrapper}>
              <TabBarIndicator focused={focused} />
              <MaterialCommunityIcons
                name={focused ? "youtube-tv" : "television-play"}
                size={22}
                color={color}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="trending"
        options={{
          title: "ट्रेंडिंग (Top)",
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconWrapper}>
              <TabBarIndicator focused={focused} />
              <Ionicons
                name={focused ? "flame" : "flame-outline"}
                size={22}
                color={focused ? BrandColors.primary : color}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="epaper"
        options={{
          title: "ई-पेपर (E-Paper)",
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

      <Tabs.Screen
        name="settings"
        options={{
          title: "ब्यूरो (Bureau)",
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconWrapper}>
              <TabBarIndicator focused={focused} />
              <Ionicons
                name={focused ? "person-circle" : "person-circle-outline"}
                size={22}
                color={color}
              />
            </View>
          ),
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
  },
  topIndicator: {
    position: "absolute",
    top: -8,
    width: 20,
    height: 3,
    borderRadius: 2,
    backgroundColor: BrandColors.primary,
  },
});