import { router } from "expo-router";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
    TextInput,
    Alert,
    StatusBar,
} from "react-native";
import { useState } from "react";
import Header from "@/components/headers/header";

import { useInstrutor } from "@/api/hooks/useInstrutor";
import InputDefault from "@/components/inputs/InputDefault";

export default function TelaCadastroAluno() {
    const { cadastrarAluno, loading, error } = useInstrutor();

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const [senhaInvalida, setSenhaInvalida] = useState(false);

    const createAluno = async () => {
        if (senha.length < 8) {
        setSenhaInvalida(true);
        return;
        }

        const response = await cadastrarAluno({
            username: nome,
            password: senha,
            email: email,
            role: "usuario",
            phone: "999999999"
        });

        if (response.message) {
            Alert.alert("Aluno cadastrado com sucesso!");
            router.push("/(instrutor)/homeInstrutor");
        }
    };

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
                    <Text style={styles.title}>Cadastro de Aluno</Text>

                    {error && (
                        <View style={styles.alertBox}>
                        <Text style={styles.alertText}>{error}</Text>
                        </View>
                    )}

                    {senhaInvalida && (
                        <View style={styles.alertBox}>
                        <Text style={styles.alertText}>A senha deve ter no mínimo 8 caracteres.</Text>
                        </View>
                    )}

                    <InputDefault 
                        label={"Nome completo"} 
                        value={nome} 
                        setValue={setNome} 
                    />

                    <InputDefault 
                        label={"Email"}
                        value={email}
                        setValue={setEmail}
                    />

                    <InputDefault 
                        label={"Senha"}
                        value={senha}
                        setValue={setSenha}
                    />

                    <TouchableOpacity style={styles.buttonNext} onPress={createAluno}>
                        <Text style={styles.buttonText}>Cadastrar</Text>
                    </TouchableOpacity>
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
        paddingHorizontal: 20,
        gap: 10
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 15,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    buttonNext: {
        width: '100%',
        alignItems: 'center',
        marginTop: 20,
        backgroundColor: '#4A90E2',
        padding: 15,
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },

    alertBox: {
        backgroundColor: "rgba(255, 0, 0, 0.1)", // Vermelho claro translúcido
        padding: 10,
        borderRadius: 8,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#cc0000", // Vermelho mais forte
    },
    alertText: {
        color: "#cc0000", // Mesmo tom do border
        fontSize: 14,
        textAlign: "center",
        fontWeight: "600",
    },
});
