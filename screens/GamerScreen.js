

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Keyboard } from 'react-native';

export default function GamerScreen() {
  const [nombre, setNombre] = useState('');
  const [jugadores, setJugadores] = useState([]);

  const agregarJugador = () => {
    if (nombre.trim()) {
      setJugadores([nombre.trim(), ...jugadores]);
      setNombre('');
      Keyboard.dismiss();
    }
  };

  const eliminarJugador = (index) => {
    const nuevos = jugadores.filter((_, i) => i !== index);
    setJugadores(nuevos);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Jugadores</Text>
      <TextInput
        placeholder="Añadir jugador"
        value={nombre}
        onChangeText={setNombre}
        onSubmitEditing={agregarJugador}
        style={styles.input}
        placeholderTextColor="#999"
      />
      <FlatList
        data={jugadores}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => eliminarJugador(index)}>
            <Text style={styles.item}>{item}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No hay jugadores añadidos</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191716',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#2c2c2c',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#fff',
    marginBottom: 20,
  },
  item: {
    padding: 12,
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: 6,
    marginBottom: 10,
  },
  empty: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 40,
  },
});