import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import DropdownBasic from "../dropDowns/DropdownBasic";

type Props = {
    data: any,
    colorMain: string,
    colorSecondary: string,
    title: string,
    labelX: string,
    labelY: string
}

export default function Graficos({
    data, colorMain, colorSecondary, labelX, labelY, title
}: Props) {
    const [selectedMonth, setSelectedMonth] = useState<string | number>('');

    const dropdownData = [
        { label: 'Janeiro', value: 'janeiro' },
        { label: 'Fevereiro', value: 'fevereiro' },
        { label: 'Marco', value: 'marco' },
        { label: 'Abril', value: 'abril' },
        { label: 'Maio', value: 'maio' },
        { label: 'Junho', value: 'junho' },
        { label: 'Julho', value: 'julho' },
        { label: 'Agosto', value: 'agosto' },
        { label: 'Setembro', value: 'setembro' },
        { label: 'Outubro', value: 'outubro' },
        { label: 'Novembro', value: 'novembro' },
        { label: 'Dezembro', value: 'dezembro' },
    ];

    const mesAtualIndex = new Date().getMonth();

    const mesesPassados = dropdownData.slice(0, mesAtualIndex + 1);

    useEffect(() => {
        const mesAtualIndex = new Date().getMonth();
        setSelectedMonth(dropdownData[mesAtualIndex].value);
    }, []);

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[styles.headerTitle, { flex: 1 }]}>{title}</Text>
                <View style={{ width: '50%' }}>
                    <DropdownBasic
                        data={mesesPassados}
                        value={selectedMonth}
                        onChange={setSelectedMonth}
                    />
                </View>
            </View>

            {/* Eixo Y */}
            <Text style={styles.yAxisLabel}>{labelY}</Text>

            {/* Line Chart */}
            <LineChart
                areaChart
                data={data[selectedMonth]}
                startFillColor={colorMain}
                endFillColor={colorSecondary}
                startOpacity={0.8}
                endOpacity={0.3}
                height={200}
                width={250} 
                initialSpacing={5}
            />

            {/* Eixo X */}
            <Text style={styles.xAxisLabel}>{labelX}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 250,
        width: '100%',
        paddingHorizontal: 20,
        marginBottom: 125,
    },
    headerTitle:{
        fontSize: 17,
        fontWeight: '500',
        marginBottom: 8,
        textAlign: 'center',
    },
    yAxisLabel: {
        fontSize: 13,
        fontWeight: '400',
        color: 'rgba(0, 0, 0, 0.6)',
        marginBottom: 10,
    },
    xAxisLabel: {
        fontSize: 13,
        fontWeight: '400',
        color: 'rgba(0, 0, 0, 0.6)',
        marginTop: 10,
        textAlign: 'center',
    },
});