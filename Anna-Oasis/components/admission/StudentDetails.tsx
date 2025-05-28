import React from "react";
import TextField from "@/components/form/TextField";
import SelectField from "@/components/form/SelectField";
import RadioField from "@/components/form/RadioField";
import { useFormikContext } from "formik";
import { View, TextInput, Text, Pressable } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Departments, semesters } from "@/constants/admission"

const StudentDetails = () => {
  const { setFieldValue, values } = useFormikContext<any>();
  const [showPicker, setShowPicker] = useState(false);

  return (
    <>
      <TextField label="Name" value="name" placeholder="Enter name" />
      <TextField label="Roll No" value="rollNo" placeholder="Roll number" />
      <SelectField label="Course" value="course" options={[{ label: "B.Tech", value: "B.Tech" }, { label: "M.Tech", value: "M.Tech" }]} />
      <SelectField label="Branch" value="branch" options={Departments} />
      <SelectField label="Semester" value="semester" options={semesters} />

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
      <TextField label="Mobile" value="mobile" placeholder="Mobile Number" />
      <TextField label="Email" value="email" placeholder="Email" />
      <SelectField label="Admission Category" value="admissionCategory" options={[{ label: "NRI", value: "NRI" }, { label: "General", value: "General" }]} />
      <TextField label="Blood Group" value="bloodGroup" placeholder="e.g. B+" />
      <TextField label="Medical History" value="medicalHistory" placeholder="Optional" />
      <RadioField label="Previous Resident" value="previousResident" options={[{ label: "Yes", value: "yes" }, { label: "No", value: "no" }]} />
    </>
  );
};

export default StudentDetails;
