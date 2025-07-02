import { View, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { getAllDWAdmissions, handleUpdateAdmission } from "@/utils/deputyWarden/dwAdmissionApi";
import ApprovalCard from "@/components/ApprovalCard";
import { getAdmissionBadgeStatus } from "@/utils/getBadgeStatus";
import { Inbox } from "lucide-react-native";
import DeclineComment from "@/components/modals/DeclineComment";
import EmptyPage from "@/components/EmptyPage";
import TabSwitch from "@/components/TabSwitch";
import { useRouter } from "expo-router";

export default function AdmissionVerificationPage() {
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [declineModal, setDeclineModal] = useState<{
    open: boolean;
    admissionId?: string;
  }>({
    open: false,
  });
  const [activeTab, setActiveTab] = useState<"room" | "final">("room");
  const router = useRouter();

  const fetchAdmissions = async () => {
    try {
      const data = await  getAllDWAdmissions();
      // data is now [{ admission: {...}, student: {...} }, ...]
      setAdmissions(Array.isArray(data) ? data : []);
    } catch (err) {
      setAdmissions([]);
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const handleApprove = async (admissionId: string) => {
    await handleUpdateAdmission(admissionId, {
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
      await handleUpdateAdmission(declineModal.admissionId, {
        approve: false,
        comment,
      });
      fetchAdmissions();
    }
    setDeclineModal({ open: false, admissionId: undefined });
  };

  // Use admission.status for filtering
  const roomAllocAdmissions = admissions.filter(
    (item) => item.admission.status === "1"
  );
  const finalApprovalAdmissions = admissions.filter(
    (item) => item.admission.status === "2"
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <TabSwitch
        tabs={[
          { label: "Room Allocation", value: "room" },
          { label: "Final Approval", value: "final" },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="mt-4 mb-2"
      />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {activeTab === "room" ? (
          roomAllocAdmissions.length === 0 ? (
            <EmptyPage
              title="No pending admissions"
              description=""
              icon={Inbox}
            />
          ) : (
            roomAllocAdmissions.map((item: any, idx: number) => (
              <ApprovalCard
                key={item.admission.id || idx}
                title={item.admission.roll_number}
                subTitle={`Block: ${item.admission.hostelBlock}, Year: ${item.admission.academicYear}`}
                badge={getAdmissionBadgeStatus(item.admission.status)}
                data={{ ...item.admission, ...item.student }}
                onApprove={() =>
                  router.push(
                    `/DeputyWarden/AdmissionVerification/${item.admission.hostelBlock}/${item.admission.academicYear}/${item.admission.id}`
                  )
                }
                onDecline={() => handleDecline(String(item.admission.id))}
              />
            ))
          )
        ) : finalApprovalAdmissions.length === 0 ? (
          <EmptyPage
            title="No pending admissions"
            description=""
            icon={Inbox}
          />
        ) : (
          finalApprovalAdmissions.map((item: any, idx: number) => (
            <ApprovalCard
              key={item.admission.id || idx}
              title={item.admission.roll_number}
              subTitle={`Block: ${item.admission.hostelBlock}, Year: ${item.admission.academicYear}`}
              badge={getAdmissionBadgeStatus(item.admission.status)}
              data={item}
              onApprove={() => handleApprove(String(item.admission.id))}
              onDecline={() => handleDecline(String(item.admission.id))}
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
