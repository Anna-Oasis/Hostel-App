import React from "react";
import { Spinner } from "@/components/ui/spinner";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalBody,
} from "@/components/ui/modal";
import { Center } from "@/components/ui/center";
import useLoadingStore from "@/stores/loadingStore";

const Loader = () => {
  const isLoading = useLoadingStore((state) => state.isLoading);

  return (
    <Modal
      isOpen={isLoading}
      onClose={() => {}}
      closeOnOverlayClick={false}
    >
      <ModalBackdrop />
      <ModalContent className="bg-transparent border-0 shadow-none m-0 p-0 w-full h-full max-w-full">
        <ModalBody className="flex-1 justify-center items-center">
          <Center>
            <Spinner size="large" />
          </Center>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default Loader;
