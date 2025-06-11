import LeaveForm from "@/components/LeaveForm";
import { View, Text } from "react-native";
export default function LeaveFormPage() {
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <LeaveForm onSubmit={(values) => {
        console.log("Leave Form Submitted:", values);
      }
      } />
    </View>
  );
}