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
    year: Yup.number().integer().min(1).max(5).required("Year is required"),
    semester: Yup.number().integer().min(1).max(10).required("Semester is required"),
    mobile: Yup.string().matches(/^[0-9]{10}$/, "Mobile number must be 10 digits").required("Mobile number is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    
      parentMobile1: Yup.string().matches(/^[0-9]{10}$/, "Mobile number must be 10 digits").required("Parent's mobile number is required"),
      parentMobile2: Yup.string().matches(/^[0-9]{10}$/, "Mobile number must be 10 digits").notRequired(),
      parentEmail: Yup.string().email("Invalid email format").required("Parent's email is required"),
    
    
      localGuardianName: Yup.string().required("Local guardian's name is required"),
      localGuardianMobile: Yup.string().matches(/^[0-9]{10}$/, "Mobile number must be 10 digits").required("Local guardian's mobile number is required"),
      localGuardianEmail: Yup.string().email("Invalid email format").required("Local guardian's email is required"),
    
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
              name="hostelBlock"
              value="hostelBlock"
              onChange={handleChange("hostelBlock")}
              onBlur={handleBlur("hostelBlock")}
              options={[{ label: "Flora (Boys)", value: "Flora" }, { label: "Lavender (Girls)", value: "Lavender" }]}
              error={touched.hostelBlock && errors.hostelBlock}
            />
            <TextField
              name="name"
              placeholder="Name"
              value="name"
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
              error={touched.name && errors.name}
            />
            <TextField
              name="course"
              placeholder="Course"
              value="course"
              onChangeText={handleChange("course")}
              onBlur={handleBlur("course")}
              error={touched.course && errors.course}
            />
            <TextField
              name="branch"
              placeholder="Branch"
              value="branch"
              onChangeText={handleChange("branch")}
              onBlur={handleBlur("branch")}
              error={touched.branch && errors.branch}
            />
            <TextField
              name="year"
              placeholder="Year"
              keyboardType="numeric"
              value="year"
              onChangeText={handleChange("year")}
              onBlur={handleBlur("year")}
              error={touched.year && errors.year}
            />
            <TextField
              name="semester"
              placeholder="Semester"
              keyboardType="numeric"
              value="semester"
              onChangeText={handleChange("semester")}
              onBlur={handleBlur("semester")}
              error={touched.semester && errors.semester}
            />
            <TextField
              name="mobile"
              placeholder="Mobile No."
              keyboardType="phone-pad"
              value="mobile"
              onChangeText={handleChange("mobile")}
              onBlur={handleBlur("mobile")}
              error={touched.mobile && errors.mobile}
            />
            <TextField
              name="email"
              placeholder="Email"
              keyboardType="email-address"
              value="email"
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              error={touched.email && errors.email}
            />
            <TextField
              name="parentsContact.mobile1"
              placeholder="Parent Mobile 1"
              keyboardType="phone-pad"
              value="parentMobile1"
              onChangeText={handleChange("parentsContact.mobile1")}
              onBlur={handleBlur("parentsContact.mobile1")}
              error={touched.parentsContact?.mobile1 && errors.parentsContact?.mobile1}
            />
            <TextField
              name="parentsContact.mobile2"
              placeholder="Parent Mobile 2"
              keyboardType="phone-pad"
              value="parentMobile2"
              onChangeText={handleChange("parentsContact.mobile2")}
              onBlur={handleBlur("parentsContact.mobile2")}
              error={touched.parentsContact?.mobile2 && errors.parentsContact?.mobile2}
            />
            <TextField
              name="parentsContact.email"
              placeholder="Parent Email"
              keyboardType="email-address"
              value="parentEmail"
              onChangeText={handleChange("parentsContact.email")}
              onBlur={handleBlur("parentsContact.email")}
              error={touched.parentsContact?.email && errors.parentsContact?.email}
            />
            <TextField
              name="localGuardian.name"
              placeholder="Local Guardian Name"
              value="localGuardianName"
              onChangeText={handleChange("localGuardian.name")}
              onBlur={handleBlur("localGuardian.name")}
              error={touched.localGuardian?.name && errors.localGuardian?.name}
            />
            <TextField
              name="localGuardian.mobile"
              placeholder="Local Guardian Mobile"
              keyboardType="phone-pad"
              value="localGuardianMobile"
              onChangeText={handleChange("localGuardian.mobile")}
              onBlur={handleBlur("localGuardian.mobile")}
              error={touched.localGuardian?.mobile && errors.localGuardian?.mobile}
            />
            <TextField
              name="localGuardian.email"
              placeholder="Local Guardian Email"
              keyboardType="email-address"
              value="localGuardianEmail"
              onChangeText={handleChange("localGuardian.email")}
              onBlur={handleBlur("localGuardian.email")}
              error={touched.localGuardian?.email && errors.localGuardian?.email}
            />
            <TextField
              name="address"
              placeholder="Address"
              value="address"
              onChangeText={handleChange("address")}
              onBlur={handleBlur("address")}
              error={touched.address && errors.address}
            />
            <TextField
              name="roomNumber"
              placeholder="Room Number"
              keyboardType="numeric"
              value="roomNumber"
              onChangeText={handleChange("roomNumber")}
              onBlur={handleBlur("roomNumber")}
              error={touched.roomNumber && errors.roomNumber}
            />
            <Button onPress={handleSubmit}>
              <ButtonText>Submit</ButtonText>
            </Button>
          </View>
        </ScrollView>
      )}
    </Formik>
  );
};

export default ReAddmissionForm;
