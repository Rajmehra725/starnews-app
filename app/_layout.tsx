import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useEffect, useState } from 'react';

// 🔔 ADD THIS
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "./_services/notifications";

// ✅ ADD THIS (react-native-paper)
import { Provider as PaperProvider } from "react-native-paper";

export const unstable_settings = {
  anchor: '(tabs)',
};

// 🔔 IMPORTANT: Notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,

    // ✅ NEW REQUIRED FIELDS
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {

  const [isDark, setIsDark] = useState(false);

  // ⏰ TIME BASED THEME
  useEffect(() => {
    const updateTheme = () => {
      const hour = new Date().getHours();

      if (hour >= 5 && hour < 19) {
        setIsDark(false);
      } else {
        setIsDark(true);
      }
    };

    updateTheme();
    const interval = setInterval(updateTheme, 60000);

    return () => clearInterval(interval);
  }, []);

  // 🔔 Notification Setup
  useEffect(() => {

    async function setupNotifications() {
      const token = await registerForPushNotificationsAsync();
      console.log("📲 Push Token:", token);
    }

    setupNotifications();

    const sub1 =
      Notifications.addNotificationReceivedListener(notification => {
        console.log("🔔 Notification Received:", notification);
      });

    const sub2 =
      Notifications.addNotificationResponseReceivedListener(response => {
        console.log("📲 Notification Clicked:", response);

        const data = response.notification.request.content.data;
        console.log("DATA:", data);
      });

    return () => {
      sub1.remove();
      sub2.remove();
    };

  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>

      {/* ✅ JUST WRAP THIS */}
      <PaperProvider>

        <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>

          <StatusBar style={isDark ? "light" : "dark"} />
        </ThemeProvider>

      </PaperProvider>

    </GestureHandlerRootView>
  );
}