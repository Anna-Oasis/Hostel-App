import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { useEffect, useState } from "react";
import { Box } from "@/components/ui/box";
import ApprovalCard from "@/components/ApprovalCard";
import { getRCLeaves } from "@/utils/rc/rcLeaveApi";
import EmptyPage from "@/components/EmptyPage";
import { getRCLeaveBadgeStatus } from "@/utils/getBadgeStatus";

const RcLeaveHistory = () => {
  const [leaveHistory, setLeaveHistory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaveHistory = async () => {
      try {
        const history = await getRCLeaves();
        setLeaveHistory(history);
      } catch (error) {
        console.error("Error fetching RC leave history:", error);
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
          <Box
            key={leave.id || index}
            className="mb-4 p-4 bg-white rounded-lg "
          >
            <ApprovalCard
              title={`Leave #${leave.reason}`}
              subTitle={`${leave.leaving} → ${leave.arrival}`}
              badge={getRCLeaveBadgeStatus(leave.approved)}
              data={{
                Reason: leave.reason,
                Leaving: leave.leaving,
                Arrival: leave.arrival,
                "Created At": new Date(leave.created_at).toLocaleString(),
                Status:
                  leave.approved === "1"
                    ? "Pending"
                    : leave.approved === "-1"
                    ? "Rejected"
                    : leave.approved === "2"
                    ? "Approved"
                    : "Pending",
              }}
            />
          </Box>
        ))
      ) : (
        <EmptyPage
          title="No leave history found."
          description="You have not applied for any RC leave yet."
        />
      )}
    </View>
  );
};

export default RcLeaveHistory;
