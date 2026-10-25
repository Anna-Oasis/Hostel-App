import { View, Text, ScrollView, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { getAllAttendanceRecords, getAllAttendanceRecordsByDate } from "@/utils/deputyWarden/dwAttendanceApi";
import { Button, ButtonText } from "@/components/ui/button";
import { router } from "expo-router";
import TabSwitch from "@/components/TabSwitch";


const PRIMARY_COLOR = "#022B60";

export default function AttendanceReportsPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [selectedAttendance, setSelectedAttendance] = useState<any | null>(
      null
    );
  
  const [activeTab, setActiveTab] = useState<"flora" | "lavender" | "tulip">("flora")

  useEffect(() => {
    getAllAttendanceRecords()
      .then((data) => setRecords(data))
      .catch(() => setRecords([]));
  }, []);

    const filteredRecords = records.filter(
      (item) => item.hostel.toLowerCase() === activeTab
    );

  const floorNumtoName = (num : number) => {
    switch(num){
      case 0:
        return "Ground Floor"
      case 1:
        return "First Floor"
      case 2:
        return "Second Floor"
      case 3:
        return "Third Floor"
    }
  }
  return (
    <>
      <TabSwitch
        tabs={[
          {label : "Flora", value : "flora"},
          {label : "Lavender", value : "lavender"},
          {label : "Tulip", value : "tulip"}
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="mt-4 mb-2"
      />
      <ScrollView className="w-full mt-4">
        {!filteredRecords.length ? 
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>No attendance records found.</Text>
              </View>
        :
        filteredRecords.map((item) => (
          <View
              key={item.id}
              className="bg-white rounded-2xl border border-gray-200 mb-5 px-4 py-4 mx-4 w-full sm:w-[80%] md:w-[50%] self-center"
            >
              {/* Attendance Header */}
              <Text
                className="text-lg font-bold mb-1 text-black underline"
              >
                  {item.hostel} Hostel - {floorNumtoName(item.floor)} - ({new Date(item.date).toLocaleDateString("en-GB")})
              </Text>

              {/* Attendance Summary */}
              <View className="flex-col  mt-4 mb-5">
                <Text className="text-[#022B60] font-bold text-lg">
                  Total no of Students : {item.no_present + item.no_absent + item.no_leave}
                </Text>
                <Text className="text-[#022B60] font-bold text-lg">
                  Present : {item.no_present}
                </Text>
                <Text className="text-[#022B60] font-bold text-lg">
                  Absent : {item.no_absent}
                </Text>
                <Text className="text-[#022B60] font-bold text-lg">
                  Students on Leave : {item.no_leave}
                </Text>
              </View>

              {/* View Details Button */}
              <Button
                onPress={() => {
                  router.push(`/DeputyWarden/AttendanceReports/${item.hostel}/${item.floor}/${item.date}`)
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