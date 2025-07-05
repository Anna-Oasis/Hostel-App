import { View, ScrollView } from "react-native";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import {
  ClipboardCheckIcon,
  Users2Icon,
  FileCheck2Icon,
  PlayCircleIcon,
  FileEditIcon,
} from "lucide-react-native";
import { router } from "expo-router";

export default function ExecutiveWardenPage() {
  const menuItems = [
    {
      title: "Start Admission Session",
      route: "/ExecutiveWarden/AdmissionSession",
      icon: PlayCircleIcon,
      color: "#022B60",
    },
    {
      title: "Admission Verification",
      route: "/ExecutiveWarden/AdmissionVerification",
      icon: ClipboardCheckIcon,
      color: "#022B60",
    },
    {
      title: "RC Management",
      route: "/ExecutiveWarden/RCManagement",
      icon: Users2Icon,
      color: "#022B60",
    },
    {
      title: "RC Leave Approvals",
      route: "/ExecutiveWarden/RcLeave",
      icon: FileCheck2Icon,
      color: "#022B60",
    },
    {
      title: "Edit Declaration",
      route: "/ExecutiveWarden/Declaration",
      icon: FileEditIcon,
      color: "#022B60",
    },
    {
      title: "View Room Details",
      route: "/ExecutiveWarden/Rooms",
      icon: Users2Icon,
      color: "#8B5CF6",
    },
  ];

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="flex-row flex-wrap justify-between">
          {menuItems.map((item, idx) => (
            <View
              key={idx}
              className="w-[48%] mb-4"
              style={{
                paddingHorizontal: 2,
              }}
            >
              <Button
                onPress={() => router.push(item.route as any)}
                className="h-40 rounded-2xl flex-col justify-center items-center"
                style={{
                  backgroundColor: item.color,
                }}
                variant="solid"
              >
                <View className="flex-1 justify-center items-center">
                  <ButtonIcon as={item.icon} size="xxl" color="white" />
                  <ButtonText className="mt-4 text-lg leading-none font-semibold text-white text-center px-2">
                    {item.title}
                  </ButtonText>
                </View>
              </Button>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

