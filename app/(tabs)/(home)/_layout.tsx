import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#f4511e",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen name="index2" options={{ title: "Index2" }} />
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="camera" />
    </Stack>
  );
}
