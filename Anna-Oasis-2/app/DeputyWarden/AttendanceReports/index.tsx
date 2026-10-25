import { View, Text, ScrollView, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { getAllAttendanceRecords, getAllAttendanceRecordsByDate } from "@/utils/deputyWarden/dwAttendanceApi";
import { Button, ButtonText } from "@/components/ui/button";
import { router } from "expo-router";


const PRIMARY_COLOR = "#022B60";

export default function AttendanceReportsPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [selectedAttendance, setSelectedAttendance] = useState<any | null>(
      null
    );

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
    <>
      <ScrollView className="w-full mt-4">
        {records.map((item) => (
          <View
              key={item.id}
              className="bg-white rounded-2xl border border-gray-200 mb-5 px-4 py-4 mx-4 w-full sm:w-[80%] md:w-[50%] self-center"
            >
              {/* Attendance Header */}
              <Text
                className="text-lg font-bold mb-1 text-[#022B60]"
              >
                {item.date} - {item.hostel} - Floor {item.floor}
              </Text>

              {/* Attendance Summary */}
              <View className="flex-row justify-between mt-4 mb-5">
                <View className="items-center flex-1">
                  <Text className="text-[#022B60] font-bold text-2xl">
                    {item.no_present}
                  </Text>
                  <Text className="text-gray-600 text-sm mt-1">
                    Present
                  </Text>
                </View>

                <View className="items-center flex-1">
                  <Text className="text-[#022B60] font-bold text-2xl">
                    {item.no_absent}
                  </Text>
                  <Text className="text-gray-600 text-sm mt-1">
                    Absent
                  </Text>
                </View>

                <View className="items-center flex-1">
                  <Text className="font-bold text-2xl text-[#022B60]">
                    {item.no_leave ?? 0}
                  </Text>
                  <Text className="text-gray-600 text-sm mt-1">
                    Leave
                  </Text>
                </View>
              </View>

              {/* View Details Button */}
              <Button
                onPress={() => {
                  router.push(`/DeputyWarden/AttendanceReports/${item.date}`)
                }}
                style={{ backgroundColor: PRIMARY_COLOR }}
              >
                <ButtonText className="text-white font-semibold">
                  View Details
                </ButtonText>
              </Button>
          </View>
        ))}
      </ScrollView>
      
    </>
  );
}