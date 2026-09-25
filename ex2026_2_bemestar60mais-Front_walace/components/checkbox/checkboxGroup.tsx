import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type CheckboxOption = {
  id: string;
  label: string;
  value: string;
};

type CheckboxGroupProps = {
  options: CheckboxOption[];
  defaultValues?: string[];
  onChange?: (selected: string[]) => void;
  direction?: 'row' | 'column'; // nova prop
};

export default function CheckboxGroup({
  options,
  defaultValues = [],
  onChange,
  direction = 'row', // valor padrão
}: CheckboxGroupProps) {
  const [selectedValues, setSelectedValues] = useState<string[]>(defaultValues);

  const toggleSelection = (id: string) => {
    setSelectedValues((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];

      onChange?.(updated);
      return updated;
    });
  };

  const isSelected = (id: string) => selectedValues.includes(id);

  return (
    <View style={styles.groupContainer}>
      <View
        style={[
          styles.optionsContainer,
          { flexDirection: direction },
        ]}
      >
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.option,
              direction === 'row' ? { alignItems: 'center' } : { flexDirection: 'row', alignItems: 'center', gap: 8 },
            ]}
            onPress={() => toggleSelection(option.id)}
          >
            <View style={[styles.circle, isSelected(option.id) && styles.selectedCircle]}>
              {isSelected(option.id) && <View style={styles.innerCircle} />}
            </View>
            <Text
              style={[
                styles.optionLabel,
                direction === 'row' ? { marginTop: 4 } : { marginTop: 0 },
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  groupContainer: {
    marginBottom: 20,
    marginTop: 10,
    width: 200,
  },
  optionsContainer: {
    justifyContent: 'space-between',
    gap: 8,
  },
  option: {
    gap: 4,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 6,
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
    borderRadius: 3,
    backgroundColor: '#007AFF',
  },
  optionLabel: {
    fontSize: 16,
  },
});