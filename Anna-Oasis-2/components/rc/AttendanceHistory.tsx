import { View, Text, ScrollView, Pressable, Dimensions, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { getAttendanceHistory } from "@/utils/rc/RcAttendenceUtils";
import { Button, ButtonText } from "../ui/button";
import { Modal, ModalBackdrop, ModalCloseButton, ModalContent, ModalHeader, ModalBody } from "@/components/ui/modal";
import { Icon, CloseIcon } from "@/components/ui/icon";

const PRIMARY_COLOR = "#022B60";

const AttendanceHistory = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [selectedAttendance, setSelectedAttendance] = useState<any | null>(
    null
  );
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
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
    <>
      <ScrollView className="w-full mt-4">
        {history.map((item) => (
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
              onPress={() => setSelectedAttendance(item)}
              style={{ backgroundColor: PRIMARY_COLOR }}
            >
              <ButtonText className="text-white font-semibold">
                View Details
              </ButtonText>
            </Button>
          </View>
        ))}
      </ScrollView>

      {/* Attendance Details Modal */}
      <Modal
        isOpen={selectedAttendance}
        onClose={() => setSelectedAttendance(null)}
      >
        <ModalBackdrop/>
        <ModalContent
          style={{ maxHeight: Dimensions.get("window").height * 0.9, maxWidth: Dimensions.get("window").height * 1 }}
        >
          <ModalHeader className="border-b-2">
            <Text className="text-2xl font-bold mb-2 text-black flex-col flex">Attendance Details
              {selectedAttendance && (
                <Text className="text-[#022B60] mb-5 font-bold text-xl">
                  ({new Date(selectedAttendance.date).toLocaleDateString("en-GB")}) - {floorNumtoName(selectedAttendance.floor)}
                </Text>
              )}
              </Text>
            <ModalCloseButton>
              <Icon as={CloseIcon} className="mb-2" size="xl" />
            </ModalCloseButton>
          </ModalHeader>

          <ModalBody className="mt-6">
                {selectedAttendance && (
                    <ScrollView className="max-h-80">
                      {/* Absentees */}
                      <Text className="text-base font-bold text-[#022B60] mb-2">
                        Absentees ({selectedAttendance.no_absent})
                      </Text>

                      <View className="bg-red-50 rounded-lg p-3 mb-5">
                        <Text className="text-gray-700">
                          {selectedAttendance.absentee?.length > 0
                            ? selectedAttendance.absentee.join(", ")
                            : "No absentees"}
                        </Text>
                      </View>

                      {/* Students on Leave */}
                      {/* <Text className="text-base font-bold text-[#022B60] mb-2">
                        Students on Leave ({selectedAttendance.no_leave ?? 0})
                      </Text>

                      <View className="bg-orange-50 rounded-lg p-3">
                        <Text className="text-gray-700">
                          {selectedAttendance.onleave?.length > 0
                            ? selectedAttendance.onleave.join("\n ")
                            : "No students on leave"}
                        </Text>
                      </View> */}
                    </ScrollView>
                )}
          </ModalBody>
        </ModalContent>
        
      </Modal>
    </>
  );
};

export default AttendanceHistory;