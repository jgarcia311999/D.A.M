const palos = ['copas', 'cigarros', 'oros', 'pollos'];

const generarBarajaCompleta = () => {
  const baraja = [];
  const valores = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'j', 'q', 'k'];
  for (let i of valores) {
    for (let palo of palos) {
      baraja.push({ numero: i, palo });
    }
  }
  return baraja;
};

import React, { useState, useRef, useEffect } from 'react';
import { Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { View, Text, Button, StyleSheet, Modal, TouchableOpacity, ScrollView, Image, SafeAreaView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const imagenesCartas = {
  'cigarros_1': require('../assets/cartas/cigarros/sf/cig-1.png'),
  'cigarros_2': require('../assets/cartas/cigarros/sf/cig-2.png'),
  'cigarros_3': require('../assets/cartas/cigarros/sf/cig-3.png'),
  'cigarros_4': require('../assets/cartas/cigarros/sf/cig-4.png'),
  'cigarros_5': require('../assets/cartas/cigarros/sf/cig-5.png'),
  'cigarros_6': require('../assets/cartas/cigarros/sf/cig-6.png'),
  'cigarros_7': require('../assets/cartas/cigarros/sf/cig-7.png'),
  'cigarros_8': require('../assets/cartas/cigarros/sf/cig-8.png'),
  'cigarros_9': require('../assets/cartas/cigarros/sf/cig-9.png'),
  'cigarros_j': require('../assets/cartas/cigarros/sf/cig-j.png'),
  'cigarros_q': require('../assets/cartas/cigarros/sf/cig-q.png'),
  'cigarros_k': require('../assets/cartas/cigarros/sf/cig-k.png'),
  'copas_1': require('../assets/cartas/copas/sf/cub-1.png'),
  'copas_2': require('../assets/cartas/copas/sf/cub-2.png'),
  'copas_3': require('../assets/cartas/copas/sf/cub-3.png'),
  'copas_4': require('../assets/cartas/copas/sf/cub-4.png'),
  'copas_5': require('../assets/cartas/copas/sf/cub-5.png'),
  'copas_6': require('../assets/cartas/copas/sf/cub-6.png'),
  'copas_7': require('../assets/cartas/copas/sf/cub-7.png'),
  'copas_8': require('../assets/cartas/copas/sf/cub-8.png'),
  'copas_9': require('../assets/cartas/copas/sf/cub-9.png'),
  'copas_j': require('../assets/cartas/copas/sf/cub-j.png'),
  'copas_q': require('../assets/cartas/copas/sf/cub-q.png'),
  'copas_k': require('../assets/cartas/copas/sf/cub-k.png'),
  'oros_1': require('../assets/cartas/oros/sf/oro-1.png'),
  'oros_2': require('../assets/cartas/oros/sf/oro-2.png'),
  'oros_3': require('../assets/cartas/oros/sf/oro-3.png'),
  'oros_4': require('../assets/cartas/oros/sf/oro-4.png'),
  'oros_5': require('../assets/cartas/oros/sf/oro-5.png'),
  'oros_6': require('../assets/cartas/oros/sf/oro-6.png'),
  'oros_7': require('../assets/cartas/oros/sf/oro-7.png'),
  'oros_8': require('../assets/cartas/oros/sf/oro-8.png'),
  'oros_9': require('../assets/cartas/oros/sf/oro-9.png'),
  'oros_j': require('../assets/cartas/oros/sf/oro-j.png'),
  'oros_q': require('../assets/cartas/oros/sf/oro-q.png'),
  'oros_k': require('../assets/cartas/oros/sf/oro-k.png'),
  'pollos_1': require('../assets/cartas/pollos/sf/poll-1.png'),
  'pollos_2': require('../assets/cartas/pollos/sf/poll-2.png'),
  'pollos_3': require('../assets/cartas/pollos/sf/poll-3.png'),
  'pollos_4': require('../assets/cartas/pollos/sf/poll-4.png'),
  'pollos_5': require('../assets/cartas/pollos/sf/poll-5.png'),
  'pollos_6': require('../assets/cartas/pollos/sf/poll-6.png'),
  'pollos_7': require('../assets/cartas/pollos/sf/poll-7.png'),
  'pollos_8': require('../assets/cartas/pollos/sf/poll-8.png'),
  'pollos_9': require('../assets/cartas/pollos/sf/poll-9.png'),
  'pollos_j': require('../assets/cartas/pollos/sf/poll-j.png'),
  'pollos_q': require('../assets/cartas/pollos/sf/poll-q.png'),
  'pollos_k': require('../assets/cartas/pollos/sf/poll-k.png'),
};

const valores = {
  1: 'Elige quién bebe',
  2: 'Tomas tú',
  3: 'Reparte – Elige a 3 personas y reparte tragos',
  4: 'Pregunta caliente – Haz una pregunta o bebe',
  5: 'Rimas – Di una palabra, el que falle bebe',
  6: 'Categoría – El que falle, bebe',
  7: 'Todos beben',
  8: 'Nueva regla – Aplica hasta el próximo 8',
  9: 'Pulgar en la mesa – El último en copiar, bebe',
  10: 'Cambio – De asiento o bebida',
  11: 'Duelo – Piedra, papel o tijera',
  12: 'Vaso del Rey 👑 – Agrega bebida al vaso central',
};

const tragosPorPalo = {
  copas: 1,
  cigarros: 2,
  oros: 3,
  pollos: 4,
};

const generarCarta = () => {
  const valores = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'j', 'q', 'k'];
  const numero = valores[Math.floor(Math.random() * valores.length)];
  const palo = palos[Math.floor(Math.random() * palos.length)];
  return { numero, palo };
};

export default function GameTwoScreen({ route, navigation }) {
  const jugadores = route?.params?.jugadores || [];
  const [carta, setCarta] = useState(null);
  const [jugadorActual, setJugadorActual] = useState('');
  const [registro, setRegistro] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [mazo, setMazo] = useState(generarBarajaCompleta());
  const [modalCartasVisible, setModalCartasVisible] = useState(false);
  const [modalRankingVisible, setModalRankingVisible] = useState(false);
  const [ultimasCartas, setUltimasCartas] = useState([]);
  const [mostrarOpciones, setMostrarOpciones] = useState(false);
  // Animación para las opciones del header (deslizamiento vertical y opacidad)
  const slideAnim = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: mostrarOpciones ? 0 : -20,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [mostrarOpciones]);

  const sacarCarta = () => {
    if (mazo.length === 0) {
      alert('¡Se han acabado las cartas!');
      return;
    }

    const index = Math.floor(Math.random() * mazo.length);
    const nueva = mazo[index];
    const nuevoMazo = [...mazo];
    nuevoMazo.splice(index, 1);

    const jugador = jugadores[Math.floor(Math.random() * jugadores.length)];
    setJugadorActual(jugador);
    setCarta(nueva);
    setRegistro(prev => [...prev, { jugador: jugador, carta: { numero: nueva.numero, palo: nueva.palo } }]);
    setMazo(nuevoMazo);
    setUltimasCartas(prev => {
      // Excluir la carta actual y mantener secuencia sin duplicados
      const nuevaLista = [
        ...prev.filter(c => !(c.numero === nueva.numero && c.palo === nueva.palo)),
        { numero: nueva.numero, palo: nueva.palo }
      ];
      return nuevaLista.slice(-4);
    });
  };

  const reiniciar = () => {
    setCarta(null);
    setJugadorActual('');
    setMazo(generarBarajaCompleta());
    setRegistro([]);
    setUltimasCartas([]);
  };

  return (
    <TouchableWithoutFeedback onPress={() => setMostrarOpciones(false)}>
      <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
          Haptics.selectionAsync();
          navigation.goBack();
        }}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setMostrarOpciones(!mostrarOpciones)}>
          <Ionicons name="ellipsis-vertical" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
      <Animated.View style={[
        styles.headerOptions,
        {
          transform: [{ translateY: slideAnim }],
          opacity: mostrarOpciones ? 1 : 0,
        }
      ]}>
        {mostrarOpciones && (
          <>
            <TouchableOpacity style={styles.primaryButton} onPress={() => {
              setMostrarOpciones(false);
              setModalVisible(true);
            }}>
              <Text style={styles.primaryButtonText}>Registro</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryButton} onPress={() => {
              setMostrarOpciones(false);
              setModalCartasVisible(true);
            }}>
              <Text style={styles.primaryButtonText}>Cartas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryButton} onPress={() => {
              setMostrarOpciones(false);
              setModalRankingVisible(true);
            }}>
              <Text style={styles.primaryButtonText}>Ranking</Text>
            </TouchableOpacity>
            {carta && (
              <TouchableOpacity style={styles.primaryButton} onPress={() => {
                setMostrarOpciones(false);
                reiniciar();
              }}>
                <Text style={styles.primaryButtonText}>Reiniciar</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </Animated.View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
        {ultimasCartas
          .filter(c => !(c.numero === carta?.numero && c.palo === carta?.palo))
          .map((c, index) => {
            let valor = c.numero;
            let displayValor = valor;
            if (valor === 'j') {
              displayValor = 'J';
            } else if (valor === 'q') {
              displayValor = 'Q';
            } else if (valor === 'k') {
              displayValor = 'K';
            }
            const key = `${c.palo}_${valor}`;
            const source = imagenesCartas[key];
            return (
              <Image
                key={index}
                source={source}
                style={{ width: 50, height: 75, marginHorizontal: 4, resizeMode: 'contain' }}
              />
            );
          })}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalRankingVisible}
        onRequestClose={() => setModalRankingVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '80%' }]}>
            <Text style={styles.modalTitle}>Ranking de tragos</Text>
            <ScrollView>
              {Object.entries(
                registro.reduce((acc, item) => {
                  const tragos = tragosPorPalo[item.carta.palo];
                  acc[item.jugador] = (acc[item.jugador] || 0) + tragos;
                  return acc;
                }, {})
              )
                .sort((a, b) => b[1] - a[1])
                .map(([jugador, tragos], index) => (
                  <Text key={index} style={styles.modalItem}>
                    {index + 1}. {jugador} — {tragos} trago(s)
                  </Text>
                ))}
            </ScrollView>
            <Button title="Cerrar" color="#fff" onPress={() => setModalRankingVisible(false)} />
          </View>
        </View>
      </Modal>

      {carta && (
        <>
          {(() => {
            let valor = carta.numero;
            if (valor === 'j' || valor === 'q' || valor === 'k') {
              valor = valor;
            }
            const key = `${carta.palo}_${valor}`;
            const source = imagenesCartas[key];
            if (source) {
              return (
                <Image
                  source={source}
                  style={{
                    width: 150,
                    height: 225,
                    marginVertical: 10,
                    resizeMode: 'contain',
                    backgroundColor: 'transparent',
                    borderRadius: 12,
                  }}
                />
              );
            }
            return null;
          })()}
          {(() => {
            let valor = carta.numero;
            let displayValor = valor;
            if (valor === 'j') {
              displayValor = 'J';
            } else if (valor === 'q') {
              displayValor = 'Q';
            } else if (valor === 'k') {
              displayValor = 'K';
            }
            return (
              <Text style={styles.carta}>
                {displayValor} de {carta.palo}
              </Text>
            );
          })()}
          <Text style={styles.accion}>
            {jugadorActual ? `${jugadorActual}, ${valores[carta.numero]}` : valores[carta.numero]}
          </Text>
          <Text style={styles.tragos}>
            {tragosPorPalo[carta.palo]} {carta.palo === 'copas' ? 'trago' : 'tragos'} por ser {carta.palo}
          </Text>
        </>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Registro de cartas</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {registro.map((item, index) => {
                let valor = item.carta.numero;
                let displayValor = valor;
                if (valor === 'j') {
                  displayValor = 'J';
                } else if (valor === 'q') {
                  displayValor = 'Q';
                } else if (valor === 'k') {
                  displayValor = 'K';
                }
                return (
                  <Text key={index} style={styles.modalItem}>
                    {item.jugador}: {displayValor} de {item.carta.palo}
                  </Text>
                );
              })}
            </ScrollView>
            <Button title="Cerrar" color="#fff" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalCartasVisible}
        onRequestClose={() => setModalCartasVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '80%' }]}>
            <Text style={styles.modalTitle}>Cartas restantes por palo</Text>
            <ScrollView>
              {palos.map((palo) => {
                const numerosRestantes = mazo
                  .filter(carta => carta.palo === palo)
                  .map(carta => carta.numero);

                return (
                  <View key={palo} style={{ marginBottom: 12 }}>
                    <Text style={{ fontWeight: 'bold', textTransform: 'capitalize', color: '#fff' }}>{palo}</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                      {Array.from({ length: 12 }, (_, i) => {
                        const numMap = i + 1 <= 9 ? i + 1 : ['j', 'q', 'k'][i - 9];
                        return numMap;
                      }).map(num => (
                        <Text
                          key={num}
                          style={{
                            width: 30,
                            textAlign: 'center',
                            textDecorationLine: numerosRestantes.includes(num) ? 'none' : 'line-through',
                            color: numerosRestantes.includes(num) ? '#fff' : '#bbb',
                            fontSize: 16,
                          }}
                        >
                          {typeof num === 'number' ? num : num.toUpperCase()}
                        </Text>
                      ))}
                    </View>
                  </View>
                );
              })}
            </ScrollView>
            <Button title="Cerrar" color="#fff" onPress={() => setModalCartasVisible(false)} />
          </View>
        </View>
      </Modal>

      {!carta && (
        <View style={styles.introWrapper}>
          <Text style={styles.introText}>
            Prepara chupitos para empezar 
          </Text>
        </View>
      )}
      <View style={styles.bottomControls}>
        <TouchableOpacity style={styles.primaryButton} onPress={() => {
          setMostrarOpciones(false);
          sacarCarta();
        }}>
          <Text style={styles.primaryButtonText}>
            {carta ? 'Sacar otra carta' : 'Sacar carta'}
          </Text>
        </TouchableOpacity>
      </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d5c385',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  header: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    zIndex: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: 'Panchang-Regular',
    color: '#780000',
  },
  carta: {
    fontSize: 32,
    marginTop: 20,
    color: '#000',
    fontFamily: 'Panchang-Regular',
  },
  accion: {
    fontSize: 18,
    marginVertical: 10,
    textAlign: 'center',
    color: '#000',
    fontFamily: 'Panchang-Regular',
  },
  tragos: {
    fontSize: 16,
    color: '#000',
    marginBottom: 20,
    fontFamily: 'Panchang-Regular',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#B29D55',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'black',
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
    fontFamily: 'Panchang-Regular',
  },
  modalItem: {
    fontSize: 16,
    marginVertical: 4,
    color: '#000',
    fontFamily: 'Panchang-Regular',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButton: {
    marginBottom: 10,
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
  },
  optionButtons: {
    marginBottom: 10,
    alignItems: 'center',
  },
  optionButton: {
    backgroundColor: '#E2D6FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginVertical: 3,
  },
  optionText: {
    color: '#000',
    fontSize: 14,
    fontFamily: 'Panchang-Regular',
  },
  primaryButton: {
    backgroundColor: '#B29D55',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'black',
    marginVertical: 6,
  },
  primaryButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Panchang-Regular',
  },
  headerOptions: {
    position: 'absolute',
    top: 90,
    right: 20,
    zIndex: 3,
    alignItems: 'flex-end',
  },
  introText: {
    fontSize: 22,
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 30,
    fontFamily: 'Panchang-Regular',
  },
  introWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
