import { Stack, useSegments } from "expo-router";
import AppBar from "@/components/appbars/AppBar";

const TITLES: Record<string, string> = {
  "": "Executive Warden",
  AdmissionVerification: "Admission Verification",
  RCManagement: "RC Management",
};

export default function ExecutiveWardenLayout() {
  const segments = useSegments();
  const current = segments[segments.length - 1] || "";
  const title = TITLES[current] || "Executive Warden";

  return (
    <>
      <AppBar title={title} />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}