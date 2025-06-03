import React, { useRef, useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Dimensions, Keyboard, TouchableWithoutFeedback } from 'react-native';
import Modal from 'react-native-modal';

export default function HomeScreen({ navigation }) {
  const scrollRef = useRef(null);

  const [mostrarInput, setMostrarInput] = useState(false);
  const [nombre, setNombre] = useState('');
  const [jugadores, setJugadores] = useState([]);
  const [mostrarModalJuegos, setMostrarModalJuegos] = useState(false);
  const [mostrarModalJugadores, setMostrarModalJugadores] = useState(false);

  const juegos = [
    { nombre: 'La Cadena del Crupier', color: 'transparent', textoColor: '#000', ruta: 'Pre juego 1' },
    { nombre: 'Bebecartas', color: 'transparent', textoColor: '#000', ruta: 'Juego 2' },
  ];

  const agregarJugador = () => {
    if (nombre.trim() !== '') {
      setJugadores([nombre.trim(), ...jugadores]);
      setNombre('');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: '#fdfcf7' }}
        contentContainerStyle={{ backgroundColor: '#fdfcf7' }}
        keyboardShouldPersistTaps="handled"
      >
        
        <View style={{ alignItems: 'center', marginTop: height * 0.1, marginBottom: 10, position: 'relative' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 20, top: 0 }}>
            <Text style={{ fontSize: 28, color: '#780000' }}>{'←'}</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#780000', fontFamily: 'PlayfairDisplaySC-Bold' }}>Selecciona tu juego</Text>
          <Text style={{ fontSize: 18, color: '#780000', marginTop: 5, fontFamily: 'PlayfairDisplaySC-Regular' }}>¡Comienza la fiesta!</Text>
        </View>

        <View style={[styles.section, { paddingBottom: 40 }]}>
          <View style={{ width: '100%', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', paddingHorizontal: 20, marginBottom: 10 }}>
              <View style={{ marginTop: 20 }}>
                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                </View>
              </View>
            </View>
            <TouchableOpacity style={[styles.card, { backgroundColor: juegos[0].color }]} onPress={() => navigation.navigate(juegos[0].ruta, { jugadores })}>
              <Text style={styles.cardTitle}>{juegos[0].nombre}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.card, { backgroundColor: juegos[1].color }]} onPress={() => navigation.navigate(juegos[1].ruta, { jugadores })}>
              <Text style={styles.cardTitle}>{juegos[1].nombre}</Text>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%', marginBottom: 10 }}>
              <TouchableOpacity
                style={[styles.card, styles.smallCard, { marginRight: 10 }]}
                onPress={() => setMostrarModalJuegos(true)}
              >
                <Text style={styles.cardTitle}> Mas Juegos</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.card, styles.smallCard]}
                onPress={() => setMostrarModalJugadores(true)}
              >
                <Text style={styles.cardTitle}>Añadir Borrachos</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
          </View>
        </View>

        <Modal 
          isVisible={mostrarModalJuegos}
          onBackdropPress={() => setMostrarModalJuegos(false)}
          onSwipeComplete={() => setMostrarModalJuegos(false)}
          swipeDirection="down"
          style={styles.bottomModal}
        >
          <View style={styles.modalContent}>
            <Text style={styles.title}>Más Juegos</Text>
            <TouchableOpacity
              style={[styles.card, { backgroundColor: 'transparent', borderWidth: 2, borderColor: '#780000' }]}
              onPress={() => {
                setMostrarModalJuegos(false);
                navigation.navigate('Juego 3', { jugadores });
              }}
            >
              <Text style={styles.cardTitle}>Juego 3</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.card, { backgroundColor: 'transparent', borderWidth: 2, borderColor: '#780000' }]}
              onPress={() => {
                setMostrarModalJuegos(false);
                navigation.navigate('Juego 4', { jugadores });
              }}
            >
              <Text style={styles.cardTitle}>Juego 4</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <Modal 
          isVisible={mostrarModalJugadores}
          onBackdropPress={() => setMostrarModalJugadores(false)}
          onSwipeComplete={() => setMostrarModalJugadores(false)}
          swipeDirection="down"
          style={styles.bottomModal}
        >
          <View style={styles.modalContent}>
            <Text style={[styles.title, { color: '#780000' }]}>Añadir Borrachos</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
              <TextInput
                style={styles.inputGrande}
                placeholder="Nombre del borracho"
                placeholderTextColor="#999"
                value={nombre}
                onChangeText={setNombre}
              />
              <TouchableOpacity onPress={agregarJugador} style={styles.botonAgregar}>
                <Text style={{ fontSize: 24, color: '#780000' }}>＋</Text>
              </TouchableOpacity>
            </View>
            {jugadores.length > 0 && (
              <View style={[styles.lista, styles.listaFila]}>
                {jugadores.map((j, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      const nuevos = jugadores.filter((_, i) => i !== index);
                      setJugadores(nuevos);
                    }}
                    style={[styles.jugadorTouchable]}
                  >
                    <Text style={styles.jugadorNombre}>{j}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </Modal>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  damText: {
    fontSize: height * 0.08,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 0,
    fontFamily: 'PlayfairDisplaySC-Bold',
  },
  slogan: {
    fontSize: height * 0.025,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'PlayfairDisplaySC-Regular',
  },
  title: { fontSize: 28, marginBottom: 40, fontWeight: 'bold', fontFamily: 'PlayfairDisplaySC-Regular' },
  logo: {
    width: '80%',
    height: height * 0.65,
    resizeMode: 'contain',
    marginTop: 20,
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
    fontFamily: 'PlayfairDisplaySC-Regular',
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
    fontFamily: 'PlayfairDisplaySC-Regular',
  },
  listaItem: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'PlayfairDisplaySC-Regular',
  },
  section: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 0,
    paddingTop: 10,
  },
  card: {
    width: '90%',
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
    height: 200,
  },
  smallCard: {
    width: '48%',
    height: 200,
    padding: 10,
  },
  cardContent: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    margin: 6,
    textTransform: 'uppercase',
    textAlign: 'center',
    color: '#780000',
    fontFamily: 'PlayfairDisplaySC-Bold'
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
    height: '90%',
    position: 'absolute',
    bottom: 0,
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
    fontFamily: 'PlayfairDisplaySC-Regular',
    color: '#000',
  },
});
