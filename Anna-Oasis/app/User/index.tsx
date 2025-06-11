import { View, Text } from "react-native";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { router } from "expo-router";
import { GraduationCapIcon, FlaskConicalIcon } from "lucide-react-native";

export default function UserHome() {
  const menuItems = [
    {
      title: "Student Services",
      route: "/User/Student",
      icon: GraduationCapIcon,
      color: "#4F46E5",
    },
    {
      title: "Research Scholar Services",
      route: "/User/Research",
      icon: FlaskConicalIcon,
      color: "#0891B2",
    },
  ];

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <Text className="text-2xl font-bold text-gray-800 mb-6 mt-2">User Portal</Text>
      <View className="flex-row flex-wrap justify-between">
        {menuItems.map((item, index) => (
          <Button
            key={index}
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