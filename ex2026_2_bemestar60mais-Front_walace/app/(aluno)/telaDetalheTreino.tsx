import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, TextInput, ScrollView, ActivityIndicator, StatusBar } from "react-native";
import Header from "@/components/headers/header";
import IntensidadeBtn from "@/components/groupButtons/intensidadeBtn";
import ButtonForm from "@/components/Buttons/ButtonForm";
import StarRating from "@/components/StarRating/StarRating";
import { useState } from "react";
import { useAluno } from "@/api/hooks/useAluno";
import { router } from "expo-router";
import InputDefault from "@/components/inputs/InputDefault";

import { format, toZonedTime } from 'date-fns-tz';


export default function TelaDetalheTreino() {
  const { cadastrarDiaTreinado, loading, error } = useAluno();

  const [ rating, setRating ] = useState(0);
  const [ instensidade, setIntensidade ] = useState(0);
  const [ tempo, setTempo ] = useState('');
  const [ descricao, setDescricao ] = useState('');

  const agora = new Date();
  const dataNoFusoBrasil = toZonedTime(agora, 'America/Sao_Paulo');
  const dataFormatada = format(dataNoFusoBrasil, 'yyyy-MM-dd', {
    timeZone: 'America/Sao_Paulo',
  });

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    console.log("Rating:", newRating);
  };

  const registrarTreino = async () => {
    const response = await cadastrarDiaTreinado({
      date: dataFormatada,
      workout: {
        status: "done",
        type: descricao,
        time: Number(tempo)
      },
      effort: instensidade,
      rate: rating
    });

    console.log(response);
    console.log("data de envio", new Date().toISOString().split('T')[0])

    if(response.message){
      router.replace("/(aluno)/homeAluno");
      
    }
    //router.replace("/(aluno)/homeAluno");
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

    return(
        <View style={styles.container}>
          <StatusBar backgroundColor="#121212" barStyle="light-content" />
          
          <ImageBackground
          source={require('@/assets/images/appImages/bg.png')}
          style={styles.background}
          resizeMode="cover"
          >
            <Header usuario="Aluno" disableSettings={true} disableCalendar={true}/>

            <ScrollView style={{flexGrow: 1}}>
              <View style={styles.bodyContainer}>
                  <View style={styles.linha}>
                    <Text style={styles.sectionTitle}>Detalhe do Treino</Text>
                  </View>
                  <Text style={styles.description}> 
                      Adicione as informações abaixo sobre o treino de hoje
                  </Text>

                  {error && <Text style={styles.error}>{error}</Text>}

                  <View style={styles.conteinerInput}>

                    <InputDefault label="Qual foi o treino realizado?" value={descricao} setValue={setDescricao} />

                    <InputDefault 
                      label="Quanto tempo durou o seu treino? (minutos)" 
                      value={tempo} 
                      setValue={setTempo} 
                      type='numeric' 
                    />
                  </View>

                  <Text style={styles.subTitle}>Na sua percepção, qual foi o grau de esforço do treino de hoje?</Text>
                  <View style={styles.conteinerInput}>
                    <IntensidadeBtn choice={instensidade} onChange={setIntensidade}/>
                  </View>

                  <Text style={styles.subTitle}>Avalie a sua satisfação com o treino</Text>
                  <View style={styles.conteinerInput}>
                    <StarRating value={rating} onChange={handleRatingChange} />
                  </View>

                  <View style={{gap: 10}}>
                    <TouchableOpacity onPress={registrarTreino} style={styles.button}>
                      <Text style={styles.buttonText}>Enviar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.replace("/(aluno)/homeAluno")} style={styles.button}>
                      <Text style={styles.buttonText}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
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

    subTitle:{
      fontSize: 16,
      color: "#666",
      textAlign: "center",
      marginBottom: 24,
    },

    conteinerInput: {
      gap: 10,
      marginBottom: 20
    },
    label: {
      fontSize: 16,

      color: 'black',
    },
    input: {
        width: 350,
        height: 45,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 10,
        color: '#7d7d7d',
        fontFamily: 'Baloo Chettan 2',
        fontSize: 16,
        borderColor: '#D9D9D9',
        borderStyle: 'solid',
        borderWidth: 2,
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

    error: {
      color: "red",
      marginBottom: 10,
    },
  });