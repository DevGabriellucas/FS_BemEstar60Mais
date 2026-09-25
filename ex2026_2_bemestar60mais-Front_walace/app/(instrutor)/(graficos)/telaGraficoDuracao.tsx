import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, ActivityIndicator, StatusBar } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import Header from "@/components/headers/header";
import Graficos from "@/components/graficos/graficos";

import { alunosMock } from "@/data/alunos";
import { useSelectedAlunoStore } from "@/store/selectedAlunoStore";

import { useInstrutor } from "@/api/hooks/useInstrutor";
import { useEffect, useState } from "react";

export default function TelaGraficoDuracao() {
    const { id } = useSelectedAlunoStore();
    const [ aluno, setAluno ] = useState(null);

    const { graficoDuracao, loading, error } = useInstrutor();

    const fetchGraficos = async () => {
        const response = await graficoDuracao(Number(id));
        setAluno(response);
        console.log(response);

    };

    useEffect(() => {
        fetchGraficos();
    }, []);

    function goBack() {
        router.back();
    }

    if(loading || !aluno) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#007BFF" />
        </View>
      );
    }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="#121212" barStyle="light-content" />
      
      <ImageBackground
        style={styles.background}
        source={require("@/assets/images/appImages/bg.png")}
        resizeMode="cover"
      >
        <Header usuario="Instrutor" />

        <View style={styles.bodyContainer}>
          <View style={styles.linha}>
            <Text style={styles.sectionTitle}>Gráfico de Duração</Text>
          </View>

          <Text style={styles.descriptionText}>
            Acompanhe a evolução de desempenho ao longo do tempo.
          </Text>

          <Graficos
            data={aluno}
            colorMain="rgb(34, 193, 34)"
            colorSecondary="rgb(144, 238, 144)"
            title="Duracao"
            labelX="Dias"
            labelY="Duração"
          />
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  bodyContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 40,
  },
  linha: {
    width: "90%",
    paddingBottom: 15,
    borderBottomColor: "#D0D0D0",
    borderBottomWidth: 1,
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: "#7B7B7B",
    fontWeight: "bold",
  },
  descriptionText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  mockGraph: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 300,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#00BA38",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});