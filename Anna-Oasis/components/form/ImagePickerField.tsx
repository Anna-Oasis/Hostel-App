import React from "react";
import { View, Button, Image, Text } from "react-native";
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
      base64: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.[0]?.base64) {
      setFieldValue(value, `data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  return (
    <View style={{ marginVertical: 8 }}>
      <Text>{label}</Text>
      {values[value] ? (
        <Image
          source={{ uri: values[value] }}
          style={{ width: 100, height: 100, marginVertical: 8 }}
        />
      ) : (
        <Text style={{ color: "#888" }}>{placeholder}</Text>
      )}
      <Button title={`Pick ${label}`} onPress={pickImage} />
    </View>
  );
};

export default ImagePickerField;