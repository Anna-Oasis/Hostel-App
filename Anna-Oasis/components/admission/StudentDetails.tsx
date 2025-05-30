import TextField from "@/components/form/TextField";
import SelectField from "@/components/form/SelectField";
import RadioField from "@/components/form/RadioField";
import { useFormikContext } from "formik";
import { View, TextInput, Text, Pressable } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Departments, semesters, admissionCategories, bloodGroups, hostelBlocks, courses } from "@/constants/admission"

const StudentDetails = () => {
  const { setFieldValue, values } = useFormikContext<any>();
  const [showPicker, setShowPicker] = useState(false);

  return (
    <>
      <TextField label="Name" value="name" placeholder="Enter name" />
      <TextField label="Roll No" value="rollNo" placeholder="Roll number" />
      <SelectField label="Course" value="course" options={courses} />
      <SelectField label="Branch" value="branch" options={Departments} />
      <SelectField label="Semester" value="semester" options={semesters} />

      <TextField label="Mobile (with country code)" value="mobile" placeholder="Mobile Number" />
      <TextField label="Email" value="email" placeholder="Email" />
      <TextField label="Emergency Contact Number" value="emergencyContact" placeholder="Emergency Contact Number" />

      <View>
        <Text className="mb-1 font-medium text-sm text-gray-800">Date of Birth</Text>
        <Pressable onPress={() => setShowPicker(true)}>
          <TextInput
            value={values.dateOfBirth}
            placeholder="YYYY-MM-DD"
            onChangeText={(val) => setFieldValue("dateOfBirth", val)}
            className="border px-2 py-1 rounded-md border-gray-400"
          />
        </Pressable>
        {showPicker && (
          <DateTimePicker
            mode="date"
            display="default"
            value={values.dateOfBirth ? new Date(values.dateOfBirth) : new Date()}
            onChange={(event: any, selectedDate: Date | undefined) => {
              setShowPicker(false);
              if (selectedDate) {
                const formatted = selectedDate.toISOString().split("T")[0];
                setFieldValue("dateOfBirth", formatted);
              }
            }}
          />
        )}
      </View>

      <TextField label="Age" value="age" placeholder="Age" />
      <TextField label="Nationality" value="nationality" placeholder="Nationality" />
      <TextField label="Passport ID/Govt ID no" value="govtId" placeholder="Passport ID or Govt ID number" />
      <SelectField label="Admission Category" value="admissionCategory" options={admissionCategories} />
      <SelectField label="Blood Group" value="bloodGroup" options={bloodGroups} />
      <SelectField label="Hostel Block" value="hostelBlock" options={hostelBlocks} />
      <TextField label="Medical History" value="medicalHistory" placeholder="Optional" />
      <RadioField
        label="Have you ever been a resident of this hostel?"
        value="previousResident"
        options={[
          { label: "Yes", value: "true" },
          { label: "No", value: "false" }
        ]}
      />
      <SelectField
        label="Mess Preference"
        value="messPreference"
        options={[
          { label: "Veg", value: "veg" },
          { label: "Non-Veg", value: "nonveg" }
        ]}
      />
    </>
  );
};

export default StudentDetails;
