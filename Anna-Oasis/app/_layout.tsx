import { Stack } from "expo-router";

import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";

export default function Layout() {
  return (
    <GluestackUIProvider mode="light">
      <Stack>
        <Stack.Screen name="Login/index" options={{ headerShown: false }} />
        <Stack.Screen name="Signup/index" options={{ headerShown: false }} />
        <Stack.Screen name="Student/Home/index" options={{ headerShown: false }} />
      </Stack>
    </GluestackUIProvider>
  );
}
