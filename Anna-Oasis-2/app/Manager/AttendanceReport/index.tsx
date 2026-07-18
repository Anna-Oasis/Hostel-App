import { useEffect, useMemo, useState } from "react";
import { ScrollView, TextInput, View } from "react-native";
import { Formik } from "formik";
import { AlertTriangle, Eye, FileWarning } from "lucide-react-native";
import DatePickerField from "@/components/form/DatePickerField";
import SelectField from "@/components/form/SelectField";
import EmptyPage from "@/components/EmptyPage";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Spinner } from "@/components/ui/spinner";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import { CloseIcon, Icon } from "@/components/ui/icon";
import { hostelBlocks } from "@/constants/admission";
import {
  managerAttendanceReportInitialValues,
  managerAttendanceReportValidationSchema,
} from "@/constants/validations/managerAttendanceReportValidation";
import { getAdmissionSessions } from "@/utils/manager/managerAdmissionApi";
import {
  AttendanceStatus,
  exportAttendance,
  getManagerAttendanceReport,
  getStudentSummary,
  ManagerAttendanceReportResponse,
  ManagerAttendanceReportStudent,
  ManagerAttendanceReportWarning,
} from "@/utils/manager/managerAttendanceReportApi";

type AdmissionSessionOption = {
  label: string;
  value: string;
};



const statusStyles: Record<AttendanceStatus, string> = {
  PRESENT: "bg-green-100 text-green-800",
  ABSENT: "bg-red-100 text-red-800",
  NOT_MARKED: "bg-gray-100 text-gray-700",
  CONFLICT: "bg-amber-100 text-amber-800",
};

const missingStatusStyle = "bg-gray-100 text-gray-700";

const formatDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });


const getWarningText = (warning: ManagerAttendanceReportWarning) => {
  if (warning.code === "DUPLICATE_ATTENDANCE_RECORDS") {
    return `Duplicate attendance records on ${warning.date} for ${warning.hostel}, floor ${warning.floor}.`;
  }

  if (warning.code === "DUPLICATE_ELIGIBLE_STUDENT") {
    return `Duplicate admission rows found for ${warning.rollNo}.`;
  }

  if (warning.code === "UNKNOWN_ABSENTEE_ROLL_NUMBERS") {
    return `Unknown absentee roll numbers found in record ${warning.date}: ${
      warning.rollNumbers?.join(", ") || "not listed"
    }.`;
  }

  if (warning.code === "MISSING_STUDENT_ATTENDANCE_MAPPING") {
    return `Missing attendance mapping for ${warning.rollNo}: ${warning.reason}.`;
  }

  return warning.code;
};

const StatusPill = ({ status }: { status?: AttendanceStatus }) => (
  <Text
    className={`px-3 py-1 rounded-full text-xs font-semibold ${
      status ? statusStyles[status] : missingStatusStyle
    }`}
  >
    {status ? status.replace("_", " ") : "NOT RETURNED"}
  </Text>
);

