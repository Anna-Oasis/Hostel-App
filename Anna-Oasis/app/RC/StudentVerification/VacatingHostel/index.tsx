import React, { useEffect, useState } from "react";
import { View, ScrollView, Alert, TextInput } from "react-native";
import ApprovalCard, { badgeStatus } from "@/components/ApprovalCard";
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
import {
  fetchRCVacatingApplications,
  approveRCVacatingApplication,
  rejectRCVacatingApplication,
} from "@/utils/rc-studentvacatinghostel/rcVacatingHostelAPI";

export default function VacatingHostelRCPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
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
    setRejectReason("");
    setRejectModalVisible(true);
  };

  const submitRejection = async () => {
    if (!rejectReason.trim()) {
      Alert.alert("Error", "Please provide a reason for rejection.");
      return;
    }
    try {
      await rejectRCVacatingApplication(
        selectedVacatingId!,
        `${rejectReason.trim()} (Rejected by RC)`
      );
      setSuccessMsg("Application rejected successfully!");
      setSuccessModalVisible(true);
      getApplications();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to reject application");
    }
    setRejectModalVisible(false);
  };

  const mapStatus = (status: string | number) => {
    if (status === "-1") return badgeStatus.Rejected;
    if (status === "3") return badgeStatus.Approved;
    return badgeStatus.Pending;
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 12 }}>
      {/* Success Modal */}
      <Modal isOpen={successModalVisible} onClose={() => setSuccessModalVisible(false)}>
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Text className="text-lg font-semibold">Success</Text>
          </ModalHeader>
          <ModalBody>
            <Text className="text-base text-green-700">{successMsg}</Text>
          </ModalBody>
          <ModalFooter>
            <Text
              className="text-blue-600 font-semibold"
              onPress={() => setSuccessModalVisible(false)}
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
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 6,
                padding: 10,
                minHeight: 60,
                marginTop: 8,
                marginBottom: 8,
                textAlignVertical: "top",
              }}
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
        <View className="flex-1 items-center justify-center">
          <Spinner size="large" color="#0000ff" />
        </View>
      ) : applications.length === 0 ? (
        <Text className="text-center mt-8 text-gray-500">No applications pending approval.</Text>
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
                badge={mapStatus(vac.status)}
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