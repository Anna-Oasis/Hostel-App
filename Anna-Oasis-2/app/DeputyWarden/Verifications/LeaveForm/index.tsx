import { useEffect, useState } from "react";
import { View, ScrollView, Alert } from "react-native";
import ApprovalCard, { badgeStatus } from "@/components/ApprovalCard";
import {
  fetchDeputyWardenLeaveForms,
  updateDeputyWardenLeaveFormStatus,
} from "@/utils/deputyWarden/dwStudentLeaveFormAPI";
import { Spinner } from "@/components/ui/spinner";
import ModalCallable from "@/components/modals/ModalCallable";
import DeclineComment from "@/components/modals/DeclineComment";
import EmptyPage from "@/components/EmptyPage";
import { getLeaveBadgeStatus } from "@/utils/getBadgeStatus";

export default function LeaveFormVerificationPage() {
  const [leaveForms, setLeaveForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [declineModal, setDeclineModal] = useState<{ open: boolean; leaveId?: number }>({
    open: false,
  });

  const getLeaveForms = async () => {
    setLoading(true);
    try {
      const data = await fetchDeputyWardenLeaveForms();
      setLeaveForms(data);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to fetch leave forms");
      setLeaveForms([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    getLeaveForms();
  }, []);

  const handleDecision = async (leaveFormId: number, approve: boolean, comment?: string) => {
    try {
      await updateDeputyWardenLeaveFormStatus(leaveFormId, approve, comment);
      setModalMsg(approve ? "Leave form approved successfully!" : "Leave form rejected successfully!");
      setModalVisible(true);
      getLeaveForms();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to update leave form status");
    }
  };

  // Called when Decline is pressed
  const handleDecline = (leaveFormId: number) => {
    setDeclineModal({ open: true, leaveId: leaveFormId });
  };

  // Called when rejection reason is submitted
  const handleDeclineSubmit = (comment: string) => {
    if (!declineModal.leaveId) return;
    if (!comment.trim()) {
      Alert.alert("Error", "Please provide a reason for rejection.");
      return;
    }
    handleDecision(
      declineModal.leaveId,
      false,
      `${comment.trim()} (Rejected by Deputy Warden)`
    );
    setDeclineModal({ open: false, leaveId: undefined });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 12 }}>
      {/* Success Modal */}
      <ModalCallable
        show={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Success"
        message={modalMsg}
      />
      {/* Rejection Reason Modal */}
      <DeclineComment
        visible={declineModal.open}
        onClose={() => setDeclineModal({ open: false, leaveId: undefined })}
        onSubmit={handleDeclineSubmit}
        title="Reason for Rejection"
        placeholder="Enter reason for rejection"
        submitLabel="Submit"
        cancelLabel="Cancel"
      />
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <Spinner size="large" color="#0000ff" />
        </View>
      ) : leaveForms.length === 0 ? (
        <EmptyPage
          title="No leave forms pending approval."
          description="There are currently no leave forms to review."
        />
      ) : (
        <ScrollView>
          {leaveForms.map((item) => {
            const leave = item.leave_form;
            const student = item.student;
            return (
              <ApprovalCard
                key={leave.id}
                title={`${student.name} (${leave.roll_number})`}
                subTitle={`${leave.leave_type} | ${leave.from_date} to ${leave.to_date}`}
                badge={getLeaveBadgeStatus(leave.status)}
                data={{
                  "Student Name": student.name,
                  "Roll Number": leave.roll_number,
                  "Course": student.course,
                  "Branch": student.branch,
                  "Semester": student.semester,
                  "Room Number": student.roomNumber,
                  "Leave Type": leave.leave_type,
                  "From": leave.from_date,
                  "To": leave.to_date,
                  "Reason": leave.reason,
                  "Address of Stay": leave.address_of_stay,
                  "Emergency Contact": leave.mobile,
                  "Email": leave.email,
                  "Status": leave.status === "2" ? "Pending" : leave.status,
                }}
                onApprove={() => handleDecision(leave.id, true)}
                onDecline={() => handleDecline(leave.id)}
              />
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}