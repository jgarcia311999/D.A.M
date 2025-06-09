import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, Animated, Easing, TextInput, FlatList, Keyboard, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const menuAnimation = useRef(new Animated.Value(0)).current;
  const [menuVisible, setMenuVisible] = useState(false);
  const [nombre, setNombre] = useState('');
  const [jugadores, setJugadores] = useState([]);
  // tarjetaExpandida state removed
  const inputRef = useRef(null);

  const toggleMenu = () => {
    if (!menuVisible) {
      setMenuVisible(true);
      Animated.timing(menuAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
        easing: Easing.out(Easing.ease)
      }).start();
    } else {
      Animated.timing(menuAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
        easing: Easing.in(Easing.ease)
      }).start(() => {
        setMenuVisible(false);
      });
    }
  };

  const juegos = [
    {
      nombre: 'La Cadena del Crupier',
      descripcion: 'Reta a tus amigos con preguntas rápidas y pasa la cadena antes que el tiempo se agote.',
      screen: 'Juego 1',
    },
    {
      nombre: 'Bebecartas',
      descripcion: 'Saca cartas al azar con retos únicos y bebe si no los cumples.',
      screen: 'Juego 2',
    },
    {
      nombre: 'La Ruleta del Shot',
      descripcion: 'Gira la ruleta y descubre quién se lleva el próximo shot.',
      screen: 'Juego 3',
    },
    {
      nombre: 'El Saca Cartas',
      descripcion: 'Desliza y revela desafíos divertidos carta por carta.',
      screen: 'Prueba 4',
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fdfcf7' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View pointerEvents={menuVisible ? 'none' : 'auto'}>
          {/* Header row with arrow and plus buttons */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={28} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleMenu}>
              <Ionicons name="add" size={28} color="#000" />
            </TouchableOpacity>
          </View>
          <Image source={require('../assets/chapas/chapa.png')} style={styles.imageBackground} />
          <View style={styles.content}>
            <Text style={styles.title}>D.A.M</Text>
            <View style={styles.gamesWrapper}>
              {juegos.map((juego, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.gameContainer}
                  onPress={() => navigation.navigate(juego.screen, { jugadores })}
                >
                  <Text style={styles.gameText}>{juego.nombre}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
        {menuVisible && (
          <TouchableOpacity
            style={styles.menuOverlay}
            activeOpacity={1}
            onPress={toggleMenu}
          />
        )}
        {menuVisible && (
          <Animated.View style={[
            styles.sideMenu,
            {
              transform: [{
                translateX: menuAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [Dimensions.get('window').width, Dimensions.get('window').width * 0.1]
                })
              }]
            }
          ]}>
            <Text style={styles.menuTitle}>Jugadores</Text>
            <TextInput
              ref={inputRef}
              placeholder="Añadir jugador"
              value={nombre}
              onChangeText={setNombre}
              onSubmitEditing={() => {
                if (nombre.trim()) {
                  setJugadores([nombre.trim(), ...jugadores]);
                  setNombre('');
                  Keyboard.dismiss();
                }
              }}
              style={styles.input}
              placeholderTextColor="#999"
            />
            <FlatList
              data={jugadores}
              keyExtractor={(item, index) => `${item}-${index}`}
              renderItem={({ item, index }) => (
                <TouchableOpacity onPress={() => {
                  const nuevos = jugadores.filter((_, i) => i !== index);
                  setJugadores(nuevos);
                }}>
                  <Text style={styles.menuItem}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  imageBackground: {
    position: 'absolute',
    top: -width * 0.25,
    left: (width - width * 0.5) / 2,
    width: width * 0.5,
    height: width * 0.5,
    resizeMode: 'contain',
    zIndex: 0,
  },
  content: {
    flex: 1,
    paddingTop: 130,
    alignItems: 'center',
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    marginBottom: 40,
    fontWeight: 'bold',
    fontFamily: 'PlayfairDisplaySC-Regular',
    textAlign: 'center',
    color: '#780000'
  },
  gamesWrapper: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
    flexDirection: 'column',
    gap: 15,
    paddingBottom: 40,
  },
  gameContainer: {
    height: 120,
    borderWidth: 3,
    borderColor: 'green',
    borderRadius: 12,
    backgroundColor: 'rgba(0, 100, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  gameText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: 120
  },
  gameDescription: {
    color: '#fff',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  sideMenu: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '90%',
    height: '100%',
    backgroundColor: '#fff',
    borderLeftWidth: 1,
    borderColor: '#ccc',
    padding: 20,
    zIndex: 3,
    elevation: 5,
  },
  menuItem: {
    fontSize: 18,
    marginVertical: 10,
    color: '#000',
  },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    zIndex: 2,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 15,
    color: '#000',
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  }
});
