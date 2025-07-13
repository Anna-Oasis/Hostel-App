import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import Loader from "@/components/loader";
import { NotificationProvider } from "@/context/NotificationContext";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function Layout() {
  return (
    <>
      <NotificationProvider>
        <GluestackUIProvider mode="light">
          <Stack screenOptions={{ headerShown: false }}>
          </Stack>
          <Loader />
        </GluestackUIProvider>
      </NotificationProvider>
    </>
  );
}