import { View, Text } from "react-native";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { router } from "expo-router";
import {
  UserIcon,
  HomeIcon,
  ClipboardIcon,
  CalendarIcon,
  FileTextIcon,
  BuildingIcon,
  LogOut,
} from "lucide-react-native";
import { removeCredentials, removeToken } from "@/utils/authUtils";

export default function StudentMain() {
  const menuItems = [
    {
      title: "Personal Details",
      route: "/User/Student/Details",
      icon: UserIcon,
      color: "#6366F1",
    },
    {
      title: "Admission",
      route: "/User/Student/Admission",
      icon: HomeIcon,
      color: "#4F46E5",
    },
    {
      title: "Leave Form",
      route: "/User/Student/LeaveForm",
      icon: ClipboardIcon,
      color: "#0891B2",
    },
    {
      title: "Summer Vacation",
      route: "/User/Student/SummerVacation",
      icon: CalendarIcon,
      color: "#D97706",
    },
    {
      title: "Grievances",
      route: "/User/Student/Grievances",
      icon: FileTextIcon,
      color: "#EF4444",
    },
    {
      title: "Hostel Vacation",
      route: "/User/Student/HostelVacation",
      icon: BuildingIcon,
      color: "#10B981",
    },
  ];

  return (
    <View className="flex-1 bg-gray-50 p-4 pt-16">
      <Text className="text-2xl font-bold text-gray-800 mb-6 mt-2">Student Services</Text>
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
        <Button
          key={1}
          onPress={() => {
            removeToken();
            removeCredentials();
            router.replace("/Login");
          }}
          className="w-[48%] h-40 mb-4 rounded-xl flex-col justify-center items-center"
          style={{ backgroundColor: "#444444" }}
          variant="solid"
        >
          <ButtonIcon as={LogOut} size="xl" color="white" />
          <ButtonText className="mt-3 text-base font-medium">{"Logout"}</ButtonText>
        </Button>
      </View>
    </View>
  );
}
