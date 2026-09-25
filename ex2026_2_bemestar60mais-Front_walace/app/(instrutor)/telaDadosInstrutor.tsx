import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, TextInput, ActivityIndicator, StatusBar } from "react-native";
import Header from "@/components/headers/header";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useInstrutor } from "@/api/hooks/useInstrutor";
import { useAuth } from "@/api/hooks/useAuth";

import InputDefault from "@/components/inputs/InputDefault";

export default function TelaDadosInstrutor () {
  const { obterDadosUsuario, editarDados, loading, error } = useAuth();

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");

  const fetchDados = async () => {
    const dados = await obterDadosUsuario();
    if (dados) {
      setNome(dados.username || "");
      setTelefone(dados.phone || "");
      setEmail(dados.email || "");
    }

    console.log(dados);
  };

  useEffect(() => {
    fetchDados();
  }, []);

  const handleSalvar = async () => {
    const userEditado = { username: nome, phone: telefone, email: email };

    const response = await editarDados(userEditado);

    console.log(response);

    if (response?.message) {
      alert("Dados atualizados com sucesso!");
    } else {
      alert("Erro ao editar os dados. Verifique as informações e tente novamente.");
    }

  };

  if(loading){
    return(
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    )
  }

  return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#121212" barStyle="light-content" />
      <ImageBackground
        source={require("@/assets/images/appImages/bg.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <Header usuario="Aluno" disableSettings={true} disableCalendar={true}/>
        <View style={styles.bodyContainer}>
        <View style={styles.linha}>
            <Text style={styles.sectionTitle}>Trocar Dados</Text>
        </View>
        <Text style={styles.description}> 
            Altere suas preferencias aqui
        </Text>

        <View style={styles.inputContainer}>
          <InputDefault 
            label={"Digite seu nome"} 
            value={nome} 
            setValue={setNome} 
          />

          <InputDefault 
            label={"Digite seu telefone"} 
            value={telefone} 
            setValue={setTelefone} 
            type="numeric" 
          />

          <InputDefault 
            label={"Digite seu email"} 
            value={email} 
            setValue={setEmail} 
          />
        </View>

       <TouchableOpacity style={styles.button} onPress={handleSalvar} disabled={loading}>
            <Text style={styles.buttonText}>
              {loading ? "Salvando..." : "Alterar meus dados"}
            </Text>
          </TouchableOpacity>
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
    backgroundColor: "#00BA38", // Cor verde para o botão
    paddingVertical: 14, // Padding vertical para aumentar a área clicável
    borderRadius: 10, // Bordas arredondadas
    alignItems: "center", // Alinha o texto do botão ao centro
    marginTop: 32,
    width: 300 // Espaçamento superior
  },
  inputContainer: {
    width: "100%",
    paddingHorizontal: 24,
    gap: 12,
    alignItems: "center",
  },
    buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  label: {
    alignSelf: 'flex-start',
    marginBottom: 4,
    color: "#7B7B7B",
    fontSize: 14,
    fontWeight: "bold",
  },
});