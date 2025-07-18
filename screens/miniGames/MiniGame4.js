import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'react-native-qrcode-svg';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useFonts } from 'expo-font';

import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

import { db } from '../../utils/firebaseConfig';
import { doc, setDoc, updateDoc, increment, onSnapshot, getDoc } from 'firebase/firestore';

const generateRoomCode = () => {
  return Math.floor(1000 + Math.random() * 9000).toString(); // código de 4 dígitos
};

const MiniGame4 = ({ route }) => {
  const [fontsLoaded] = useFonts({
    'Panchang-Bold': require('../../assets/fonts/Panchang-Bold.otf'),
    'Panchang-Extrabold': require('../../assets/fonts/Panchang-Extrabold.otf'),
    'Panchang-Extralight': require('../../assets/fonts/Panchang-Extralight.otf'),
    'Panchang-Light': require('../../assets/fonts/Panchang-Light.otf'),
    'Panchang-Medium': require('../../assets/fonts/Panchang-Medium.otf'),
    'Panchang-Regular': require('../../assets/fonts/Panchang-Regular.otf'),
    'Panchang-Semibold': require('../../assets/fonts/Panchang-Semibold.otf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(true);
  const roomCodeRef = useRef(generateRoomCode());
  const [roomCode, setRoomCode] = useState(roomCodeRef.current);
  const [selectedPhrase, setSelectedPhrase] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState('');
  const [resultadoVisible, setResultadoVisible] = useState(false);
  const [usedPhrases, setUsedPhrases] = useState([]);
  const [nombreJugador, setNombreJugador] = useState('');
  const [votos, setVotos] = useState({});
  const [votosModalVisible, setVotosModalVisible] = useState(false);
  const [botonHabilitado, setBotonHabilitado] = useState(false);

  const [jugadores, setJugadores] = useState([]);
  console.log('Jugadores recibidos:', jugadores);
const phrases = [
  "¿Quién es el que más ha ligado este mes?",
  "¿Quién tiene más probabilidades de tener un OnlyFans?",
  "¿Quién es el más probable en acabar en la cama de alguien esta noche?",
  "¿Quién ha tenido sexo en lugares públicos?",
  "¿Quién se ha despertado en una casa desconocida después de una fiesta?",
  "¿Quién ha tenido más 'amigos con derecho'?",
  "¿Quién tiene más capturas comprometedoras en el móvil?",
  "¿Quién ha enviado más nudes este año?",
  "¿Quién es el más stalker en redes después de conocer a alguien?",
  "¿Quién ha usado frases cliché para ligar y le ha funcionado?",
  "¿Quién tiene historias sexuales tan locas que nadie se las cree?",
  "¿Quién ha mentido sobre su número de parejas sexuales?",
  "¿Quién tiene el historial amoroso más random?",
  "¿Quién se ha acostado con alguien que conoció esa misma noche?",
  "¿Quién ha estado con más de una persona en el mismo grupo de amigos?",
  "¿Quién ha hecho ghosting después de una noche de pasión?",
  "¿Quién se ha grabado haciendo cosas subidas de tono?",
  "¿Quién ha probado cosas raras en la cama y lo volvería a hacer?",
  "¿Quién sería el más probable en tener una noche con su ex?",
  "¿Quién ha tenido sexo en un lugar público sin que lo pillaran?"
];

  useEffect(() => {
    if (!roomCode) return;

    const salaRef = doc(db, 'salas', roomCode);
    const unsubscribe = onSnapshot(salaRef, (snapshot) => {
      const data = snapshot.data();
      if (data?.votos) {
        setVotos(data.votos);
      }
      if (data?.jugadores) {
        setJugadores(data.jugadores);
      }
    });

    return () => unsubscribe();
  }, [roomCode]);

  const handleStartGame = async () => {
    setModalVisible(false);
    // Crear sala única aquí, después de cerrar el modal y con nombreJugador definitivo
    let codigo = roomCode;
    let salaDoc = await getDoc(doc(db, 'salas', codigo));
    while (salaDoc.exists()) {
      codigo = generateRoomCode();
      roomCodeRef.current = codigo;
      setRoomCode(codigo);
      salaDoc = await getDoc(doc(db, 'salas', codigo));
    }

    const randomIndex = Math.floor(Math.random() * phrases.length);
    setSelectedPhrase(phrases[randomIndex]);
    setUsedPhrases([phrases[randomIndex]]);

    const votosIniciales = {};
    [nombreJugador].forEach(j => votosIniciales[j] = 0);

    try {
      await setDoc(doc(db, 'salas', codigo), {
        fraseActual: phrases[randomIndex],
        frasesUsadas: [phrases[randomIndex]],
        jugadorCreador: 'app',
        ronda: 1,
        estado: 'esperando',
        votos: votosIniciales,
        jugadores: [nombreJugador],
      });
    } catch (e) {
      console.error('Error creando la sala en Firestore:', e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => {
          Haptics.selectionAsync();
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            navigation.navigate('MiniGames');
          }
        }}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
      </View>
      {!modalVisible && (
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          <View>
            <Text style={styles.roomCodeDisplay}>{roomCode}</Text>
            <Text style={styles.phrase}>{selectedPhrase}</Text>

            <View style={styles.jugadoresWrapper}>
              {jugadores.map((nombre) => (
                <TouchableOpacity
                  key={nombre}
                  onPress={async () => {
                    setJugadorSeleccionado(nombre);
                    setBotonHabilitado(true);
                    try {
                      const salaRef = doc(db, 'salas', roomCode);
                      const nuevaVotacion = {};
                      jugadores.forEach(j => {
                        nuevaVotacion[`votos.${j}`] = j === nombre ? 1 : 0;
                      });
                      await updateDoc(salaRef, nuevaVotacion);
                      console.log(`Voto actualizado: ${nombre}`);
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
          </View>

          <TouchableOpacity
            style={[
              styles.roundButton,
              !botonHabilitado && { backgroundColor: 'gray' }
            ]}
            onPress={() => setVotosModalVisible(true)}
            disabled={!botonHabilitado}
          >
            <Text style={styles.buttonText}>Pasar de ronda</Text>
          </TouchableOpacity>
        </View>
      )}  

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Haptics.selectionAsync();
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            navigation.navigate('MiniGames');
          }
        }}
      >
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1}
          onPressOut={() => {
            Haptics.selectionAsync();
            if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            navigation.navigate('MiniGames');
          }
          }}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.roomCode}>{roomCode}</Text>
            <QRCode value={`https://dam-multiplayer.vercel.app/?room=${roomCode}`} size={150} />
            <TextInput
              placeholder="Introduce tu nombre"
              placeholderTextColor="#888"
              style={styles.input}
              value={nombreJugador}
              onChangeText={setNombreJugador}
            />
            <TouchableOpacity
              style={[styles.button, !nombreJugador && { backgroundColor: 'gray' }]}
              onPress={handleStartGame}
              disabled={!nombreJugador}
            >
              <Text style={styles.buttonText}>Comenzar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={votosModalVisible}
        onRequestClose={() => setVotosModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Esperando votos...</Text>
            <Text style={styles.roomCode}>
              Votos {Object.values(votos).reduce((a, b) => a + b, 0)}/{jugadores.length}
            </Text>
            {Object.values(votos).reduce((a, b) => a + b, 0) === jugadores.length && (
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  const max = Math.max(...Object.values(votos));
                  const empatados = Object.keys(votos).filter((k) => votos[k] === max);

                  if (empatados.length === 1) {
                    setJugadorSeleccionado(empatados[0]);
                  } else {
                    setJugadorSeleccionado(`Empate entre: ${empatados.join(', ')}`);
                  }

                  setVotosModalVisible(false);
                  setResultadoVisible(true);
                }}
              >
                <Text style={styles.buttonText}>Mostrar resultado</Text>
              </TouchableOpacity>
            )}
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
              style={[styles.button, !jugadorSeleccionado && { backgroundColor: 'gray' }]}
              onPress={async () => {
                if (!jugadorSeleccionado) return;

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
              disabled={!jugadorSeleccionado}
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
    backgroundColor: '#70B77C',
    padding: 20,
    paddingTop: 60,
  },
  header: {
    width: '100%',
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    zIndex: 2,
  },
  roomCodeDisplay: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Panchang-Regular',
  },
  phrase: {
    fontSize: 20,
    color: '#000',
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'Panchang-Bold',
  },
  dropdownLabel: {
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Panchang-Regular',
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
    fontFamily: 'Panchang-Regular',
  },
  roomCode: {
    fontSize: 36,
    fontWeight: 'bold',
    marginVertical: 20,
    letterSpacing: 2,
    fontFamily: 'Panchang-Regular',
  },
  button: {
    marginTop: 15,
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Panchang-Regular',
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
    color: '#000',
    fontWeight: 'bold',
    fontFamily: 'Panchang-Regular',
  },
  roundButton: {
    marginTop: 25,
    backgroundColor: '#e67e22',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignSelf: 'center',
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    color: '#000',
    fontFamily: 'Panchang-Regular',
  },
});

export default MiniGame4;