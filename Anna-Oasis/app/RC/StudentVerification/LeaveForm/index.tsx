import { useEffect, useState } from "react";
import { View, ScrollView, Alert } from "react-native";
import ApprovalCard, { badgeStatus } from "@/components/ApprovalCard";
import { fetchRCLeaveForms, updateRCLeaveFormStatus } from "@/utils/rc/RCLeaveFormApprovalApi";
import { Text } from "@/components/ui/text";
import { Spinner } from "@/components/ui/spinner";
import DeclineComment from "@/components/modals/DeclineComment";
import ModalCallable from "@/components/modals/ModalCallable";

export default function LeaveFormPage() {
  const [leaveForms, setLeaveForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedLeaveId, setSelectedLeaveId] = useState<number | null>(null);

  const getLeaveForms = async () => {
    setLoading(true);
    try {
      const data = await fetchRCLeaveForms();
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
      await updateRCLeaveFormStatus(leaveFormId, approve, comment);
      setModalMsg(approve ? "Leave form approved successfully!" : "Leave form rejected successfully!");
      setModalVisible(true);
      getLeaveForms();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to update leave form status");
    }
  };

  // Called when Decline is pressed
  const handleDecline = (leaveFormId: number) => {
    setSelectedLeaveId(leaveFormId);
    setRejectReason("");
    setRejectModalVisible(true);
  };

  // Called when rejection reason is submitted
  const submitRejection = (reason: string) => {
    if (!reason.trim()) {
      Alert.alert("Error", "Please provide a reason for rejection.");
      return;
    }
    handleDecision(
      selectedLeaveId!,
      false,
      `${reason.trim()} (Rejected by RC)`
    );
    setRejectModalVisible(false);
  };

  // Helper to map status
  const mapStatus = (status: string | number) => {
    if (status === "0") return badgeStatus.Pending;
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 12 }}>
      <ModalCallable
        show={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Success"
        message={modalMsg}
      />
      <DeclineComment
        visible={rejectModalVisible}
        onClose={() => setRejectModalVisible(false)}
        onSubmit={submitRejection}
        title="Reason for Rejection"
        placeholder="Enter reason for rejection"
        submitLabel="Submit"
        cancelLabel="Cancel"
      />
      {loading ? (
        <View className="items-center mt-8">
          <Spinner size="large" />
        </View>
      ) : leaveForms.length === 0 ? (
        <Text className="text-center mt-8 text-gray-500">No leave forms pending approval.</Text>
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
                badge={mapStatus(leave.status)}
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
                  "Emergency Contact": leave.emergency_contact,
                  "Status": leave.status === "0"
                      ? "Pending"
                      : leave.status 
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