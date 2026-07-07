import { useEffect, useState } from "react";
import { View } from "react-native";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { router } from "expo-router";
import {
  ClipboardListIcon,
  FileTextIcon,
  UsersIcon,
  BarChart2Icon,
  FilePlus2Icon,
} from "lucide-react-native";

import RefreshableScrollView from "@/components/common/RefreshableScrollView";
import DeputyWardenDetailsCard from "@/components/deputyWarden/DetailsCard";
import useUserStore from "@/stores/userStore";
import { fetchDeputyWardenDetails } from "@/utils/deputyWarden/dwDetails";

export default function DeputyWardenPage() {
  const setDetails = useUserStore((state) => state.setDetails);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDetails = async () => {
    try {
      setIsRefreshing(true);

      const details = await fetchDeputyWardenDetails();

      if (!details || details.length === 0) {
        window.alert("Deputy Warden Details\nPlease enter your details first.");
        setDetails(null);
        router.push("/DeputyWarden/Details/Edit");
        return;
      }

      setDetails(details[0]);
    } catch (error) {
      console.error("Error fetching deputy warden details:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const menuItems = [
    {
      title: "Admission Verification",
      route: "/DeputyWarden/AdmissionVerification",
      icon: FilePlus2Icon,
      color: "#022B60",
    },
    {
      title: "Verifications",
      route: "/DeputyWarden/Verifications",
      icon: ClipboardListIcon,
      color: "#022B60",
    },
    {
      title: "Grievances",
      route: "/DeputyWarden/Grievances",
      icon: FileTextIcon,
      color: "#022B60",
    },
    {
      title: "RC Management",
      route: "/DeputyWarden/RCManagement",
      icon: UsersIcon,
      color: "#022B60",
    },
    {
      title: "Attendance Reports",
      route: "/DeputyWarden/AttendanceReports",
      icon: BarChart2Icon,
      color: "#022B60",
    },
    {
      title: "RC Leave Approvals",
      route: "/DeputyWarden/RcLeave",
      icon: UsersIcon,
      color: "#022B60",
    },
    {
      title: "View Room Data",
      route: "/DeputyWarden/Rooms",
      icon: UsersIcon,
      color: "#022B60",
    },
    {
      title: "My Details",
      route: "/DeputyWarden/Details",
      icon: UsersIcon,
      color: "#022B60",
    },
  ];

  return (
    <RefreshableScrollView
      className="flex-1 bg-gray-50"
      contentContainerStyle={{ padding: 16 }}
      refreshing={isRefreshing}
      onRefresh={fetchDetails}
    >
      <DeputyWardenDetailsCard />

      <View className="flex-row flex-wrap justify-between w-full sm:w-[80%] md:w-[50%] self-center">
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
    </RefreshableScrollView>
  );
}