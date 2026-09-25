import { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { RadioGroup } from "../../components/radiocts/RadioGroup";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAluno } from "@/api/hooks/useAluno";
import { router } from "expo-router";
import Header from "@/components/headers/header";

const ControleSaude: React.FC = () => {
  // Mente
  const [concentracao, setConcentracao] = useState(0);
  const [faltaMotivacao, setFaltaMotivacao] = useState(0);
  const [estresse, setEstresse] = useState(0);
  const [ansiedade, setAnsiedade] = useState(0);
  const [insonia, setInsonia] = useState(0);
  const [tristeza, setTristeza] = useState(0);

  // Cabeça
  const [enxaqueca, setEnxaqueca] = useState(0);
  const [tonturas, setTonturas] = useState(0);
  const [visao, setVisao] = useState(0);
  const [zumbido, setZumbido] = useState(0);
  const [olhos, setOlhos] = useState(0);

  // Corpo
  const [dorOmbro, setDorOmbro] = useState(0);
  const [dorCostas, setDorCostas] = useState(0);
  const [joelhos, setJoelhos] = useState(0);
  const [caimbras, setCaimbras] = useState(0);
  const [fraqueza, setFraqueza] = useState(0);
  const [doresArticulares, setDoresArticulares] = useState(0);
  const [inchacoPernas, setInchacoPernas] = useState(0);

  const [jaRespondido, setJaRespondido] = useState(false);

  const { registroControleSaude, obterControleSaude, loading, error } = useAluno();

  useEffect(() => {
  const fetchData = async () => {
    const date = new Date().toISOString().split("T")[0];

    const data = await obterControleSaude(date);

    console.log(data);

    if (data) {
      // Mente
      setInsonia(data.mente?.insonia ?? 0);
      setAnsiedade(data.mente?.ansiedade ?? 0);
      setEstresse(data.mente?.estresse ?? 0);
      setFaltaMotivacao(data.mente?.falta_de_motivacao ?? 0);
      setConcentracao(data.mente?.dificuldade_de_concentracao ?? 0);
      setTristeza(data.mente?.tristeza_frequente ?? 0);

      // Cabeça
      setEnxaqueca(data.cabeca?.enxaqueca ?? 0);
      setTonturas(data.cabeca?.tonturas ?? 0);
      setVisao(data.cabeca?.problemas_de_visao ?? 0);
      setZumbido(data.cabeca?.zumbido_no_ouvido ?? 0);
      setOlhos(data.cabeca?.dores_nos_olhos ?? 0);

      // Corpo
      setDorOmbro(data.corpo?.dor_no_ombro ?? 0);
      setDorCostas(data.corpo?.dor_nas_costas ?? 0);
      setJoelhos(data.corpo?.dor_nos_joelhos ?? 0);
      setCaimbras(data.corpo?.caibras ?? 0);
      setFraqueza(data.corpo?.fraqueza ?? 0);
      setDoresArticulares(data.corpo?.dores_articulares ?? 0);
      setInchacoPernas(data.corpo?.inchaco ?? 0);

      setJaRespondido(true);
    }
  };

  fetchData();
}, []);

  const handleEnviar = async () => {
    const data = {
      date: new Date().toISOString().split("T")[0],
      mente: {
        insonia: insonia,
        ansiedade: ansiedade,
        estresse: estresse,
        falta_de_motivacao: faltaMotivacao,
        dificuldade_de_concentracao: concentracao,
        tristeza_frequente: tristeza,
      },
      cabeca: {
        enxaqueca: enxaqueca,
        tonturas: tonturas,
        problemas_de_visao: visao,
        zumbido_no_ouvido: zumbido,
        dores_nos_olhos: olhos,
      },
      corpo: {
        dor_no_ombro: dorOmbro,
        dor_nas_costas: dorCostas,
        dor_nos_joelhos: joelhos,
        caibras: caimbras,
        fraqueza: fraqueza,
        dores_articulares: doresArticulares,
        inchaco: inchacoPernas,
      },
    };

    const result = await registroControleSaude(data);

    if (result) {
      alert("Controle de saúde enviado com sucesso!");
    } else {
      alert("Erro ao enviar controle de saúde.");
    }

    router.replace("/(aluno)/homeAluno");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#121212" barStyle="light-content" />

      {/* Header */}
      <ImageBackground
        source={require("@/assets/images/appImages/bg.png")}
        resizeMode="cover"
      >
        <Header usuario="Aluno" />

        {/* Scroll Content */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.content}>
            <Text style={styles.title}>Controle de Saúde</Text>
            <Text style={styles.description}>
              Preencha o questionário abaixo informando o nível percebido de
              cada sintoma listado, sendo 0 para quando não apresentar o mesmo:
            </Text>

            {jaRespondido && (
              <View style={styles.alertBox}>
                <Text style={styles.alertText}>Você já respondeu o controle de saúde hoje.</Text>
              </View>
            )}

            {/* Mente Section */}
            <View style={styles.sectionContainer}>
              <Text style={styles.section}>Mente</Text>
              <RadioGroup
                title="Insônia"
                selectedValue={insonia}
                onSelect={setInsonia}
              />
              <RadioGroup
                title="Ansiedade"
                selectedValue={ansiedade}
                onSelect={setAnsiedade}
              />
              <RadioGroup
                title="Estresse"
                selectedValue={estresse}
                onSelect={setEstresse}
              />
              <RadioGroup
                title="Falta de Motivação"
                selectedValue={faltaMotivacao}
                onSelect={setFaltaMotivacao}
              />
              <RadioGroup
                title="Dificuldade de Concentração"
                selectedValue={concentracao}
                onSelect={setConcentracao}
              />
              <RadioGroup
                title="Tristeza Frequente"
                selectedValue={tristeza}
                onSelect={setTristeza}
              />

              {/* Cabeça Section */}
              <Text style={styles.section}>Cabeça</Text>
              <RadioGroup
                title="Enxaqueca"
                selectedValue={enxaqueca}
                onSelect={setEnxaqueca}
              />
              <RadioGroup
                title="Tonturas"
                selectedValue={tonturas}
                onSelect={setTonturas}
              />
              <RadioGroup
                title="Problemas de visão"
                selectedValue={visao}
                onSelect={setVisao}
              />
              <RadioGroup
                title="Zumbido no ouvido"
                selectedValue={zumbido}
                onSelect={setZumbido}
              />
              <RadioGroup
                title="Dores nos olhos"
                selectedValue={olhos}
                onSelect={setOlhos}
              />

              {/* Corpo Section */}
              <Text style={styles.section}>Corpo</Text>
              <RadioGroup
                title="Dor no ombro"
                selectedValue={dorOmbro}
                onSelect={setDorOmbro}
              />
              <RadioGroup
                title="Dor nas costas"
                selectedValue={dorCostas}
                onSelect={setDorCostas}
              />
              <RadioGroup
                title="Dor nos joelhos"
                selectedValue={joelhos}
                onSelect={setJoelhos}
              />
              <RadioGroup
                title="Cãibras"
                selectedValue={caimbras}
                onSelect={setCaimbras}
              />
              <RadioGroup
                title="Fraqueza"
                selectedValue={fraqueza}
                onSelect={setFraqueza}
              />
              <RadioGroup
                title="Dores articulares"
                selectedValue={doresArticulares}
                onSelect={setDoresArticulares}
              />
              <RadioGroup
                title="Inchaço nas pernas e pés"
                selectedValue={inchacoPernas}
                onSelect={setInchacoPernas}
              />

              {/* Button */}
              <TouchableOpacity
                style={styles.button}
                onPress={handleEnviar}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Enviando..." : "Enviar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default ControleSaude;

const styles = StyleSheet.create({
  // Header Styles
  headerContainer: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 50,
    marginBottom: 20,
    flexDirection: "row", // Organiza os itens na horizontal
    justifyContent: "space-between", // Espaçamento entre os itens
    alignItems: "center", // Alinha os itens verticalmente
  },
  headerTitle: {
    fontSize: 22,
    color: "white",
    fontWeight: "bold",
    textShadowColor: "#7d7d7d", // Sombras para dar profundidade ao texto
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 3,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20, // Torna o ícone circular
    backgroundColor: "#D9D9D9", // Cor de fundo do ícone
    alignItems: "center",
    justifyContent: "center", // Alinha o conteúdo dentro do ícone
  },

  // Safe Area Styles
  safeArea: {
    flex: 1,
    backgroundColor: "black", // Fundo preto para a área segura
  },

  // Scroll Container Styles
  scrollContainer: {
    flexGrow: 1, // Permite que o ScrollView ocupe o restante do espaço
  },

  // Content Styles
  content: {
    backgroundColor: "#FFF", // Fundo branco para o conteúdo
    borderTopLeftRadius: 20, // Bordas arredondadas no topo esquerdo
    borderTopRightRadius: 20, // Bordas arredondadas no topo direito
    padding: 20, // Espaçamento interno
    paddingBottom: 100, // Espaçamento inferior interno
    alignItems: "center", // Alinha os itens ao centro
    elevation: 4, // Sombra para o conteúdo (efeito de profundidade)
  },

  // Section Container Styles
  sectionContainer: {
    width: "100%", // Garante que a seção ocupe toda a largura
    marginBottom: 20, // Espaçamento inferior
    paddingBottom: 20, // Espaçamento inferior interno
    borderBottomWidth: 1, // Linha separadora na parte inferior
    borderBottomColor: "#ccc", // Cor da linha separadora
  },

  // Section Text Styles
  section: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555", // Cor do texto da seção
    marginTop: 16, // Espaçamento superior
    marginBottom: 8, // Espaçamento inferior
    textAlign: "center", // Alinha o texto ao centro
  },

  // Title and Description Styles
  title: {
    fontSize: 22,
    fontWeight: "700", // Peso de fonte mais pesado
    textAlign: "center", // Alinha o título ao centro
    marginBottom: 12, // Espaçamento inferior
    color: "#222", // Cor escura para o título
  },
  description: {
    fontSize: 14,
    color: "#666", // Cor mais suave para a descrição
    textAlign: "center", // Alinha o texto ao centro
    marginBottom: 24, // Espaçamento inferior
  },

  // Button Styles
  button: {
    backgroundColor: "#00BA38", // Cor verde para o botão
    paddingVertical: 14, // Padding vertical para aumentar a área clicável
    borderRadius: 10, // Bordas arredondadas
    alignItems: "center", // Alinha o texto do botão ao centro
    marginTop: 32, // Espaçamento superior
  },
  buttonText: {
    color: "#FFF", // Cor do texto do botão (branco)
    fontSize: 16,
    fontWeight: "bold", // Texto em negrito
  },

  alertBox: {
  backgroundColor: "rgba(0, 186, 56, 0.2)", 
  padding: 10,
  borderRadius: 8,
  marginBottom: 16,
  borderWidth: 1,
  borderColor: "#00BA38",
},
alertText: {
  color: "#006b26",
  fontSize: 14,
  textAlign: "center",
  fontWeight: "600",
},
});
