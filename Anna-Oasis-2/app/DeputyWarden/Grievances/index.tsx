import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { getDeputyWardenGrievances } from "@/utils/deputyWarden/dwGrievanceUtils";
import ApprovalCard from "@/components/ApprovalCard";
import { getGrievanceBadgeStatus } from "@/utils/getBadgeStatus";
import EmptyPage from "@/components/EmptyPage";
import TabSwitch from "@/components/TabSwitch";
import { FileTextIcon, History } from "lucide-react-native";

type GrievanceTab = "pending" | "history";

export default function GrievancesPage() {
  const [grievances, setGrievances] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<GrievanceTab>("history");

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

  const pendingGrievances = grievances.filter((item) => item.grievances?.status === "0");
  const historyGrievances = grievances.filter((item) => item.grievances?.status !== "0");
  const visibleGrievances = activeTab === "pending" ? pendingGrievances : historyGrievances;

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-4">
      <TabSwitch
        tabs={[
          { label: "Pending", value: "pending" },
          { label: "History", value: "history" },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        icons={{ pending: FileTextIcon, history: History }}
        className="mb-4"
      />
      {visibleGrievances.length === 0 ? (
        <EmptyPage
          title={activeTab === "pending" ? "No pending grievances" : "No grievance history"}
          description={activeTab === "pending" ? "All grievances have been reviewed." : "No reviewed grievances are available yet."}
        />
      ) : (
        visibleGrievances.map((item, idx) => (
          <ApprovalCard
            key={item.grievances.id || idx}
            title={item.grievances.subject}
            subTitle={`By ${item.student?.rollNo || item.grievances.roll_number}`}
            badge={getGrievanceBadgeStatus(item.grievances.status)}
            data={{
              Name: item.student?.name || "Student",
              ...item.grievances,
            }}
          />
        ))
      )}
    </ScrollView>
  );
}