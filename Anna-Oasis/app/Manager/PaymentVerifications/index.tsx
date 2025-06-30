import { View, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import {
  getAllManagerAdmissions,
  managerApprove,
  managerDecline,
} from "@/utils/manager/managerAdmissionApi";
import ApprovalCard from "@/components/ApprovalCard";
import { getAdmissionBadgeStatus } from "@/utils/getBadgeStatus";
import useLoadingStore from "@/stores/loadingStore";
import EmptyPage from "@/components/EmptyPage";
import DeclineComment from "@/components/modals/DeclineComment";

export default function PaymentVerificationsPage() {
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [selectedAdmissionId, setSelectedAdmissionId] = useState<string | null>(
    null
  );
  const setLoading = useLoadingStore((state) => state.setLoading);

  const fetchAdmissions = async () => {
    try {
      const data = await getAllManagerAdmissions();
      setAdmissions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Error fetching manager admissions:", err);
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const handleApprove = async (admissionId: string) => {
    setLoading(true);
    await managerApprove(admissionId);
    fetchAdmissions();
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
    fetchAdmissions();
  };

  return (
    <View className="flex-1">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {admissions.length === 0 ? (
          <EmptyPage
            title="No pending verifications"
            description="All admissions have been reviewed."
          />
        ) : (
          admissions.map((admission) => (
            <ApprovalCard
              key={admission.id}
              title={`${admission.roll_number}`}
              subTitle={`Block: ${admission.hostelBlock}, Year: ${admission.academicYear}`}
              badge={getAdmissionBadgeStatus(admission.status)}
              data={admission}
              onApprove={() => handleApprove(admission.id)}
              onDecline={() => handleDecline(admission.id)}
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

