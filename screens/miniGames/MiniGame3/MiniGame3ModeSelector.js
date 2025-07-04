import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function MiniGame3ModeSelector({ setMode, navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Cómo quieres jugar?</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setMode('local')}
      >
        <Text style={styles.buttonText}>Modo Local</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setMode('online')}
      >
        <Text style={styles.buttonText}>Modo Online (sala)</Text>
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
    fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 40,
  },
  button: {
    backgroundColor: '#23B2A2',
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderRadius: 15,
    marginBottom: 24,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff', fontSize: 20, fontWeight: 'bold',
  },
});