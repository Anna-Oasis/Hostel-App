import { View, Text } from "react-native";
import { useEffect } from "react";
import { getAllRCAdmissions } from "@/utils/rc/rcAdmissionApi";

export default function RoomAllocationPage() {
  useEffect(() => {
    getAllRCAdmissions()
      .then((data) => {
        console.log("RC Admissions:", data);
      })
      .catch((err) => {
        console.log("Error fetching RC admissions:", err);
      });
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Room Allocation (Coming Soon)</Text>
    </View>
  );
}