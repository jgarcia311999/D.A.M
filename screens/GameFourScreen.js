import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, SafeAreaView, ImageBackground, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Swiper from 'react-native-deck-swiper';
// import { frases as frasesEstáticas } from '../data/frases';
import frasesLocal from '../data/frases.json';
import { useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const userIcons = [
  require('../assets/cartas/pollo-user.png'),
  require('../assets/cartas/oro-user.png'),
  require('../assets/cartas/cubata-user.png'),
  require('../assets/cartas/cigarro-user.png'),
];

const { width } = Dimensions.get('window');

const PruebaGameFourScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { jugadores = [] } = route.params || {};
  console.log('Jugadores en PruebaGameFourScreen:', jugadores);
  const [usedFrases, setUsedFrases] = useState([]);
  const [frasesCombinadas, setFrasesCombinadas] = useState([]);
  const [frasesToUse, setFrasesToUse] = useState([]);
  const [cardIndex, setCardIndex] = useState(0);

  // Mezcla aleatoriamente un array (Fisher-Yates shuffle)
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

useEffect(() => {
  const cargar = () => {
    try {
      // Normalizar desde JSON local: solo visibles y con frase válida
      const todas = (frasesLocal || [])
        .filter((f) => f && f.frase && (f.visible === undefined || f.visible === true))
        .map((f) => ({
          id: f.id,
          frase: String(f.frase).trim(),
          tipo: f.tipo ? String(f.tipo) : '',
          castigo: Number.isFinite(f.castigo) ? Number(f.castigo) : f.castigo ?? '',
          visible: f.visible === undefined ? true : !!f.visible,
          timestamp: typeof f.timestamp === 'number' ? f.timestamp : 0,
        }));

      const mezcladas = shuffleArray(todas);
      setFrasesCombinadas(todas);
      setFrasesToUse(mezcladas);
    } catch (error) {
      console.error('Error al cargar frases desde JSON local:', error);
    }
  };

  cargar();
}, []);

  const procesarFrase = (frase) => {
    if (!jugadores.length) return frase;

    let resultado = frase;

    const jugadoresMezclados = shuffleArray(jugadores);

    if (frase.includes('{Jugador1}') || frase.includes('{Jugador2}')) {
      const [jugador1, jugador2] = jugadoresMezclados.slice(0, 2);
      resultado = resultado.replaceAll('{Jugador1}', jugador1).replaceAll('{Jugador2}', jugador2);
    }

    if (frase.includes('{Jugador}')) {
      const jugador = jugadoresMezclados[2] || jugadoresMezclados[0];
      resultado = resultado.replaceAll('{Jugador}', jugador);
    }

    return resultado;
  };

  const getRandomUserIcon = () => {
    return userIcons[Math.floor(Math.random() * userIcons.length)];
  };

  const toggleMenu = () => { };

  if (frasesCombinadas.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Rellenando chupitos</Text>
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{
        position: 'absolute',
        top: insets.top + 10,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        zIndex: 10
      }}>
        <TouchableOpacity onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          if (Platform.OS === 'web') {
            navigation.navigate('Inicio');
          } else if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            navigation.navigate('Inicio');
          }
        }}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        {/*
        <TouchableOpacity
          style={styles.tuFraseBtn}
          onPress={() => navigation.navigate('CreaFrase')}
        >
          <Text style={styles.tuFraseBtnText}>Tu frase</Text>
        </TouchableOpacity>
        */}
      </View>
      <View style={styles.container}>
        {/* <Image source={require('../assets/chapas/chapa_flor.png')} style={styles.imageBackground} /> */}
        {frasesToUse.length > 0 && (
          <Swiper
            key={cardIndex}
            cards={frasesToUse}
            renderCard={(card) => (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={styles.card}>
                  <Text style={styles.label}>{card?.tipo || ''}</Text>
                  <View style={styles.fraseContainer}>
                    <Text style={styles.text}>{procesarFrase(card?.frase) || 'Sin contenido'}</Text>
                  </View>
                  <View style={styles.cardFooter}>
                    <Text style={styles.placeholder}>
                      {card?.castigo ? `${'🥃 '.repeat(Number(card.castigo)).trim()}` : ''}
                    </Text>
                  </View>
                </View>
              </View>
            )}
            onSwipedRight={(index) => {
              if (index >= frasesToUse.length - 1) {
                setTimeout(() => {
                  const nuevas = shuffleArray(frasesCombinadas);
                  setFrasesToUse(nuevas);
                  setCardIndex(0);
                }, 300);
              } else {
                setCardIndex(index + 1);
              }
            }}
            onSwipedLeft={(index) => {
              if (index > 0) {
                setCardIndex(index - 1);
              }
            }}
            cardIndex={cardIndex}
            backgroundColor="transparent"
            stackSize={3}
            stackSeparation={30}
            stackScale={20}
            showSecondCard={true}
            animateCardOpacity
            disableLeftSwipe={Platform.OS === 'web'} disableRightSwipe={Platform.OS === 'web'} disableTopSwipe={Platform.OS === 'web'} disableBottomSwipe={Platform.OS === 'web'}
            infinite={false}
          />
        )}
      </View>
      {Platform.OS === 'web' && (
        <View style={styles.webNavButtons}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => {
              if (cardIndex > 0) {
                setCardIndex(cardIndex - 1);
              }
            }}
          >
            <Text style={styles.navButtonText}>Anterior</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => {
              if (cardIndex < frasesToUse.length - 1) {
                setCardIndex(cardIndex + 1);
              }
            }}
          >
            <Text style={styles.navButtonText}>Siguiente</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#bfa3ff',
  },
  container: {
    flex: 1,
    backgroundColor: '#bfa3ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: Dimensions.get('window').width * 0.85,
    aspectRatio: 0.625,
    borderRadius: 20,
    backgroundColor: '#E2D6FF',
    borderWidth: 2,
    borderColor: '#ffffff22',
    shadowColor: '#fff',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  },
  text: {
    fontSize: 26,
    fontFamily: 'Satoshi-Medium',
    color: '#000',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 30,
  },
  fraseContainer: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    paddingTop: 20,
  },
  label: {
    fontSize: 28,
    fontFamily: 'Panchang-Bold',
    textTransform: 'uppercase',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
    top: 20,
    left: 20,
    right: 20,
    borderBottomWidth: 0,
    color: '#000',
    position: 'absolute',
  },
  cardFooter: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  placeholder: {
    fontSize: 14,
    fontFamily: 'Panchang-Bold',
    color: '#000',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    zIndex: 10,
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
  tuFraseBtn: {
    position: 'absolute',
    right: 20,
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000',
    zIndex: 10,
  },
  tuFraseBtnText: {
    color: '#000',
    fontWeight: 'bold',
    fontFamily: 'Panchang-Bold',
  },
  webNavButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    width: '100%',
  },
  navButton: {
    backgroundColor: '#E2D6FF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
  },
  navButtonText: {
    fontSize: 16,
    fontFamily: 'Panchang-Bold',
    color: '#000',
  },
});

export default PruebaGameFourScreen;
