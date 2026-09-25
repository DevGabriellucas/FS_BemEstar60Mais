import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';

type AlunoCardProps = {
  nome: string;
  id: number;
  goToAluno: (id: number) => void;
};

export default function CardAluno({ nome, id, goToAluno }: AlunoCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => goToAluno(id)}>
      <Ionicons name="person-circle-outline" size={40} color="#6b7280" />
      <View style={styles.textContainer}>
        <Text style={styles.nome}>{nome}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    width: 300,
  },
  textContainer: {
    marginLeft: 12,
  },
  nome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
});