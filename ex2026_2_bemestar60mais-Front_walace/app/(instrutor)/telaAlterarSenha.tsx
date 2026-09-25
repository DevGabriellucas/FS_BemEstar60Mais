import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, TextInput, StatusBar } from "react-native";
import Header from "@/components/headers/header";
import { useState } from "react";
import { useAluno } from "@/api/hooks/useAluno";
import { Alert } from "react-native";
import { useAuth } from "@/api/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";

import InputDefault from "@/components/inputs/InputDefault";

export default function TelaAlterarSenha () {
  const { email } = useAuthStore();
  const { mudarSenha, loading } = useAuth();

  const [senhaAntiga, setSenhaAntiga] = useState("");
  const [novaSenha, setNovaSenha] = useState("");

  const [senhaInvalida, setSenhaInvalida] = useState(false);

  const handleTrocarSenha = async () => {
    if (!senhaAntiga || !novaSenha) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    if (novaSenha.length < 8) {
      setSenhaInvalida(true);
      return;
    }

    const sucesso = await mudarSenha({
      email: email,
      old_password: senhaAntiga,
      new_password: novaSenha,
      confirm_password: novaSenha,
    });

    if (sucesso) {
      Alert.alert("Sucesso", "Senha alterada com sucesso!");
      setSenhaAntiga("");
      setNovaSenha("");
    } else {
      Alert.alert("Erro", "Erro ao alterar a senha. Verifique sua senha atual.");
    }
  };

  if(loading){
    return (
      <View>
        <Text>Carregando...</Text>
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
            Altere sua senha
        </Text>

        {senhaInvalida && (
          <View style={styles.alertBox}>
            <Text style={styles.alertText}>A senha deve ter no mínimo 8 caracteres.</Text>
          </View>
        )}

        <View style={styles.inputContainer}>

          <InputDefault 
            label={"Senha Antiga"} 
            value={senhaAntiga} 
            setValue={setSenhaAntiga} 
          />

          <InputDefault 
            label={"Nova Senha"} 
            value={novaSenha} 
            setValue={setNovaSenha} 
          />
        </View>

      <TouchableOpacity style={styles.button} onPress={handleTrocarSenha} disabled={loading}>
            <Text style={styles.buttonText}>
              {loading ? "Salvando..." : "Alterar minha senha"}
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
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
    buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },


  alertBox: {
    backgroundColor: "rgba(255, 0, 0, 0.1)", // Vermelho claro translúcido
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#cc0000", // Vermelho mais forte
  },
  alertText: {
    color: "#cc0000", // Mesmo tom do border
    fontSize: 14,
    textAlign: "center",
    fontWeight: "600",
  },
});