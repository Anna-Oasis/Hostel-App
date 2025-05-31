import React from "react";
import { View, Image } from "react-native";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import * as ImagePicker from "expo-image-picker";
import { useFormikContext } from "formik";

interface Props {
  label: string;
  value: string;
  placeholder?: string;
}

const ImagePickerField = ({ label, value, placeholder }: Props) => {
  const { setFieldValue, values } = useFormikContext<any>();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      base64: false,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      setFieldValue(value, result.assets[0].uri);
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
    </View>
  );
};

export default ImagePickerField;