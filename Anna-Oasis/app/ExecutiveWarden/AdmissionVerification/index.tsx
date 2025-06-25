import { View, ScrollView } from "react-native";
import { Text } from "@/components/ui/text";
import { useEffect, useState } from "react";
import {
  getAllEWAdmissions,
  handleUpdateEWAdmission,
} from "@/utils/executiveWarden/ewAdmissionApi";
import ApprovalCard from "@/components/ApprovalCard";
import { getAdmissionBadgeStatus } from "@/utils/getBadgeStatus";
import { Icon } from "@/components/ui/icon";
import { Inbox } from "lucide-react-native";
import DeclineComment from "@/components/modals/DeclineComment";

export default function AdmissionVerificationPage() {
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [declineModal, setDeclineModal] = useState<{
    open: boolean;
    admissionId?: string;
  }>({
    open: false,
  });

  const fetchAdmissions = async () => {
    try {
      const data = await getAllEWAdmissions();
      setAdmissions(Array.isArray(data) ? data : []);
    } catch (err) {
      setAdmissions([]);
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const handleApprove = async (admissionId: string) => {
    await handleUpdateEWAdmission(admissionId, {
      approve: true,
      comment: "Approved",
    });
    fetchAdmissions();
  };

  const handleDecline = (admissionId: string) => {
    setDeclineModal({ open: true, admissionId });
  };

  const handleDeclineSubmit = async (comment: string) => {
    if (declineModal.admissionId) {
      await handleUpdateEWAdmission(declineModal.admissionId, {
        approve: false,
        comment,
      });
      fetchAdmissions();
    }
    setDeclineModal({ open: false, admissionId: undefined });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {admissions.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 64,
            }}
          >
            <Icon
              as={Inbox}
              size="xl"
              color="#a3a3a3"
              style={{ marginBottom: 16 }}
            />
            <Text
              size="lg"
              className="text-typography-400 font-semibold mb-2"
            >
              No pending admissions
            </Text>
            <Text
              size="sm"
              className="text-typography-300 text-center"
            ></Text>
          </View>
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