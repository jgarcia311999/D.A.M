import React, { useState } from 'react';
import frasesPorJuego from '../../data/frasesJuegos';
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


  const generarFrase = () => {
    const frases = frasesPorJuego[minijuego.id];
    if (!frases || frases.length === 0) return;

    let restantes = frases.filter(f => !frasesMostradas.includes(f));

    if (restantes.length === 0) {
      restantes = [...frases];
      setFrasesMostradas([]);
    }

    const aleatoria = restantes[Math.floor(Math.random() * restantes.length)];
    if (minijuego.id === 'tabu') {
      setFraseActual({ palabra: aleatoria.palabra, prohibidas: aleatoria.prohibidas });
    } else {
      setFraseActual(aleatoria);
    }
    setInstruccionesExpandido(false);
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
            if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            navigation.navigate('MiniGames');
          }
          }}
        >
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#000' }}>{minijuego.titulo}</Text>
      </View>
      <View style={{ flex: 1, backgroundColor: '#70B77C' }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', alignItems: 'center', paddingHorizontal: 24, paddingTop: insets.top + 64, paddingBottom: 40 }}>

          {mostrarFrase && (
            <View style={styles.card}>
              {minijuego.id === 'tabu' ? (
                <>
                  <Text style={[styles.text, { fontSize: 28, fontWeight: 'bold', marginBottom: 12 }]}>
                    {fraseActual.palabra}
                  </Text>
                  <Text style={[styles.text, { fontSize: 16 }]}>
                    {fraseActual.prohibidas.join(', ')}
                  </Text>
                </>
              ) : (
                <Text style={styles.text}>{fraseActual}</Text>
              )}
            </View>
          )}

          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => setInstruccionesExpandido(prev => !prev)}
          >
            <>
              <Text style={[styles.text, { textDecorationLine: 'underline', fontFamily: 'Panchang-Bold' }]}>Instrucciones</Text>
              {instruccionesExpandido && (
                typeof minijuego.descripcionDetallada === 'object' ? (
                  <View style={{ marginTop: 12, width: '100%' }}>
                    <Text style={[styles.text, { textAlign: 'left', fontSize: 16, marginBottom: 30, marginTop: 15 }]}>
                      <Text style={{ fontFamily: 'Panchang-Semibold' }}>Número de jugadores:{'\n'}</Text>
                      {minijuego.descripcionDetallada.jugadores}
                    </Text>
                    <Text style={[styles.text, { textAlign: 'left', fontSize: 16, marginBottom: 30 }]}>
                      <Text style={{ fontFamily: 'Panchang-Semibold' }}>Objetivo del juego:{'\n'}</Text>
                      {minijuego.descripcionDetallada.objetivo}
                    </Text>
                    <Text style={[styles.text, { textAlign: 'left', fontSize: 16, marginBottom: 30 }]}>
                      <Text style={{ fontFamily: 'Panchang-Semibold' }}>Cómo se juega:{'\n'}</Text>
                      {minijuego.descripcionDetallada.comoSeJuega}
                    </Text>
                    <Text style={[styles.text, { textAlign: 'left', fontSize: 16 }]}>
                      <Text style={{ fontFamily: 'Panchang-Semibold' }}>Consejos:{'\n'}</Text>
                      {minijuego.descripcionDetallada.consejos}
                    </Text>
                  </View>
                ) : (
                  <Text style={[styles.text, { marginTop: 12, fontSize: 14, textAlign: 'left', lineHeight: 20 }]}>
                    {minijuego.descripcionDetallada}
                  </Text>
                )
              )}
            </>
          </TouchableOpacity>

        </ScrollView>
        {minijuego.tieneLogica && (
          <View style={styles.botonFijo}>
            <TouchableOpacity
              onPress={generarFrase}
              style={styles.botonGenerar}
            >
              <Text style={styles.botonGenerarTexto}>Generar frase</Text>
            </TouchableOpacity>
          </View>
        )}
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
  botonFijo: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20,
  },
  botonGenerar: {
    backgroundColor: '#9ED2A7',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000',
    shadowColor: '#fff',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  botonGenerarTexto: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
