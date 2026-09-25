import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, ScrollView, ActivityIndicator, StatusBar } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import Header from "@/components/headers/header";
import Graficos from "@/components/graficos/graficos";

import { alunosMock } from "@/data/alunos";
import { useSelectedAlunoStore } from "@/store/selectedAlunoStore";
import { useEffect, useState } from "react";
import { useInstrutor } from "@/api/hooks/useInstrutor";

export default function TelaGraficoEsforco() {
    const { id } = useSelectedAlunoStore();
    const [ aluno, setAluno ] = useState(null);

    const { graficoEsforco, loading, error } = useInstrutor();

    const fetchGraficos = async () => {
        const response = await graficoEsforco(Number(id));
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

        <ScrollView>

        <View style={styles.bodyContainer}>
          <View style={styles.linha}>
            <Text style={styles.sectionTitle}>Gráfico de Esforço</Text>
          </View>

          <Text style={styles.descriptionText}>
            Acompanhe a evolução de desempenho ao longo do tempo.
          </Text>

          <Graficos
            data={aluno}
            colorMain="rgb(255, 140, 0)"
            colorSecondary="rgb(255, 200, 100)"
            title="Esforço"
            labelX="Dias"
            labelY="Nivel"
          />

          {/* LEGENDA DA ESCALA DE BORG */}
        <View style={styles.legendContainer}>
            <Text style={styles.legendTitle}>Escala de Borg</Text>

            {[
                { label: "10", valor: "6", cor: "#FF4C4C" },
                { label: "9", valor: "5", cor: "#FF944C" },
                { label: "7–8", valor: "4", cor: "#FFD54C" },
                { label: "4–6", valor: "3", cor: "#B2FF4C" },
                { label: "2–3", valor: "2", cor: "#4CFFB0" },
                { label: "1", valor: "1", cor: "#4CDEFF" },
            ].map((item, index) => (
                <View key={index} style={styles.legendItem}>
                <View style={[styles.dot, { backgroundColor: item.cor }]} />
                <Text style={styles.legendLabel}>Borg {item.label}</Text>
                <Text style={styles.legendValue}>Nível {item.valor}</Text>
                </View>
            ))}
            </View>
        </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
    scrollContent: {
  alignItems: "center",
  paddingBottom: 40,
},
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

  // LEGENDA
  legendContainer: {
    width: "90%",
    marginTop: 20,
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: "#F3F3F3",
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 10,
    textAlign: "center",
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  legendLabel: {
    fontSize: 14,
    color: "#555",
  },
  legendValue: {
    fontSize: 14,
    color: "#000",
    fontWeight: "bold",
  },

  button: {
    width: 300,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#00BA38",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});