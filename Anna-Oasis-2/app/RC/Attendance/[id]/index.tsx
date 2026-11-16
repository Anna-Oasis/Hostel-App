import React from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Button, ButtonText } from "@/components/ui/button";



const renderStudent = (
  student: any,
  index: number,
  type: "absent" | "leave"
) => (
  <View
    key={`${student.rollNo ?? "student"}-${index}`}
    className="mb-3 rounded-xl border border-slate-200 bg-white p-3"
  >
    {/* Roll Number - Name */}
    <View className="">
        <View>
            <Text
            className={`rounded-md px-2 py-1 text-[10px] font-extrabold ${
                type === "absent" ? "text-red-700 bg-red-100" : "text-amber-800 bg-amber-100"
            }`}
            >
            {type === "absent" ? "ABSENT" : "ON LEAVE"}
            </Text>
        </View> 
        <View>
          <Text className="flex-1 text-md font-bold text-slate-900">
            Name : {student.name ?? "N/A"}
          </Text>
          <Text className="flex-1 text-md font-bold text-slate-900">
              Roll Number : {student.rollNo ?? "N/A"}
          </Text>
          <Text className="flex-1 text-md font-bold text-slate-900">
              Room Number : {student.roomNumber ?? "N/A"}
          </Text>
          <Text className="flex-1 text-md font-bold text-slate-900">
              Mobile : {student.mobile ?? "N/A"}
          </Text>
        </View>
       
    </View>
  </View>
);


export default function AttendanceDetails() {
  const { id, attendance } = useLocalSearchParams<{
    id: string;
    attendance: string;
  }>();

  const selectedAttendance = attendance
    ? JSON.parse(attendance)
    : null;  

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

  if (!selectedAttendance) return null;

  return (
    <View className="flex-1 bg-white p-4">
      {/* Header */}
      <View className="border-b-2 border-gray-200 pb-4 mb-5">
        <Text className="text-2xl font-bold text-black">
          Attendance Details
        </Text>

        <Text className="text-[#022B60] font-bold text-xl mt-2">
          ({new Date(selectedAttendance.date).toLocaleDateString("en-GB")})
          {" - "}
          {floorNumtoName(selectedAttendance.floor)}
        </Text>
      </View>

      <ScrollView>
        {/* Absentees */}
        <Text className="text-base font-bold text-[#022B60] mb-2">
          Absentees ({selectedAttendance.no_absent})
        </Text>

        <View className="bg-red-50 rounded-lg p-3 mb-5">
          {selectedAttendance.absentee_details?.length > 0
            ? selectedAttendance.absentee_details.map(
                (data: any, idx: number) =>
                  renderStudent(data, idx, "absent")
              )
            : <Text>No absentees</Text>}
        </View>

        {/* Students on Leave */}
        <Text className="text-base font-bold text-[#022B60] mb-2">
          Students on Leave ({selectedAttendance.no_leave ?? 0})
        </Text>

        <View className="bg-orange-50 rounded-lg p-3">
          {selectedAttendance.onleave_details?.length > 0
            ? selectedAttendance.onleave_details.map(
                (student: any, idx: number) => (
                  renderStudent(student, idx, "leave")

                )
              )
            : <Text>No students on leave</Text>}
        </View>
      </ScrollView>

      <Button onPress={() => router.back()} className="mt-4">
        <ButtonText>Go Back</ButtonText>
      </Button>
    </View>
  );
}