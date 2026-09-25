import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type RadioOption = {
  id: string;
  label: string;
};

type RadioGroupProps = {
  title: string;
  options: RadioOption[];
  selectedValue: string | null;
  onSelect: (value: string) => void;
};

export default function RadioGroup({ title, selectedValue, options, onSelect }: RadioGroupProps) {
  return (
    <View style={styles.groupContainer}>
      <Text style={styles.label}>{title}</Text>
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={styles.option}
            onPress={() => onSelect(option.id)}
          >
            <View style={[styles.circle, selectedValue === option.id && styles.selectedCircle]}>
              {selectedValue === option.id && <View style={styles.innerCircle} />}
            </View>
            <Text style={styles.optionLabel}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

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