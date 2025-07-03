import React, { useRef, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Image, FlatList, ScrollView, Dimensions, StyleSheet, SafeAreaView, TouchableOpacity, Animated, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ImgSamurai from '../assets/personajes/personaje_samurai.png';
import ImgRobot from '../assets/personajes/personaje_robot.png';
import ImgMusico from '../assets/personajes/personaje_musico.png';
import ImgMago from '../assets/personajes/personaje_mago.png';
import ImgDJ from '../assets/personajes/personaje_dj.png';

const { width, height } = Dimensions.get('window');
const scaleFont = (size) => (width / 375) * size;
const isSmallDevice = width < 360;
const juegos = [
  {
    id: 1,
    nombre: 'Bebecartas',
    descripcion: 'Saca cartas al azar con retos únicos y bebe si no los cumples.',
    screen: 'Juego 4',
    imagen: ImgSamurai,
    imagenEstilo: { width: '80%', height: height * 0.35, resizeMode: 'contain' },
    color: '#bfa3ff',
  },
  {
    id: 2,
    nombre: 'La Cadena del Crupier',
    descripcion: 'Reta a tus amigos con preguntas rápidas y pasa la cadena antes que el tiempo se agote.',
    screen: 'Prueba 1',
    imagen: ImgRobot,
    imagenEstilo: { width: '80%', height: height * 0.35, resizeMode: 'contain' },
    color: '#ffc8a3',
  },
  {
    id: 3,
    nombre: 'El Saca Cartas',
    descripcion: 'Desliza y revela desafíos divertidos carta por carta.',
    screen: 'Juego 2',
    imagen: ImgMusico,
    imagenEstilo: { width: '80%', height: height * 0.35, resizeMode: 'contain' },
    color: '#d5c385',
  },
  {
    id: 4,
    nombre: 'MiniGamesss',
    descripcion: 'Una variedad de minijuegos.',
    screen: 'MiniGames',
    imagen: ImgMago,
    imagenEstilo: { width: '80%', height: height * 0.35, resizeMode: 'contain' },
    color: '#a3ffd9',
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
  console.log('Jugadores:', jugadores);
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modoLista, setModoLista] = useState(false);
  const flatListRef = useRef(null);
  const fadeCarrusel = useRef(new Animated.Value(1)).current;
  const fadeLista = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const topPadding = insets.top + 70;

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.slide, { backgroundColor: item.color }]}
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
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableOpacity
          style={[styles.topRightButton, { top: insets.top + 10 }]}
          onPress={() => {
            if (modoLista) {
              Animated.parallel([
                Animated.timing(fadeCarrusel, { toValue: 1, duration: 200, useNativeDriver: true }),
                Animated.timing(fadeLista, { toValue: 0, duration: 200, useNativeDriver: true }),
              ]).start(() => setModoLista(false));
            } else {
              Animated.parallel([
                Animated.timing(fadeCarrusel, { toValue: 0, duration: 200, useNativeDriver: true }),
                Animated.timing(fadeLista, { toValue: 1, duration: 200, useNativeDriver: true }),
              ]).start(() => setModoLista(true));
            }
          }}
        >
          <Ionicons name="menu" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.jugadoresButtonTopRight, { top: insets.top + 10 }]}
          onPress={() => navigation.navigate('Gamer')}
        >
          <Text style={styles.jugadoresButtonText}>Borrachos</Text>
        </TouchableOpacity>
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
          <View style={[styles.scrollList, { paddingTop: topPadding }]}>
            {juegos.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.card, { backgroundColor: item.color }]}
                onPress={() => navigation.navigate(item.screen, { jugadores })}
                activeOpacity={0.9}
              >
                <Text
                  style={styles.cardTitle}
                  numberOfLines={2}
                  adjustsFontSizeToFit
                  minimumFontScale={0.8}
                >
                  {item.nombre}
                </Text>
                <Text style={styles.cardDescription}>{item.descripcion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191716',
  },
  slide: {
    width: width,
    height: '100%',
    paddingHorizontal: 20,
    paddingTop: 80,
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
    left: 20,
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
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 20,
    // Agrega espacio superior para no solapar los botones
    // paddingTop eliminado, usar prop dinámico
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
    color: '#fff',
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
    borderColor: '#fff',
    zIndex: 10,
  },
});
