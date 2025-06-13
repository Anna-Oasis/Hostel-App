import React from "react";
import { ScrollView, Image, View } from "react-native";
import { useFormikContext } from "formik";
import { Button, ButtonText } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableData,
} from "@/components/ui/table";
import { Text } from "../ui/text";

const PreviewPage = ({ onEdit, onSubmit }: { onEdit: () => void; onSubmit: () => void }) => {
  const { values } = useFormikContext<any>();

  const renderImage = (uri: string | undefined, style?: any) =>
    uri ? (
      <Image source={{ uri }} style={[{ width: 100, height: 60 }, style]} />
    ) : (
      "Not uploaded"
    );

  return (
    <ScrollView className="p-4">
      <Text> Preview page</Text>
      
      <View className="flex-row justify-between mt-6">
        <Button onPress={onEdit}>
          <ButtonText>Back to form</ButtonText>
        </Button>
        <Button onPress={onSubmit}>
          <ButtonText>Submit</ButtonText>
        </Button>
      </View>
    </ScrollView>
  );
};

export default PreviewPage;