const palos = ['oro', 'cubata', 'pollo', 'cigarro'];

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
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
import * as Haptics from 'expo-haptics';
import { View, Text, Button, StyleSheet, Modal, TouchableOpacity, ScrollView, Image, SafeAreaView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const imagenesCartas = {
  // ORO
  'oro_1': require('../assets/cartas_cortadas/oro_cartas/1.png'),
  'oro_2': require('../assets/cartas_cortadas/oro_cartas/2.png'),
  'oro_3': require('../assets/cartas_cortadas/oro_cartas/3.png'),
  'oro_4': require('../assets/cartas_cortadas/oro_cartas/4.png'),
  'oro_5': require('../assets/cartas_cortadas/oro_cartas/5.png'),
  'oro_6': require('../assets/cartas_cortadas/oro_cartas/6.png'),
  'oro_7': require('../assets/cartas_cortadas/oro_cartas/7.png'),
  'oro_8': require('../assets/cartas_cortadas/oro_cartas/8.png'),
  'oro_9': require('../assets/cartas_cortadas/oro_cartas/9.png'),
  'oro_10': require('../assets/cartas_cortadas/oro_cartas/10.png'),
  'oro_11': require('../assets/cartas_cortadas/oro_cartas/11.png'),
  'oro_12': require('../assets/cartas_cortadas/oro_cartas/12.png'),
  'oro_13': require('../assets/cartas_cortadas/oro_cartas/13.png'),

  // CUBATA
  'cubata_1': require('../assets/cartas_cortadas/cubata_carta/1.png'),
  'cubata_2': require('../assets/cartas_cortadas/cubata_carta/2.png'),
  'cubata_3': require('../assets/cartas_cortadas/cubata_carta/3.png'),
  'cubata_4': require('../assets/cartas_cortadas/cubata_carta/4.png'),
  'cubata_5': require('../assets/cartas_cortadas/cubata_carta/5.png'),
  'cubata_6': require('../assets/cartas_cortadas/cubata_carta/6.png'),
  'cubata_7': require('../assets/cartas_cortadas/cubata_carta/7.png'),
  'cubata_8': require('../assets/cartas_cortadas/cubata_carta/8.png'),
  'cubata_9': require('../assets/cartas_cortadas/cubata_carta/9.png'),
  'cubata_10': require('../assets/cartas_cortadas/cubata_carta/10.png'),
  'cubata_11': require('../assets/cartas_cortadas/cubata_carta/11.png'),
  'cubata_12': require('../assets/cartas_cortadas/cubata_carta/12.png'),
  'cubata_13': require('../assets/cartas_cortadas/cubata_carta/13.png'),

  // POLLO
  'pollo_1': require('../assets/cartas_cortadas/pollo_cartas/1.png'),
  'pollo_2': require('../assets/cartas_cortadas/pollo_cartas/2.png'),
  'pollo_3': require('../assets/cartas_cortadas/pollo_cartas/3.png'),
  'pollo_4': require('../assets/cartas_cortadas/pollo_cartas/4.png'),
  'pollo_5': require('../assets/cartas_cortadas/pollo_cartas/5.png'),
  'pollo_6': require('../assets/cartas_cortadas/pollo_cartas/6.png'),
  'pollo_7': require('../assets/cartas_cortadas/pollo_cartas/7.png'),
  'pollo_8': require('../assets/cartas_cortadas/pollo_cartas/8.png'),
  'pollo_9': require('../assets/cartas_cortadas/pollo_cartas/9.png'),
  'pollo_10': require('../assets/cartas_cortadas/pollo_cartas/10.png'),
  'pollo_11': require('../assets/cartas_cortadas/pollo_cartas/11.png'),
  'pollo_12': require('../assets/cartas_cortadas/pollo_cartas/12.png'),
  'pollo_13': require('../assets/cartas_cortadas/pollo_cartas/13.png'),

  // CIGARRO
  'cigarro_1': require('../assets/cartas_cortadas/cigarro_cartas/1.png'),
  'cigarro_2': require('../assets/cartas_cortadas/cigarro_cartas/2.png'),
  'cigarro_3': require('../assets/cartas_cortadas/cigarro_cartas/3.png'),
  'cigarro_4': require('../assets/cartas_cortadas/cigarro_cartas/4.png'),
  'cigarro_5': require('../assets/cartas_cortadas/cigarro_cartas/5.png'),
  'cigarro_6': require('../assets/cartas_cortadas/cigarro_cartas/6.png'),
  'cigarro_7': require('../assets/cartas_cortadas/cigarro_cartas/7.png'),
  'cigarro_8': require('../assets/cartas_cortadas/cigarro_cartas/8.png'),
  'cigarro_9': require('../assets/cartas_cortadas/cigarro_cartas/9.png'),
  'cigarro_10': require('../assets/cartas_cortadas/cigarro_cartas/10.png'),
  'cigarro_11': require('../assets/cartas_cortadas/cigarro_cartas/11.png'),
  'cigarro_12': require('../assets/cartas_cortadas/cigarro_cartas/12.png'),
  'cigarro_13': require('../assets/cartas_cortadas/cigarro_cartas/13.png'),

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
  oro: 1,
  cubata: 2,
  pollo: 3,
  cigarro: 4,
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
          if (navigation.canGoBack()) {
            if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            navigation.navigate('Inicio');
          }
          } else {
            navigation.navigate('Inicio');
          }
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
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignSelf: 'center', 
        width: 4 * 50 + 3 * 8, // 4 cartas de 50 y 3 márgenes de 8px
        marginTop: 10 
      }}>
        {ultimasCartas.length === 0 ? (
          // Placeholder invisible para la primera ronda
          <View
            style={{
              width: 50,
              height: 75,
              marginHorizontal: 4,
              opacity: 0,
            }}
          />
        ) : (
          ultimasCartas.slice(-4).map((c, index) => {
            let valor = c.numero;
            if (valor === 'j') valor = '11';
            else if (valor === 'q') valor = '12';
            else if (valor === 'k') valor = '13';
            const key = `${c.palo}_${valor}_${index}`;
            const source = imagenesCartas[`${c.palo}_${valor}`];
            return (
              <Image
                key={key}
                source={source}
                style={{ width: 50, height: 75, marginHorizontal: 4, resizeMode: 'contain' }}
              />
            );
          })
        )}
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

      {carta && (() => {
        let valor = carta.numero;
        let displayValor = valor;
        if (valor === 'j') {
          valor = '11';
          displayValor = 'J';
        } else if (valor === 'q') {
          valor = '12';
          displayValor = 'Q';
        } else if (valor === 'k') {
          valor = '13';
          displayValor = 'K';
        }
        const key = `${carta.palo}_${valor}`;
        const source = imagenesCartas[key];
        return (
          <View style={styles.cartaMarco}>
            <Image
              source={source}
              style={styles.cartaImagenMarco}
            />
            <View style={styles.textoEnCarta}>
              <Text style={styles.carta}>{displayValor} de {carta.palo}</Text>
              <Text style={styles.accion}>
                {jugadorActual ? `${jugadorActual}, ${valores[carta.numero]}` : valores[carta.numero]}
              </Text>
            </View>
          </View>
        );
      })()}

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
                if (valor === 'j') valor = '11';
                else if (valor === 'q') valor = '12';
                else if (valor === 'k') valor = '13';
                let displayValor = item.carta.numero;
                if (item.carta.numero === 'j') displayValor = 'J';
                else if (item.carta.numero === 'q') displayValor = 'Q';
                else if (item.carta.numero === 'k') displayValor = 'K';
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
    backgroundColor: '#F4B7D1',
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
    textAlign: 'center',
    paddingHorizontal: 0,
  },
  accion: {
    fontSize: 18,
    marginVertical: 10,
    textAlign: 'center',
    color: '#000',
    fontFamily: 'Panchang-Regular',
    paddingHorizontal: 0,
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
    backgroundColor: '#E98FB5',
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
  cartaMarco: {
    alignSelf: 'center',
    width: width * 0.98,        
    height: height * 0.8,       
    marginVertical: 10,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartaImagenMarco: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    position: 'absolute',
  },
  textoEnCarta: {
    position: 'absolute',
    top: height * 0.2,
    paddingHorizontal: 32,
    alignItems: 'center',
    alignSelf: 'center',
    width: width * 0.85,
  },
  cartaFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 50,
    height: 150,
    width: '100%',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
});