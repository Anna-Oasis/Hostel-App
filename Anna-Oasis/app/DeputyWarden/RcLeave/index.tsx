import ApprovalCard, { badgeStatus } from "@/components/ApprovalCard";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { getRCLeavebyDw, updateRCLeaveStatusByDw } from "@/utils/deputyWarden/dwApi";

type RcLeave = {
  id: number;
  leaving: string;
  arrival: string;
  reason: string;
  created_at: string;
  approved: string;
};

export default function RcLeavePage() {
  const [leaves, setLeaves] = useState<RcLeave[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingIds, setUpdatingIds] = useState<Set<number>>(new Set());

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectComment, setRejectComment] = useState("");
  const [currentRejectId, setCurrentRejectId] = useState<number | null>(null);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getRCLeavebyDw();
      if (result.success && Array.isArray(result.data)) {
        setLeaves(result.data);
      } else {
        setError(result.message || "Failed to fetch RC leaves");
      }
    } catch (err: any) {
      setError(err?.message || "Error fetching RC leaves");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (leaveId: number) => {
    setUpdatingIds((prev) => new Set(prev).add(leaveId));
    try {
      const result = await updateRCLeaveStatusByDw(leaveId, "true");
      if (result.success) {
        setLeaves((prev) =>
          prev.map((leave) =>
            leave.id === leaveId ? { ...leave, approved: "2" } : leave
          )
        );
        Alert.alert("Success", "RC Leave approved successfully.");
      } else {
        Alert.alert("Error", result.message || "Approval failed.");
      }
    } catch (err: any) {
      Alert.alert("Error", err?.message || "Error approving leave.");
    } finally {
      setUpdatingIds((prev) => {
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
    if (currentRejectId === null || !rejectComment.trim()) {
      Alert.alert("Error", "Rejection reason is required.");
      return;
    }

    setUpdatingIds((prev) => new Set(prev).add(currentRejectId));
    try {
      const result = await updateRCLeaveStatusByDw(
        currentRejectId,
        "false",
        rejectComment
      );
      if (result.success) {
        setLeaves((prev) =>
          prev.map((leave) =>
            leave.id === currentRejectId
              ? { ...leave, approved: "-1" }
              : leave
          )
        );
        Alert.alert("Rejected", "RC Leave has been rejected.");
        setShowRejectModal(false);
        setCurrentRejectId(null);
        setRejectComment("");
      } else {
        Alert.alert("Error", result.message || "Rejection failed.");
      }
    } catch (err: any) {
      Alert.alert("Error", err?.message || "Error rejecting leave.");
    } finally {
      setUpdatingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(currentRejectId!);
        return newSet;
      });
    }
  };

  const handleRejectCancel = () => {
    setShowRejectModal(false);
    setRejectComment("");
    setCurrentRejectId(null);
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-600">Loading RC leave requests...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500 mb-2 text-center">{error}</Text>
        <TouchableOpacity onPress={fetchLeaves}>
          <Text className="text-blue-600 underline">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {leaves.length === 0 ? (
          <Text className="text-center text-gray-500">
            No RC Leave requests found.
          </Text>
        ) : (
          leaves.map((leave) => (
            <ApprovalCard
              key={leave.id}
              title={`RC Leave #${leave.id}`}
              subTitle={`From ${leave.leaving} to ${leave.arrival}`}
              data={{
                Reason: leave.reason,
                Created: new Date(leave.created_at).toLocaleString(),
              }}
              badge={
                leave.approved === "2"
                  ? badgeStatus.Approved
                  : leave.approved === "-1"
                  ? badgeStatus.Rejected
                  : badgeStatus.Pending
              }
              onApprove={() => handleApprove(leave.id)}
              onDecline={() => handleRejectClick(leave.id)}
            />
          ))
        )}
      </ScrollView>

      {/* Rejection Modal */}
      <Modal
        visible={showRejectModal}
        transparent
        animationType="slide"
        onRequestClose={handleRejectCancel}
      >
        <View className="flex-1 justify-center items-center bg-black/50 p-5">
          <View className="bg-white w-full max-w-sm rounded-2xl p-5">
            <Text className="text-lg font-bold mb-2 text-center">
              Reason for Rejection
            </Text>
            <TextInput
              value={rejectComment}
              onChangeText={setRejectComment}
              placeholder="Enter reason..."
              multiline
              numberOfLines={4}
              className="border border-gray-300 p-3 rounded-lg text-base text-black mb-4"
              placeholderTextColor="#999"
              textAlignVertical="top"
            />
            <View className="flex-row justify-between space-x-2">
              <TouchableOpacity
                onPress={handleRejectCancel}
                className="flex-1 bg-gray-300 py-3 rounded-lg items-center"
              >
                <Text className="text-black font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleRejectConfirm}
                className="flex-1 bg-red-500 py-3 rounded-lg items-center"
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
