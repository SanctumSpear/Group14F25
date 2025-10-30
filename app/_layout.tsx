import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  anchor: "(tabs)", // tells Expo Router that tabs are the default navigation anchor
};

export default function RootLayout() {
  const colorScheme = useColorScheme(); // get the current color scheme (dark or light)
  const [ready, setReady] = useState(false); // tracks whether the layout is fully mounted
  const segments = useSegments(); // current route segments (e.g., ["(tabs)"] or ["(auth)", "login"])
  const router = useRouter(); // router object to programmatically navigate
  const [didRedirect, setDidRedirect] = useState(false); // ensures we only redirect to login once for testing purposes

  // ---------- Ready Flag ----------
  // Small delay to ensure RootLayout is mounted before doing any redirects.
  // Prevents "attempted to navigate before mounting" errors.
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 100); // 100ms delay
    return () => clearTimeout(timer);
  }, []);

  // ---------- Redirect Logic ----------
  useEffect(() => {
    // Wait until layout is ready and we haven't redirected yet
    if (!ready || didRedirect) return;

    // Check if the current route is part of the auth group
    const inAuthGroup = segments[0] === "(auth)";

    // If not in the auth group, redirect to the login page
    if (!inAuthGroup) {
      router.replace("/(auth)/login"); // replace so back button doesn't go back to empty root
      setDidRedirect(true); // mark that we already redirected to prevent loops
    }
  }, [ready, segments]);

  // ---------- Theme Provider + Stack ----------
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Modal screen, can be used anywhere in the app */}
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="auto" />{" "}
      {/* Automatically adjusts the status bar style */}
    </ThemeProvider>
  );
}
