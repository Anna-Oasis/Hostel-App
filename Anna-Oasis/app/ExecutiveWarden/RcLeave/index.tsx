import ApprovalCard, { badgeStatus } from "@/components/ApprovalCard";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import {
  getRCLeavebyEw,
  updateRCLeaveStatusByEw,
} from "@/utils/executiveWarden/ewApi";

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

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getRCLeavebyEw();
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
      const result = await updateRCLeaveStatusByEw(leaveId, "true");
      if (result.success) {
        setLeaves((prev) =>
          prev.map((leave) =>
            leave.id === leaveId ? { ...leave, approved: "2" } : leave
          )
        );
        Alert.alert("Approved", "RC Leave approved successfully.");
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

  const handleReject = async (leaveId: number) => {
    setUpdatingIds((prev) => new Set(prev).add(leaveId));
    try {
      const result = await updateRCLeaveStatusByEw(leaveId, "false", "");
      if (result.success) {
        setLeaves((prev) =>
          prev.map((leave) =>
            leave.id === leaveId ? { ...leave, approved: "-1" } : leave
          )
        );
        Alert.alert("Rejected", "RC Leave has been rejected.");
      } else {
        Alert.alert("Error", result.message || "Rejection failed.");
      }
    } catch (err: any) {
      Alert.alert("Error", err?.message || "Error rejecting leave.");
    } finally {
      setUpdatingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(leaveId);
        return newSet;
      });
    }
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
              "Reason": leave.reason,
              "Leaving": leave.leaving,
              "Arrival": leave.arrival,
              "Created At": new Date(leave.created_at).toLocaleString(),
              "Status": leave.approved === '1'
                ? badgeStatus.Pending
                : leave.approved === '-1'
                  ? badgeStatus.Rejected
                  : leave.approved === '2'
                    ? badgeStatus.Approved
                    : badgeStatus.Pending,
            }}
            badge={
              leave.approved === "2"
                ? badgeStatus.Approved
                : leave.approved === "-1"
                  ? badgeStatus.Rejected
                  : badgeStatus.Pending
            }
            onApprove={() => handleApprove(leave.id)}
            onDecline={() => handleReject(leave.id)}
          />
        ))
      )}
    </ScrollView>
  );
}
