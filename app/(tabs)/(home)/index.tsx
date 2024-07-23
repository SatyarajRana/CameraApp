import {
  View,
  Text,
  StyleSheet,
  Button,
  PanResponder,
  Animated,
  TouchableOpacity,
} from "react-native";
import { Image } from "react-native";
import { Link, Stack } from "expo-router";
// import { CameraRoll } from "@react-native-camera-roll/camera-roll";
// import { Image } from "react-native-reanimated/lib/typescript/Animated";
import PhotoCard from "@/components/PhotoCard";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { useSharedValue } from "react-native-worklets-core";
import { runOnJS, SharedValue } from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";

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

export default function HomeScreen() {
  const [photos, setPhotos] = useState<PhotoIdentifier[]>([]);

  useEffect(() => {
    CameraRoll.getPhotos({
      first: 4,
      assetType: "Photos",
    })
      .then((r) => {
        setPhotos(r.edges);
      })
      .catch((err) => {
        //Error Loading Images
      });
  }, []);
  console.log(photos[0]);

  useEffect(() => {
    if (photos.length === 0) {
      CameraRoll.getPhotos({
        first: 4,
        assetType: "Photos",
      })
        .then((r) => {
          setPhotos(r.edges);
        })
        .catch((err) => {
          //Error Loading Images
        });
    }
  }, [photos]);

  const swipe = useRef(new Animated.ValueXY()).current;
  const panResponser = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onPanResponderMove: (evt, gestureState) => {
      swipe.setValue({ x: gestureState.dx, y: gestureState.dy });
    },
    onPanResponderRelease: (evt, gestureState) => {
      let shouldReturn = Math.abs(gestureState.dx) < 150;
      let mult = gestureState.dx > 0 ? 1 : -1;
      if (shouldReturn) {
        Animated.spring(swipe, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
        return;
      } else {
        Animated.timing(swipe, {
          toValue: { x: 500 * mult, y: 0 },
          useNativeDriver: false,
          duration: 200,
        }).start(removeCard);
        return;
      }
    },
  });

  const removeCard = useCallback(() => {
    setPhotos((prev) => prev.slice(1));
    swipe.setValue({ x: 0, y: 0 });
  }, [swipe]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      {photos
        .map((p, i) => {
          let isFirst = i === 0;
          let dragHandler = isFirst ? panResponser.panHandlers : {};
          return (
            <PhotoCard
              key={i}
              index={i}
              node={p.node}
              totalCards={photos.length}
              isFirst={isFirst}
              swipe={swipe}
              {...dragHandler}
            />
          );
        })
        .reverse()}
      <Link href={"/camera"} style={styles.cameraButton}>
        <Ionicons name="camera" style={styles.captureButtonIcon} />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "black",
  },
  cameraButton: {
    position: "absolute",
    bottom: 20,
  },
  captureButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  captureButtonIcon: {
    fontSize: 30,
    color: "#000",
  },
});
