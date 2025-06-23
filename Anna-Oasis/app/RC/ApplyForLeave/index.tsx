import RcLeaveForm from "@/components/RcLeaveForm";
import useUserStore from "@/stores/userStore";
import { act, useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import RcLeaveHistory from "@/components/RcLeaveHistory";
import { Button } from "@/components/ui/button";
import { completeRCLeave } from "@/utils/rc/rcApi";
export default function ApplyForLeavePage() {
  const [activeTab, setActiveTab] = useState<"form" | "history" | "Close Leave">("form");
  const [leaveHistory, setLeaveHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const user = useUserStore((state) => state.user);
  const handleTabChange = (tab: "form" | "history" | "Close Leave") => {
    setActiveTab(tab);
    if (tab === "history") {
      // fetchHistory();
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Tabs */}
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
        <TouchableOpacity
          className={`flex-1 py-3 items-center border-b-2 ${activeTab === "Close Leave" ? "border-blue-600" : "border-gray-200"}`}
          onPress={() => handleTabChange("Close Leave")}
        >
          <Text className={`text-lg font-semibold ${activeTab === "Close Leave" ? "text-blue-600" : "text-gray-500"}`}>Relive the Alter RC</Text>
        </TouchableOpacity>
      </View>
      {activeTab === "form" && (
        <View style={{ flex: 1 }}>
          <RcLeaveForm />
        </View>
      )}
      {activeTab === "history" && (
        <View style={{ flex: 1}}>
         <RcLeaveHistory />
        </View>
      )}
      {activeTab === "Close Leave" && (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Button 
          onPress={async () => {
            const result = await completeRCLeave();
            if (result.success) {
              Alert.alert("Success", "Great! Relived the Alternate RC from the Your attendance Duty");
            }
            else {
              Alert.alert("Error", "Failed to close leave");
            }
          }}
          size="xl"
          >
            <Text className="text-white text-lg font-semibold">Close Leave</Text>
          </Button>
        </View>
      )}
    </View>
  );
}