import { View, Text } from "react-native";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { router } from "expo-router";
import {
  ClipboardIcon,
  FileTextIcon,
  CalendarIcon,
  LogOutIcon,
} from "lucide-react-native";

export default function StudentVerificationPage() {
  const menuItems = [
    {
      title: "Leave Form",
      route: "/RC/StudentVerification/LeaveForm",
      icon: ClipboardIcon,
      color: "#6366F1",
    },
    {
      title: "Grievances",
      route: "/RC/StudentVerification/Grievances",
      icon: FileTextIcon,
      color: "#EF4444",
    },
    {
      title: "Summer Vacation",
      route: "/RC/StudentVerification/SummerVacation",
      icon: CalendarIcon,
      color: "#D97706",
    },
    {
      title: "Vacating Hostel",
      route: "/RC/StudentVerification/VacatingHostel",
      icon: LogOutIcon,
      color: "#10B981",
    },
  ];

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <Text className="text-2xl font-bold text-gray-800 mb-6 mt-2">Student Verification</Text>
      <View className="flex-row flex-wrap justify-between">
        {menuItems.map((item, idx) => (
          <Button
            key={idx}
            onPress={() => router.push(item.route as any)}
            className="w-[48%] h-40 mb-4 rounded-xl flex-col justify-center items-center"
            style={{ backgroundColor: item.color }}
            variant="solid"
          >
            <ButtonIcon as={item.icon} size="xl" color="white" />
            <ButtonText className="mt-3 text-base font-medium">{item.title}</ButtonText>
          </Button>
        ))}
      </View>
    </View>
  );
}