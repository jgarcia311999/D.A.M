import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Dimensions, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Animated } from 'react-native';
import { Modalize } from 'react-native-modalize';

export default function HomeScreen({ navigation }) {
  const scrollRef = useRef(null);
  const modalRef = useRef(null);
  const inputRef = useRef(null);

  const [mostrarInput, setMostrarInput] = useState(false);
  const [nombre, setNombre] = useState('');
  const [jugadores, setJugadores] = useState([]);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Animación para el input
  const inputAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      if (nombre.trim() === '') {
        setMostrarInput(false);
      }
    });

    return () => {
      keyboardDidHideListener.remove();
    };
  }, [nombre]);

  useEffect(() => {
    Animated.timing(inputAnim, {
      toValue: mostrarInput ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [mostrarInput]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const juegos = [
    { nombre: 'La Cadena del Crupier', color: 'transparent', textoColor: '#000', ruta: 'Pre juego 1' },
    { nombre: 'Bebecartas', color: 'transparent', textoColor: '#000', ruta: 'Juego 2' },
  ];

  const agregarJugador = () => {
    if (nombre.trim() !== '') {
      setJugadores([nombre.trim(), ...jugadores]);
      setNombre('');
      setMostrarInput(false);
      Keyboard.dismiss();
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, backgroundColor: '#fdfcf7', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, marginTop: 80, position: 'relative' }}>
          <TouchableOpacity onPress={() => navigation.navigate('TittleScreen')} style={{ position: 'absolute', left: 20 }}>
            <Text style={{ fontSize: 28, color: '#780000' }}>{'←'}</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 28, color: '#780000', fontFamily: 'Panchang-Bold' }}>D.A.M</Text>
          <TouchableOpacity
            style={{ position: 'absolute', right: 20 }}
            onPress={() => {
              if (mostrarInput) {
                setMostrarInput(false);
                Keyboard.dismiss();
              } else {
                setMostrarInput(true);
                setTimeout(() => {
                  inputRef.current?.focus();
                }, 100);
              }
            }}
          >
            <Text style={{ fontSize: 28, color: '#780000', fontWeight: 'bold' }}>
              {mostrarInput ? '－' : '＋'}
            </Text>
          </TouchableOpacity>
        </View>
        {/* Input para añadir jugador */}
        <Animated.View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 20,
          height: inputAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 60], // Altura del input visible
          }),
          opacity: inputAnim,
          overflow: 'hidden',
        }}>
          <TextInput
            ref={inputRef}
            style={styles.inputGrande}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Nombre del jugador"
            placeholderTextColor="#999"
            onSubmitEditing={agregarJugador}
          />
          <TouchableOpacity style={styles.botonAgregar} onPress={() => {
            agregarJugador();
            setMostrarInput(false);
          }}>
            <Text style={{ fontSize: 18, color: '#780000' }}>OK</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Four game cards in a 2x2 grid, always visible, disabled when keyboard is visible */}
        <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 40 }}>
          <TouchableOpacity
            disabled={keyboardVisible}
            style={[styles.card, { width: '48%' }]}
            onPress={() => navigation.navigate('Pre juego 1', { jugadores })}
          >
            <Text style={styles.cardTitle}>La Cadena del Crupier</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={keyboardVisible}
            style={[styles.card, { width: '48%' }]}
            onPress={() => navigation.navigate('Juego 2', { jugadores })}
          >
            <Text style={styles.cardTitle}>Bebecartas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={keyboardVisible}
            style={[styles.card, { width: '48%' }]}
            onPress={() => navigation.navigate('Juego 3', { jugadores })}
          >
            <Text style={styles.cardTitle}>Juego 3</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={keyboardVisible}
            style={[styles.card, { width: '48%' }]}
            onPress={() => navigation.navigate('Prueba 4', { jugadores })}
          >
            <Text style={styles.cardTitle}>Juego 4</Text>
          </TouchableOpacity>
        </View>

        <Modalize
          ref={modalRef}
          alwaysOpen={120}
          modalHeight={height - 50}
          handlePosition="inside"
          panGestureEnabled
          withHandle={true}
          adjustToContentHeight={false}
          modalStyle={styles.bottomSheetContainer}
          scrollViewProps={{ showsVerticalScrollIndicator: false }}
          keyboardAvoidingBehavior="height"
          onOpen={() => {
            // Aquí podrías ajustar la altura si es necesario
            // Ejemplo: modalRef.current?.setModalHeight(height - 100);
          }}
        >
          <Text style={styles.title}>Nuestros Borrachos</Text>

          {jugadores.length > 0 && (
            <ScrollView
              style={[styles.listaJugadores, { maxHeight: height * 0.32 }]}
              nestedScrollEnabled
              contentContainerStyle={{ flexGrow: 1 }}
            >
              <View style={styles.listaFila}>
                {jugadores.map((j, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      const nuevos = jugadores.filter((_, i) => i !== index);
                      setJugadores(nuevos);
                    }}
                    style={styles.jugadorTouchable}
                  >
                    <Text style={styles.jugadorNombre}>{j}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          )}
        </Modalize>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  damText: {
    fontSize: height * 0.08,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 0,
    fontFamily: 'Panchang-Bold',
  },
  slogan: {
    fontSize: height * 0.025,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Panchang-Regular',
  },
  title: {
    fontSize: 28,
    marginBottom: 40,
    fontWeight: 'bold',
    fontFamily: 'Panchang-Regular',
    textAlign: 'center',
    color: '#780000'
  },
  logo: {
    width: '80%',
    height: height * 0.65,
    resizeMode: 'contain',
    marginTop: 20,
  },
  logoSuperior: {
    height: 60,
    resizeMode: 'contain',
    marginTop: 40,
    marginBottom: 20,
    alignSelf: 'center',
  },
  lupa: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#780000',
    position: 'absolute',
    top: 0,
    right: 20,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  // input: eliminado o actualizado, ya no se usa
  inputGrande: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#780000',
    padding: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: 'white',
    fontSize: 16,
    fontFamily: 'Panchang-Regular',
    color: '#000',
    marginRight: 10,
  },
  botonAgregar: {
    backgroundColor: '#fdfcf7',
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#780000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lista: {
    marginTop: 20,
    alignItems: 'center',
  },
  listaTitulo: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontFamily: 'Panchang-Regular',
  },
  listaItem: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Panchang-Regular',
  },
  section: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 0,
    paddingTop: 10,
  },
  card: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#780000',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    height: 250,
  },
  smallCard: {
    height: 200,
    padding: 10,
  },
  cardContent: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 6,
    textTransform: 'uppercase',
    textAlign: 'center',
    color: '#780000',
    fontFamily: 'Panchang-Bold'
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    width: '100%',
    height: '40%',
    position: 'absolute',
    bottom: -80,
    alignItems: 'center',
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  jugadorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 10,
  },
  listaFila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    width: '100%',
    marginTop: 20,
  },
  jugadorTouchable: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#780000',
    borderRadius: 10,
    padding: 10,
    width: '48%',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  jugadorNombre: {
    fontSize: 16,
    fontFamily: 'Panchang-Regular',
    color: '#000',
  },
  bottomSheetContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderWidth: 2,
    borderColor: '#780000',
    padding: 20,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },

  listaJugadores: {
    width: '100%',
    marginTop: 20,
    maxHeight: height * 0.25,
  },
  jugadorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#780000',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 10,
    width: '100%',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  eliminarJugadorBtn: {
    marginLeft: 12,
    backgroundColor: '#f8d7da',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eliminarJugadorTxt: {
    color: '#780000',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 20,
  },

});
