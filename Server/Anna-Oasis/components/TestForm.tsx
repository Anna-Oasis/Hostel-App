import React from "react";
import { View } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import TextField from "@/components/form/TextField";
import { Button, ButtonText } from "@/components/ui/button";
import RadioField from "@/components/form/RadioField";
import CheckBoxField from "@/components/form/CheckBoxField";
import SelectField from "@/components/form/SelectField";

const TestForm = () => {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    gender: Yup.string().required("Gender is required"),
    terms: Yup.array()
      .of(Yup.string())
      .min(1, "You must accept the terms and conditions"),
    // file: Yup.mixed().required("File is required"),
    subscription: Yup.string().required("Subscription is required"),
  });

  return (
    <Formik
      initialValues={{
        name: "",
        gender: "",
        terms: [],
        // file: null,
        subscription: "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        values,
        errors,
        touched,
      }) => (
        <View>
          <TextField placeholder="Testing" value="name" />
          <RadioField
            value="gender"
            options={[
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
              { label: "Other", value: "other" },
            ]}
          />
          <CheckBoxField
            value="terms"
            options={[{ label: "I understand", value: "checked" }]}
          />
          <SelectField value="subscription" options={[
            {label: "Basic", value: "basic"},
            {label: "Pro", value: "pro"},
          ]}/>
          <Button onPress={() => handleSubmit()}>
            <ButtonText>Submit</ButtonText>
          </Button>
        </View>
      )}
    </Formik>
  );
};

export default TestForm;
