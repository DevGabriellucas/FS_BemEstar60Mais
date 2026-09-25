import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, StatusBar } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import Header from "@/components/headers/header";

export default function TriagemGraficos() {
  const { id } = useLocalSearchParams();

  function navigateToGraficoDuracao() {
    console.log("ID do aluno:", id);

    router.push({
      pathname: "/telaGraficoDuracao",
      params: { id },
    });
  }

  function navigateToGraficoEsforco() {
    console.log("ID do aluno:", id);

    router.push({
      pathname: "/telaGraficoEsforco",
      params: { id },
    });
  }

  function navigateToGraficoSatisfacao() {
    console.log("ID do aluno:", id);

    router.push({
      pathname: "/telaGraficoSatisfacao",
      params: { id },
    });
  }

  function navigateToGraficoCstCabeca() {
    console.log("ID do aluno:", id);

    router.push({
      pathname: "/telaGraficoCstCabeca",
      params: { id },
    });
  }

  function navigateToGraficoCstCorpo() {
    console.log("ID do aluno:", id);

    router.push({
      pathname: "/telaGraficoCstCorpo",
      params: { id },
    });
  }

  function navigateToGraficoCstMental() {
    console.log("ID do aluno:", id);

    router.push({
      pathname: "/telaGraficoCstMental",
      params: { id },
    });
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
            <Text style={styles.sectionTitle}>Triagem de Gráficos</Text>
          </View>

          <Text style={styles.questionText}>Escolha um gráfico para visualizar:</Text>

          <TouchableOpacity onPress={navigateToGraficoDuracao}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Gráfico Duração</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={navigateToGraficoEsforco}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Gráfico Esforço</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={navigateToGraficoSatisfacao}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Gráfico Satisfação</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={navigateToGraficoCstCabeca}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Gráfico controle de saude cabeca</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={navigateToGraficoCstMental}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Gráfico controle de saude mental</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={navigateToGraficoCstCorpo}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Gráfico controle de saude corpo</Text>
            </View>
          </TouchableOpacity>

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
  questionText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    width: 300,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#00BA38",
    marginTop: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});