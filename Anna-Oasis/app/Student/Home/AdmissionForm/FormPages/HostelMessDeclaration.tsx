import React from "react";
import TextField from "@/components/form/TextField";
import SelectField from "@/components/form/SelectField";
import RadioField from "@/components/form/RadioField";
import CheckBoxField from "@/components/form/CheckBoxField";
import ImagePickerField from "@/components/form/ImagePickerField";

const HostelMessDeclaration = () => (
  <>
    <SelectField label="Hostel Block" value="hostelBlock" options={[{ label: "Flora", value: "Flora" }]} />
    <TextField label="Room Number" value="roomNumber" placeholder="Room number" />
    <RadioField label="Mess Preference" value="messPreference" options={[{ label: "Veg", value: "Vegetarian" }, { label: "Non-Veg", value: "Non Vegetarian" }]} />
    <CheckBoxField label="Declaration" value="declaration" options={[
      { label: "I (Student) agree to abide by hostel rules", value: "studentAgreed" },
      { label: "I (Parent/Guardian) agree to abide by hostel rules", value: "parentAgreed" },
    ]} />
    <ImagePickerField label="Passport Photo" value="passportPhoto" placeholder="Upload" />
    <ImagePickerField label="Student Signature" value="studentSignature" placeholder="Upload" />
    <ImagePickerField label="Parent/Guardian Signature" value="parentGuardianSignature" placeholder="Upload" />
  </>
);

export default HostelMessDeclaration;