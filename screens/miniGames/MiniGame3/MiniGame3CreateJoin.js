import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { getFirestore, collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { getApp } from 'firebase/app';
import { query, where, getDocs } from 'firebase/firestore';


export default function MiniGame3CreateJoin({ setSalaInfo, setStep }) {
  const [roomCode, setRoomCode] = useState('');
  const db = getFirestore(getApp());

  // Función para generar código aleatorio de 6 caracteres (puedes cambiar la lógica)
  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  // Crear sala en Firestore con código generado
  const handleCreateRoom = async () => {
    const code = generateCode();
    try {
      // Guardar sala en Firestore
      const docRef = await addDoc(collection(db, 'salas'), {
        code,
        createdAt: new Date(),
        jugadores: [], // aquí puedes añadir jugador host si quieres
      });
      // Pasar el código real y host true
      setSalaInfo({ code, isHost: true, docId: docRef.id });
      setStep(1);
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear la sala. Inténtalo más tarde.');
      console.error('Error creando sala:', error);
    }
  };

  // Unirse a sala comprobando que exista en Firestore
  const handleJoinRoom = async () => {
    if (!roomCode.trim()) {
      Alert.alert('Aviso', 'Introduce un código de sala');
      return;
    }
    try {
      // Buscar sala con código introducido
      const salasRef = collection(db, 'salas');
      // Aquí no podemos buscar directo por 'code', hay que usar query (simplifico)
      // Para esto usarías query con where, pero por simplicidad lo hacemos getDoc con docId si lo tienes
      // Aquí te dejo ejemplo con query:
      const q = query(salasRef, where('code', '==', roomCode.toUpperCase()));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        Alert.alert('Error', 'No existe ninguna sala con ese código.');
        return;
      }
      // Tomamos la primera sala que coincida
      const salaDoc = querySnapshot.docs[0];
      setSalaInfo({ code: roomCode.toUpperCase(), isHost: false, docId: salaDoc.id });
      setStep(1);
    } catch (error) {
      Alert.alert('Error', 'No se pudo unir a la sala. Inténtalo más tarde.');
      console.error('Error uniendo a sala:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modo Online</Text>
      <TouchableOpacity style={styles.button} onPress={handleCreateRoom}>
        <Text style={styles.buttonText}>Crear Sala</Text>
      </TouchableOpacity>
      <Text style={styles.orText}>O</Text>
      <TextInput
        style={styles.input}
        placeholder="Introduce el código de sala"
        placeholderTextColor="#B1B1B1"
        value={roomCode}
        onChangeText={setRoomCode}
        autoCapitalize="characters"
      />
      <TouchableOpacity style={styles.button} onPress={handleJoinRoom}>
        <Text style={styles.buttonText}>Unirse a la Sala</Text>
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
    fontSize: 26, fontWeight: 'bold', color: '#fff', marginBottom: 30,
  },
  button: {
    backgroundColor: '#23B2A2',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 15,
    marginBottom: 18,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff', fontSize: 19, fontWeight: 'bold',
  },
  orText: {
    color: '#aaa', marginVertical: 10, fontSize: 15,
  },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    padding: 14,
    borderRadius: 10,
    width: '100%',
    marginBottom: 18,
    fontSize: 16,
    textAlign: 'center',
    letterSpacing: 3,
  },
});