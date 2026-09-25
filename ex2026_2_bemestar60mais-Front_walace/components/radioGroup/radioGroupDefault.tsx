import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type RadioOption = {
  id: string;
  label: string;
  value: string | number | boolean | null;
};

type RadioGroupProps = {
  options: RadioOption[];
  selectedValue: string | number | boolean | null;
  onSelect: (value: string | number | boolean | null) => void;
  width?: number;
};

export default function RadioGroupLDefault({
  selectedValue,
  options,
  onSelect,
  width = 100,
}: RadioGroupProps) {
  return (
    <View style={[styles.groupContainer, { width }]}>
      <View style={styles.optionsContainer}>
        {options.map((option) => {
          const isSelected = String(selectedValue) === String(option.value);
          return (
            <TouchableOpacity
              key={option.id}
              style={styles.option}
              onPress={() => onSelect(isSelected ? null : option.value)}
            >
              <View style={[styles.circle, isSelected && styles.selectedCircle]}>
                {isSelected && <View style={styles.innerCircle} />}
              </View>
              <Text style={styles.optionLabel}>{option.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  groupContainer: {
    marginTop: 10,
    marginBottom: 20,
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