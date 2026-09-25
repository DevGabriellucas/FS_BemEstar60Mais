import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ActivityIndicator, SafeAreaView, ScrollView, StatusBar  } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import Header from "@/components/headers/header";
import CalendarioTreino from "@/components/calendarios/calendarioTreino";
import { alunosMock } from "@/data/alunos";
import { useInstrutor } from "@/api/hooks/useInstrutor";
import { useEffect, useState } from "react";
import { useSelectedAlunoStore } from "@/store/selectedAlunoStore";



export default function TelaCalendarioTreino() {
    const { id, name } = useSelectedAlunoStore();

    const { diasTreinados, loading, error } = useInstrutor();
    const [listaDiasTreinados, setListaDiasTreinados] = useState([]);
    const [listaDiasNaoTreinados, setListaDiasNaoTreinados] = useState([]);

    const fetchDiasTreinados = async () => {
        const response = await diasTreinados(Number(id), '06', '2025');

        setListaDiasTreinados(response.diasTreinados);
        setListaDiasNaoTreinados(response.diasNaoTreinados);

        console.log(response);
    }

    useEffect(() => {
        fetchDiasTreinados();
    }, []);

    function goToCalendario() {
        router.push({
            pathname: '/triagemGraficos',
            params: { id },
        })
    }

    function goToPressaoGlicemia(){
        router.push({
            pathname: '/telaListaPressaoGlicemia',
            params: { id },
        })
    }

    if (loading) {
        return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#007BFF" />
        </View>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar backgroundColor="#121212" barStyle="light-content" />
            <ImageBackground
                style={styles.background}
                source={require('@/assets/images/appImages/bg.png')}
                resizeMode="cover"
            >
                <Header usuario="Instrutor" />

                <View style={styles.bodyContainer}>
                    <View style={styles.linha}>
                        <Text style={styles.sectionTitle}>{name}</Text>
                    </View>

                    <Text style={styles.questionText}>Calendario de frequencia de treino</Text>

                    <View style={styles.calendarContainer}>
                        <CalendarioTreino 
                            diasTreinados={listaDiasTreinados}  
                            diasNaoTreinados={listaDiasNaoTreinados} 
                        />
                    </View>

                    <View style={styles.legendContainer}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendCircle, { backgroundColor: 'red' }]} />
                            <Text style={styles.legendText}>Treino feito</Text>
                        </View>

                        <View style={styles.legendItem}>
                            <View style={[styles.legendCircle, { backgroundColor: 'green' }]} />
                            <Text style={styles.legendText}>Não Treinou</Text>
                        </View>

                        <View style={styles.legendItem}>
                            <View style={[styles.legendCircle, { backgroundColor: '#FFC107' }]} />
                            <Text style={styles.legendText}>pendente</Text>
                        </View>
                    </View>

                    <ScrollView style={{flex: 1, height: 300}}>
                        <TouchableOpacity onPress={goToCalendario}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>Ver grafico de treino</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={goToPressaoGlicemia}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>Listar pressão e glicemia</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => router.push(`/telaListaTesteCognitivo`)}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>Lista testes cognitivos</Text>
                            </View>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </ImageBackground>
        </SafeAreaView>
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
});