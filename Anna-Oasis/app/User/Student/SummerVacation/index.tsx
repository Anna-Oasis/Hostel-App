import SummerVacationForm from "@/components/SummerVacationForm";
import SummerVacationHistory from "@/components/SummerVacationHistory";
import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function SummerVacationPage() {
  const [activeTab, setActiveTab] = useState<"form" | "history">("form");

  const handleTabChange = (tab: "form" | "history") => {
    setActiveTab(tab);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Tab Headers */}
      <View className="flex-row justify-around mt-4 mb-2">
        <TouchableOpacity
          className={`flex-1 py-3 items-center border-b-2 ${
            activeTab === "form" ? "border-blue-600" : "border-gray-200"
          }`}
          onPress={() => handleTabChange("form")}
        >
          <Text
            className={`text-lg font-semibold ${
              activeTab === "form" ? "text-blue-600" : "text-gray-500"
            }`}
          >
            Vacation Form
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-3 items-center border-b-2 ${
            activeTab === "history" ? "border-blue-600" : "border-gray-200"
          }`}
          onPress={() => handleTabChange("history")}
        >
          <Text
            className={`text-lg font-semibold ${
              activeTab === "history" ? "text-blue-600" : "text-gray-500"
            }`}
          >
            Submitted Requests
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === "form" && (
        <View className="flex-1">
          <SummerVacationForm />
        </View>
      )}

      {activeTab === "history" && (
        <View className="flex-1">
          <SummerVacationHistory />
        </View>
      )}
    </View>
  );
}
