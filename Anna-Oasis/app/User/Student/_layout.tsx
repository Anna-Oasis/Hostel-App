import { Stack, useSegments } from "expo-router";
import AppBar from "@/components/appbars/AppBar";

const TITLES: Record<string, string> = {
  "": "Student Dashboard",
  Details: "Personal Details",
  Admission: "Admission",
  LeaveForm: "Leave Form",
  SummerVacation: "Summer Vacation",
  Grievances: "Grievances",
  HostelVacation: "Hostel Vacation",
};

export default function StudentLayout() {
  const segments = useSegments();
  const current = segments[segments.length - 1] || "";
  const title = TITLES[current] || "Student";

  return (
    <>
      <AppBar title={title} />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}