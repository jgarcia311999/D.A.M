import React from 'react';
import { ScrollView, View, StyleSheet, Dimensions, TouchableOpacity, Image, SafeAreaView, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

export default function HomeScreen({ navigation, route }) {
    const { jugadores } = route.params || {};
    const [mostrarOpciones, setMostrarOpciones] = React.useState(false);

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
        nombre: 'Asociación rápida',
        descripcion: 'Relaciona palabras lo más rápido posible en rondas cronometradas.',
        screen: 'MiniGame3',
      },
    ];

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={styles.gridBackground}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={{ flex: 1 }}>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Ionicons name="arrow-back" size={28} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setMostrarOpciones(!mostrarOpciones)}>
                                <Ionicons name="ellipsis-vertical" size={28} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.cardsContainer}>
                            {juegos.map((juego, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.gameCard}
                                    onPress={() => navigation.navigate(juego.screen, { jugadores })}
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
        top: -height * 0.06,
        left: -width * 0.12,
        width: width * 0.7,
        height: undefined,
        aspectRatio: 1,
        resizeMode: 'contain',
        zIndex: 2,
    },
    cardsContainer: {
        marginTop: 120,
        paddingHorizontal: 20,
        paddingBottom: 40,
        gap: 20,
    },
    gameCard: {
        width: width * 0.85,
        height: height * 0.25,
        borderRadius: 12,
        backgroundColor: 'rgba(0, 100, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'green',
        position: 'relative',
    },
    cardImage: {
        width: '100%',
        height: '70%',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        resizeMode: 'cover',
    },
    cardTextContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        gap: 2,
    },
    gameText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'left',
        lineHeight: 26,
        marginBottom: 4,
    },
    gameDescription: {
        color: 'white',
        fontSize: 14,
        textAlign: 'left',
        marginTop: 10,
    },
});
