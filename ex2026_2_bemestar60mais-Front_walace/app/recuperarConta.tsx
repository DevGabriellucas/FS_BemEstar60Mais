import { useState } from "react";
import { View, Text, StyleSheet, TextInput, StatusBar, TouchableOpacity, ImageBackground } from "react-native";

import ButtonForm from "@/components/ButtonForm";
import { router } from "expo-router";
import { useAuth } from "@/api/hooks/useAuth";

export default function RecoverAccount() {
    const { resetarSenha, resetarSenhaConfirm, loading, error } = useAuth();

    const [currentStep, setCurrentStep] = useState(0);

    const [email, setEmail] = useState('');
    const [codigoSeguranca, setCodSeguranca] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmSenha, setConfirmSenha] = useState('');

    const [resetPasswordError, setResetPasswordError] = useState(0);
    const [resetPasswordErrorMsg, setResetPasswordErrorMsg] = useState('');

    const sendEmail = async () => {
        if (!email.includes("@")) {
            setResetPasswordError(1);
            setResetPasswordErrorMsg("Email inválido. Insira um email com '@'.");
            return;
        }

        const response = await resetarSenha({ email: email });

        if (!response) return;

        setResetPasswordError(0);
        setResetPasswordErrorMsg('');
        setCurrentStep(1);
    };

    const changePassword = async () => {
        if (senha.length < 8) {
            setResetPasswordError(1);
            setResetPasswordErrorMsg("A senha deve ter no mínimo 8 caracteres.");
            return;
        }

        if (senha !== confirmSenha) {
            setResetPasswordError(1);
            setResetPasswordErrorMsg("As senhas não coincidem.");
            return;
        }

        const response = await resetarSenhaConfirm({ 
            email: email,
            otp: codigoSeguranca,
            new_password: senha,
            confirm_password: senha
        });

        if (!response) {
            setResetPasswordError(1);
            setResetPasswordErrorMsg("Erro ao cadastrar senha.");
            return;
        }

        setResetPasswordError(0);
        setResetPasswordErrorMsg('');
        setCurrentStep(2);
    };

    return (
        <>
            <StatusBar backgroundColor="#121212" barStyle="light-content" />
            <ImageBackground style={styles.loginBg} source={require('../assets/images/appImages/bg.png')}>
                <ImageBackground style={styles.loginBg} source={require('../assets/images/appImages/bg1.png')}>
                    <View style={styles.recoverPage}>
                        <View style={styles.recoverContainer}>
                            {currentStep === 0 && (
                                <View>
                                    <Text style={styles.title}>Redefinir Senha</Text>
                                    <Text style={styles.subTitle}>
                                        Você vai precisar do email utilizado em seu cadastro para recuperar sua conta.
                                    </Text>

                                    <View style={{gap: 10}}>
                                        {error && (
                                            <Text style={styles.errorContainer}>{error}</Text>
                                        )}

                                        {resetPasswordError > 0 && (
                                            <Text style={styles.errorContainer}>{resetPasswordErrorMsg}</Text>
                                        )}
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <View>
                                            <Text style={styles.inputLabel}>Email</Text>
                                            <TextInput
                                                style={styles.recoverInput}
                                                placeholder="Digite seu email"
                                                value={email}
                                                onChangeText={text => {
                                                    setEmail(text);
                                                    if (
                                                    resetPasswordError === 1 && 
                                                    resetPasswordErrorMsg.includes("@") && 
                                                    text.includes("@")
                                                    ) {
                                                        setResetPasswordError(0);
                                                        setResetPasswordErrorMsg('');
                                                    }
                                                }}
                                            />
                                        </View>

                                        <ButtonForm
                                            text="PROSSEGUIR"
                                            color="#ECC256"
                                            onPress={sendEmail}
                                            tamanhoDaFonte={23}
                                            disabled={email.trim() === ''}
                                        />

                                        <TouchableOpacity onPress={() => router.replace("/")} style={{ marginTop: 20 }}>
                                            <Text style={styles.subTitle}>CANCELAR</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}

                            {currentStep === 1 && (
                                <View>
                                    <Text style={styles.title}>Redefinir Senha</Text>
                                    <Text style={styles.subTitle}>
                                        Sua senha deve ter pelo menos 8 caracteres contendo letras, números e símbolo.
                                    </Text>

                                    {resetPasswordError > 0 && (
                                        <Text style={styles.errorContainer}>{resetPasswordErrorMsg}</Text>
                                    )}

                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={styles.recoverInput}
                                            placeholder="Digite o código de segurança"
                                            value={codigoSeguranca}
                                            onChangeText={setCodSeguranca}
                                        />
                                        <TextInput
                                            style={styles.recoverInput}
                                            placeholder="Digite sua nova senha"
                                            secureTextEntry
                                            value={senha}
                                            onChangeText={setSenha}
                                        />
                                        <TextInput
                                            style={styles.recoverInput}
                                            placeholder="Repita sua nova senha"
                                            secureTextEntry
                                            value={confirmSenha}
                                            onChangeText={setConfirmSenha}
                                        />

                                        <ButtonForm
                                            text={loading ? 'AGUARDE...' : 'PROSSEGUIR'}
                                            color="#ECC256"
                                            onPress={changePassword}
                                            tamanhoDaFonte={23}
                                        />

                                        <TouchableOpacity onPress={() => router.replace("/")} style={{ marginTop: 20 }}>
                                            <Text style={styles.subTitle}>CANCELAR</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}

                            {currentStep === 2 && (
                                <View>
                                    <Text style={styles.title}>Sucesso!</Text>
                                    <Text style={styles.subTitle}>
                                        A redefinição de senha foi concluída. Clique no botão abaixo para voltar ao painel de login.
                                    </Text>

                                    <View style={styles.inputContainer}>
                                        <TouchableOpacity onPress={() => router.replace("/")} style={{ marginTop: 20 }}>
                                            <Text style={styles.subTitle}>FAZER LOGIN</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>
                </ImageBackground>
            </ImageBackground>
        </>
    );
}

const styles = StyleSheet.create({
    loginBg: {
        width: '100%',
        height: 1000,
    },
    recoverPage: {
        width: '100%',
        alignItems: 'center',
    },
    recoverContainer: {
        position: 'absolute',
        display: 'flex',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        gap: 8,
        width: 350,
        marginTop: 100,
    },
    recoverInput: {
        width: 300,
        height: 60,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 10,
        color: '#7d7d7d',
        fontFamily: 'BalooChettan2-Medium',
        fontSize: 16,
        borderColor: '#D9D9D9',
        borderStyle: 'solid',
        borderWidth: 2,
    },
    title: {
        fontFamily: 'BalooChettan2-Medium',
        fontSize: 30,
    },
    subTitle: {
        fontFamily: 'BalooChettan2-Medium',
        color: 'gray',
        fontSize: 15,
    },
    inputContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        padding: 10,
    },
    errorContainer: {
        backgroundColor: '#cb0000',
        padding: 10,
        borderRadius: 4,
        fontFamily: 'BalooChettan2-Medium',
        fontSize: 15,
        color: 'white',
    },
    inputLabel: {
        fontFamily: 'BalooChettan2-Medium',
        color: 'gray',
        fontSize: 15,
    },
});