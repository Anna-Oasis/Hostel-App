import { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import { DownloadIcon } from "lucide-react-native";
import { WebView } from "react-native-webview";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import {
  downloadReAdmissionForm,
  getReAdmissionFormSource,
} from "@/utils/student/studentFormsApi";

type PdfSource = {
  uri: string;
  headers: {
    Authorization: string;
  };
};

export default function ReAdmissionFormPage() {
  const [source, setSource] = useState<PdfSource | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    getReAdmissionFormSource()
      .then(setSource)
      .catch((error) => {
        Alert.alert("Error", error.message || "Failed to load form.");
      });
  }, []);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      await downloadReAdmissionForm();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to download form.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#f4f4f4] p-4">
      <Text className="mb-3 text-2xl font-bold text-gray-900">
        Re-Admission Form
      </Text>

      {/* <View className="flex-1 overflow-hidden rounded-lg bg-white">
        {source ? (
          <WebView
            source={source}
            startInLoadingState
            originWhitelist={["*"]}
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text>Loading form...</Text>
          </View>
        )}
      </View> */}

      <Button
        className="mt-4 h-14 rounded-lg"
        style={{ backgroundColor: "#022B60" }}
        onPress={handleDownload}
        disabled={isDownloading}
      >
        <ButtonIcon as={DownloadIcon} color="white" />
        <ButtonText className="text-lg">
          {isDownloading ? "Downloading..." : "Download"}
        </ButtonText>
      </Button>
    </View>
  );
}