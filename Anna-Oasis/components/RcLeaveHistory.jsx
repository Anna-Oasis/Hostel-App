import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { VStack } from './ui/vstack';
import { Box } from './ui/box';
import ApprovalCard, { badgeStatus } from './ApprovalCard'; // assuming you use ApprovalCard
import { getRCLeaves, RCLeaveResponseWithMsg } from '@/utils/rc/rcApi';

const RcLeaveHistory = () => {
//   const [leaveHistory, setLeaveHistory] = useState<RCLeaveResponseWithMsg | null>(null);
    const [leaveHistory, setLeaveHistory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaveHistory = async () => {
      try {
        const history = await getRCLeaves();
        setLeaveHistory(history);
      } catch (error) {
        console.error('Error fetching RC leave history:', error);
        setLeaveHistory(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveHistory();
  }, []);

  return (
    <View>
        {loading ? (
          <Text className="text-center">Loading...</Text>
        ) : leaveHistory && leaveHistory.data.length > 0 ? (
          leaveHistory.data.map((leave, index) => (
            <Box key={leave.id || index} className="mb-4 p-4 bg-white rounded-lg ">
              <ApprovalCard
                title={`Leave #${leave.reason}`}
                subTitle={`${leave.leaving} → ${leave.arrival}`}
                badge={
                  leave.approved === '1'
                    ? badgeStatus.Pending
                    : leave.approved === '-1'
                    ? badgeStatus.Rejected
                    : leave.approved === '2' 
                    ? badgeStatus.Approved
                    : badgeStatus.Pending
                }
                data={{
                  "Reason": leave.reason,
                  "Leaving": leave.leaving,
                  "Arrival": leave.arrival,
                  "Created At": new Date(leave.created_at).toLocaleString(),
                  "Status": leave.approved === '1'
                    ? badgeStatus.Pending
                    : leave.approved === '-1'
                    ? badgeStatus.Rejected
                    : leave.approved === '2' 
                    ? badgeStatus.Approved
                    : badgeStatus.Pending,
                }}
              />
            </Box>
          ))
        ) : (
          <Text className="text-center text-gray-500">No leave history found.</Text>
        )}
    </View>
  );
};

export default RcLeaveHistory;
