import React from 'react';
import { ScrollView, View, StyleSheet, Dimensions, TouchableOpacity, Image, SafeAreaView, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const minijuegos = [
  {
    id: 'mini1',
    titulo: 'MiniMiniJuego 1',
    descripcion: 'Explicación para el minijuego número 1.',
  },
  {
    id: 'mini2',
    titulo: 'MiniMiniJuego 2',
    descripcion: 'Instrucciones para el minijuego número 2.',
  },
  {
    id: 'mini3',
    titulo: 'MiniMiniJuego 3',
    descripcion: 'Así se juega el minijuego 3: todos hacen X.',
  },
  {
    id: 'mini4',
    titulo: 'MiniMiniJuego 4',
    descripcion: 'Normas especiales del minijuego cuatro.',
  },
  {
    id: 'mini5',
    titulo: 'MiniMiniJuego 5',
    descripcion: 'Qué tienes que hacer en el MiniMiniJuego 5.',
  },
];

const { width, height } = Dimensions.get('window');

export default function HomeScreen({ navigation, route }) {
    const { jugadores } = route.params || {};
    const [mostrarOpciones, setMostrarOpciones] = React.useState(false);
    const insets = useSafeAreaInsets();

    const juegos = [
      {
        nombre: 'Ranking Salvaje',
        descripcion: 'Ordena elementos inusuales según tu criterio personal.',
        screen: 'MiniGame1',
      },
      {
        nombre: 'Hot Take',
        descripcion: 'Comparte opiniones polémicas y defiéndelas con argumentos.',
        screen: 'MiniGame2',
      },
      {
        nombre: 'La ruleta del shot',
        descripcion: 'Gira y bebe, facil y sencillo.',
        screen: 'Juego 3',
      },
      {
        nombre: 'Asociación rápida',
        descripcion: 'Relaciona palabras lo más rápido posible en rondas cronometradas.',
        screen: 'MiniGame4',
      },
      ...minijuegos.map(j => ({
        nombre: j.titulo,
        descripcion: j.descripcion,
        screen: null,
        minijuego: j
      })),
    ];

    const handleMinijuegoPress = (minijuego) => {
      navigation.navigate('VariosMinigames', { minijuego });
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={styles.gridBackground}>
                <TouchableOpacity
                  style={[{ position: 'absolute', top: insets.top + 10, left: 20, zIndex: 10 }]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    navigation.goBack();
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
                        <View style={styles.cardsContainer}>
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
      paddingTop: 60,
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
});
