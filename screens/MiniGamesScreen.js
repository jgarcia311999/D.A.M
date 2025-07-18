import React from 'react';
import { ScrollView, View, StyleSheet, Dimensions, TouchableOpacity, Image, SafeAreaView, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import minijuegos from '../data/minijuegos';


const { width, height } = Dimensions.get('window');

export default function HomeScreen({ navigation, route }) {
  const { jugadores } = route.params || {};
  const [mostrarOpciones, setMostrarOpciones] = React.useState(false);
  const insets = useSafeAreaInsets();

  const juegos = [
    {
      nombre: 'The best',
      descripcion: 'Relaciona palabras lo más rápido posible en rondas cronometradas.',
      screen: 'MiniGame4',
    },
    ...minijuegos.map(j => ({
      nombre: j.titulo,
      descripcion: j.descripcion,
      screen: null,
      minijuego: j,
      recomendacion: j.recomendacion,
    })),
  ];

  const handleMinijuegoPress = (minijuego) => {
    // Pasa todo el objeto minijuego, incluyendo descripcionDetallada
    navigation.navigate('VariosMinigames', { minijuego });
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.gridBackground}>
        <TouchableOpacity
          style={[{ position: 'absolute', top: insets.top + 10, left: 20, zIndex: 10 }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            navigation.navigate('Inicio');
          }
          }}
        >
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            {
              position: 'absolute',
              top: insets.top + 10,
              right: 20,
              zIndex: 10,
              backgroundColor: 'transparent',
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#000',
            },
          ]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.navigate('Jugadores');
          }}
        >
          <Text style={{ color: '#000', fontWeight: 'bold', fontFamily: 'Panchang-Bold' }}>Borrachos</Text>
        </TouchableOpacity>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ flex: 1 }}>
            <View style={[styles.cardsContainer, { paddingTop: insets.top + 60 }]}>
              {juegos.map((juego, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.gameCard}
                  onPress={() =>
                    juego.minijuego
                      ? handleMinijuegoPress(juego.minijuego)
                      : navigation.navigate(juego.screen, { jugadores })
                  }
                >
                  {juego.recomendacion && (
                    <Image
                      source={require('../assets/chapas/chapa_ok.png')}
                      style={styles.recomendacionBadge}
                    />
                  )}
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.gameText}>{juego.nombre}</Text>
                    <Text style={styles.gameDescription}>{juego.descripcion}</Text>
                  </View>
                </TouchableOpacity>
              ))}
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
    backgroundColor: '#70B77E',
  },
  imageBackground: {
    position: 'absolute',
    top: -height * 0.06,
    left: -width * 0.12,
    width: width * 0.7,
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain',
    zIndex: 2,
  },
  cardsContainer: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  gameCard: {
    width: '90%',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    backgroundColor: '#459853',
    borderWidth: 2,
    borderColor: '#0A5617',
  },
  cardImage: {
    width: '100%',
    height: '70%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    resizeMode: 'cover',
  },
  cardTextContainer: {
    gap: 2,
    alignItems: 'center',
  },
  gameText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Panchang-Bold',
    color: '#000',
    marginBottom: 10,
    textTransform: 'uppercase',
    paddingHorizontal: 20,
    textAlign: 'center',
  },
  gameDescription: {
    fontSize: 14,
    fontFamily: 'Panchang-Regular',
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  recomendacionBadge: {
    position: 'absolute',
    top: -25,
    right: -15,
    width: 70,
    height: 70,
    resizeMode: 'contain',
    zIndex: 20,
    transform: [{ rotate: '45deg' }],
  },
});
