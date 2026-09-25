import { View, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

type DropdownItem = {
  label: string;
  value: string | number;
};

type Props = {
  data: DropdownItem[];
  value: string | number | null;
  onChange: (value: string | number) => void;
};

export default function DropdownBasic({ data, value, onChange }: Props) {
  return (
    <View style={styles.container}>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        iconStyle={styles.iconStyle}
        data={data}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Selecione um campo"
        value={value}
        onChange={item => {
          onChange(item.value);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  dropdown: {
    height: 50,
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    width: '100%',
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#aaa',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#333',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
});
