import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const intensityRanges = [
  { range: [10, 10], label: "Esforço máximo", color: "#E53935" },
  { range: [9, 9], label: "Atividade muito difícil", color: "#FB8C00" },
  { range: [7, 8], label: "Atividade vigorosa", color: "#FDD835" },
  { range: [4, 6], label: "Atividade moderada", color: "#43A047" },
  { range: [2, 3], label: "Atividade leve", color: "#29B6F6" },
  { range: [0, 1], label: "Atividade muito leve", color: "#81D4FA" },
];

type IntensidadeBtnProps = {
  choice: number | null;
  onChange?: (value: number) => void;
};

const getColorAndLabel = (value: number) =>
  intensityRanges.find(({ range }) => value >= range[0] && value <= range[1])!;

export default function IntensidadeBtn({ choice, onChange }: IntensidadeBtnProps) {
  const [selected, setSelected] = useState<number | null>(choice);

  useEffect(() => {
    setSelected(choice); // Atualiza se o prop mudar externamente
  }, [choice]);

  const handlePress = (value: number) => {
    setSelected(value);
    onChange?.(value); // Notifica o pai, se fornecido
  };

  return (
    <View style={styles.container}>
      {[...Array(11).keys()].reverse().map((value) => {
        const { label, color } = getColorAndLabel(value);
        return (
          <TouchableOpacity
            key={value}
            style={[styles.item, { backgroundColor: color }]}
            onPress={() => handlePress(value)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={selected === value ? "checkbox" : "square-outline"}
              size={24}
              color="#fff"
              style={styles.checkbox}
            />
            <Text style={styles.number}>{value}</Text>
            <Text style={styles.description}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    paddingBottom: 20,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    width: 350,
  },
  checkbox: {
    marginRight: 12,
  },
  number: {
    fontWeight: "bold",
    fontSize: 18,
    marginRight: 12,
    color: "#ffffff",
  },
  description: {
    fontSize: 16,
    color: "#ffffff",
  },
});