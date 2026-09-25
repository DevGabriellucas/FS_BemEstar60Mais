import { TouchableOpacity, View, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

type Props = {
    index: number;
    valor: string | any;
    virado: boolean;
    resolvido: boolean;
    onPress: () => void;
};

export default function Cartao({ index, valor, virado, onPress, resolvido }: Props) {
    return (
        <TouchableOpacity
            style={[
                estiloCartao.cartao,
                resolvido ? estiloCartao.resolvido : estiloCartao.azul
            ]}
            onPress={onPress}
            disabled={virado || resolvido}
        >
            <View style={estiloCartao.face}>
                {virado || resolvido ? (
                    <FontAwesome name={valor} size={42} color="#fff" />
                ) : (
                    <FontAwesome name="question" size={42} color="#fff" />
                )}
            </View>
        </TouchableOpacity>
    );
}

const estiloCartao = StyleSheet.create({
    cartao: {
        width: 110,
        height: 110,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    azul: {
        backgroundColor: "#4A90E2",
    },
    resolvido: {
        backgroundColor: "#6FCF97", // verde suave
    },
    face: {
        alignItems: "center",
        justifyContent: "center",
    },
});