import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="homeInstrutor" options={{ headerShown: false }} />
      <Stack.Screen name="telaConfig" options={{ headerShown: false }} />
      <Stack.Screen name="telaCadastroAluno" options={{ headerShown: false }} />

            {/* FLUXO DO ALUNO */}
            <Stack.Screen name="telaListaAlunos" options={{ headerShown: false }}/>
            <Stack.Screen name="telaAluno" options={{ headerShown: false }}/>
            <Stack.Screen name="telaCalendarioTreino" options={{ headerShown: false }}/>
            <Stack.Screen name="telaListaPressaoGlicemia" options={{ headerShown: false }}/>

      <Stack.Screen
        name="(graficos)/triagemGraficos"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(graficos)/telaGraficoDuracao"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(graficos)/telaGraficoEsforco"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(graficos)/telaGraficoSatisfacao"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="(graficos)/telaGraficoCstCorpo"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(graficos)/telaGraficoCstMental"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(graficos)/telaGraficoCstCabeca"
        options={{ headerShown: false }}
      />

      <Stack.Screen name="telaDadosInstrutor" options={{ headerShown: false }} />
      <Stack.Screen name="telaAlterarSenha" options={{ headerShown: false }} />

      <Stack.Screen name="telaListaTesteCognitivo" options={{ headerShown: false }} />


    </Stack>
  );
}
