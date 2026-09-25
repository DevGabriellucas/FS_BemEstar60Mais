import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Alert,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import Header from "@/components/headers/header";
import { useEffect, useState } from "react";
import { useAluno } from "@/api/hooks/useAluno";
import { useAuth } from "@/api/hooks/useAuth";
import InputDefault from "@/components/inputs/InputDefault";

export default function TelaDadosAluno() {
  const { obterDadosUsuario, editarDados, loading, error } = useAuth();

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const carregarDados = async () => {
      const dados = await obterDadosUsuario();
      if (dados) {
        setNome(dados.username || "");
        setTelefone(dados.phone || "");
        setEmail(dados.email || "");
      }
    };
    carregarDados();
  }, []);

  const handleSalvar = async () => {
    const sucesso = await editarDados({
      nome,
      telefone,
      email,
    });

    if (sucesso) {
      Alert.alert("Sucesso", "Dados atualizados com sucesso!");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#121212" barStyle="light-content" />
      
      <ImageBackground
        source={require("@/assets/images/appImages/bg.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <Header usuario="Aluno" disableSettings={true} disableCalendar={true} />
        <View style={styles.bodyContainer}>
          <View style={styles.linha}>
            <Text style={styles.sectionTitle}>Trocar Dados</Text>
          </View>
          <Text style={styles.description}>Altere suas preferências aqui</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#00BA38" />
          ) : (
            <>
              <View style={styles.inputContainer}>
                <InputDefault 
                  label={"Nome"} 
                  value={nome} 
                  setValue={setNome} 
                />
                          
                <InputDefault 
                  label={"Telefone"} 
                  value={telefone} 
                  setValue={setTelefone} 
                  type="numeric" 
                />

                <InputDefault 
                  label={"Email"} 
                  value={email} 
                  setValue={setEmail} 
                />
              </View>

              <TouchableOpacity style={styles.button} onPress={handleSalvar}>
                <Text style={styles.buttonText}>Alterar meus dados</Text>
              </TouchableOpacity>
            </>
          )}

          {error && (
            <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>
          )}
        </View>
      </ImageBackground>
    </View>
  );
};

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
  description: {
    fontSize: 16,
    color: "#7B7B7B",
    marginBottom: 20,
  },
  input: {
    width: 300,
    height: 60,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
    color: "#7d7d7d",
    fontFamily: "Baloo Chettan 2",
    fontSize: 16,
    borderColor: "#D9D9D9",
    borderStyle: "solid",
    borderWidth: 2,
  },
  button: {
    backgroundColor: "#00BA38",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 32,
    width: 300,
  },
  inputContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
