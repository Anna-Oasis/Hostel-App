import ApprovalCard from "@/components/ApprovalCard";
import { getStudentVacations, updateVacationStatus, VacationForm } from "@/utils/rc/rcSummerVacationApi";
import { useEffect, useState } from "react";
import { ScrollView, Alert } from "react-native";
import DeclineComment from "@/components/modals/DeclineComment";
import EmptyPage from "@/components/EmptyPage";
import { getSummerVacationBadgeStatus } from "@/utils/getBadgeStatus";
import useLoadingStore from "@/stores/loadingStore";

export default function SummerVacationPage() {
  const [leaves, setLeaves] = useState<VacationForm[]>([]);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [currentRejectId, setCurrentRejectId] = useState<number | null>(null);

  const setLoading = useLoadingStore((state) => state.setLoading);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const result = await getStudentVacations();
      if (result.success) {
        setLeaves(result.data);
      } else {
        Alert.alert("Error", result.message || "Failed to fetch leaves");
        setLeaves([]);
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "An error occurred while fetching leaves");
      setLeaves([]);
    }
    setLoading(false);
  };

  const handleApprove = async (leaveId: number) => {
    setLoading(true);
    try {
      const result = await updateVacationStatus(leaveId, true);
      if (result.success) {
        fetchLeaves();
        Alert.alert("Success", "Vacation request approved successfully");
      } else {
        Alert.alert("Error", result.message || "Failed to approve vacation request");
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "An error occurred while approving the request");
    }
    setLoading(false);
  };

  const handleRejectClick = (leaveId: number) => {
    setCurrentRejectId(leaveId);
    setRejectModalVisible(true);
  };

  const handleRejectConfirm = async (reason: string) => {
    if (!currentRejectId) return;
    if (!reason.trim()) {
      Alert.alert("Error", "Please provide a reason for rejection");
      return;
    }
    setLoading(true);
    try {
      const result = await updateVacationStatus(currentRejectId, false, reason);
      if (result.success) {
        await fetchLeaves();
        Alert.alert("Success", "Vacation request rejected");
        setRejectModalVisible(false);
        setCurrentRejectId(null);
      } else {
        Alert.alert("Error", result.message || "Failed to reject vacation request");
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "An error occurred while rejecting the request");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  if (leaves.length === 0) {
    return (
      <EmptyPage
        title="No vacation requests"
        description="There are currently no summer vacation requests to review."
      />
    );
  }

  return (
    <>
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        {leaves.map((item) => {
          const vacation = item.summer_vacation;
          const student = item.student || {};
          return (
            <ApprovalCard
              key={vacation.id}
              title={`${student.name} (${vacation.roll_number})`}
              subTitle={`Vacation from: ${vacation.vacation_from}`}
              data={{
                "ID": vacation.id,
                "Roll Number": vacation.roll_number,
                "Student Name": student.name,
                "Floor": student.floor,
                "Block": student.hostelBlock,
                "Room Number": student.roomNumber,
                "Vacation From": vacation.vacation_from,
                "Address of Stay": vacation.address_of_stay,
                "Returned Items": Array.isArray(vacation.returned_items)
                  ? vacation.returned_items.join(", ")
                  : "",
                "Contact Email": vacation.email,
                "Contact Mobile": vacation.mobile,
                "Status": vacation.status,
                "Created At": vacation.created_at
                  ? new Date(vacation.created_at).toLocaleDateString()
                  : "",
              }}
              badge={getSummerVacationBadgeStatus(vacation.status)}
              onApprove={() => handleApprove(vacation.id)}
              onDecline={() => handleRejectClick(vacation.id)}
            />
          );
        })}
      </ScrollView>

      <DeclineComment
        visible={rejectModalVisible}
        onClose={() => {
          setRejectModalVisible(false);
          setCurrentRejectId(null);
        }}
        onSubmit={handleRejectConfirm}
        title="Reason for Rejection"
        placeholder="Enter rejection reason..."
        submitLabel="Reject"
        cancelLabel="Cancel"
      />
    </>
  );
}