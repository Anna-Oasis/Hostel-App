import React from "react";
import {  TouchableOpacity, ScrollView } from "react-native";
import { Button , ButtonText} from "@/components/ui/button";
import { Checkbox, CheckboxIndicator, CheckboxLabel, CheckboxIcon } from "@/components/ui/checkbox";
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

export default function AssignFloorsModal({
  visible,
  rc,
  floors,
  selectedFloors,
  onToggleFloor,
  onAssign,
  onCancel,
  submitting,
}: {
  visible: boolean;
  rc: any;
  floors: string[];
  selectedFloors: string[];
  onToggleFloor: (floor: string) => void;
  onAssign: () => void;
  onCancel: () => void;
  submitting?: boolean;
}) {
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
          <Text className="text-lg font-semibold">Assign Floors to {rc?.name}</Text>
          <ModalCloseButton onPress={onCancel} />
        </ModalHeader>
        <ModalBody>
          <ScrollView className="w-full">
            {floors.map((floor) => (
              <TouchableOpacity
                key={floor}
                className="w-full p-4 rounded bg-gray-100 mb-2 flex-row items-center"
                activeOpacity={0.7}
                onPress={() => onToggleFloor(floor)}
              >
                <Checkbox
                  value={floor}
                  isChecked={selectedFloors.includes(floor)}
                  onChange={() => onToggleFloor(floor)}
                  size="md"
                >
                  <CheckboxIndicator>
                    <CheckboxIcon />
                  </CheckboxIndicator>
                  <CheckboxLabel className="ml-2">{floor}</CheckboxLabel>
                </Checkbox>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </ModalBody>
        <ModalFooter>
            <Button onPress={onAssign} disabled={submitting}>
            <ButtonText>{submitting ? "Assigning..." : "Assign"}</ButtonText>
            </Button>
            <Button className="bg-gray-200" onPress={onCancel}>
            <ButtonText className="text-gray-800">Cancel</ButtonText>
            </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}