import { ScrollView } from "react-native";
import { Text } from "@/components/ui/text";
import { useEffect, useState } from "react";
import { Box } from "@/components/ui/box";
import ApprovalCard from "@/components/ApprovalCard";
import useUserStore from "@/stores/userStore";
import {
  fetchSummerVacationForms,
  VacationStatusMap,
  SummerVacationForm,
} from "@/utils/student/studentVacationApi";
import { getSummerVacationBadgeStatus } from "@/utils/getBadgeStatus";
import EmptyPage from "@/components/EmptyPage";

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

  if (loading) {
    return (
      <Box className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </Box>
    );
  }

  return (

    <ScrollView className="p-4">
      {forms.length > 0 ? (
        forms.map((form) => (
          <Box key={form.id} className="mb-3  bg-white rounded-lg">
            <ApprovalCard
              title={`Form #${form.id}`}
              subTitle={`Vacation From: ${new Date(form.vacation_from).toLocaleDateString()}`}
              badge={getSummerVacationBadgeStatus(form.status)}
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
        <EmptyPage
          title="No summer vacation forms"
          description="You have not submitted any summer vacation forms yet."
        />
      )}
    </ScrollView>
  );
};

export default SummerVacationHistory;

