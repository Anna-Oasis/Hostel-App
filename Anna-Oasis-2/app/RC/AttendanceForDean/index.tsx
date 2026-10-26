import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { getAttendanceHistory } from "@/utils/rc/RcAttendenceUtils";

const PRIMARY_COLOR = "#022B60";

const AttendanceHistoryForDean = () => {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true)
  

  useEffect(() => {
    getAttendanceHistory()
      .then((data) => {
        setHistory(data);
      })
      .catch(() => {
        setHistory([]);
      })
      .finally(() => setLoading(false))
  }, []);

  // Group attendance by date and calculate combined totals
  const groupedHistory = [...history]
    .reduce((groups, item) => {
      const dateKey = new Date(item.date).toLocaleDateString("en-GB");

      if (!groups[dateKey]) {
        groups[dateKey] = {
          totalPresent: 0,
          totalAbsent: 0,
          totalLeave: 0,
        };
      }

      groups[dateKey].totalPresent += Number(item.no_present) || 0;
      groups[dateKey].totalAbsent += Number(item.no_absent) || 0;
      groups[dateKey].totalLeave += Number(item.no_leave) || 0;

      return groups;
    }, {} as Record<string, {
      totalPresent: number;
      totalAbsent: number;
      totalLeave: number;
    }>);

  // Sort dates from newest to oldest
  const sortedDates = Object.keys(groupedHistory).sort((a, b) => {
    const [dayA, monthA, yearA] = a.split("/").map(Number);
    const [dayB, monthB, yearB] = b.split("/").map(Number);

    return (
      new Date(yearB, monthB - 1, dayB).getTime() -
      new Date(yearA, monthA - 1, dayA).getTime()
    );
  });

  if (loading) {
    return (
        <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        <Text className="mt-3 text-sm text-slate-500">
            Loading attendance report...
        </Text>
        </View>
    );
    }
  if (!history.length) {
    return (
      <View className="flex-1 items-center justify-center mt-10">
        <Text className="text-gray-500">
          No attendance history found.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="w-full mt-4">
      {sortedDates.map((date) => {
        const attendance = groupedHistory[date];

        const totalStudents =
          attendance.totalPresent +
          attendance.totalAbsent +
          attendance.totalLeave;

        return (
          <View
            key={date}
            className="bg-white rounded-2xl border border-gray-200 mb-5 px-4 py-4 mx-4 w-full sm:w-[80%] md:w-[50%] self-center"
          >
            {/* Date Header */}
            <View className="bg-[#022B60] rounded-xl px-4 py-3 mb-4">
              <Text className="text-white text-lg font-bold">
                Attendance - {date}
              </Text>
            </View>

            {/* Combined Attendance Summary */}
            <View className="mt-2 mb-3">
              <Text className="text-[#022B60] font-bold text-xl mb-3">
                Total Students: {totalStudents}
              </Text>

              <View className="border-t border-gray-200 pt-3">
                <Text className="text-[#022B60] font-bold text-lg mb-2">
                  Present: {attendance.totalPresent}
                </Text>

                <Text className="text-[#022B60] font-bold text-lg mb-2">
                  Absent: {attendance.totalAbsent + attendance.totalLeave}
                </Text>

              </View>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

export default AttendanceHistoryForDean;