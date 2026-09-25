import { useDebugValue, useState } from "react";
import { SystemFetch } from "./SystemFetch";

export const RecoverServices = () => {
    
    const { enviarDados } = SystemFetch();

    const [currentStep, setCurrentStep] = useState(0);
    const [resetPasswordError, setResetPasswordError] = useState(0);
    const [resetPasswordErrorMsg, setResetPasswordErrorMsg] =  useState('');
    const [email, setEmail] = useState('');
    const [codSeguranca, setCodSeguranca] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmSenha, setConfirmSenha] = useState('');

    async function sendEmail(){
        
        try {
            const resposta = await enviarDados('http://localhost:8000/auth/password-reset/', { "email": email}, '');
            
            console.log(resposta)

            if(resposta){
                nextStep()
            }

            setResetPasswordError(0)
            setResetPasswordErrorMsg('')
            
        } catch (error) {
            setResetPasswordError(1)
            setResetPasswordErrorMsg('Nenhum usuário associado a este email')
            
        }

    }

    async function changePassword(){
        //checar se a senha segue os requisitos de seguranca
        if(senha === confirmSenha){
            
            if(senha.length < 8){
                setResetPasswordError(1)
                setResetPasswordErrorMsg('Sua senha deve ter no mínimo 8 caracteres')
                return
            }

            if(!/[a-zA-Z]/.test(senha)){
                setResetPasswordError(1)
                setResetPasswordErrorMsg('Sua senha deve conter letras maiúsculas')
                return
            }

            if(!/[0-9]/.test(senha)){
                setResetPasswordError(1)
                setResetPasswordErrorMsg('Sua senha deve conter números')
                return
            }

            if(!/[!@#$%^&*(),.?":{}|<>]/.test(senha)){
                setResetPasswordError(1)
                setResetPasswordErrorMsg('Sua senha deve conter caracteres especiais')
                return
            }

        }else{
            setResetPasswordError(1)
            setResetPasswordErrorMsg('Sua senha e confirmação de senha devem ser iguais')
            return
        }

        try {
            const resposta = await enviarDados('http://localhost:8000/auth/password-reset-confirm/', { "email": email, "otp": codSeguranca, "new_password": senha, "confirm_password": confirmSenha }, '');

            if(resposta){
                nextStep()
            }

            
        } catch (error) {
            setResetPasswordError(2)
            setResetPasswordErrorMsg('Código de segurança inválido ou expirado')
            
        }
    }

    function nextStep(){
        //console.log(currentStep);
        setCurrentStep(currentStep+1);
    }

    function resetSteps(){
        setCurrentStep(0)
    }

    return({
        currentStep,
        nextStep,
        resetSteps,
        resetPasswordError,
        resetPasswordErrorMsg,
        setEmail,
        sendEmail,
        setCodSeguranca,
        setSenha,
        setConfirmSenha,
        changePassword
    });
}