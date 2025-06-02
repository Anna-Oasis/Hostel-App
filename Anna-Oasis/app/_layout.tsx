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
        <Stack.Screen name="Student/Admission/index" options={{ headerShown: false }} />
        <Stack.Screen name="Student/LeaveForm/index" options={{ headerShown: false }} />
        <Stack.Screen name="Student/SummerVacation/index" options={{ headerShown: false }} />
        <Stack.Screen name="Student/HostelVacation/index" options={{ headerShown: false }} />
        <Stack.Screen name="Student/Grievances/index" options={{ headerShown: false }} />
        <Stack.Screen name="RC/index" options={{ headerShown: false }} />
        <Stack.Screen name="Manager/index" options={{ headerShown: false }} />
        <Stack.Screen name="ExecutiveWarden/index" options={{ headerShown: false }} />
        <Stack.Screen name="DeputyWarden/index" options={{ headerShown: false }} />
      </Stack>
    </GluestackUIProvider>
  );
}
