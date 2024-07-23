import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
// import { runOnJS } from "react-native-reanimated";

import {
  Camera,
  CameraPosition,
  useCameraPermission,
  useCameraDevice,
  useFrameProcessor,
  useSkiaFrameProcessor,
  useCameraFormat,
  runAsync,
  runAtTargetFps,
} from "react-native-vision-camera";
import {
  Face,
  useFaceDetector,
  FaceDetectionOptions,
  Contours,
} from "react-native-vision-camera-face-detector";
import { useSharedValue, Worklets } from "react-native-worklets-core";
import { Skia, ClipOp, TileMode } from "@shopify/react-native-skia";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import * as ImageManipulator from "expo-image-manipulator";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function CameraComponent() {
  const { hasPermission, requestPermission } = useCameraPermission();

  const faceDetectionOptions = useRef<FaceDetectionOptions>({
    performanceMode: "fast",
    landmarkMode: "none",
    classificationMode: "none",
  }).current;

  const [position, setPosition] = useState<CameraPosition>("back");
  const [rotation, setRotation] = useState<number>(0);
  const [translation, setTranslation] = useState<number>(0);
  const device = useCameraDevice(position);

  const aspectRatio = 1;
  const format = useCameraFormat(device, [
    {
      videoResolution: "max",
      // photoAspectRatio: aspectRatio,
      // videoAspectRatio: aspectRatio,
    },
    {
      fps: 60,
    },
  ]);

  const camera = useRef<Camera>(null);
  const { detectFaces } = useFaceDetector(faceDetectionOptions);

  const flipCamera = useCallback(() => {
    setPosition((pos) => {
      if (pos === "back") {
        console.log("back");
        setRotation(270);
        setTranslation(-1350);
      } else {
        console.log("front");
        setRotation(0);
        setTranslation(0);
      }
      return pos === "back" ? "front" : "back";
    });
  }, []);

  const frameProcessor = useSkiaFrameProcessor(
    (frame) => {
      "worklet";

      frame.rotate(rotation, 0, 0);
      frame.translate(0, translation);
      frame.render();
      // }
      runAtTargetFps(25, () => {
        "worklet";
        const faces = detectFaces(frame);

        for (const face of faces) {
          //   console.log("Face detected", face);
          // console.log(frame.height);
          // console.log(frame.width);

          // const rect = Skia.XYWHRect(1820, 970, 100, 100);

          const rect = Skia.XYWHRect(
            1820 - face.bounds.y - face.bounds.height / 1.1,
            970 - face.bounds.x - face.bounds.width / 1.2,
            face.bounds.width + 200,
            face.bounds.height
          );

          const paint = Skia.Paint();
          paint.setColor(Skia.Color("red"));
          paint.setStyle(1);
          paint.setStrokeWidth(10);
          frame.drawRect(rect, paint);
          frame.restore();
        }
      });
    },
    [rotation]
  );

  const handleTakePhoto = async () => {
    try {
      const photo = await camera.current?.takePhoto({
        flash: "off",
      });

      // Check if photo path is available
      if (photo?.path) {
        // Manipulate the image to mirror it
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          photo.path,
          [{ flip: ImageManipulator.FlipType.Horizontal }],

          { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
        );

        // Save the manipulated image to CameraRoll
        await CameraRoll.save(manipulatedImage.uri, {
          type: "photo",
        });
        console.log("Mirrored photo saved:", manipulatedImage.uri);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
    }
  };

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  useEffect(() => {
    flipCamera();
  }, []);

  // Camera permissions granted
  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={styles.cameraContainer}
        device={device}
        isActive={true}
        photo={true}
        format={format}
        frameProcessor={frameProcessor}
        frameProcessorFps={5}
        // pixelFormat="yuv"
        // outputOrientation="device"
        // photoQualityBalance="quality"
        isMirrored={true}
        // zoom={1}
      />
      <View style={styles.captureButtonContainer}>
        <TouchableOpacity
          style={styles.captureButton}
          onPress={handleTakePhoto}
          activeOpacity={0.7}
        >
          <Ionicons name="camera" style={styles.captureButtonIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.flipButton}
          onPress={flipCamera}
          activeOpacity={0.7}
        >
          <Ionicons name="camera-reverse" style={styles.captureButtonIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
  },
  cameraContainer: {
    height: "100%",
    width: "100%",
  },
  captureButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-evenly",
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
  flipButton: {
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
});
