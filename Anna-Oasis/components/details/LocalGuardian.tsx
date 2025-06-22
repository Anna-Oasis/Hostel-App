import React from "react";
import TextField from "@/components/form/TextField";
import PhoneInputField from "@/components/form/PhoneInputField";
import SelectField from "@/components/form/SelectField";
import countries from "@/constants/countries";
import indianStates from "@/constants/indianStates";
import { Text } from "../ui/text";

const LocalGuardian = () => (
  <>
    <Text className="text-lg font-semibold mb-4">Local Guardian Details</Text>
    <TextField label="Guardian Name" value="localGuardianName" placeholder="Name" />
    <TextField
      label="Relationship"
      value="localGuardianRelationship"
      placeholder="Relationship"
    />
    <PhoneInputField
      label="Guardian Mobile"
      value="localGuardianMobile"
      placeholder="Guardian's phone number"
    />
    <TextField
      label="Guardian Email"
      value="localGuardianEmail"
      placeholder="Email"
    />
    <TextField
      label="Guardian House No"
      value="guardianHouseNo"
      placeholder="House No"
    />
    <TextField
      label="Guardian Street"
      value="guardianStreet"
      placeholder="Street"
    />
    <TextField label="Guardian City" value="guardianCity" placeholder="City" />
    <SelectField
      label="Guardian State"
      value="guardianState"
      options={indianStates}
    />
    <TextField
      label="Guardian Postal Code"
      value="guardianPostalCode"
      placeholder="Postal Code"
    />
  </>
);

export default LocalGuardian;
