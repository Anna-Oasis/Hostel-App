import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import TextField from "@/components/form/TextField";
import { Button, ButtonText } from "@/components/ui/button";
import RadioField from "@/components/form/RadioField";
import CheckBoxField from "@/components/form/CheckBoxField";
import SelectField from "@/components/form/SelectField";
import ImagePickerField from "@/components/form/ImagePickerField";

const initialValues = {
  // Student Details
  name: "",
  rollNo: "",
  course: "",
  branch: "",
  semester: "",
  dateOfBirth: "",
  age: "",
  mobile: "",
  email: "",
  admissionCategory: "",
  bloodGroup: "",
  medicalHistory: "",
  previousResident: "",
  // Parent Details
  fatherName: "",
  fatherContactLocal: "",
  fatherContactForeign: "",
  motherName: "",
  motherContactLocal: "",
  landline: "",
  parentEmail: "",
  occupation: "",
  residentialAddress: "",
  pin: "",
  // Local Guardian
  guardianName: "",
  guardianOccupation: "",
  guardianResidentialAddress: "",
  guardianPin: "",
  guardianMobile: "",
  guardianLandline: "",
  guardianEmail: "",
  // Hostel/Mess/Declaration
  hostelBlock: "",
  roomNumber: "",
  messPreference: "",
  declaration: [] as string[],
  // Images
  passportPhoto: "",
  studentSignature: "",
  parentGuardianSignature: "",
};

const validationSchemas = [
  // Page 1: Student Details
  Yup.object().shape({
    name: Yup.string().required("Required"),
    rollNo: Yup.string().required("Required"),
    course: Yup.string().required("Required"),
    branch: Yup.string().required("Required"),
    semester: Yup.string().required("Required"),
    dateOfBirth: Yup.string().required("Required"),
    age: Yup.number().required("Required"),
    mobile: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    admissionCategory: Yup.string().required("Required"),
    bloodGroup: Yup.string().required("Required"),
    medicalHistory: Yup.string().required("Required"),
    previousResident: Yup.string().required("Required"),
  }),
  // Page 2: Parent Details
  Yup.object().shape({
    fatherName: Yup.string().required("Required"),
    fatherContactLocal: Yup.string().required("Required"),
    fatherContactForeign: Yup.string(),
    motherName: Yup.string().required("Required"),
    motherContactLocal: Yup.string().required("Required"),
    landline: Yup.string(),
    parentEmail: Yup.string().email("Invalid email").required("Required"),
    occupation: Yup.string().required("Required"),
    residentialAddress: Yup.string().required("Required"),
    pin: Yup.string().required("Required"),
  }),
  // Page 3: Local Guardian (optional)
  Yup.object().shape({}),
  // Page 4: Hostel/Mess/Declaration
  Yup.object().shape({
    hostelBlock: Yup.string().required("Required"),
    roomNumber: Yup.string().required("Required"),
    messPreference: Yup.string().required("Required"),
    declaration: Yup.array().min(1, "You must accept the declaration"),
    passportPhoto: Yup.string().required("Required"),
    studentSignature: Yup.string().required("Required"),
    parentGuardianSignature: Yup.string().required("Required"),
  }),
];

