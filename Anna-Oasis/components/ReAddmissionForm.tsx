import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { View } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import GeneralForm from "./GeneralForm";
import PaymentForm from "./PaymentForm";
import DeclarationForm from "./DeclarationForm";

const hostelFormSchema = Yup.object().shape({
  hostelBlock: Yup.string()
    .oneOf(["Flora", "Lavender"], "Select a valid hostel block")
    .required("Hostel block is required"),
  name: Yup.string().required("Name is required"),
  course: Yup.string().required("Course is required"),
  branch: Yup.string().required("Branch is required"),
  year: Yup.number().integer().min(1).max(4).required("Year is required"),
  semester: Yup.number().integer().min(1).max(8).required("Semester is required"),
  mobile: Yup.string()
    .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
    .required("Mobile number is required"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  parentsContact: Yup.object().shape({
    mobile1: Yup.string()
      .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
      .required("Parent's mobile number is required"),
    mobile2: Yup.string()
      .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
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
  paymentDone: Yup.string().required("Payment status is required"),
  transactionId: Yup.string().when("paymentDone", {
    is: "Yes",
    then: (schema) => schema.required("Transaction ID is required"),
  }),
  transactionDate: Yup.string().when("paymentDone", {
    is: "Yes",
    then: (schema) => schema.required("Transaction Date is required"),
  }),
  declarationAccepted: Yup.array()
  .min(1, "You must accept the declaration to proceed."),
});

const ReAdmissionForm = () => {
  const [stepper, setStepper] = useState(0);

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
        paymentDone: "",
        transactionId: "",
        transactionDate: "",
        declarationAccepted: [],
      }}
      validationSchema={hostelFormSchema}
      onSubmit={(values) => console.log(values)}
    >
      {({ handleSubmit, errors }) => (
        <View>
          <Form stepper={stepper} />
          <View>
            <Button onPress={() => setStepper((prev) => Math.max(prev - 1, 0))}>
              <ButtonText>Previous</ButtonText>
            </Button>
            <Button
              onPress={async () => {
                if (stepper === 2) {
                  if (Object.keys(errors).length === 0) {
                    handleSubmit();
                  } else {
                    console.log(errors);
                  }
                } else {
                  setStepper((prev) => prev + 1);
                }
              }}
            >
              <ButtonText>{stepper === 2 ? "Submit" : "Next"}</ButtonText>
            </Button>
          </View>
        </View>
      )}
    </Formik>
  );
};

export default ReAdmissionForm;

function Form({ stepper }: { stepper: number }) {
  switch (stepper) {
    case 0:
      return <GeneralForm />;
    case 1:
      return <PaymentForm />; 
    case 2:
      return <DeclarationForm />;
    default:
      return null;
  }
}
