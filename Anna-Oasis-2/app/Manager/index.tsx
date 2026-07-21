import { View, ScrollView } from "react-native";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { router } from "expo-router";
import {
  BadgeDollarSignIcon,
  CalendarCheck,
  Delete,
  FileTextIcon,
  HouseIcon,
  ShieldCheckIcon,
} from "lucide-react-native";

export default function ManagerPage() {
  const menuItems = [
    {
      title: "Payment Verifications",
      route: "/Manager/PaymentVerifications",
      icon: BadgeDollarSignIcon,
      color: "#022B60",
    },
    {
      title: "Profile Verifications",
      route: "/Manager/ProfileVerifications",
      icon: FileTextIcon,
      color: "#022B60",
    },
    {
      title: "Admissions",
      route: "/Manager/Admissions",
      icon: BadgeDollarSignIcon,
      color: "#022B60",
    },
    {
      title: "Student Details",
      route: "/Manager/Details",
      icon: FileTextIcon,
      color: "#022B60",
    },
    {
      title: "Grievances",
      route: "/Manager/Grievances",
      icon: FileTextIcon,
      color: "#022B60",
    },
    {
      title: "Caution Deposit",
      route: "/Manager/CautionDeposit",
      icon: ShieldCheckIcon,
      color: "#022B60",
    },
    {
      title: "Rooms",
      route: "/Manager/Rooms",
      icon: HouseIcon,
      color: "#022B60",
    },
    {
      title: "Attendance Report",
      route: "/Manager/AttendanceReport",
      icon: CalendarCheck,
      color: "#022B60",
    },
    {
      title: "Data Deletions",
      route: "/Manager/Delete",
      icon: Delete,
      color: "#022B60",
    },
  ];

  return (
    <ScrollView contentContainerStyle={{ flexGrow : 1, padding: 16 }} className="bg-gray-50">
      <View className="flex-1 bg-gray-50 p-4">
        <View className="flex-row flex-wrap justify-between w-full sm:w-[80%] md:w-[50%] self-center">
          {menuItems.map((item, idx) => (
            <Button
              key={idx}
              onPress={() => router.push(item.route as any)}
              className="w-[48%] h-40 mb-4 rounded-xl flex-col justify-center items-center"
              style={{ backgroundColor: item.color }}
              variant="solid"
            >
              <ButtonIcon as={item.icon} size="xl" color="white" />
              <ButtonText className="mt-3 text-lg leading-none font-medium">{item.title}</ButtonText>
            </Button>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
