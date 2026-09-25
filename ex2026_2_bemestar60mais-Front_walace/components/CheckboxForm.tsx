import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Font from 'expo-font';

const fetchFonts = () => {
    return Font.loadAsync({
      'BalooChettan2-Medium': require('../assets/fonts/BalooChettan2-Medium.ttf'),
    });
  };

type Opcoes = {
    key:number,
    label: string,
}

type Props = {
    pergunta: string,
    opcoes:Opcoes[],
    variavel: string,
    funcao: (variavel:any, index:number, label:string) => void,
    dados:string[]
}


export function CheckboxForm({pergunta, opcoes, variavel, funcao, dados}:Props) {

  return (
    <View>
        <Text style={styles.pergunta}>{pergunta}</Text>
        <View style={styles.radioContainer}>
            <View>
                {opcoes.map(option => (
                    <TouchableOpacity key={option.key} style={styles.opcao} onPress={() => funcao(variavel, option.key, option.label)}>

                    <View style={styles.radioCircle}>
                        {dados.includes(option.label)  && <View style={styles.selectedRb} />}
                    </View>
                    <Text style={ styles.texto }>{option.label}</Text>
                    </TouchableOpacity>

                ))}
            </View>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
    radioContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    insideRadioContainer:{
        textAlign: 'left',
    },
    opcao: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    radioCircle: {
        height: 20,
        width: 20,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#B3B3B3',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 5,
    },
    selectedRb: {
        width: 12,
        height: 12,
        borderRadius: 2,
        backgroundColor: '#4DED7D',
    },
    texto:{
        marginRight: 10,
        fontSize: 18,
        fontFamily: 'BalooChettan2-Medium',
        color: '#B3B3B3',
    },
    pergunta:{
        textAlign: 'left',
        fontSize: 18,
        fontFamily: 'BalooChettan2-Medium',
        color: '#7B7B7B',
    }
});
