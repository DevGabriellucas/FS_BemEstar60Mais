import { StyleSheet, Text, TextInput, Image, View, ImageBackground, TouchableOpacity, StatusBar } from 'react-native';
import { useState } from 'react';

import { Link, useRouter } from 'expo-router';
import ButtonForm from '../components/Buttons/ButtonForm';

import { useAuthStore } from '@/store/authStore';
import { useAuth } from '@/api/hooks/useAuth';

export default function index() {
    const router = useRouter();

    const { login, error, loading } = useAuth();
    const { setAuthData } = useAuthStore();

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const [bgColor, setBgColor] = useState(require('../assets/images/appImages/bg1.png'));
    const [loginTypeText, setLoginTypeText] = useState("Sou Instrutor");
    const [loginType, setLoginType] = useState(0);
    const [welcomeText, setWelcomeText] = useState("Login do Aluno");

    const [errorMessage, setErrorMessage] = useState('');

    const changeLoginType = () => {
        if (loginType === 0) {
            setBgColor(require('../assets/images/appImages/bg2.png'));
            setLoginTypeText("Sou Aluno");
            setLoginType(1);
            setWelcomeText("Login do Instrutor");
        } else {
            setBgColor(require('../assets/images/appImages/bg1.png'));
            setLoginTypeText("Sou Instrutor");
            setLoginType(0);
            setWelcomeText("Login do Aluno");
        }
    };

    async function handleLogin(){
        const resposta = await login({ email: email, password: senha });

        const dados = {
            id: resposta.id,
            email: resposta.email,
            name: resposta.name,
            role: resposta.role,
            isFirstLogin: resposta.isFirstLogin,
            token: resposta.access,
            refresh: resposta.refresh,
            password: senha
        };

        setAuthData(dados);

        if (resposta.role === 'personal') {
            router.replace("/(instrutor)/homeInstrutor");
            
        } else {
            if(resposta.isFirstLogin === true){
                router.replace("/(aluno)/primeiroAcesso");
            }else{
                router.replace("/(aluno)/homeAluno");
            }
        }
    }
    

  return (
    <>
        <StatusBar backgroundColor="#121212" barStyle="light-content" />
        <ImageBackground style={styles.loginBg} source={require('../assets/images/appImages/bg.png')}>
            <ImageBackground style={styles.loginBg} source={bgColor}>
                <View style={styles.mainContainer}>
                    <Image style={styles.logoSettings} source={ require('../assets/images/appImages/logo2.png')}/>

                    <Text style={styles.loginTextTitle}>{welcomeText}</Text>

                    {error && (
                        <View style={{
                            backgroundColor: '#FF4D4F', // vermelho sólido
                            padding: 10,
                            borderRadius: 8,
                            marginTop: 10,
                            width: 300,
                            alignItems: 'center',
                        }}>
                            <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>
                                {error}
                            </Text>
                        </View>
                    )}

                    <TextInput 
                        onChangeText={email => setEmail(email)} 
                        style={styles.loginInput} 
                        placeholder='Digite seu email' 
                    />
                    <TextInput 
                        onChangeText={senha => setSenha(senha)} secureTextEntry={true} style={styles.loginInput} 
                        placeholder='Digite sua senha' 
                    />

                    <View style={{ width:300 }}>
                        <ButtonForm text={loading ? "Carregando..." : "ENTRAR"} color={'#00BA38'} onPress={handleLogin}/>

                        
                        {loginType == 1 && (
                        <TouchableOpacity
                            onPress={() => router.push("/registroPersonal")}
                            style={styles.botao}
                        >
                            <Text style={styles.loginTextSubtitle}>Cadastre-se</Text>
                        </TouchableOpacity>
                        )}
                    </View>

                    <TouchableOpacity onPress={() => router.replace("/recuperarConta")}>
                        <Text style={styles.loginTextSubtitle}>Esqueci minha senha</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={changeLoginType}>
                        <Text style={styles.loginTextSubtitle}>{loginTypeText}</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
    mainContainer: {
        paddingTop: 100,
        alignItems: 'center',
        gap: 8,
    },
    loginBg: {
        width: '100%',
        height: 1000,
    },
    logoSettings:{
        width: 311,
        height: 127,
        marginBottom: 20,
    },
    loginInput: {
        width: 300,
        height: 60,
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        padding: 10,
        color: '#7d7d7d',
        fontSize: 16,
    },
    loginTextTitle: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        paddingBottom: 10,
        fontSize: 30,
        textShadowColor: '#7d7d7d',
        textShadowOffset: {width:2, height:1},
        textShadowRadius: 3,
    },
    loginTextSubtitle: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        paddingBottom: 10,
        fontSize: 16,
        textShadowColor: '#7d7d7d',
        textShadowOffset: {width:2, height:1},
        textShadowRadius: 3,
    },

    botao: {
        backgroundColor: '#00BA38',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginTop: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    botaoTexto: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: '#4f4f4f',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    },
});

