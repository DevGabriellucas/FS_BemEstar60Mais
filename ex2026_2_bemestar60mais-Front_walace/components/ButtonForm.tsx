import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useState } from 'react';

type Props = {
    text: string,
    color: string,
    onPress?: () => void,
    tamanhoDaFonte: number,
    disabled?: boolean
}

export default function ButtonForm({ text, color, onPress, tamanhoDaFonte, disabled = false }: Props) {
    const [fontLoaded, setFontLoaded] = useState(false);

    return (
        <TouchableOpacity
            onPress={disabled ? undefined : onPress}
            style={[
                styles.loginButton,
                { backgroundColor: color },
                disabled && styles.disabledButton
            ]}
            activeOpacity={disabled ? 1 : 0.7}
        >
            <Text style={[styles.loginButtonText, { fontSize: tamanhoDaFonte }]}>
                {text}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    loginButton: {
        width: 300,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    loginButtonText: {
        color: 'white',
        fontFamily: 'BalooChettan2-Medium',
    },
    disabledButton: {
        opacity: 0.6,
    }
});