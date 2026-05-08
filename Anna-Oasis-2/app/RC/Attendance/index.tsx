import { Button, ButtonText } from "@/components/ui/button";
import { Checkbox, CheckboxIcon, CheckboxIndicator } from "@/components/ui/checkbox";
import { CheckIcon } from "@/components/ui/icon";
import { View, Text, ScrollView } from "react-native";
import { handelRCAttendance, getAllRCStudents } from "@/utils/rc/RcAttendenceUtils";
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from "@/components/ui/select";
import { ChevronDownIcon } from "@/components/ui/icon";
import { useState, useEffect } from "react";
import useRCStore from "@/stores/rcStore";
import AttendanceHistory from "@/components/rc/AttendanceHistory";


export default function AttendancePage() {

  const [floor, setFloor] = useState("");
  const [maxFloor, setMaxfloor] = useState(0)
  const floors = Array.from({ length: maxFloor }, (_, i) => i.toString());

  const [students, setStudents] = useState<any[]>([]);
  const [absentees, setAbsentees] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"submit" | "history">("submit");
  const [hostelBlock, setHostelBlock] = useState("")

  useEffect(() => {
    getAllRCStudents()
      .then((data) => {
        setStudents(data);
        setAbsentees(data.map((s: any) => s.rollNo));
        const hostelBlock = data[0]?.hostelBlock;
        const maxFloor = Math.max(...data.map(s => s.floor));
        setMaxfloor(maxFloor + 1)
        setHostelBlock(hostelBlock)
      })
      .catch(() => {
        setStudents([]);
        setAbsentees([]);
      });
  }, []);

  const studentsByRoom: { [room: number]: any[] } = {};
  students
    .filter((s) => s.floor === parseInt(floor))
    .forEach((student) => {
      if (!studentsByRoom[student.roomNumber]) {
        studentsByRoom[student.roomNumber] = [];
      }
      studentsByRoom[student.roomNumber].push(student);
    });

  const handleCheckboxChange = (rollNo: string) => {
    setAbsentees((prev) => {
      if (prev.includes(rollNo)) {
        return prev.filter((r) => r !== rollNo);
      } else {
        return [...prev, rollNo];
      }
    });
  };

  return (
    <ScrollView>
      <View className="flex-1 justify-center items-center p-2">
        {/* Tab structure */}
        <View className="flex flex-row w-full justify-center mt-4 mb-2">
          <View
            className={`px-6 py-2 rounded-t-lg ${activeTab === "submit" ? "bg-[#022B60]" : "bg-gray-200"} mr-2`}
            style={{}}
          >
            <Text
              className={`text-lg font-bold ${activeTab === "submit" ? "text-white" : "text-gray-700"}`}
              onPress={() => setActiveTab("submit")}
            >
              Submit Attendance
            </Text>
          </View>
          <View
            className={`px-6 py-2 rounded-t-lg ${activeTab === "history" ? "bg-[#022B60]" : "bg-gray-200"}`}
            style={{}}
          >
            <Text
              className={`text-lg font-bold ${activeTab === "history" ? "text-white" : "text-gray-700"}`}
              onPress={() => setActiveTab("history")}
            >
              Attendance History
            </Text>
          </View>
        </View>
        {/* Tab content */}
        {activeTab === "submit" ? (
          <>
            <Text className="text-2xl m-2 mt-6 font-bold">RC Name Attendance</Text>
            <View className="flex flex-row gap-4 items-center mt-6">
              <Text className="text-lg">Select Floor</Text>
              <Select className="w-[150px]" onValueChange={(value) => setFloor(value)}>
                <SelectTrigger>
                  <SelectInput placeholder="Select Floor" className="flex-1 my-3 py-2" />
                  <SelectIcon as={ChevronDownIcon} />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper className="m-4">
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    {floors.map((item, index) => (
                      <SelectItem key={index} label={item} value={item} />
                    ))}
                  </SelectContent>
                </SelectPortal>
              </Select>
            </View>
            {floor.trim() !== "" ? (
              <ScrollView className="w-full mt-8">
                {Object.entries(studentsByRoom).map(([roomNumber, studentsInRoom]) => (
                  <View
                    key={roomNumber}
                    className="bg-white rounded-2xl border border-gray-300 shadow-md mb-6 px-4 py-4 mx-4"
                  >
                    <Text className="text-xl font-semibold mb-2">
                      Room {roomNumber}
                    </Text>
                    {studentsInRoom.map((student, idx) => (
                      <View
                        key={student.rollNo}
                        className="flex flex-row items-center justify-between mb-2"
                      >
                        <View className="flex flex-row items-center">
                          <Checkbox
                            value=""
                            size="md"
                            isInvalid={false}
                            isDisabled={false}
                            onChange={() => handleCheckboxChange(student.rollNo)}
                            isChecked={!absentees.includes(student.rollNo)}
                            className="mr-3"
                          >
                            <CheckboxIndicator>
                              <CheckboxIcon as={CheckIcon} />
                            </CheckboxIndicator>
                          </Checkbox>
                          <Text className="text-base font-medium">
                            {student.rollNo} - {student.name}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                ))}
                <View className="items-center mb-8">
                  <Button
                    onPress={() => {
                      const presentCount = students.filter(
                        (s) => s.floor === parseInt(floor) && !absentees.includes(s.rollNo)
                      ).length;
                      const absentCount = absentees.length;
                      const attendanceObj = {
                        date: new Date().toISOString().slice(0, 10),
                        hostel: hostelBlock,
                        floor: parseInt(floor),
                        no_present: presentCount,
                        no_absent: absentCount,
                        absentee: absentees,
                      };
                      handelRCAttendance(attendanceObj);
                    }}
                  >
                    <ButtonText>Submit</ButtonText>
                  </Button>
                </View>
              </ScrollView>
            ) : (
              <View className="mt-52">
                <Text className="text-3xl">Select floor for attendance</Text>
              </View>
            )}
          </>
        ) : (
          <AttendanceHistory />
        )}
      </View>
    </ScrollView>
  );
}