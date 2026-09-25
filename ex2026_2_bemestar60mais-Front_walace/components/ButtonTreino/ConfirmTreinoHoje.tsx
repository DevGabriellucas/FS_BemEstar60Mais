import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

type Props = {
  treinouHoje: boolean | null;
  setResposta: () => void;
};

export default function ConfirmTreinoHoje({treinouHoje, setResposta }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.messageText}>
        {treinouHoje
          ? "Parabéns, você ja treinou hoje!"
          : "Você treinou hoje?"}
      </Text>

      {!treinouHoje && (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.responseButton, { backgroundColor: "#00BA38" }]}
            onPress={() => setResposta()}
          >
            <Text style={styles.responseButtonText}>Registre o seu treino</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "75%",
    alignItems: "center",
    marginBottom: 30,
  },
  buttonsContainer: {
    width: "100%",
    marginTop: 20,
  },
  responseButton: {
    width: "100%",
    height: 55,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // para Android
  },
  responseButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 17,
  },
  messageText: {
    fontSize: 16,
    color: "#444",
    textAlign: "center",
  },
});