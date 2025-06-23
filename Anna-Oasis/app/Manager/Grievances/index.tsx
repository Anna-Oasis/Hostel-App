import { View, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import {
  getAllManagerGrievances,
  updateManagerGrievanceState,
} from "@/utils/manager/managerGrievanceApi";
import ApprovalCard from "@/components/ApprovalCard";
import { getGrievanceBadgeStatus } from "@/utils/getBadgeStatus";
import { Icon } from "@/components/ui/icon";
import { Inbox } from "lucide-react-native";
import { Text } from "@/components/ui/text";

export default function GrievancesPage() {
  const [grievances, setGrievances] = useState<any[]>([]);

  const fetchGrievances = () => {
    getAllManagerGrievances()
      .then((data) => {
        setGrievances(data || []);
      })
      .catch((error) => {
        console.log("Error fetching Manager grievances:", error);
      });
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      await updateManagerGrievanceState(id);
      fetchGrievances();
    } catch (error) {
      console.log("Error approving grievance:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-4">
      <Text size="md" className="mb-4 text-typography-400">
        Please approve the grievances once they are resolved.
      </Text>
      {grievances.length === 0 ? (
        <View className="flex-1 justify-center items-center mt-16">
          <Icon as={Inbox} size="xl" color="#a3a3a3" className="mb-4" />
          <Text
            size="lg"
            className="text-typography-400 font-semibold mb-2"
          >
            No pending grievances
          </Text>
          <Text size="sm" className="text-typography-300 text-center">
            All grievances have been reviewed.
          </Text>
        </View>
      ) : (
        grievances.map((item, idx) => (
          <ApprovalCard
            key={item.grievanceId || idx}
            title={item.formDetails.subject}
            subTitle={`By ${item.rollNo}`}
            badge={getGrievanceBadgeStatus(item.formDetails.status)}
            onApprove={() => handleApprove(item.grievanceId)}
            data={{
              ...item.formDetails,
              rollNo: item.rollNo,
              grievanceId: item.grievanceId,
            }}
          />
        ))
      )}
    </ScrollView>
  );
}