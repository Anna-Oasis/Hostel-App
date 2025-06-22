import { useEffect } from "react";
import { useFormikContext } from "formik";
import ImagePickerField from "@/components/form/ImagePickerField";
import SelectField from "@/components/form/SelectField";
import TextField from "@/components/form/TextField";
import RadioField from "@/components/form/RadioField";
import { govtIdTypes } from "@/constants/details";
import { View } from "react-native";
import useUserStore from "@/stores/userStore";

const FileUploads = () => {
  const { values, setFieldValue } = useFormikContext<any>();
  const details = useUserStore((state) => state.details);

  useEffect(() => {
    if (details) {
      const isForeign = details.govtIdType === "Passport" ? "Yes" : "No";
      setFieldValue("isForeignNational", isForeign);
    } else {
      if (values.isForeignNational === undefined) {
        setFieldValue("isForeignNational", "No");
      }
    }
  }, [details, setFieldValue, values.isForeignNational, details?.govtIdType]);

  return (
    <>
      {!details && (
        <RadioField
          label="Are you a Foreign National?"
          value="isForeignNational"
          options={[
            { label: "Yes", value: "Yes" },
            { label: "No", value: "No" },
          ]}
        />
      )}

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
            value="categoryProofUrl"
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
            value="categoryProofUrl"
            placeholder="Upload"
          />
        </View>
      )}

      <ImagePickerField label="Passport Photo" value="passportPhotoUrl" placeholder="Upload" />
      <ImagePickerField label="Student Signature" value="studentSignatureUrl" placeholder="Upload" />
      <ImagePickerField label="Parent/Guardian Signature" value="parentGuardianSignatureUrl" placeholder="Upload" />
      <ImagePickerField label="Admission Slip" value="admissionSlipUrl" placeholder="Upload" />
    </>
  );
};

export default FileUploads;
