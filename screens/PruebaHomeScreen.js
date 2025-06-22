import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, Animated, Easing, TextInput, FlatList, Keyboard, SafeAreaView, ScrollView, ImageBackground } from 'react-native';
import { PanResponder } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import FlorImage from '../assets/flor.png';

const { width } = Dimensions.get('window');

const CardCornerFlor = () => (
  <Image
    source={FlorImage}
    style={styles.cardCornerImage}
  />
);

export default function HomeScreen({ navigation }) {
  const menuAnimation = useRef(new Animated.Value(0)).current;
  const [menuVisible, setMenuVisible] = useState(false);
  const [nombre, setNombre] = useState('');
  const [jugadores, setJugadores] = useState([]);
  // tarjetaExpandida state removed
  const inputRef = useRef(null);
  const carouselRef = useRef(null);
  const scrollAnim = useRef(new Animated.Value(0)).current;

  const bottomSheetHeight = Dimensions.get('window').height * 0.7;
  const bottomSheetY = useRef(new Animated.Value(Dimensions.get('window').height - 100)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 10,
      onPanResponderMove: (_, gestureState) => {
        const newY = Dimensions.get('window').height - 100 + gestureState.dy;
        bottomSheetY.setValue(Math.min(Math.max(newY, Dimensions.get('window').height - bottomSheetHeight), Dimensions.get('window').height - 100));
      },
      onPanResponderRelease: (_, gestureState) => {
        const halfway = Dimensions.get('window').height - (bottomSheetHeight / 2);
        const currentY = bottomSheetY._value + gestureState.dy;

        if (currentY < halfway) {
          // expand
          Animated.timing(bottomSheetY, {
            toValue: Dimensions.get('window').height - bottomSheetHeight,
            duration: 200,
            useNativeDriver: false
          }).start();
        } else {
          // collapse
          Animated.timing(bottomSheetY, {
            toValue: Dimensions.get('window').height - 100,
            duration: 200,
            useNativeDriver: false
          }).start();
        }
      }
    })
  ).current;

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
      <ImageBackground source={require('../assets/background.png')} style={{ flex: 1 }}>
        
        <SafeAreaView style={styles.gridBackground}>

          <Image
            source={FlorImage}
            style={{
              position: 'absolute',
              left: '-30%',
              top: '31%',
              height: '30%',
              resizeMode: 'contain',
              zIndex: 0,
            }}
          />
          <Image
            source={FlorImage}
            style={{
              position: 'absolute',
              right: '-30%',
              top: '70%',
              height: '35%',
              resizeMode: 'contain',
              zIndex: 0,
            }}
          />
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
              <Image source={require('../assets/chapas/chapa_dedo.png')} style={styles.imageBackground} />
              <View style={styles.content}>
                <FlatList
                  ref={carouselRef}
                  data={juegos}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, index) => index.toString()}
                  contentContainerStyle={styles.carouselWrapper}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.gameContainer}
                      onPress={() => navigation.navigate(item.screen, { jugadores })}
                    >
                      <View style={styles.gameCard}>
                        <CardCornerFlor />
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
        {/* 
        <Animated.View
          {...panResponder.panHandlers}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: bottomSheetHeight,
            backgroundColor: '#fff',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            elevation: 8,
            padding: 20,
            transform: [{ translateY: bottomSheetY }],
          }}
        >
          <View style={{ width: 40, height: 5, backgroundColor: '#ccc', borderRadius: 2.5, alignSelf: 'center', marginBottom: 10 }} />
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Más opciones</Text>
          <Text style={{ color: '#333' }}>Aquí puedes mostrar información o botones adicionales.</Text>
        </Animated.View>
        */}
      </SafeAreaView>
      </ImageBackground>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gridBackground: {
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
  title: {
    fontSize: 28,
    marginBottom: 40,
    fontWeight: 'bold',
    fontFamily: 'PlayfairDisplaySC-Regular',
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 0,
  },
  gameCard: {
    width: '80%',
    height: 520,
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
    // Ensure no global textAlign applies; keep left alignment by not adding textAlign here.
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
