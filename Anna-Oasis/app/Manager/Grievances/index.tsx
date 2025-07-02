import { ScrollView } from "react-native";
import { useEffect, useState } from "react";
import {
  getAllManagerGrievances,
  updateManagerGrievanceState,
} from "@/utils/manager/managerGrievanceApi";
import ApprovalCard from "@/components/ApprovalCard";
import { getGrievanceBadgeStatus } from "@/utils/getBadgeStatus";
import { Text } from "@/components/ui/text";
import useLoadingStore from "@/stores/loadingStore";
import EmptyPage from "@/components/EmptyPage";

export default function GrievancesPage() {
  const [grievances, setGrievances] = useState<any[]>([]);
  const setLoading = useLoadingStore((state) => state.setLoading);

  const fetchGrievances = () => {
    setLoading(true);
    getAllManagerGrievances()
      .then((data) => {
        setGrievances(data || []);
      })
      .catch((error) => {
        console.log("Error fetching Manager grievances:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      setLoading(true);
      await updateManagerGrievanceState(id);
      fetchGrievances();
    } catch (error) {
      console.log("Error approving grievance:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-4">
      <Text size="md" className="mb-4 text-typography-400">
        Please approve the grievances once they are resolved.
      </Text>
      {grievances.length === 0 ? (
        <EmptyPage
          title="No pending grievances"
          description="All grievances have been reviewed."
        />
      ) : (
        grievances.map((item, idx) => (
          <ApprovalCard
            key={item.grievances.id || idx}
            title={item.grievances.subject}
            subTitle={`By ${item.student?.rollNo || item.grievances.roll_number}`}
            badge={getGrievanceBadgeStatus(item.grievances.status)}
            onApprove={() => handleApprove(item.grievances.id)}
            data={{
              ...item.grievances,
              ...(item.student || {}),
            }}
            ApproveButtonTitle="Mark as Resolved"
          />
        ))
      )}
    </ScrollView>
  );
}