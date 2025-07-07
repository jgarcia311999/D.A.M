import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';

import { db } from '../../utils/firebaseConfig';
import { doc, setDoc, updateDoc, increment } from 'firebase/firestore';

const generateRoomCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const MiniGame4 = ({ route }) => {
  const [modalVisible, setModalVisible] = useState(true);
  const [roomCode, setRoomCode] = useState('');
  const [selectedPhrase, setSelectedPhrase] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState('');
  const [resultadoVisible, setResultadoVisible] = useState(false);
  const [usedPhrases, setUsedPhrases] = useState([]);

  const { jugadores = [] } = route.params || {};
  console.log('Jugadores recibidos:', jugadores);
  const phrases = [
    "Esto es la frase de prueba 1",
    "Esto es la frase de prueba 2",
    "Esto es la frase de prueba 3",
    "Esto es la frase de prueba 4",
    "Esto es la frase de prueba 5",
    "Esto es la frase de prueba 6",
    "Esto es la frase de prueba 7",
    "Esto es la frase de prueba 8",
    "Esto es la frase de prueba 9",
    "Esto es la frase de prueba 10"
  ];

  useEffect(() => {
    const iniciarSala = async () => {
      const code = generateRoomCode();
      setRoomCode(code);

      const randomIndex = Math.floor(Math.random() * phrases.length);
      setSelectedPhrase(phrases[randomIndex]);
      setUsedPhrases([phrases[randomIndex]]);

      // Crear objeto de votos vacío por jugador
      const votosIniciales = {};
      jugadores.forEach(j => votosIniciales[j] = 0);

      try {
        await setDoc(doc(db, 'salas', code), {
          fraseActual: phrases[randomIndex],
          frasesUsadas: [phrases[randomIndex]],
          jugadorCreador: 'app',
          ronda: 1,
          estado: 'esperando',
          votos: votosIniciales,
          jugadores: jugadores,
        });
      } catch (e) {
        console.error('Error creando la sala en Firestore:', e);
      }
    };
    iniciarSala();
  }, []);

  const handleStartGame = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {!modalVisible && (
        <>
          <Text style={styles.roomCodeDisplay}>Código de Sala: {roomCode}</Text>
          <Text style={styles.phrase}>{selectedPhrase}</Text>

          <Text style={styles.dropdownLabel}>Selecciona un jugador:</Text>
          <View style={styles.jugadoresWrapper}>
            {jugadores.map((nombre) => (
              <TouchableOpacity
                key={nombre}
                onPress={async () => {
                  setJugadorSeleccionado(nombre);
                  try {
                    const salaRef = doc(db, 'salas', roomCode);
                    await updateDoc(salaRef, {
                      [`votos.${nombre}`]: increment(1)
                    });
                    console.log(`Voto registrado para ${nombre}`);
                  } catch (error) {
                    console.error('Error al registrar voto:', error);
                  }
                }}
                style={[
                  styles.jugador,
                  jugadorSeleccionado === nombre && { backgroundColor: '#2ecc71' }
                ]}>
                <Text style={styles.jugadorTexto}>{nombre}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.roundButton} onPress={() => setResultadoVisible(true)}>
            <Text style={styles.buttonText}>Pasar de ronda</Text>
          </TouchableOpacity>
        </>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Código de Sala</Text>
            <Text style={styles.roomCode}>{roomCode}</Text>
            <TouchableOpacity style={styles.button} onPress={handleStartGame}>
              <Text style={styles.buttonText}>Comenzar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={resultadoVisible}
        onRequestClose={() => setResultadoVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>El más votado es:</Text>
            <Text style={styles.roomCode}>{jugadorSeleccionado || 'Ninguno'}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                const remaining = phrases.filter(p => !usedPhrases.includes(p));
                let newPhrase = "Fin de frases";

                if (remaining.length > 0) {
                  newPhrase = remaining[Math.floor(Math.random() * remaining.length)];
                  setSelectedPhrase(newPhrase);
                  setUsedPhrases([...usedPhrases, newPhrase]);

                  try {
                    const salaRef = doc(db, 'salas', roomCode);
                    const votosReiniciados = {};
                    jugadores.forEach(j => votosReiniciados[`votos.${j}`] = 0);

                    await updateDoc(salaRef, {
                      fraseActual: newPhrase,
                      frasesUsadas: [...usedPhrases, newPhrase],
                      ronda: increment(1),
                      ...votosReiniciados,
                    });
                    console.log('Ronda actualizada en Firestore');
                  } catch (error) {
                    console.error('Error al actualizar ronda en Firestore:', error);
                  }
                } else {
                  setSelectedPhrase("Fin de frases");
                }

                setJugadorSeleccionado('');
                setResultadoVisible(false);
              }}
            >
              <Text style={styles.buttonText}>Siguiente ronda</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
    paddingTop: 60,
  },
  roomCodeDisplay: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  phrase: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  dropdownLabel: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
    color: 'black',
    backgroundColor: 'white',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: '600',
  },
  roomCode: {
    fontSize: 36,
    fontWeight: 'bold',
    marginVertical: 20,
    letterSpacing: 2,
  },
  button: {
    marginTop: 15,
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  jugadoresWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginTop: 10,
  },
  jugador: {
    backgroundColor: 'rgba(0, 100, 0, 0.5)',
    borderColor: 'green',
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 5,
  },
  jugadorTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
  roundButton: {
    marginTop: 25,
    backgroundColor: '#e67e22',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignSelf: 'center',
  },
});

export default MiniGame4;