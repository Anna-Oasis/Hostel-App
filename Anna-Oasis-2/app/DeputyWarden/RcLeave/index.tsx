import ApprovalCard from "@/components/ApprovalCard";
import { useEffect, useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import {
  getRCLeavebyDw,
  updateRCLeaveStatusByDw,
} from "@/utils/deputyWarden/dwRCLeaveApi";
import { getRCLeaveBadgeStatus } from "@/utils/getBadgeStatus";
import ModalCallable from "@/components/modals/ModalCallable";
import DeclineComment from "@/components/modals/DeclineComment";
import EmptyPage from "@/components/EmptyPage";

export default function RcLeavePage() {
  type RcLeaveApiItem = {
    leave: {
      id: number;
      rc_id: number;
      leaving: string;
      arrival: string;
      reason: string;
      approved: string;
      created_at: string;
      dw_approved_at?: string;
      ew_updated_at?: string;
    };
    rc: {
      id: number;
      userId: number;
      name: string;
      hostel: string;
      onLeave: boolean;
      floor: number[];
      alternatingToRCId: number | null;
      createdAt: string;
      updatedAt: string;
    };
  };

  const [leaves, setLeaves] = useState<RcLeaveApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{
    show: boolean;
    title?: string;
    message?: string;
  }>({ show: false });
  const [declineModal, setDeclineModal] = useState<{
    show: boolean;
    leaveId?: number;
  }>({ show: false });

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const result = await getRCLeavebyDw();
      if (result.success && Array.isArray(result.data)) {
        setLeaves(result.data);
      }
    } catch (err: any) {
      Alert.alert(err?.message || "Error fetching RC leaves");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (leaveId: number) => {
    try {
      const result = await updateRCLeaveStatusByDw(leaveId, "true");
      if (result.success) {
        await fetchLeaves();
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
    }
  };
  const handleDecline = (leaveId: number) => {
    setDeclineModal({ show: true, leaveId });
  };

  const handleReject = async (leaveId: number, comment: string) => {
    try {
      const result = await updateRCLeaveStatusByDw(leaveId, "false", comment);
      if (result.success) {
        setLeaves((prev) =>
          prev.map((leave) =>
            leave.leave.id === leaveId ? { ...leave, approved: "-1" } : leave
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
          leaves.map((item) => (
            <ApprovalCard
              key={item.leave.id}
              title={`${item.rc.name} (${item.rc.hostel})`}
              subTitle={`Leave: ${item.leave.leaving} → ${item.leave.arrival}`}
              data={{
                "RC Name": item.rc.name,
                Hostel: item.rc.hostel,
                Floors: Array.isArray(item.rc.floor)
                  ? item.rc.floor
                      .map((f) => ["GF", "FF", "SF", "TF"][f] ?? f)
                      .join(", ")
                  : "",
                Reason: item.leave.reason,
                Leaving: item.leave.leaving,
                Arrival: item.leave.arrival,
                "Created At": new Date(item.leave.created_at).toLocaleString(),
                Status:
                  item.leave.approved === "1"
                    ? "Pending"
                    : item.leave.approved === "-1"
                    ? "Rejected"
                    : item.leave.approved === "2"
                    ? "Approved"
                    : "Pending",
              }}
              badge={getRCLeaveBadgeStatus(item.leave.approved)}
              onApprove={() => handleApprove(item.leave.id)}
              onDecline={() => handleDecline(item.leave.id)}
            />
          ))
        )}
      </ScrollView>
    </>
  );
}
