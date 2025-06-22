import { View, StyleSheet, Dimensions } from "react-native";
import { Spinner } from "@/components/ui/spinner";
import useLoadingStore from "@/stores/loadingStore";

const Loader = () => {
  const isLoading = useLoadingStore((state) => state.isLoading);

  if (!isLoading) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.center}>
        <Spinner size="large" />
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width,
    height,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 9999,
    justifyContent: "center",
    alignItems: "center",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
});

export default Loader;

