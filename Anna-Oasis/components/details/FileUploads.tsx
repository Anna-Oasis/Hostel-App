import ImagePickerField from "@/components/form/ImagePickerField";

const FileUploads = () => (
  <>
    <ImagePickerField label="Passport Photo" value="passportPhoto" placeholder="Upload" />
    <ImagePickerField label="Student Signature" value="studentSignature" placeholder="Upload" />
    <ImagePickerField label="Parent/Guardian Signature" value="parentGuardianSignature" placeholder="Upload" />
    <ImagePickerField label="Passport" value="passport" placeholder="Upload" />
    <ImagePickerField label="Aadhaar Card" value="aadhaar" placeholder="Upload" />
    <ImagePickerField label="Admission Slip" value="admissionSlip" placeholder="Upload" />
  </>
);

export default FileUploads;
