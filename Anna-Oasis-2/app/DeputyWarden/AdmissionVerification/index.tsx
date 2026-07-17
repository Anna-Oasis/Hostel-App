import { View, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { getAllDWAdmissions, getApprovedDWAdmissions, handleUpdateAdmission } from "@/utils/deputyWarden/dwAdmissionApi";
import ApprovalCard, { badgeStatus } from "@/components/ApprovalCard";
import { getAdmissionBadgeStatus } from "@/utils/getBadgeStatus";
import { Inbox } from "lucide-react-native";
import DeclineComment from "@/components/modals/DeclineComment";
import EmptyPage from "@/components/EmptyPage";
import TabSwitch from "@/components/TabSwitch";
import { useRouter } from "expo-router";

export default function AdmissionVerificationPage() {
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [approvedAdmissions, setApprovedAdmissions] = useState<any[]>([]);
  const [declineModal, setDeclineModal] = useState<{
    open: boolean;
    admissionId?: string;
  }>({
    open: false,
  });
  const [activeTab, setActiveTab] = useState<"room" | "final" | "approved">("room");
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

  const fetchApprovedAdmissions = async () => {
    try {
      const data = await getApprovedDWAdmissions();
      setApprovedAdmissions(Array.isArray(data) ? data : []);
    } catch (err) {
      setApprovedAdmissions([]);
    }
  };

  useEffect(() => {
    if (activeTab === "approved") {
      fetchApprovedAdmissions();
    } else {
      fetchAdmissions();
    }
  }, [activeTab]);

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
          { label: "Approved", value: "approved" },
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
                data={{  ...item.student, ...item.admission }}
                onApprove={() =>
                  router.push(
                    `/DeputyWarden/AdmissionVerification/${item.admission.hostelBlock}/${item.admission.academicYear}/${item.admission.id}`
                  )
                }
                onDecline={() => handleDecline(String(item.admission.id))}
              />
            ))
          )
        ) : activeTab === "final" ? (
          finalApprovalAdmissions.length === 0 ? (
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
                data={{  ...item.student, ...item.admission }}
                onApprove={() => handleApprove(String(item.admission.id))}
                onDecline={() => handleDecline(String(item.admission.id))}
              />
            ))
          )
        ) : approvedAdmissions.length === 0 ? (
          <EmptyPage
            title="No approved admissions"
            description="There are currently no admissions you have approved."
            icon={Inbox}
          />
        ) : (
          approvedAdmissions.map((item: any, idx: number) => (
            <ApprovalCard
              key={item.admission.id || idx}
              title={item.admission.roll_number}
              subTitle={`Block: ${item.admission.hostelBlock}, Year: ${item.admission.academicYear}`}
              badge={badgeStatus.Approved}
              data={{ ...(item.student || {}), ...item.admission }}
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
