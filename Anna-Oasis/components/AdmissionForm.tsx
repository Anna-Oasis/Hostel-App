import React from "react";
import { View } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import TextField from "@/components/form/TextField";
import { Button, ButtonText } from "@/components/ui/button";
import RadioField from "@/components/form/RadioField";
import CheckBoxField from "@/components/form/CheckBoxField";
import SelectField from "@/components/form/SelectField";

const AdmissionForm = () => {
  const validationSchema = Yup.object().shape({
    applicantName: Yup.string().required("Name is required"),
    course: Yup.string().required("Course is required"),
    branch: Yup.string().required("Branch is required"),
    semester: Yup.string().required("Semester is required"),
    mobile: Yup.string().required("Mobile number is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    parentName: Yup.string().required("Parent name is required"),
    parentMobile1: Yup.string().matches(/^[0-9]{10}$/, "Invalid mobile number").required("Parent's mobile number is required"),
    parentMobile2: Yup.string().matches(/^[0-9]{10}$/, "Invalid mobile number"),
    parentLandline: Yup.string().matches(/^[0-9]+$/, "Invalid landline number"),
    parentOccupation: Yup.string().required("Parent's occupation is required"),
    parentAddress: Yup.string().required("Parent's residential address is required"),
    parentPin: Yup.string().matches(/^[0-9]{6}$/, "PIN code must be 6 digits").required("PIN code is required"),
    guardianName: Yup.string(),
    guardianOccupation: Yup.string().when("guardianName", {
      is: (val) => val && val.length > 0,
      then: (schema) => schema.required("Guardian's occupation is required"),
    }),
    guardianAddress: Yup.string().when("guardianName", {
      is: (val) => val && val.length > 0,
      then: (schema) => schema.required("Guardian's address is required"),
    }),
    guardianPin: Yup.string().when("guardianName", {
      is: (val) => val && val.length > 0,
      then: (schema) => schema.matches(/^[0-9]{6}$/, "PIN code must be 6 digits").required("PIN code is required"),
    }),
    guardianMobile1: Yup.string().when("guardianName", {
      is: (val) => val && val.length > 0,
      then: (schema) => schema.matches(/^[0-9]{10}$/, "Invalid mobile number"),
    }),
    guardianMobile2: Yup.string().when("guardianName", {
      is: (val) => val && val.length > 0,
      then: (schema) => schema.matches(/^[0-9]{10}$/, "Invalid mobile number"),
    }),
    guardianLandline: Yup.string().when("guardianName", {
      is: (val) => val && val.length > 0,
      then: (schema) => schema.matches(/^[0-9]+$/, "Invalid landline number"),
    }),
    previousResident: Yup.string().required("This field is required"),
    messPreference: Yup.string().required("Mess preference is required"),
    declaration: Yup.array().min(1, "You must accept the declaration"),
  });

  return (
    <Formik
      initialValues={{
        applicantName: "",
        course: "",
        branch: "",
        semester: "",
        mobile: "",
        email: "",
        parentName: "",
        parentMobile1: "",
        parentMobile2: "",
        parentLandline: "",
        parentOccupation: "",
        parentAddress: "",
        parentPin: "",
        guardianName: "",
        guardianOccupation: "",
        guardianAddress: "",
        guardianPin: "",
        guardianMobile1: "",
        guardianMobile2: "",
        guardianLandline: "",
        previousResident: "",
        messPreference: "",
        declaration: [],
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({ handleChange, handleSubmit, values, errors, touched }) => (
        <View>
          <TextField placeholder="Name of the Applicant" value="applicantName" />
          <SelectField value="course" options={[{ label: "B.Tech", value: "btech" }, { label: "M.Tech", value: "mtech" }]} />
          <SelectField value="branch" options={[{ label: "CSE", value: "cse" }, { label: "ECE", value: "ece" }, { label: "Mechanical", value: "mechanical" }]} />
          <SelectField value="semester" options={[{ label: "1st", value: "1" }, { label: "2nd", value: "2" }, { label: "3rd", value: "3" }, { label: "4th", value: "4" }]} />
          <TextField placeholder="Mobile No." value="mobile" />
          <TextField placeholder="E-mail" value="email" />
          <TextField placeholder="Name of Parent" value="parentName" />
          <TextField placeholder="Parent's Mobile No. (1)" value="parentMobile1" />
          <TextField placeholder="Parent's Mobile No. (2)" value="parentMobile2" />
          <TextField placeholder="Parent's Landline" value="parentLandline" />
          <TextField placeholder="Parent's Occupation" value="parentOccupation" />
          <TextField placeholder="Parent's Residential Address" value="parentAddress" />
          <TextField placeholder="Parent's PIN Code" value="parentPin" keyboardType="numeric" />
          <TextField placeholder="Name of Local Guardian (if any)" value="guardianName" />
          <TextField placeholder="Guardian's Occupation" value="guardianOccupation" />
          <TextField placeholder="Guardian's Residential Address" value="guardianAddress" />
          <TextField placeholder="Guardian's PIN Code" value="guardianPin" keyboardType="numeric" />
          <TextField placeholder="Guardian's Mobile No. (1)" value="guardianMobile1" />
          <TextField placeholder="Guardian's Mobile No. (2)" value="guardianMobile2" />
          <TextField placeholder="Guardian's Landline" value="guardianLandline" />
          <RadioField value="previousResident" options={[{ label: "Yes", value: "yes" }, { label: "No", value: "no" }]} />
          <RadioField value="messPreference" options={[{ label: "Vegetarian", value: "vegetarian" }, { label: "Non Vegetarian", value: "non_vegetarian" }]} />
          <CheckBoxField value="declaration" options={[{ label: "I agree to abide by the hostel rules", value: "accepted" }]} />
          <Button onPress={() => handleSubmit()}>
            <ButtonText>Submit</ButtonText>
          </Button>
        </View>
      )}
    </Formik>
  );
};

export default AdmissionForm;
