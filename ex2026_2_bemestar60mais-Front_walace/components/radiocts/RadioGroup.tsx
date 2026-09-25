import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type RadioGroupProps = {
  title: string;
  selectedValue: number | null;
  onSelect: (value: number) => void;
};

export const RadioGroup: React.FC<RadioGroupProps> = ({ title, selectedValue, onSelect }) => {
  const options = [0, 1, 2, 3, 4, 5];

  return (
    <View style={styles.groupContainer}>
      <Text style={styles.label}>{title}</Text>
      <View style={styles.optionsContainer}>
        {options.map((value) => (
          <TouchableOpacity
            key={value}
            style={styles.option}
            onPress={() => onSelect(value)}
          >
            <View style={[styles.circle, selectedValue === value && styles.selectedCircle]}>
              {selectedValue === value && <View style={styles.innerCircle} />}
            </View>
            <Text style={styles.optionLabel}>{value}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};


export default RadioGroup;
const styles = StyleSheet.create({
  groupContainer: {
    marginBottom: 24,
  },
  label: {
    fontWeight: '500',
    fontSize: 16,
    marginBottom: 8,
    color: 'black',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  option: {
    alignItems: 'center',
    gap: 4,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCircle: {
    borderColor: '#007AFF',
  },
  innerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
  },
  optionLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});
