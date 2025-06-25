import { useEffect, useState } from "react";
import { View, ScrollView, Alert } from "react-native";
import ApprovalCard from "@/components/ApprovalCard";
import { fetchRCLeaveForms, updateRCLeaveFormStatus } from "@/utils/rc/RCLeaveFormApprovalApi";
import DeclineComment from "@/components/modals/DeclineComment";
import ModalCallable from "@/components/modals/ModalCallable";
import { getLeaveBadgeStatus } from "@/utils/getBadgeStatus";
import EmptyPage from "@/components/EmptyPage";
import useLoadingStore from "@/stores/loadingStore";

export default function LeaveFormPage() {
  const [leaveForms, setLeaveForms] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [selectedLeaveId, setSelectedLeaveId] = useState<number | null>(null);

  const setLoading = useLoadingStore((state) => state.setLoading);

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
    setLoading(true);
    try {
      await updateRCLeaveFormStatus(leaveFormId, approve, comment);
      setModalMsg(approve ? "Leave form approved successfully!" : "Leave form rejected successfully!");
      setModalVisible(true);
      await getLeaveForms();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to update leave form status");
    }
    setLoading(false);
  };

  const handleDecline = (leaveFormId: number) => {
    setSelectedLeaveId(leaveFormId);
    setRejectModalVisible(true);
  };

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
      {leaveForms.length === 0 ? (
        <EmptyPage
          title="No leave forms"
          description="There are currently no leave forms pending approval."
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