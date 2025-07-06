import React from "react";
import TextField from "@/components/form/TextField";
import PhoneInputField from "@/components/form/PhoneInputField";
import SearchableSelectField from "../form/SearchableSelectField";
import SelectField from "@/components/form/SelectField";
import countries from "@/constants/countries";
import indianStates from "@/constants/indianStates";
import { Text } from "../ui/text";
import { Divider } from "../ui/divider";
import { View } from "react-native";

const ParentDetails = () => (
  <View>
    <Text className="text-2xl font-bold text-center mb-2 mt-2">Parent's Details</Text>
    <Divider className="mb-6" />

    <View className="bg-white rounded-xl shadow p-4 mb-6">
      <Text className="text-lg font-semibold mb-2 text-gray-800 text-center">Father's Details</Text>
      <Divider className="mb-3" />
      <TextField label="Father's Name" value="fatherName" placeholder="Father's name" />
      <TextField label="Father's Occupation" value="fatherOccupation" placeholder="Father's occupation" />
      <PhoneInputField label="Father's Mobile" value="fatherMobile" placeholder="Father's phone number" />
      <TextField label="Father's Email" value="fatherEmail" placeholder="Father's email" />
      <SelectField label="Father's Residential Country" value="fatherCountry" options={countries} />
    </View>

    <View className="bg-white rounded-xl shadow p-4 mb-6">
      <Text className="text-lg font-semibold mb-2 text-gray-800 text-center">Mother's Details</Text>
      <Divider className="mb-3" />
      <TextField label="Mother's Name" value="motherName" placeholder="Mother's name" />
      <TextField label="Mother's Occupation" value="motherOccupation" placeholder="Mother's occupation" />
      <PhoneInputField label="Mother's Mobile" value="motherMobile" placeholder="Mother's phone number" />
      <TextField label="Mother's Email" value="motherEmail" placeholder="Mother's email" />
      <SelectField label="Mother's Country" value="motherCountry" options={countries} />
    </View>

    <View className="bg-white rounded-xl shadow p-4 mb-6">
      <Text className="text-lg font-semibold mb-2 text-gray-800 text-center">Residential Address (India)</Text>
      <Divider className="mb-3" />
      <TextField label="Indian House No" value="resIndiaHouseNo" placeholder="House No" />
      <TextField label="Indian Street" value="resIndiaStreet" placeholder="Street" />
      <TextField label="Indian City" value="resIndiaCity" placeholder="City" />
      <SelectField label="Indian State" value="resIndiaState" options={indianStates} />
      <TextField label="Indian Postal Code" value="resIndiaPostalCode" placeholder="Postal Code" />
    </View>

    <View className="bg-white rounded-xl shadow p-4 mb-6">
      <Text className="text-lg font-semibold mb-2 text-gray-800 text-center">Residential Address (Foreign) - If not available enter NIL</Text>
      <Divider className="mb-3" />
      <TextField label="House No" value="resForeignHouseNo" placeholder="House No" />
      <TextField label="Street" value="resForeignStreet" placeholder="Street" />
      <TextField label="City" value="resForeignCity" placeholder="City" />
      <TextField label="State" value="resForeignState" placeholder="State" />
      <SelectField label="Country" value="resForeignCountry" options={countries} />
      <TextField label="Postal Code" value="resForeignPostalCode" placeholder="Postal Code" />
    </View>
  </View>
);

export default ParentDetails;