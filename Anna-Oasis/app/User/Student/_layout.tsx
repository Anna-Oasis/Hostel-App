import { Stack } from "expo-router";
import AppBar from "@/components/appbars/AppBar";

export default function StudentLayout() {
  return (
    <>
      <AppBar title="Student Dashboard" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
