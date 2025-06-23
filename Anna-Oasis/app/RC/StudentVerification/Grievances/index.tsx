import { View, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { getAllRCGrievances, updateGrievanceStatus } from "@/utils/rc/rcGrievanceApi";
import ApprovalCard from "@/components/ApprovalCard";
import { getGrievanceBadgeStatus } from "@/utils/getBadgeStatus";
import { Icon } from "@/components/ui/icon";
import { Inbox } from "lucide-react-native";
import { Text } from "@/components/ui/text";

export default function GrievancesPage() {
  const [grievances, setGrievances] = useState<any[]>([]);

  const fetchGrievances = () => {
    getAllRCGrievances()
      .then((data) => {
        setGrievances(data || []);
      })
      .catch((error) => {
        console.log("Error fetching RC grievances:", error);
      });
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      await updateGrievanceStatus(id, true);
      fetchGrievances();
    } catch (error) {
      console.log("Error approving grievance:", error);
    }
  };

  const handleDecline = async (id: number) => {
    try {
      await updateGrievanceStatus(id, false);
      fetchGrievances();
    } catch (error) {
      console.log("Error declining grievance:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-4">
      {grievances.length === 0 ? (
        <View className="flex-1 justify-center items-center mt-16">
          <Icon as={Inbox} size="xl" color="#a3a3a3" className="mb-4" />
          <Text size="lg" className="text-typography-400 font-semibold mb-2">
            No pending grievances
          </Text>
          <Text size="sm" className="text-typography-300 text-center">
            All grievances have been reviewed.
          </Text>
        </View>
      ) : (
        grievances.map((item, idx) => (
          <ApprovalCard
            key={item.grievances.id || idx}
            title={item.grievances.subject}
            subTitle={`By ${item.student.name} (${item.student.rollNo})`}
            badge={getGrievanceBadgeStatus(item.grievances.status)}
            onApprove={() => handleApprove(item.grievances.id)}
            onDecline={() => handleDecline(item.grievances.id)}
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