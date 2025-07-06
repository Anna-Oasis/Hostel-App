import { View, Text } from "react-native";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { router } from "expo-router";
import {
  ClipboardListIcon,
  FileTextIcon,
  UsersIcon,
  BarChart2Icon,
  FilePlus2Icon,
} from "lucide-react-native";

export default function DeputyWardenPage() {
  const menuItems = [
    {
      title: "Admission Verification",
      route: "/DeputyWarden/AdmissionVerification",
      icon: FilePlus2Icon,
      color: "#022B60",
    },
    {
      title: "Verifications",
      route: "/DeputyWarden/Verifications",
      icon: ClipboardListIcon,
      color: "#022B60",
    },
    {
      title: "Grievances",
      route: "/DeputyWarden/Grievances",
      icon: FileTextIcon,
      color: "#022B60",
    },
    {
      title: "RC Management",
      route: "/DeputyWarden/RCManagement",
      icon: UsersIcon,
      color: "#022B60",
    },
    {
      title: "Attendance Reports",
      route: "/DeputyWarden/AttendanceReports",
      icon: BarChart2Icon,
      color: "#022B60",
    },
    {
      title: "RC Leave Approvals",
      route: "/DeputyWarden/RcLeave",
      icon: UsersIcon,
      color: "#022B60",
    },
    {
      title: "View Room Data",
      route: "/DeputyWarden/Rooms",
      icon: UsersIcon,
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
            <ButtonText className="mt-3 text-lg leading-none font-medium">
              {item.title}
            </ButtonText>
          </Button>
        ))}
      </View>
    </View>
  );
}
