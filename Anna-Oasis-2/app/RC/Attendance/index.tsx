import { Button, ButtonText } from "@/components/ui/button";
import { Checkbox, CheckboxIcon, CheckboxIndicator } from "@/components/ui/checkbox";
import { CheckIcon } from "@/components/ui/icon";
import { View, Text, ScrollView } from "react-native";
import { handelRCAttendance, getAllRCStudents, getAllRCStudentsForAttendance } from "@/utils/rc/RcAttendenceUtils";
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
  const [studentsOnLeave, setStudentsOnLeave] = useState<string[]>([]);

  useEffect(() => {
    getAllRCStudentsForAttendance()
      .then((data) => {
        setStudents(data);

        const onLeave = data
          .filter((s: any) => Number(s.hasLeave) === 1)
          .map((s: any) => s.rollNo);

        setStudentsOnLeave(onLeave);

        setAbsentees(
          data
            .filter((s: any) => Number(s.hasLeave) !== 1)
            .map((s: any) => s.rollNo)
        );

        const hostelBlock = data[0]?.hostelBlock;
        const maxFloor = Math.max(0, ...data.map((s: any) => s.floor ?? 0));

        setMaxfloor(maxFloor + 1);
        setHostelBlock(hostelBlock ?? "");
      })
      .catch(() => {
        setStudents([]);
        setAbsentees([]);
        setStudentsOnLeave([]);
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

  const floorStudents = students.filter(
    (s) => s.floor === parseInt(floor)
  );

  const eligibleFloorStudents = floorStudents.filter(
    (s) => !studentsOnLeave.includes(s.rollNo)
  );

  const allSelected =
    eligibleFloorStudents.length > 0 &&
    eligibleFloorStudents.every(
      (s) => !absentees.includes(s.rollNo)
    );

  const handleSelectAll = () => {
    if (allSelected) {
      // Deselect all: mark all eligible students absent
      setAbsentees((prev) => [
        ...new Set([
          ...prev,
          ...eligibleFloorStudents.map((s) => s.rollNo),
        ]),
      ]);
    } else {
      // Select all: mark all eligible students present
      setAbsentees((prev) =>
        prev.filter(
          (rollNo) =>
            !eligibleFloorStudents.some((s) => s.rollNo === rollNo)
        )
      );
    }
};

  useEffect(() => {
    if (activeTab !== "submit") {
      setFloor("");
      setAbsentees(students.map((s) => s.rollNo));
    }
  }, [activeTab]);

  const submitFloorAttendance = async () => {
      const floorStudents = students.filter(
        (s) => s.floor === parseInt(floor)
      );

      const leaveStudents = floorStudents.filter(
        (s) => studentsOnLeave.includes(s.rollNo)
      );


      const eligibleStudents = floorStudents.filter(
        (s) => !studentsOnLeave.includes(s.rollNo)
      );

      const presentCount = eligibleStudents.filter(
        (s) => !absentees.includes(s.rollNo)
      ).length;

      const floorAbsentees = eligibleStudents
        .filter((s) => absentees.includes(s.rollNo))
        .map((s) => s.rollNo);

      const absentCount = floorAbsentees.length;

      const attendanceObj = {
        date: new Date().toISOString().slice(0, 10),
        hostel: hostelBlock,
        floor: parseInt(floor),
        no_present: presentCount,
        no_absent: absentCount,
        absentee: floorAbsentees,
        onleave: leaveStudents.map((s) => s.rollNo),
        no_leave: leaveStudents.length,
      };
      console.log(attendanceObj)
      await handelRCAttendance(attendanceObj);

      setFloor("");

      setAbsentees(
        students
          .filter((s) => Number(s.hasLeave) !== 1)
          .map((s) => s.rollNo)
      );
    }

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
            <Text className="text-2xl m-2 mt-6 font-bold">Attendance</Text>
            <View className="flex flex-row gap-4 items-center mt-6">
              <Text className="text-lg">Select Floor</Text>
              <Select className="w-[150px]" onValueChange={(value) => setFloor(value)}>
                <SelectTrigger>
                  <SelectInput value={floor} placeholder="Select Floor" className="flex-1 my-3 py-2" />
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
                  <View className="w-full flex flex-col items-center">
                    <View className="w-full sm:w-[80%] md:w-[50%] px-4 mb-4">
                      <View className="flex-row items-center justify-between bg-white rounded-xl border border-gray-300 p-4">
                        <Text className="text-lg font-semibold">
                          Select All Students
                        </Text>

                        <Checkbox
                          value="select-all"
                          size="md"
                          isInvalid={false}
                          isDisabled={eligibleFloorStudents.length === 0}
                          isChecked={allSelected}
                          onChange={handleSelectAll}
                        >
                          <CheckboxIndicator>
                            <CheckboxIcon as={CheckIcon} />
                          </CheckboxIndicator>
                        </Checkbox>
                      </View>
                    </View>
                    {Object.entries(studentsByRoom).map(([roomNumber, studentsInRoom]) => (
                      <View
                        key={roomNumber}
                        className="bg-white rounded-2xl border border-gray-300 shadow-md mb-6 px-4 py-4 mx-4 w-full sm:w-[80%] md:w-[50%] self-center"
                      >
                        <Text className="text-xl font-semibold mb-2">
                          Room {roomNumber}
                        </Text>
                        {studentsInRoom.map((student) => {
                          const isOnLeave = studentsOnLeave.includes(student.rollNo);

                          return (
                            <View
                              key={student.rollNo}
                              className="flex flex-row items-center justify-between mb-2"
                            >
                              <View className="flex flex-row items-center">
                                {!isOnLeave && (
                                  <Checkbox
                                    value={student.rollNo}
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
                                )}

                                <Text className="text-base font-medium">
                                  {student.rollNo} - {student.name}
                                  {isOnLeave ? " (On Leave)" : ""}
                                </Text>
                              </View>
                            </View>
                          );
                        })}
                      </View>
                    ))}
                    <View className="items-center mb-8">
                      <Button
                        onPress={submitFloorAttendance}
                      >
                        <ButtonText>Submit</ButtonText>
                      </Button>
                    </View>
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