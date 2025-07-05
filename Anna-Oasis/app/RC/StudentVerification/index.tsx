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
      color: "#022B60",
    },
    {
      title: "Grievances",
      route: "/RC/StudentVerification/Grievances",
      icon: FileTextIcon,
      color: "#022B60",
    },
    {
      title: "Summer Vacation",
      route: "/RC/StudentVerification/SummerVacation",
      icon: CalendarIcon,
      color: "#022B60",
    },
    {
      title: "Vacating Hostel",
      route: "/RC/StudentVerification/VacatingHostel",
      icon: LogOutIcon,
      color: "#022B60",
    },
  ];

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <View className="flex-row flex-wrap justify-between">
        {menuItems.map((item, idx) => (
          <Button
            key={idx}
            onPress={() => router.push(item.route as any)}
            className="w-[48%] h-40 mb-4 rounded-xl flex-col justify-center items-center"
            style={{ backgroundColor: item.color }}
            variant="solid"
          >
            <ButtonIcon as={item.icon} size="xxl" color="white" />
            <ButtonText className="mt-3 text-lg leanding-none font-medium">{item.title}</ButtonText>
          </Button>
        ))}
      </View>
    </View>
  );
}