import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { frases } from '../data/frases';

const { width } = Dimensions.get('window');

const PruebaGameFourScreen = () => {
  const [usedFrases, setUsedFrases] = useState([]);

  const getNextFrases = () => {
    const restantes = frases.filter(f => !usedFrases.includes(f));
    if (restantes.length === 0) return frases;
    return restantes;
  };

  const frasesToUse = getNextFrases();

  const onSwiped = (index) => {
    setUsedFrases(prev => [...prev, frasesToUse[index]]);
  };

  return (
    <View style={styles.container}>
      <Swiper
        cards={frasesToUse}
        renderCard={(card) => (
          <View style={styles.card}>
            <Text style={styles.text}>{card}</Text>
          </View>
        )}
        onSwiped={onSwiped}
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
    marginTop: 20,
  },
  text: {
    fontSize: 20,
    fontFamily: 'PlayfairDisplaySC-Regular',
    color: '#780000',
    textAlign: 'center',
  },
});

export default PruebaGameFourScreen;
