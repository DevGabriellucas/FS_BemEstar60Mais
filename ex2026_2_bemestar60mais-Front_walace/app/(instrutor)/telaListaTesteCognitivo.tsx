import { useInstrutor } from "@/api/hooks/useInstrutor";
import Header from "@/components/headers/header";
import { useSelectedAlunoStore } from "@/store/selectedAlunoStore";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ImageBackground, StatusBar } from "react-native";

type ResultadoCognitivo = {
  date: string;
  correct_answers: number;
  incorrect_answers: number;
  total_time: number;
  fastest_response: number;
  slowest_response: number;
};

export default function TelaListeTesteCognitivo() {
  const { id, name } = useSelectedAlunoStore();
  const { listarJogosCognitivos, loading, error } = useInstrutor();

  const [resultados, setResultados] = useState<ResultadoCognitivo[]>([]);

  const fetchDados = async () => {
    try {
      const data = await listarJogosCognitivos(id);
      setResultados(data); // salva os dados na state
      console.log(data);
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
    }
  };

  useEffect(() => {
    fetchDados();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="#121212" barStyle="light-content" />
      
      <ImageBackground
        style={styles.background}
        source={require('@/assets/images/appImages/bg.png')}
        resizeMode="cover"
      >
        <Header usuario="Instrutor" />

        <View style={styles.bodyContainer}>
          <View style={styles.linha}>
            <Text style={styles.sectionTitle}>Resultados Cognitivos</Text>
          </View>

          <Text style={styles.questionText}>Resultado dos jogos cognitivos</Text>

            <View style={styles.resultadoLista}>
            {resultados.length > 0 ? (
                resultados.map((item, index) => (
                <View key={index} style={styles.resultadoContainer}>
                    <Text style={styles.resultadoData}>
                    {new Date(item.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </Text>

                    <View style={styles.resultadoLinha}>
                    <Text style={styles.label}>Acertos</Text>
                    <Text style={[styles.valor, styles.acertos]}>{item.correct_answers}</Text>
                    </View>

                    <View style={styles.resultadoLinha}>
                    <Text style={styles.label}>Erros</Text>
                    <Text style={[styles.valor, styles.erros]}>{item.incorrect_answers}</Text>
                    </View>

                    <View style={styles.divisor} />

                    <View style={styles.resultadoLinha}>
                    <Text style={styles.label}>Tempo Total</Text>
                    <Text style={styles.valor}>{item.total_time}s</Text>
                    </View>

                    <View style={styles.resultadoLinha}>
                    <Text style={styles.label}>Resposta Mais Rápida</Text>
                    <Text style={styles.valor}>{item.fastest_response}s</Text>
                    </View>

                    <View style={styles.resultadoLinha}>
                    <Text style={styles.label}>Resposta Mais Lenta</Text>
                    <Text style={styles.valor}>{item.slowest_response}s</Text>
                    </View>
                </View>
                ))
            ) : (
                <Text style={styles.semDados}>Nenhum dado encontrado.</Text>
            )}
            </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
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

    //Sessão de titulo
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

    // Sessão de calendário
    calendarContainer: {
        width: "90%",
        borderRadius: 10,
        overflow: "hidden",
        elevation: 2,
    },

    // Sessão de legendas
    legendContainer: {
        marginTop: 20,
        width: '90%',
        flexDirection: 'row',
        gap: 10,
        marginLeft: 15
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    legendCircle: {
        width: 25,
        height: 25,
        borderRadius: 100,
    },
    legendText: {
        fontSize: 16,
        color: '#333',
    },

    // BTN PROXIMO
    button: {
        width: 300,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: '#00BA38',
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },




    // Sessão de Resultados
    resultadoLista: {
    width: '90%',
    marginTop: 16,
    },
    resultadoTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 16,
    textAlign: 'center',
    },
    resultadoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    },
    resultadoData: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 12,
    textAlign: 'center',
    },
    resultadoLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    },
    label: {
    fontSize: 16,
    color: '#444',
    },
    valor: {
    fontSize: 16,
    fontWeight: 'bold',
    },
    acertos: {
    color: '#2E7D32', // verde
    },
    erros: {
    color: '#C62828', // vermelho
    },
    divisor: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
    },
    semDados: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 12,
    },
});