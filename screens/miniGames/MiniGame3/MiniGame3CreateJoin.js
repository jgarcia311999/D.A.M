import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

export default function MiniGame3CreateJoin({ navigation }) {
  const [roomCode, setRoomCode] = useState('');

  const handleCreateRoom = () => {
    // Aquí más adelante iría la lógica para crear sala (ejemplo: llamar a Firebase)
    navigation.navigate('MiniGame3Room', { roomCode: null }); // de momento, solo navega
  };

  const handleJoinRoom = () => {
    // Aquí más adelante iría la lógica para comprobar sala
    if (roomCode.trim()) {
      navigation.navigate('MiniGame3Room', { roomCode });
    } else {
      alert('Introduce un código de sala');
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