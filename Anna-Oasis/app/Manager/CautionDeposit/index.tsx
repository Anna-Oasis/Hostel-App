import React, { useEffect, useState } from "react";
import { View, ScrollView, Alert, TextInput } from "react-native";
import ApprovalCard, { badgeStatus } from "@/components/ApprovalCard";
import RefundApprovalModal from "@/components/cautiondeposit/RefundApprovalModal";
import {
  fetchManagerVacatingForms,
  approveManagerVacatingForm,
  rejectManagerVacatingForm,
} from "@/utils/manager-studentvacatinghostel/managercautiondepositAPI";
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

export default function CautionDepositManager() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const getApplications = async () => {
    setLoading(true);
    try {
      const data = await fetchManagerVacatingForms();
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

  const handleApprove = (app: any) => {
    setSelectedApp(app);
    setRefundModalOpen(true);
  };

  const handleRefundSubmit = async (formData: FormData) => {
    try {
      await approveManagerVacatingForm(
        selectedApp.vacating_hostel_id,
        formData.get("deductionAmount") as string,
        formData.get("refundAmount") as string,
        formData.get("deductionReason") as string
      );
      setSuccessMsg("Form approved successfully!");
      setSuccessModalVisible(true);
      setRefundModalOpen(false);
      setSelectedApp(null);
      getApplications();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to approve form");
    }
  };

  const handleReject = (app: any) => {
    setSelectedApp(app);
    setRejectReason("");
    setRejectModalOpen(true);
  };

  const submitRejection = async () => {
    if (!rejectReason.trim()) {
      Alert.alert("Error", "Please provide a reason for rejection.");
      return;
    }
    try {
      await rejectManagerVacatingForm(
        selectedApp.vacating_hostel_id,
        rejectReason.trim() + " (Rejected by Manager)",
        selectedApp.deductions || "0.00",
        selectedApp.refund_amount || "0.00",
        selectedApp.deduction_details || "None"
      );
      setSuccessMsg("Form rejected successfully!");
      setSuccessModalVisible(true);
      setRejectModalOpen(false);
      setSelectedApp(null);
      getApplications();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to reject form");
    }
  };

  return (
    <View className="flex-1 bg-white p-4">
      {/* Refund Approval Modal */}
      <RefundApprovalModal
        isOpen={refundModalOpen}
        onClose={() => {
          setRefundModalOpen(false);
          setSelectedApp(null);
        }}
        onSubmit={handleRefundSubmit}
        application={
          selectedApp
            ? {
                id: selectedApp.vacating_hostel_id?.toString(),
                name: selectedApp.accountHolderName,
                rollNumber: selectedApp.accountNumber,
              }
            : null
        }
      />
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
              textAlignVertical="top"
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
      <ScrollView>
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <Spinner size="large" color="#0000ff" />
          </View>
        ) : applications.length === 0 ? (
          <Text className="text-center mt-8 text-gray-500">No forms pending approval.</Text>
        ) : (
          applications.map((app) => (
            <View key={app.vacating_hostel_id} className="mb-4">
              <ApprovalCard
                title={`Vacating Hostel - ${app.accountHolderName}`}
                subTitle={`Account: ${app.accountNumber} | Bank: ${app.bankName}`}
                badge={badgeStatus.Pending}
                data={{
                  "Account Holder": app.accountHolderName,
                  "Account Number": app.accountNumber,
                  "Bank Name": app.bankName,
                  "Bank Address": app.addressOfTheBank,
                  "IFSC": app.IFSCode,
                  "Deductions": app.deductions,
                  "Refund Amount": app.refund_amount,
                  "Deduction Details": app.deduction_details || "None",
                  "Submitted At": new Date(app.timestamp).toLocaleString(),
                }}
                onApprove={() => handleApprove(app)}
                onDecline={() => handleReject(app)}
              />
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
