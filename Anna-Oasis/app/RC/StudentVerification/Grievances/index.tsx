import { ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { getAllRCGrievances, updateGrievanceStatus } from "@/utils/rc/rcGrievanceApi";
import ApprovalCard from "@/components/ApprovalCard";
import { getGrievanceBadgeStatus } from "@/utils/getBadgeStatus";
import EmptyPage from "@/components/EmptyPage";
import ModalCallable from "@/components/modals/ModalCallable";

export default function GrievancesPage() {
  const [grievances, setGrievances] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMsg, setModalMsg] = useState("");

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
      setModalMsg("Grievance approved successfully!");
      setModalVisible(true);
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
    <>
      <ModalCallable
        show={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Success"
        message={modalMsg}
      />
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
    </>
  );
}