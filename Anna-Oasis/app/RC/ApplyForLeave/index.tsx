import RcLeaveForm from "@/components/rc/RcLeaveForm";
import { useState } from "react";
import { View } from "react-native";
import RcLeaveHistory from "@/components/rc/RcLeaveHistory";
import { Button, ButtonText } from "@/components/ui/button";
import { completeRCLeave } from "@/utils/rc/rcLeaveApi";
import TabSwitch from "@/components/TabSwitch";
import { FilePlus2, History, UserCheck2 } from "lucide-react-native";
import ModalCallable from "@/components/modals/ModalCallable";

export default function ApplyForLeavePage() {
  const [activeTab, setActiveTab] = useState<"form" | "history" | "Close Leave">("form");
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [modalMsg, setModalMsg] = useState("");

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ModalCallable
        show={successModalVisible}
        onClose={() => setSuccessModalVisible(false)}
        title="Success"
        message={modalMsg}
      />
      <ModalCallable
        show={errorModalVisible}
        onClose={() => setErrorModalVisible(false)}
        title="Error"
        message={modalMsg}
      />
      <TabSwitch
        tabs={[
          { label: "Leave Form", value: "form" },
          { label: "History", value: "history" },
          { label: "Relive the Alter RC", value: "Close Leave" },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        icons={{
          form: FilePlus2,
          history: History,
          "Close Leave": UserCheck2,
        }}
        className="mt-4 mb-2"
      />
      {activeTab === "form" && (
        <View style={{ flex: 1 }}>
          <RcLeaveForm />
        </View>
      )}
      {activeTab === "history" && (
        <View style={{ flex: 1 }}>
          <RcLeaveHistory />
        </View>
      )}
      {activeTab === "Close Leave" && (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Button
            onPress={async () => {
              const result = await completeRCLeave();
              if (result.success) {
                setModalMsg("Great! Relived the Alternate RC from the Your attendance Duty");
                setSuccessModalVisible(true);
              } else {
                setModalMsg("Failed to close leave");
                setErrorModalVisible(true);
              }
            }}
            size="xl"
          >
            <ButtonText className="text-white text-lg font-semibold">Close Leave</ButtonText>
          </Button>
        </View>
      )}
    </View>
  );
}