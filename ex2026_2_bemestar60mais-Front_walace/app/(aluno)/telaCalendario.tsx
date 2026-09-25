import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ActivityIndicator, StatusBar } from "react-native";
import Header from "@/components/headers/header";
import CalendarioTreino from "@/components/calendarios/calendarioTreino";
import { useAluno } from "@/api/hooks/useAluno";
import { useEffect, useState } from "react";

export default function TelaCalendario() {
    const { listarDiasTreinados, loading, error } = useAluno();

    const [listaDiasTreinados, setListaDiasTreinados] = useState([]);
    const [listaDiasNaoTreinados, setListaDiasNaoTreinados] = useState([]);

    const fetchDiasTreinados = async () => {
        const response = await listarDiasTreinados('06', '2025');
        setListaDiasTreinados(response.diasTreinados);
        setListaDiasNaoTreinados(response.diasNaoTreinados);

        console.log(response);
    }

    useEffect(() => {
        fetchDiasTreinados();
    }, []);

    if (loading) {
        return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#007BFF" />
        </View>
        );
    }

    return (
        <View style={{flex: 1}}>
            <StatusBar backgroundColor="#121212" barStyle="light-content" />
            
            <ImageBackground
                style={styles.background}
                source={require('@/assets/images/appImages/bg.png')}
                resizeMode="cover"
            >
                <Header usuario="Aluno" disableCalendar={true} />

                <View style={styles.bodyContainer}>
                    <View style={styles.linha}>
                        <Text style={styles.sectionTitle}>Calendario de treino</Text>
                    </View>
        
                    <Text style={styles.questionText}>Confira suas frequencias de treino</Text>

                    <View style={styles.calendarContainer}>
                        <CalendarioTreino 
                        diasTreinados={listaDiasTreinados}  
                        diasNaoTreinados={listaDiasNaoTreinados} />
                    </View>

                    <View style={styles.legendContainer}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendCircle, { backgroundColor: 'red' }]} />
                            <Text style={styles.legendText}>Dias não treinados</Text>
                        </View>

                        <View style={styles.legendItem}>
                            <View style={[styles.legendCircle, { backgroundColor: 'green' }]} />
                            <Text style={styles.legendText}>Dias treinados</Text>
                        </View>

                        <View style={styles.legendItem}>
                            <View style={[styles.legendCircle, { backgroundColor: '#FFC107' }]} />
                            <Text style={styles.legendText}>Dia pendente (hoje)</Text>
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
        flexDirection: 'column',
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
        fontSize: 18,
        color: '#333',
    },
});