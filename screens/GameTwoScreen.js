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

import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Modal, TouchableOpacity, ScrollView, Image } from 'react-native';

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
  corazones: 1,
  tréboles: 2,
  diamantes: 3,
  picas: 4,
};

const generarCarta = () => {
  const valores = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'j', 'q', 'k'];
  const numero = valores[Math.floor(Math.random() * valores.length)];
  const palo = palos[Math.floor(Math.random() * palos.length)];
  return { numero, palo };
};

export default function GameTwoScreen({ route }) {
  const jugadores = route?.params?.jugadores || [];
  const [carta, setCarta] = useState(null);
  const [jugadorActual, setJugadorActual] = useState('');
  const [registro, setRegistro] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [mazo, setMazo] = useState(generarBarajaCompleta());
  const [modalCartasVisible, setModalCartasVisible] = useState(false);
  const [modalRankingVisible, setModalRankingVisible] = useState(false);
  const [ultimasCartas, setUltimasCartas] = useState([]);

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
      const nuevaLista = [{ numero: nueva.numero, palo: nueva.palo }, ...prev];
      return nuevaLista.slice(0, 4);
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
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
        {ultimasCartas.map((c, index) => {
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
      <Text style={styles.title}>🍻 Juego 2 - Carta de Acción</Text>

      <Button title="Ver registro" onPress={() => setModalVisible(true)} />
      <Button title="Ver cartas restantes" onPress={() => setModalCartasVisible(true)} />
      <Button title="Ver ranking de tragos" onPress={() => setModalRankingVisible(true)} />
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
            <Button title="Cerrar" onPress={() => setModalRankingVisible(false)} />
          </View>
        </View>
      </Modal>

      {!carta && (
        <Button title="Sacar carta" onPress={sacarCarta} />
      )}

      {carta && (
        <>
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
            // Render card name with correct displayValor
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
            {tragosPorPalo[carta.palo]} trago(s) por ser {carta.palo}
          </Text>
          {/* Mostrar imagen de la carta actual */}
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
                  style={{ width: 100, height: 150, marginVertical: 10, resizeMode: 'contain' }}
                />
              );
            }
            return null;
          })()}
          {mazo.length > 0 && (
            <Button title="Sacar otra carta" onPress={sacarCarta} />
          )}
          <Button title="Reiniciar" onPress={reiniciar} />
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
            <Button title="Cerrar" onPress={() => setModalVisible(false)} />
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
                    <Text style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{palo}</Text>
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
                            color: numerosRestantes.includes(num) ? 'black' : '#bbb',
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
            <Button title="Cerrar" onPress={() => setModalCartasVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  carta: { fontSize: 32, marginTop: 20 },
  accion: { fontSize: 18, marginVertical: 10, textAlign: 'center' },
  tragos: { fontSize: 16, color: '#666', marginBottom: 20 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalItem: {
    fontSize: 16,
    marginVertical: 2,
  },
});