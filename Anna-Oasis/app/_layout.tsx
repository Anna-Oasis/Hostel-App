import { Stack } from "expo-router";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import Loader from "@/components/loader";

export default function Layout() {
  return (
    <>
      <GluestackUIProvider mode="light">
        <Stack screenOptions={{ headerShown: false }}>
        </Stack>
        <Loader />
      </GluestackUIProvider>
    </>
  );
}