import { Button, ButtonText } from "@/components/ui/button";
import { router } from "expo-router";
import { View } from "react-native";

export default function StudentHome() {
  return (
    <View style={{ gap: 16, margin: 24 }}>
      <Button onPress={() => router.push("/Student/Home/Admission")}>
        <ButtonText>Admission</ButtonText>
      </Button>
      <Button onPress={() => router.push("/Student/Home/LeaveForm")}>
        <ButtonText>Leave Form</ButtonText>
      </Button>
      <Button onPress={() => router.push("/Student/Home/SummerVacation")}>
        <ButtonText>Summer Vacation</ButtonText>
      </Button>
      <Button onPress={() => router.push("/Student/Home/HostelVacation")}>
        <ButtonText>Hostel Vacation</ButtonText>
      </Button>
      <Button onPress={() => router.push("/Student/Home/Grievances")}>
        <ButtonText>Grievances</ButtonText>
      </Button>
    </View>
  );
}