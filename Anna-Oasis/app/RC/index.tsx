import { View } from "react-native";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { router } from "expo-router";
import {
  HomeIcon,
  UsersIcon,
  ClipboardListIcon,
  CalendarCheckIcon,
} from "lucide-react-native";
import { useEffect } from "react";
import { getAllRooms } from "@/utils/rc/rcAdmissionApi";
import useRCStore from "@/stores/rcStore";

export default function RCPage() {
  const setRooms = useRCStore((state) => state.setRooms);
  const rooms = useRCStore((state) => state.rooms);

  const fetchRooms = async () => {
    try {
      const rooms = await getAllRooms();
      setRooms(rooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  useEffect(() => {
    if (!rooms || rooms.length === 0) {
      fetchRooms();
    }
  }, [rooms]);

  const menuItems = [
    {
      title: "Room Allocation",
      route: "/RC/RoomAllocation",
      icon: HomeIcon,
      color: "#4F46E5",
    },
    {
      title: "Student Verification",
      route: "/RC/StudentVerification",
      icon: UsersIcon,
      color: "#0891B2",
    },
    {
      title: "Attendance",
      route: "/RC/Attendance",
      icon: ClipboardListIcon,
      color: "#10B981",
    },
    {
      title: "Leave",
      route: "/RC/ApplyForLeave",
      icon: CalendarCheckIcon,
      color: "#D97706",
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