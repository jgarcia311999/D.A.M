
const cartasImagenes = {
  'oro_1': require('../assets/cartas/GameOneCards/oro/1.png'),
  'oro_2': require('../assets/cartas/GameOneCards/oro/2.png'),
  'oro_3': require('../assets/cartas/GameOneCards/oro/3.png'),
  'oro_4': require('../assets/cartas/GameOneCards/oro/4.png'),
  'oro_5': require('../assets/cartas/GameOneCards/oro/5.png'),
  'oro_6': require('../assets/cartas/GameOneCards/oro/6.png'),
  'oro_7': require('../assets/cartas/GameOneCards/oro/7.png'),
  'oro_8': require('../assets/cartas/GameOneCards/oro/8.png'),
  'oro_9': require('../assets/cartas/GameOneCards/oro/9.png'),
  'oro_j': require('../assets/cartas/GameOneCards/oro/j.png'),
  'oro_q': require('../assets/cartas/GameOneCards/oro/q.png'),
  'oro_k': require('../assets/cartas/GameOneCards/oro/k.png'),

  'cubata_1': require('../assets/cartas/GameOneCards/cubata/1.png'),
  'cubata_2': require('../assets/cartas/GameOneCards/cubata/2.png'),
  'cubata_3': require('../assets/cartas/GameOneCards/cubata/3.png'),
  'cubata_4': require('../assets/cartas/GameOneCards/cubata/4.png'),
  'cubata_5': require('../assets/cartas/GameOneCards/cubata/5.png'),
  'cubata_6': require('../assets/cartas/GameOneCards/cubata/6.png'),
  'cubata_7': require('../assets/cartas/GameOneCards/cubata/7.png'),
  'cubata_8': require('../assets/cartas/GameOneCards/cubata/8.png'),
  'cubata_9': require('../assets/cartas/GameOneCards/cubata/9.png'),
  'cubata_j': require('../assets/cartas/GameOneCards/cubata/j.png'),
  'cubata_q': require('../assets/cartas/GameOneCards/cubata/q.png'),
  'cubata_k': require('../assets/cartas/GameOneCards/cubata/k.png'),

  'pollo_1': require('../assets/cartas/GameOneCards/pollo/1.png'),
  'pollo_2': require('../assets/cartas/GameOneCards/pollo/2.png'),
  'pollo_3': require('../assets/cartas/GameOneCards/pollo/3.png'),
  'pollo_4': require('../assets/cartas/GameOneCards/pollo/4.png'),
  'pollo_5': require('../assets/cartas/GameOneCards/pollo/5.png'),
  'pollo_6': require('../assets/cartas/GameOneCards/pollo/6.png'),
  'pollo_7': require('../assets/cartas/GameOneCards/pollo/7.png'),
  'pollo_8': require('../assets/cartas/GameOneCards/pollo/8.png'),
  'pollo_9': require('../assets/cartas/GameOneCards/pollo/9.png'),
  'pollo_j': require('../assets/cartas/GameOneCards/pollo/j.png'),
  'pollo_q': require('../assets/cartas/GameOneCards/pollo/q.png'),
  'pollo_k': require('../assets/cartas/GameOneCards/pollo/k.png'),

  'cigarro_1': require('../assets/cartas/GameOneCards/cigarro/1.png'),
  'cigarro_2': require('../assets/cartas/GameOneCards/cigarro/2.png'),
  'cigarro_3': require('../assets/cartas/GameOneCards/cigarro/3.png'),
  'cigarro_4': require('../assets/cartas/GameOneCards/cigarro/4.png'),
  'cigarro_5': require('../assets/cartas/GameOneCards/cigarro/5.png'),
  'cigarro_6': require('../assets/cartas/GameOneCards/cigarro/6.png'),
  'cigarro_7': require('../assets/cartas/GameOneCards/cigarro/7.png'),
  'cigarro_8': require('../assets/cartas/GameOneCards/cigarro/8.png'),
  'cigarro_9': require('../assets/cartas/GameOneCards/cigarro/9.png'),
  'cigarro_j': require('../assets/cartas/GameOneCards/cigarro/j.png'),
  'cigarro_q': require('../assets/cartas/GameOneCards/cigarro/q.png'),
  'cigarro_k': require('../assets/cartas/GameOneCards/cigarro/k.png'),
};

