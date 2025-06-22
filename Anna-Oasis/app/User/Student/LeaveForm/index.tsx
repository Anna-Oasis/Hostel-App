import React, { useState } from "react";
import { View, TouchableOpacity, ScrollView, Alert } from "react-native";
import LeaveForm from "@/components/LeaveForm";
import ModalCallable from "@/components/ModalCallable";
import { submitLeaveForm, fetchLeaveForms } from "@/utils/leaveForm/LeaveFormApi";
import  useUserStore  from "@/stores/userStore";
import ApprovalCard, { badgeStatus } from "@/components/ApprovalCard";
import { Text } from "@/components/ui/text";

function LeaveFormPage() {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"form" | "history">("form");
  const [leaveHistory, setLeaveHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const roll_number = useUserStore((state) => state.details.rollNo);
  console.log("Roll Number:", roll_number);
  // Fetch leave history when needed
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

  // Tab change handler
  const handleTabChange = (tab: "form" | "history") => {
    setActiveTab(tab);
    if (tab === "history") {
      fetchHistory();
    }
  };

  // Submit leave form
  const handleSubmit = async (values: any) => {
    try {
      if (!roll_number) throw new Error("User roll number not found.");
      const payload = {
        roll_number,
        leave_type: values.leave_type,
        from_date: values.from_date,
        to_date: values.to_date,
        reason: values.reason,
        address_of_stay: values.destination || values.address_of_stay || values.address,
        emergency_contact: values.emergency_contact,
      };
      await submitLeaveForm(payload);
      setShowModal(true);
    } catch (err: any) {
      alert(err.message || "Failed to submit leave form.");
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    handleTabChange("history");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View className="flex-row justify-around mt-4 mb-2">
        <TouchableOpacity
          className={`flex-1 py-3 items-center border-b-2 ${activeTab === "form" ? "border-blue-600" : "border-gray-200"}`}
          onPress={() => handleTabChange("form")}
        >
          <Text className={`text-lg font-semibold ${activeTab === "form" ? "text-blue-600" : "text-gray-500"}`}>Leave Form</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-3 items-center border-b-2 ${activeTab === "history" ? "border-blue-600" : "border-gray-200"}`}
          onPress={() => handleTabChange("history")}
        >
          <Text className={`text-lg font-semibold ${activeTab === "history" ? "text-blue-600" : "text-gray-500"}`}>History</Text>
        </TouchableOpacity>
      </View>

      {/* Leave Form Tab */}
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

      {/* History Tab */}
      {activeTab === "history" && (
        <ScrollView className="flex-1 px-4 py-2">
          {loading ? (
            <Text className="text-center mt-8 text-gray-500">Loading...</Text>
          ) : leaveHistory.length === 0 ? (
            <Text className="text-center mt-8 text-gray-500">No leave forms found.</Text>
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
                  "From": leave.from_date,
                  "To": leave.to_date,
                  "Reason": leave.reason,
                  "Address of Stay": leave.address_of_stay,
                  "Emergency Contact": leave.emergency_contact,
                  "Status": leave.status === "3"
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