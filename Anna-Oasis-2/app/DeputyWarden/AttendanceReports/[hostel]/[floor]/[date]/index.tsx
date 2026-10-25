import { getAllAttendanceRecordsByDate } from "@/utils/deputyWarden/dwAttendanceApi";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
} from "react-native";

type StudentDetails = {
  rollNo?: string;
  name?: string;
  roomNumber?: string | number;
  mobile?: string;
};

type AttendanceRecord = {
  id: number;
  date: string;
  hostel: string;
  floor: number;
  no_present: number;
  no_absent: number;
  no_leave: number;
  absentee: string[];
  onleave: string[];
  absentee_details: StudentDetails[];
  onleave_details: StudentDetails[];
};

const PRIMARY_COLOR = "#022B60";

export default function AttendanceReportsByDate() {
  const { date, hostel, floor } = useLocalSearchParams<{ date: string, hostel : string, floor : string }>();

  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!date) {
      setLoading(false);
      return;
    }

    setLoading(true);

    getAllAttendanceRecordsByDate(date, hostel, floor)
      .then((response) => setRecords(response))
      .catch((error) => {
        // console.error("Failed to fetch attendance:", error);
        setRecords([]);
      })
      .finally(() => setLoading(false));
  }, [date]);

  const sortByRoom = (students: StudentDetails[]) =>
    [...(students ?? [])].sort((a, b) =>
      String(a.roomNumber ?? "").localeCompare(
        String(b.roomNumber ?? ""),
        undefined,
        { numeric: true, sensitivity: "base" }
      )
    );

  const sortedRecords = [...records].sort(
    (a, b) => a.floor - b.floor
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


const renderStudent = (
  student: StudentDetails,
  index: number,
  type: "absent" | "leave"
) => (
  <View
    key={`${student.rollNo ?? "student"}-${index}`}
    className="mb-3 rounded-xl border border-slate-200 bg-white p-3"
  >
    {/* Roll Number - Name */}
    <View className="flex-row items-center justify-between gap-2">  
        <View>
          <Text className="flex-1 text-md font-bold text-slate-900">
            Name : {student.name ?? "N/A"}
          </Text>
          <Text className="flex-1 text-md font-bold text-slate-900">
              Roll Number : {student.roomNumber ?? "N/A"}
          </Text>
          <Text className="flex-1 text-md font-bold text-slate-900">
              Room Number : {student.roomNumber ?? "N/A"}
          </Text>
          <Text className="flex-1 text-md font-bold text-slate-900">
              Mobile : {student.mobile ?? "N/A"}
          </Text>
        </View>
        <View
            className={`rounded-md px-2 py-1 ${
            type === "absent" ? "bg-red-100" : "bg-amber-100"
            }`}
        >
            <Text
            className={`text-[10px] font-extrabold ${
                type === "absent" ? "text-red-700" : "text-amber-800"
            }`}
            >
            {type === "absent" ? "ABSENT" : "ON LEAVE"}
            </Text>
        </View>
    </View>
  </View>
);

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
    <ScrollView
      className="flex-1 bg-slate-50"
      contentContainerStyle={{ padding: 16, paddingBottom: 36 }}
    >

      {/* Floor-wise Reports */}
      {sortedRecords.length === 0 ? (
        <View className="items-center rounded-2xl border border-slate-200 bg-white p-6">
          <Text className="text-lg font-bold text-slate-700">
            No Attendance Records
          </Text>
          <Text className="mt-2 text-center text-sm text-slate-500">
            No attendance records were found for this date.
          </Text>
        </View>
      ) : (
        sortedRecords.map((record) => {
          const absentees = sortByRoom(record.absentee_details ?? []);
          const studentsOnLeave = sortByRoom(
            record.onleave_details ?? []
          );

          return (
            <View
              key={record.id}
              className="mb-5 overflow-hidden rounded-2xl border border-slate-200 bg-white"
            >
              {/* Floor Header */}
              <View className="flex-row items-center gap-4 border-b border-slate-200 bg-slate-100 px-4">
                <View>
                  <Text
                    className="text-xl font-extrabold"
                    style={{ color: PRIMARY_COLOR }}
                  >
                    {record.hostel} Hostel - {floorNumtoName(record.floor)} - ({new Date(record.date).toLocaleDateString("en-GB")})
                  </Text>
                </View>

                {/* <View className="items-center px-4 py-2">
                  <Text className="text-xl font-extrabold text-[#022B60]">
                    {record.no_present + record.no_absent + record.no_leave}
                  </Text>
                  <Text className="text-[11px] text-[#022B60]">
                    Students
                  </Text>
                </View> */}
              </View>

              {/* Floor Summary */}
              {/* <View className="flex-row border-b border-slate-200 p-4">
                <FloorCount
                  label="Present"
                  count={record.no_present}
                  textColor="text-green-700"
                />
                <FloorCount
                  label="Absent"
                  count={record.no_absent}
                  textColor="text-red-600"
                />
                <FloorCount
                  label="On Leave"
                  count={record.no_leave}
                  textColor="text-amber-700"
                />
              </View> */}

              {/* Absentees */}
              <View className="p-4">
                <View className="mb-3 flex-row items-center gap-4">
                  <Text className="text-base font-bold text-slate-900">
                    Absentees
                  </Text>
                  <View className="rounded-lg bg-red-100 px-3 py-1">
                    <Text className="text-sm font-extrabold text-red-700">
                      {record.no_absent}
                    </Text>
                  </View>
                </View>

                {absentees.length === 0 ? (
                  <Text className="py-3 text-sm text-slate-400">
                    No absent students.
                  </Text>
                ) : (
                  absentees.map((student, index) =>
                    renderStudent(student, index, "absent")
                  )
                )}
              </View>

              {/* Students On Leave */}
              {/* <View className="border-t border-slate-100 p-4">
                <View className="mb-3 flex-row items-center justify-between">
                  <Text className="text-base font-bold text-slate-900">
                    Students on Leave
                  </Text>
                  <View className="rounded-lg bg-amber-100 px-3 py-1">
                    <Text className="text-xs font-extrabold text-amber-800">
                      {record.no_leave}
                    </Text>
                  </View>
                </View>

                {studentsOnLeave.length === 0 ? (
                  <Text className="py-3 text-sm text-slate-400">
                    No students on leave.
                  </Text>
                ) : (
                  studentsOnLeave.map((student, index) =>
                    renderStudent(student, index, "leave")
                  )
                )}
              </View> */}
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

function SummaryCard({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: "green" | "red" | "amber";
}) {
  const styles = {
    green: {
      card: "border-green-200 bg-green-50",
      number: "text-green-700",
    },
    red: {
      card: "border-red-200 bg-red-50",
      number: "text-red-700",
    },
    amber: {
      card: "border-amber-200 bg-amber-50",
      number: "text-amber-700",
    },
  }[color];

  return (
    <View
      className={`flex-1 items-center rounded-xl border px-2 py-4 ${styles.card}`}
    >
      <Text className={`text-2xl font-extrabold ${styles.number}`}>
        {count}
      </Text>
      <Text className="mt-1 text-xs font-semibold text-slate-500">
        {label}
      </Text>
    </View>
  );
}

function FloorCount({
  label,
  count,
  textColor,
}: {
  label: string;
  count: number;
  textColor: string;
}) {
  return (
    <View className="flex-1 items-center">
      <Text className={`text-xl font-extrabold ${textColor}`}>
        {count}
      </Text>
      <Text className="mt-1 text-xs text-slate-500">{label}</Text>
    </View>
  );
}