import { useEffect, useState } from "react";
import { View, ScrollView, Alert } from "react-native";
import ApprovalCard, { badgeStatus } from "@/components/ApprovalCard";
import { fetchRCLeaveForms, updateRCLeaveFormStatus } from "@/utils/rc/RCLeaveFormApprovalApi";
import DeclineComment from "@/components/modals/DeclineComment";
import ModalCallable from "@/components/modals/ModalCallable";
import { getLeaveBadgeStatus } from "@/utils/getBadgeStatus";
import EmptyPage from "@/components/EmptyPage";
import useLoadingStore from "@/stores/loadingStore";
import TabSwitch from "@/components/TabSwitch";

export default function LeaveFormPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "approved">("pending");
  const [leaveForms, setLeaveForms] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [selectedLeaveId, setSelectedLeaveId] = useState<number | null>(null);

  const setLoading = useLoadingStore((state) => state.setLoading);

  const getLeaveForms = async (tab: "pending" | "approved" = activeTab) => {
    setLoading(true);
    try {
      const data = await fetchRCLeaveForms(tab);
      setLeaveForms(data);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to fetch leave forms");
      setLeaveForms([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    getLeaveForms(activeTab);
  }, [activeTab]);

  const handleDecision = async (leaveFormId: number, approve: boolean, comment?: string) => {
    setLoading(true);
    try {
      await updateRCLeaveFormStatus(leaveFormId, approve, comment);
      setModalMsg(approve ? "Leave form approved successfully!" : "Leave form rejected successfully!");
      setModalVisible(true);
      await getLeaveForms(activeTab);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to update leave form status");
    }
    setLoading(false);
  };

  const handleDecline = (leaveFormId: number) => {
    setSelectedLeaveId(leaveFormId);
    setRejectModalVisible(true);
  };

  const submitRejection = (reason: string) => {
    if (!reason.trim()) {
      Alert.alert("Error", "Please provide a reason for rejection.");
      return;
    }
    handleDecision(
      selectedLeaveId!,
      false,
      `${reason.trim()} (Rejected by RC)`
    );
    setRejectModalVisible(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 12 }}>
      <ModalCallable
        show={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Success"
        message={modalMsg}
      />
      <DeclineComment
        visible={rejectModalVisible}
        onClose={() => setRejectModalVisible(false)}
        onSubmit={submitRejection}
        title="Reason for Rejection"
        placeholder="Enter reason for rejection"
        submitLabel="Submit"
        cancelLabel="Cancel"
      />
      <TabSwitch
        tabs={[
          { label: "Pending", value: "pending" },
          { label: "Approved", value: "approved" },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      {leaveForms.length === 0 ? (
        <EmptyPage
          title={
            activeTab === "approved"
              ? "No approved leave forms"
              : "No leave forms"
          }
          description={
            activeTab === "approved"
              ? "There are currently no leave forms you have approved."
              : "There are currently no leave forms pending approval."
          }
        />
      ) : (
        <ScrollView>
          {leaveForms.map((item) => {
            const leave = item.leave_form;
            const student = item.student;
            return (
              <ApprovalCard
                key={leave.id}
                title={`${student.name} (${leave.roll_number})`}
                subTitle={`${leave.leave_type} | ${leave.from_date} to ${leave.to_date}`}
                badge={
                  activeTab === "approved"
                    ? badgeStatus.Approved
                    : getLeaveBadgeStatus(leave.status)
                }
                data={{
                  "Student Name": student.name,
                  "Roll Number": leave.roll_number,
                  "Course": student.course,
                  "Branch": student.branch,
                  "Semester": student.semester,
                  "Room Number": student.roomNumber,
                  "Leave Type": leave.leave_type,
                  "From": leave.from_date,
                  "To": leave.to_date,
                  "Reason": leave.reason,
                  "Address of Stay": leave.address_of_stay,
                  "Emergency Contact": leave.mobile,
                  "Email": leave.email,
                  "Status": activeTab === "approved" ? "Approved" : "Pending"
                }}
                onApprove={
                  activeTab === "pending"
                    ? () => handleDecision(leave.id, true)
                    : undefined
                }
                onDecline={
                  activeTab === "pending"
                    ? () => handleDecline(leave.id)
                    : undefined
                }
              />
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}