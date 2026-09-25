import { useEffect, useMemo, useState } from "react";

import {
  Text,
  View,
  ImageBackground,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import ButtonForm from "@/components/Buttons/ButtonForm";
import Header from "@/components/headers/header";
import RadioGroupLDefault from "@/components/radioGroup/radioGroupDefault";
import CheckboxGroup from "@/components/checkbox/checkboxGroup";

import InputDefault from "@/components/inputs/InputDefault";
import { useAluno } from "@/api/hooks/useAluno";

export default function AnamneseInicial() {
  const { editarAnamnese, loading, error } = useAluno();

  const [ dataNasicmento, setDataNascimento ] = useState(""); // input text
  const [ profissao, setProfissao ] = useState(""); // input text
  const [ nomeResponsavel, setNomeResponsavel] = useState(""); // input text
  const [ contatoResponsavel, setContatoResponsavel] = useState(""); // input number
  const [ peso, setPeso] = useState(""); // input number
  const [ altura, setAltura] = useState(""); // input number


  const [ extensao, setExtensao ] = useState<any>(""); // radio button
  const [ atvFisica, setAtvFisica ] = useState<any>(""); // radio button
  const [ sintomas, setSintomas ] = useState<string[]>([]); // checkbox
  const [ nutricionista, setNutricionista ] = useState<any>(""); // radio button

  const [ refeicao, setRefeicao ] = useState(""); // input number
  const [ horasNoite, setHorasNoite ] = useState(""); // input number
  const [ aguaDia, setAguaDia ] = useState(""); // input number


  const [ colesterol, setColesterol ] = useState<any>(""); // radio button
  const [ hdl, setHdl] = useState<any>(''); // input number
  const [ ldl, setLdl ] = useState<any>(''); // input number
  const [ trigliceridos, setTrigliceridos ] = useState<any>(""); // radio button


  const [ diabetes, setDiabetes ] = useState<any>(""); // radio button
  const [ TipoDiabetes, setTipoDiabetes ] = useState<any>(""); //radio button
  const [ mendicamentoInsulina, setMendicamentoInsulina ] = useState<any>(''); // input string


  const [ hipertenso, setHipertenso ] = useState<any>(""); // radio button
  const [ medicamentoHipertenso, setMedicamentoHipertenso ] = useState(''); // input string

  
  const [ asma, setAsma ] = useState<any>(""); // radio button
  const [ broncodilatador, setBroncodilatador ] = useState(''); // input string


  const [ problemaRespiratorio, setProblemaRespiratorio ] = useState<any>(""); // radio button
  const [ problemaRespiratorioDesc, setProblemaRespiratorioDesc ] = useState(''); // input string


  const [ paisObesoso, setPaisObesoso ] = useState<any>(""); // radio button
  const [ cirurgia, setCirurgia ] = useState<any>(""); // radio button
  const [ descCirurgia, setDescCirurgia ] = useState(''); // input string


  const [ tipoMedicamento, setTipoMedicamento ] = useState<any>(""); // radio button
  const [ descMedicamento, setDescMedicamento ] = useState(''); // input string


  const [ recomendaMedica, setRecomendaMedica ] = useState<any>(""); // radio button
  const [ descProbCol, setDescProbCol ] = useState(''); // input string
  const [ restricao, setRestricao ] = useState(''); // input string


  const [ motivo, setMotivo ] = useState<string[]>([]); // checkbox
  const [ motivoTreino, setMotivoTreino ] = useState(''); // input string


  const [ medicoDoenca, setMedicoDoenca ] = useState<any>(""); // radio button
  const [ doresPeito, setDoresPeito ] = useState<any>(""); // radio button
  const [ doresPeitoMes, setDoresPeitoMes ] = useState<any>(""); // radio button
  const [ desequilibrio, setDesequilibrio ] = useState<any>(""); // radio button
  const [ problemaOsseo, setProblemaOsseo ] = useState<any>(""); // radio button
  const [ medicamentoPressao, setMedicamentoPressao ] = useState<any>(""); // radio button
  const [ razaoNaoExerc, setRazaoNaoExerc ] = useState<any>(""); // radio button


const formatarDataInput = (valor: string): string => {
    // Se for no formato da API (YYYY-MM-DD), transforma para DD/MM/YYYY
    if (valor.includes("-")) {
      const [ano, mes, dia] = valor.split("-");
      return `${dia}/${mes}/${ano}`;
    }

    // Remove tudo que não for número
    const apenasNumeros = valor.replace(/\D/g, "");

    // Aplica a máscara DD/MM/AAAA conforme o usuário digita
    let formatado = apenasNumeros;

    if (formatado.length >= 3 && formatado.length <= 4) {
      formatado = `${formatado.slice(0, 2)}/${formatado.slice(2)}`;
    } else if (formatado.length >= 5) {
      formatado = `${formatado.slice(0, 2)}/${formatado.slice(2, 4)}/${formatado.slice(4, 8)}`;
    }

    return formatado.slice(0, 10);
};

  const handleUpdate = async () => {
    const data = {
      data_nascimento: dataNasicmento.split('/').reverse().join('-'),
      profissao,
      nomeDoResponsavel: nomeResponsavel,
      contatoDoResponsavel: contatoResponsavel,
      peso: parseFloat(peso.replace(',', '.')),
      altura: parseFloat(altura.replace(',', '.')),

      participaDeExtensao: extensao,
      praticaAtividade: atvFisica,
      boxSensacoes: sintomas,

      fazDieta: nutricionista,
      quantasRefeicoes: refeicao ? parseInt(refeicao) : null,
      horasDeSono: horasNoite ? parseInt(horasNoite) : null,
      litrosDeAgua: aguaDia ? parseFloat(aguaDia) : null,

      temColesterolAlto: colesterol,
      hdl: parseFloat(hdl.replace(',', '.')),
      ldl: parseFloat(ldl.replace(',', '.')),
      temTrigliceridesAlto: trigliceridos,

      diabetico: diabetes,
      tipoDeDiabete: diabetes ? [TipoDiabetes] : [],
      descDiabete: mendicamentoInsulina,

      hipertenso: hipertenso,
      descHipertenso: medicamentoHipertenso,

      asma: asma,
      descAsma: broncodilatador,

      temProblemasRespiratorios: problemaRespiratorio,
      descProblemasRespiratorios: problemaRespiratorioDesc,

      paisObesos: paisObesoso,
      jaFezCirurgia: cirurgia,
      descCirurgia,

      usaMedicamento: tipoMedicamento,
      descMedicamento,

      recomendacaoMedica: recomendaMedica,
      descDesconforto: descProbCol,
      descRestricaoMedica: restricao,

      objetivos: motivo,
      descOutro: motivoTreino,

      problemaDeCoracao: medicoDoenca,
      doresNoPeito: doresPeito,
      doresNoPeitoEmAtividade: doresPeitoMes,
      desequilibrio: desequilibrio,
      problemaOsseo: problemaOsseo,
      medicamentoParaPressao: medicamentoPressao,
      outrasRazoes: razaoNaoExerc,
      descOutrasRazoes: '',
    };

    console.log(data);
    
    const responseEdit = await editarAnamnese(data);

    console.log(responseEdit)

    if(responseEdit.message){
      alert('Ficha alterada com sucesso!');
      router.replace('/(aluno)/homeAluno');
    }else if(responseEdit.error){ 
      alert('Erro ao alterar ficha!');
    }
  }

  if(loading){
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#121212" barStyle="light-content" />
      
      <ImageBackground
        source={require("@/assets/images/appImages/bg.png")}
        resizeMode="cover"
        style={{ flex: 1 }}
      >
        <Header usuario="Aluno" disableSettings={true} disableCalendar={true} />

        <ScrollView style={styles.scrollContainer}>
          <View style={styles.content}>
            <View style={styles.linha}>
              <Text style={styles.sectionTitle}>Ficha Anamnese</Text>
            </View>
            <Text style={styles.description}>Altere sua ficha aqui</Text>

            <View style={styles.inputContainer}>

              <View style={styles.conteinerCardInput}>
                <InputDefault label="Data de nascimento" value={formatarDataInput(dataNasicmento)} setValue={setDataNascimento} />

                <InputDefault label="Profissão" value={profissao} setValue={setProfissao} />

                <InputDefault label="nome Responsavel" value={nomeResponsavel} setValue={setNomeResponsavel} />

                <InputDefault label="Contato do responsável" value={contatoResponsavel} setValue={setContatoResponsavel} type="numeric" />

                <InputDefault label="Seu peso (kg)" value={peso} setValue={setPeso} type="numeric" />

                <InputDefault label="Sua altura (m)" value={altura} setValue={setAltura} type="numeric" />
              </View>

              <View style={styles.conteinerCardInput}>

                <Text style={styles.radioLabel}>
                  Participa de um projeto de extensão?
                </Text>
                  <RadioGroupLDefault
                    selectedValue={extensao}
                    options={[
                      { id: "1", label: "Sim", value: true},
                      { id: "2", label: "Não", value: false },
                    ]}
                    onSelect={(value) => setExtensao(value)}
                  />

                <Text style={styles.radioLabel}>Pratica atividade fisica?</Text>
                <RadioGroupLDefault
                  selectedValue={atvFisica}
                  options={[
                    { id: "1", label: "Sim", value: true },
                    { id: "2", label: "Não", value: false },
                  ]}
                  onSelect={(value) => setAtvFisica(value)}
                />

                <Text style={styles.radioLabel}>
                  Marque dentre as opções abaixo as que sente ao realizar
                  exercicios fisicos:
                </Text>
                <CheckboxGroup
                  options={[
                    { id: "TONTURA", label: "Tontura", value: "tontura" },
                    { id: "ENJOO", label: "Enjoo", value: "enjoo" },
                    { id: "MAL ESTAR", label: "Mal estar", value: "mal-estar" },
                  ]}
                  defaultValues={sintomas}
                  onChange={setSintomas}
                />

                <Text style={styles.radioLabel}>
                  Faz dieta acompanhada por nutricionista?
                </Text>
                <RadioGroupLDefault
                  selectedValue={nutricionista}
                  options={[
                    { id: "1", label: "Sim", value: true },
                    { id: "2", label: "Não", value: false },
                  ]}
                  onSelect={(id) => setNutricionista(id)}
                />
              </View>

              <View style={styles.conteinerCardInput}>
                  <Text style={styles.pergunta}>Quantas refeições por dia</Text>
                  <View style={styles.questionContainer}>
                    <TextInput 
                    style={styles.resposta} 
                    keyboardType='numeric' 
                    value={refeicao} 
                    onChangeText={ (valor:string) => setRefeicao(valor)}
                    />
                    <Text style={styles.descritor}>refeições por dia</Text>
                  </View>


                <Text style={styles.pergunta}>Dorme em media quantas horas por noite?</Text>
                <View style={styles.questionContainer}>
                  <TextInput 
                  style={styles.resposta} 
                  keyboardType='numeric' 
                  value={horasNoite}
                  onChangeText={ (valor:string) => setHorasNoite(valor)}
                  />
                  <Text style={styles.descritor}>horas por noite</Text>
                </View>

                <Text style={styles.pergunta}>Bebe quantos litros de água por dia?</Text>
                <View style={styles.questionContainer}>
                  <TextInput 
                  style={styles.resposta} 
                  keyboardType='numeric' 
                  value={aguaDia}
                  onChangeText={ (valor:string) => setAguaDia(valor)}
                  />
                  <Text style={styles.descritor}>litros ao dia</Text>
                </View>
              </View>

              <View style={styles.conteinerCardInput}>
                <Text style={styles.radioLabel}>
                  Possui colesterol alto?
                </Text>
                <RadioGroupLDefault
                  selectedValue={colesterol}
                  options={[
                    { id: "1", label: "Sim", value: true },
                    { id: "2", label: "Não", value: false },
                  ]}
                  onSelect={(id) => setColesterol(id)}
                />

                <View style={{ flexDirection: "row", gap: 25 }}>
                  <InputDefault 
                    label="hdl" 
                    value={hdl} 
                   setValue={setHdl} 
                    width={100}
                    type="numeric"
                  />
                  <InputDefault 
                    label="ldl" 
                    value={ldl} 
                   setValue={setLdl} 
                    width={100}
                    type="numeric"
                  />
                </View>

                <Text style={styles.radioLabel}>Possui triglicerídeos altos?</Text>
                <RadioGroupLDefault
                  selectedValue={trigliceridos}
                  options={[
                    { id: "1", label: "Sim", value: true },
                    { id: "2", label: "Não", value: false },
                  ]}
                  onSelect={setTrigliceridos}
                />
              </View>


              <View style={styles.conteinerCardInput}>
                <Text style={styles.radioLabel}>É diabético?</Text>
                <RadioGroupLDefault
                  selectedValue={diabetes}
                  options={[
                    { id: "1", label: "Sim", value: true },
                    { id: "2", label: "Não", value: false },
                  ]}
                  onSelect={setDiabetes}
                />

                <Text style={styles.radioLabel}>Tipo de diabetes?</Text>
                <RadioGroupLDefault
                  width={200}
                  selectedValue={TipoDiabetes}
                  options={[
                    { id: "TIPO I", label: "Tipo 1", value: "TIPO I" },
                    { id: "TIPO II", label: "Tipo 2", value: "TIPO II" },
                    { id: "GESTACIONAL", label: "Gestacional", value: "GESTACIONAL" },
                  ]}
                  onSelect={setTipoDiabetes}
                />

                <InputDefault 
                  label="descreva a insulina ou medicamento que você toma"
                  value={mendicamentoInsulina} 
                 setValue={setMendicamentoInsulina} 
                />
              </View>

              <View style={styles.conteinerCardInput}>
                <Text style={styles.radioLabel}>É hipertenso?</Text>
                <RadioGroupLDefault
                  selectedValue={hipertenso}
                  options={[
                    { id: "1", label: "Sim", value: true },
                    { id: "2", label: "Não", value: false },
                  ]}
                  onSelect={setHipertenso}
                />

                <InputDefault 
                  label="Qual medicamento que usa?"
                  value={medicamentoHipertenso} 
                 setValue={setMedicamentoHipertenso} 
                />
              </View>

              <View style={styles.conteinerCardInput}>
                <Text style={styles.radioLabel}>Possui asma?</Text>
                <RadioGroupLDefault
                  selectedValue={asma}
                  options={[
                    { id: "1", label: "Sim", value: true },
                    { id: "2", label: "Não", value: false },
                  ]}
                  onSelect={setAsma}
                />

                <InputDefault 
                  label="Qual broncodilatador usa?"
                  value={broncodilatador} 
                 setValue={setBroncodilatador} 
                />
              </View>

              <View style={styles.conteinerCardInput}>
                <Text style={styles.radioLabel}>Possui algum problema respiratório?</Text>
                <RadioGroupLDefault
                  selectedValue={problemaRespiratorio}
                  options={[
                    { id: "1", label: "Sim", value: true },
                    { id: "2", label: "Não", value: false },
                  ]}
                  onSelect={setProblemaRespiratorio}
                />

                <InputDefault 
                  label="qual problema respiratório?"
                  value={problemaRespiratorioDesc} 
                 setValue={setProblemaRespiratorioDesc} 
                />
              </View>

              <View style={styles.conteinerCardInput}>
                <Text style={styles.radioLabel}>Seus pais são obesos?</Text>
                <RadioGroupLDefault
                  selectedValue={paisObesoso}
                  options={[
                    { id: "1", label: "Sim", value: true },
                    { id: "2", label: "Não", value: false },
                  ]}
                  onSelect={setPaisObesoso}
                />

                <Text style={styles.radioLabel}>Já fez alguma cirurgia?</Text>
                <RadioGroupLDefault
                  selectedValue={cirurgia}
                  options={[
                    { id: "1", label: "Sim", value: true },
                    { id: "2", label: "Não", value: false },
                  ]}
                  onSelect={setCirurgia}
                />

                <InputDefault 
                  label="Qual cirurgia?"
                  value={descCirurgia} 
                 setValue={setDescCirurgia} 
                />
              </View>

              <View style={styles.conteinerCardInput}>
                <Text style={styles.radioLabel}>Faz uso de medicamentos?</Text>
                <RadioGroupLDefault
                  selectedValue={tipoMedicamento}
                  options={[
                    { id: "1", label: "Sim", value: true },
                    { id: "2", label: "Não", value: false },
                  ]}
                  onSelect={setTipoMedicamento}
                />

                <InputDefault 
                  label="Tipo de medicamento?"
                  value={descMedicamento} 
                 setValue={setDescMedicamento} 
                />
              </View>

              <View style={styles.conteinerCardInput}>
                <Text style={styles.radioLabel}>Possui recomendação médica para atividades físicas?</Text>
                <RadioGroupLDefault
                  selectedValue={recomendaMedica}
                  options={[
                    { id: "1", label: "Sim", value: true },
                    { id: "2", label: "Não", value: false },
                  ]}
                  onSelect={setRecomendaMedica}
                />

                <InputDefault 
                  label="Sente desconforto, dores na coluna articulações ou dores musculares? comente abaixo:"
                  value={descProbCol} 
                 setValue={setDescProbCol} 
                />

                <InputDefault 
                  label="Tem alguma recomendação ou restrição médica para prática de exercícios? comente abaixo:"
                  value={restricao} 
                 setValue={setRestricao} 
                />
              </View>

              <View style={styles.conteinerCardInput}>
                <Text style={styles.radioLabel}>
                  Marque dentre as opções abaixo as que sente ao realizar
                  exercicios fisicos:
                </Text>
                <CheckboxGroup
                  direction="column"
                  options={[
                    { id: "Hipertrofia", label: "hipertrofia", value: "hipertrofia" },
                    { id: "diminuir-ansiedade", label: "diminuir ansiedade", value: "diminuir-ansiedade" },
                    { id: "perda-de-peso", label: "perda de peso", value: "perda-de-peso" },
                    { id: "ganho-força", label: "ganho de força", value: "ganho-força" },
                    { id: "ajuda-na-depressao", label: "ajuda na depressão", value: "ajuda-na-depressao" },
                    { id: "controlar-diabetes", label: "controlar diabetes", value: "controlar-diabetes" },
                    { id: "estetica", label: "estetica", value: "estetica" },
                    { id: "diminuir-colesterol", label: "deminuir o colesterol", value: "diminuir-colesterol" },
                    { id: "lazer", label: "lazer", value: "lazer" },
                    { id: "flexibilidade", label: "flexibilidade", value: "flexibilidade" },
                    { id: "outro", label: "outro", value: "outro" },
                  ]}
                  defaultValues={motivo}
                  onChange={setMotivo}
                />

                <InputDefault 
                  label="qual outro?"
                  value={motivoTreino} 
                 setValue={setMotivoTreino} 
                />
              </View>

              <View style={styles.conteinerCardInput}>
                <Text style={styles.radioLabel}>Algum médico já disse que você possui algum problema de coração e que só deveria realizar atividade física supervisionada por profissionais da saúde?</Text>
                <RadioGroupLDefault
                  selectedValue={medicoDoenca}
                  options={[
                    { id: "1", label: "Sim", value: true },
                    { id: "2", label: "Não", value: false },
                  ]}
                  onSelect={setMedicoDoenca}
                />

                <Text style={styles.radioLabel}>Você sente dores no peito quando pratica atividade física?</Text>
                <RadioGroupLDefault
                  selectedValue={doresPeito}
                  options={[
                    { id: "1", label: "Sim", value: true },
                    { id: "2", label: "Não", value: false },
                  ]}
                  onSelect={setDoresPeito}
                />

                <Text style={styles.radioLabel}>No último mês você sentiu dores no peito quando praticou atividade física?</Text>
                <RadioGroupLDefault
                  selectedValue={doresPeitoMes}
                  options={[
                    { id: "1", label: "Sim", value: true },
                    { id: "2", label: "Não", value: false },
                  ]}
                  onSelect={setDoresPeitoMes}
                />

                <Text style={styles.radioLabel}>Você apresenta desequilíbrio devido a tontura e/ou perda de consciência?</Text>
                <RadioGroupLDefault
                  selectedValue={desequilibrio}
                  options={[
                    { id: "1", label: "Sim", value: true },
                    { id: "2", label: "Não", value: false },
                  ]}
                  onSelect={setDesequilibrio}
                />

                <Text style={styles.radioLabel}> Você possui algum problema ósseo ou articular que poderia ser piorado pela atividade física?</Text>
                <RadioGroupLDefault
                  selectedValue={problemaOsseo}
                  options={[
                    { id: "1", label: "Sim", value: true },
                    { id: "2", label: "Não", value: false },
                  ]}
                  onSelect={setProblemaOsseo}
                />

                <Text style={styles.radioLabel}>Você toma atualmente algum medicamento para pressão arterial e/ou problema de coração?</Text>
                <RadioGroupLDefault
                  selectedValue={medicamentoPressao}
                  options={[
                    { id: "1", label: "Sim", value: true },
                    { id: "2", label: "Não", value: false },
                  ]}
                  onSelect={setMedicamentoPressao}
                />

                <Text style={styles.radioLabel}>Sabe de alguma outra razão pela qual 
                  você não deve praticar atividade física?</Text>
                <RadioGroupLDefault
                  selectedValue={razaoNaoExerc}
                  options={[
                    { id: "1", label: "Sim", value: true },
                    { id: "2", label: "Não", value: false },
                  ]}
                  onSelect={setRazaoNaoExerc}
                />
              </View>

              <ButtonForm text="SALVAR" color="#ECC256" onPress={handleUpdate} />
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    backgroundColor: "#FFF", 
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 100,
    alignItems: "center",
    elevation: 4,
  },

  // Conteudo da ficha
  linha: {
    width: "100%",
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
  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },

  // ESTILOS INPUTS E CONTEINERS
  conteinerCardInput: {
    width: 350,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  radioLabel: {
    fontSize: 16,
    color: "#666",
    alignContent: "center",
    alignItems: "center",
  },

  inputContainer: {
    alignContent: "center",
    alignItems: "center",
    padding: 20,
    gap: 12, // espaçamento entre os blocos
  },

  inputContainerNumber: {
    padding: 20,
    gap: 12, // espaçamento entre os blocos
  },
  pergunta: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  questionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  resposta: {
    height: 50,
    width: 100,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
    fontSize: 16,
  },
  descritor: {
    fontSize: 16,
    color: '#666',
  },
});
