import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, StatusBar } from "react-native";
import Header from "@/components/headers/header";
import { useRouter  } from "expo-router";
import ConfirmTreinoHoje from "@/components/ButtonTreino/ConfirmTreinoHoje";
import { useEffect, useState } from "react";

import { useAluno } from "@/api/hooks/useAluno";
import { useAuthStore } from "@/store/authStore";

import { format, toZonedTime } from 'date-fns-tz';

export default function HomeAluno() {
  const { verificarAlunoTreinou, loading, error } = useAluno();
  const { id } = useAuthStore();

  const router = useRouter();

  const [respondeuHoje, setRespondeuHoje] = useState(false);
  const [treinouHoje, setTreinouHoje] = useState<boolean | null>(null);

  const fuso = 'America/Sao_Paulo';
  const agora = new Date();
  const dataLocal = toZonedTime(agora, fuso);

  const dataFormatada = format(dataLocal, 'dd/MM/yyyy', { timeZone: fuso });

  const fetchDados = async () => {
    const response = await verificarAlunoTreinou(Number(id));
    console.log(response);
    setTreinouHoje(response.treinou_hoje);
  }

  useEffect(() => {
    fetchDados();
  }, []);
  
  function setResposta() {
    router.push("/telaDetalheTreino");
  }

  function goToCsts() {
    router.push("/ctsAluno");
  }

  function goToAnamnese() {
    router.push("/fichaAnamnese");
  }

  function RegistroGlicemiaPressao() {
    router.push("/registroGlicemiaPressao");
  }

  function goToJogosCognitivos() {
    router.push("/(aluno)/(testeCognitivo)/menu");

  }

  if (loading) {
    return (
      <View>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#121212" barStyle="light-content" />
      
      <ImageBackground
        source={require("@/assets/images/appImages/bg.png")}

        style={styles.background}
        resizeMode="cover"
      >
        <Header usuario="Aluno"/>

        <View style={styles.bodyContainer}>
          <View style={styles.linha}>
            <Text style={styles.sectionTitle}>{dataFormatada}</Text>
          </View>

            {loading ? (
              <Text>Carregando...</Text>
            ) : (
              <ConfirmTreinoHoje treinouHoje={treinouHoje} setResposta={setResposta} />
            )}

            <TouchableOpacity onPress={goToCsts} style={styles.actionButton}>
              <Text style={styles.buttonText}>Controle de Saúde</Text>
            </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}
          onPress={() => {router.push("/(aluno)/GestaoHidrica")}}>
            <Text style={styles.buttonText}>Gestão Hídrica</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={goToJogosCognitivos} style={styles.actionButton}>
            <Text style={styles.buttonText}>Treinamento Cognitivo</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={goToAnamnese} style={styles.actionButton}>
            <Text style={styles.buttonText}>Ficha de Anamnese</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={RegistroGlicemiaPressao} style={styles.actionButton}>
            <Text style={styles.buttonText}>Registro de glicemia e pressão</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  headerContainer: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 50,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    color: "white",
    fontWeight: "bold",
    textShadowColor: "#7d7d7d",
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 3,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#D9D9D9",
    alignItems: "center",
    justifyContent: "center",
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
  exerciseButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "75%",
    marginBottom: 30,
  },
  responseButton: {
    width: 110,
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  responseButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  actionButton: {
    width: "85%",
    height: 55,
    backgroundColor: "#ECC256",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    elevation: 3,
  },
  buttonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
});
