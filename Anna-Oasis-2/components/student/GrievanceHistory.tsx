import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import ApprovalCard, { badgeStatus } from '@/components/ApprovalCard';
import { getHistoryOfGrievance } from '@/utils/student/studentGrievanceApi';
import { getGrievanceBadgeStatus } from '@/utils/getBadgeStatus';
import EmptyPage from '@/components/EmptyPage';

type GrievanceRaw = {
  id: number;
  roll_number: string;
  grievance_type: string;
  subject: string;
  description: string;
  status: string; // "0" | "1" | "2"
  rc_decision_at: string | null;
  resolved_at: string | null;
  created_at: string;
};

type GrievanceDisplay = {
  "Grievance Type": string;
  "Subject": string;
  "Description": string;
  "Status": string;
  "RC Decision At": string;
  "Resolved At": string;
  "Submitted At": string;
  badge: typeof badgeStatus[keyof typeof badgeStatus];
};

const GrievanceHistory = () => {
  const [grievanceListRaw, setGrievanceListRaw] = useState<GrievanceRaw[]>([]);
  const [grievanceListDisplay, setGrievanceListDisplay] = useState<GrievanceDisplay[]>([]);

  useEffect(() => {
    const fetchGrievanceHistory = async () => {
      const result = await getHistoryOfGrievance();

      if (!result) {
        console.log("Failed to fetch grievance history");
        return;
      }

      setGrievanceListRaw(result);

      const formattedList = result.map((item: GrievanceRaw): GrievanceDisplay => {
        const badge = getGrievanceBadgeStatus(item.status);
        return {
          "Grievance Type": item.grievance_type,
          "Subject": item.subject,
          "Description": item.description,
          "Status": badge,
          "RC Decision At": item.rc_decision_at
            ? new Date(item.rc_decision_at).toLocaleString("en-IN")
            : "Not decided",
          "Resolved At": item.resolved_at
            ? new Date(item.resolved_at).toLocaleString("en-IN")
            : "Not resolved",
          "Submitted At": new Date(item.created_at).toLocaleString("en-IN"),
          badge,
        };
      });

      setGrievanceListDisplay(formattedList);
    };

    fetchGrievanceHistory();
  }, []);

  return (
    <ScrollView>
      <View className='m-2'>
        {grievanceListRaw.length === 0 ? (
          <EmptyPage
            title="No Grievances Found"
            description="You have not filed any grievances yet."
          />
        ) : (
          grievanceListRaw.map((item, index) => (
            <ApprovalCard
              key={item.id}
              title={item.grievance_type || "No Title"}
              subTitle={item.subject || "No Subtitle"}
              badge={grievanceListDisplay[index]?.badge || badgeStatus.Pending}
              data={grievanceListDisplay[index]}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
};

export default GrievanceHistory;
