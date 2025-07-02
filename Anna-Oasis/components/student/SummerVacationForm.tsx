import CheckBoxField from "@/components/form/CheckBoxField";
import DatePickerField from "@/components/form/DatePickerField";
import TextField from "@/components/form/TextField";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Formik } from "formik";
import { ScrollView, View, KeyboardAvoidingView, Platform } from "react-native";
import { summerVacationValidation } from "@/constants/validations/summerVacationValidation";
import { submitSummerVacationRequest } from "@/utils/student/studentVacationApi";
import useLoadingStore from "@/stores/loadingStore";
import useUserStore from "@/stores/userStore";
import PhoneInputField from "../form/PhoneInputField";
import ModalCallable from "@/components/modals/ModalCallable";
import { useState } from "react";

export default function SummerVacationForm() {
  const hostelItemsOptions = [
    { label: "AC Remote", value: "AC Remote" },
    { label: "Room Keys", value: "Room Keys" },
    { label: "Lan Cable", value: "Lan Cable" },
    { label: "Cupboard Keys", value: "Cupboard Keys" },
  ];

  const setLoading = useLoadingStore((state) => state.setLoading);
  const roll_number = useUserStore((state) => state.details.rollNo) || "";
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMsg, setModalMsg] = useState("");

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-[#f8fafc]"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
        <ModalCallable
          show={modalVisible}
          onClose={() => setModalVisible(false)}
          title="Success"
          message={modalMsg}
        />
        <Text className="text-3xl font-bold text-gray-900 mb-2 text-center">
          Summer Vacation Form
        </Text>
        <Text className="text-base text-gray-600 mb-6 text-center">
          Please fill out the details below to submit your summer vacation
          request.
        </Text>
        <Formik
          initialValues={{
            roll_number: roll_number,
            email: "",
            mobile: "",
            vacation_from: "",
            address_of_stay: "",
            returned_items: [],
          }}
          validationSchema={summerVacationValidation(hostelItemsOptions)}
          onSubmit={async (values) => {
            try {
              setLoading(true);
              await submitSummerVacationRequest({
                roll_number: values.roll_number,
                email: values.email,
                mobile: values.mobile,
                vacation_from: values.vacation_from,
                address_of_stay: values.address_of_stay,
                returned_items: values.returned_items,
              });
              setModalMsg("Your summer vacation request has been submitted successfully!");
              setModalVisible(true);
            } finally {
              setLoading(false);
            }
          }}
        >
          {({ handleSubmit }) => (
            <View className="space-y-6">
              {/* Personal & Contact Section */}
              <View className="bg-white rounded-2xl shadow p-4 mb-2">
                <Text className="text-lg font-semibold text-gray-800 mb-2">
                  Contact Details
                </Text>
                <TextField
                  label="Parent's Email"
                  value="email"
                  placeholder="Parent's Email"
                />
                <PhoneInputField
                  label="Mobile Number"
                  value="mobile"
                  placeholder="Mobile Number"
                />
              </View>

              {/* Vacation Details Section */}
              <View className="bg-white rounded-2xl shadow p-4 mb-2">
                <Text className="text-lg font-semibold text-gray-800 mb-2">
                  Vacation Details
                </Text>
                <DatePickerField
                  minimumDate={new Date()}
                  value="vacation_from"
                  label="Date of Vacate"
                />
                <TextField
                  label="Address of Stay During Vacation"
                  value="address_of_stay"
                  placeholder="Address..."
                />
              </View>

              {/* Hostel Items Section */}
              <View className="bg-white rounded-2xl shadow p-4 mb-2">
                <Text className="text-lg font-semibold text-gray-800 mb-2">
                  Hostel Items Handover
                </Text>
                <CheckBoxField
                  options={hostelItemsOptions}
                  value="returned_items"
                  label="Items handed over to hostel"
                />
              </View>

              {/* Submit Button */}
              <View className="items-center mt-4">
                <Button
                  onPress={() => handleSubmit()}
                  className="w-full rounded-lg"
                >
                  <ButtonText className="text-white text-lg font-semibold">
                    Submit Vacation Request
                  </ButtonText>
                </Button>
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}