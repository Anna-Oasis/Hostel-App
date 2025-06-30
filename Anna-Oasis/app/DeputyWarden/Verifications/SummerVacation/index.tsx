import ApprovalCard from "@/components/ApprovalCard";
import {
  getStudentVacationsByDw,
  updateVacationStatusByDw,
  VacationForm,
} from "@/utils/deputyWarden/dwSummerVacationApi";
import { getSummerVacationBadgeStatus } from "@/utils/getBadgeStatus";
import { useEffect, useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import EmptyPage from "@/components/EmptyPage";
import DeclineComment from "@/components/modals/DeclineComment";
import ModalCallable from "@/components/modals/ModalCallable";

export default function SummerVacationVericationPage() {
  const [leaves, setLeaves] = useState<VacationForm[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [currentRejectId, setCurrentRejectId] = useState<number | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successModalContent, setSuccessModalContent] = useState<{
    title: string;
    message: string;
  }>({ title: "", message: "" });

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const result = await getStudentVacationsByDw();
      if (result.success) {
        setLeaves(result.data);
      } else {
        console.error(result.message || "Failed to fetch leaves");
      }
    } catch (err: any) {
      console.error("Error fetching leaves:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (leaveId: number) => {
    try {
      const result = await updateVacationStatusByDw(leaveId, true);

      if (result.success) {
        setLeaves((prev) =>
          prev.map((leave) =>
            leave.id === leaveId ? { ...leave, status: "2" } : leave
          )
        );
        setSuccessModalContent({
          title: "Success",
          message: "Vacation request approved successfully",
        });
        setShowSuccessModal(true);
      } else {
        Alert.alert(
          "Error",
          result.message || "Failed to approve vacation request"
        );
      }
    } catch (err: any) {
      console.error("Error approving leave:", err);
      Alert.alert(
        "Error",
        err.message || "An error occurred while approving the request"
      );
    }
  };

  const handleRejectClick = (leaveId: number) => {
    setCurrentRejectId(leaveId);
    setShowRejectModal(true);
  };

  const handleRejectConfirm = async (comment: string) => {
    if (!currentRejectId) return;

    if (!comment.trim()) {
      Alert.alert("Error", "Please provide a reason for rejection");
      return;
    }

    try {
      const result = await updateVacationStatusByDw(
        currentRejectId,
        false,
        comment
      );

      if (result.success) {
        setLeaves((prev) =>
          prev.map((leave) =>
            leave.id === currentRejectId ? { ...leave, status: "-1" } : leave
          )
        );
        setSuccessModalContent({
          title: "Success",
          message: "Vacation request rejected",
        });
        setShowSuccessModal(true);
        setShowRejectModal(false);
        setCurrentRejectId(null);
      } else {
        Alert.alert(
          "Error",
          result.message || "Failed to reject vacation request"
        );
      }
    } catch (err: any) {
      console.error("Error rejecting leave:", err);
      Alert.alert(
        "Error",
        err.message || "An error occurred while rejecting the request"
      );
    }
  };

  const handleRejectCancel = () => {
    setShowRejectModal(false);
    setCurrentRejectId(null);
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-base text-gray-600">
          Loading vacation requests...
        </Text>
      </View>
    );
  }

  if (leaves.length === 0) {
    return (
      <EmptyPage
        title="No vacation requests found"
        description="There are currently no summer vacation requests to verify."
      />
    );
  }

  return (
    <>
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        {leaves.map((leave) => (
          <ApprovalCard
            key={leave.id}
            title={`ROLL.NO : (${leave.roll_number})`}
            subTitle={`Vacation from: ${leave.vacation_from}`}
            data={{
              ID: leave.id,
              "Roll Number": leave.roll_number,
              "Vacation From": leave.vacation_from,
              "Address of Stay": leave.address_of_stay,
              "Returned Items": leave.returned_items.join(", "),
              Status: leave.status,
              "Created At": new Date(leave.created_at).toLocaleDateString(),
            }}
            badge={getSummerVacationBadgeStatus(leave.status)}
            onApprove={() => handleApprove(leave.id)}
            onDecline={() => handleRejectClick(leave.id)}
          />
        ))}
      </ScrollView>

      <DeclineComment
        visible={showRejectModal}
        onClose={handleRejectCancel}
        onSubmit={handleRejectConfirm}
        title="Reason for Rejection"
        placeholder="Enter rejection reason..."
        submitLabel="Reject"
        cancelLabel="Cancel"
      />

      <ModalCallable
        show={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={successModalContent.title}
        message={successModalContent.message}
      />
    </>
  );
}
