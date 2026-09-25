import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, StatusBar } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { UserInfoServices } from "@/services/UserInfoServices";
import { LoginServices } from "@/services/LoginServices";
import Header from "@/components/headers/header";
import { router, useRouter } from "expo-router";
import { useEffect } from "react";

import { format, toZonedTime } from 'date-fns-tz';

export default function HomeInstrutor() {
  const router = useRouter();

    const fuso = 'America/Sao_Paulo';
    const agora = new Date();
    const dataLocal = toZonedTime(agora, fuso);
  
    const dataFormatada = format(dataLocal, 'dd/MM/yyyy', { timeZone: fuso });
    
  function goToListaAlunos() {
    router.push('/telaListaAlunos');
  }

  function goToCadastroAluno() {
    router.push('/telaCadastroAluno');
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#121212" barStyle="light-content" />
      
      <ImageBackground
        style={styles.homeBg}
        source={require('@/assets/images/appImages/bg.png')}
        resizeMode="cover"
      >
        <Header usuario="Instrutor"/>

        <View style={styles.homeContainer}>
          <View style={styles.linha}>
            <Text style={styles.sectionTitle}>{new Date().toLocaleDateString('pt-BR')}</Text>
          </View>

          <TouchableOpacity onPress={goToListaAlunos} style={styles.actionButton}>
            <Text style={styles.buttonText}>Listar Alunos</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={goToCadastroAluno} style={styles.actionButton}>
            <Text style={styles.buttonText}>Cadastrar Aluno</Text>
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
  homeBg: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 22,
    marginBottom: 20,
  },
  headTitle: {
    fontSize: 26,
    color: 'white',
    fontFamily: 'BalooChettan2-Medium',
    textShadowColor: '#7d7d7d',
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 3,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    paddingTop: 30,
  },
  linha: {
    width: '90%',
    paddingBottom: 15,
    borderBottomColor: '#D0D0D0',
    borderBottomWidth: 1,
    alignItems: 'center',
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#7B7B7B',
    fontFamily: 'BalooChettan2-Medium',
  },
  actionButton: {
    width: '85%',
    height: 55,
    backgroundColor: '#00BA38',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'BalooChettan2-Medium',
  },
});