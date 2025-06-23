import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { Box } from "./ui/box";
import ApprovalCard, { badgeStatus } from "./ApprovalCard";
import useUserStore from "@/stores/userStore";
import {
  fetchSummerVacationForms,
  VacationStatusMap,
  SummerVacationForm,
} from "@/utils/student/studentVacationApi";

const statusBadgeMap: Record<string, keyof typeof badgeStatus> = {
  "0": "Pending",
  "1": "Pending",
  "2": "Approved",
  "-1": "Rejected",
};

const SummerVacationHistory = () => {
  const user = useUserStore((state) => state.details);
  const [forms, setForms] = useState<SummerVacationForm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getHistory = async () => {
      try {
        if (!user?.rollNo) return;
        const response = await fetchSummerVacationForms(user.rollno);
        if (response.success && response.data) {
          setForms(response.data);
        }
      } catch (error) {
        console.error("Error fetching summer vacation forms:", error);
      } finally {
        setLoading(false);
      }
    };

    getHistory();
  }, [!user?.rollNo]);

  return (
    <ScrollView className="p-4">
      {loading ? (
        <Text className="text-center text-gray-600">Loading...</Text>
      ) : forms.length > 0 ? (
        forms.map((form) => (
          <Box key={form.id} className="mb-3  bg-white rounded-lg">
            <ApprovalCard
              title={`Form #${form.id}`}
              subTitle={`Vacation From: ${new Date(form.vacation_from).toLocaleDateString()}`}
              badge={badgeStatus[statusBadgeMap[form.status] || "Pending"]}
              data={{
                "Address of Stay": form.address_of_stay,
                "Returned Items": form.returned_items.join(", "),
                "Status": VacationStatusMap[form.status],
                "Submitted On": new Date(form.created_at).toLocaleString(),
              }}
            />
          </Box>
        ))
      ) : (
        <Text className="text-center text-gray-500">
          No summer vacation forms submitted yet.
        </Text>
      )}
    </ScrollView>
  );
};

export default SummerVacationHistory;
