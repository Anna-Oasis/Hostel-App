import { useEffect, useState } from "react";
import { View, ScrollView, Alert } from "react-native";
import ApprovalCard from "@/components/ApprovalCard";
import {
  fetchDWVacatingForms,
  approveDWVacatingForm,
  rejectDWVacatingForm,
} from "@/utils/deputyWarden/dwCacatinghostelAPI";
import { Spinner } from "@/components/ui/spinner";
import ModalCallable from "@/components/modals/ModalCallable";
import DeclineComment from "@/components/modals/DeclineComment";
import EmptyPage from "@/components/EmptyPage";
import { getHostelVacationBadgeStatus } from "@/utils/getBadgeStatus";

export default function VacatingHostelVerificationPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
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
    setRejectModalOpen(true);
  };

  // Reject submit (calls API)
  const submitRejection = async (reason: string) => {
    if (!reason.trim()) {
      Alert.alert("Error", "Please provide a reason for rejection.");
      return;
    }
    try {
      await rejectDWVacatingForm(selectedApp.id, reason.trim());
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
    <View className="flex-1 bg-white p-3">
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
        onClose={() => setRejectModalOpen(false)}
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
          title="No forms pending approval"
          description="There are currently no hostel vacating forms to verify."
        />
      ) : (
        <ScrollView>
          {applications.map((app) => (
            <View key={app.id} className="mb-4">
              <ApprovalCard
                title={`Vacating Hostel - ${app.roll_number}`}
                subTitle={`Vacating on ${app.vacating_date} at ${app.vacating_time}`}
                badge={getHostelVacationBadgeStatus(
                  typeof app.status === "string" ? parseInt(app.status) : app.status
                )}
                data={{
                  "Roll Number": app.roll_number,
                  "Vacating Date": app.vacating_date,
                  "Vacating Time": app.vacating_time,
                  "Future Address": app.future_address,
                  "Returned Items": Array.isArray(app.returned_items)
                    ? app.returned_items.join(", ")
                    : "None",
                  "Status":
                    app.status === "-1"
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