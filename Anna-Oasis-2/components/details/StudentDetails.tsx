import TextField from "@/components/form/TextField";
import SelectField from "@/components/form/SelectField";
import SearchableSelectField from "@/components/form/SearchableSelectField";
import DatePickerField from "@/components/form/DatePickerField";
import RadioField from "@/components/form/RadioField";
import PhoneInputField from "@/components/form/PhoneInputField";
import {
  Departments,
  semesters,
  bloodGroups,
  ugCourses,
  pgCourses,
  ugBranches,
  pgBranches,
} from "@/constants/details";
import nationalities from "@/constants/nationalities";
import HelperText from "@/components/HelperText";
import useUserStore from "@/stores/userStore";
import { Text } from "@/components/ui/text";
import { Divider } from "@/components/ui/divider";
import { admissionCategories } from "@/constants/admission";
import { useFormikContext } from "formik";
import { View } from "react-native";

interface StudentFormValues {
  name: string;
  rollNo?: string;
  courseType: string;
  course: string;
  branch: string;
  semester: string;
  mobile: string;
  email: string;
  emergencyContact: string;
  dateOfBirth: string;
  age: string;
  gender: string;
  nationality: string;
  admissionCategory: string;
  admissionCategoryReason?: string;
  bloodGroup: string;
  medicalHistory?: string;
}

const StudentDetails = () => {
  const details = useUserStore((state) => state.details);
  const { values } = useFormikContext<StudentFormValues>();

  // Get available courses based on courseType
  const getAvailableCourses = () => {
    if (values.courseType === "UG") return ugCourses;
    if (values.courseType === "PG") return pgCourses;
    return [];
  };

  // Get available branches based on courseType and course
  const getAvailableBranches = () => {
    if (values.courseType === "UG" && values.course) {
      return ugBranches[values.course as keyof typeof ugBranches] || [];
    }
    if (values.courseType === "PG" && values.course) {
      return pgBranches[values.course as keyof typeof pgBranches] || [];
    }
    return [];
  };

  return (
    <View>
      <Text className="text-2xl font-bold text-center mb-2 mt-2">
        {details
          ? "Update Your Personal Details"
          : "Enter Your Personal Details"}
      </Text>
      <Divider className="mb-6" />

      {/* Academic Details */}
      <View className="bg-white rounded-xl shadow p-4 mb-6">
        <Text className="text-lg font-semibold mb-2 text-gray-800 text-center">
          Academic Details
        </Text>
        <Divider className="mb-3" />
        <TextField label="Name" value="name" placeholder="Enter name" />
        {!details && (
          <>
            <TextField
              label="Roll No"
              value="rollNo"
              placeholder="Roll number"
            />
            <HelperText>
              Note: You cannot change your roll number once submitted. It will
              be linked with your account
            </HelperText>
          </>
        )}
        <RadioField
          label="Course Type"
          value="courseType"
          options={[
            { label: "Undergraduate (UG)", value: "UG" },
            { label: "Postgraduate (PG)", value: "PG" },
          ]}
        />
        {values.courseType && (
          <SelectField
            label="Course"
            value="course"
            options={getAvailableCourses()}
          />
        )}
        {values.course && (
          <SelectField
            label="Branch"
            value="branch"
            options={getAvailableBranches()}
          />
        )}
        <SelectField label="Semester" value="semester" options={semesters} />
      </View>

      {/* Contact Details */}
      <View className="bg-white rounded-xl shadow p-4 mb-6">
        <Text className="text-lg font-semibold mb-2 text-gray-800 text-center">
          Contact Details
        </Text>
        <Divider className="mb-3" />
        <PhoneInputField
          label="Mobile"
          value="mobile"
          placeholder="Phone number"
        />
        <TextField label="Email" value="email" placeholder="Email" />
        <PhoneInputField
          label="Emergency Contact Number"
          value="emergencyContact"
          placeholder="Emergency contact"
        />
      </View>

      {/* Personal Details */}
      <View className="bg-white rounded-xl shadow p-4 mb-6">
        <Text className="text-lg font-semibold mb-2 text-gray-800 text-center">
          Personal Details
        </Text>
        <Divider className="mb-3" />
        <DatePickerField
          label="Date of Birth"
          value="dateOfBirth"
          placeholder="YYYY-MM-DD"
        />
        <RadioField
          label="Gender"
          value="gender"
          options={[
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ]}
        />
        <SelectField
          label="Nationality"
          value="nationality"
          options={nationalities}
        />
        <SelectField
          label="Admission Category"
          value="admissionCategory"
          options={admissionCategories}
        />
        {values?.admissionCategory === "Other" && (
          <TextField
            label="Reason to join the hostel"
            value="admissionCategoryReason"
            placeholder="Please specify your reason"
          />
        )}
        <SelectField
          label="Blood Group"
          value="bloodGroup"
          options={bloodGroups}
        />
        <TextField
          label="Medical History (Type NIL if none)"
          value="medicalHistory"
          placeholder="Optional"
        />
      </View>
    </View>
  );
};

export default StudentDetails;
