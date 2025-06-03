import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { router } from "expo-router";
import { View, Text } from "react-native";
import { 
  HomeIcon, 
  ClipboardIcon, 
  CalendarIcon, 
  BuildingIcon, 
  FileTextIcon 
} from "lucide-react-native";

export default function StudentHome() {
  const menuItems: {
    title: string;
    route: "/Student/Home/Admission" | "/Student/Home/LeaveForm" | "/Student/Home/SummerVacation" | "/Student/Home/HostelVacation" | "/Student/Home/Grievances";
    icon: any;
    color: string;
  }[] = [
    { 
      title: "Admission", 
      route: "/Student/Home/Admission", 
      icon: HomeIcon, 
      color: "#4F46E5" 
    },
    { 
      title: "Leave Form", 
      route: "/Student/Home/LeaveForm", 
      icon: ClipboardIcon,
      color: "#0891B2" 
    },
    { 
      title: "Summer Vacation", 
      route: "/Student/Home/SummerVacation", 
      icon: CalendarIcon,
      color: "#D97706" 
    },
    { 
      title: "Hostel Vacation", 
      route: "/Student/Home/HostelVacation", 
      icon: BuildingIcon,
      color: "#10B981" 
    },
    { 
      title: "Grievances", 
      route: "/Student/Home/Grievances", 
      icon: FileTextIcon,
      color: "#EF4444"
    },
  ];

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <Text className="text-2xl font-bold text-gray-800 mb-6 mt-2">Student Portal</Text>
      
      <View className="flex-row flex-wrap justify-between">
        {menuItems.map((item, index) => (
          <Button 
            key={index}
            onPress={() => router.push(item.route)}
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