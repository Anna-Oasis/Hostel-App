import React from "react";
import CheckBoxField from "@/components/form/CheckBoxField";
import { View, ScrollView } from "react-native";
import { RAGGING_DECLARATION, HOSTEL_RULES, HOSTEL_UNDERTAKING } from "@/constants/declaration";
import HelperText from "@/components/HelperText";
import { Divider } from "@/components/ui/divider";
import { Text } from "@/components/ui/text";

const HostelMessDeclaration = () => (
  <ScrollView contentContainerStyle={{ padding: 16 }}>
    <View className="mb-6">
      <Text className="font-bold text-lg mb-2 text-center">
        TAMIL NADU PROHIBITION OF RAGGING ACT 1997
      </Text>
      <Text className="text-base text-gray-700 text-justify leading-relaxed">
        {RAGGING_DECLARATION.trim()}
      </Text>
    </View>
    <Divider className="my-2" />
    <View className="mb-6">
      <Text className="font-bold text-lg mb-2 text-center">
        Hostel Rules and Regulations
      </Text>
      <Text className="text-sm text-gray-700 text-justify font-mono leading-relaxed whitespace-pre-line">
        {HOSTEL_RULES.trim()}
      </Text>
    </View>
    <Divider className="my-2" />
    <View className="mb-6">
      <Text className="font-bold text-lg mb-2 text-center">
        Declaration / Undertaking by the Student for Staying in the International Hostel
      </Text>
      <Text className="text-sm text-gray-700 text-justify font-mono leading-relaxed whitespace-pre-line">
        {HOSTEL_UNDERTAKING.trim()}
      </Text>
    </View>
    <Divider className="my-2" />
    <View className="mt-4">
      <HelperText>
        Please make sure you have gone through all of the rules, regulations and declarations
      </HelperText>
      <CheckBoxField
        label="Declaration"
        value="declaration"
        options={[
          {
            label:
              "I (Student) hereby abide by all the rules & regulations furnished above. If I am apprehended at any time of violating any of the rules above and rules-imposed time to time, I will vacate the hostel immediately.",
            value: "studentAgreed"
          },
          {
            label:
              "We (Parents) are aware of the serious consequences of indulgence in ragging and have strictly advised him/her against this pernicious practice. I assure you that my ward will not involve in any of the activities forbidden by the authorities and the government.",
            value: "parentAgreed"
          }
        ]}
      />
    </View>
  </ScrollView>
);

export default HostelMessDeclaration;