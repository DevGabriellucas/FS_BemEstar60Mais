import { router } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, ActivityIndicator, StatusBar } from "react-native";
import Header from "@/components/headers/header";
import CardALuno from "@/components/cards/cardAluno";
import { alunosMock } from "@/data/alunos";

import { useInstrutor } from "@/api/hooks/useInstrutor";
import { useEffect, useState } from "react";
import { useSelectedAlunoStore } from "@/store/selectedAlunoStore";

export default function TelaListaAlunos() {
  const { listarAlunos, loading } = useInstrutor();
  const { setSelectedAluno } = useSelectedAlunoStore();

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const alunos = await listarAlunos();
      setData(alunos || []);
      console.log(alunos);
    };

    fetchData();
  }, []);

  const handleAddAluno = (id: number, name: string) => {
    setSelectedAluno(id, name);
    router.push(`/telaAluno`);
  };

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
            <Text style={styles.sectionTitle}>Lista de Alunos</Text>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#333" />
          ) : (
            <>
              <Text style={styles.questionText}>
                Abaixo todos os alunos cadastrados
              </Text>

              <ScrollView>
                {data.length > 0 ? (
                  data.map((aluno: any) => (
                    <CardALuno
                      key={aluno.id}
                      nome={aluno.username}
                      id={aluno.id}
                      goToAluno={() => handleAddAluno(aluno.id, aluno.username)}
                    />
                  ))
                ) : (
                  <Text style={{ textAlign: "center", marginTop: 20 }}>
                    Nenhum aluno encontrado.
                  </Text>
                )}
              </ScrollView>
            </>
          )}
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
    // CORPO
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
    
    // CONTEUDO TELA
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
    marginBottom: 16,
    textAlign: "center",
    },
});