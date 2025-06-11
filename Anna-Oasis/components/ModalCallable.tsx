import React from 'react';
import { View, Text } from 'react-native';
import { Button, ButtonText } from '@/components/ui/button';
import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton, ModalFooter } from '@/components/ui/modal';

type LeaveModalProps = {
  show: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
};

const ModalCallable: React.FC<LeaveModalProps> = ({
  show,
  onClose,
  title,
  message,
}) => {
  return (
    <Modal isOpen={show} onClose={onClose} size="md">
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Text className="text-2xl font-bold text-gray-900 mb-4">{title}</Text>
          <ModalCloseButton onPress={onClose} />
        </ModalHeader>
        <View style={{ padding: 16 }}>
          <Text className="text-gray-700">{message}</Text>
        </View>
      </ModalContent>
    </Modal>
  );
};

export default ModalCallable;
