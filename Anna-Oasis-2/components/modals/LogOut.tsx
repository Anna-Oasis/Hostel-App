import React from "react";
import { Text } from "react-native";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from "@/components/ui/modal";
import { Button, ButtonText } from "@/components/ui/button";

interface LogOutModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogOutModal: React.FC<LogOutModalProps> = ({ show, onClose, onConfirm }) => (
  <Modal isOpen={show} onClose={onClose}>
    <ModalBackdrop onPress={onClose} />
    <ModalContent size="sm">
      <ModalHeader>
        <Text className="text-lg font-bold">Confirm Logout</Text>
        <ModalCloseButton onPress={onClose} />
      </ModalHeader>
      <ModalBody>
        <Text>Are you sure you want to logout?</Text>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onPress={onClose} className="mr-2">
          <ButtonText>No</ButtonText>
        </Button>
        <Button
          onPress={() => {
            onClose();
            onConfirm();
          }}
        >
          <ButtonText>Yes, Logout</ButtonText>
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default LogOutModal;