import { Stack } from "expo-router";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import Loader from "@/components/loader";
import Footer from "@/components/appbars/Footer";

export default function Layout() {
  return (
    <>
      <GluestackUIProvider mode="light">
        <Stack screenOptions={{ headerShown: false }}>
        </Stack>
        <Loader />
        <Footer />
      </GluestackUIProvider>
    </>
  );
}