import React from "react";
import CheckBoxField from "@/components/form/CheckBoxField";
import ImagePickerField from "@/components/form/ImagePickerField";

const HostelMessDeclaration = () => (
  <>
    <CheckBoxField label="Declaration" value="declaration" options={[
      { label: "I (Student) agree to abide by hostel rules", value: "studentAgreed" },
      { label: "I (Parent/Guardian) agree to abide by hostel rules", value: "parentAgreed" },
    ]} />
  </>
);

export default HostelMessDeclaration;