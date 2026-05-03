import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { getAllAttendanceRecords } from "@/utils/deputyWarden/dwAttendanceApi";

export default function AttendanceReportsPage() {
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    getAllAttendanceRecords()
      .then((data) => setRecords(data))
      .catch(() => setRecords([]));
  }, []);

  if (!records.length) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No attendance records found.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="w-full mt-4">
      {records.map((item) => (
        <View
          key={item.id}
          className="bg-white rounded-2xl border border-gray-300 shadow-md mb-6 px-4 py-4 mx-4"
        >
          <Text className="text-lg font-bold mb-1">
            {item.date} - {item.hostel} - Floor {item.floor}
          </Text>
          <Text className="mb-1">Present: {item.no_present}</Text>
          <Text className="mb-1">Absent: {item.no_absent}</Text>
          <Text className="mb-1">
            Absentees:{" "}
            {item.absentee && item.absentee.length > 0
              ? item.absentee.join(", ")
              : "None"}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}