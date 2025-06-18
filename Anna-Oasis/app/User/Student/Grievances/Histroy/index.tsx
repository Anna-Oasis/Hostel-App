import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import ApprovalCard, { badgeStatus } from '@/components/ApprovalCard';
import { getHistroyOfGrievance } from '@/utils/grievanceUtils';

// Raw format directly from the backend
type GrievanceRaw = {
  grievance_type: string;
  subject: string;
  description: string;
  rc_approval: boolean;
  resolved: boolean;
  created_at: string;
};

// Display format for the UI
type GrievanceDisplay = {
  "Grievance Type": string;
  "Subject": string;
  "Description": string;
  "RC Approval": string;
  "Resolved": string;
  "Submitted At": string;
  status: typeof badgeStatus[keyof typeof badgeStatus];
};

const GrievanceHistory = () => {
  const [grievanceListRaw, setGrievanceListRaw] = useState<GrievanceRaw[]>([]);
  const [grievanceListDisplay, setGrievanceListDisplay] = useState<GrievanceDisplay[]>([]);

  useEffect(() => {
    const fetchGrievanceHistory = async () => {
      const result = await getHistroyOfGrievance();

      if (!result) {
        console.log("Failed to fetch grievance history");
        return;
      }

      setGrievanceListRaw(result);

      const formattedList = result.map((item: GrievanceRaw): GrievanceDisplay => ({
        "Grievance Type": item.grievance_type,
        "Subject": item.subject,
        "Description": item.description,
        "RC Approval": item.rc_approval ? "Approved" : "Rejected",
        "Resolved": item.resolved ? "Resolved" : "Not resolved",
        "Submitted At": new Date(item.created_at).toLocaleDateString("en-IN"),
        status: item.resolved
          ? item.rc_approval
            ? badgeStatus.Approved
            : badgeStatus.Rejected
          : badgeStatus.Pending,
      }));

      setGrievanceListDisplay(formattedList);
    };

    fetchGrievanceHistory();
  }, []);

  return (
    <ScrollView>
        <View className='m-2'>

        {grievanceListRaw.map((item, index) => (
            <ApprovalCard
            key={index}
            title={item.grievance_type || "No Title"}
            subTitle={item.subject || "No Subtitle"}
            badge={grievanceListDisplay[index]?.status || badgeStatus.Pending}
            data={grievanceListDisplay[index]}
            />
        ))}
        </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({});

export default GrievanceHistory;
