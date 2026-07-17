import { View, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import {
  getAllManagerAdmissions,
  getApprovedManagerAdmissions,
  managerApprove,
  managerDecline,
} from "@/utils/manager/managerAdmissionApi";
import ApprovalCard, { badgeStatus } from "@/components/ApprovalCard";
import { getAdmissionBadgeStatus } from "@/utils/getBadgeStatus";
import useLoadingStore from "@/stores/loadingStore";
import EmptyPage from "@/components/EmptyPage";
import DeclineComment from "@/components/modals/DeclineComment";
import TabSwitch from "@/components/TabSwitch";

export default function PaymentVerificationsPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "approved">("pending");
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [selectedAdmissionId, setSelectedAdmissionId] = useState<string | null>(
    null
  );
  const setLoading = useLoadingStore((state) => state.setLoading);

  const fetchAdmissions = async (tab: "pending" | "approved" = activeTab) => {
    try {
      const data = tab === "approved"
        ? await getApprovedManagerAdmissions()
        : await getAllManagerAdmissions();
      setAdmissions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Error fetching manager admissions:", err);
    }
  };

  useEffect(() => {
    fetchAdmissions(activeTab);
  }, [activeTab]);

  const handleApprove = async (admissionId: string) => {
    setLoading(true);
    await managerApprove(admissionId);
    fetchAdmissions(activeTab);
    setLoading(false);
  };

  const handleDecline = (admissionId: string) => {
    setSelectedAdmissionId(admissionId);
    setShowDeclineModal(true);
  };

  const handleDeclineSubmit = async (comment: string) => {
    setLoading(true);
    await managerDecline(selectedAdmissionId!, comment);
    setShowDeclineModal(false);
    setSelectedAdmissionId(null);
    setLoading(false);
    fetchAdmissions(activeTab);
  };

  return (
    <View className="flex-1">
      <TabSwitch
        tabs={[
          { label: "Pending", value: "pending" },
          { label: "Approved", value: "approved" },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {admissions.length === 0 ? (
          <EmptyPage
            title={
              activeTab === "approved"
                ? "No approved verifications"
                : "No pending verifications"
            }
            description={
              activeTab === "approved"
                ? "There are currently no admissions you have approved."
                : "All admissions have been reviewed."
            }
          />
        ) : (
          admissions.map((item) => (
            <ApprovalCard
              key={item.admission.id}
              title={`${item.admission.roll_number}`}
              subTitle={`Block: ${item.admission.hostelBlock}, Year: ${item.admission.academicYear}`}
              badge={
                activeTab === "approved"
                  ? badgeStatus.Approved
                  : getAdmissionBadgeStatus(item.admission.status)
              }
              data={{ ...item.admission, ...(item.student || {}) }}
              onApprove={
                activeTab === "pending"
                  ? () => handleApprove(item.admission.id)
                  : undefined
              }
              onDecline={
                activeTab === "pending"
                  ? () => handleDecline(item.admission.id)
                  : undefined
              }
            />
          ))
        )}
      </ScrollView>
      <DeclineComment
        visible={showDeclineModal}
        onClose={() => {
          setShowDeclineModal(false);
          setSelectedAdmissionId(null);
        }}
        onSubmit={handleDeclineSubmit}
        title="Decline Admission"
        placeholder="Enter reason for declining..."
        submitLabel="Decline"
        cancelLabel="Cancel"
      />
    </View>
  );
}
