import { Stack } from "expo-router";
import StudentAppBar from "@/components/appbars/StudentAppBar";

export default function StudentLayout() {
  return (
    <>
      <StudentAppBar title="Student Dashboard" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
