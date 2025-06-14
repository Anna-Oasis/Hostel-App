import React from "react";
import { Modal } from "react-native";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { Spinner } from "@/components/ui/spinner";
import useLoadingStore from "@/stores/loadingStore";

const Loader = () => {
  const isLoading = useLoadingStore((state) => state.isLoading);

  return (
    <Modal
      visible={isLoading}
      transparent
      animationType="fade"
      onRequestClose={() => {}}
      statusBarTranslucent={true}
    >
      <Box className="absolute inset-0 flex-1 justify-center items-center bg-black/50 p-20 z-50">
        <Center className="flex-1">
          <Spinner size="large" />
        </Center>
      </Box>
    </Modal>
  );
};

export default Loader;
