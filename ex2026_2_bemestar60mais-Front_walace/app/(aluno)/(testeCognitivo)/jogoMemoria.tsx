import { useAluno } from "@/api/hooks/useAluno";
import Header from "@/components/headers/header";
import Cartao from "@/components/jogosCognitivos/cartao";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ImageBackground, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, StatusBar } from "react-native";

import { format, toZonedTime } from 'date-fns-tz';

const icones = [
  { id: 1, icone: "circle" },
  { id: 2, icone: "square" },
  { id: 3, icone: "star" },
  { id: 4, icone: "heart" },
];

const pares = [...icones, ...icones];
const embaralhar = () => [...pares].sort(() => Math.random() - 0.5);

export default function JogoMemoria() {
    const { registrarSessaoJogo, loading, error } = useAluno();

  const [cartoes, setCartoes] = useState(embaralhar());
  const [virados, setVirados] = useState<number[]>([]);
  const [resolvidos, setResolvidos] = useState<number[]>([]);
  const [pontos, setPontos] = useState(0);
  const [erros, setErros] = useState(0);
  const [inicio, setInicio] = useState<number | null>(null);
  const [fim, setFim] = useState<number | null>(null);

  const [tempoJogadaInicio, setTempoJogadaInicio] = useState<number | null>(null);
  const [temposDeResposta, setTemposDeResposta] = useState<number[]>([]);

  const [mostrarCartasIniciais, setMostrarCartasIniciais] = useState(true);

  useEffect(() => {
  // Mostrar todas as cartas por 3 segundos
  const timeout = setTimeout(() => {
    setMostrarCartasIniciais(false);
  }, 3000);

  return () => clearTimeout(timeout);
}, []);

  const virarCartao = (index: number) => {
    if (virados.length < 2 && !virados.includes(index) && !resolvidos.includes(index)) {
      setVirados((prev) => [...prev, index]);

      if (inicio === null) {
        setInicio(Date.now());
      }

      if (virados.length === 0) {
        setTempoJogadaInicio(Date.now()); // Início da jogada
      }
    }
  };

  useEffect(() => {
    if (virados.length === 2) {
      const [i1, i2] = virados;
      const match = cartoes[i1].id === cartoes[i2].id;

      const agora = Date.now();
      if (tempoJogadaInicio !== null) {
        const tempoResposta = (agora - tempoJogadaInicio) / 1000;
        setTemposDeResposta((prev) => [...prev, tempoResposta]);
      }

      setTimeout(() => {
        if (match) {
          setResolvidos((prev) => [...prev, i1, i2]);
          setPontos((p) => p + 1);
        } else {
          setErros((e) => e + 1);
        }
        setVirados([]);
        setTempoJogadaInicio(null); // Reset após jogada
      }, 800);
    }
  }, [virados]);

  useEffect(() => {
    if (resolvidos.length === cartoes.length && resolvidos.length > 0) {
      setFim(Date.now());
    }
  }, [resolvidos]);

  const tempoTotal = fim && inicio ? ((fim - inicio) / 1000).toFixed(1) : null;
  const respostaMaisRapida = temposDeResposta.length ? Math.min(...temposDeResposta).toFixed(1) : null;
  const respostaMaisLenta = temposDeResposta.length ? Math.max(...temposDeResposta).toFixed(1) : null;

  const concluirJogo = async () => {
    const fuso = 'America/Sao_Paulo';
    const agora = new Date();
    const dataLocal = toZonedTime(agora, fuso);
    const dataFormatada = format(dataLocal, 'dd-MM-yyyy', { timeZone: fuso });

    const resultado = {
        date: new Date().toLocaleDateString("pt-BR").replace(/\//g, "-"),
        correct_answers: Number(pontos),
        incorrect_answers: Number(erros),
        total_time: Number(tempoTotal),
        fastest_response: Number(respostaMaisRapida),
        slowest_response: Number(respostaMaisLenta),
    };

    console.log("Resultado:", resultado);
    
    const response = await registrarSessaoJogo(resultado);

    console.log("response: ", error);

    if (response && response.detail) {
        alert('Jogos realizados com sucesso!');
        router.replace("/menu");
    } else if (!response) {
        console.log('Erro ao alterar ficha!', error);
        alert(error || 'Erro ao finalizar os jogos');
        router.replace("/menu");
    } else {
        alert('Resposta inesperada da API');
        router.replace("/menu");
    }
  };

  if(loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="#121212" barStyle="light-content" />

      <ImageBackground
        style={styles.background}
        source={require("@/assets/images/appImages/bg.png")}
        resizeMode="cover"
      >
        <Header usuario="Aluno" disableSettings={true} disableCalendar={true} />

        <View style={styles.bodyContainer}>
          <View style={styles.linha}>
            <Text style={styles.sectionTitle}>Jogo da memória</Text>
          </View>

          {resolvidos.length === cartoes.length && (
            <TouchableOpacity style={styles.button} onPress={concluirJogo}>
              <Text style={styles.buttonText}>Concluir</Text>
            </TouchableOpacity>
          )}

          <View style={styles.container}>
            <Text style={styles.pontos}>Pontos: {pontos}</Text>
            <Text style={styles.erros}>Erros: {erros}</Text>
            {tempoTotal && (
              <Text style={styles.tempo}>Tempo: {tempoTotal}s</Text>
            )}

            <View style={styles.grid}>
              {cartoes.map((item, index) => (
                <Cartao
                  key={index}
                  index={index}
                  valor={item.icone}
                  virado={mostrarCartasIniciais || virados.includes(index)}
                  resolvido={resolvidos.includes(index)}
                  onPress={() => virarCartao(index)}
                />
              ))}
            </View>
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
  container: {
    marginTop: 20,
    alignItems: "center",
  },
  pontos: {
    fontSize: 18,
    marginBottom: 5,
    color: "#333",
  },
  erros: {
    fontSize: 16,
    color: "red",
    marginBottom: 5,
  },
  tempo: {
    fontSize: 16,
    color: "#444",
    marginBottom: 5,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 250,
    justifyContent: "center",
    gap: 12,
  },

  button: {
    width: 300,
    backgroundColor: "#00BA38",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 32,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});