import React from "react";
import { ScrollView } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import TextField from "@/components/form/TextField";
import { Button, ButtonText } from "@/components/ui/button";
import RadioField from "@/components/form/RadioField";
import CheckBoxField from "@/components/form/CheckBoxField";
import SelectField from "@/components/form/SelectField";
import { View } from "react-native";

const ReAddmissionForm = () => {
  const hostelFormSchema = Yup.object().shape({
    hostelBlock: Yup.string().oneOf(["Flora", "Lavender"], "Select a valid hostel block").required("Hostel block is required"),
    name: Yup.string().required("Name is required"),
    course: Yup.string().required("Course is required"),
    branch: Yup.string().required("Branch is required"),
    year: Yup.number().integer().min(1).max(4).required("Year is required"),
    semester: Yup.number().integer().min(1).max(8).required("Semester is required"),
    mobile: Yup.string().matches(/^[0-9]{10}$/, "Mobile number must be 10 digits").required("Mobile number is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    
    parentsContact: Yup.object().shape({
      mobile1: Yup.string()
        .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
        .required("Parent's mobile number is required"),
      mobile2: Yup.string().matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
        .notRequired(),
      email: Yup.string().email("Invalid email format").required("Parent's email is required"),
    }),
    
    
    localGuardian: Yup.object().shape({
      name: Yup.string().required("Local guardian's name is required"),
      mobile: Yup.string()
        .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
        .required("Local guardian's mobile number is required"),
      email: Yup.string().email("Invalid email format").required("Local guardian's email is required"),
    }),
    
    address: Yup.string().required("Address is required"),
    roomNumber: Yup.number().integer().required("Room number is required"),
  });

  return (
    <Formik
      initialValues={{
        hostelBlock: "",
        name: "",
        course: "",
        branch: "",
        year: "",
        semester: "",
        mobile: "",
        email: "",
        parentsContact: { mobile1: "", mobile2: "", email: "" },
        localGuardian: { name: "", mobile: "", email: "" },
        address: "",
        roomNumber: "",
      }}
      validationSchema={hostelFormSchema}
      onSubmit={(values) => console.log(values)}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <ScrollView>
          <View>
            <RadioField
              value="hostelBlock"
              options={[{ label: "Flora (Boys)", value: "Flora" }, { label: "Lavender (Girls)", value: "Lavender" }]}
            />
            <TextField
              placeholder="Name"
              value="name"
            />
            <TextField
              placeholder="Course"
              value="course"
            />
            <TextField
              placeholder="Branch"
              value="branch"
            />
            <TextField
              placeholder="Year"
              value="year"
            />
            <TextField
              placeholder="Semester"
              value="semester"
            />
            <TextField
              placeholder="Mobile No."
              value="mobile"
            />
            <TextField
              placeholder="Email"
              value="email"
            />
            <TextField
              placeholder="Parent Mobile 1"
              value="parentMobile1"
            />
            <TextField
              placeholder="Parent Mobile 2"
              value="parentMobile2"
            />
            <TextField
              placeholder="Parent Email"
              value="parentsContact.email"
            />
            <TextField
              placeholder="Local Guardian Name"
              value="localGuardianName"
            />
            <TextField
              placeholder="Local Guardian Mobile"
              value="localGuardianMobile"
            />
            <TextField
              placeholder="Local Guardian Email"
              value="localGuardian.email"
            />
            <TextField
              placeholder="Address"
              value="address"
            />
            <TextField
              placeholder="Room Number"
              value="roomNumber"
            />
            <Button onPress={() => handleSubmit()}>
              <ButtonText>Submit</ButtonText>
            </Button>
          </View>
        </ScrollView>
      )}
    </Formik>
  );
};

export default ReAddmissionForm;
