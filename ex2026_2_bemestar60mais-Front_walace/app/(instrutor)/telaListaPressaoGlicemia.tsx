import { View, Text, StyleSheet, ImageBackground, ScrollView, StatusBar } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Header from "@/components/headers/header";
import { alunosMock } from "@/data/alunos";
import { useEffect, useState } from "react";
import { useSelectedAlunoStore } from "@/store/selectedAlunoStore";
import { useInstrutor } from "@/api/hooks/useInstrutor";

type Medicao = {
  label: string;
  pre: number;
  post: number;
};

type DadosPorMes = {
  [mes: string]: Medicao[];
};

type DadoUnificado = {
  mes: string;
  label: string;
  pressaoPre?: number;
  pressaoPos?: number;
  glicemiaPre?: number;
  glicemiaPos?: number;
};

export default function TelaListaPressaoGlicemia() {
    const { id, name } = useSelectedAlunoStore();
    const { listaGlicemia, listaPressao, loading  } = useInstrutor();

    const [dadosUnificados, setDadosUnificados] = useState<DadoUnificado[]>([]);
    const [pressaoData, setPressaoData] = useState<DadosPorMes>({});
    const [glicemiaData, setGlicemiaData] = useState<DadosPorMes>({});

    useEffect(() => {
        console.log(id);
    const fetchData = async () => {
        const pressao = await listaPressao(id);
        const glicemia = await listaGlicemia(id);

        setPressaoData(pressao || {});
        setGlicemiaData(glicemia || {});
    };

    fetchData();
    }, []);

    useEffect(() => {
    const temDados =
        Object.keys(pressaoData).length > 0 ||
        Object.keys(glicemiaData).length > 0;

    if (!temDados) return;

    const unificarDados = (): DadoUnificado[] => {
        const resultado: DadoUnificado[] = [];

        const meses = new Set([
        ...Object.keys(pressaoData),
        ...Object.keys(glicemiaData),
        ]);

        meses.forEach((mes) => {
        const pressaoMes = pressaoData[mes] || [];
        const glicemiaMes = glicemiaData[mes] || [];

        const dias = new Set([
            ...pressaoMes.map((item) => item.label),
            ...glicemiaMes.map((item) => item.label),
        ]);

        dias.forEach((label) => {
            const pressao = pressaoMes.find((i) => i.label === label);
            const glicemia = glicemiaMes.find((i) => i.label === label);

            resultado.push({
            mes,
            label,
            pressaoPre: pressao?.pre,
            pressaoPos: pressao?.post,
            glicemiaPre: glicemia?.pre,
            glicemiaPos: glicemia?.post,
            });
        });
        });

        return resultado;
    };

    const resultado = unificarDados();
    setDadosUnificados(resultado);
    }, [pressaoData, glicemiaData]);

    if (loading) {
        return (
        <View style={{ flex: 1 }}>
            <Text>Carregando...</Text>
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

                <View style={styles.bodyContainer}>
                    <View style={styles.linha}>
                        <Text style={styles.sectionTitle}>{ name }</Text>
                    </View>

                    <Text style={styles.questionText}>
                        Abaixo estão listadas as medições de pressão arterial e glicemia dos alunos.
                    </Text>

                    <ScrollView style={{ width: "90%" }} showsVerticalScrollIndicator={false}>
                        {dadosUnificados.map((item, index) => (
                            <View key={index} style={styles.card}>
                            <Text style={styles.cardDate}>
                                {item.mes.toUpperCase()} - Dia {item.label}
                            </Text>

                            <View style={styles.cardPairRow}>
                                <View style={styles.cardHalf}>
                                <Text style={styles.cardLabel}>Pressão Pré</Text>
                                <Text style={styles.cardValue}>{item.pressaoPre ?? "--"}</Text>
                                </View>
                                <View style={styles.cardHalf}>
                                <Text style={styles.cardLabel}>Pressão Pós</Text>
                                <Text style={styles.cardValue}>{item.pressaoPos ?? "--"}</Text>
                                </View>
                            </View>

                            <View style={styles.cardDivider} />

                            <View style={styles.cardPairRow}>
                                <View style={styles.cardHalf}>
                                <Text style={styles.cardLabel}>Glicemia Pré</Text>
                                <Text style={styles.cardValue}>{item.glicemiaPre ?? "--"}</Text>
                                </View>
                                <View style={styles.cardHalf}>
                                <Text style={styles.cardLabel}>Glicemia Pós</Text>
                                <Text style={styles.cardValue}>{item.glicemiaPos ?? "--"}</Text>
                                </View>
                            </View>
                            </View>
                        ))}
                    </ScrollView>
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
    questionText: {
        fontSize: 16,
        color: "#666",
        marginBottom: 16,
        textAlign: "center",
        paddingHorizontal: 20,
    },

    card: {
        backgroundColor: "#F8F8F8",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
    },
    cardDate: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#2C3E50",
        marginBottom: 10,
        
    },
    cardLine: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },
    cardLabel: {
        fontSize: 14,
        color: "#7B7B7B",
    },
    cardValue: {
        fontSize: 14,
        color: "#333",
        fontWeight: "600",
    },
    cardPairRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        marginBottom: 10,
    },
    cardHalf: {
        flex: 1,
        alignItems: "center",
    },
    cardDivider: {
        height: 1,
        backgroundColor: "#D0D0D0",
        marginVertical: 10,
        width: "100%",
    },

    mesContainer: {
        marginBottom: 24,
        paddingHorizontal: 16,
    },

    mesTitulo: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
});