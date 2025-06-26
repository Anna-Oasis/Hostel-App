import ApprovalCard from "@/components/ApprovalCard";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
} from "react-native";
import {
  getRCLeavebyDw,
  updateRCLeaveStatusByDw,
} from "@/utils/deputyWarden/dwRCLeaveApi";
import { getRCLeaveBadgeStatus } from "@/utils/getBadgeStatus";
import ModalCallable from "@/components/modals/ModalCallable";
import DeclineComment from "@/components/modals/DeclineComment";
import EmptyPage from "@/components/EmptyPage";

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
  const [modal, setModal] = useState<{ show: boolean; title?: string; message?: string }>({ show: false });
  const [declineModal, setDeclineModal] = useState<{ show: boolean; leaveId?: number }>({ show: false });

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
        setModal({
          show: true,
          title: "Approved",
          message: "RC Leave approved successfully.",
        });
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

  // Show DeclineComment modal, then call API with comment
  const handleDecline = (leaveId: number) => {
    setDeclineModal({ show: true, leaveId });
  };

  const handleReject = async (leaveId: number, comment: string) => {
    setUpdatingIds((prev) => new Set(prev).add(leaveId));
    try {
      const result = await updateRCLeaveStatusByDw(leaveId, "false", comment);
      if (result.success) {
        setLeaves((prev) =>
          prev.map((leave) =>
            leave.id === leaveId ? { ...leave, approved: "-1" } : leave
          )
        );
        setModal({
          show: true,
          title: "Rejected",
          message: "RC Leave has been rejected.",
        });
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

  return (
    <>
      <ModalCallable
        show={modal.show}
        onClose={() => setModal({ show: false })}
        title={modal.title}
        message={modal.message}
      />
      <DeclineComment
        visible={declineModal.show}
        onClose={() => setDeclineModal({ show: false })}
        onSubmit={(comment) => {
          if (declineModal.leaveId) {
            setDeclineModal({ show: false });
            handleReject(declineModal.leaveId, comment);
          }
        }}
        title="Reject RC Leave"
        placeholder="Enter reason for rejection..."
        submitLabel="Reject"
        cancelLabel="Cancel"
      />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {leaves.length === 0 ? (
          <EmptyPage
            title="No RC Leave requests found."
            description="There are currently no RC Leave requests to review."
          />
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
                "Status": getRCLeaveBadgeStatus(leave.approved),
              }}
              badge={getRCLeaveBadgeStatus(leave.approved)}
              onApprove={() => handleApprove(leave.id)}
              onDecline={() => handleDecline(leave.id)}
            />
          ))
        )}
      </ScrollView>
    </>
  );
}

