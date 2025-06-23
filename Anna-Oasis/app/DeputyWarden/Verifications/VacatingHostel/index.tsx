import React, { useEffect, useState } from "react";
import { View, ScrollView, Alert, TextInput } from "react-native";
import ApprovalCard, { badgeStatus } from "@/components/ApprovalCard";
import {
  fetchDWVacatingForms,
  approveDWVacatingForm,
  rejectDWVacatingForm,
} from "@/utils/dw-studentvacatinghostel/dwvacatinghostelAPI";
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

export default function VacatingHostelVerificationPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedApp, setSelectedApp] = useState<any>(null);

  const getApplications = async () => {
    setLoading(true);
    try {
      const data = await fetchDWVacatingForms();
      setApplications(data);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to fetch forms");
      setApplications([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    getApplications();
  }, []);

  // Approve handler
  const handleApprove = async (app: any) => {
    try {
      await approveDWVacatingForm(app.id);
      setSuccessMsg("Form approved successfully!");
      setSuccessModalVisible(true);
      getApplications();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to approve form");
    }
  };

  // Reject handler (opens modal)
  const handleReject = (app: any) => {
    setSelectedApp(app);
    setRejectReason("");
    setRejectModalOpen(true);
  };

  // Reject submit (calls API)
  const submitRejection = async () => {
    if (!rejectReason.trim()) {
      Alert.alert("Error", "Please provide a reason for rejection.");
      return;
    }
    try {
      await rejectDWVacatingForm(selectedApp.id, rejectReason.trim());
      setSuccessMsg("Form rejected successfully!");
      setSuccessModalVisible(true);
      setRejectModalOpen(false);
      setSelectedApp(null);
      getApplications();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to reject form");
    }
  };

  const mapStatus = (status: string | number) => {
    if (status === "-1") return badgeStatus.Rejected;
    if (status === "3") return badgeStatus.Approved;
    return badgeStatus.Pending;
  };

  return (
    <View className="flex-1 bg-white p-3">
      {/* Success Modal for both approval and rejection */}
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
              className="text-blue-600 font-semibold p-2"
              onPress={() => setSuccessModalVisible(false)}
            >
              OK
            </Text>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Rejection Reason Modal */}
      <Modal isOpen={rejectModalOpen} onClose={() => setRejectModalOpen(false)}>
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
              className="border border-gray-300 rounded-lg p-3 min-h-[60px] mt-2 mb-2 text-base"
              style={{ textAlignVertical: "top" }}
            />
          </ModalBody>
          <ModalFooter>
            <Text
              className="text-blue-600 font-semibold mr-6 p-2"
              onPress={submitRejection}
            >
              Submit
            </Text>
            <Text
              className="text-gray-600 font-semibold p-2"
              onPress={() => setRejectModalOpen(false)}
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
        <Text className="text-center mt-8 text-gray-500">No forms pending approval.</Text>
      ) : (
        <ScrollView>
          {applications.map((app) => (
            <View key={app.id} className="mb-4">
              <ApprovalCard
                title={`Vacating Hostel - ${app.roll_number}`}
                subTitle={`Vacating on ${app.vacating_date} at ${app.vacating_time}`}
                badge={mapStatus(app.status)}
                data={{
                  "Roll Number": app.roll_number,
                  "Vacating Date": app.vacating_date,
                  "Vacating Time": app.vacating_time,
                  "Future Address": app.future_address,
                  "Returned Items": Array.isArray(app.returned_items)
                    ? app.returned_items.join(", ")
                    : "None",
                  "Status": app.status === "-1"
                      ? "Rejected"
                      : app.status === "3"
                      ? "Approved"
                      : "Pending",
                  "Submitted At": new Date(app.created_at).toLocaleString(),
                }}
                onApprove={() => handleApprove(app)}
                onDecline={() => handleReject(app)}
              />
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
