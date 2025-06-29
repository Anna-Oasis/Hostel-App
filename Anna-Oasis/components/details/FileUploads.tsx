import { useEffect } from "react";
import { useFormikContext } from "formik";
import ImagePickerField from "@/components/form/ImagePickerField";
import SelectField from "@/components/form/SelectField";
import TextField from "@/components/form/TextField";
import SwitchField from "@/components/form/SwitchField";
import { govtIdTypes } from "@/constants/details";
import { View } from "react-native";
import useUserStore from "@/stores/userStore";
import { Text } from "@/components/ui/text";
import { Divider } from "@/components/ui/divider";

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
      <Text className="text-2xl font-bold text-center mb-2 mt-2">Document Uploads</Text>
      <Divider className="mb-6" />

      {!details && (
        <View className="items-center mb-6">
          <SwitchField
            label="Are you a Foreign National?"
            value="isForeignNational"
            checkedValue="Yes"
            uncheckedValue="No"
          />
        </View>
      )}

      <Divider className="my-4" />

      {values.isForeignNational === "No" ? (
        <View className="bg-white rounded-xl shadow p-4 mb-6">
          <Text className="text-lg font-semibold mb-2 text-gray-800 text-center">Indian Students</Text>
          <Divider className="mb-3" />
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
        <View className="bg-white rounded-xl shadow p-4 mb-6">
          <Text className="text-lg font-semibold mb-2 text-gray-800 text-center">Foreign Nationals</Text>
          <Divider className="mb-3" />
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

      <Divider className="my-4" />

      <View className="bg-white rounded-xl shadow p-4">
        <Text className="text-lg font-semibold mb-2 text-gray-800 text-center">Other Required Documents</Text>
        <Divider className="mb-3" />
        <ImagePickerField label="Passport Photo" value="passportPhotoUrl" placeholder="Upload" />
        <ImagePickerField label="Student Signature" value="studentSignatureUrl" placeholder="Upload" />
        <ImagePickerField label="Parent/Guardian Signature" value="parentGuardianSignatureUrl" placeholder="Upload" />
        <ImagePickerField label="Admission Slip" value="admissionSlipUrl" placeholder="Upload" />
      </View>
    </>
  );
};

export default FileUploads;

