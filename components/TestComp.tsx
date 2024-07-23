import { View, Text, StyleSheet, Image, Dimensions, Share } from "react-native";
import { SharedValue } from "react-native-reanimated";

type counterIdentifier = {
  num: number;
};

const TestComp = ({ num }: counterIdentifier) => {
  return (
    <View style={styles.container}>
      <Text>{num}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TestComp;
