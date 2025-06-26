import { useEffect, useState } from "react";
import { View, ScrollView, Alert } from "react-native";
import ApprovalCard, { badgeStatus } from "@/components/ApprovalCard";
import RefundApprovalModal from "@/components/cautiondeposit/RefundApprovalModal";
import {
  fetchManagerVacatingForms,
  approveManagerVacatingForm,
  rejectManagerVacatingForm,
} from "@/utils/manager-studentvacatinghostel/managercautiondepositAPI";
import { Spinner } from "@/components/ui/spinner";
import DeclineComment from "@/components/modals/DeclineComment";
import ModalCallable from "@/components/modals/ModalCallable";
import EmptyPage from "@/components/EmptyPage";

export default function CautionDepositManager() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

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

  const handleRefundSubmit = async (values: { refundAmount: string; deductionAmount: string; deductionReason: string; studentRollNumber: string }) => {
    try {
      await approveManagerVacatingForm(
        selectedApp.vacating_hostel_id,
        values.deductionAmount,
        values.refundAmount,
        values.deductionReason
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
    setRejectModalOpen(true);
  };

  const submitRejection = async (reason: string) => {
    if (!reason.trim()) {
      Alert.alert("Error", "Please provide a reason for rejection.");
      return;
    }
    try {
      await rejectManagerVacatingForm(
        selectedApp.vacating_hostel_id,
        reason.trim() + " (Rejected by Manager)",
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
      <ModalCallable
        show={successModalVisible}
        onClose={() => setSuccessModalVisible(false)}
        title="Success"
        message={successMsg}
      />
      {/* Rejection Reason Modal */}
      <DeclineComment
        visible={rejectModalOpen}
        onClose={() => {
          setRejectModalOpen(false);
          setSelectedApp(null);
        }}
        onSubmit={submitRejection}
        title="Reason for Rejection"
        placeholder="Enter reason for rejection"
        submitLabel="Submit"
        cancelLabel="Cancel"
      />
      <ScrollView>
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <Spinner size="large" color="#0000ff" />
          </View>
        ) : applications.length === 0 ? (
          <EmptyPage
            title="No forms pending approval"
            description="All caution deposit forms have been reviewed."
          />
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
