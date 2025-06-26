import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, Animated, Easing, TextInput, FlatList, Keyboard, SafeAreaView, ScrollView, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ImgRuleta from '../assets/pj_ruleta.png';
import ImgCartas from '../assets/pj_cartas.png';
import ImgCerveza from '../assets/pj_cerveza.png';
import ImgFumando from '../assets/pj_fumando.png';

const { width, height } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const bottomSheetAnim = useRef(new Animated.Value(height)).current;
  const [nombre, setNombre] = useState('');
  const [jugadores, setJugadores] = useState([]);
  const inputRef = useRef(null);
  const carouselRef = useRef(null);
  const scrollAnim = useRef(new Animated.Value(0)).current;

  const openBottomSheet = () => {
    setBottomSheetVisible(true);
    Animated.timing(bottomSheetAnim, {
      toValue: height * 0.25,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const closeBottomSheet = () => {
    Animated.timing(bottomSheetAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setBottomSheetVisible(false);
    });
  };

  const juegos = [
    {
      nombre: 'Bebecartas',
      descripcion: 'Saca cartas al azar con retos únicos y bebe si no los cumples.',
      screen: 'Prueba 4',
      imagen: ImgCerveza,
      imagenEstilo: { left: width * -0.25, top: height * -0.13 },
    },
    {
      nombre: 'La Cadena del Crupier',
      descripcion: 'Reta a tus amigos con preguntas rápidas y pasa la cadena antes que el tiempo se agote.',
      screen: 'Prueba 1',
      imagen: ImgCartas,
      imagenEstilo: { left: width * 0.2, top: height * -0.135 },
    },
    {
      nombre: 'El Saca Cartas',
      descripcion: 'Desliza y revela desafíos divertidos carta por carta.',
      screen: 'Juego 2',
      imagen: ImgFumando,
      imagenEstilo: { left: width * -0.25, top: height * -0.125, transform: [{ scaleX: -1 }] },
    },
    {
      nombre: 'La Ruleta del Shot',
      descripcion: 'Gira la ruleta y descubre quién se lleva el próximo shot.',
      screen: 'Juego 3',
      imagen: ImgRuleta,
      imagenEstilo: { left: width * 0.1, top: height * -0.127 },
    },
  ];

  useEffect(() => {
    const listenerId = scrollAnim.addListener(({ value }) => {
      if (carouselRef.current) {
        carouselRef.current.scrollToOffset({ offset: value, animated: false });
      }
    });

    const animateScroll = Animated.sequence([
      Animated.timing(scrollAnim, {
        toValue: Dimensions.get('window').width * 0.25,
        duration: 600,
        useNativeDriver: false,
        easing: Easing.inOut(Easing.quad),
      }),
      Animated.timing(scrollAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: false,
        easing: Easing.inOut(Easing.quad),
      }),
    ]);

    const timeout = setTimeout(() => {
      animateScroll.start();
    }, 1000);

    return () => {
      scrollAnim.removeListener(listenerId);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.gridBackground}>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View>
            {/* Header row with arrow and plus buttons */}
            <View style={styles.header}>
              <View style={{ width: 28 }} /> {/* Espacio reservado donde iba la flecha */}
              <TouchableOpacity onPress={() => navigation.navigate('Gamer')}>
                <Ionicons name="add" size={28} color="#fff" />
              </TouchableOpacity>
            </View>
            <Image source={require('../assets/chapas/chapa_dedo.png')} style={styles.imageBackground} />
            <View style={styles.content}>
              <FlatList
                data={juegos}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                snapToAlignment="center"
                contentContainerStyle={styles.carouselWrapper}
                ref={carouselRef}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.gameContainer}
                    onPress={() => navigation.navigate(item.screen, { jugadores })}
                  >
                    <View style={styles.gameCard}>
                      <Image source={item.imagen} style={[styles.cardCornerImage, item.imagenEstilo]} />
                      <View style={styles.cardTextContainer}>
                        <Text style={styles.gameText}>{item.nombre}</Text>
                        <Text style={styles.gameDescription}>{item.descripcion}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gridBackground: {
    flex: 1,
    backgroundColor: '#191716',
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
  imageBackground: {
    position: 'absolute',
    top: -width * 0.3,
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
  verticalScrollContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
    paddingBottom: 40,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 40,
    fontWeight: 'bold',
    fontFamily: 'Panchang-Regular',
    textAlign: 'center',
    color: '#780000'
  },
  carouselWrapper: {
    paddingHorizontal: 0,
    paddingVertical: 10,
    flexDirection: 'row',
  },
  gameContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameCard: {
    width: width * 0.85,
    height: height * 0.45,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 100, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'green',
    position: 'relative',
  },
  cardCornerImage: {
    position: 'absolute',
    left: '-60%',
    top: '0%',
    height: '50%',
    resizeMode: 'contain',
    zIndex: 0,
  },
  cardTextContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    gap: 2,
  },
  gameText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    lineHeight: 26,
    marginBottom: 4,
  },
  gameDescription: {
    color: '#fff',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'left',
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: height * 0.75,
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    zIndex: 10,
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
