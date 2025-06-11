import React from 'react';
import { View, Text } from 'react-native';
import { Button, ButtonText } from '@/components/ui/button';
import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton,ModalBody, ModalFooter } from '@/components/ui/modal';
import { CloseIcon, Icon } from './ui/icon';
import { Heading } from '@/components/ui/heading'

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
    // <Modal isOpen={show} onClose={onClose} size="md">

    // </Modal>
     <Modal
        isOpen={show}
        onClose={onClose}
        size="md"
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="sm" className="text-typography-950">
              {title}
            </Heading>
            <ModalCloseButton>
              <Icon
                as={CloseIcon}
                size="md"
                className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
              />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <Heading size="sm" className="text-typography-500">
              {message }
            </Heading>
          </ModalBody>
        </ModalContent>
      </Modal>
  );
};

export default ModalCallable;
