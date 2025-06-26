import ApprovalCard from "@/components/ApprovalCard";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
} from "react-native";
import {
  getRCLeavebyEw,
  updateRCLeaveStatusByEw,
} from "@/utils/executiveWarden/ewRCLeaveApi";
import { getRCLeaveBadgeStatus } from "@/utils/getBadgeStatus";
import EmptyPage from "@/components/EmptyPage";
import { Inbox } from "lucide-react-native";
import DeclineComment from "@/components/modals/DeclineComment";
import ModalCallable from "@/components/modals/ModalCallable";

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
  const [declineModal, setDeclineModal] = useState<{ open: boolean; leaveId?: number }>({ open: false });
  const [successModal, setSuccessModal] = useState<{ show: boolean; title?: string; message?: string }>({ show: false });

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const result = await getRCLeavebyEw();
      if (result.success && Array.isArray(result.data)) {
        setLeaves(result.data);
      }
    } catch (err: any) {
      console.error("Error fetching RC leaves:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (leaveId: number) => {
    try {
      const result = await updateRCLeaveStatusByEw(leaveId, "true");
      if (result.success) {
        setLeaves((prev) =>
          prev.map((leave) =>
            leave.id === leaveId ? { ...leave, approved: "2" } : leave
          )
        );
        setSuccessModal({ show: true, title: "Approved", message: "RC Leave approved successfully." });
      } else {
        Alert.alert("Error", result.message || "Approval failed.");
      }
    } catch (err: any) {
      Alert.alert("Error", err?.message || "Error approving leave.");
    } 
  };

  // Open modal to get comment for rejection
  const handleDecline = (leaveId: number) => {
    setDeclineModal({ open: true, leaveId });
  };

  // Called when comment is submitted from modal
  const handleDeclineSubmit = async (comment: string) => {
    if (declineModal.leaveId) {
      try {
        const result = await updateRCLeaveStatusByEw(declineModal.leaveId, "false", comment);
        if (result.success) {
          setLeaves((prev) =>
            prev.map((leave) =>
              leave.id === declineModal.leaveId ? { ...leave, approved: "-1" } : leave
            )
          );
          setSuccessModal({ show: true, title: "Rejected", message: "RC Leave has been rejected." });
        } else {
          Alert.alert("Error", result.message || "Rejection failed.");
        }
      } catch (err: any) {
        Alert.alert("Error", err?.message || "Error rejecting leave.");
      }
    }
    setDeclineModal({ open: false, leaveId: undefined });
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
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {leaves.length === 0 ? (
          <EmptyPage
            title="No RC Leave requests found."
            description=""
            icon={Inbox}
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
      <DeclineComment
        visible={declineModal.open}
        onClose={() => setDeclineModal({ open: false, leaveId: undefined })}
        onSubmit={handleDeclineSubmit}
        title="Decline RC Leave"
        placeholder="Enter reason for declining..."
        submitLabel="Decline"
        cancelLabel="Cancel"
      />
      <ModalCallable
        show={successModal.show}
        onClose={() => setSuccessModal({ show: false })}
        title={successModal.title}
        message={successModal.message}
      />
    </View>
  );
}
