import React, { useRef, useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Dimensions, Keyboard, TouchableWithoutFeedback } from 'react-native';

export default function HomeScreen({ navigation }) {
  const scrollRef = useRef(null);

  const [mostrarInput, setMostrarInput] = useState(false);
  const [nombre, setNombre] = useState('');
  const [jugadores, setJugadores] = useState([]);

  const [busqueda, setBusqueda] = useState('');
  const [mostrarBusqueda, setMostrarBusqueda] = useState(false);

  const juegos = [
    { id: 1, nombre: 'La Cadena del Crupier', imagen: require('../assets/cartas/oro-user.png'), color: '#fff', ruta: 'Juego 1', textoColor: '#000' },
    { id: 2, nombre: 'Bebecartas', imagen: require('../assets/cartas/cigarro-user.png'), color: '#d9d9d9', ruta: 'Juego 2', textoColor: '#000' },
    { id: 3, nombre: 'Juego 3', imagen: require('../assets/cartas/cubata-user.png'), color: '#f24e1e', ruta: 'Juego 3', textoColor: '#fff' },
    { id: 4, nombre: 'Juego 4', imagen: require('../assets/cartas/pollo-user.png'), color: '#8e44ad', ruta: 'Juego 4', textoColor: '#fff' },
  ];

  const juegosFiltrados = juegos.filter(j => j.nombre.toLowerCase().includes(busqueda.toLowerCase()));

  const handleScrollDown = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ y: height, animated: true });
    }
  };

  const agregarJugador = () => {
    if (nombre.trim() !== '') {
      setJugadores([...jugadores, nombre.trim()]);
      setNombre('');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => {
      Keyboard.dismiss();
      setMostrarBusqueda(false);
    }}>
      <ScrollView
        ref={scrollRef}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: '#fdfcf7' }}
        contentContainerStyle={{ backgroundColor: '#fdfcf7' }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ height }}>
          <TouchableOpacity onPress={handleScrollDown}>
            <View style={[styles.section, { marginTop: '25%' }]}>
              <Text style={styles.damText}>D.A.M</Text>
              <Text style={styles.slogan}>Drink and More</Text>
              <Image source={require('../assets/munyeco_logo.png')} style={styles.logo} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { paddingBottom: 40 }]}>
          <View style={{ width: '100%', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', paddingHorizontal: 20, marginBottom: 10 }}>
              <View style={{ flex: 1, marginTop: 50 }}>
                <Text style={{ fontSize: 24, color: '#666' }}>Elige tu juego</Text>
                <Text style={{ fontSize: 32, fontWeight: 'bold', marginBottom:'20' }}>Para empezar la fiesta</Text>
              </View>
              <View style={{ marginTop: 20 }}>
                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                  {mostrarBusqueda ? (
                    <TextInput
                      autoFocus
                      style={[styles.input, { width: 140, height: 30, marginTop: -4 }]}
                      placeholder="Buscar..."
                      value={busqueda}
                      onChangeText={setBusqueda}
                      onBlur={() => setMostrarBusqueda(false)}
                    />
                  ) : (
                    <Text
                      style={{ fontSize: 20 }}
                      onPress={() => setMostrarBusqueda(true)}
                    >🔍</Text>
                  )}
                  <Text style={{ fontSize: 22 }}>➕</Text>
                </View>
              </View>
            </View>
            {juegosFiltrados.map(j => (
              <TouchableOpacity key={j.id} style={[styles.card, { backgroundColor: j.color }]} onPress={() => navigation.navigate(j.ruta, { jugadores })}>
                <View style={styles.cardContent}>
                  <View style={styles.cardRow}>
                    <View style={{ width: '60%' }}>
                      <Text style={[styles.cardTitle, { color: j.textoColor }]}>{j.nombre}</Text>
                      <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: j.textoColor, justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                        <Text style={{ color: j.color, fontSize: 16 }}>→</Text>
                      </View>
                    </View>
                    <Image source={j.imagen} style={{ width: 120, height: 120, resizeMode: 'contain' }} />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.title}>Jugadores</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre del jugador"
              value={nombre}
              onChangeText={setNombre}
            />
            <Button title="Agregar jugador" onPress={agregarJugador} />
            {jugadores.length > 0 && (
              <View style={styles.lista}>
                <Text style={styles.listaTitulo}>Jugadores añadidos:</Text>
                {jugadores.map((j, index) => (
                  <Text key={index} style={styles.listaItem}>• {j}</Text>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfcf7',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 100,
    gap: 20,
  },
  damText: {
    fontSize: 140,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 0,
  },
  slogan: {
    fontSize: 24,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  title: { fontSize: 28, marginBottom: 40, fontWeight: 'bold' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    justifyContent: 'space-between',
  },
  logo: {
    width: 450,
    height: 450,
    resizeMode: 'contain',
  },
  dam: {
    fontSize: 56,
    fontWeight: 'bold',
  },
  drink: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  botones: {
    flexDirection: 'row',
    gap: 20,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#3498db',
    borderRadius: 30,
    padding: 15,
    elevation: 5,
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginTop: 10,
    width: 200,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  lista: {
    marginTop: 20,
    alignItems: 'center',
  },
  listaTitulo: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  listaItem: {
    fontSize: 16,
    color: '#333',
  },
  section: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 0,
    paddingTop: 30,
  },
  card: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    height: 200,
  },
  cardContent: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    margin: 6,
    textTransform: 'uppercase'
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#444',
    margin: 6,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
  },
  cardArrow: {
    fontSize: 28,
    color: '#000',
  },
});
