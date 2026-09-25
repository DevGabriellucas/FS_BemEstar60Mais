import { TouchableOpacity, Text, StyleSheet } from "react-native";

type Props = {
    text: string,
    color: string,
    onPress?: () => void,
}

export default function ButtonForm({ text, color, onPress }: Props) {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.loginButton, { backgroundColor: color }]}>
            <Text style={styles.loginButtonText}>{text}</Text>
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
        fontSize: 16,
        fontWeight: 'bold',
    },
});