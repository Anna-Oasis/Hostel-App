import { View, ScrollView } from "react-native";
import TextField from "@/components/form/TextField";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { NOTE } from "@/constants/validations/cautionDepositValidation";
import HelperText from "../HelperText";

interface CautionDepositFormProps {
  onSubmit: () => void;
  onBack?: () => void;
}

export default function CautionDepositForm({
  onSubmit,
  onBack,
}: CautionDepositFormProps) {
  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: "#fff" }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        <View className="space-y-4">
          <TextField
            label="Account Holder Name (Student’s name only)"
            value="accountHolderName"
            placeholder="Enter Account Holder Name"
          />
          <TextField
            label="Account Number"
            value="accountNumber"
            placeholder="Enter Account Number"
          />
          <TextField
            label="Bank Name (in Full)"
            value="bankName"
            placeholder="Example: State Bank of India"
          />
          <TextField
            label="Address of the bank"
            value="bankAddress"
            placeholder="Enter Bank Address"
          />
          <TextField
            label="IFS Code"
            value="ifscCode"
            placeholder="Enter IFS Code"
          />
          <HelperText>{NOTE}</HelperText>

          <Button className="mt-4" onPress={onSubmit}>
            <ButtonText>Submit</ButtonText>
          </Button>
          {onBack && (
            <Button className="mt-2 bg-gray-200" onPress={onBack}>
              <ButtonText className="text-gray-800">Back</ButtonText>
            </Button>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
