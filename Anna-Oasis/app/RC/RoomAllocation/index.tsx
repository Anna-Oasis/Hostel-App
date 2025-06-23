import { View, ScrollView } from "react-native";
import { Text } from "@/components/ui/text";
import { useEffect, useState } from "react";
import { getAllRCAdmissions } from "@/utils/rc/rcAdmissionApi";
import ApprovalCard from "@/components/ApprovalCard";
import { getAdmissionBadgeStatus } from "@/utils/getBadgeStatus";
import { Icon } from "@/components/ui/icon";
import { Inbox } from "lucide-react-native";

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

  const handleApprove = () => {
    console.log("Approved");
  };
  const handleDecline = () => {
    console.log("Declined");
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {admissions.length === 0 ? (
          <View className="flex-1 justify-center items-center mt-16">
            <Icon as={Inbox} size="xl" color="#a3a3a3" className="mb-4" />
            <Text size="lg" className="text-typography-400 font-semibold mb-2">
              No pending room allocations
            </Text>
            <Text size="sm" className="text-typography-300 text-center">
              All admissions have been reviewed.
            </Text>
          </View>
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
              onApprove={handleApprove}
              onDecline={handleDecline}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}