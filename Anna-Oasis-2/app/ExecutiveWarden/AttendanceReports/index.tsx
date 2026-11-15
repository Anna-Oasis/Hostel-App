import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import React, { useEffect, useState } from "react";

import {
  getAllAttendanceRecords,
} from "@/utils/executiveWarden/attendanceApi";

import { Button, ButtonText } from "@/components/ui/button";
import { router } from "expo-router";
import TabSwitch from "@/components/TabSwitch";
import DatePickerField from "@/components/form/DatePickerField";
import { Formik } from "formik";

const PRIMARY_COLOR = "#022B60";

export default function AttendanceReportsPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [activeTab, setActiveTab] = useState<
    "Flora" | "Lavender" | "Tulip"
  >("Flora");

  useEffect(() => {
    setLoading(true);

    getAllAttendanceRecords(activeTab)
      .then((data) => setRecords(data))
      .catch(() => setRecords([]))
      .finally(() => setLoading(false));
  }, [activeTab]);

  const floorNumtoName = (num: number) => {
    switch (num) {
      case 0:
        return "Ground Floor";
      case 1:
        return "First Floor";
      case 2:
        return "Second Floor";
      case 3:
        return "Third Floor";
      default:
        return "Unknown Floor";
    }
  };

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

  return (
    <Formik
      initialValues={{
        selectedDate: "",
      }}
      onSubmit={() => {}}
    >
      {({ values, setFieldValue }) => {
        // Frontend date filtering
        const filteredRecords = records
          .filter((item) => {
            if (!values.selectedDate) return true;

            return (
              item.date.slice(0, 10) ===
              values.selectedDate
            );
          })
          .sort((a, b) => a.floor - b.floor);

        return (
          <>
            {/* Hostel Tabs */}
            <TabSwitch
              tabs={[
                { label: "Flora", value: "Flora" },
                { label: "Lavender", value: "Lavender" },
                { label: "Tulip", value: "Tulip" },
              ]}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              className="mt-4 mb-2"
            />
            
            {/* Date Filter */}
            <View className="mx-4 mt-3 max-w-xl rounded-xl border bg-white border-slate-200 p-3">
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="text-base font-bold text-[#022B60]">
                  Filter by Date
                </Text>

                {values.selectedDate !== "" && (
                  <Text
                    onPress={() =>
                      setFieldValue("selectedDate", "")
                    }
                    className="font-semibold text-red-600"
                  >
                    Clear Filter
                  </Text>
                )}
              </View>

              <DatePickerField
                value="selectedDate"
              />
            </View>

            {/* Attendance Records */}
            <ScrollView
              className="mt-4 w-full"
              contentContainerStyle={{
                paddingBottom: 30,
              }}
            >
              {filteredRecords.length === 0 ? (
                <View className="flex-1 items-center justify-center py-10">
                  <Text className="text-slate-500">
                    {values.selectedDate
                      ? "No attendance records found for this date."
                      : "No attendance records found."}
                  </Text>
                </View>
              ) : (
                filteredRecords.map((item) => (
                  <View
                    key={item.id}
                    className="mx-4 mb-5 rounded-2xl border border-gray-200 bg-white px-4 py-4"
                  >
                    {/* Attendance Header */}
                    <Text className="mb-1 text-lg font-bold text-black underline">
                      {item.hostel} Hostel -{" "}
                      {floorNumtoName(item.floor)} - (
                      {new Date(item.date).toLocaleDateString(
                        "en-GB"
                      )}
                      )
                    </Text>

                    {/* Attendance Summary */}
                    <View className="mb-5 mt-4 flex-col">
                      <Text className="text-lg font-bold text-[#022B60]">
                        Total no of Students :{" "}
                        {item.no_present +
                          item.no_absent +
                          item.no_leave}
                      </Text>

                      <Text className="text-lg font-bold text-[#022B60]">
                        Present : {item.no_present}
                      </Text>

                      <Text className="text-lg font-bold text-[#022B60]">
                        Absent : {item.no_absent}
                      </Text>

                      <Text className="text-lg font-bold text-[#022B60]">
                        Students on Leave : {item.no_leave}
                      </Text>
                    </View>

                    {/* View Details Button */}
                    <Button
                      onPress={() => {
                        router.push(
                          `/ExecutiveWarden/AttendanceReports/${item.hostel}/${item.floor}/${item.date}`
                        );
                      }}
                      style={{
                        backgroundColor: PRIMARY_COLOR,
                      }}
                    >
                      <ButtonText className="font-semibold text-white">
                        View Details
                      </ButtonText>
                    </Button>
                  </View>
                ))
              )}
            </ScrollView>
          </>
        );
      }}
    </Formik>
  );
}