import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Keyboard, View, ScrollView, Image } from 'react-native';
import { Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;

export default function GamerScreen({ route }) {
  const { jugadores: jugadoresParam = [] } = route.params || {};
  const navigation = useNavigation();
  const [nombre, setNombre] = useState('');
  const [jugadores, setJugadores] = useState(
    jugadoresParam.length > 0
      ? jugadoresParam
      : []
  );
  const [filas, setFilas] = useState([]);
  const [textoScroll, setTextoScroll] = useState('Scrolea hacia arriba');

  useEffect(() => {
    const cargarJugadores = async () => {
      await AsyncStorage.removeItem('jugadores'); // Borrar siempre al abrir
      if (jugadoresParam.length === 0) {
        const jugadoresMock = ['Jesus', 'Carla', 'Cepas', 'Nuria', 'Ana', 'Alex', 'Amador', 'Tito'];
        setJugadores(jugadoresMock);
        await AsyncStorage.setItem('jugadores', JSON.stringify(jugadoresMock));
      }
    };
    cargarJugadores();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('jugadores', JSON.stringify(jugadores));
  }, [jugadores]);

  useEffect(() => {
    console.log('Jugadores actuales:', jugadores);
  }, [jugadores]);

  useEffect(() => {
    const PADDING = 40;
    const ITEM_PADDING = 45;
    const CHAR_WIDTH = 10;

    const anchoDisponible = screenWidth - PADDING;
    let filaActual = [];
    let filaAncho = 0;
    const nuevasFilas = [];

    jugadores.forEach(nombre => {
      const anchoEst = nombre.length * CHAR_WIDTH + ITEM_PADDING;
      if (filaAncho + anchoEst > anchoDisponible) {
        nuevasFilas.push(filaActual);
        filaActual = [nombre];
        filaAncho = anchoEst;
      } else {
        filaActual.push(nombre);
        filaAncho += anchoEst;
      }
    });

    if (filaActual.length) nuevasFilas.push(filaActual);
    setFilas(nuevasFilas);
  }, [jugadores]);

  const agregarJugador = () => {
    if (nombre.trim()) {
      setJugadores([...jugadores, nombre.trim()]);
      setNombre('');
      Keyboard.dismiss();
    }
  };

  const eliminarJugador = (index) => {
    const nuevos = jugadores.filter((_, i) => i !== index);
    setJugadores(nuevos);
  };

  return (
    <SafeAreaView style={styles.gridBackground}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        onScroll={(event) => {
          const y = event.nativeEvent.contentOffset.y;
          if (y <= -166 && textoScroll !== 'texto cambiado') {
            setTextoScroll('Toma, pa cenar');
          }
        }}
        scrollEventThrottle={16}
      >
        <Image source={require('../assets/chapas/chapa_dedo.png')} style={styles.imageBackground} />
        <View style={styles.header}>
          <TouchableOpacity
            onPress={async () => {
              await AsyncStorage.setItem('jugadores', JSON.stringify(jugadores));
              navigation.goBack();
            }}
          >
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity>

          </TouchableOpacity>
        </View>
        <Text style={[styles.title, { marginTop: 100 }]}>Gestión de Borrachos</Text>
        <TextInput
          placeholder="Añadir borracho"
          value={nombre}
          onChangeText={setNombre}
          onSubmitEditing={agregarJugador}
          style={styles.input}
          placeholderTextColor="#999"
        />
        {jugadores.length === 0 ? (
          <Text style={styles.empty}>No hay borrachos... todavia...</Text>
        ) : (
          <View style={styles.contenedorJugadores}>
            {filas.map((fila, i) => (
              <View key={i} style={styles.fila}>
                {fila.map((item, j) => (
                  <TouchableOpacity key={`${item}-${j}`} onPress={() => eliminarJugador(j)}>
                    <View style={styles.item}>
                      <Text style={styles.itemText}>{item}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
      <Text style={styles.footerText}>{textoScroll}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  gridBackground: {
    backgroundColor: '#191716',
    flex: 1,
  },
  header: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    zIndex: 2,
  },
  title: {
    fontFamily: 'Panchang-Regular',
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#2c2c2c',
    color: '#fff',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontFamily: 'Panchang-Regular',
    marginHorizontal: 20,
    borderWidth: 2,
    borderColor: 'green',
  },
  item: {
    backgroundColor: 'rgba(0, 100, 0, 0.5)',
    borderColor: 'green',
    borderWidth: 3,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  empty: {
    color: '#aaa',
    fontFamily: 'Panchang-Regular',
    textAlign: 'center',
    marginTop: 40,
  },

  contenedorJugadores: {
    flexDirection: 'column',
    gap: 10,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  itemText: {
    color: '#fff',
    fontFamily: 'Panchang-Regular'
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  imageBackground: {
    position: 'absolute',
    top: -screenWidth * 0.3,
    left: (screenWidth - screenWidth * 0.5) / 2,
    width: screenWidth * 0.5,
    height: screenWidth * 0.5,
    resizeMode: 'contain',
    zIndex: 0,
  },
  footerText: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Panchang-Regular',
    position: 'absolute',
    bottom: 25,
    width: '100%',
  },
});
