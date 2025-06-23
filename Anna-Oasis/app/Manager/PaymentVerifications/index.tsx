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
import { Text } from "@/components/ui/text";
import ManagerDeclineModal from "@/components/manager/ManagerDeclineModal";
import { Icon } from "@/components/ui/icon";
import { Inbox } from "lucide-react-native";

export default function PaymentVerificationsPage() {
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineComment, setDeclineComment] = useState("");
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

  const handleDeclineSubmit = async () => {
    setLoading(true);
    await managerDecline(selectedAdmissionId!, declineComment);
    setShowDeclineModal(false);
    setDeclineComment("");
    setSelectedAdmissionId(null);
    setLoading(false);
  };

  return (
    <View className="flex-1">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {admissions.length === 0 ? (
          <View className="flex-1 justify-center items-center mt-16">
            <Icon as={Inbox} size="xl" color="#a3a3a3" className="mb-4" />
            <Text size="lg" className="text-typography-400 font-semibold mb-2">
              No pending verifications
            </Text>
            <Text size="sm" className="text-typography-300 text-center">
              All admissions have been reviewed.
            </Text>
          </View>
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
      <ManagerDeclineModal
        isOpen={showDeclineModal}
        comment={declineComment}
        onChangeComment={setDeclineComment}
        onCancel={() => {
          setShowDeclineModal(false);
          setDeclineComment("");
          setSelectedAdmissionId(null);
        }}
        onSubmit={handleDeclineSubmit}
      />
    </View>
  );
}
