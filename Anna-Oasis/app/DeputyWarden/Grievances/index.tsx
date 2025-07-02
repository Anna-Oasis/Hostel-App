import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { getDeputyWardenGrievances } from "@/utils/deputyWarden/dwGrievanceUtils";
import ApprovalCard from "@/components/ApprovalCard";
import { getGrievanceBadgeStatus } from "@/utils/getBadgeStatus";
import EmptyPage from "@/components/EmptyPage";

export default function GrievancesPage() {
  const [grievances, setGrievances] = useState<any[]>([]);

  const fetchGrievances = async () => {
    try {
      const data = await getDeputyWardenGrievances();
      setGrievances(data || []);
    } catch (error) {
      setGrievances([]);
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-4">
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
            data={{
              ...item.grievances,
              ...(item.student || {}),
            }}
          />
        ))
      )}
    </ScrollView>
  );
}