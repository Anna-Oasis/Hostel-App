import { Stack } from "expo-router";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";

export default function Layout() {
  return (
    <GluestackUIProvider mode="light">
      <Stack screenOptions={{ headerShown: false }}>
        {/* 
          You only need to add <Stack.Screen /> here 
          if you want to override options for a specific route.
          Otherwise, Expo Router will auto-discover all routes in /app.
        */}
      </Stack>
    </GluestackUIProvider>
  );
}