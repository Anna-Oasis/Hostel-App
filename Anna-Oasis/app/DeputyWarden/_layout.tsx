import { Stack, useSegments } from "expo-router";
import AppBar from "@/components/appbars/AppBar";

const TITLES: Record<string, string> = {
  "": "Deputy Warden Dashboard",
  Verifications: "Verifications",
  Admissions: "Admissions Verification",
  LeaveForm: "Leave Form Verification",
  SummerVacation: "Summer Vacation Verification",
  VacatingHostel: "Vacating Hostel Verification",
  Grievances: "Grievances",
  RCManagement: "RC Management",
  AttendanceReports: "Attendance Reports",
};

export default function DeputyWardenLayout() {
  const segments = useSegments();
  const current = segments[segments.length - 1] || "";
  const title = TITLES[current] || "Deputy Warden";

  return (
    <>
      <AppBar title={title} />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}