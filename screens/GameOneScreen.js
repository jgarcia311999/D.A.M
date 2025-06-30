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
import { View, Text, Button, StyleSheet, Image, ScrollView, Dimensions, TouchableOpacity, Modal, TouchableWithoutFeedback, Pressable, SafeAreaView } from 'react-native';

export default function GameOneScreen({ route }) {
    const { height } = Dimensions.get('window');

    const palos = ['oro', 'cubata', 'pollo', 'cigarro'];
    const colores = {
        oro: 'rojo',
        cubata: 'rojo',
        pollo: 'negro',
        cigarro: 'negro',
    };

    const obtenerImagenCarta = (carta) => {
      if (!carta) return require('../assets/cartas/carta-trasera.png');
      let valor = carta.numero;
      if (valor === 10) valor = 'j';
      else if (valor === 11) valor = 'q';
      else if (valor === 12) valor = 'k';

      const clave = `${carta.palo}_${valor}`;
      return cartasImagenes[clave] || require('../assets/cartas/carta-trasera.png');
    };

    const generarCarta = () => {
        const palo = palos[Math.floor(Math.random() * palos.length)];
        const numero = Math.floor(Math.random() * 12) + 1;
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
        iniciarJuego();
    };

    // Parpadeo visual para feedback: parpadea el color del texto del jugador 2 ciclos
    const parpadear = (color) => {
      let count = 0;
      const interval = setInterval(() => {
        setColorTextoJugador((prev) => (prev === color ? null : color));
        count++;
        if (count === 4) clearInterval(interval);
      }, 150);
    };

    const cerrarModal = () => {
      setModalVisible(false);
      if (resultado) return;
      if (fase < 4) setFase(fase + 1);
    };

    const elegirColor = (colorElegido) => {
        const carta = generarCarta();
        setCartas([carta]);
        if (carta.color === colorElegido) {
            setModalCarta({ carta, acierto: true });
            setModalVisible(true);
        } else {
            setModalCarta({ carta, acierto: false });
            setModalVisible(true);
            setMensaje(`😵 Fallaste. Tienes que beber ${fase} trago${fase > 1 ? 's' : ''}.`);
            setResultado('perdiste');
        }
    };

    const elegirMayorMenor = (opcion) => {
        const cartaAnterior = cartas[0];
        const nuevaCarta = generarCarta();
        setCartas([...cartas, nuevaCarta]);

        const comparacion = nuevaCarta.numero > cartaAnterior.numero ? 'mayor' : (nuevaCarta.numero < cartaAnterior.numero ? 'menor' : 'igual');

        if (comparacion === opcion) {
            setModalCarta({ carta: nuevaCarta, acierto: true });
            setModalVisible(true);
        } else {
            setModalCarta({ carta: nuevaCarta, acierto: false });
            setModalVisible(true);
            setMensaje(`😵 Fallaste. Tienes que beber ${fase} trago${fase > 1 ? 's' : ''}.`);
            setResultado('perdiste');
        }
    };

    const elegirEntre = (opcion) => {
        const [c1, c2] = cartas;
        const nuevaCarta = generarCarta();
        setCartas([...cartas, nuevaCarta]);

        const min = Math.min(c1.numero, c2.numero);
        const max = Math.max(c1.numero, c2.numero);
        const estaEntre = nuevaCarta.numero > min && nuevaCarta.numero < max;

        if ((estaEntre && opcion === 'sí') || (!estaEntre && opcion === 'no')) {
            setModalCarta({ carta: nuevaCarta, acierto: true });
            setModalVisible(true);
        } else {
            setModalCarta({ carta: nuevaCarta, acierto: false });
            setModalVisible(true);
            setMensaje(`😵 Fallaste. Tienes que beber ${fase} trago${fase > 1 ? 's' : ''}.`);
            setResultado('perdiste');
        }
    };

    const elegirPalo = (paloElegido) => {
        const nuevaCarta = generarCarta();
        setCartas([...cartas, nuevaCarta]);

        if (nuevaCarta.palo === paloElegido) {
            setModalCarta({ carta: nuevaCarta, acierto: true });
            setModalVisible(true);
            setResultado('ganaste');
        } else {
            setModalCarta({ carta: nuevaCarta, acierto: false });
            setModalVisible(true);
            setMensaje(`😵 Fallaste. Tienes que beber ${fase} trago${fase > 1 ? 's' : ''}.`);
            setResultado('perdiste');
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
              {modalCarta && modalCarta.carta && (
                <>
                  <Image
                    source={obtenerImagenCarta(modalCarta.carta)}
                    style={styles.modalCardImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.modalMessage}>
                    {modalCarta.acierto ? '¡Correcto!' : 'Fallaste'}
                  </Text>
                </>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );

    return (
      <SafeAreaView style={[styles.container, { paddingTop: 50 }]}>
        <Text style={[styles.turno, { color: colorTextoJugador || '#2d3436' }]}>{jugadorActual}</Text>
        <View style={styles.cardGrid}>
          {[0, 1, 2, 3].map((i) => (
            <Image key={i} source={obtenerImagenCarta(cartas[i])} style={styles.cardImage} resizeMode="contain" />
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
        <Text style={styles.message}>{mensaje}</Text>
        {/* Botón Plantarme solo si no ha fallado y no hay resultado */}
        {!resultado && (
          <TouchableOpacity style={styles.plantarmeButton} onPress={handlePlantarme}>
            <Text style={styles.plantarmeText}>Cagarse</Text>
          </TouchableOpacity>
        )}
        {resultado && (
          <Button title="Reiniciar" onPress={reiniciar} />
        )}
        <CartaModal />
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#f9f4f0', // El color de fondo ahora es dinámico
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

  question: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
  message: { fontSize: 16, marginTop: 20, marginBottom: 10, textAlign: 'center' },
  buttonRow: { flexDirection: 'row', gap: 16, marginVertical: 10 },
  palosGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginVertical: 10 },
  choiceButton: {
      backgroundColor: '#3498db',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      margin: 5,
  },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

  historial: {
      marginBottom: 20,
      width: '100%',
      alignItems: 'flex-start',
      paddingHorizontal: 10,
  },
  historialTitulo: {
      fontWeight: 'bold',
      marginBottom: 5,
      fontSize: 16,
  },
  historialItem: {
      fontSize: 14,
      color: '#555',
  },
  turno: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 5,
    color: '#2d3436',
    textAlign: 'center',
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
  cardGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  cardImage: {
    width: 90,
    height: 130,
    marginHorizontal: 5,
  },
  horizontalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
    gap: 20,
    flex: 1,
  },
  verticalContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 300,
    marginVertical: 30,
    gap: 20,
  },
  choiceBox: {
    width: '45%',
    height: 160,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
    // En la fase 1, height se sobrescribe a 100% en línea
  },
  choiceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
  },
  gridItem: {
    width: '45%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 10,
    marginVertical: 10,
  },
  gridImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  // --- Botones color fase 1 ---
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
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  colorRight: {
    flex: 1,
    backgroundColor: 'black',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },

  plantarmeButton: {
    backgroundColor: '#2ecc71',
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  plantarmeText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  verticalStack: {
    marginHorizontal: 20,
    marginVertical: 20,
  },
  fullWidthBox: {
    width: '100%',
    height: 140,
    backgroundColor: '#ddd',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },


  circlesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 40,
  },

  outerCircle: {
    width: 350,
    height: 350,
    borderRadius: 30,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },

  innerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#555',
  },


  centeredCircleWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 40,
    position: 'relative',
  },

  innerCircleOverlay: {
    width: 200,
    height: 200,
    borderRadius: 30,
    backgroundColor: '#555',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -100 }, { translateY: -100 }],
    zIndex: 2,
  },


  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    width: '80%',
  },
  modalCardImage: {
    width: 150,
    height: 220,
    marginBottom: 20,
  },
  modalMessage: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },

});
