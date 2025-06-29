import TextField from "@/components/form/TextField";
import PhoneInputField from "@/components/form/PhoneInputField";
import SelectField from "@/components/form/SelectField";
import indianStates from "@/constants/indianStates";
import { Text } from "../ui/text";
import { Divider } from "../ui/divider";
import { View } from "react-native";

const LocalGuardian = () => (
  <View className="bg-white rounded-xl shadow p-4 mb-6">
    <Text className="text-2xl font-bold text-center mb-2 mt-2">
      Local Guardian Details
    </Text>
    <Divider className="mb-6" />
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
  </View>
);

export default LocalGuardian;