import React, { useState, useEffect, useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { View, Text, Button, StyleSheet, Image, ScrollView, Dimensions, TouchableOpacity, Modal, TouchableWithoutFeedback, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function GameOneScreen({ route, navigation }) {
  const { height } = Dimensions.get('window');
  const insets = useSafeAreaInsets();

  const palos = ['oro', 'cubata', 'pollo', 'cigarro'];
  const colores = {
    oro: 'rojo',
    cubata: 'rojo',
    pollo: 'negro',
    cigarro: 'negro',
  };

  const obtenerImagenCarta = (carta) => {
    if (!carta) return require('../assets/cartas/carta-user-oro-br.png');
    let valor = carta.numero;
    if (valor === 10) valor = 'j';
    else if (valor === 11) valor = 'q';
    else if (valor === 12) valor = 'k';

    const clave = `${carta.palo}_${valor}`;
    return cartasImagenes[clave] || require('../assets/cartas/carta-trasera.png');
  };

  const generarCarta = (prohibidos = []) => {
    const palo = palos[Math.floor(Math.random() * palos.length)];
    let numero;
    do {
      numero = Math.floor(Math.random() * 12) + 1;
    } while (prohibidos.includes(numero));
    return { palo, numero, color: colores[palo] };
  };

  const [fase, setFase] = useState(0);
  const [cartas, setCartas] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [resultado, setResultado] = useState(null);
  const [jugadorActual, setJugadorActual] = useState('');
  const [colorTextoJugador, setColorTextoJugador] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalCarta, setModalCarta] = useState(null);
  const [modalInfoVisible, setModalInfoVisible] = useState(true);
  const [infoPage, setInfoPage] = useState(0);
  // --- Parpadeo de carta en fallo ---
  const [cartaFallidaIndex, setCartaFallidaIndex] = useState(null);
  const [parpadeoRojo, setParpadeoRojo] = useState(false);
  // --- Parpadeo de carta en acierto (verde) ---
  const [cartaAciertoIndex, setCartaAciertoIndex] = useState(null);
  const [parpadeoVerde, setParpadeoVerde] = useState(false);
  const [cartasAcertadas, setCartasAcertadas] = useState([]);
  // Parpadeo visual de carta al fallar
  const parpadearRojoCarta = (idx) => {
    setCartaFallidaIndex(idx);
    let count = 0;
    setParpadeoRojo(true);
    const interval = setInterval(() => {
      setParpadeoRojo(p => !p);
      count++;
      if (count === 4) { // 2 ciclos de parpadeo
        setParpadeoRojo(true); // Termina en rojo fijo
        clearInterval(interval);
      }
    }, 150);
  };

  // Parpadeo visual de carta al acertar (verde)
  const parpadearVerdeCarta = (idx) => {
    setCartaAciertoIndex(idx);
    let count = 0;
    setParpadeoVerde(true);
    const interval = setInterval(() => {
      setParpadeoVerde(p => !p);
      count++;
      if (count === 4) { // 2 ciclos de parpadeo
        setParpadeoVerde(true);
        setCartasAcertadas(prev => [...prev, idx]);
        clearInterval(interval);
      }
    }, 150);
  };
  const infoPages = [
    `Un juego de cartas para beber... sí, otro más. Pero este por lo menos te obliga a usar una neurona o dos.`,
    `Son cuatro fases. Aciertas, avanzas. La cagas, bebes.\n¿Demasiado para ti? Siempre puedes rendirte y fingir que repartes los tragos por estrategia.`,
    `Fase 1 - Color: ¿Roja o negra? Una decisión tan difícil como elegir entre vino o cerveza.\n\nFase 2 - Mayor o menor: Compara cartas. Decide si sube o baja. Vamos, no es física cuántica.`,
    `Fase 3 - ¿Entre o fuera?: ¿La carta cae entre las otras dos? Pues di "sí" o "no", a ver si te crees Nostradamus.\n\nFase 4 - Palo: Elige: cigarro, cubata, gallina u oro.`,
    `¿Te cagas? Genial. Reparte tragos como si fueras el rey de la fiesta… aunque todos sepan que te has cagado.`,
  ];
  const jugadores = route?.params?.jugadores || [];

  const seleccionarJugadorAleatorio = useCallback(() => {
    if (jugadores.length === 0) return;

    let nuevoJugador = jugadorActual;
    if (jugadores.length === 1) {
      nuevoJugador = jugadores[0];
    } else {
      while (nuevoJugador === jugadorActual) {
        nuevoJugador = jugadores[Math.floor(Math.random() * jugadores.length)];
      }
    }
    setJugadorActual(nuevoJugador);
  }, [jugadores, jugadorActual]);

  const iniciarJuego = () => {
    seleccionarJugadorAleatorio();
    setFase(1);
    setCartas([]);
    setMensaje('');
    setResultado(null);
  };

  const reiniciar = () => {
    setCartaFallidaIndex(null);
    setParpadeoRojo(false);
    setCartaAciertoIndex(null);
    setParpadeoVerde(false);
    setCartasAcertadas([]);
    iniciarJuego();
  };

  // Parpadeo visual para feedback: parpadea el color del texto del jugador 2 ciclos
  const parpadear = (color) => {
    let count = 0;
    const interval = setInterval(() => {
      setColorTextoJugador((prev) => (prev === color ? null : color));
      count++;
      if (count === 4) {
        clearInterval(interval);
        setColorTextoJugador(null); // ← Siempre vuelve al color original
      }
    }, 150);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    if (resultado === 'perdiste') {
      reiniciar();
      return;
    }
    if (resultado) return;
    if (fase < 4) {
      parpadearVerdeCarta(fase - 1);
      setFase(fase + 1);
    }
  };

  const elegirColor = (colorElegido) => {
    const carta = generarCarta();
    setCartas([carta]);
    if (carta.color === colorElegido) {
      // setModalCarta({ carta, acierto: true });
      // setModalVisible(true);
      parpadear('green');
      setModalCarta(null);
      setModalVisible(false);
      parpadearVerdeCarta(fase - 1);
      setTimeout(() => setFase(fase + 1), 200);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setModalCarta({ carta, acierto: false });
      setMensaje(`Fallaste. Tienes que beber ${fase} trago${fase > 1 ? 's' : ''}.`);
      setResultado('perdiste');
      parpadearRojoCarta(fase - 1);
      // reiniciar(); // Eliminado: ya no se reinicia automáticamente al perder
    }
  };

  const elegirMayorMenor = (opcion) => {
    const cartaAnterior = cartas[0];
    const nuevaCarta = generarCarta([cartas[0].numero]);
    setCartas([...cartas, nuevaCarta]);

    const comparacion = nuevaCarta.numero > cartaAnterior.numero ? 'mayor' : (nuevaCarta.numero < cartaAnterior.numero ? 'menor' : 'igual');

    if (comparacion === opcion) {
      // setModalCarta({ carta: nuevaCarta, acierto: true });
      // setModalVisible(true);
      parpadear('green');
      setModalCarta(null);
      setModalVisible(false);
      parpadearVerdeCarta(fase - 1);
      setTimeout(() => setFase(fase + 1), 200);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setModalCarta({ carta: nuevaCarta, acierto: false });
      setMensaje(`Fallaste. Tienes que beber ${fase} trago${fase > 1 ? 's' : ''}.`);
      setResultado('perdiste');
      parpadearRojoCarta(fase - 1);
      // reiniciar(); // Eliminado: ya no se reinicia automáticamente al perder
    }
  };

  const elegirEntre = (opcion) => {
    const [c1, c2] = cartas;
    const nuevaCarta = generarCarta([cartas[0].numero, cartas[1].numero]);
    setCartas([...cartas, nuevaCarta]);

    const min = Math.min(c1.numero, c2.numero);
    const max = Math.max(c1.numero, c2.numero);
    const estaEntre = nuevaCarta.numero > min && nuevaCarta.numero < max;

    if ((estaEntre && opcion === 'sí') || (!estaEntre && opcion === 'no')) {
      // setModalCarta({ carta: nuevaCarta, acierto: true });
      // setModalVisible(true);
      parpadear('green');
      setModalCarta(null);
      setModalVisible(false);
      parpadearVerdeCarta(fase - 1);
      setTimeout(() => setFase(fase + 1), 200);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setModalCarta({ carta: nuevaCarta, acierto: false });
      setMensaje(`Fallaste. Tienes que beber ${fase} trago${fase > 1 ? 's' : ''}.`);
      setResultado('perdiste');
      parpadearRojoCarta(fase - 1);
      // reiniciar(); // Eliminado: ya no se reinicia automáticamente al perder
    }
  };

  const elegirPalo = (paloElegido) => {
    const nuevaCarta = generarCarta();
    setCartas([...cartas, nuevaCarta]);

    if (nuevaCarta.palo === paloElegido) {
      // setModalCarta({ carta: nuevaCarta, acierto: true });
      // setModalVisible(true);
      parpadear('green');
      setModalCarta(null);
      setModalVisible(false);
      parpadearVerdeCarta(fase - 1);
      setTimeout(() => setResultado('ganaste'), 200);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setModalCarta({ carta: nuevaCarta, acierto: false });
      setMensaje(`Fallaste. Tienes que beber ${fase} trago${fase > 1 ? 's' : ''}.`);
      setResultado('perdiste');
      parpadearRojoCarta(fase - 1);
      // reiniciar(); // Eliminado: ya no se reinicia automáticamente al perder
    }
  };

  // --- Nueva función para Plantarme ---
  const handlePlantarme = () => {
    let tragos = Math.max(fase - 1, 1);
    setMensaje(`🍻 Puedes repartir ${tragos} trago${tragos > 1 ? 's' : ''}`);
    setResultado('plantado');
  };


  useEffect(() => {
    iniciarJuego();
  }, []);

  // Parpadear en verde el nombre del jugador cuando cambia la fase (avanza y no hay resultado)
  useEffect(() => {
    if (fase > 1 && !resultado) {
      parpadear('green');
    }
  }, [fase]);

  // Modal para mostrar la carta y el resultado
  const CartaModal = () => (
    <Modal
      visible={modalVisible}
      transparent
      animationType="fade"
      onRequestClose={cerrarModal}
    >
      <TouchableWithoutFeedback onPress={cerrarModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {modalCarta && modalCarta.carta && modalCarta.acierto && (
              <>
                <Image
                  source={obtenerImagenCarta(modalCarta.carta)}
                  style={styles.modalCardImage}
                  resizeMode="contain"
                />
                <Text style={styles.modalMessage}>
                  {'¡Correcto!'}
                </Text>
                <TouchableOpacity onPress={cerrarModal} style={{ marginTop: 20, padding: 10, backgroundColor: '#ff4d4d', borderRadius: 8 }}>
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>Aceptar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  // Mover scrollContainer aquí para poder usar insets.top dinámicamente
  const styles = StyleSheet.create({
    header: {
      // eliminado, ya no se usa
    },
    container: {
      flex: 1,
      paddingTop: 0,
      position: 'relative',
    },
    scrollView: {
      backgroundColor: '#ffc8a3',
    },
    scrollContainer: {
      flexGrow: 1,
      backgroundColor: '#ffc8a3',
      paddingTop: insets.top + 60,
    },
    cardGrid: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      marginVertical: 10,
      paddingHorizontal: 10,
      marginTop: 10, // para que no tape el header
    },
    cardImage: {
      width: 70,
      height: 112, // Mantiene una proporción realista de carta (0.625)
      marginHorizontal: 5,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: 'black',
      backgroundColor: '#D89568',
      resizeMode: 'contain',
    },
    turno: {
      fontSize: 22,
      fontWeight: '700',
      color: 'black',
      textAlign: 'center',
      fontFamily: 'Panchang-Regular',
      marginLeft: 10,
      marginRight: 10,
    },
    question: {
      fontSize: 22,
      marginBottom: 20,
      textAlign: 'center',
      color: 'black',
      fontFamily: 'Panchang-Regular',
    },
    colorRow: {
      flexDirection: 'row',
      flex: 1,
      marginHorizontal: 20,
      marginVertical: 20,
      overflow: 'hidden',
    },
    colorLeft: {
      flex: 1,
      backgroundColor: '#A52019',
      borderRadius: 20,
      marginRight: 10,
      borderWidth: 2,
      borderColor: 'black',
    },
    colorRight: {
      flex: 1,
      backgroundColor: 'black',
      borderRadius: 20,
      marginLeft: 10,
      borderWidth: 2,
      borderColor: 'black',
    },
    verticalStack: {
      marginHorizontal: 20,
      marginVertical: 20,
    },
    fullWidthBox: {
      width: '100%',
      height: 100, // reducido
      backgroundColor: '#D89568',
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
    },
    choiceText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'black',
      fontFamily: 'Panchang-Regular',
    },
    centeredCircleWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 40,
      position: 'relative',
    },
    outerCircle: {
      width: 250, // reducido
      height: 250,
      borderRadius: 30,
      backgroundColor: '#D89568',
      justifyContent: 'center',
      alignItems: 'center',
    },
    innerCircleOverlay: {
      width: 120, // reducido
      height: 120,
      borderRadius: 30,
      backgroundColor: '#AD6737',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: [{ translateX: -60 }, { translateY: -60 }],
      zIndex: 2,
    },
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      alignItems: 'center',
      marginTop: 20,
    },
    gridItem: {
      width: '40%', // reducido
      aspectRatio: 0.9, // ajustado
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#E2D6FF',
      borderRadius: 10,
      marginVertical: 10,
    },
    gridImage: {
      width: '80%',
      height: '80%',
      resizeMode: 'contain',
      backgroundColor: '#D89568',
    },
    message: {
      fontSize: 26,
      marginTop: 20,
      marginBottom: 10,
      textAlign: 'center',
      color: 'black',
      fontFamily: 'Panchang-Regular',
    },
    plantarmeButton: {
      backgroundColor: '#D89568',
      borderWidth: 2,
      borderColor: '#000000',
      padding: 12,
      marginHorizontal: 20,
      marginBottom: 20,
      borderRadius: 10,
      alignItems: 'center',
    },
    plantarmeText: {
      color: 'black',
      fontSize: 18,
      fontWeight: '900',
      fontFamily: 'Panchang-Regular',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: '#D89568',
      padding: 20,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      width: '80%',
      height: Dimensions.get('window').height * 0.7,
    },
    modalFooter: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      marginTop: 20,
    },
    modalCardImage: {
      width: 150,
      height: 220,
      marginBottom: 20,
      borderRadius: 12,
      backgroundColor: '#E2D6FF',
      borderWidth: 2,
      borderColor: '#ff4d4d',
    },
    modalMessage: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      color: 'black',
      fontFamily: 'Panchang-Regular',
    },
    fixedBackButton: {
      position: 'absolute',
      left: 20,
      zIndex: 10,
    },
    fixedHelpButton: {
      position: 'absolute',
      right: 20,
      zIndex: 10,
    },
    resultBox: {
      backgroundColor: '#ffcccc',
      borderColor: 'red',
      borderWidth: 2,
      borderRadius: 12,
      padding: 20,
      marginHorizontal: 20,
      alignItems: 'center',
    },
    resultText: {
      color: 'black',
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });

  return (
    <>
    <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.scrollView}>
      {/* Header absolute */}
      <View style={{
        position: 'absolute',
        top: insets.top + 10,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        zIndex: 20,
      }}>
        {/* Botón Back */}
        <TouchableOpacity onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            navigation.navigate('Inicio');
          }
        }}>
          <Ionicons name="arrow-back" size={28} color="#000000" />
        </TouchableOpacity>
        {/* Nombre jugador */}
        <Text style={{
          color: '#000',
          fontWeight: 'bold',
          fontSize: 22,
          fontFamily: 'Panchang-Regular',
          flex: 1,
          textAlign: 'center',
        }}>
          {jugadorActual}
        </Text>
        {/* Botón ayuda */}
        <TouchableOpacity onPress={() => {
          setInfoPage(0);
          setModalInfoVisible(true);
        }}>
          <Ionicons name="help-circle-outline" size={28} color="#000000" />
        </TouchableOpacity>
      </View>
      <View style={styles.cardGrid}>
        {[0, 1, 2, 3].map((i) => (
          <Image
            key={i}
            source={obtenerImagenCarta(cartas[i])}
            style={[
              styles.cardImage,
              i === cartaFallidaIndex && { borderColor: parpadeoRojo ? 'red' : 'black', borderWidth: 3 },
              (i === cartaAciertoIndex && parpadeoVerde) && { borderColor: 'green', borderWidth: 3 },
              cartasAcertadas.includes(i) && { borderColor: 'green', borderWidth: 3 },
            ]}
            resizeMode="contain"
          />
        ))}
      </View>
      {fase === 1 && !resultado && (
        <>
          <Text style={styles.question}>¿De qué color será la carta?</Text>
          <View style={styles.colorRow}>
            <TouchableOpacity
              style={styles.colorLeft}
              onPress={() => elegirColor('rojo')}
            />
            <TouchableOpacity
              style={styles.colorRight}
              onPress={() => elegirColor('negro')}
            />
          </View>
        </>
      )}
      {fase === 2 && !resultado && (
        <>
          <Text style={styles.question}>Mayor o menor?</Text>
          <View style={styles.verticalStack}>
            <TouchableOpacity style={styles.fullWidthBox} onPress={() => elegirMayorMenor('mayor')}>
              <Text style={styles.choiceText}>MAYOR</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.fullWidthBox} onPress={() => elegirMayorMenor('menor')}>
              <Text style={styles.choiceText}>MENOR</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      {fase === 3 && !resultado && (
        <>
          <Text style={styles.question}>¿Dentro o fuera?</Text>
          <View style={styles.centeredCircleWrapper}>
            <TouchableOpacity style={styles.outerCircle} onPress={() => elegirEntre('no')} />
            <TouchableOpacity style={styles.innerCircleOverlay} onPress={() => elegirEntre('sí')} />
          </View>
        </>
      )}
      {fase === 4 && !resultado && (
        <>
          <Text style={styles.question}>¿De qué palo será la siguiente carta?</Text>
          <View style={styles.gridContainer}>
            <TouchableOpacity style={styles.gridItem} onPress={() => elegirPalo('cigarro')}>
              <Image source={require('../assets/cartas/cigarro-user.png')} style={styles.gridImage} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.gridItem} onPress={() => elegirPalo('cubata')}>
              <Image source={require('../assets/cartas/cubata-user.png')} style={styles.gridImage} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.gridItem} onPress={() => elegirPalo('oro')}>
              <Image source={require('../assets/cartas/oro-user.png')} style={styles.gridImage} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.gridItem} onPress={() => elegirPalo('pollo')}>
              <Image source={require('../assets/cartas/pollo-user.png')} style={styles.gridImage} />
            </TouchableOpacity>
          </View>
        </>
      )}
      {/* Botón Plantarme solo si no ha fallado y no hay resultado */}
      {!resultado && (
        <TouchableOpacity style={styles.plantarmeButton} onPress={handlePlantarme}>
          <Text style={styles.plantarmeText}>Cagarse</Text>
        </TouchableOpacity>
      )}
      {resultado && (
        <>
          <Text style={styles.message}>{mensaje}</Text>
          <TouchableOpacity style={styles.plantarmeButton} onPress={reiniciar}>
            <Text style={styles.plantarmeText}>Intentar otra vez</Text>
          </TouchableOpacity>
        </>
      )}
      <CartaModal />
      <Modal
        visible={modalInfoVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalInfoVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => setModalInfoVisible(false)}>
            <View style={StyleSheet.absoluteFill} />
          </TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            <View style={{ flex: 1, justifyContent: 'space-between', width: '100%' }}>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={styles.modalMessage}>
                  {infoPages[infoPage]}
                </Text>
              </View>
              <View style={styles.modalFooter}>
                <TouchableOpacity onPress={() => setInfoPage(Math.max(infoPage - 1, 0))} disabled={infoPage === 0}>
                  <Text style={{ color: infoPage === 0 ? 'gray' : 'black', fontSize: 24 }}>{"<"}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setInfoPage(Math.min(infoPage + 1, infoPages.length - 1))} disabled={infoPage === infoPages.length - 1}>
                  <Text style={{ color: infoPage === infoPages.length - 1 ? 'gray' : 'black', fontSize: 24 }}>{">"}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
    </>
);
}

