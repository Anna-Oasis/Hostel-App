import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import Loader from "@/components/loader";

export default function Layout() {
  return (
    <>
      <StatusBar style="dark" hidden={false} />

      <GluestackUIProvider mode="light">
        <Stack screenOptions={{ headerShown: false }} />
        {/* <Loader /> */}
      </GluestackUIProvider>
    </>
  );
}