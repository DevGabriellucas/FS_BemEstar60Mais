import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, ActivityIndicator, StatusBar } from 'react-native';

import * as Progress from 'react-native-progress';

import { useAluno } from '@/api/hooks/useAluno';
import Header from '@/components/headers/header';

type WaterManagementScreenProps = {
    date: string;
		water_goal: number;
		water_consumed: number;
		isAchieved: boolean;
		percentage: number;
};

type ControleHidrico = {
  date: string;
  water_goal: number;
  water_consumed: number;
  isAchieved: boolean;
  percentage: number; 
};

const WaterManagementScreen = () => {
  const { obterControleHidrico, registroControleHidrico, loading, error } = useAluno();

  const [dadosControleHidrico, setDadosControleHidrico] = useState<ControleHidrico | null>(null);
  const [consumedMl, setConsumedMl] = useState(0);
  const [amountToAdd, setAmountToAdd] = useState(200);

  const dailyGoalLiters = 2;
  const dailyGoalMl = dailyGoalLiters * 1000;

  const fetchDados = async () => {
    const dadosResponse = await obterControleHidrico();
    if (dadosResponse) {
      setDadosControleHidrico(dadosResponse);
      setConsumedMl(dadosResponse.water_consumed);
    }
  };

  useEffect(() => {
    fetchDados();
  }, []);

  const handleRegister = async () => {
    const response = await registroControleHidrico({ 
      date: new Date().toISOString().split('T')[0], 
      water_consumed: consumedMl + amountToAdd, 
      water_goal: dailyGoalMl 
    });

    console.log(response);

    await fetchDados();
  };

  const handleIncreaseAmount = () => {
    setAmountToAdd(prev => prev + 100);
  };

  const handleDecreaseAmount = () => {
    setAmountToAdd(prev => (prev - 100 >= 100 ? prev - 100 : 100));
  };

  if (loading || !dadosControleHidrico) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if(dadosControleHidrico.water_consumed >= dadosControleHidrico.water_goal) {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor="#121212" barStyle="light-content" />
        
        <ImageBackground
          source={require('@/assets/images/appImages/bg.png')}
          style={styles.container}
          resizeMode="cover"
        >
          <Header usuario="Aluno" />

          <View style={styles.bodyContainer}>
            <Text style={styles.title}>Gestão Hídrica</Text>
            <Text style={styles.subtitle}>Confira e registre o seu consumo diário</Text>

            <Text style={styles.goalText}>Sua meta de consumo é:</Text>
            <View style={styles.goalContainer}>
              <Text style={styles.goalValue}>{dailyGoalLiters} litros</Text>
            </View>

            <View style={styles.successBox}>
              <Text style={styles.successText}>Parabéns! Você alcançou sua meta diária de hidratação.</Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require('@/assets/images/appImages/bg.png')}
        style={styles.container}
        resizeMode="cover"
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Bem-vindo, Aluno!</Text>
          <View style={styles.icon}>
            <Ionicons name="settings" size={24} color="black" />
          </View>
        </View>

        <View style={styles.bodyContainer}>
          <Text style={styles.title}>Gestão Hídrica</Text>
          <Text style={styles.subtitle}>Confira e registre o seu consumo diário</Text>

          <Text style={styles.goalText}>Sua meta de consumo é:</Text>
          <View style={styles.goalContainer}>
            <Text style={styles.goalValue}>{dailyGoalLiters} litros</Text>
          </View>

          <View style={styles.progressContainer}>
            <Text style={styles.consumedLabel}>Quantidade consumida:</Text>
            <Progress.Bar
              progress={(dadosControleHidrico.percentage ?? 0) / 100}
              width={250}
              color="#007BFF"
              unfilledColor="#e0e0e0"
              borderWidth={0}
              height={12}
            />
            <Text style={styles.percentageText}>
              ({dadosControleHidrico.water_consumed} ml) {Math.round(dadosControleHidrico.percentage ?? 0)}%
            </Text>
          </View>

          <View style={styles.amountContainer}>
            <TouchableOpacity style={styles.amountButton} onPress={handleDecreaseAmount}>
              <Text style={styles.amountButtonText}>-</Text>
            </TouchableOpacity>

            <Text style={styles.amountText}>{amountToAdd} ml</Text>

            <TouchableOpacity style={styles.amountButton} onPress={handleIncreaseAmount}>
              <Text style={styles.amountButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>REGISTRAR</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

export default WaterManagementScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
  },
  headerContainer: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 50,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    color: "white",
    fontWeight: "bold",
    textShadowColor: "#7d7d7d",
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 3,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#D9D9D9",
    alignItems: "center",
    justifyContent: "center",
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 10,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#8c8000',
  },
  bodyContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 13,
    color: '#777',
    marginBottom: 20,
    textAlign: 'center',
  },
  goalText: {
    fontSize: 15,
    marginBottom: 5,
  },
  goalContainer: {
    backgroundColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 20,
  },
  goalValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  consumedLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  percentageText: {
    fontSize: 14,
    marginTop: 10,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  amountButton: {
    backgroundColor: '#00c000',
    borderRadius: 25,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  amountButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  amountText: {
    fontSize: 20,
    marginHorizontal: 20,
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: '#00c000',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  registerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  successBox: {
  backgroundColor: "rgba(0, 186, 56, 0.2)", // verde semi-transparente
  padding: 12,
  borderRadius: 8,
  marginBottom: 20,
  borderWidth: 1,
  borderColor: "#00BA38",
  alignItems: "center",
},
successText: {
  color: "#006b26",
  fontSize: 14,
  fontWeight: "600",
  textAlign: "center",
},
});