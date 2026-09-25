import { useState } from 'react';
import { useRouter } from 'expo-router';
import { SystemFetch } from '@/services/SystemFetch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserInfoServices } from './UserInfoServices';

export const LoginServices = () => {

    const { enviarDados } = SystemFetch();
    const { getUserInfo, storeUserInfoData, storeFirstAccessData } = UserInfoServices();

    const router = useRouter();

    const [bgColor, setBgColor] = useState(require('../assets/images/bg1.png'));
    const [loginTypeText, setLoginTypeText] = useState("Sou Instrutor");
    const [loginType, setLoginType] = useState(0);
    const [loginRoute, setLoginRoute] = useState("homeAluno");
    const [welcomeText, setWelcomeText] = useState("Login do Aluno");
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loginErrorStatus, SetLoginErrorStatus] = useState(false);
    

    const changeLoginType = () => {
        if (loginType === 0) {
            setBgColor(require('../assets/images/bg2.png'));
            setLoginTypeText("Sou Aluno");
            setLoginType(1);
            setWelcomeText("Login do Instrutor");
            setLoginRoute("/homeInstrutor");
        } else {
            setBgColor(require('../assets/images/bg1.png'));
            setLoginTypeText("Sou Instrutor");
            setLoginType(0);
            setWelcomeText("Login do Aluno");
            setLoginRoute("/homeAluno");
        }
    };

    //se comunica com o servidor para realizar login, salva alguns dados do usuario que serao reutilizados em outras telas
    async function login(){
        
        try {
            const resposta = await enviarDados('http://localhost:8000/auth/login/', { "email": email, "password": senha}, '');

            const respostaString = JSON.stringify(resposta)

            await storeUserInfoData(respostaString)
            
            const myInfo = await getUserInfo()

            if (myInfo.role == 'usuario') {
                //se for o primeiro acesso, armazena o email para ser utilizado apenas na tela de primeiro acesso, logo apos o registro é deletado.
                if(myInfo.isFirstLogin){
                    await storeFirstAccessData(JSON.stringify({ "email": email, "password": senha}))
                    router.push("/(aluno)/primeiroAcesso")

                }else{
                    router.push("/(aluno)/homeAluno")

                }

            } else {
                router.push("/(instrutor)/homeInstrutor");

            }

            
        } catch (error) {
            console.error(error)
            SetLoginErrorStatus(true)
            
        }

    }

    async function verificaSeEstaLogado(){

        try{
            
            const myInfo = await getUserInfo()

            if (myInfo.role == 'usuario') {
                //router.push("/(aluno)/homeAluno");
                //router.push("/(aluno)/primeiroAcesso")

                if(myInfo.isFirstLogin){
                    router.push("/(aluno)/primeiroAcesso")

                }else{
                    router.push("/(aluno)/homeAluno")

                }

            } else {
                router.push("/(instrutor)/homeInstrutor")
            }
            
        }catch(error){
            //console.error('erro: ',error)

        }
        
    }

    async function logoff(){

        try {
            await AsyncStorage.clear(); //apaga os dados armazenados e redireciona para o login
            router.push("/")

        } catch (error) {
            console.error('Erro ao limpar AsyncStorage:', error);
        }
    }

    return {
        bgColor,
        loginTypeText,
        changeLoginType,
        welcomeText,
        login,
        setEmail,
        setSenha,
        verificaSeEstaLogado,
        logoff,
        loginErrorStatus
        
    };
};