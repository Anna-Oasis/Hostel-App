import { View, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { getAllDWAdmissions, handleUpdateAdmission } from "@/utils/deputyWarden/dwAdmissionApi";
import ApprovalCard from "@/components/ApprovalCard";
import { getAdmissionBadgeStatus } from "@/utils/getBadgeStatus";
import DeclineComment from "@/components/modals/DeclineComment";
import EmptyPage from "@/components/EmptyPage";

export default function AdmissionsVerificationPage() {
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [declineModal, setDeclineModal] = useState<{ open: boolean; admissionId?: string }>({ open: false });

  const fetchAdmissions = async () => {
    try {
      const data = await getAllDWAdmissions();
      setAdmissions(Array.isArray(data) ? data : []);
    } catch (err) {
      setAdmissions([]);
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const handleApprove = async (admissionId: string) => {
    await handleUpdateAdmission(admissionId, { approve: true, comment: "Approved" });
    fetchAdmissions();
  };

  const handleDecline = (admissionId: string) => {
    setDeclineModal({ open: true, admissionId });
  };

  const handleDeclineSubmit = async (comment: string) => {
    if (declineModal.admissionId) {
      await handleUpdateAdmission(declineModal.admissionId, { approve: false, comment });
      fetchAdmissions();
    }
    setDeclineModal({ open: false, admissionId: undefined });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {admissions.length === 0 ? (
          <EmptyPage
            title="No pending admissions"
            description="All admissions have been reviewed."
          />
        ) : (
          admissions.map((item: any, idx: number) => (
            <ApprovalCard
              key={item.id || idx}
              title={item.roll_number}
              subTitle={`Block: ${item.hostelBlock}, Year: ${item.academicYear}`}
              badge={getAdmissionBadgeStatus(item.status)}
              data={item}
              onApprove={() => handleApprove(String(item.id))}
              onDecline={() => handleDecline(String(item.id))}
            />
          ))
        )}
      </ScrollView>
      <DeclineComment
        visible={declineModal.open}
        onClose={() => setDeclineModal({ open: false, admissionId: undefined })}
        onSubmit={handleDeclineSubmit}
        title="Decline Admission"
        placeholder="Enter reason for declining..."
        submitLabel="Decline"
        cancelLabel="Cancel"
      />
    </View>
  );
}