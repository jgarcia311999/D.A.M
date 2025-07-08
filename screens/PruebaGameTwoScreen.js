import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

export default function PruebaGameTwoScreen({ navigation }) {
  const [mostrarOpciones, setMostrarOpciones] = useState(false);
  const [carta, setCarta] = useState(null);

  const sacarCarta = () => {
    // lógica ficticia de sacar carta
    setCarta({ numero: '5', palo: 'copas' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
          Haptics.selectionAsync();
          navigation.goBack();
        }}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setMostrarOpciones(!mostrarOpciones)}>
          <Ionicons name="ellipsis-vertical" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.marcoContenedor}>
        <Image
          source={require('../assets/cartas/nuevasCartas/oro_1.png')}
          style={styles.marcoImagen}
        />
        <LinearGradient
          colors={['rgba(213, 195, 133, 0)', '#d5c385']}
          style={styles.imageFade}
        />
      </View>

      <Text style={styles.loremText}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus.
      </Text>

      <View style={styles.bottomControls}>
        <TouchableOpacity style={styles.primaryButton} onPress={() => {
          setMostrarOpciones(false);
          sacarCarta();
        }}>
          <Text style={styles.primaryButtonText}>
            {carta ? 'Sacar otra carta' : 'Sacar carta'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d5c385',
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 50,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomControls: {
    padding: 20,
  },
  primaryButton: {
    backgroundColor: '#7a5e1f',
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 8,
  },
  primaryButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  marcoContenedor: {
    position: 'relative',
    width: '100%',
    height: 100,
  },
  marcoImagen: {
    width: '95%',
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  imageFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
  },
  loremText: {
    textAlign: 'center',
    color: '#333',
    fontSize: 20,
    paddingHorizontal: 40,
  },
});