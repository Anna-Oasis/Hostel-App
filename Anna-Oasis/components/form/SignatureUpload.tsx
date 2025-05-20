import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useFormikContext } from "formik";

interface SignatureUploadProps {
  value: string;
  label?: string; 
}

const SignatureUpload: React.FC<SignatureUploadProps> = ({ value, label = "Signature" }) => {
  const { setFieldValue, values } = useFormikContext<Record<string, string>>();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets[0].base64) {
      const base64String = result.assets[0].base64;
      setFieldValue(value, `data:image/jpeg;base64,${base64String}`);
    }
  };

  return (
    <View className="space-y-2">
      <Text className="text-base font-medium text-primary-200">{label}</Text>
      <Pressable
        onPress={pickImage}
        className="bg-secondary-950 p-2 rounded-md w-fit"
      >
        <Text className="text-white">Choose Image</Text>
      </Pressable>

      {values[value] && (
        <Image
          source={{ uri: values[value] }}
          className="w-40 h-24 rounded-md mt-2"
        />
      )}
    </View>
  );
};

export default SignatureUpload;
