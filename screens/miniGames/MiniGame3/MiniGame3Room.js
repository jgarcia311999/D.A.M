import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { app } from '../../../utils/firebaseConfig'; // Ajusta la ruta según tu proyecto

const db = getFirestore(app);

export default function MiniGame3Room({ salaInfo, setStep, navigation }) {
  const [players, setPlayers] = useState([
    { id: '1', name: 'Tú (Host)' }, // jugador host por defecto
  ]);

  useEffect(() => {
    if (!salaInfo?.code) return;

    const unsubscribe = onSnapshot(
      doc(db, 'salas', salaInfo.code),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.jugadores && Array.isArray(data.jugadores)) {
            setPlayers(data.jugadores);
          }
        }
      },
      (error) => {
        console.error('Error escuchando sala:', error);
      }
    );

    return () => unsubscribe();
  }, [salaInfo?.code]);

  const handleStartGame = () => {
    setStep(3);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sala de Juego</Text>
      <Text style={styles.label}>Código de Sala:</Text>
      <Text selectable style={styles.code}>{salaInfo?.code ?? '---'}</Text>
      <Text style={[styles.label, { marginTop: 20 }]}>Jugadores:</Text>
      <FlatList
        data={players}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Text style={styles.player}>{item.name}</Text>
        )}
        style={{ width: '100%' }}
      />
      <TouchableOpacity style={styles.button} onPress={handleStartGame}>
        <Text style={styles.buttonText}>Empezar Juego</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#c84d4d', marginTop: 10 }]}
        onPress={() => setStep(0)}
      >
        <Text style={styles.buttonText}>Salir</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24,
    backgroundColor: '#181D31',
  },
  title: {
    fontSize: 25, fontWeight: 'bold', color: '#fff', marginBottom: 10,
  },
  label: {
    color: '#ccc', fontSize: 17, marginTop: 8,
  },
  code: {
    color: '#23B2A2', fontSize: 34, fontWeight: 'bold', marginBottom: 6, letterSpacing: 3,
  },
  player: {
    color: '#fff', fontSize: 18, paddingVertical: 5, paddingHorizontal: 10,
    borderBottomWidth: 1, borderBottomColor: '#232323'
  },
  button: {
    backgroundColor: '#23B2A2',
    paddingVertical: 13,
    paddingHorizontal: 40,
    borderRadius: 13,
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff', fontSize: 17, fontWeight: 'bold',
  },
});