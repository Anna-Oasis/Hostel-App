import { ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { getAllRCGrievances, updateGrievanceStatus } from "@/utils/rc/rcGrievanceApi";
import ApprovalCard from "@/components/ApprovalCard";
import { getGrievanceBadgeStatus } from "@/utils/getBadgeStatus";
import EmptyPage from "@/components/EmptyPage";
import ModalCallable from "@/components/modals/ModalCallable";
import TabSwitch from "@/components/TabSwitch";
import { FileTextIcon, History } from "lucide-react-native";
import { GRIEVANCE_STATUS } from "@/constants/grievanceStatus";

type GrievanceTab = "pending" | "history";

export default function GrievancesPage() {
  const [grievances, setGrievances] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [activeTab, setActiveTab] = useState<GrievanceTab>("pending");

  const fetchGrievances = () => {
    getAllRCGrievances()
      .then((data) => {
        setGrievances(data || []);
      })
      .catch(() => {
        setGrievances([]);
      });
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  const pendingGrievances = grievances.filter(
    (item) => item.grievances?.status === GRIEVANCE_STATUS.SUBMITTED
  );
  const historyGrievances = grievances.filter(
    (item) =>
      item.grievances?.status === GRIEVANCE_STATUS.RC ||
      item.grievances?.status === GRIEVANCE_STATUS.DECLINED
  );
  const visibleGrievances = activeTab === "pending" ? pendingGrievances : historyGrievances;

  const handleApprove = async (id: number) => {
    try {
      await updateGrievanceStatus(id, true);
      setModalMsg("Grievance approved successfully!");
      setModalVisible(true);
      fetchGrievances();
    } catch {
      setModalMsg("Unable to update grievance status.");
      setModalVisible(true);
    }
  };

  const handleDecline = async (id: number) => {
    try {
      await updateGrievanceStatus(id, false);
      fetchGrievances();
    } catch {
      setModalMsg("Unable to update grievance status.");
      setModalVisible(true);
    }
  };

  return (
    <>
      <ModalCallable
        show={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Success"
        message={modalMsg}
      />
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
              subTitle={`By ${item.student?.name || "Student"} (${item.student?.rollNo || item.grievances?.roll_number || "N/A"})`}
              badge={getGrievanceBadgeStatus(item.grievances.status)}
              onApprove={activeTab === "pending" ? () => handleApprove(item.grievances.id) : undefined}
              onDecline={activeTab === "pending" ? () => handleDecline(item.grievances.id) : undefined}
              data={{
                Name: item.student?.name || "Student",
                ...item.grievances,
              }}
            />
          ))
        )}
      </ScrollView>
    </>
  );
}