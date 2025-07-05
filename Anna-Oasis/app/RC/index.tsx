import { View, Alert } from "react-native";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { router } from "expo-router";
import {
  HomeIcon,
  UsersIcon,
  ClipboardListIcon,
  CalendarCheckIcon,
  User,
} from "lucide-react-native";
import { useEffect } from "react";
import { getAllRooms } from "@/utils/rc/rcAdmissionApi";
import useRCStore from "@/stores/rcStore";
import { fetchdata } from "@/utils/rc/rcDetails";
import useUserStore from "@/stores/userStore";
import RCDetailsCard from "@/components/rc/DetailsCard";

export default function RCPage() {
  const setRooms = useRCStore((state) => state.setRooms);
  const rooms = useRCStore((state) => state.rooms);
  const setDetails = useUserStore((state) => state.setDetails);

  const fetchDetailsAndRooms = async () => {
    try {
      const rooms = await getAllRooms();
      setRooms(rooms);
      const rcDetails = await fetchdata();
      if (rcDetails.length == 0) {
        Alert.alert("RC Details", "Please enter your details first.");
        setDetails(null);
        router.push("/RC/Details/Edit");
      } else {
        setDetails(rcDetails[0]);
        console.log("RC Details:", rcDetails);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  useEffect(() => {
    fetchDetailsAndRooms();
  }, []);

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
    {
      title: "Personal Details",
      route: "/RC/Details",
      icon: User,
      color: "#4F46E5",
    },
  ];

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <RCDetailsCard />
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
