import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useEffect, useState } from 'react';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {

  const [isDark, setIsDark] = useState(false);

  // ⏰ TIME BASED THEME
  useEffect(() => {
    const updateTheme = () => {
      const hour = new Date().getHours();

      // 🌅 5 AM - 7 PM = Light
      if (hour >= 5 && hour < 19) {
        setIsDark(false);
      } else {
        setIsDark(true);
      }
    };

    updateTheme();

    // हर 1 मिनट में check (optional but smooth)
    const interval = setInterval(updateTheme, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>

        {/* 🔥 STATUS BAR AUTO */}
        <StatusBar style={isDark ? "light" : "dark"} />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}