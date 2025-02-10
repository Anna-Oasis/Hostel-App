import { View } from "react-native";
import { Input, InputField } from "@/components/ui/input";
import { useFormikContext, ErrorMessage } from "formik";
import { Text } from "@/components/ui/text";

function TextField({ placeholder, value, ...props }: { placeholder: string, value: string, props?: any }) {
  const { values, handleBlur, handleChange, touched, errors } = useFormikContext<any>();

  return (
    <View>
      <Input
        variant="outline"
        size="md"
        isDisabled={false}
        isInvalid={touched[value] && !!errors[value]}
        isReadOnly={false}
      >
        <InputField
          placeholder={placeholder}
          onChangeText={handleChange(value)}
          onBlur={handleBlur(value)}
          value={values[value]}
          {...props}
        />
      </Input>
      {touched[value] && errors[value] && (
        <Text italic style={{ color: 'red', marginTop: 5 }}>{errors[value]}</Text>
      )}
      {/* <ErrorMessage name={value} /> */}
    </View>
  );
}

export default TextField;