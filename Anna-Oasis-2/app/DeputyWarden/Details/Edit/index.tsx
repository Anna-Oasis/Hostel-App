import ImagePickerField from "@/components/form/ImagePickerField";
import SelectField from "@/components/form/SelectField";
import TextField from "@/components/form/TextField";
import { Button, ButtonText } from "@/components/ui/button";
import { hostelBlocks } from "@/constants/admission";
import { initialValues } from "@/constants/dwDetails";
import deputyWardenValidation from "@/constants/validations/deputyWardenValidation";
import useUserStore from "@/stores/userStore";
import {
  fetchDeputyWardenDetails,
  updateDeputyWardenDetails,
  handleEnterDeputyWardenDetails
} from "@/utils/deputyWarden/dwDetails";
import { appendImageToFormData } from "@/utils/imageHelper";
import { router } from "expo-router";
import { Formik } from "formik";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

const DeputyWardenDetailsPage = () => {
  const details = useUserStore((state) => state.details);
  const setDetails = useUserStore((state) => state.setDetails);

  const [submit, setSubmit] = useState(false);

  return (
    <Formik
      initialValues={details ? { ...initialValues, ...details } : initialValues}
      validationSchema={deputyWardenValidation}
      onSubmit={async (values) => {
        const formData = new FormData();

        formData.append("name", values.name);
        formData.append("dept", values.dept);
        formData.append("email", values.email);
        formData.append("block", values.block);

        appendImageToFormData(
          formData,
          "passportPhoto",
          values.passportPhotoUrl
        );

        setSubmit(true);

        if (details) {
          await updateDeputyWardenDetails(formData);
        } else {
          await handleEnterDeputyWardenDetails(formData);
        }

        const response = await fetchDeputyWardenDetails();
        setDetails(response[0]);

        window.alert(
          `Success\nDeputy Warden details ${
            details ? "updated" : "submitted"
          } successfully`
        );

        setSubmit(false);
        router.replace("/DeputyWarden");
      }}
    >
      {({ handleSubmit }) => (
        <ScrollView
          className="bg-white"
          contentContainerStyle={{
            padding: 20,
            gap: 12,
          }}
        >
          <View className="w-full sm:w-[80%] md:w-[50%] self-center">
            <Text className="text-center text-2xl m-2 font-medium">
              {details ? "Edit Details" : "Fill Details"}
            </Text>

            <TextField
              label="Name"
              value="name"
              placeholder="Enter name"
            />

            <TextField
              label="Department"
              value="dept"
              placeholder="Department"
            />

            <TextField
              label="Email"
              value="email"
              placeholder="Email"
            />

            <SelectField
              label="Hostel Block"
              value="block"
              options={hostelBlocks}
            />

            <ImagePickerField
              label="Passport Photo"
              value="passportPhotoUrl"
              placeholder="Upload"
            />

            <Button onPress={() => handleSubmit()}>
              <ButtonText>
                {submit
                  ? "Loading..."
                  : details
                  ? "Edit Details"
                  : "Submit Details"}
              </ButtonText>
            </Button>
          </View>
        </ScrollView>
      )}
    </Formik>
  );
};

export default DeputyWardenDetailsPage;