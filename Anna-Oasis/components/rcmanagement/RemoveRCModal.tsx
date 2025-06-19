import React, { useState } from "react";
import { View, TouchableOpacity, Alert, ScrollView } from "react-native";
import { Trash2 } from "lucide-react-native";
import { Button , ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from "@/components/ui/modal";

export default function RemoveRCModal({
  visible,
  rcList,
  onRemove,
  onCancel,
}: {
  visible: boolean;
  rcList: { id: string; name: string; hostel: string }[];
  onRemove: (rcId: string) => void;
  onCancel: () => void;
}) {
  const [removingId, setRemovingId] = useState<string | null>(null);

  const confirmRemove = (rcId: string, rcName: string) => {
    Alert.alert(
      "Remove RC",
      `Are you sure you want to remove "${rcName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setRemovingId(rcId);
            onRemove(rcId);
            setRemovingId(null);
          },
        },
      ]
    );
  };

  return (
    <Modal
      isOpen={visible}
      onClose={onCancel}
      size="md"
      className="items-center justify-center"
    >
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Text className="text-lg font-semibold">Remove RC</Text>
          <ModalCloseButton onPress={onCancel} />
        </ModalHeader>
        <ModalBody>
          <ScrollView className="max-h-80">
            {rcList.length === 0 ? (
              <Text className="text-center text-gray-400">No RCs available</Text>
            ) : (
              rcList.map((rc) => (
                <View
                  key={rc.id}
                  className="flex-row items-center justify-between py-2 border-b border-gray-200"
                >
                  <View>
                    <Text className="font-bold">{rc.name}</Text>
                    <Text className="text-xs text-gray-500">{rc.hostel}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => confirmRemove(rc.id, rc.name)}
                    disabled={removingId === rc.id}
                    className="p-2 rounded-full bg-red-100"
                  >
                    <Trash2 color="#dc2626" size={20} />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>
        </ModalBody>
        <ModalFooter>
          <Button className="bg-gray-200" onPress={onCancel}>
            <ButtonText className="text-gray-800">Close</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}