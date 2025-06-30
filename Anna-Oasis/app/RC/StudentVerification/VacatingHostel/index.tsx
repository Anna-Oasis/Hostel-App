import { useEffect, useState } from "react";
import { View, ScrollView, Alert } from "react-native";
import ApprovalCard from "@/components/ApprovalCard";
import { Spinner } from "@/components/ui/spinner";
import {
  fetchRCVacatingApplications,
  approveRCVacatingApplication,
  rejectRCVacatingApplication,
} from "@/utils/rc/rcVacatingHostelAPI";
import DeclineComment from "@/components/modals/DeclineComment";
import ModalCallable from "@/components/modals/ModalCallable";
import { getHostelVacationBadgeStatus } from "@/utils/getBadgeStatus";
import EmptyPage from "@/components/EmptyPage";

export default function VacatingHostelRCPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [declineModalVisible, setDeclineModalVisible] = useState(false);
  const [selectedVacatingId, setSelectedVacatingId] = useState<number | null>(null);

  const getApplications = async () => {
    setLoading(true);
    try {
      const data = await fetchRCVacatingApplications();
      setApplications(data);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to fetch applications");
      setApplications([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    getApplications();
  }, []);

  const handleApprove = async (vacating_hostel_id: number) => {
    try {
      await approveRCVacatingApplication(vacating_hostel_id);
      setSuccessMsg("Application approved successfully!");
      setSuccessModalVisible(true);
      getApplications();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to approve application");
    }
  };

  const handleDecline = (vacating_hostel_id: number) => {
    setSelectedVacatingId(vacating_hostel_id);
    setDeclineModalVisible(true);
  };

  const submitRejection = async (reason: string) => {
    if (!reason.trim()) {
      Alert.alert("Error", "Please provide a reason for rejection.");
      return;
    }
    try {
      await rejectRCVacatingApplication(
        selectedVacatingId!,
        `${reason.trim()} (Rejected by RC)`
      );
      setSuccessMsg("Application rejected successfully!");
      setSuccessModalVisible(true);
      getApplications();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to reject application");
    }
    setDeclineModalVisible(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 12 }}>
      {/* Success Modal */}
      <ModalCallable
        show={successModalVisible}
        onClose={() => setSuccessModalVisible(false)}
        title="Success"
        message={successMsg}
      />
      {/* Decline Comment Modal */}
      <DeclineComment
        visible={declineModalVisible}
        onClose={() => setDeclineModalVisible(false)}
        onSubmit={submitRejection}
        title="Reason for Rejection"
        placeholder="Enter reason for rejection"
        submitLabel="Submit"
        cancelLabel="Cancel"
      />
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <Spinner size="large" color="#0000ff" />
        </View>
      ) : applications.length === 0 ? (
        <EmptyPage
          title="No applications pending approval."
          description="There are currently no hostel vacating applications awaiting your action."
        />
      ) : (
        <ScrollView>
          {applications.map((item) => {
            // item: { student, vacating }
            const vac = item.vacating;
            const student = item.student;
            return (
              <ApprovalCard
                key={vac.id}
                title={`${student.name} (${student.rollNo})`}
                subTitle={`Vacating on ${vac.vacating_date} at ${vac.vacating_time}`}
                badge={getHostelVacationBadgeStatus(Number(vac.status))}
                data={{
                  "Student Name": student.name,
                  "Roll Number": student.rollNo,
                  "Course": student.course,
                  "Branch": student.branch,
                  "Semester": student.semester,
                  "Room Number": student.roomNumber,
                  "Vacating Date": vac.vacating_date,
                  "Vacating Time": vac.vacating_time,
                  "Future Address": vac.future_address,
                  "Returned Items": Array.isArray(vac.returned_items) ? vac.returned_items.join(", ") : "None",
                  "Status": vac.status === "-1"
                      ? "Rejected"
                      : vac.status === "3"
                      ? "Approved"
                      : "Pending",
                  "Submitted At": new Date(vac.created_at).toLocaleString(),
                }}
                onApprove={() => handleApprove(vac.id)}
                onDecline={() => handleDecline(vac.id)}
              />
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}