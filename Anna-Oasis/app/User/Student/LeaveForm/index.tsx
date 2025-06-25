import { useState } from "react";
import { View, ScrollView, Alert } from "react-native";
import LeaveForm from "@/components/student/LeaveForm";
import ModalCallable from "@/components/modals/ModalCallable";
import {
  submitLeaveForm,
  fetchLeaveForms,
} from "@/utils/student/studentLeaveApi";
import useUserStore from "@/stores/userStore";
import ApprovalCard, { badgeStatus } from "@/components/ApprovalCard";
import TabSwitch from "@/components/TabSwitch";
import { FilePlus2, History } from "lucide-react-native";
import useLoadingStore from "@/stores/loadingStore";
import EmptyPage from "@/components/EmptyPage";

function LeaveFormPage() {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"form" | "history">("form");
  const [leaveHistory, setLeaveHistory] = useState<any[]>([]);
  const roll_number = useUserStore((state) => state.details.rollNo);
  const setLoading = useLoadingStore((state) => state.setLoading);

  const fetchHistory = async () => {
    if (!roll_number) return;
    setLoading(true);
    try {
      const data = await fetchLeaveForms(roll_number);
      console.log("Fetched Leave History:", data);
      setLeaveHistory(data);
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", err.message || "Failed to fetch leave history.");
      setLeaveHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: "form" | "history") => {
    setActiveTab(tab);
    if (tab === "history") {
      fetchHistory();
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      if (!roll_number) throw new Error("User roll number not found.");
      const payload = {
        roll_number,
        leave_type: values.leave_type,
        from_date: values.from_date,
        to_date: values.to_date,
        reason: values.reason,
        address_of_stay:
          values.destination || values.address_of_stay || values.address,
        emergency_contact: values.emergency_contact,
      };
      await submitLeaveForm(payload);
      setShowModal(true);
    } catch (err: any) {
      alert(err.message || "Failed to submit leave form.");
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    handleTabChange("history");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <TabSwitch
        tabs={[
          { label: "Leave Form", value: "form" },
          { label: "History", value: "history" },
        ]}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        className="mt-4 mb-2"
        icons={{
          form: FilePlus2,
          history: History,
        }}
      />

      {activeTab === "form" && (
        <View style={{ flex: 1 }}>
          <LeaveForm onSubmit={handleSubmit} />
          <ModalCallable
            show={showModal}
            onClose={handleModalClose}
            title="Leave Application Submitted"
            message="Your leave application has been successfully submitted. We will review it and get back to you shortly."
          />
        </View>
      )}

      {activeTab === "history" && (
        <ScrollView className="flex-1 px-4 py-2">
          {leaveHistory.length === 0 ? (
            <EmptyPage
              title="No leave forms found."
              description="You have not submitted any leave applications yet."
            />
          ) : (
            leaveHistory.map((leave) => (
              <ApprovalCard
                key={leave._id || leave.id}
                title={`${leave.leave_type} Leave`}
                subTitle={`${leave.from_date} to ${leave.to_date}`}
                badge={
                  leave.status === "3"
                    ? badgeStatus.Approved
                    : leave.status === "-1"
                    ? badgeStatus.Rejected
                    : badgeStatus.Pending
                }
                data={{
                  "Leave Type": leave.leave_type,
                  From: leave.from_date,
                  To: leave.to_date,
                  Reason: leave.reason,
                  "Address of Stay": leave.address_of_stay,
                  "Emergency Contact": leave.emergency_contact,
                  Status:
                    leave.status === "3"
                      ? "Approved"
                      : leave.status === "-1"
                      ? "Rejected"
                      : "Pending",
                }}
              />
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

export default LeaveFormPage;
