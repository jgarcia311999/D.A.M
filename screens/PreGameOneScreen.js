import React from 'react';
import { View, Text, Button, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';
import * as Haptics from 'expo-haptics';

export default function GameOneScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={require('../assets/cerveza_blackjack.png')} style={styles.image} resizeMode="contain" />
      </View>
      <Text style={styles.imageTitle}>La Cadena del Crupier</Text>
      <View style={styles.separator} />
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.scrollSection}>
        <View style={styles.slide}>
          <Text style={styles.slideText}>
            Acertar 4 veces seguidas para completar la cadena. Si fallas en cualquier paso… ¡bebes! y si ganas... ¡DESCUBRELO!
          </Text>
        </View>
        <View style={styles.slide}>
          <Text style={styles.slideText}>
            1. Color – Adivina si la carta será roja (oros/copas) o negra (espadas/bastos).
            {"\n"}2. Mayor o menor – Adivina si la siguiente carta será mayor o menor que la anterior.
          </Text>
        </View>
        <View style={styles.slide}>
          <Text style={styles.slideText}>
            3. ¿Entre o fuera? – Se revelan dos cartas. Debes decir si la siguiente estará entre sus valores o fuera.
            {"\n"}4. Palo exacto – Adivina el palo exacto (oros, copas, espadas o bastos) de la siguiente carta.
          </Text>
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button
          title="Empezar"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.navigate('Juego 1');
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    position: 'relative',
  },
  imageContainer: {
    height: Dimensions.get('window').height * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '60%',
    height: '80%',
  },
  imageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollSection: {
    flex: 1,
  },
  slide: {
    width: Dimensions.get('window').width,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginHorizontal: 20,
    marginBottom: 10,
  },
});
