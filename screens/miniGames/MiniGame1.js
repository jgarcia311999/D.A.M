import React, { useState, useRef, useEffect } from 'react';
import { Animated } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable, LayoutAnimation, Platform, UIManager, SafeAreaView, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MiniGame1({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { jugadores = [] } = route.params || {};
  const [frasesUsadas, setFrasesUsadas] = useState([]);
  const [top, setTop] = useState({ 1: null, 2: null, 3: null });
  const [asignados, setAsignados] = useState([]);
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState(null);
  const dropZoneRefs = useRef({ 1: null, 2: null, 3: null });

  const [modalInfoVisible, setModalInfoVisible] = useState(false);
  const [infoPage, setInfoPage] = useState(0);

  // Estado y animación para la instrucción
  const [showInstruction, setShowInstruction] = useState(true);
  const instructionScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (showInstruction) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(instructionScale, {
            toValue: 1.05,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(instructionScale, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [showInstruction]);

  const infoPages = [
    'Un juego de cartas para beber... sí, otro más. Pero este por lo menos te obliga a usar una neurona o dos.',
    'Son cuatro fases. Aciertas, avanzas. La cagas, bebes.\n¿Demasiado para ti? Siempre puedes rendirte y fingir que repartes los tragos por estrategia.',
    'Fase 1 – Color: ¿Roja o negra? Una decisión tan difícil como elegir entre tinto o cerveza.\n\nFase 2 – Mayor o menor: Compara cartas. Decide si sube o baja. Vamos, no es física cuántica.',
    'Fase 3 – ¿Entre o fuera?: ¿La carta cae entre las otras dos? Pues di "sí" o "no", a ver si te crees Nostradamus.\n\nFase 4 – Palo: Elige: cigarro, cubata, gallina u oro.',
    '¿Te rajas? Genial. Reparte tragos como si fueras el rey de la fiesta… aunque todos sepan que te has cagado.',
    'Pulsa sobre el nombre del jugador y luego en el top que quieras ponerlo.',
  ];

  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const frases = [
    'TOP 3 que mas cerveza beben',
    'TOP 3 que mas salen de fiesta',
    'TOP 3 que mas ligan de fiesta',
    'TOP 3 que mas nudes suyos tengan',
    'TOP 3 que mas haya f*llado esta semana',
    'TOP 3 que más rápido acaban',
    'TOP 3 que más usan Tinder',
    'TOP 3 que tienen un OnlyFans secreto',
    'TOP 3 que más juguetes tienen en la mesita de noche',
    'TOP 3 que más fantasías raras tienen',
    'TOP 3 que más veces lo han hecho en sitios públicos',
    'TOP 3 que tienen el historial de navegación más turbio',
    'TOP 3 que nunca dicen que no a un chupito',
    'TOP 3 que más han vomitado en una noche',
    'TOP 3 que más se han quedado dormidos en fiestas',
    'TOP 3 que más han hecho el ridículo bailando',
    'TOP 3 que han sido echados de un local',
    'TOP 3 que peor aguantan el alcohol',
    'TOP 3 que mas pesados se ponen cuando beben',
    'TOP 3 que más drama montan en fiestas',
    'TOP 3 que más han mentido para ligar',
    'TOP 3 que más hablan de los demás',
    'TOP 3 mas chismosos',
    'TOP 3 mas pedorros',
    'TOP 3 que más stickers suyos circulan',
    'TOP 3 que más han enviado mensajes calientes borrachos',
    'TOP 3 que ligarian con alguien mucho mas mayor que el',
    'TOP 3 que han salido de fiesta un martes “porque sí”',
    'TOP 3 que más se han liado con gente del mismo grupo',
    'TOP 3 que menos han bebido hoy',
    'TOP 3 que más veces han terminado abrazando al váter'
  ];

  const getNuevaFrase = () => {
    const restantes = frases.filter(f => !frasesUsadas.includes(f));
    const nueva = restantes[Math.floor(Math.random() * restantes.length)];
    setFrasesUsadas(prev => {
      const actualizadas = [...prev, nueva];
      return actualizadas.length === frases.length ? [] : actualizadas;
    });
    return nueva;
  };

  const [tema, setTema] = useState(() => getNuevaFrase());
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setTop({ 1: null, 2: null, 3: null });
      setAsignados([]);
      setJugadorSeleccionado(null);
      setTema(getNuevaFrase());
    }, [])
  );

  const asignarTop = (pos) => {
    if (!jugadorSeleccionado) return;
    setTop((prevTop) => {
      const anterior = prevTop[pos];
      setAsignados((prevAsignados) => {
        let nuevos = [...prevAsignados];
        if (anterior && anterior !== jugadorSeleccionado) {
          nuevos = nuevos.filter((j) => j !== anterior);
        }
        if (!nuevos.includes(jugadorSeleccionado)) {
          nuevos.push(jugadorSeleccionado);
        }
        return nuevos;
      });
      return { ...prevTop, [pos]: jugadorSeleccionado };
    });
    setJugadorSeleccionado(null);
  };

  const renderPodium = () => (
    <View style={styles.podiumContainer}>
      <View style={styles.podiumSlot}>
        <Text style={[styles.topLabel, { fontFamily: 'Panchang-Bold', color: '#000' }]}>TOP 2</Text>
        <TouchableOpacity
          onPress={() => asignarTop(2)}
          style={[styles.podiumBox, styles.podiumSecond]}
        >
          {top[2] && <Text style={[styles.jugadorTexto, { color: '#000', fontFamily: 'Panchang-Bold' }]}>{top[2]}</Text>}
        </TouchableOpacity>
      </View>
      <View style={styles.podiumSlot}>
        <Text style={[styles.topLabel, { fontFamily: 'Panchang-Bold', color: '#000' }]}>TOP 1</Text>
        <TouchableOpacity
          onPress={() => asignarTop(1)}
          style={[styles.podiumBox, styles.podiumFirst]}
        >
          {top[1] && <Text style={[styles.jugadorTexto, { color: '#000', fontFamily: 'Panchang-Bold' }]}>{top[1]}</Text>}
        </TouchableOpacity>
      </View>
      <View style={styles.podiumSlot}>
        <Text style={[styles.topLabel, { fontFamily: 'Panchang-Bold', color: '#000' }]}>TOP 3</Text>
        <TouchableOpacity
          onPress={() => asignarTop(3)}
          style={[styles.podiumBox, styles.podiumThird]}
        >
          {top[3] && <Text style={[styles.jugadorTexto, { color: '#000', fontFamily: 'Panchang-Bold' }]}>{top[3]}</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#9BB7D4', paddingTop: 50 }}>
      <View style={styles.scrollView}>
        <View style={styles.innerContainer}>
          <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
            <TouchableOpacity onPress={() => {
              Haptics.selectionAsync();
              navigation.goBack();
            }}>
              <Ionicons name="arrow-back" size={28} color="#000" />
            </TouchableOpacity>
          </View>
          <View style={{ height: insets.top + 58 }} />
          <Text style={styles.tema}>{tema}</Text>
          {renderPodium()}
          <View style={styles.jugadoresWrapper}>
            {jugadores.map((nombre) => {
              const asignado = asignados.includes(nombre);
              return (
                <TouchableOpacity
                  key={nombre}
                  onPress={() => setJugadorSeleccionado(nombre)}
                  disabled={asignado}
                  style={[
                    styles.jugador,
                    jugadorSeleccionado === nombre && { backgroundColor: '#6C8FB4' },
                    asignado && { opacity: 0.4 }
                  ]}>
                  <Text style={styles.jugadorTexto}>{nombre}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              setModalVisible(false);
              setTop({ 1: null, 2: null, 3: null });
              setAsignados([]);
              setJugadorSeleccionado(null);
              setTema(getNuevaFrase());
            }}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={[styles.text, { marginBottom: 18 }]}>{tema}</Text>
                <Text style={styles.topTextModal}>TOP 1: {top[1] || '---'}, 3 tragos</Text>
                <Text style={styles.topTextModal}>TOP 2: {top[2] || '---'}, 2 tragos</Text>
                <Text style={[styles.topTextModal, { marginBottom: 0 }]}>TOP 3: {top[3] || '---'}, 1 trago</Text>
                <Pressable
                  style={[styles.botonContinuar, { marginTop: 28 }]}
                  onPress={() => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    setModalVisible(false);
                    setTop({ 1: null, 2: null, 3: null });
                    setAsignados([]);
                    setJugadorSeleccionado(null);
                    setTema(getNuevaFrase());
                  }}
                >
                  <Text style={[styles.botonTexto, { color: '#000' }]}>Cerrar</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
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
                    <TouchableOpacity
                      onPress={() => setInfoPage(Math.max(infoPage - 1, 0))}
                      disabled={infoPage === 0}
                      style={infoPage === 0 ? { opacity: 0.4 } : null}
                    >
                      <Text style={{ color: infoPage === 0 ? '#555' : '#000', fontSize: 24, fontFamily: 'Panchang-Bold' }}>{"<"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setInfoPage(Math.min(infoPage + 1, infoPages.length - 1))}
                      disabled={infoPage === infoPages.length - 1}
                      style={infoPage === infoPages.length - 1 ? { opacity: 0.4 } : null}
                    >
                      <Text style={{ color: infoPage === infoPages.length - 1 ? '#555' : '#000', fontSize: 24, fontFamily: 'Panchang-Bold' }}>{">"}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </View>
        <View style={{ marginVertical: 20, marginBottom: 40, alignItems: 'center' }}>
          <TouchableOpacity
            style={[
              styles.botonContinuar,
              Object.values(top).some(t => !t) && { opacity: 0.4 }
            ]}
            onPress={() => setModalVisible(true)}
            disabled={Object.values(top).some(t => !t)}
          >
            <Text style={styles.botonTexto}>Confirmar TOP</Text>
          </TouchableOpacity>
        </View>
      </View>
      {showInstruction && (
        <Animated.View style={{
          position: 'absolute',
          bottom: 30,
          alignSelf: 'center',
          backgroundColor: 'rgba(0,0,0,0.6)',
          paddingVertical: 10,
          paddingHorizontal: 24,
          borderRadius: 20,
          marginHorizontal: 20,
          transform: [{ scale: instructionScale }],
          maxWidth: '90%',
        }}>
          <TouchableWithoutFeedback onPress={() => setShowInstruction(false)}>
            <View>
              <TouchableOpacity
                onPress={() => setShowInstruction(false)}
                style={{ position: 'absolute', top: -16, right: -25, zIndex: 2, backgroundColor: '#fff', borderRadius: 12, padding: 2 }}
              >
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#000' }}>✕</Text>
              </TouchableOpacity>
              <Text style={{
                color: '#fff',
                fontSize: 14,
                textAlign: 'center',
                fontFamily: 'Panchang-Bold',
              }}>
                Pulsa sobre un nombre y luego en la posición del TOP que quieras ponerlo
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  
  scrollView: {
    flex: 1,
    backgroundColor: '#9BB7D4', 
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#9BB7D4', 
    paddingBottom: 100,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000', 
    fontFamily: 'Panchang-Bold', 
  },
  jugadoresWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 0,
    paddingTop: 0,
    width: '100%',
    paddingHorizontal: 20,
  },
  jugador: {
    backgroundColor: '#C9DAEC', 
    borderColor: '#9BB7D4', 
    borderWidth: 2, 
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    margin: 6,
    minWidth: 80,
    alignItems: 'center',
    shadowColor: '#000', 
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  jugadorTexto: {
    color: '#000', 
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Panchang-Bold', 
  },
  topItem: {
    color: '#000', 
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Panchang-Bold',
  },
  header: {
    width: '100%',
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    zIndex: 2,
  },
  tema: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000', 
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Panchang-Bold',
  },
  botonContinuar: {
    backgroundColor: '#6C8FB4', 
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginTop: 0,
    shadowColor: '#000', 
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  botonTexto: {
    color: '#000', 
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Panchang-Bold', 
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#C9DAEC', 
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    width: '95%',
    maxWidth: 480,
    justifyContent: 'center',
    minHeight: 350,
    borderWidth: 2, 
    borderColor: '#ffffff44', 
    shadowColor: '#000', 
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 6,
  },
  botonCerrar: {
    marginTop: 20,
    backgroundColor: '#ff9e9e', 
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 14, 
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  podiumSlot: {
    alignItems: 'center',
    flex: 1,
  },
  topLabel: {
    color: '#000', 
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'Panchang-Bold',
  },
  podiumBox: {
    borderWidth: 2,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    width: '100%',
    backgroundColor: '#C9DAEC', 
    shadowColor: '#000', 
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  podiumFirst: {
    height: 120,
    borderColor: '#ffd700', 
    backgroundColor: '#C9DAEC', 
  },
  podiumSecond: {
    height: 90,
    borderColor: '#c0c0c0', 
    backgroundColor: '#C9DAEC',
  },
  podiumThird: {
    height: 90,
    borderColor: '#cd7f32', 
    backgroundColor: '#C9DAEC',
  },
  modalMessage: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000', 
    fontFamily: 'Panchang-Bold',
    
  },
  modalFooter: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
  },

  topTextModal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
    fontFamily: 'Panchang-Bold',
  },
});
