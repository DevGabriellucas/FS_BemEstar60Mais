import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="menu" options={{ headerShown: false }}/>
      <Stack.Screen name="jogoMemoria" options={{ headerShown: false }}/>
    </Stack>
  )
}