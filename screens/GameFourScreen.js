import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, SafeAreaView, ImageBackground } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Swiper from 'react-native-deck-swiper';
// import { frases as frasesEstáticas } from '../data/frases';
import { getTodasLasFrases } from '../data/getFrases';
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
    const cargar = async () => {
      try {
        const todas = await getTodasLasFrases();
        const mezcladas = shuffleArray(todas);
        setFrasesCombinadas(todas);
        setFrasesToUse(mezcladas);
      } catch (error) {
        console.error("Error al cargar frases dinámicas:", error);
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
      <View style={{ position: 'absolute', top: insets.top + 10, left: 0, right: 0, flexDirection: 'row', justifyContent: 'flex-start', paddingHorizontal: 20, zIndex: 10 }}>
        <TouchableOpacity onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          navigation.goBack();
        }}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        {/* <Image source={require('../assets/chapas/chapa_flor.png')} style={styles.imageBackground} /> */}
        {frasesToUse.length > 0 && (
          <Swiper
            key={cardIndex}
            cards={frasesToUse}
            renderCard={(card) => (
              <View style={styles.card}>
                <Text style={styles.label}>{card?.tipo || ''}</Text>
                <View style={styles.fraseContainer}>
                  <Text style={styles.text}>{procesarFrase(card?.frase) || 'Sin contenido'}</Text>
                </View>
                <View style={styles.cardFooter}>
                  <Text style={styles.placeholder}>
                    {card?.castigo ? `Bebe ${card.castigo} ${card.castigo === '1' ? 'chupito' : 'chupitos'}` : ''}
                  </Text>
                </View>
              </View>
            )}
            onSwiped={(index) => {
              if (index >= frasesToUse.length - 1) {
                setTimeout(() => {
                  const nuevas = shuffleArray(frasesCombinadas);
                  setFrasesToUse(nuevas);
                  setCardIndex(prev => prev + 1);
                }, 300);
              }
            }}
            cardIndex={0}
            backgroundColor="transparent"
            stackSize={5}
            showSecondCard={true}
            stackSeparation={15}
            stackScale={10}
            animateCardOpacity
            disableTopSwipe
            disableBottomSwipe
            infinite={false}
          />
        )}
      </View>
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
    alignSelf: 'center',
  },
  text: {
    fontSize: 18,
    fontFamily: 'Panchang-Regular',
    color: '#000',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 26,
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
});

export default PruebaGameFourScreen;
