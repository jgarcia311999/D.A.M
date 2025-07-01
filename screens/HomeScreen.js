import React, { useRef, useState } from 'react';
import { View, Image, FlatList, ScrollView, Dimensions, StyleSheet, SafeAreaView, TouchableOpacity, Animated, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ImgCerveza from '../assets/pj_cerveza.png';
import ImgCartas from '../assets/pj_cartas.png';
import ImgFumando from '../assets/pj_fumando.png';
import ImgRuleta from '../assets/pj_ruleta.png';

const { width } = Dimensions.get('window');
const juegos = [
  {
    id: 1,
    nombre: 'Bebecartas',
    descripcion: 'Saca cartas al azar con retos únicos y bebe si no los cumples.',
    screen: 'Prueba 4',
    imagen: ImgCerveza,
    imagenEstilo: { width: 230, height: 230, resizeMode: 'contain' },
    color: '#bfa3ff',
  },
  {
    id: 2,
    nombre: 'La Cadena del Crupier',
    descripcion: 'Reta a tus amigos con preguntas rápidas y pasa la cadena antes que el tiempo se agote.',
    screen: 'Prueba 1',
    imagen: ImgCartas,
    imagenEstilo: { width: 230, height: 230, resizeMode: 'contain' },
    color: '#ffc8a3',
  },
  {
    id: 3,
    nombre: 'El Saca Cartas',
    descripcion: 'Desliza y revela desafíos divertidos carta por carta.',
    screen: 'Juego 2',
    imagen: ImgFumando,
    imagenEstilo: { width: 230, height: 230, resizeMode: 'contain' },
    color: '#d5c385',
  },
  {
    id: 4,
    nombre: 'MiniGamesss',
    descripcion: 'Una variedad de minijuegos.',
    screen: 'MiniGames',
    imagen: ImgRuleta,
    imagenEstilo: { width: 230, height: 230, resizeMode: 'contain' },
    color: '#a3ffd9',
  },
  {
    id: 5,
    nombre: 'Home de prueba',
    descripcion: 'en fase de desarrollo.',
    screen: 'Inicio2',
    imagen: ImgFumando,
    imagenEstilo: { width: 230, height: 230, resizeMode: 'contain' },
    color: '#ffa3d1',
  },
];

export default function HomeScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modoLista, setModoLista] = useState(false);
  const flatListRef = useRef(null);
  const fadeCarrusel = useRef(new Animated.Value(1)).current;
  const fadeLista = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.slide, { backgroundColor: item.color }]}
      onPress={() => navigation.navigate(item.screen)}
      activeOpacity={0.9}
    >
      <Text style={styles.slideTitle}>{item.nombre}</Text>
      <Text style={styles.slideDescription}>{item.descripcion}</Text>
      <Image source={item.imagen} style={item.imagenEstilo} />
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
        {/* Only show dots and Jugadores button in carousel mode */}
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
              <TouchableOpacity
                style={styles.jugadoresButtonInline}
                onPress={() => console.log('Jugadores')}
              >
                <Text style={styles.jugadoresButtonText}>Jugadores</Text>
              </TouchableOpacity>
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
          <ScrollView contentContainerStyle={styles.scrollList}>
            {juegos.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.card, { backgroundColor: item.color }]}
                onPress={() => navigation.navigate(item.screen)}
                activeOpacity={0.9}
              >
                <Text style={styles.cardTitle}>{item.nombre}</Text>
                <Text style={styles.cardDescription}>{item.descripcion}</Text>
                <Image source={item.imagen} style={item.imagenEstilo} />
              </TouchableOpacity>
            ))}
          </ScrollView>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  slideTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
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
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
  },
  card: {
    width: '90%',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  imageSmall: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  slideDescription: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  dotsInline: {
    flexDirection: 'row',
  },
  jugadoresButtonInline: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  jugadoresButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
});
