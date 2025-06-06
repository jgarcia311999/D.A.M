import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Swiper from 'react-native-deck-swiper';
// import { frases as frasesEstáticas } from '../data/frases';
import { getTodasLasFrases } from '../data/getFrases';
import { useEffect } from 'react';

const { width } = Dimensions.get('window');

const PruebaGameFourScreen = () => {
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
      console.log("Frases personalizadas:", todas);
      setFrasesCombinadas(todas);
      setFrasesToUse(mezcladas);
    } catch (error) {
      console.error("Error al cargar frases dinámicas:", error);
    }
  };
  cargar();
}, []);

  if (frasesCombinadas.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Cargando frases o no se encontraron.</Text>
      </View>
    );
  }
console.log("frasesCombinadas:", frasesCombinadas);
console.log("frasesToUse:", frasesToUse);
  return (
    <View style={styles.container}>
      {frasesToUse.length > 0 && (
        <Swiper
          key={cardIndex} // Esto fuerza que el Swiper se reinicie
          cards={frasesToUse}
          renderCard={(card) => {
            console.log("Renderizando card:", card);
            return (
              <View style={styles.card}>
                <Text style={styles.text}>{card || 'Sin contenido'}</Text>
              </View>
            );
          }}
          onSwiped={(index) => {
            if (index >= frasesToUse.length - 1) {
              setTimeout(() => {
                const nuevas = shuffleArray(frasesCombinadas);
                setFrasesToUse(nuevas);
                setCardIndex(prev => prev + 1); // fuerza reinicio
              }, 300);
            }
          }}
          cardIndex={0}
          backgroundColor={'transparent'}
          stackSize={5}
          showSecondCard={true}
          stackSeparation={20}
          stackScale={0.9}
          overlayLabels={null}
          disableTopSwipe
          disableBottomSwipe
          animateCardOpacity
          infinite={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfcf7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    height: 450,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#780000',
    width: width * 0.8,
    marginTop: 0,
    alignSelf: 'center',
    flex: 0,
  },
  text: {
    fontSize: 20,
    fontFamily: 'PlayfairDisplaySC-Regular',
    color: '#780000',
    textAlign: 'center',
  },
});

export default PruebaGameFourScreen;
