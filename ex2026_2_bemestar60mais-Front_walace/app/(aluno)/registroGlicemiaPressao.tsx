import Header from "@/components/headers/header";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { useAluno } from "@/api/hooks/useAluno";
import { useAuthStore } from "@/store/authStore";
import InputDefault from "@/components/inputs/InputDefault";
import { router } from "expo-router";

export default function RegistroGlicemiaPressao() {
    const { id } = useAuthStore();
  const { RegistroGlicemiaPressao, GetGlicemiaPressao, verificarAlunoTreinou, loading, error } = useAluno();

  const [glicemiaPre, setGlicemiaPre] = useState("");
  const [glicemiaPos, setGlicemiaPos] = useState("");
  const [pressaoPre, setPressaoPre] = useState("");
  const [pressaoPos, setPressaoPos] = useState("");

  const [ respondeu, setRespondeu ] = useState(false);
  const [ treinou, setTreinou ] = useState<boolean>(false);

  const fetchDados = async () => {
    const dados = await GetGlicemiaPressao();
  
    if(dados.length >= 0) {
      setRespondeu(false);
    }

    if(dados.length >= 1) {
      setRespondeu(true);
    }

    console.log(dados);
  };

  const fetchTreino = async () => {
    const treino = await verificarAlunoTreinou(Number(id));
    console.log(treino);

    if(treino.treinou_hoje) {
      setTreinou(true);
    }
  };

  useEffect(() => {
    fetchDados();
    fetchTreino();
  }, []);

  const handleEnviar = async () => {
    if (!glicemiaPre || !glicemiaPos || !pressaoPre || !pressaoPos) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    const data = {
      date: new Date().toISOString().split("T")[0],
      glycemia: {
        pre_workout: glicemiaPre,
        post_workout: glicemiaPos,
      },
      blood_pressure: {
        pre_workout: pressaoPre,
        post_workout: pressaoPos,
      },
    };

    const resultado = await RegistroGlicemiaPressao(data);

    console.log("resultado: ", resultado);

    if (resultado) {
      Alert.alert("Sucesso", "Dados registrados com sucesso!");
      setGlicemiaPre("");
      setGlicemiaPos("");
      setPressaoPre("");
      setPressaoPos("");
      router.replace("/(aluno)/homeAluno");
    } else {
      Alert.alert("Erro", error || "Não foi possível registrar os dados.");
    }
  };

  if(loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="#121212" barStyle="light-content" />
      
      <ImageBackground
        source={require("@/assets/images/appImages/bg.png")}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <Header usuario="Aluno" />

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <View style={styles.linha}>
              <Text style={styles.sectionTitle}>
                Registro de Glicemia e Pressão
              </Text>
            </View>
            <Text style={styles.description}>
              Registre suas glicemias e pressões antes e depois do treino
            </Text>

            {respondeu && (
              <View style={styles.alertBox}>
                <Text style={styles.alertText}>Você já registrou sua glicemia e pressão.</Text>
              </View>
            )}

            {!treinou && (
              <View style={styles.alertBoxRed}>
                <Text style={{...styles.alertText, color: "#FF0000"}}>Você ainda não treinou hoje. Por favor, treine antes de registrar sua glicemia e pressão.</Text>
              </View>
            )}

            <View style={styles.cardSection}>
              <Text style={styles.subTitle}>
                Controle índice de glicemia (Diabéticos):
              </Text>
              <View style={styles.containerInput}>
                <InputDefault 
                  label={"Índice de glicemia pré-treino"} 
                  value={glicemiaPre} 
                  setValue={setGlicemiaPre} 
                  type="numeric" 
                />

                <InputDefault 
                  label={"Índice de glicemia pós-treino"} 
                  value={glicemiaPos} 
                  setValue={setGlicemiaPos} 
                  type="numeric" 
                />
              </View>
            </View>

            <View style={styles.cardSection}>
              <Text style={styles.subTitle}>Controle de pressão arterial:</Text>
              <View style={styles.containerInput}>
                <InputDefault 
                  label={"Pressão arterial pré-treino"} 
                  value={pressaoPre} 
                  setValue={setPressaoPre} 
                  type="numeric" 
                />

                <InputDefault 
                  label={"Pressão arterial pós-treino"} 
                  value={pressaoPos} 
                  setValue={setPressaoPos}
                  type="numeric" 
                />
              </View>
            </View>

            <View style={{ alignItems: "center" }}>
              <TouchableOpacity
                style={styles.button}
                onPress={handleEnviar}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Enviar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  linha: {
    width: "100%",
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
  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  cardSection: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  containerInput: {
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#fff",
  },

  button: {
    backgroundColor: "#00BA38",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    width: 350,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  alertBox: {
    backgroundColor: "rgba(0, 186, 56, 0.2)", 
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#00BA38",
  },
    alertBoxRed: {
    backgroundColor: "rgba(186, 0, 0, 0.2)", 
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#00BA38",
  },
  alertText: {
    color: "#006b26",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "600",
  },
});
