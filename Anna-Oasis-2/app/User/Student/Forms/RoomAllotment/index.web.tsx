import { useEffect, useState } from "react";
import { View } from "react-native";
import { DownloadIcon } from "lucide-react-native";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import {
  downloadRoomAllotmentForm,
  getRoomAllotmentFormSource,
} from "@/utils/student/studentFormsApi";

export default function RoomAllotmentPage() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    let objectUrl: string | null = null;

    getRoomAllotmentFormSource()
      .then((url) => {
        objectUrl = url;
        setPreviewUrl(url);
      })
      .catch((err) => {
        setError(err.message || "Failed to load form.");
      });

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      await downloadRoomAllotmentForm();
    } catch (err: any) {
      window.alert(err.message || "Failed to download form.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <View className="w-full flex-1 self-center bg-[#f4f4f4] p-4 sm:w-[90%] md:w-[70%]">
      <Text className="mb-3 text-2xl font-bold text-gray-900">
        Room Allotment
      </Text>

      <View
        className="flex-1 overflow-hidden rounded-lg bg-white"
        style={{ minHeight: 600 }}
      >
        {error ? (
          <View className="flex-1 items-center justify-center p-6">
            <Text className="text-center text-red-500">{error}</Text>
          </View>
        ) : previewUrl ? (
          <iframe
            src={previewUrl}
            title="Room Allotment"
            style={{ width: "100%", height: "100%", minHeight: 600, border: "none" }}
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text>Loading form...</Text>
          </View>
        )}
      </View>

      <Button
        className="mt-4 h-14 rounded-lg"
        style={{ backgroundColor: "#022B60" }}
        onPress={handleDownload}
        disabled={isDownloading || !previewUrl}
      >
        <ButtonIcon as={DownloadIcon} color="white" />
        <ButtonText className="text-lg">
          {isDownloading ? "Downloading..." : "Download"}
        </ButtonText>
      </Button>
    </View>
  );
}
