import { View, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { getAllRCAdmissions, getApprovedRCAdmissions } from "@/utils/rc/rcAdmissionApi";
import ApprovalCard, { badgeStatus } from "@/components/ApprovalCard";
import { getAdmissionBadgeStatus } from "@/utils/getBadgeStatus";
import { router } from "expo-router";
import { allocateRoomAdmission } from "@/utils/rc/rcAdmissionApi";
import EmptyPage from "@/components/EmptyPage";
import TabSwitch from "@/components/TabSwitch";

export default function RoomAllocationPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "approved">("pending");
  const [admissions, setAdmissions] = useState<any[]>([]);

  const fetchAdmissions = async (tab: "pending" | "approved" = activeTab) => {
    try {
      const data = tab === "approved"
        ? await getApprovedRCAdmissions()
        : await getAllRCAdmissions();
      setAdmissions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Error fetching RC admissions:", err);
    }
  };

  useEffect(() => {
    fetchAdmissions(activeTab);
  }, [activeTab]);

  const handleApprove = (admissionId: string) => {
    router.replace(`/RC/RoomAllocation/Approve/${admissionId}` as any)
    console.log("Approved");
  }

  const handleDecline = async (admissionId: string) => {
    await allocateRoomAdmission(admissionId, {
      approve: false,
      comment: "Declined",
      room: 99,
      floor: 99,
      hostel_block: "Flora",
    });
    fetchAdmissions(activeTab);
  };

  return (
    <View className="flex-1 bg-white">
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
                ? "No approved room allocations"
                : "No pending room allocations"
            }
            description={
              activeTab === "approved"
                ? "There are currently no admissions you have approved."
                : "All admissions have been reviewed."
            }
          />
        ) : (
          admissions.map((item: any, idx: number) => (
            <ApprovalCard
              key={item.admission.id || idx}
              title={activeTab === "approved" ? item.admission.roll_number : item.student.name}
              subTitle={`Roll: ${item.admission.roll_number}, Block: ${item.admission.hostelBlock}, Year: ${item.admission.academicYear}`}
              badge={
                activeTab === "approved"
                  ? badgeStatus.Approved
                  : getAdmissionBadgeStatus(item.admission.status)
              }
              data={{
                ...item.admission,
                ...(item.student || {}),
              }}
              onApprove={
                activeTab === "pending"
                  ? () => handleApprove(String(item.admission.id))
                  : undefined
              }
              onDecline={
                activeTab === "pending"
                  ? () => handleDecline(String(item.admission.id))
                  : undefined
              }
              ApproveButtonTitle="Allocate Room"
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}