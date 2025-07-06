import React from "react";
import { View } from "react-native";
import { Formik } from "formik";
import TextField from "@/components/form/TextField";
import SelectField from "@/components/form/SelectField";
import { Button, ButtonText } from "@/components/ui/button";
import { hostelOptions, initialValues, validationSchema } from "@/constants/validations/rcManagementValidation";
import PasswordField from "../form/PasswordField";

export default function RCManagementForm({
  onSubmit,
  onBack,
  submitting,
}: {
  onSubmit?: (formData: FormData) => void;
  onBack?: () => void;
  submitting?: boolean;
}) {
  const handleFormSubmit = (values: typeof initialValues) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("hostel", values.hostel);

    if (onSubmit) {
      onSubmit(formData);
    } else {
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleFormSubmit}
    >
      {({ handleSubmit }) => (
        <View style={{ padding: 16 }}>
          <TextField label="Name" value="name" placeholder="Enter RC Name" />
          <TextField label="Email" value="email" placeholder="Enter Email" />
          <PasswordField
            label="Password"
            value="password"
            placeholder="Enter Password"
          />
          <SelectField label="Hostel" value="hostel" options={hostelOptions} />

          <Button style={{ marginTop: 24 }} onPress={() => handleSubmit()} disabled={submitting}>
            <ButtonText>{submitting ? "Adding..." : "Add RC"}</ButtonText>
          </Button>
          {onBack && (
            <Button
              style={{ marginTop: 8, backgroundColor: "#eee" }}
              onPress={onBack}
              disabled={submitting}
            >
              <ButtonText style={{ color: "#333" }}>Back</ButtonText>
            </Button>
          )}
        </View>
      )}
    </Formik>
  );
}