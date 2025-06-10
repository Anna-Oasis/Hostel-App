import { Stack } from "expo-router";

import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";

export default function Layout() {
  return (
    <GluestackUIProvider mode="light">
      <Stack>
        <Stack.Screen name="Login/index" options={{ headerShown: false }} />
        <Stack.Screen name="Signup/index" options={{ headerShown: false }} />
        <Stack.Screen name="User/index" options={{ headerShown: false }} />
        <Stack.Screen name="User/Research/index" options={{ headerShown: false }} />
        <Stack.Screen name="User/Student/index" options={{ headerShown: false }} />
        <Stack.Screen name="User/Student/Admission/index" options={{ headerShown: false }} />
        <Stack.Screen name="User/Student/Details/index" options={{ headerShown: false }} />
        <Stack.Screen name="User/Student/Grievances/index" options={{ headerShown: false }} />
        <Stack.Screen name="User/Student/HostelVacation/index" options={{ headerShown: false }} />
        <Stack.Screen name="User/Student/LeaveForm/index" options={{ headerShown: false }} />
        <Stack.Screen name="User/Student/SummerVacation/index" options={{ headerShown: false }} />
        <Stack.Screen name="RC/index" options={{ headerShown: false }} />
        <Stack.Screen name="RC/RoomAllocation/index" options={{ headerShown: false }} />
        <Stack.Screen name="RC/StudentVerification/index" options={{ headerShown: false }} />
        <Stack.Screen name="RC/StudentVerification/LeaveForm/index" options={{ headerShown: false }} />
        <Stack.Screen name="RC/StudentVerification/Grievances/index" options={{ headerShown: false }} />
        <Stack.Screen name="RC/StudentVerification/SummerVacation/index" options={{ headerShown: false }} />
        <Stack.Screen name="RC/StudentVerification/VacatingHostel/index" options={{ headerShown: false }} />
        <Stack.Screen name="RC/Attendance/index" options={{ headerShown: false }} />
        <Stack.Screen name="RC/ApplyForLeave/index" options={{ headerShown: false }} />
        <Stack.Screen name="Manager/index" options={{ headerShown: false }} />
        <Stack.Screen name="ExecutiveWarden/index" options={{ headerShown: false }} />
        <Stack.Screen name="DeputyWarden/index" options={{ headerShown: false }} />
      </Stack>
    </GluestackUIProvider>
  );
}
