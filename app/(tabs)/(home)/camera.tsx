import { View, Text, StyleSheet } from "react-native";
import CameraComponent from "@/components/Camera";

export default function CameraScreen() {
  return (
    <View style={styles.container}>
      <CameraComponent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
