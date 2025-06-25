import React, { useEffect, useState } from "react";
import { View, ScrollView, Alert, TextInput } from "react-native";
import ApprovalCard, { badgeStatus } from "@/components/ApprovalCard";
import { fetchRCLeaveForms, updateRCLeaveFormStatus } from "@/utils/rc-studentleaveform/RCLeaveFormApprovalAPI";
import { Text } from "@/components/ui/text";
import { Spinner } from "@/components/ui/spinner";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";

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
  const submitRejection = () => {
    if (!rejectReason.trim()) {
      Alert.alert("Error", "Please provide a reason for rejection.");
      return;
    }
    handleDecision(
      selectedLeaveId!,
      false,
      `${rejectReason.trim()} (Rejected by RC)`
    );
    setRejectModalVisible(false);
  };

  // Helper to map status
  const mapStatus = (status: string | number) => {
    if (status === "0") return badgeStatus.Pending;
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
      <Modal isOpen={rejectModalVisible} onClose={() => setRejectModalVisible(false)}>
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Text className="text-lg font-semibold">Reason for Rejection</Text>
          </ModalHeader>
            <ModalBody>
            <TextInput
              placeholder="Enter reason for rejection"
              value={rejectReason}
              onChangeText={setRejectReason}
              multiline
              className="border border-gray-300 rounded-lg p-3 min-h-[60px] mt-2 mb-2 text-top"
            />
            </ModalBody>
          <ModalFooter>
            <Text
              className="text-blue-600 font-semibold mr-6"
              onPress={submitRejection}
              style={{ padding: 8 }}
            >
              Submit
            </Text>
            <Text
              className="text-gray-600 font-semibold"
              onPress={() => setRejectModalVisible(false)}
              style={{ padding: 8 }}
            >
              Cancel
            </Text>
          </ModalFooter>
        </ModalContent>
      </Modal>
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