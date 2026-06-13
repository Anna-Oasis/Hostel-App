import { View, ScrollView, TextInput } from "react-native";
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

  const [searchRollNo, setSearchRollNo] = useState("");

  const filteredAdmissions = admissions.filter((admission) =>
      admission.rollNo
        ?.toString()
        .toLowerCase()
        .includes(searchRollNo.toLowerCase())
    );


  return (
    <View className="flex-1">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {admissions.length === 0 ? (
          <EmptyPage
            title="No pending verifications"
            description="All admissions have been reviewed."
          />
        ) : (
          <>
            <TextInput
              placeholder="Search by Roll No"
              value={searchRollNo}
              onChangeText={setSearchRollNo}
              className="border border-gray-300 rounded-lg px-4 py-3 mb-4 bg-white w-full sm:w-[80%] md:w-[50%] self-center"
            />
            {filteredAdmissions.map((item) => (
              <ApprovalCard
                key={item.admission.id}
                title={`${item.admission.roll_number}`}
                subTitle={`Block: ${item.admission.hostelBlock}, Year: ${item.admission.academicYear}`}
                badge={getAdmissionBadgeStatus(item.admission.status)}
                data={{ ...item.admission, ...item.student }}
                onApprove={() => handleApprove(item.admission.id)}
                onDecline={() => handleDecline(item.admission.id)}
              />
            ))}
          </>
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
