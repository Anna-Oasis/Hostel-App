import { Alert, View } from "react-native";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { router } from "expo-router";
import {
  HomeIcon,
  UsersIcon,
  ClipboardListIcon,
  CalendarCheckIcon,
  User,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { fetchdata } from "@/utils/rc/rcDetails";
import useUserStore from "@/stores/userStore";
import RCDetailsCard from "@/components/rc/DetailsCard";
import RefreshableScrollView from "@/components/common/RefreshableScrollView";

export default function RCPage() {
  const setDetails = useUserStore((state) => state.setDetails);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDetailsAndRooms = async () => {
    try {
      setIsRefreshing(true);
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
    } finally {
      setIsRefreshing(false);
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
      color: "#022B60",
    },
    {
      title: "Student Verification",
      route: "/RC/StudentVerification",
      icon: UsersIcon,
      color: "#022B60",
    },
    {
      title: "Attendance",
      route: "/RC/Attendance",
      icon: ClipboardListIcon,
      color: "#022B60",
    },
    {
      title: "Leave",
      route: "/RC/ApplyForLeave",
      icon: CalendarCheckIcon,
      color: "#022B60",
    },
    {
      title: "Personal Details",
      route: "/RC/Details",
      icon: User,
      color: "#022B60",
    },
  ];

  return (
    <RefreshableScrollView
      className="flex-1 bg-gray-50"
      contentContainerStyle={{ padding: 16 }}
      onRefresh={fetchDetailsAndRooms}
      refreshing={isRefreshing}
    >
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
            <ButtonIcon as={item.icon} size="xl" color="white" />
            <ButtonText className="mt-3 text-lg leading-none font-medium">
              {item.title}
            </ButtonText>
          </Button>
        ))}
      </View>
    </RefreshableScrollView>
  );
}
