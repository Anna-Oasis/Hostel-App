import React from "react";
import { ScrollView, Image, View } from "react-native";
import { useFormikContext } from "formik";
import { Button, ButtonText } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableData,
} from "@/components/ui/table";
import { Text } from "../ui/text";
import useUserStore from "@/stores/userStore";

const imageFields = [
  "passportPhotoUrl",
  "studentSignatureUrl",
  "parentGuardianSignatureUrl",
  "categoryProofUrl",
  "admissionSlipUrl"
];

function formatKey(key: string) {
  return key
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

const PreviewPage = ({ onEdit, onSubmit }: { onEdit: () => void; onSubmit: () => void }) => {
  const { values } = useFormikContext<any>();
  const details = useUserStore((state) => state.details);

  // Filter out empty values for cleaner preview
  const formEntries = Object.entries(values).filter(([_, v]) => v !== undefined && v !== "");

  return (
    <ScrollView className="p-4">
      <View className="bg-white rounded-xl shadow-sm mb-4 p-2">
        <Text className="font-bold text-lg mb-2 text-center">Admission Form Preview</Text>
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="py-2 font-bold text-base">Field</TableHead>
              <TableHead className="py-2 font-bold text-base">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {formEntries.map(([key, value], idx) => (
              <TableRow
                key={key}
                className={idx % 2 === 0 ? "bg-slate-50" : "bg-white"}
              >
                <TableData className="py-2">
                  <Text className="font-bold text-gray-800">{formatKey(key)}</Text>
                </TableData>
                <TableData className="py-2">
                  {imageFields.includes(key) && typeof value === 'string' && value ? (
                    <Image
                      source={{ uri: value }}
                      className="w-20 h-20 rounded-lg my-1"
                      resizeMode="contain"
                    />
                  ) : (
                    <Text className={value === null || value === undefined || value === "" ? "text-gray-400" : "text-gray-800"}>
                      {value === null || value === undefined || value === ""
                        ? "not assigned yet"
                        : String(value)}
                    </Text>
                  )}
                </TableData>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </View>

      <View className="bg-white rounded-xl shadow-sm mb-4 p-2">
        <Text className="font-bold text-lg mb-2 text-center">Personal Details</Text>
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="py-2 font-bold text-base">Field</TableHead>
              <TableHead className="py-2 font-bold text-base">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {details &&
              Object.entries(details).map(([key, value], idx) => (
                <TableRow
                  key={key}
                  className={idx % 2 === 0 ? "bg-slate-50" : "bg-white"}
                >
                  <TableData className="py-2">
                    <Text className="font-bold text-gray-800">{formatKey(key)}</Text>
                  </TableData>
                  <TableData className="py-2">
                    {imageFields.includes(key) && typeof value === 'string' && value ? (
                      <Image
                        source={{ uri: value }}
                        className="w-20 h-20 rounded-lg my-1"
                        resizeMode="contain"
                      />
                    ) : (
                      <Text className={value === null || value === undefined || value === "" ? "text-gray-400" : "text-gray-800"}>
                        {value === null || value === undefined || value === ""
                          ? "not assigned yet"
                          : String(value)}
                      </Text>
                    )}
                  </TableData>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </View>

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