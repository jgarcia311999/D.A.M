

const generarBarajaCompleta = () => {
  const baraja = [];
  for (let i = 1; i <= 12; i++) {
    for (let palo of palos) {
      baraja.push({ numero: i, palo });
    }
  }
  return baraja;
};

import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';

const palos = ['corazones', 'tréboles', 'diamantes', 'picas'];
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
  const numero = Math.floor(Math.random() * 12) + 1;
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
    setRegistro(prev => [...prev, { jugador: jugador, carta: nueva }]);
    setMazo(nuevoMazo);
  };

  const reiniciar = () => {
    setCarta(null);
    setJugadorActual('');
    setMazo(generarBarajaCompleta());
    setRegistro([]);
  };

  return (
    <View style={styles.container}>
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
          <Text style={styles.carta}>
            {carta.numero} de {carta.palo}
          </Text>
          <Text style={styles.accion}>
            {jugadorActual ? `${jugadorActual}, ${valores[carta.numero]}` : valores[carta.numero]}
          </Text>
          <Text style={styles.tragos}>
            {tragosPorPalo[carta.palo]} trago(s) por ser {carta.palo}
          </Text>
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
              {registro.map((item, index) => (
                <Text key={index} style={styles.modalItem}>
                  {item.jugador}: {item.carta.numero} de {item.carta.palo}
                </Text>
              ))}
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
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(num => (
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
                          {num}
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