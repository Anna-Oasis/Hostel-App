import { View, Text } from "react-native";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { router } from "expo-router";
import {
  BadgeDollarSignIcon,
  FileTextIcon,
  ShieldCheckIcon,
} from "lucide-react-native";

export default function ManagerPage() {
  const menuItems = [
    {
      title: "Payment Verifications",
      route: "/Manager/PaymentVerifications",
      icon: BadgeDollarSignIcon,
      color: "#4F46E5",
    },
    {
      title: "Grievances",
      route: "/Manager/Grievances",
      icon: FileTextIcon,
      color: "#EF4444",
    },
    {
      title: "Caution Deposit",
      route: "/Manager/CautionDeposit",
      icon: ShieldCheckIcon,
      color: "#10B981",
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
            <ButtonText className="mt-3 text-base font-medium">{item.title}</ButtonText>
          </Button>
        ))}
      </View>
    </View>
  );
}