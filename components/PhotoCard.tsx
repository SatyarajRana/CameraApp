import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Animated,
} from "react-native";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";

type PhotoIdentifier = {
  node: {
    image: {
      uri: string;
    };
  };
  totalCards: number;
  index: number;
  isFirst: boolean;
  swipe: Animated.ValueXY;
};

export const PhotoCardWidth = Dimensions.get("screen").width * 0.8;

const PhotoCard = ({
  node,
  totalCards,
  index,
  isFirst,
  swipe,
  ...rest
}: any) => {
  const rotate = swipe.x.interpolate({
    inputRange: [-PhotoCardWidth, 0, PhotoCardWidth],
    outputRange: ["-30deg", "0deg", "30deg"],
  });

  return (
    <Animated.View
      style={[
        styles.card,
        isFirst && {
          transform: [...swipe.getTranslateTransform(), { rotate: rotate }],
        },
      ]}
      {...rest}
    >
      <Image
        key={0}
        style={[StyleSheet.absoluteFill, styles.image]}
        source={{ uri: node.image.uri }}
      />

      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.7)"]}
        style={[StyleSheet.absoluteFill, { top: "50%" }]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: PhotoCardWidth,
    aspectRatio: 1 / 1.67,
    justifyContent: "flex-end",
    position: "absolute",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
    borderRadius: 15,
  },
  image: {
    borderRadius: 15,
  },
});

export default PhotoCard;
