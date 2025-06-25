import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getAttendanceHistory } from "@/utils/rc/RcAttendenceUtils";

const AttendanceHistory = () => {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    getAttendanceHistory()
      .then((data) => {
        setHistory(data);
      })
      .catch(() => {
        setHistory([]);
      });
  }, []);

  if (!history.length) {
    return (
      <View className="flex-1 items-center justify-center mt-10">
        <Text>No attendance history found.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="w-full mt-4">
      {history.map((item) => (
        <View
          key={item.id}
          className="bg-white rounded-2xl border border-gray-300 shadow-md mb-6 px-4 py-4 mx-4"
        >
          <Text className="text-lg font-bold mb-1">
            {item.date} - {item.hostel} - Floor {item.floor}
          </Text>
          <Text className="mb-1">Present: {item.no_present}</Text>
          <Text className="mb-1">Absent: {item.no_absent}</Text>
          <Text className="mb-1">Absentees: {item.absentee && item.absentee.length > 0 ? item.absentee.join(", ") : "None"}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

export default AttendanceHistory