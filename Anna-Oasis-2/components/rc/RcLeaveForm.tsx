import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { useEffect, useState } from "react";
import useUserStore from "@/stores/userStore";
import { Formik } from "formik";
import { rcLeaveValidationSchema } from "@/constants/validations/rcLeaveValidation";
import DatePickerField from "@/components/form/DatePickerField";
import MultiLineText from "@/components/form/MultiLineText";
import SelectField from "@/components/form/SelectField";
import { Button, ButtonText } from "@/components/ui/button";
import { RCLeaveFormPayload, submitRCLeaveForm } from "@/utils/rc/rcLeaveApi";
import { getRCList, RCListResponse } from "@/utils/rc/rcApi";

const RcLeaveForm = () => {
  const details = useUserStore((state) => state.details);
  const [alterrc, setAlterrc] = useState<RCListResponse | null>(null);

  useEffect(() => {
    const fetchRCList = async () => {
      try {
        const result = await getRCList();
        console.log(details);
        if (result.success) {
          setAlterrc(result);
        } else {
          console.error("Failed to fetch RC list:", result.message);
        }
      } catch (error) {
        console.error("Error fetching RC list:", error);
      }
    };
    fetchRCList();
  }, []);

  return (
    <View>
      <Formik
        initialValues={{
          arrival: "",
          leaving: "",
          reason: "",
          alternate: "",
        }}
        validationSchema={rcLeaveValidationSchema}
        onSubmit={(values) => {
          const payload: RCLeaveFormPayload = {
            rc_id: details ? Number(details.userId) : 0,
            arrival: values.arrival,
            leaving: values.leaving,
            reason: values.reason,
            alternate: Number(values.alternate),
          };
          submitRCLeaveForm(payload);
        }}
      >
        {({ handleSubmit }) => (
          <View className="space-y-4 p-4">
            <Text className="text-2xl font-bold mb-4">RC Leave Form</Text>
            <DatePickerField
              label="Leaving Date"
              value="leaving"
              placeholder="YYYY-MM-DD"
              minimumDate={new Date()}
            />
            <DatePickerField
              label="Arrival Date"
              value="arrival"
              placeholder="YYYY-MM-DD"
              minimumDate={new Date()}
            />

            <MultiLineText
              label="Reason for leave"
              value="reason"
              placeholder="Enter reason for leave"
            />
            <SelectField
              label="Select Alternate RC"
              value="alternate"
              options={
                alterrc
                  ? alterrc.data
                      .filter((rc) => rc.userId !== Number(details?.userId))
                      .map((rc) => ({
                        label: rc.name,
                        value: rc.id.toString(),
                      }))
                  : []
              }
            />
            <Button onPress={() => handleSubmit()} className="mt-4">
              <ButtonText>Submit</ButtonText>
            </Button>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default RcLeaveForm;
