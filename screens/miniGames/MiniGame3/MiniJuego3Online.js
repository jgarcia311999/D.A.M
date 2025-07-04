import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MiniJuego3Online() {
  const [randomNumber, setRandomNumber] = useState(null);

  useEffect(() => {
    // Genera un número random entre 100000 y 999999 al montar el componente
    const num = Math.floor(100000 + Math.random() * 900000);
    setRandomNumber(num);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Juego Online</Text>
      <Text style={styles.code}>Esto es un numero aleatorio:</Text>
      <Text selectable style={styles.codeValue}>{randomNumber ?? '---'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#181D31',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
  },
  code: {
    fontSize: 20,
    color: '#ccc',
    marginBottom: 10,
  },
  codeValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#23B2A2',
    letterSpacing: 5,
  }
});