import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

export default function VariosMinigames({ route }) {
  const { minijuego } = route.params;
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [mostrarFrase, setMostrarFrase] = useState(false);
  const [fraseActual, setFraseActual] = useState('');
  const [instruccionesExpandido, setInstruccionesExpandido] = useState(true);
  const [frasesMostradas, setFrasesMostradas] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setMostrarFrase(false);
        setFraseActual('');
        setInstruccionesExpandido(true);
        setFrasesMostradas([]);
      };
    }, [])
  );

  const frasesPorJuego = {
    mimica: ['Mímica 1', 'Mímica 2', 'Mímica 3', 'Mímica 4', 'Mímica 5'],
    telefono: ['Teléfono 1', 'Teléfono 2', 'Teléfono 3', 'Teléfono 4', 'Teléfono 5'],
    palabras: ['Palabras 1', 'Palabras 2', 'Palabras 3', 'Palabras 4', 'Palabras 5'],
    canta_palabra: ['Canta 1', 'Canta 2', 'Canta 3', 'Canta 4', 'Canta 5'],
    tabu: ['Tabú 1', 'Tabú 2', 'Tabú 3', 'Tabú 4', 'Tabú 5'],
  };

  const generarFrase = () => {
    const frases = frasesPorJuego[minijuego.id];
    if (!frases || frases.length === 0) return;

    let restantes = frases.filter(f => !frasesMostradas.includes(f));

    if (restantes.length === 0) {
      restantes = [...frases];
      setFrasesMostradas([]);
    }

    const aleatoria = restantes[Math.floor(Math.random() * restantes.length)];
    setFraseActual(aleatoria);
    setMostrarFrase(true);
    setFrasesMostradas(prev => [...prev, aleatoria]);
  };

  return (
    <>
      <View style={{
        position: 'absolute',
        top: insets.top + 10,
        left: 0,
        right: 0,
        zIndex: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
      }}>
        <TouchableOpacity
          style={{ position: 'absolute', left: 20 }}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.goBack();
          }}
        >
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#000' }}>{minijuego.titulo}</Text>
      </View>
      <View style={{ flex: 1, backgroundColor: '#70B77C' }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', alignItems: 'center', paddingHorizontal: 24, paddingTop: insets.top + 64, paddingBottom: 40 }}>

          {minijuego.tieneLogica && (
            <TouchableOpacity
              onPress={generarFrase}
              style={{
                backgroundColor: '#9ED2A7',
                paddingVertical: 14,
                paddingHorizontal: 28,
                borderRadius: 12,
                marginTop: 12,
                marginBottom: 16,
                borderWidth: 2,
                borderColor: '#ffffff22',
                shadowColor: '#fff',
                shadowOpacity: 0.15,
                shadowOffset: { width: 0, height: 4 },
                shadowRadius: 6,
                elevation: 4,
              }}
            >
              <Text style={{ color: '#000', fontSize: 18, fontWeight: 'bold' }}>Generar frase</Text>
            </TouchableOpacity>
          )}

          {mostrarFrase && (
            <View style={styles.card}>
              <Text style={styles.text}>{fraseActual}</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => setInstruccionesExpandido(prev => !prev)}
          >
            <>
              <Text style={[styles.text, { textDecorationLine: 'underline', fontWeight: 'bold' }]}>Instrucciones</Text>
              {instruccionesExpandido && (
                <Text style={[styles.text, { marginTop: 12, fontSize: 16 }]}>
                  {minijuego.descripcionDetallada}
                </Text>
              )}
            </>
          </TouchableOpacity>

        </ScrollView>
      </View>
    </>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  card: {
    width: width * 0.85,
    minHeight: 120,
    borderRadius: 20,
    backgroundColor: '#9ED2A7',
    borderWidth: 2,
    borderColor: '#ffffff22',
    shadowColor: '#fff',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
    paddingVertical: 20,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 26,
  },
  text: {
    fontSize: 20,
    fontFamily: 'Panchang-Regular',
    color: '#000',
    textAlign: 'center',
    lineHeight: 28,
  },
});
