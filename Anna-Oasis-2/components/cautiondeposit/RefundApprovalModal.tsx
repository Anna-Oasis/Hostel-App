import { View } from "react-native";
import { Formik } from "formik";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import TextField from "@/components/form/TextField";
import {
  RefundApprovalInitialValues,
  RefundApprovalValidationSchema,
} from "@/constants/validations/refundApprovalValidation";

export default function RefundApprovalModal({
  isOpen,
  onClose,
  onSubmit,
  application,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: {
    refundAmount: string;
    deductionAmount: string;
    deductionReason: string;
    studentRollNumber: string;
  }) => void;
  application: { id: string; name: string; rollNumber: string } | null;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Text className="text-lg font-semibold">Approve Refund</Text>
        </ModalHeader>
        <Formik
          initialValues={RefundApprovalInitialValues}
          validationSchema={RefundApprovalValidationSchema}
          onSubmit={(values) => {
            onSubmit({
              ...values,
              studentRollNumber: application?.rollNumber || "",
            });
          }}
        >
          {({ handleSubmit }) => (
            <>
              <ModalBody>
                <View className="space-y-3">
                  <TextField
                    label="Refund Amount"
                    value="refundAmount"
                    placeholder="Enter refund amount"
                  />
                  <TextField
                    label="Deduction Amount"
                    value="deductionAmount"
                    placeholder="Enter deduction amount"
                  />
                  <TextField
                    label="Reason for Deduction"
                    value="deductionReason"
                    placeholder="Enter reason"
                  />
                </View>
              </ModalBody>
              <ModalFooter>
                <Button onPress={() => handleSubmit()}>
                  <ButtonText>Submit</ButtonText>
                </Button>
                <Button className="ml-2 bg-gray-200" onPress={onClose}>
                  <ButtonText className="text-gray-800">Cancel</ButtonText>
                </Button>
              </ModalFooter>
            </>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
}
