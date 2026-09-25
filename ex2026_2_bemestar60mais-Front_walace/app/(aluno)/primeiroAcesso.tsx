import { View, Text, StyleSheet, TextInput, ScrollView, StatusBar } from "react-native";
import ButtonForm from "@/components/ButtonForm";
import LoginTemplate from '@/components/LoginTemplate';
import { useState } from "react";
import { useRouter } from "expo-router";

import { useAuthStore } from "@/store/authStore";

import { useAuth } from "@/api/hooks/useAuth";
import InputDefault from "@/components/inputs/InputDefault";

export default function PrimeiroAcesso() {
  const router = useRouter();
  const { email, password } = useAuthStore();

  const { mudarSenha, loading, error } = useAuth();

  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [errorMsg, setErrorMsg] = useState('');


  async function nextStep() {
    setErrorMsg('');

    if (newPassword.length < 8) {
      setErrorMsg('A senha deve ter no mínimo 8 caracteres.');
      return;
    }

    // Verifica se as senhas coincidem
    if (newPassword !== newPasswordConfirm) {
      setErrorMsg('As senhas não coincidem.');
      return;
    }

    const response = await mudarSenha({
      email: email,
      old_password: password,
      new_password: newPassword,
      confirm_password: newPasswordConfirm,
    });

    console.log(response);

    if (response.message) {
      router.push('/(aluno)/anamneseInicial');
    }
  }

  function logoff() {
    router.replace('/');
  }

  return (
    <View>
      <StatusBar backgroundColor="#121212" barStyle="light-content" />
      <LoginTemplate bgColor={require('../../assets/images/bg1.png')} />

      <View style={styles.meuContainer}>
        <View style={styles.primeiroAcessoContainer}>
          <Text style={styles.title}>Primeiro Acesso</Text>
          <Text style={styles.subTitle}>
            Esta é a primeira vez que você está utilizando o nosso aplicativo, defina agora sua senha.
          </Text>

          {errorMsg !== '' && (
            <Text style={styles.errorText}>{errorMsg}</Text>
          )}

          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          <View style={styles.inputContainer}>
            <InputDefault 
              label={"Digite sua nova Senha"} 
              value={newPassword} 
              setValue={setNewPassword} 
            />

            <InputDefault 
              label={"Repita sua nova Senha"} 
              value={newPasswordConfirm} 
              setValue={setNewPasswordConfirm} 
            />

            <ButtonForm text="CONTINUAR" color="#ECC256" onPress={nextStep} tamanhoDaFonte={18} />
            <Text style={[styles.subTitle, { marginTop: 10 }]} onPress={logoff}>
              CANCELAR
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    meuContainer: {
        position: 'absolute',
        width: '100%',
        alignItems: 'center',
        backgroundColor: 'transparent',

    },
    primeiroAcessoContainer: {
        display: 'flex',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        gap: 8,
        width:350,
        marginTop: 100,  
    },
    primeiroAcessoInput: {
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
    primeiroAcessoBg: {

        width: '100%',
        height: 1000,
        alignItems: 'center',
    },
    title: {
        fontFamily: 'BalooChettan2-Medium',
        fontWeight: 'bold',
        fontSize: 20,
    },
    subTitle: {
        fontFamily: 'BalooChettan2-Medium',
        color: 'gray',
        marginBottom: 10,

    },
    inputContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    scrollContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        paddingTop: 10
    },
    primeiroAcessoAnamneseContainer: {
        display: 'flex',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        gap: 8,
        width:350,
    },
    primeiroAcessoAnamneseInput: {
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
    primeiroAcessoAnamneseBg: {
        width: '100%',
        height: 1000,
        alignItems: 'center',
    },
    pergunta: {
        fontSize: 18,
        fontFamily: 'BalooChettan2-Medium',
        color: '#7B7B7B',
        textAlign: 'left',
    },
    errorContainer: {
        backgroundColor: '#cb0000',
        padding: 10,
        borderRadius: 4,
        fontFamily: 'BalooChettan2-Medium',
        fontSize: 15,
        color: 'white',
        marginBottom: 5,
    },
    errorText: {
        color: 'red',
        fontFamily: 'BalooChettan2-Medium',
        textAlign: 'center',
        marginTop: 8,
    },
});