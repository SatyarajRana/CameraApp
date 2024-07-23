import { View, Text, StyleSheet, Button } from "react-native";
import TestComp from "@/components/TestComp";
import { useSharedValue } from "react-native-worklets-core";
import { SharedValue } from "react-native-reanimated";
import { useState, useEffect } from "react";

export default function Index2() {
  const num = useSharedValue(1);
  const [numState, setNumState] = useState(num.value);

  const handleButtonPress = () => {
    num.value = num.value + 1;
    setNumState(num.value); // Update state to trigger re-render
    console.log("Num value is", num.value);
  };

  // Optional: Sync state with shared value changes
  // useEffect(() => {
  //   const updateNumState = () => {
  //     setNumState(num.value);
  //   };

  //   // Assuming you want to listen for changes in num.value
  //   const unsubscribe = num.onChange(updateNumState);

  //   return () => {
  //     unsubscribe(); // Clean up the listener on unmount
  //   };
  // }, [num]);

  return (
    <View style={styles.container}>
      <Text>Index2</Text>
      <TestComp num={numState} />
      <Button title="Increment" onPress={handleButtonPress} />
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
