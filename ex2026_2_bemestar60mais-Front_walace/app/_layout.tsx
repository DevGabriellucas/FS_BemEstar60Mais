import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="recuperarConta" options={{ headerShown: false }} />
      <Stack.Screen name="registroPersonal" options={{ headerShown: false }} />
      <Stack.Screen name="(aluno)" options={{ headerShown: false }} />
      <Stack.Screen name="(instrutor)" options={{ headerShown: false }} />
    </Stack>
  );
}