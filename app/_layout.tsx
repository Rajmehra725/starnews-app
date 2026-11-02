import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider as PaperProvider } from "react-native-paper";

import { useEffect, useState } from "react";

import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "../_services/notifications";

export const unstable_settings = {
  anchor: "(tabs)",
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  const [isDark, setIsDark] = useState(false);

  // Theme
  useEffect(() => {
    const updateTheme = () => {
      const hour = new Date().getHours();
      setIsDark(!(hour >= 5 && hour < 19));
    };

    updateTheme();

    const interval = setInterval(updateTheme, 60000);

    return () => clearInterval(interval);
  }, []);

  // Notifications
  useEffect(() => {
    async function setupNotifications() {
      try {
        const token = await registerForPushNotificationsAsync();

        console.log("📲 Push Token:", token);

        if (!token) return;

        await fetch(
          "https://starnewsbackend.onrender.com/api/save-token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          }
        );
      } catch (error) {
        console.log("❌ Setup Notification Error:", error);
      }
    }

    setupNotifications();

    // Notification received
    const sub1 =
      Notifications.addNotificationReceivedListener(
        (notification) => {
          console.log(
            "🔔 Notification Received:",
            notification
          );
        }
      );

    // Notification clicked
    const sub2 =
      Notifications.addNotificationResponseReceivedListener(
        (response) => {
          const data =
            response.notification.request.content.data;

          console.log(
            "📲 Notification Clicked:",
            data
          );

          if (data?.newsId) {
            router.push(`/news/${data.newsId}`);
          }
        }
      );

    // App killed state
    const checkInitialNotification = async () => {
      const response =
        await Notifications.getLastNotificationResponseAsync();

      if (!response) return;

      const data =
        response.notification.request.content.data;

      console.log(
        "🚀 Opened From Notification:",
        data
      );

      if (data?.newsId) {
        router.push(`/news/${data.newsId}`);
      }
    };

    checkInitialNotification();

    return () => {
      sub1.remove();
      sub2.remove();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <ThemeProvider
          value={isDark ? DarkTheme : DefaultTheme}
        >
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="(tabs)"
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="news/[id]"
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="login"
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="dashboard"
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="gallery"
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="live"
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="saved"
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="modal"
              options={{
                presentation: "modal",
                title: "Modal",
              }}
            />
          </Stack>

          <StatusBar
            style={isDark ? "light" : "dark"}
          />
        </ThemeProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}