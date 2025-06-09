import TextField from "@/components/form/TextField";
import SelectField from "@/components/form/SelectField";
import DatePickerField from "@/components/form/DatePickerField";
import RadioField from "@/components/form/RadioField";
import { useFormikContext } from "formik";
import { Departments, semesters, bloodGroups, courses } from "@/constants/details"

const StudentDetails = () => {
  const { setFieldValue, values } = useFormikContext<any>();

  return (
    <>
      <TextField label="Name" value="name" placeholder="Enter name" />
      <TextField label="Roll No" value="rollNo" placeholder="Roll number" />
      <SelectField label="Course" value="course" options={courses} />
      <SelectField label="Branch" value="branch" options={Departments} />
      <SelectField label="Semester" value="semester" options={semesters} />

      <TextField label="Mobile (with country code)" value="mobile" placeholder="Eg: +917676767676" />
      <TextField label="Email" value="email" placeholder="Email" />
      <TextField label="Emergency Contact Number" value="emergencyContact" placeholder="Emergency Contact Number" />

      <DatePickerField label="Date of Birth" value="dateOfBirth" placeholder="YYYY-MM-DD" />
      <TextField label="Age" value="age" placeholder="Age" />
      <RadioField 
        label="Gender" 
        value="gender" 
        options={[
          { label: "Male", value: "Male" },
          { label: "Female", value: "Female" },
          { label: "Other", value: "Other" }
        ]} 
      />
      <TextField label="Nationality" value="nationality" placeholder="Nationality" />
      <SelectField label="Blood Group" value="bloodGroup" options={bloodGroups} />
      <TextField label="Medical History" value="medicalHistory" placeholder="Optional" />
    </>
  );
};

export default StudentDetails;
