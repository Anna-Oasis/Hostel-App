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
      color: "#F97316",
    },
    {
      title: "Verifications",
      route: "/DeputyWarden/Verifications",
      icon: ClipboardListIcon,
      color: "#4F46E5",
    },
    {
      title: "Grievances",
      route: "/DeputyWarden/Grievances",
      icon: FileTextIcon,
      color: "#EF4444",
    },
    {
      title: "RC Management",
      route: "/DeputyWarden/RCManagement",
      icon: UsersIcon,
      color: "#0891B2",
    },
    {
      title: "Attendance Reports",
      route: "/DeputyWarden/AttendanceReports",
      icon: BarChart2Icon,
      color: "#10B981",
    },
    {
      title: "RC Leave Approvals",
      route: "/DeputyWarden/RcLeave",
      icon: UsersIcon,
      color: "#9870a4",
    },
    {
      title: "View Room Data",
      route: "/DeputyWarden/Rooms",
      icon: UsersIcon,
      color: "#F59E0B",
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
            <ButtonIcon as={item.icon} size="xl" color="white" />
            <ButtonText className="mt-3 text-base font-medium">
              {item.title}
            </ButtonText>
          </Button>
        ))}
      </View>
    </View>
  );
}
