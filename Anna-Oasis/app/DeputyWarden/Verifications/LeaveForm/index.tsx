import React, { useEffect, useState } from "react";
import { View, ScrollView, Alert } from "react-native";
import ApprovalCard, { badgeStatus } from "@/components/ApprovalCard";
import { Text } from "@/components/ui/text";
import {
  fetchDeputyWardenLeaveForms,
  updateDeputyWardenLeaveFormStatus,
} from "@/utils/deputyWarden/dwStudentLeaveFormAPI";
import { Spinner } from "@/components/ui/spinner";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import DeclineComment from "@/components/modals/DeclineComment";

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

  // Helper to map status
  const mapStatus = (status: string | number) => {
    if (status === "2") return badgeStatus.Pending;
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 12 }}>
      {/* Success Modal */}
      <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Text className="text-lg font-semibold">Success</Text>
          </ModalHeader>
          <ModalBody>
            <Text className="text-base text-green-700">{modalMsg}</Text>
          </ModalBody>
          <ModalFooter>
            <Text
              className="text-blue-600 font-semibold"
              onPress={() => setModalVisible(false)}
              style={{ padding: 8 }}
            >
              OK
            </Text>
          </ModalFooter>
        </ModalContent>
      </Modal>
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