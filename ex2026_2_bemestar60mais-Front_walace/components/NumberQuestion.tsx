import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import * as Font from 'expo-font';

const fetchFonts = () => {
    return Font.loadAsync({
      'BalooChettan2-Medium': require('../assets/fonts/BalooChettan2-Medium.ttf'),
    });
  };

type Props = {
    pergunta: string,
    descritor:string,
    variavel:string,
    funcao: (variavel:any, valor:string) => void
}


export function NumberQuestion({pergunta, descritor, funcao, variavel}:Props) {

  return (
    <View>
        <Text style={styles.pergunta}>{pergunta}</Text>
        <View style={styles.questionContainer}>
        <TextInput style={styles.resposta} keyboardType='numeric' onChangeText={ (valor:string) => funcao(variavel, valor)}></TextInput>
        <Text style={styles.descritor}>{descritor}</Text>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
    questionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pergunta:{
        fontSize: 18,
        fontFamily: 'BalooChettan2-Medium',
        color: '#7B7B7B',
        textAlign: 'left',
    },
    resposta:{
        width: 40,
        height: 40,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 10,
        color: '#7d7d7d',
        fontFamily: 'BalooChettan2-Medium',
        fontSize: 16,
        borderColor: '#B3B3B3',
        borderStyle: 'solid',
        borderWidth: 2,
        marginRight: 10,
    },
    descritor:{
        fontSize: 18,
        fontFamily: 'BalooChettan2-Medium',
        color: '#B3B3B3',
        textAlign: 'left',
    }
});
