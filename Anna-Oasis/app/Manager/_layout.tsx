import { Stack, useSegments } from "expo-router";
import AppBar from "@/components/appbars/AppBar";

const TITLES: Record<string, string> = {
  "": "Manager Dashboard",
  PaymentVerifications: "Payment Verifications",
  Grievances: "Grievances",
  CautionDeposit: "Caution Deposit",
};

export default function ManagerLayout() {
  const segments = useSegments();
  const current = segments[segments.length - 1] || "";
  const title = TITLES[current] || "Manager";

  return (
    <>
      <AppBar title={title} />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}