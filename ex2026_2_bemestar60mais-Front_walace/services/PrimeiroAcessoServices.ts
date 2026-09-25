import { router } from "expo-router"
import { useState } from "react";
import { SystemFetch } from "./SystemFetch";
import { UserInfoServices } from "./UserInfoServices";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const PrimeiroAcessoServices = () => {

    const [currentStep, setCurrentStep] = useState(0);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
    const [newPasswordErrorStatus, setNewPasswordErrorStatus] = useState(0);
    const [AnamneseErrorStatus, setAnamneseErrorStatus] = useState(0);
    const { enviarDados } = SystemFetch();
    const { getUserInfo, getFirstAccessData, storeUserInfoData } = UserInfoServices();
    const [camposVazios, setCamposVazios] = useState(false);
    const [msgError, setMsgError] = useState('Existem campos não preenchidos');

    //46 perguntas
    const [respostas, setResposta] = useState({
        data_nascimento: '',
        profissao: '', 
        nomeDoResponsavel: '', 
        contatoDoResponsavel: '',
        peso: 0.0, 
        altura: 0.0, 
        participaDeExtensao: null, 
        praticaAtividade: null,
        boxSensacoes: [],
        fazDieta: null,
        quantasRefeicoes: null,
        horasDeSono: null,
        litrosDeAgua: null,
        bebe: null,
        fuma: null,
        temColesterolAlto: null,
        hdl: '',
        ldl: '',
        temTrigliceridesAlto: null,
        diabetico: null,
        tipoDeDiabete: [],
        descDiabete: '',
        hipertenso: null,
        descHipertenso: '',
        asma: null,
        descAsma: '',
        temProblemasRespiratorios: null,
        descProblemasRespiratorios: '',
        paisObesos: null,
        jaFezCirurgia: null,
        descCirurgia: '',
        usaMedicamento: null,
        descMedicamento: '',
        recomendacaoMedica: null,
        descDesconforto: '',
        descRestricaoMedica: '',
        objetivos: [],
        descOutro: '',
        problemaDeCoracao: null,
        doresNoPeito: null,
        doresNoPeitoEmAtividade: null,
        desequilibrio: null,
        problemaOsseo: null,
        medicamentoParaPressao: null,
        outrasRazoes: null,
        descOutrasRazoes: '',
    })

    function gravarBox(variavel: keyof typeof respostas, index: number, label:string) {
        setResposta(prevResponses => {
            const newArray = [...prevResponses[variavel] as (number | string)[]];

            const labelIndex = newArray.indexOf(label);

            if (labelIndex !== -1) {
                newArray.splice(labelIndex, 1);
            } else {
                newArray.push(label);
            }

            return {
                ...prevResponses,
                [variavel]: newArray,
            };
        });
    }

    function gravarResposta(variavel: keyof typeof respostas, value: any){

        const dados = {...respostas}
        
        if(variavel === 'peso' || variavel === 'altura'){
            value = value.replace(',', '.')
            value = parseFloat(value)
            value = value.toFixed(2)
            value = parseFloat(value)
        }else{

            if(typeof dados[variavel] === 'number'){
                value = parseInt(value)
            }

        }

        setResposta(prevResponses => ({
            ...prevResponses,
            [variavel]: value,
        }));
    }

    function gravarRadio(variavel: keyof typeof respostas, valor:boolean){
        setResposta(prevResponses => {
            return {
                ...prevResponses,
                [variavel]: valor,
            };
        });
    }

    async function nextStep(){

        const firstAccessInfo = await getFirstAccessData()

        //checa se elas sao iguais
        if(newPassword === newPasswordConfirm){

            //checar se a senha segue os requisitos de seguranca
            if(newPassword.length < 8){
                setNewPasswordErrorStatus(2)
                return
            }

            if(newPassword === firstAccessInfo.password){
                setNewPasswordErrorStatus(6)
                return
            }

            if(!/[a-zA-Z]/.test(newPassword)){
                setNewPasswordErrorStatus(3)
                return
            }

            if(!/[0-9]/.test(newPassword)){
                setNewPasswordErrorStatus(4)
                return
            }

            if(!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)){
                setNewPasswordErrorStatus(5)
                return
            }

            setCurrentStep(1)

        }else{
            setNewPasswordErrorStatus(1);
        }

        

    }

    function skipDev(){
        setCurrentStep(1)
    }

    function checarData(data:string) {
        const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
        return regex.test(data);
    }
    
    function formatarDataNascimento(data:string) {

        const partes = data.split('/');
        
        if (partes.length === 3) {
            let dataFormatada = `${partes[2]}-${partes[1]}-${partes[0]}`;
            setResposta(prevRespostas => ({
                ...prevRespostas,
                data_nascimento: dataFormatada
            }));
            //console.log(dataFormatada)
        } else {
            console.error('Formato de data inválido');
        }
        
    }

    function checkAnamnese(){
        
        let camposVaziosInterno = false

        if ( respostas.data_nascimento === '' || respostas.profissao === '' || respostas.nomeDoResponsavel === '' || respostas.contatoDoResponsavel === ''){
            
            camposVaziosInterno = true
            setAnamneseErrorStatus(2)
            setMsgError('Existem campos não preenchidos')
            return

        }else{
            camposVaziosInterno = false
            setAnamneseErrorStatus(0)
        }

        if(checarData(respostas.data_nascimento)){
            camposVaziosInterno = false
            setAnamneseErrorStatus(0)

        }else{
            camposVaziosInterno = true
            setAnamneseErrorStatus(2)
            setMsgError('Data de nascimento não foi preenchida corretamente')
            return
        }
        
        if( respostas.peso === 0.0 || respostas.altura === 0.0){
            camposVaziosInterno = true
            setAnamneseErrorStatus(2)
            setMsgError('Existem campos não preenchidos')
            return

        }else{
            camposVaziosInterno = false
            setAnamneseErrorStatus(0)
        }

        if (respostas.participaDeExtensao === null || 
            respostas.praticaAtividade === null || 
            respostas.fazDieta === null ||
            respostas.quantasRefeicoes === null ||
            respostas.horasDeSono === null ||
            respostas.litrosDeAgua === null ||
            respostas.bebe === null ||
            respostas.fuma === null || 
            respostas.temColesterolAlto === null ||
            respostas.hipertenso === null ||
            respostas.temTrigliceridesAlto === null ||
            respostas.diabetico === null ||
            respostas.asma === null ||
            respostas.temProblemasRespiratorios === null ||
            respostas.paisObesos === null ||
            respostas.jaFezCirurgia === null ||
            respostas.usaMedicamento === null ||
            respostas.recomendacaoMedica === null ||
            respostas.problemaDeCoracao === null ||
            respostas.doresNoPeito === null ||
            respostas.doresNoPeitoEmAtividade === null ||
            respostas.desequilibrio === null ||
            respostas.problemaOsseo === null ||
            respostas.medicamentoParaPressao === null ||
            respostas.outrasRazoes === null
            ){
            
            camposVaziosInterno = true
            setAnamneseErrorStatus(2)
            setMsgError('Existem campos não preenchidos')
            return

        }else{
            camposVaziosInterno = false
            setAnamneseErrorStatus(0)
        }
        
        if(respostas.temColesterolAlto === true && respostas.hdl === ''){
            camposVaziosInterno = true
            setAnamneseErrorStatus(2)
            setMsgError('preencha seu hdl')
            return

        }else{
            camposVaziosInterno = false
            setAnamneseErrorStatus(0)
        }

        if(respostas.temColesterolAlto === true && respostas.ldl === ''){
            camposVaziosInterno = true
            setAnamneseErrorStatus(2)
            setMsgError('preencha seu ldl')
            return

        }else{
            camposVaziosInterno = false
            setAnamneseErrorStatus(0)
        }

        if(respostas.diabetico === true && respostas.tipoDeDiabete.length === 0){
            camposVaziosInterno = true
            setAnamneseErrorStatus(2)
            setMsgError('Marque seu tipo de diabetes')
            return

        }else{
            camposVaziosInterno = false
            setAnamneseErrorStatus(0)
        }

        if(respostas.diabetico === true && respostas.descDiabete === ''){
            camposVaziosInterno = true
            setAnamneseErrorStatus(2)
            setMsgError('Descreva se toma medicamentos para diabete')
            return

        }else{
            camposVaziosInterno = false
            setAnamneseErrorStatus(0)
        }

        if(respostas.hipertenso === true && respostas.descHipertenso === ''){
            camposVaziosInterno = true
            setAnamneseErrorStatus(2)
            setMsgError('Descreva se toma medicamentos para Hipertensão')
            return

        }else{
            camposVaziosInterno = false
            setAnamneseErrorStatus(0)
        }

        if(respostas.asma === true && respostas.descAsma === ''){
            camposVaziosInterno = true
            setAnamneseErrorStatus(2)
            setMsgError('Descreva se toma medicamentos para Asma')
            return

        }else{
            camposVaziosInterno = false
            setAnamneseErrorStatus(0)
        }

        if(respostas.temProblemasRespiratorios === true && respostas.descProblemasRespiratorios === ''){
            camposVaziosInterno = true
            setAnamneseErrorStatus(2)
            setMsgError('Descreva seu problema respiratório')
            return

        }else{
            camposVaziosInterno = false
            setAnamneseErrorStatus(0)
        }

        if(respostas.jaFezCirurgia === true && respostas.descCirurgia === ''){
            camposVaziosInterno = true
            setAnamneseErrorStatus(2)
            setMsgError('Descreva sua cirurgia')
            return
        }else{
            camposVaziosInterno = false
            setAnamneseErrorStatus(0)
        }
        
        if(respostas.usaMedicamento === true && respostas.descCirurgia === ''){
            camposVaziosInterno = true
            setAnamneseErrorStatus(2)
            setMsgError('Descreva os medicamentos que usa')
            return

        }else{
            camposVaziosInterno = false
            setAnamneseErrorStatus(0)
        }

        if(respostas.outrasRazoes === true && respostas.descOutrasRazoes === ''){
            camposVaziosInterno = true
            setAnamneseErrorStatus(2)
            setMsgError('Descreva qual a outra razão para não treinar')
            return

        }else{
            camposVaziosInterno = false
            setAnamneseErrorStatus(0)
        }

        if(camposVazios === false){
            //console.log(respostas)
            salvarDados()
        }
    
    }

    async function salvarDados(){

        try {
            const myInfo = await getUserInfo()

            const firstAccessInfo = await getFirstAccessData()

            //console.log(firstAccessInfo)

            await enviarDados('http://localhost:8000/auth/change-password/', { email: firstAccessInfo.email, "old_password": firstAccessInfo.password, "new_password": newPassword, "confirm_password": newPasswordConfirm}, myInfo.access);

            const respostaAnamnese = await enviarDados('http://localhost:8000/health/anamnesis/', respostas, myInfo.access);

            await AsyncStorage.removeItem('userFirstAccess') //apaga o email armazenado para o primeiro acessso

            
            if (respostaAnamnese) {
                //console.log(myInfo)
                //atualiza o isFirstAccess local
                await AsyncStorage.removeItem('userInfo')

                let informacoes = {...myInfo}
                informacoes.isFirstLogin = false
                
                storeUserInfoData(JSON.stringify(informacoes))

                router.push("/(aluno)/homeAluno");

            }
            
        } catch (error) {
            console.log(error)
            setAnamneseErrorStatus(1)
            
        }

    }

    return({
        currentStep,
        nextStep,
        checkAnamnese,
        formatarDataNascimento,
        newPassword,
        newPasswordConfirm,
        setNewPassword,
        setOldPassword,
        setNewPasswordConfirm,
        newPasswordErrorStatus,
        AnamneseErrorStatus,
        skipDev,
        camposVazios,
        msgError,
        respostas,
        gravarResposta,
        gravarBox,
        gravarRadio
    })
}