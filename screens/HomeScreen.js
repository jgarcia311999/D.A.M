import React, { useRef, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Image, FlatList, ScrollView, Dimensions, StyleSheet, SafeAreaView, TouchableOpacity, Animated, Text, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PjCartas from '../assets/nuevos_personajes/cartas_pj.png';
import PjPollo from '../assets/nuevos_personajes/pollo_pj.png';
import PjsBotellines from '../assets/nuevos_personajes/botellines_pj.png';
import PjTabaco from '../assets/nuevos_personajes/tabaco_pj.png';

const { width, height } = Dimensions.get('window');
const scaleFont = (size) => (width / 375) * size;
const isSmallDevice = width < 360;
const juegos = [
  {
    id: 1,
    nombre: 'Bebecartas',
    descripcion: 'Saca cartas al azar con retos únicos y bebe si no los cumples.',
    screen: 'Juego 4',
    imagen: PjTabaco,
    imagenEstilo: { width: '80%', height: height * 0.35, resizeMode: 'contain' },
    color: '#bfa3ff',
  },
  {
    id: 2,
    nombre: 'La Cadena del Crupier',
    descripcion: 'Reta a tus amigos con preguntas rápidas y pasa la cadena antes que el tiempo se agote.',
    screen: 'Prueba 1',
    imagen: PjCartas,
    imagenEstilo: { width: '80%', height: height * 0.35, resizeMode: 'contain' },
    color: '#ffc8a3',
  },
  {
    id: 3,
    nombre: 'El Saca Cartas',
    descripcion: 'Desliza y revela desafíos divertidos carta por carta.',
    screen: 'Prueba 2',
    imagen: PjPollo,
    imagenEstilo: { width: '80%', height: height * 0.35, resizeMode: 'contain' },
    color: '#F490CC',
  },
  {
    id: 4,
    nombre: 'MiniGamesss',
    descripcion: 'Una variedad de minijuegos.',
    screen: 'MiniGames',
    imagen: PjsBotellines,
    imagenEstilo: { width: '80%', height: height * 0.35, resizeMode: 'contain' },
    color: '#70B77E',
  },
  /* {
    id: 5,
    nombre: 'Home de prueba',
    descripcion: 'en fase de desarrollo.',
    screen: 'Inicio2',
    imagen: ImgDJ,
    imagenEstilo: { width: '80%', height: height * 0.35, resizeMode: 'contain' },
    color: '#ffa3d1',
  }, */
];

export default function HomeScreen({ navigation, route }) {
  const [jugadores, setJugadores] = useState(route?.params?.jugadores || []);
  const [newJugador, setNewJugador] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modoLista, setModoLista] = useState(false);
  const [modoPendiente, setModoPendiente] = useState(false);
  const flatListRef = useRef(null);
  const fadeCarrusel = useRef(new Animated.Value(1)).current;
  const fadeLista = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const topPadding = insets.top + 70;

  useEffect(() => {
    const cargarJugadores = async () => {
      if (jugadores.length === 0) {
        const almacenados = await AsyncStorage.getItem('jugadores');
        if (almacenados) {
          setJugadores(JSON.parse(almacenados));
        }
      }
    };
    cargarJugadores();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('jugadores', JSON.stringify(jugadores));
  }, [jugadores]);

  const agregarJugador = () => {
    if (newJugador.trim() !== '') {
      setJugadores([...jugadores, newJugador.trim()]);
      setNewJugador('');
    }
  };

  const eliminarJugador = (index) => {
    const nuevosJugadores = [...jugadores];
    nuevosJugadores.splice(index, 1);
    setJugadores(nuevosJugadores);
  };

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.slide, { backgroundColor: item.color, paddingTop: topPadding }]}
      onPress={() => navigation.navigate(item.screen, { jugadores })}
      activeOpacity={0.9}
    >
      <View style={styles.slideTop}>
        <Text
          style={styles.slideTitle}
          numberOfLines={2}
          adjustsFontSizeToFit
          minimumFontScale={0.8}
        >
          {item.nombre}
        </Text>
      </View>

      <View style={styles.slideMiddle}>
        <Image source={item.imagen} style={styles.slideImage} resizeMode="contain" />
      </View>

      <View style={styles.slideBottom}>
        <Text style={styles.slideDescription}>{item.descripcion}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, {
      backgroundColor: modoPendiente
        ? '#a3c8ff'
        : juegos[currentIndex]?.color || '#191716'
    }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableOpacity
          style={[styles.jugadoresButtonTopRight, { top: insets.top + 10 }]}
          onPress={() => {
            setModoPendiente(!modoLista);
            if (modoLista) {
              Animated.parallel([
                Animated.timing(fadeCarrusel, { toValue: 1, duration: 200, useNativeDriver: true }),
                Animated.timing(fadeLista, { toValue: 0, duration: 200, useNativeDriver: true }),
              ]).start(() => {
                setModoLista(false);
              });
            } else {
              Animated.parallel([
                Animated.timing(fadeCarrusel, { toValue: 0, duration: 200, useNativeDriver: true }),
                Animated.timing(fadeLista, { toValue: 1, duration: 200, useNativeDriver: true }),
              ]).start(() => {
                setModoLista(true);
              });
            }
          }}
        >
          <Text style={styles.jugadoresButtonText}>
            {modoPendiente ? 'Juegos' : 'Borrachos'}
          </Text>
        </TouchableOpacity>
        {/* Espacio reservado para el botón de menú hamburguesa */}
        <TouchableOpacity
          style={[styles.topRightButton, { top: insets.top + 10 }]}
          // Sin onPress ni contenido para reservar espacio
        />
        {/* Only show dots in carousel mode */}
        <View
          pointerEvents="box-none"
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 5 }}
        >
          {!modoLista && (
            <View style={styles.bottomControls}>
              <View style={styles.dotsInline}>
                {juegos.map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.dot,
                      currentIndex === i && styles.dotActive,
                    ]}
                  />
                ))}
              </View>
            </View>
          )}
        </View>
        <Animated.View style={{ flex: 1, opacity: fadeCarrusel, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <FlatList
            data={juegos}
            ref={flatListRef}
            renderItem={renderItem}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            keyExtractor={(item) => item.id.toString()}
          />
        </Animated.View>

        <Animated.View style={{ flex: 1, opacity: fadeLista }}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ ...styles.scrollList, paddingTop: 0, marginTop: 0 }}
          >
            <TextInput
              style={styles.input}
              placeholder="Añadir jugador"
              placeholderTextColor="#ffffff"
              value={newJugador}
              onChangeText={setNewJugador}
              onSubmitEditing={agregarJugador}
              returnKeyType="done"
            />
            <View style={styles.contenedorJugadores}>
              {jugadores.length === 0 ? (
                <Text style={styles.footerText}>No hay jugadores añadidos</Text>
              ) : (
                jugadores.map((jugador, index) => (
                  <View key={index} style={styles.fila}>
                    <Text style={styles.item}>{jugador}</Text>
                    <TouchableOpacity onPress={() => eliminarJugador(index)}>
                      <Ionicons name="trash" size={24} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>
            <Text style={styles.footerText}>Agrega jugadores para comenzar a jugar</Text>
          </ScrollView>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor removed to allow dynamic override in component
  },
  slide: {
    width: width,
    height: '100%',
    paddingHorizontal: 20,
    // paddingTop: 80,
    paddingBottom: 80,
  },
  slideTop: {
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  slideMiddle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideImage: {
    width: '100%',
    height: '100%',
    maxHeight: height * 0.4,
  },
  slideBottom: {
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  slideTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    fontFamily: 'Panchang-Bold',
    color: '#000',
    marginBottom: 10,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
  topRightButton: {
    position: 'absolute',
    right: 20,
    zIndex: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#444',
    marginHorizontal: 5,
  },
  dotActive: {
    backgroundColor: '#fff',
  },
  scrollList: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 0,
    // backgroundColor removed to avoid duplication or conflicts
  },
  card: {
    width: '90%',
    borderRadius: 12,
    padding: 20,
    height: '20%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: scaleFont(18),
    maxFontSizeMultiplier: 1.2,
    fontWeight: 'bold',
    fontFamily: 'Panchang-Bold',
    color: '#000',
    marginBottom: 10,
    textTransform: 'uppercase',
    paddingHorizontal: 20,
    textAlign: 'center',
  },
  imageSmall: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 0,
    marginTop: 0,
  },
  slideDescription: {
    fontSize: 18,
    fontFamily: 'Panchang-Regular',
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  cardDescription: {
    fontSize: scaleFont(14),
    fontFamily: 'Panchang-Regular',
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  dotsInline: {
    flexDirection: 'row',
  },
  jugadoresButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontFamily: 'Panchang-Bold',
  },
  jugadoresButtonTopRight: {
    position: 'absolute',
    right: 20,
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000',
    color: '#000',
    zIndex: 10,
  },
  input: {
    width: '90%',
    height: 60,
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 8,
    color: '#fff',
    paddingHorizontal: 10,
    marginBottom: 20,
    fontFamily: 'Panchang-Regular',
    fontSize: 16,
    marginTop: height * 0.1,
  },
  contenedorJugadores: {
    width: '90%',
    marginBottom: 20,
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#79AFFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: 'black',
    borderWidth: 2,
  },
  item: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Panchang-Regular',
  },
  footerText: {
    color: '#aaa',
    fontSize: 14,
    fontFamily: 'Panchang-Regular',
    textAlign: 'center',
    marginTop: 10,
  },
});
