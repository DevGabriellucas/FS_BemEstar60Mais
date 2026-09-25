import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import { useState } from 'react';

const fetchFonts = () => {
    return Font.loadAsync({
      'BalooChettan2-Medium': require('../assets/fonts/BalooChettan2-Medium.ttf'),
    });
};


type Props = {
    pergunta: string,
    valorAtual: any,
    variavel:any,
    funcao: (variavel: any, valor:boolean) => void
}

export function RadioButtonForm({pergunta, valorAtual, variavel, funcao}: Props) {

  return (
    <View>
        <Text style={styles.pergunta}>{pergunta}</Text>
        <View style={styles.radioContainer}>    
            <TouchableOpacity style={styles.opcao} onPress={() => funcao(variavel, true)}>
            <View style={styles.radioCircle}>
                {valorAtual === true && <View style={styles.selectedRb} />}
            </View>
            <Text style={ styles.texto }>Sim</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.opcao} onPress={() => funcao(variavel, false)}>
            <View style={styles.radioCircle}>
                {valorAtual == false && <View style={styles.selectedRb} />}
            </View>
            <Text style={styles.texto}>Não</Text>
            </TouchableOpacity>
        
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
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
