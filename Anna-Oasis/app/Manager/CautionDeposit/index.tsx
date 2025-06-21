import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import ApprovalCard, { badgeStatus } from "@/components/ApprovalCard";
import RefundApprovalModal from "@/components/cautiondeposit/RefundApprovalModal";
import { dummyApplications } from "@/constants/refundApprovalModal";

export default function CautionDepositManager() {
  const [applications, setApplications] = useState(dummyApplications);
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<typeof dummyApplications[0] | null>(null);

  const handleApprove = (app: typeof dummyApplications[0]) => {
    setSelectedApp(app);
    setRefundModalOpen(true);
  };

  const handleRefundSubmit = (formData: FormData) => {
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    setApplications((prev) =>
      prev.map((app) =>
        app.id === formData.get("applicationId") ? { ...app, status: badgeStatus.Approved } : app
      )
    );
    setRefundModalOpen(false);
    setSelectedApp(null);
  };

  const handleReject = (id: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, status: badgeStatus.Rejected } : app
      )
    );
  };

  return (
    <View className="flex-1 bg-white p-4">
      <ScrollView>
        {applications.map((app) => (
          <View key={app.id} className="mb-4">
            <ApprovalCard
              title={`${app.rollNumber} - ${app.name}`}
              subTitle={`Status: ${app.status.charAt(0).toUpperCase() + app.status.slice(1)}`}
              badge={app.status}
              data={{
                "Roll Number": app.rollNumber,
                "Name": app.name,
                ...app.details,
              }}
              onApprove={
                app.status === badgeStatus.Pending
                  ? () => handleApprove(app)
                  : undefined
              }
              onDecline={
                app.status === badgeStatus.Pending
                  ? () => handleReject(app.id)
                  : undefined
              }
            />
          </View>
        ))}
      </ScrollView>
      <RefundApprovalModal
        isOpen={refundModalOpen}
        onClose={() => {
          setRefundModalOpen(false);
          setSelectedApp(null);
        }}
        onSubmit={handleRefundSubmit}
        application={selectedApp}
      />
    </View>
  );
}