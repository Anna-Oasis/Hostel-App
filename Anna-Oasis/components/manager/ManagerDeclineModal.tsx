import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Icon, CloseIcon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";

interface ManagerDeclineModalProps {
  isOpen: boolean;
  comment: string;
  onChangeComment: (text: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export default function ManagerDeclineModal({
  isOpen,
  comment,
  onChangeComment,
  onCancel,
  onSubmit,
  isSubmitting = false,
}: ManagerDeclineModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} size="md">
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Heading size="md" className="text-typography-950">
            Decline Admission
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
          <Text size="sm" className="text-typography-500">
            Please provide a comment for declining this admission.
          </Text>
          <Input
            variant="outline"
            size="md"
            isDisabled={false}
            isInvalid={false}
            isReadOnly={false}
          >
            <InputField
              placeholder="Enter comment here..."
              value={comment}
              onChangeText={onChangeComment}
            />
          </Input>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="outline"
            action="secondary"
            onPress={onCancel}
            isDisabled={isSubmitting}
          >
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button
            onPress={onSubmit}
            isDisabled={!comment.trim() || isSubmitting}
          >
            <ButtonText>Submit</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
