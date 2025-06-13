import { View, Text } from "react-native";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { ClipboardCheckIcon } from "lucide-react-native";
import { router } from "expo-router";

export default function ExecutiveWardenPage() {
  const menuItems = [
    {
      title: "Admission Verification",
      route: "/ExecutiveWarden/AdmissionVerification",
      icon: ClipboardCheckIcon,
      color: "#4F46E5",
    },
    // Add more tiles here if needed in the future
  ];

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <Text className="text-2xl font-bold text-gray-800 mb-6 mt-2">
        Executive Warden Dashboard
      </Text>
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
