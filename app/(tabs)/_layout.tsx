import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { HapticTab } from '@/components/haptic-tab';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: "#38bdf8",
        tabBarInactiveTintColor: "#94a3b8",

        tabBarStyle: {
          backgroundColor: "#0f172a",
          borderTopWidth: 0,
          height: 65,
          paddingBottom: 5,
          paddingTop: 5,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 4,
        },
      }}
    >

      {/* 🏠 Home - Newspaper / News Feed */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "newspaper-variant" : "newspaper-variant-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* 📂 Categories - Folder / Sections */}
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "view-grid" : "view-grid-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* 🔥 Trending - Viral / Hot News */}
    <Tabs.Screen
  name="trending"
  options={{
    title: 'Trending',
    tabBarIcon: ({ color, size }) => (
      <MaterialCommunityIcons
        name="fire"
        size={size}
        color={color}
      />
    ),
  }}
/>

      {/* 📺 Live News */}
      <Tabs.Screen
        name="live"
        options={{
          title: 'Live',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "broadcast" : "broadcast-off"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* 🔔 Notifications - Alerts */}
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "notifications" : "notifications-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* ⚙️ Settings */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

    </Tabs>
  );
}