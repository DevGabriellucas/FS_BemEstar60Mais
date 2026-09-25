import { Text } from "react-native";
import { Calendar, LocaleConfig } from 'react-native-calendars';

import { format, toZonedTime } from 'date-fns-tz';

// Configuração para português
LocaleConfig.locales['pt'] = {
    monthNames: [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    monthNamesShort: [
        'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
        'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ],
    dayNames: [
        'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
        'Quinta-feira', 'Sexta-feira', 'Sábado'
    ],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt';

type Props = {
    diasTreinados: string[];
    diasNaoTreinados: string[];
}

export default function CalendarioTreino({diasTreinados, diasNaoTreinados}: Props) {
      const agora = new Date();
      const dataNoFusoBrasil = toZonedTime(agora, 'America/Sao_Paulo');
      const dataFormatada = format(dataNoFusoBrasil, 'yyyy-MM-dd', {
        timeZone: 'America/Sao_Paulo',
      });

    console.log("hoje", dataFormatada);

    const generateMarkedDates = () => {
        const marked: Record<string, any> = {};

        const formatarData = (data: string) => {
            const [ano, mes, dia] = data.split('-');
            const anoCorrigido = ano.length === 2 ? `20${ano}` : ano;
            return `${anoCorrigido}-${mes}-${dia}`;
        };

        diasTreinados.forEach(date => {
            const dataFormatada = formatarData(date);
            marked[dataFormatada] = {
                selected: true,
                selectedColor: 'green',
            };
        });

        diasNaoTreinados.forEach(date => {
            const dataFormatada = formatarData(date);
            marked[dataFormatada] = {
                selected: true,
                selectedColor: 'red',
            };
        });

        if (!marked[dataFormatada]) {
            marked[dataFormatada] = {
                selected: true,
                selectedColor: '#FFC107',
            };
        }

        return marked;
    };

    const markedDates = generateMarkedDates();
    console.log(markedDates)

    return(
        <Calendar
            markedDates={markedDates}
            onDayPress={(day: any) => {
                console.log('Dia selecionado', day);
            }} 
            theme={{
                todayTextColor: 'blue',
                arrowColor: 'blue',
                selectedDayTextColor: 'white',
            }}
        />
    )
}