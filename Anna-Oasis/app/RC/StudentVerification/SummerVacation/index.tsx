import ApprovalCard, { badgeStatus } from "@/components/ApprovalCard";
import { getStudentVacations, updateVacationStatus, VacationForm } from "@/utils/rc/rcApi";
import { useEffect, useState } from "react";
import { View, Text, ScrollView, Alert, Modal, TextInput, TouchableOpacity } from "react-native";

export default function SummerVacationPage() {
  const [leaves, setLeaves] = useState<VacationForm[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingIds, setUpdatingIds] = useState<Set<number>>(new Set());

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectComment, setRejectComment] = useState("");
  const [currentRejectId, setCurrentRejectId] = useState<number | null>(null);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getStudentVacations();
      if (result.success) {
        setLeaves(result.data);
      } else {
        setError(result.message || "Failed to fetch leaves");
      }
    } catch (err: any) {
      console.error("Error fetching leaves:", err);
      setError(err.message || "An error occurred while fetching leaves");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (leaveId: number) => {
    try {
      setUpdatingIds(prev => new Set([...prev, leaveId]));

      const result = await updateVacationStatus(leaveId, true);

      if (result.success) {
        setLeaves(prev =>
          prev.map(leave =>
            leave.id === leaveId
              ? { ...leave, status: "2" } 
              : leave
          )
        );
        Alert.alert("Success", "Vacation request approved successfully");
      } else {
        Alert.alert("Error", result.message || "Failed to approve vacation request");
      }
    } catch (err: any) {
      console.error("Error approving leave:", err);
      Alert.alert("Error", err.message || "An error occurred while approving the request");
    } finally {
      setUpdatingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(leaveId);
        return newSet;
      });
    }
  };

  const handleRejectClick = (leaveId: number) => {
    setCurrentRejectId(leaveId);
    setRejectComment("");
    setShowRejectModal(true);
  };

  const handleRejectConfirm = async () => {
    if (!currentRejectId) return;

    if (!rejectComment.trim()) {
      Alert.alert("Error", "Please provide a reason for rejection");
      return;
    }

    try {
      setUpdatingIds(prev => new Set([...prev, currentRejectId]));

      const result = await updateVacationStatus(currentRejectId, false, rejectComment);

      if (result.success) {
        setLeaves(prev =>
          prev.map(leave =>
            leave.id === currentRejectId
              ? { ...leave, status: "-1" } 
              : leave
          )
        );
        Alert.alert("Success", "Vacation request rejected");
        setShowRejectModal(false);
        setCurrentRejectId(null);
        setRejectComment("");
      } else {
        Alert.alert("Error", result.message || "Failed to reject vacation request");
      }
    } catch (err: any) {
      console.error("Error rejecting leave:", err);
      Alert.alert("Error", err.message || "An error occurred while rejecting the request");
    } finally {
      setUpdatingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(currentRejectId);
        return newSet;
      });
    }
  };

  const handleRejectCancel = () => {
    setShowRejectModal(false);
    setCurrentRejectId(null);
    setRejectComment("");
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-base text-gray-600">Loading vacation requests...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-5">
        <Text className="text-red-500 text-center mb-2.5">
          {error}
        </Text>
        <TouchableOpacity onPress={fetchLeaves}>
          <Text className="text-blue-500 underline">
            Tap to retry
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (leaves.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-base text-gray-600">No vacation requests found</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        {leaves.map((leave) => (
          <ApprovalCard
            key={leave.id}
            title={`${leave.student_name} (${leave.roll_number})`}
            subTitle={`Vacation from: ${leave.vacation_from}`}
            data={{
              "ID": leave.id,
              "Roll Number": leave.roll_number,
              "Student Name": leave.student_name,
              "Floor": leave.floor,
              "Block": leave.block,
              "Room Number": leave.room_number,
              "Vacation From": leave.vacation_from,
              "Address of Stay": leave.address_of_stay,
              "Returned Items": leave.returned_items.join(", "),
              "Status": leave.status,
              "Created At": new Date(leave.created_at).toLocaleDateString(),
            }}
            badge={
              leave.status === '2' ? badgeStatus.Approved :
                leave.status === '1' ? badgeStatus.Approved :
                  leave.status === '-1' ? badgeStatus.Rejected :
                    badgeStatus.Pending
            }

            onApprove={() => handleApprove(leave.id)}
            onDecline={() => handleRejectClick(leave.id)}
          />
        ))}
      </ScrollView>

      <Modal
        visible={showRejectModal}
        transparent={true}
        animationType="slide"
        onRequestClose={handleRejectCancel}
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-5">
          <View className="bg-white rounded-2xl p-5 w-full max-w-sm">
            <Text className="text-lg font-bold mb-2.5 text-center text-gray-900">
              Reason for Rejection
            </Text>
            <Text className="text-sm text-gray-600 mb-4 text-center">
              Please provide a reason for rejecting this vacation request:
            </Text>

            <TextInput
              className="border border-gray-300 rounded-lg p-3 min-h-[100px] mb-5 text-base"
              value={rejectComment}
              onChangeText={setRejectComment}
              placeholder="Enter rejection reason..."
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor="#9CA3AF"
            />

            <View className="flex-row justify-between gap-2.5">
              <TouchableOpacity
                className="flex-1 py-3 rounded-lg items-center bg-gray-100 border border-gray-300"
                onPress={handleRejectCancel}
              >
                <Text className="text-gray-700 font-semibold">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 py-3 rounded-lg items-center bg-red-500"
                onPress={handleRejectConfirm}
              >
                <Text className="text-white font-semibold">Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}