export default function ManagerAttendanceReportPage() {
  const [sessionOptions, setSessionOptions] = useState<AdmissionSessionOption[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState("");
  const [report, setReport] = useState<ManagerAttendanceReportResponse | null>(
    null
  );
  const [selectedStudent, setSelectedStudent] =
    useState<ManagerAttendanceReportStudent | null>(null);
  
  const [searchRollNo, setSearchRollNo] = useState<string>("")

  const filteredStudents = useMemo(() => {
    if (!report) return [];

    const query = searchRollNo.trim().toLowerCase();

    const students = !query
      ? [...report.students]
      : report.students.filter(
          (student) =>
            student.rollNo.toLowerCase().includes(query) ||
            student.name.toLowerCase().includes(query)
        );

    return students.sort((a, b) => {
      const floorA = Number(a.floor ?? Number.MAX_SAFE_INTEGER);
      const floorB = Number(b.floor ?? Number.MAX_SAFE_INTEGER);

      if (floorA !== floorB) {
        return floorA - floorB;
      }

      const roomA = Number(a.roomNumber ?? Number.MAX_SAFE_INTEGER);
      const roomB = Number(b.roomNumber ?? Number.MAX_SAFE_INTEGER);

      return roomA - roomB;
    });
  }, [report, searchRollNo]);

  useEffect(() => {
    getAdmissionSessions()
      .then((sessions: { id: number; academic_year: string }[]) => {
        setSessionOptions(
          sessions.map((session) => ({
            label: session.academic_year,
            value: String(session.id),
          }))
        );
      })
      .catch(() => setSessionOptions([]))
      .finally(() => setSessionsLoading(false));
  }, []);

  const selectedStudentSummary = useMemo(
    () => (selectedStudent ? getStudentSummary(selectedStudent) : null),
    [selectedStudent]
  );

  if (sessionsLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Spinner size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="w-full sm:w-[80%] md:w-[55%] self-center">
          <View className="bg-white rounded-xl border border-gray-200 p-4 mb-4 shadow-sm">
            <Text className="text-xl font-bold mb-1">Attendance Report</Text>
            <Text className="text-sm text-gray-500 mb-4">
              Select filters to generate a student-wise attendance summary.
            </Text>

            {sessionOptions.length === 0 ? (
              <EmptyPage
                title="No admission sessions found"
                description="Create an admission session before generating attendance reports."
              />
            ) : (
              <Formik
                initialValues={managerAttendanceReportInitialValues}
                validationSchema={managerAttendanceReportValidationSchema}
                onSubmit={async (values) => {
                  setReportLoading(true);
                  setReportError("");
                  try {
                    const data = await getManagerAttendanceReport({
                      fromDate: values.fromDate,
                      toDate: values.toDate,
                      admissionSessionId: Number(values.admissionSessionId),
                      hostelBlock: values.hostelBlock,
                    });
                    setReport(data);
                  } catch (error: unknown) {
                    const apiError = error as {
                      response?: { data?: { message?: string } };
                      message?: string;
                    };
                    setReportError(
                      apiError.response?.data?.message ||
                        apiError.message ||
                        "Unable to generate attendance report"
                    );
                  } finally {
                    setReportLoading(false);
                  }
                }}
              >
                {({ handleSubmit, values }) => (
                  <View>
                    <View className="gap-3">
                      <DatePickerField label="From Date" value="fromDate" />
                      <DatePickerField
                        label="To Date"
                        value="toDate"
                        minimumDate={
                          values.fromDate
                            ? new Date(`${values.fromDate}T00:00:00`)
                            : undefined
                        }
                      />
                      <SelectField
                        label="Admission Session"
                        value="admissionSessionId"
                        options={sessionOptions}
                      />
                      <SelectField
                        label="Hostel Block"
                        value="hostelBlock"
                        options={hostelBlocks}
                      />
                    </View>
                    <Button
                      className="mt-5"
                      onPress={() => handleSubmit()}
                      isDisabled={reportLoading}
                    >
                      {reportLoading && <Spinner size="small" color="white" />}
                      <ButtonText className="ml-2">Get Report</ButtonText>
                    </Button>
                  </View>
                )}
              </Formik>
            )}
          </View>

          {reportError ? (
            <View className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <Text className="font-bold text-red-800 mb-1">
                Unable to Generate Report
              </Text>
              <Text className="text-red-700">{reportError}</Text>
            </View>
          ) : null}

          {report && (
            <>
              <View className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
                <Text className="font-bold text-lg mb-2">Report Summary</Text>
                <Text className="text-gray-700">
                  {formatDate(report.filters.fromDate)} to{" "}
                  {formatDate(report.filters.toDate)}
                </Text>
                <Text className="text-gray-700">
                  Academic Year: {report.filters.academicYear}
                </Text>
                <Text className="text-gray-700">
                  Hostel Block: {report.filters.hostelBlock}
                </Text>
                <View className="flex-row flex-wrap gap-3 mt-3">
                  <Text className="bg-blue-50 text-blue-800 px-3 py-2 rounded-lg">
                    Students: {report.summary.studentCount}
                  </Text>
                  <Text className="bg-blue-50 text-blue-800 px-3 py-2 rounded-lg">
                    Days: {report.summary.dateCount}
                  </Text>
                </View>

                <View>
                   <TextInput
                    placeholder="Search by Roll No"
                    value={searchRollNo}
                    onChangeText={setSearchRollNo}
                    className="border border-gray-300 rounded-lg px-4 py-3 mb-4 bg-white w-full sm:w-[80%] md:w-[50%] self-center m-4"
                  />
                </View>

                <View>
                  <Button
                      className="mt-5"
                      onPress={() => exportAttendance(filteredStudents, report)}
                    >
                      <ButtonText className="ml-2">Download Report</ButtonText>
                  </Button>
                </View>
              </View>

              {report.warnings.length > 0 && (
                <View className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                  <View className="flex-row items-center mb-2">
                    <Icon as={AlertTriangle} size="md" className="text-amber-700 mr-2" />
                    <Text className="font-bold text-amber-800">
                      Backend Warnings
                    </Text>
                  </View>
                  {report.warnings.map((warning, index) => (
                    <Text key={`${warning.code}-${index}`} className="text-amber-800 mb-1">
                      - {getWarningText(warning)}
                    </Text>
                  ))}
                </View>
              )}

              {report.students.length === 0 ? (
                <EmptyPage
                  icon={FileWarning}
                  title="No eligible students"
                  description="No finalized admissions matched the selected session and hostel block."
                />
              ) : (
                <View>
                  {filteredStudents.map((student) => {
                    const summary = getStudentSummary(student);
                    return (
                      <View
                        key={student.rollNo}
                        className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4"
                      >
                        <View className="flex-row justify-between items-start">
                          <View className="flex-1 pr-3">
                            <Text className="text-lg font-bold text-gray-900">
                              {student.name}
                            </Text>
                            <Text className="text-gray-600">
                              Roll No: {student.rollNo}
                            </Text>
                            <Text className="text-gray-600">
                              Room: {student.roomNumber ?? "Not assigned"} - Floor:{" "}
                              {student.floor ?? "Not assigned"}
                            </Text>
                          </View>
                          <Button
                            size="sm"
                            variant="outline"
                            onPress={() => setSelectedStudent(student)}
                          >
                            <ButtonIcon as={Eye} size="sm" />
                            <ButtonText className="ml-1">View</ButtonText>
                          </Button>
                        </View>
                        <View className="flex-row flex-wrap gap-2 mt-4">
                          <Text className="bg-green-100 text-green-800 px-3 py-2 rounded-lg">
                            Present: {summary.present}
                          </Text>
                          <Text className="bg-red-100 text-red-800 px-3 py-2 rounded-lg">
                            Absent: {summary.absent}
                          </Text>
                          <Text className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg">
                            Not Marked: {summary.notMarked}
                          </Text>
                          <Text className="bg-amber-100 text-amber-800 px-3 py-2 rounded-lg">
                            Conflict: {summary.conflict}
                          </Text>
                          <Text className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg">
                            Attendance: {summary.percentage}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>

      <Modal isOpen={!!selectedStudent} onClose={() => setSelectedStudent(null)}>
        <ModalBackdrop />
        <ModalContent className="w-[92%] max-w-[640px] max-h-[90%]">
          <ModalHeader>
            <Text className="text-lg font-bold">Daily Attendance</Text>
            <ModalCloseButton onPress={() => setSelectedStudent(null)}>
              <Icon as={CloseIcon} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            {selectedStudent && report && selectedStudentSummary && (
              <View>
                <View className="bg-gray-50 rounded-xl p-3 mb-4">
                  <Text className="font-bold text-gray-900">
                    {selectedStudent.name}
                  </Text>
                  <Text className="text-gray-600">
                    {selectedStudent.rollNo} - Room{" "}
                    {selectedStudent.roomNumber ?? "Not assigned"} - Floor{" "}
                    {selectedStudent.floor ?? "Not assigned"}
                  </Text>
                  <Text className="text-gray-600">
                    {selectedStudent.hostelBlock ?? "Hostel not assigned"} -{" "}
                    {formatDate(report.filters.fromDate)} to{" "}
                    {formatDate(report.filters.toDate)}
                  </Text>
                  <Text className="text-gray-700 mt-2">
                    Attendance: {selectedStudentSummary.percentage}
                  </Text>
                </View>

                <View className="flex-row flex-wrap gap-2 mb-3">
                  <StatusPill status="PRESENT" />
                  <StatusPill status="ABSENT" />
                  <StatusPill status="NOT_MARKED" />
                  <StatusPill status="CONFLICT" />
                </View>

                {report.dates.map((date) => (
                  <View
                    key={date}
                    className="flex-row justify-between items-center border-b border-gray-100 py-3"
                  >
                    <Text className="text-gray-800">{formatDate(date)}</Text>
                    <StatusPill status={selectedStudent.attendance[date]} />
                  </View>
                ))}
              </View>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onPress={() => setSelectedStudent(null)}>
              <ButtonText>Close</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </View>
  );
}
