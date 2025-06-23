import { useState, useEffect } from "react";
import {
  Modal,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Icon, CloseIcon } from "@/components/ui/icon";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

interface DeclineCommentProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (comment: string) => void;
  title?: string;
  placeholder?: string;
  submitLabel?: string;
  cancelLabel?: string;
}

const DeclineComment: React.FC<DeclineCommentProps> = ({
  visible,
  onClose,
  onSubmit,
  title = "Add a comment",
  placeholder = "Enter your comment...",
  submitLabel = "Submit",
  cancelLabel = "Cancel",
}) => {
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!visible) setComment("");
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/30 justify-center items-center">
        <View className="w-11/12 max-w-md bg-white rounded-xl p-5 shadow-lg">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-semibold flex-1 text-center">
              {title}
            </Text>
            <TouchableOpacity onPress={onClose} className="ml-2 p-1">
              <Icon as={CloseIcon} size="md" />
            </TouchableOpacity>
          </View>
          <TextInput
            className="border border-gray-200 rounded-lg p-3 min-h-[60px] text-base bg-gray-50 mb-4"
            placeholder={placeholder}
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={3}
            autoFocus
          />
          <View className="flex-row justify-end">
            <Button
              variant="outline"
              action="secondary"
              onPress={onClose}
              className="mr-2"
            >
              <ButtonText>{cancelLabel}</ButtonText>
            </Button>
            <Button
              onPress={() => {
                onSubmit(comment);
                setComment("");
              }}
              isDisabled={comment.trim().length === 0}
            >
              <ButtonText>{submitLabel}</ButtonText>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeclineComment;

 
