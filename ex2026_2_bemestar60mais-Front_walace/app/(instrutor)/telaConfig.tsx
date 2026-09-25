import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, StatusBar } from "react-native";
import Header from "@/components/headers/header";
import { router } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

import { BackHandler } from 'react-native';

export default function TelaConfig() {
  const router = useRouter();

  const goToAlterarSenha = () => {
    router.push("/(instrutor)/telaAlterarSenha");
  };

  const gotToAlterarDados = () => {
    router.push("/(instrutor)/telaDadosInstrutor");
  };

  const encerrarSessao = () => {
    console.log("Sessão encerrada");
    BackHandler.exitApp();
  };

    return (
        <View style={styles.container}>
          <StatusBar backgroundColor="#121212" barStyle="light-content" />
          
            <ImageBackground
            source={require('@/assets/images/appImages/bg.png')}
            style={styles.background}
            resizeMode="cover"
            >
                <Header usuario="Instrutor" disableSettings={true} disableCalendar={true}/>
    
                <View style={styles.bodyContainer}>
                    <View style={styles.linha}>
                        <Text style={styles.sectionTitle}>Configurações</Text>
                    </View>
                    <Text style={styles.description}> 
                        Altere suas preferencias aqui
                    </Text>


                <TouchableOpacity style={styles.actionButton} onPress={goToAlterarSenha}>
                    <Text style={styles.buttonText}>Alterar minha senha</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={gotToAlterarDados}>
                    <Text style={styles.buttonText}>Alterar informações de contato</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={encerrarSessao}>
                    <Text style={styles.buttonText}>encerrar sesssão</Text>
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
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
  
    bodyContainer: {
      flex: 1,
      width: '100%',
      backgroundColor: '#fff',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      alignItems: 'center',
      paddingTop: 30,
      paddingBottom: 40,
      paddingHorizontal: 20,
    },
  
    linha: {
      width: '100%',
      paddingBottom: 15,
      borderBottomColor: '#D0D0D0',
      borderBottomWidth: 1,
      alignItems: 'center',
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      color: '#7B7B7B',
      fontWeight: 'bold',
    },
    description: {
      fontSize: 14,
      color: "#666",
      textAlign: "center",
      marginBottom: 24,
    },
  
    actionButton: {
      width: '100%',
      height: 55,
      backgroundColor: '#D1D1D1',
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 10,
      elevation: 2,
    },
    buttonText: {
      color: '#6E6E6E',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });