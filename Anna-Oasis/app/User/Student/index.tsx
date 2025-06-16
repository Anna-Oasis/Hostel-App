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
import { removeToken } from "@/utils/authUtils";
import StudentAppBar from "@/components/appbars/AppBar";

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
    <>
      <View className="flex-row flex-wrap justify-between items-center p-8">
        {menuItems.map((item, idx) => (
          <Button
            key={idx}
            onPress={() => router.push(item.route as any)}
            className="w-[48%] h-40 mb-4 rounded-xl flex-col justify-center items-center"
            style={{ backgroundColor: item.color }}
            variant="solid"
          >
            <ButtonIcon as={item.icon} size="xl" color="white" />
            <ButtonText className="mt-3 text-base font-medium">
              {item.title}
            </ButtonText>
          </Button>
        ))}
      </View>
    </>
  );
}
