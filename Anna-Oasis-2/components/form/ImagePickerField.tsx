import { View, Image, Platform } from "react-native";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import * as ImagePicker from "expo-image-picker";
import { useFormikContext } from "formik";
import HelperText from "../HelperText";

interface Props {
  label: string;
  value: string;
  placeholder?: string;
}

const ImagePickerField = ({ label, value, placeholder }: Props) => {
  const { setFieldValue, values, errors, touched } = useFormikContext<any>();

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.7,
        base64: true, // Forces extraction of raw binary components safely
      });

      if (result.canceled || !result.assets?.[0]) return;

      const selectedAsset = result.assets[0];

      if (Platform.OS === 'web') {
        // If the web context successfully creates an internal base64 property, use it directly
        if (selectedAsset.base64) {
          setFieldValue(value, `data:image/jpeg;base64,${selectedAsset.base64}`);
        } else if (selectedAsset.uri) {
          // Fallback parsing strategy if browser permissions interfere with direct base64 processing
          const response = await fetch(selectedAsset.uri);
          const blob = await response.blob();
          const reader = new FileReader();
          reader.onloadend = () => {
            setFieldValue(value, reader.result as string);
          };
          reader.readAsDataURL(blob);
        }
      } else {
        // Mobile runtime profile
        setFieldValue(value, selectedAsset.uri);
      }
    } catch (error) {
      alert("Error encountered selecting media asset: "+"\n"+error);
    }
  };

  return (
    <View className="my-2 p-4 rounded-lg bg-black border border-white">
      <Text className="text-white text-base font-semibold mb-2">{label}</Text>
      {values[value] ? (
        <Image
          source={{ uri: values[value] }}
          className="w-24 h-24 rounded border border-white mb-2"
        />
      ) : (
        <Text className="text-gray-400 mb-2">{placeholder}</Text>
      )}
      <Button
        className="bg-white border border-black rounded px-4 py-2"
        onPress={pickImage}
      >
        <Text className="text-black font-medium">Upload {label}</Text>
      </Button>
      <HelperText>Note: maximum image upload size is 3 MB</HelperText>
      {touched[value] &&
        errors[value] &&
        (typeof errors[value] === "string" ? (
          <Text className="text-red-500 mt-2">{errors[value]}</Text>
        ) : Array.isArray(errors[value]) ? (
          (errors[value] as string[]).map((err, idx) => (
            <Text className="text-red-500 mt-2" key={idx}>
              {err}
            </Text>
          ))
        ) : null)}
    </View>
  );
};

export default ImagePickerField;