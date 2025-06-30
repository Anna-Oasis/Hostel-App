import { View, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { getAllRCAdmissions } from "@/utils/rc/rcAdmissionApi";
import ApprovalCard from "@/components/ApprovalCard";
import { getAdmissionBadgeStatus } from "@/utils/getBadgeStatus";
import { router } from "expo-router";
import { allocateRoomAdmission } from "@/utils/rc/rcAdmissionApi";
import EmptyPage from "@/components/EmptyPage";

export default function RoomAllocationPage() {
  const [admissions, setAdmissions] = useState<any[]>([]);

  const fetchAdmissions = async () => {
    try {
      const data = await getAllRCAdmissions();
      setAdmissions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Error fetching RC admissions:", err);
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const handleApprove = (admissionId: string) => {
    router.push(`/RC/RoomAllocation/Approve/${admissionId}` as any)
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
    fetchAdmissions();
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {admissions.length === 0 ? (
          <EmptyPage
            title="No pending room allocations"
            description="All admissions have been reviewed."
          />
        ) : (
          admissions.map((item: any, idx: number) => (
            <ApprovalCard
              key={item.admission.id || idx}
              title={item.student.name}
              subTitle={`Roll: ${item.admission.roll_number}, Block: ${item.admission.hostelBlock}, Year: ${item.admission.academicYear}`}
              badge={getAdmissionBadgeStatus(item.admission.status)}
              data={{
                ...item.admission,
                ...item.student,
              }}
              onApprove={() => handleApprove(String(item.admission.id))}
              onDecline={() => handleDecline(String(item.admission.id))}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}