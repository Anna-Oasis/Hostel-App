import { useState } from "react";
import ImagePickerField from "@/components/form/ImagePickerField";
import SelectField from "@/components/form/SelectField";
import TextField from "@/components/form/TextField";
import RadioField from "@/components/form/RadioField";
import { useFormikContext } from "formik";
import { govtIdTypes } from "@/constants/details";
import { View } from "react-native";

const FileUploads = () => {
  const { values } = useFormikContext<any>();

  return (
    <>
      <RadioField
        label="Are you a Foreign National?"
        value="isForeignNational"
        options={[
          { label: "Yes", value: "Yes" },
          { label: "No", value: "No" },
        ]}
      />

      {values.isForeignNational === "No" ? (
        <View>
          <SelectField
            label="Government ID Type"
            value="govtIdType"
            options={govtIdTypes}
          />
          <TextField
            label="Government ID Number"
            value="govtId"
            placeholder="Enter ID number"
          />
          <ImagePickerField
            label={`${values.govtIdType || "Government ID"} Document`}
            value="govtIdDocument"
            placeholder="Upload"
          />
        </View>
      ) : (
        <View>
          <TextField
            label="Passport Number"
            value="govtId"
            placeholder="Enter passport number"
          />
          <ImagePickerField
            label="Passport Document"
            value="govtIdDocument"
            placeholder="Upload"
          />
        </View>
      ) }

      <ImagePickerField label="Passport Photo" value="passportPhoto" placeholder="Upload" />
      <ImagePickerField label="Student Signature" value="studentSignature" placeholder="Upload" />
      <ImagePickerField label="Parent/Guardian Signature" value="parentGuardianSignature" placeholder="Upload" />
      <ImagePickerField label="Aadhaar Card" value="aadhaar" placeholder="Upload" />
      <ImagePickerField label="Admission Slip" value="admissionSlip" placeholder="Upload" />
    </>
  );
};

export default FileUploads;
