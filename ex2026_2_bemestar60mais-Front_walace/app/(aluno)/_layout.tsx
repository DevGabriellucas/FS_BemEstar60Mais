import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="homeAluno" options={{ headerShown: false }}/>

      <Stack.Screen name="primeiroAcesso" options={{ headerShown: false }}/>
      <Stack.Screen name="anamneseInicial" options={{ headerShown: false }}/>

      <Stack.Screen name="telaConfig" options={{ headerShown: false }}/>
      <Stack.Screen name="ctsAluno" options={{ headerShown: false }}/>
      <Stack.Screen name="GestaoHidrica" options={{ headerShown: false }}/>
      <Stack.Screen name="fichaAnamnese" options={{ headerShown: false }}/>
      <Stack.Screen name="telaCalendario" options={{ headerShown: false }}/>
      <Stack.Screen name="telaDetalheTreino" options={{ headerShown: false }}/>
      <Stack.Screen name="registroGlicemiaPressao" options={{ headerShown: false }}/>


      <Stack.Screen name="telaDadosAluno" options={{ headerShown: false }}/>
      <Stack.Screen name="telaAlterarSenha" options={{ headerShown: false }}/>
      
      <Stack.Screen name="(testeCognitivo)" options={{ headerShown: false }}/>


    </Stack>
  )
}
