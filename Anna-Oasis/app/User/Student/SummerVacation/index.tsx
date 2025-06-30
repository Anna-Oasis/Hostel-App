import SummerVacationForm from "@/components/student/SummerVacationForm";
import SummerVacationHistory from "@/components/student/SummerVacationHistory";
import { useState } from "react";
import { View } from "react-native";
import TabSwitch from "@/components/TabSwitch";
import { FilePlus2, History } from "lucide-react-native";

export default function SummerVacationPage() {
  const [activeTab, setActiveTab] = useState<"form" | "history">("form");

  const handleTabChange = (tab: "form" | "history") => {
    setActiveTab(tab);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <TabSwitch
        tabs={[
          { label: "Vacation Form", value: "form" },
          { label: "Submitted Requests", value: "history" },
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
