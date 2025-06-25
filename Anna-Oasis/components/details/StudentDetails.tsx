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

const StudentDetails = () => {
  const details = useUserStore((state) => state.details);

  return (
    <>
      <HelperText>
        Note: You cannot change your roll number once submitted. It will be
        linked with your account
      </HelperText>
      <TextField label="Name" value="name" placeholder="Enter name" />
      {!details && (
        <>
          <TextField label="Roll No" value="rollNo" placeholder="Roll number" />
        </>
      )}
      <SelectField label="Course" value="course" options={courses} />
      <SelectField label="Branch" value="branch" options={Departments} />
      <SelectField label="Semester" value="semester" options={semesters} />

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
