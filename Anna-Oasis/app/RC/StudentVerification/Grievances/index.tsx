import { View, Text, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { getAllRCGrievances } from "@/utils/rc/rcGrievanceApi";
import ApprovalCard from "@/components/ApprovalCard";
import { getGrievanceBadgeStatus } from "@/utils/getBadgeStatus";

export default function GrievancesPage() {
  const [grievances, setGrievances] = useState<any[]>([]);

  useEffect(() => {
    getAllRCGrievances()
      .then((data) => {
        setGrievances(data || []);
      })
      .catch((error) => {
        console.log("Error fetching RC grievances:", error);
      });
  }, []);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-4">
      {grievances.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-base text-gray-700">Grievances verification (Coming Soon)</Text>
        </View>
      ) : (
        grievances.map((item, idx) => (
          <ApprovalCard
            key={item.grievances.id || idx}
            title={item.grievances.subject}
            subTitle={`By ${item.student.name} (${item.student.rollNo})`}
            badge={getGrievanceBadgeStatus(item.grievances.status)}
            onApprove={() => { /* dummy approve */ }}
            onDecline={() => { /* dummy decline */ }}
            data={{
              ...item.grievances,
              ...item.student,
            }}
          />
        ))
      )}
    </ScrollView>
  );
}