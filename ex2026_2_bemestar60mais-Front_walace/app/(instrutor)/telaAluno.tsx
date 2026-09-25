import { router, useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, ActivityIndicator, StatusBar } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import Header from "@/components/headers/header";

import { useSelectedAlunoStore } from "@/store/selectedAlunoStore";
import { useInstrutor } from "@/api/hooks/useInstrutor";
import { useEffect, useState } from "react";

export default function TelaAluno() {
  const { id, name } = useSelectedAlunoStore();
  const { buscarAluno, loading } = useInstrutor();
  const [aluno, setAluno] = useState<any>(null);

  const fetchAluno = async () => {
    const response = await buscarAluno(Number(id));
    console.log(response);
    setAluno(response[0]);
  };

  useEffect(() => {
    fetchAluno();
  }, []);

  const goToAluno = () => {
    router.push({ pathname: '/telaCalendarioTreino', params: { id } });
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (!aluno) {
    return (
      <View style={{
        backgroundColor: '#d0f0c0',
        padding: 20,
        margin: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Text style={{
          color: '#2e7d32',
          fontSize: 16,
          textAlign: 'center',
          fontStyle: 'italic',
          marginBottom: 20,
        }}>
          Aluno ainda não respondeu a anamnese inicial
        </Text>

        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            backgroundColor: '#2e7d32',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 16 }}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="#121212" barStyle="light-content" />
      
      <ImageBackground
        style={styles.background}
        source={require('@/assets/images/appImages/bg.png')}
        resizeMode="cover"
      >
        <Header usuario="Instrutor" />

        <ScrollView contentContainerStyle={styles.bodyContainer}>
          <Text style={styles.alunoName}>{name}</Text>

          <View style={styles.conteinerTop}>
            <View style={styles.iconConteiner}>
              <Ionicons name="person-circle-outline" size={75} color="#6b7280" />
            </View>
            <TouchableOpacity style={styles.buttonNext} onPress={goToAluno}>
              <Text style={styles.buttonText}>Calendário Exercício</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitulo}>Ficha de Anamnese</Text>

          {/* Dados básicos */}
          <View style={styles.fichaDadosBasicos}>
            <Text style={styles.dado}>
              <Text style={styles.label}>Data de nascimento:</Text>{' '}
              {aluno.data_nascimento
                ? aluno.data_nascimento.split('-').reverse().join('/')
                : 'Não informado'}
            </Text>
            <Text style={styles.dado}><Text style={styles.label}>Profissão:</Text> {aluno.profissao}</Text>
            <Text style={styles.dado}><Text style={styles.label}>Nome do responsável:</Text> {aluno.nomeDoResponsavel}</Text>
            <Text style={styles.dado}><Text style={styles.label}>Contato do responsável:</Text> {aluno.contatoDoResponsavel}</Text>
            <Text style={styles.dado}><Text style={styles.label}>Participa de projeto de extensão:</Text> {aluno.participaDeExtensao ? 'Sim' : 'Não'}</Text>
          </View>

          {/* Medidas físicas */}
          <View style={styles.fichaMedidasFisicas}>
            <View style={styles.metricBox}>
              <Text style={styles.subtitulo}>Peso</Text>
              <Text style={styles.boxValue}>{aluno.peso} kg</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.subtitulo}>Altura</Text>
              <Text style={styles.boxValue}>{aluno.altura} m</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.subtitulo}>IMC</Text>
              <Text style={styles.boxValue}>{(aluno.peso / (aluno.altura * aluno.altura)).toFixed(2) || 'Não calculado'}</Text>
            </View>
          </View>

          {/* Anamnese detalhada */}
          <View style={styles.fichaAnamneseDetalhada}>
            <Text style={styles.dado}><Text style={styles.label}>Pratica atividade física:</Text> {aluno.praticaAtividade ? 'Sim' : 'Não'}</Text>
            <Text style={styles.dado}><Text style={styles.label}>Faz dieta acompanhada:</Text> {aluno.fazDieta ? 'Sim' : 'Não'}</Text>
            <Text style={styles.dado}><Text style={styles.label}>Quantas refeições por dia:</Text> {aluno.quantasRefeicoes}</Text>
            <Text style={styles.dado}><Text style={styles.label}>Horas de sono:</Text> {aluno.horasDeSono}</Text>
            <Text style={styles.dado}><Text style={styles.label}>Litros de água:</Text> {aluno.litrosDeAgua}</Text>
            <Text style={styles.dado}><Text style={styles.label}>Bebe:</Text> {aluno.bebe ? 'Sim' : 'Não'}</Text>
            <Text style={styles.dado}><Text style={styles.label}>Fuma:</Text> {aluno.fuma ? 'Sim' : 'Não'}</Text>
            <Text style={styles.dado}><Text style={styles.label}>Tem colesterol alto:</Text> {aluno.temColesterolAlto ? 'Sim' : 'Não'}</Text>
            <Text style={styles.dado}><Text style={styles.label}>HDL:</Text> {aluno.hdl}</Text>
            <Text style={styles.dado}><Text style={styles.label}>LDL:</Text> {aluno.ldl}</Text>
            <Text style={styles.dado}><Text style={styles.label}>Tem triglicerídeos alto:</Text> {aluno.temTrigliceridesAlto ? 'Sim' : 'Não'}</Text>
            <Text style={styles.dado}><Text style={styles.label}>É diabético:</Text> {aluno.diabetico ? `Sim - ${aluno.tipoDeDiabete?.join(', ')}` : 'Não'}</Text>
            <Text style={styles.dado}><Text style={styles.label}>Descrição diabetes:</Text> {aluno.descDiabete}</Text>
            <Text style={styles.dado}><Text style={styles.label}>Hipertenso:</Text> {aluno.hipertenso ? 'Sim' : 'Não'}</Text>
            <Text style={styles.dado}><Text style={styles.label}>Descrição hipertensão:</Text> {aluno.descHipertenso}</Text>
            <Text style={styles.dado}><Text style={styles.label}>Problemas respiratórios:</Text> {aluno.temProblemasRespiratorios ? `Sim - ${aluno.descProblemasRespiratorios}` : 'Não'}</Text>
            <Text style={styles.dado}><Text style={styles.label}>Já fez cirurgia:</Text> {aluno.jaFezCirurgia ? `Sim - ${aluno.descCirurgia}` : 'Não'}</Text>
            <Text style={styles.dado}><Text style={styles.label}>Usa medicamento:</Text> {aluno.usaMedicamento ? `Sim - ${aluno.descMedicamento}` : 'Não'}</Text>
            <Text style={styles.dado}><Text style={styles.label}>Recomendação médica:</Text> {aluno.recomendacaoMedica ? 'Sim' : 'Não'}</Text>
            <Text style={styles.dado}><Text style={styles.label}>Objetivos:</Text> {aluno.objetivos?.join(', ') || 'Não informado'}</Text>
            <Text style={styles.dado}><Text style={styles.label}>Sensações:</Text> {aluno.boxSensacoes?.join(', ') || 'Nenhuma relatada'}</Text>
            <Text style={styles.dado}><Text style={styles.label}>Outras razões:</Text> {aluno.outrasRazoes ? `Sim - ${aluno.descOutrasRazoes}` : 'Não'}</Text>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },

  bodyContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  alunoName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },

  conteinerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  iconConteiner: { padding: 8 },

  buttonNext: {
    backgroundColor: '#00BA38',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    minWidth: 160,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  subtitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },

  // Seções coloridas
  fichaDadosBasicos: {
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
  },

  fichaMedidasFisicas: {
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  fichaAnamneseDetalhada: {
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
  },

  metricBox: {
    alignItems: 'center',
    flex: 1,
  },

  boxValue: {
    backgroundColor: '#00BA38',
    color: '#fff',
    padding: 10,
    borderRadius: 8,
    marginTop: 4,
  },

  dado: {
    fontSize: 16,
    marginVertical: 4,
  },

  label: {
    fontWeight: 'bold',
  },

  loading: {
    marginTop: 20,
    textAlign: 'center',
  },
});