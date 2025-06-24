import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Swiper from 'react-native-deck-swiper';
// import { frases as frasesEstáticas } from '../data/frases';
import { getTodasLasFrases } from '../data/getFrases';
import { useEffect } from 'react';

const userIcons = [
    require('../assets/cartas/pollo-user.png'),
    require('../assets/cartas/oro-user.png'),
    require('../assets/cartas/cubata-user.png'),
    require('../assets/cartas/cigarro-user.png'),
];

const { width } = Dimensions.get('window');

const PruebaGameFourScreen = ({ route, navigation }) => {
    const { jugadores = [] } = route.params || {};
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
            <SafeAreaView style={styles.container}>
                <Text style={styles.text}>Rellenando chupitos</Text>
            </SafeAreaView>
        );
    }
    return (
        <SafeAreaView style={styles.container}>
            <Image source={require('../assets/chapas/chapa_flor.png')} style={styles.imageBackground} />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleMenu}>
                    <Ionicons name="add" size={28} color="#fff" />
                </TouchableOpacity>
            </View>
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
                                <Image
                                    source={getRandomUserIcon()}
                                    style={styles.footerImage}
                                />
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
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#191716',
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        width: Dimensions.get('window').width * 0.8,
        aspectRatio: 0.625,
        borderRadius: 12,
        backgroundColor: 'rgba(0, 100, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'green',
        position: 'relative',
        marginTop: 100,
        marginBottom: 'auto',
        alignSelf: 'center',
    },
    text: {
        fontSize: 20,
        fontFamily: 'Panchang-Regular',
        color: '#fff',
        textAlign: 'center',
    },
    tipo: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
        textAlign: 'center',
    },
    fraseContainer: {
        flex: 1,
        justifyContent: 'center',
        width: '100%',
        paddingTop: 50,
    },
    label: {
        position: 'absolute',
        top: 20,
        left: 30,
        right: 30,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        borderBottomWidth: 1,
        borderColor: '#fff',
        paddingBottom: 5,
    },
    cardFooter: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 20,
    },
    placeholder: {
        fontSize: 12,
        color: '#fff',
    },
    footerImage: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
    },
    header: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        zIndex: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
