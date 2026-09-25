import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';

type Props = {
    usuario: string;
    disableSettings?: boolean;
    disableCalendar?: boolean;
};

export default function Header({ usuario, disableSettings, disableCalendar }: Props) {
    const router = useRouter();

    function goToCalendar() {
        if (disableCalendar) return;
        console.log("Calendário");
    }

    function goToSettings() {
        if (disableSettings) return;

        console.log("Configurações");

        if( usuario == "Aluno" ){
            router.push("/(aluno)/telaConfig");
        }

        if( usuario == "Instrutor" ){
            router.push("/(instrutor)/telaConfig");
        }
        
    }

    return (
        <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Bem-vindo, {usuario}!</Text>
            <View style={styles.buttonsContainer}>

                {usuario == "Aluno" &&                 
                    <TouchableOpacity 
                        onPress={goToCalendar} 
                        style={[
                            styles.buttonBase,
                            { backgroundColor: disableCalendar ? '#bbbbbb' : '#D9D9D9' }
                        ]}
                    >
                        <MaterialCommunityIcons 
                            name="calendar-check" 
                            size={25} 
                            color={disableCalendar ? '#7d7d7d' : 'black'} 
                        />
                    </TouchableOpacity>
                }


                <TouchableOpacity 
                    onPress={goToSettings} 
                    style={[
                        styles.buttonBase,
                        { backgroundColor: disableSettings ? '#bbbbbb' : '#D9D9D9' }
                    ]}
                >
                    <Ionicons 
                        name="settings" 
                        size={24} 
                        color={disableSettings ? '#7d7d7d' : 'black'} 
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        width: '100%',
        paddingHorizontal: 20,
        paddingTop: 50,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 22,
        color: 'white',
        fontWeight: 'bold',
        textShadowColor: '#7d7d7d',
        textShadowOffset: { width: 2, height: 1 },
        textShadowRadius: 3,
    },
    buttonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonBase: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    },
});