const AdmissionForm = () => {
  const [page, setPage] = useState(0);

  const next = () => setPage((p) => p + 1);
  const prev = () => setPage((p) => p - 1);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchemas[page]}
      // ...existing code...
      onSubmit={(values) => {
        if (page < 3) {
          next();
        } else {
          // Transform flat values to nested JSON
          const output = {
            studentDetails: {
              name: values.name,
              rollNo: values.rollNo,
              course: values.course,
              branch: values.branch,
              semester: values.semester,
              dateOfBirth: values.dateOfBirth,
              age: Number(values.age),
              mobile: values.mobile,
              email: values.email,
              admissionCategory: values.admissionCategory,
              bloodGroup: values.bloodGroup,
              medicalHistory: values.medicalHistory,
              previousResident:
                values.previousResident === "yes" ? true : false,
            },
            parentDetails: {
              fatherName: values.fatherName,
              fatherContact: {
                local: values.fatherContactLocal,
                foreign: values.fatherContactForeign,
              },
              motherName: values.motherName,
              motherContact: {
                local: values.motherContactLocal,
              },
              landline: values.landline,
              email: values.parentEmail,
              occupation: values.occupation,
              residentialAddress: values.residentialAddress,
              pin: values.pin,
            },
            localGuardian: {
              name: values.guardianName,
              occupation: values.guardianOccupation,
              residentialAddress: values.guardianResidentialAddress,
              pin: values.guardianPin,
              mobile: values.guardianMobile,
              landline: values.guardianLandline,
              email: values.guardianEmail,
            },
            images: {
              passportPhoto: values.passportPhoto,
              studentSignature: values.studentSignature,
              parentGuardianSignature: values.parentGuardianSignature,
            },
            hostelBlock: values.hostelBlock,
            roomNumber: values.roomNumber,
            messPreference: values.messPreference,
            declaration: {
              studentAgreed: values.declaration.includes("studentAgreed"),
              parentAgreed: values.declaration.includes("parentAgreed"),
            },
          };
          console.log(output);
        }
      }}
      // ...existing code...}
    >
      {({
        handleChange,
        handleSubmit,
        values,
        errors,
        touched,
        setFieldValue,
      }) => (
        <ScrollView>
          <View className="m-4 flex gap-3">
            {page === 0 && (
              <>
                <TextField
                  label="Name"
                  value="name"
                  placeholder="Enter your name"
                />
                <TextField
                  label="Roll No"
                  value="rollNo"
                  placeholder="Enter your roll number"
                />
                <SelectField
                  label="Course"
                  value="course"
                  options={[
                    { label: "B.Tech", value: "B.Tech" },
                    { label: "M.Tech", value: "M.Tech" },
                  ]}
                />
                <SelectField
                  label="Branch"
                  value="branch"
                  options={[{ label: "CSE", value: "Computer Science" }]}
                />
                <SelectField
                  label="Semester"
                  value="semester"
                  options={[
                    { label: "1", value: "1" },
                    { label: "2", value: "2" },
                  ]}
                />
                <TextField
                  label="Date of Birth"
                  value="dateOfBirth"
                  placeholder="YYYY-MM-DD"
                />
                <TextField
                  label="Age"
                  value="age"
                  keyboardType="numeric"
                  placeholder="Enter your age"
                />
                <TextField
                  label="Mobile"
                  value="mobile"
                  placeholder="Enter your mobile number"
                />
                <TextField
                  label="Email"
                  value="email"
                  placeholder="Enter your email"
                />
                <SelectField
                  label="Admission Category"
                  value="admissionCategory"
                  options={[
                    { label: "NRI", value: "NRI" },
                    { label: "General", value: "General" },
                  ]}
                />
                <TextField
                  label="Blood Group"
                  value="bloodGroup"
                  placeholder="Enter your blood group"
                />
                <TextField
                  label="Medical History"
                  value="medicalHistory"
                  placeholder="Enter any medical history"
                />
                <RadioField
                  label="Previous Resident"
                  value="previousResident"
                  options={[
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" },
                  ]}
                />
              </>
            )}
            {page === 1 && (
              <>
                <TextField
                  label="Father's Name"
                  value="fatherName"
                  placeholder="Enter father's name"
                />
                <TextField
                  label="Father's Contact (Local)"
                  value="fatherContactLocal"
                  placeholder="Enter father's local contact"
                />
                <TextField
                  label="Father's Contact (Foreign)"
                  value="fatherContactForeign"
                  placeholder="Enter father's foreign contact"
                />
                <TextField
                  label="Mother's Name"
                  value="motherName"
                  placeholder="Enter mother's name"
                />
                <TextField
                  label="Mother's Contact (Local)"
                  value="motherContactLocal"
                  placeholder="Enter mother's local contact"
                />
                <TextField
                  label="Landline"
                  value="landline"
                  placeholder="Enter landline number"
                />
                <TextField
                  label="Parent Email"
                  value="parentEmail"
                  placeholder="Enter parent email"
                />
                <TextField
                  label="Occupation"
                  value="occupation"
                  placeholder="Enter occupation"
                />
                <TextField
                  label="Residential Address"
                  value="residentialAddress"
                  placeholder="Enter residential address"
                />
                <TextField
                  label="PIN"
                  value="pin"
                  placeholder="Enter PIN code"
                />
              </>
            )}
            {page === 2 && (
              <>
                <TextField
                  label="Guardian Name"
                  value="guardianName"
                  placeholder="Enter guardian name"
                />
                <TextField
                  label="Guardian Occupation"
                  value="guardianOccupation"
                  placeholder="Enter guardian occupation"
                />
                <TextField
                  label="Guardian Residential Address"
                  value="guardianResidentialAddress"
                  placeholder="Enter guardian residential address"
                />
                <TextField
                  label="Guardian PIN"
                  value="guardianPin"
                  placeholder="Enter guardian PIN"
                />
                <TextField
                  label="Guardian Mobile"
                  value="guardianMobile"
                  placeholder="Enter guardian mobile"
                />
                <TextField
                  label="Guardian Landline"
                  value="guardianLandline"
                  placeholder="Enter guardian landline"
                />
                <TextField
                  label="Guardian Email"
                  value="guardianEmail"
                  placeholder="Enter guardian email"
                />
                <Button onPress={next}>
                  <ButtonText>Skip</ButtonText>
                </Button>
              </>
            )}
            {page === 3 && (
              <>
                <TextField
                  label="Room Number"
                  value="roomNumber"
                  placeholder="Enter room number"
                />
                <SelectField
                  label="Hostel Block"
                  value="hostelBlock"
                  options={[{ label: "Flora", value: "Flora" }]}
                />
                <RadioField
                  label="Mess Preference"
                  value="messPreference"
                  options={[
                    { label: "Vegetarian", value: "Vegetarian" },
                    { label: "Non Vegetarian", value: "Non Vegetarian" },
                  ]}
                />
                <CheckBoxField
                  label="Declaration"
                  value="declaration"
                  options={[
                    {
                      label: "I (Student) agree to abide by the hostel rules",
                      value: "studentAgreed",
                    },
                    {
                      label:
                        "I (Parent/Guardian) agree to abide by the hostel rules",
                      value: "parentAgreed",
                    },
                  ]}
                />
                <ImagePickerField
                  label="Passport Photo"
                  value="passportPhoto"
                  placeholder="Upload passport photo"
                />
                <ImagePickerField
                  label="Student Signature"
                  value="studentSignature"
                  placeholder="Upload student signature"
                />
                <ImagePickerField
                  label="Parent/Guardian Signature"
                  value="parentGuardianSignature"
                  placeholder="Upload parent/guardian signature"
                />
                {/* Add image upload fields here */}
              </>
            )}
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              {page > 0 && (
                <Button onPress={prev}>
                  <ButtonText>Back</ButtonText>
                </Button>
              )}
              <Button onPress={() => handleSubmit()}>
                <ButtonText>{page === 3 ? "Submit" : "Next"}</ButtonText>
              </Button>
            </View>
          </View>
        </ScrollView>
      )}
    </Formik>
  );
};

export default AdmissionForm;
