import TextField from "@/components/form/TextField";
import SelectField from "@/components/form/SelectField";
import DatePickerField from "@/components/form/DatePickerField";
import RadioField from "@/components/form/RadioField";
import PhoneInputField from "@/components/form/PhoneInputField";
import {
  Departments,
  semesters,
  bloodGroups,
  courses,
} from "@/constants/details";
import nationalities from "@/constants/nationalities";
import HelperText from "@/components/HelperText";
import useUserStore from "@/stores/userStore";
import { Text } from "@/components/ui/text";
import { Divider } from "@/components/ui/divider";
import { admissionCategories } from "@/constants/admission";
import { useFormikContext } from "formik";

interface StudentFormValues {
  name: string;
  rollNo?: string;
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

  return (
    <>
      {/* Academic Details */}
      <Text className="text-base font-semibold mb-2 mt-2">Academic Details</Text>
      <Divider className="mb-3" />
      <TextField label="Name" value="name" placeholder="Enter name" />
      {!details && (
        <>
          <TextField label="Roll No" value="rollNo" placeholder="Roll number" />
          <HelperText>
            Note: You cannot change your roll number once submitted. It will be
            linked with your account
          </HelperText>
        </>
      )}
      <SelectField label="Course" value="course" options={courses} />
      <SelectField label="Branch" value="branch" options={Departments} />
      <SelectField label="Semester" value="semester" options={semesters} />

      <Divider className="my-4" />

      {/* Contact Details */}
      <Text className="text-base font-semibold mb-2 mt-2">Contact Details</Text>
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

      <Divider className="my-4" />

      {/* Personal Details */}
      <Text className="text-base font-semibold mb-2 mt-2">Personal Details</Text>
      <Divider className="mb-3" />
      <DatePickerField
        label="Date of Birth"
        value="dateOfBirth"
        placeholder="YYYY-MM-DD"
      />
      <TextField label="Age" value="age" placeholder="Age" />
      <RadioField
        label="Gender"
        value="gender"
        options={[
          { label: "Male", value: "male" },
          { label: "Female", value: "female" },
          { label: "Other", value: "other" },
        ]}
      />
      <SelectField
        label="Nationality"
        value="nationality"
        options={nationalities}
      />
      <SelectField label="Admission Category" value="admissionCategory" options={admissionCategories} />
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
    </>
  );
};

export default StudentDetails;
