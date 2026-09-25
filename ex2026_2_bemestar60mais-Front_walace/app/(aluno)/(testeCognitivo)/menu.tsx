import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, ActivityIndicator, StatusBar } from "react-native";
import Header from "@/components/headers/header";
import { router } from "expo-router";

import { useAluno } from "@/api/hooks/useAluno";
import { useEffect, useState } from "react";

export default function Menu() {
    const { GetJogosCognitivos, loading, error } = useAluno();
    const [ jogou, setJogou ] = useState(false);

    const handleJogar = () => {
        router.replace("/jogoMemoria");
    }

    const fetchDados = async () => {
       const dados =  await GetJogosCognitivos();

       if(dados.length >= 0) {
        setJogou(false);

        console.log("não jogou")
       }

       if(dados.length >= 1) {
        setJogou(true);

        console.log("jogou");
       }

       console.log(dados);
    }

    useEffect(() => {
        fetchDados();
    }, []);

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
                source={require('@/assets/images/appImages/bg.png')}
                resizeMode="cover"
            >
                <Header usuario="Aluno" />

                <View style={styles.bodyContainer}>
                    <View style={styles.linha}>
                        <Text style={styles.sectionTitle}>Jogos cognitivos</Text>
                    </View>

                    <Text style={styles.questionText}>Faça o teste dos jogos cognitivos</Text>

                    {jogou && (
                    <View style={styles.alertBox}>
                        <Text style={styles.alertText}>Você já respondeu o jogo cognitivo.</Text>
                    </View>
                    )}

                    <View>
                        <TouchableOpacity onPress={handleJogar} style={styles.button}>
                            <Text style={styles.buttonText}>Jogar</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.explicacaoContainer}>
                        <Text style={styles.explicacaoTexto}>
                            O jogo da memória testa sua atenção e agilidade. Toque nos cartões para revelá-los e tente encontrar os pares iguais. Quanto mais rápido e preciso você for, maior será sua pontuação. O resultado do teste serve para medir o seu progresso cognitivo.
                        </Text>
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
    questionText: {
        fontSize: 16,
        color: "#666",
        marginBottom: 16,
        textAlign: "center",
    },
    button: {
        width: 300,
        backgroundColor: "#007BFF",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 16,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },

    // Estilo do container explicativo
    explicacaoContainer: {
        width: "90%",
        backgroundColor: "rgba(0, 123, 255, 0.1)",
        padding: 16,
        borderRadius: 8,
    },
    explicacaoTexto: {
        color: "#0056b3",
        fontSize: 16,
        textAlign: "center",
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