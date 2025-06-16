import { View } from "react-native";
import { Input, InputField } from "@/components/ui/input";
import { useFormikContext, ErrorMessage } from "formik";
import { Text } from "@/components/ui/text";
import Label from "@/components/form/Label";
import { Textarea, TextareaInput } from "@/components/ui/textarea";

interface TextFieldProps {
    label?: string;
    placeholder: string;
    value: string;
    props?: any;
}

/**
 * TextField component renders a text input field and integrates with Formik for form state management.
 *
 * @param {string} placeholder - The placeholder text for the input field.
 * @param {string} value - The name of the field in Formik values.
 * @param {any} props - Additional props for the input field.
 */
function MultiLineText({ label, placeholder, value, ...props }: TextFieldProps) {
    const { values, handleBlur, handleChange, touched, errors } = useFormikContext<any>();

    return (
        <View>
            {label && <Label text={label} />}
            <Textarea
                size="md"
                isReadOnly={false}
                isInvalid={false}
                isDisabled={false}
            >

                <TextareaInput
                    placeholder={placeholder}
                    onChangeText={handleChange(value)}
                    onBlur={handleBlur(value)}
                    value={values[value]}
                    {...props}
                />
            </Textarea>
            {touched[value] && typeof errors[value] === 'string' && (
                <Text italic style={{ color: 'red', marginTop: 5 }}>{errors[value]}</Text>
            )}
        </View>
    );
}

export default MultiLineText;