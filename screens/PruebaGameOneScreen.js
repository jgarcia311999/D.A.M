
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
import { View, Text, Button, StyleSheet, Image, ScrollView, Dimensions, TouchableOpacity, Modal, TouchableWithoutFeedback, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function GameOneScreen({ route, navigation }) {
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
    const [modalInfoVisible, setModalInfoVisible] = useState(false);
    const [infoPage, setInfoPage] = useState(0);
    const infoPages = [
      `Un juego de cartas para beber... sí, otro más. Pero este por lo menos te obliga a usar una neurona o dos.`,
      `Son cuatro fases. Aciertas, avanzas. La cagas, bebes.\n¿Demasiado para ti? Siempre puedes rendirte y fingir que repartes los tragos por estrategia.`,
      `Fase 1 – Color: ¿Roja o negra? Una decisión tan difícil como elegir entre tinto o cerveza.\n\nFase 2 – Mayor o menor: Compara cartas. Decide si sube o baja. Vamos, no es física cuántica.`,
      `Fase 3 – ¿Entre o fuera?: ¿La carta cae entre las otras dos? Pues di "sí" o "no", a ver si te crees Nostradamus.\n\nFase 4 – Palo: Elige: cigarro, cubata, gallina u oro.`,
      `¿Te rajas? Genial. Reparte tragos como si fueras el rey de la fiesta… aunque todos sepan que te has cagado.`,
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
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            setInfoPage(0);
            setModalInfoVisible(true);
          }}>
            <Ionicons name="help-circle-outline" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
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
        <Modal
          visible={modalInfoVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalInfoVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setModalInfoVisible(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={{ flex: 1, justifyContent: 'space-between', width: '100%' }}>
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styles.modalMessage}>
                      {infoPages[infoPage]}
                    </Text>
                  </View>
                  <View style={styles.modalFooter}>
                    <TouchableOpacity onPress={() => setInfoPage(Math.max(infoPage - 1, 0))} disabled={infoPage === 0}>
                      <Text style={{ color: infoPage === 0 ? '#555' : '#fff', fontSize: 24 }}>{"<"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setInfoPage(Math.min(infoPage + 1, infoPages.length - 1))} disabled={infoPage === infoPages.length - 1}>
                      <Text style={{ color: infoPage === infoPages.length - 1 ? '#555' : '#fff', fontSize: 24 }}>{">"}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
}

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    backgroundColor: '#191716',
    paddingTop: 0,
    position: 'relative',
  },
  cardGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 10,
    marginTop: 80, // para que no tape el header
  },
  cardImage: {
    width: '20%',
    aspectRatio: 0.625,
    marginHorizontal: 5,
    borderWidth: 3,
    borderColor: 'green',
    borderRadius: 12,
    backgroundColor: 'rgba(0, 100, 0, 0.5)',
  },
  turno: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 5,
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Panchang-Regular',
  },
  question: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
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
    borderWidth: 3,
    borderColor: 'green',
  },
  colorRight: {
    flex: 1,
    backgroundColor: 'black',
    borderRadius: 20,
    marginLeft: 10,
    borderWidth: 3,
    borderColor: 'green',
  },
  verticalStack: {
    marginHorizontal: 20,
    marginVertical: 20,
  },
  fullWidthBox: {
    width: '100%',
    height: 100, // reducido
    backgroundColor: 'rgba(0, 100, 0, 0.5)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  choiceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
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
    backgroundColor: 'rgba(0, 100, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircleOverlay: {
    width: 120, // reducido
    height: 120,
    borderRadius: 30,
    backgroundColor: 'green',
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
    backgroundColor: 'rgba(0, 100, 0, 0.5)',
    borderRadius: 10,
    marginVertical: 10,
  },
  gridImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  message: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'Panchang-Regular',
  },
  plantarmeButton: {
    backgroundColor: 'green',
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  plantarmeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    fontFamily: 'Panchang-Regular',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#191716',
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
    borderWidth: 3,
    borderColor: 'green',
    borderRadius: 12,
    backgroundColor: 'rgba(0, 100, 0, 0.5)',
  },
  modalMessage: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'Panchang-Regular',
  },
});