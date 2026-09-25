import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TextInputProps
} from "react-native";

type InputDefaultProps = {
  label: string;
  value: string;
  setValue: (objetivo: string) => void;
  width?: number;
  placeholder?: string;
  type?: TextInputProps["keyboardType"];
};

export default function InputDefault({
  label,
  value,
  setValue,
  width = 300,
  placeholder = "",
  type
}: InputDefaultProps) {

  return (
    <View>
      <Text style={styles.label}>
        {label}
      </Text>
      <TextInput
        style={[styles.input, { width }]}
        placeholder={placeholder}
        value={value}
        onChangeText={setValue}
        keyboardType={type}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    color: "#666",
    alignContent: "center",
    alignItems: "center",
  },
  input: {
    height: 60,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
    color: "#7d7d7d",
    fontFamily: "Baloo Chettan 2",
    fontSize: 16,
    borderColor: "#D9D9D9",
    borderStyle: "solid",
    borderWidth: 2,
  },
});