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
import { getAdmissionSessions } from "@/utils/rc/rcAdmissionApi";
import { getAllRooms } from "@/utils/rc/rcAdmissionApi";

export default function AttendancePage() {

  const [floor, setFloor] = useState("");
  const maxFloor = useRCStore(state => state.maxFloor);
  const floors = Array.from({ length: maxFloor }, (_, i) => i.toString());

  const [students, setStudents] = useState<any[]>([]);
  const [absentees, setAbsentees] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"submit" | "history">("submit");
  const hostelBlock = useRCStore(state => state.hostelBlock);

  useEffect(() => {
    getAllRCStudents()
      .then((data) => {
        setStudents(data);
        setAbsentees(data.map((s: any) => s.rollNo));
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

  const [sessionOptions, setSessionOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(
     null
  );
  const [selectedSession, setSelectedSession] = useState<string>('')
  const rooms = useRCStore((state) => state.rooms)
  const setRooms = useRCStore((state) => state.setRooms);

  const handleSessionChange = (value : string) => {
    setSelectedSession(value)
  }

  useEffect(() => {
    getAdmissionSessions()
      .then((data) => {
        const options = data.map((item: any) => ({
          label: item.academic_year,
          value: item.academic_year,
        }));
        setSessionOptions(options);
      })
      .catch((err) => {
        console.log("Error fetching admission sessions:", err);
      })
  }, []);

  const handleFetchRooms = async () => {
    try {
      const roomList = await getAllRooms(selectedSession);
      setRooms(roomList);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
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
            <Text className="text-2xl my-8 font-bold">Attendance</Text>
            <View className="flex gap-3 items-center mt-2">
              <Text className="text-lg">Select Admission Session</Text>
              <Select
                selectedValue={
                  selectedFloor !== null ? "Select Academic Session" : undefined
                }
                onValueChange={handleSessionChange} 
              >
                <SelectTrigger variant="outline" size="md" className="w-full">
                  <SelectInput placeholder="Select Academic Session" />
                  <SelectIcon className="mr-3" as={ChevronDownIcon} />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    {sessionOptions.map((session, idx) => (
                      <SelectItem
                        key={idx}
                        label={session.label}
                        value={String(session.value)}
                      />
                    ))}
                  </SelectContent>
                </SelectPortal>
              </Select>
              <Button
                onPress={handleFetchRooms}
                size="md"
              >
                <ButtonText className="text-white text-lg font-semibold">Fetch Rooms</ButtonText>
              </Button>
            </View>
            <View className="flex flex-row gap-4 items-center mt-6">
              <Text className="text-lg">Select Floor</Text>
              <Select className="w-[150px]" onValueChange={(value) => setFloor(value)}>
                <SelectTrigger>
                  <SelectInput placeholder="Select Floor" className="flex-1 my-3 px-2" />
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
                <Text className="text-2xl">Select floor for attendance</Text>
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