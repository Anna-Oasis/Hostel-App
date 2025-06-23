import { View} from "react-native";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { ClipboardCheckIcon , UserCircle2Icon} from "lucide-react-native";
import { router } from "expo-router";

export default function ExecutiveWardenPage() {
  const menuItems = [
    {
      title: "Admission Verification",
      route: "/ExecutiveWarden/AdmissionVerification",
      icon: ClipboardCheckIcon,
      color: "#16A34A",
    },
    {
      title: "RC Management",
      route: "/ExecutiveWarden/RCManagement",
      icon: UserCircle2Icon,
      color: "#0EA5E9",
    },
        {
      title: "RC Leave Approvals",
      route: "/ExecutiveWarden/RcLeave",
      icon: UserCircle2Icon,
      color: "#0EA5E9",
    }
  ];

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <View className="flex-row flex-wrap justify-between">
        {menuItems.map((item, idx) => (
          <Button
            key={idx}
            onPress={() => router.push(item.route as any)}
            className="w-[96%] h-40 mb-4 rounded-xl flex-col justify-center items-center"
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
