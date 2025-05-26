import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';

export default function HomeScreen({ navigation }) {
  /*
  const [mostrarInput, setMostrarInput] = useState(false);
  const [nombre, setNombre] = useState('');
  const [jugadores, setJugadores] = useState([]);

  const agregarJugador = () => {
    if (nombre.trim() !== '') {
      setJugadores([...jugadores, nombre.trim()]);
      setNombre('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/munyeco_logo.png')} style={styles.logo} />
        <View>
          <Text style={styles.dam}>D.A.M</Text>
          <Text style={styles.drink}>Drink and More</Text>
        </View>
      </View>
      <Text style={styles.title}>🎉 Baraja Party 🎴</Text>
      <View style={styles.botones}>
        <Button title="Ir al Juego 1" onPress={() => navigation.navigate('Juego 1', { jugadores })} />
        <Button
          title="Ir al Juego 2"
          onPress={() => {
            if (jugadores.length > 0) {
              navigation.navigate('Juego 2', { jugadores });
            } else {
              alert('Agrega al menos un jugador antes de comenzar el juego.');
            }
          }}
        />
      </View>
      {mostrarInput && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Nombre del jugador"
            value={nombre}
            onChangeText={setNombre}
          />
          <Button title="Agregar jugador" onPress={agregarJugador} />
        </>
      )}
      {jugadores.length > 0 && (
        <View style={styles.lista}>
          <Text style={styles.listaTitulo}>Jugadores:</Text>
          {jugadores.map((j, index) => (
            <Text key={index} style={styles.listaItem}>• {j}</Text>
          ))}
        </View>
      )}
      <TouchableOpacity style={styles.addButton} onPress={() => setMostrarInput(!mostrarInput)}>
        <Text style={styles.addButtonText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
  */
  return (
    <ScrollView
      pagingEnabled
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.section}>
        <Text style={styles.damText}>DAM</Text>
        <Image source={require('../assets/munyeco_logo.png')} style={styles.logo} />
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Tipos de Juegos</Text>
        <View style={styles.botones}>
          <Button title="Juego 1" onPress={() => navigation.navigate('Juego 1')} />
          <Button title="Juego 2" onPress={() => navigation.navigate('Juego 2')} />
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>＋</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfcf7',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 100,
    gap: 20,
  },
  damText: {
    fontSize: 140,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  title: { fontSize: 28, marginBottom: 40, fontWeight: 'bold' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    justifyContent: 'space-between',
  },
  logo: {
    width: 450,
    height: 450,
    resizeMode: 'contain',
  },
  dam: {
    fontSize: 56,
    fontWeight: 'bold',
  },
  drink: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  botones: {
    flexDirection: 'row',
    gap: 20,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#3498db',
    borderRadius: 30,
    padding: 15,
    elevation: 5,
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginTop: 10,
    width: 200,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  lista: {
    marginTop: 20,
    alignItems: 'center',
  },
  listaTitulo: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  listaItem: {
    fontSize: 16,
    color: '#333',
  },
  section: {
    height,
    backgroundColor: '#fdfcf7',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    paddingTop: 0,
  },
});