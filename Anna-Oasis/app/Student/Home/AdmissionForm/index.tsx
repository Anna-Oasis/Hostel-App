import React from "react";
import { ScrollView, View } from "react-native";
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
        <ScrollView >
         <View className="m-4 flex gap-3"> 
          <TextField label="Name of the Applicant" placeholder="Name of the Applicant" value="applicantName" />
          <SelectField label="Course" value="course" options={[{ label: "B.Tech", value: "btech" }, { label: "M.Tech", value: "mtech" }]} />
          <SelectField label="Branch"  value="branch" options={[{ label: "CSE", value: "cse" }, { label: "ECE", value: "ece" }, { label: "Mechanical", value: "mechanical" }]} />
          <SelectField label="Semester" value="semester" options={[{ label: "1st", value: "1" }, { label: "2nd", value: "2" }, { label: "3rd", value: "3" }, { label: "4th", value: "4" }]} />
          <TextField label="Mobile No" placeholder="Mobile No." value="mobile" />
          <TextField label="E-mail" placeholder="E-mail" value="email" />
          <TextField label="Name of Parent" placeholder="Name of Parent" value="parentName" />
          <TextField label="Parent Mobile No. (1)" placeholder="Parent's Mobile No. (1)" value="parentMobile1" />
          <TextField label="Parent's Mobile No. (2)" placeholder="Parent's Mobile No. (2)" value="parentMobile2" />
          <TextField label="Parent's Landline" placeholder="Parent's Landline" value="parentLandline" />
          <TextField label="Parent's Occupation"  placeholder="Parent's Occupation" value="parentOccupation" />
          <TextField label="Parent's Residential Address"  placeholder="Parent's Residential Address" value="parentAddress" />
          <TextField label="Parent's PIN Code" placeholder="Parent's PIN Code" value="parentPin" keyboardType="numeric" />
          <TextField label="Name of the local guardian(if any) " placeholder="Name of Local Guardian (if any)" value="guardianName" />
          <TextField label="Guardian's Occupation" placeholder="Guardian's Occupation" value="guardianOccupation" />
          <TextField label="Guardian's Residential Address" placeholder="Guardian's Residential Address" value="guardianAddress" />
          <TextField  label="Guardians's PIN Code" placeholder="Guardian's PIN Code" value="guardianPin" keyboardType="numeric" />
          <TextField label="Guardian's Mobile No. (1)" placeholder="Guardian's Mobile No. (1)" value="guardianMobile1" />
          <TextField label="Guardian's Mobile No. (2)" placeholder="Guardian's Mobile No. (2)" value="guardianMobile2" />
          <TextField label="Guardian's Landline" placeholder="Guardian's Landline" value="guardianLandline" />
          <RadioField label="Previous Resident" value="previousResident" options={[{ label: "Yes", value: "yes" }, { label: "No", value: "no" }]} />
          <RadioField label="Mess Preference" value="messPreference" options={[{ label: "Vegetarian", value: "vegetarian" }, { label: "Non Vegetarian", value: "non_vegetarian" }]} />
          <CheckBoxField value="declaration" options={[{ label: "I agree to abide by the hostel rules", value: "accepted" }]} />
          <Button onPress={() => handleSubmit()}>
            <ButtonText>Submit</ButtonText>
          </Button>
          </View>  
        </ScrollView>
      )}
    </Formik>
  );
};

export default AdmissionForm;
