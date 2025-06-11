import GrievanceForm from "@/components/GrievanceForm";
import { useRouter } from "expo-router";
import { View, Text } from "react-native";

export default function GrievancesPage() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, justifyContent: "center", }}>
      <GrievanceForm
        onSubmit={(values) => {
          console.log("Grievance submitted:", values);
          router.push("/User/Student");
        }
        } />
    </View>
  );
}