import { Stack, useSegments } from "expo-router";
import AppBar from "@/components/appbars/AppBar";

const TITLES: Record<string, string> = {
  "": "RC Dashboard",
  StudentVerification: "Student Verification",
  RoomAllocation: "Room Allocation",
  Attendance: "Attendance",
  ApplyForLeave: "Apply for Leave",
  LeaveForm: "Leave Form",
  Grievances: "Grievances",
  SummerVacation: "Summer Vacation",
  VacatingHostel: "Vacating Hostel",
};

export default function RCLayout() {
  const segments = useSegments();
  const current = segments[segments.length - 1] || "";
  const title = TITLES[current] || "RC";

  return (
    <>
      <AppBar title={title} />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}