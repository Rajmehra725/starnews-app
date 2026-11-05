import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider as PaperProvider } from "react-native-paper";
import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import * as Notifications from "expo-notifications";

import { registerForPushNotificationsAsync } from "../_services/notifications";
import BrandSplash from "@/components/BrandSplash";

// Prevent the native splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync().catch(() => {});

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
  const [isAppReady, setIsAppReady] = useState(false);
  const [splashVisible, setSplashVisible] = useState(true);

  // Dynamic Theme
  useEffect(() => {
    const updateTheme = () => {
      const hour = new Date().getHours();
      setIsDark(!(hour >= 5 && hour < 19));
    };

    updateTheme();
    const interval = setInterval(updateTheme, 60000);
    return () => clearInterval(interval);
  }, []);

  // Application Startup & Notification Listeners
  useEffect(() => {
    async function setupApp() {
      try {
        // Native splash can be released to our animated BrandSplash component
        await SplashScreen.hideAsync().catch(() => {});

        // Setup notifications
        const token = await registerForPushNotificationsAsync();
        if (token) {
          fetch("https://starnewsbackend.onrender.com/api/save-token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          }).catch(() => {});
        }
      } catch (error) {
        console.log("App Setup Error:", error);
      } finally {
        // Mark app ready for animated splash cross-fade
        setIsAppReady(true);
      }
    }

    setupApp();

    // Foreground notification listener
    const sub1 = Notifications.addNotificationReceivedListener((notification) => {
      console.log("🔔 Notification Received:", notification);
    });

    // Notification tapped listener
    const sub2 = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      if (data?.newsId) {
        router.push(`/news/${data.newsId}`);
      }
    });

    // Cold boot notification check
    const checkInitialNotification = async () => {
      const response = await Notifications.getLastNotificationResponseAsync();
      if (response) {
        const data = response.notification.request.content.data;
        if (data?.newsId) {
          router.push(`/news/${data.newsId}`);
        }
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
        <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="news/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="dashboard" options={{ headerShown: false }} />
            <Stack.Screen name="gallery" options={{ headerShown: false }} />
            <Stack.Screen name="live" options={{ headerShown: false }} />
            <Stack.Screen name="saved" options={{ headerShown: false }} />
            <Stack.Screen
              name="shorts"
              options={{
                headerShown: false,
                animation: "slide_from_bottom",
              }}
            />
            <Stack.Screen
              name="modal"
              options={{
                presentation: "modal",
                title: "Modal",
              }}
            />
          </Stack>

          <StatusBar style={isDark ? "light" : "dark"} />

          {/* Premium Animated Brand Loading Screen */}
          {splashVisible && (
            <BrandSplash
              isReady={isAppReady}
              onAnimationComplete={() => setSplashVisible(false)}
            />
          )}
        </ThemeProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
