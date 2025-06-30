import React, { useState, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MiniGame1({ route, navigation }) {
  const { jugadores = [] } = route.params || {};
  const [frasesUsadas, setFrasesUsadas] = useState([]);
  const [top, setTop] = useState({ 1: null, 2: null, 3: null });
  const [asignados, setAsignados] = useState([]);
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState(null);
  const dropZoneRefs = useRef({ 1: null, 2: null, 3: null });

  const frases = [
    'Personajes de Disney',
    'Tipos de ex',
    'Cosas que odias en una cita',
    'Excusas malas para llegar tarde',
    'Bebidas que arruinan tu noche',
    'Canciones para llorar',
    'Peores regalos que te han hecho'
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
        <Text style={styles.topLabel}>TOP 2</Text>
        <TouchableOpacity
          onPress={() => asignarTop(2)}
          style={[styles.podiumBox, styles.podiumSecond]}
        >
          {top[2] && <Text style={styles.jugadorTexto}>{top[2]}</Text>}
        </TouchableOpacity>
      </View>
      <View style={styles.podiumSlot}>
        <Text style={styles.topLabel}>TOP 1</Text>
        <TouchableOpacity
          onPress={() => asignarTop(1)}
          style={[styles.podiumBox, styles.podiumFirst]}
        >
          {top[1] && <Text style={styles.jugadorTexto}>{top[1]}</Text>}
        </TouchableOpacity>
      </View>
      <View style={styles.podiumSlot}>
        <Text style={styles.topLabel}>TOP 3</Text>
        <TouchableOpacity
          onPress={() => asignarTop(3)}
          style={[styles.podiumBox, styles.podiumThird]}
        >
          {top[3] && <Text style={styles.jugadorTexto}>{top[3]}</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.innerContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>
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
          <Text style={styles.tema}>{tema}</Text>
          {renderPodium()}
          {jugadorSeleccionado && (
            <Text style={{ color: '#fff', marginBottom: 16 }}>
              Jugador seleccionado: {jugadorSeleccionado}
            </Text>
          )}
          <View style={styles.jugadoresWrapper}>
            {jugadores
              .filter((nombre) => !asignados.includes(nombre))
              .map((nombre) => {
                return (
                  <TouchableOpacity
                    key={nombre}
                    onPress={() => setJugadorSeleccionado(nombre)}
                    style={[
                      styles.jugador,
                      jugadorSeleccionado === nombre && { backgroundColor: 'rgba(0, 150, 0, 0.6)' }
                    ]}
                  >
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
              setModalVisible(false);
              setTop({ 1: null, 2: null, 3: null });
              setAsignados([]);
              setJugadorSeleccionado(null);
              setTema(getNuevaFrase());
            }}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.text}>Tema: {tema}</Text>
                <Text style={styles.text}>TOP 1: {top[1] || '---'}</Text>
                <Text style={styles.text}>TOP 2: {top[2] || '---'}</Text>
                <Text style={styles.text}>TOP 3: {top[3] || '---'}</Text>
                <Pressable
                  style={styles.botonCerrar}
                  onPress={() => {
                    setModalVisible(false);
                    setTop({ 1: null, 2: null, 3: null });
                    setAsignados([]);
                    setJugadorSeleccionado(null);
                    setTema(getNuevaFrase());
                  }}
                >
                  <Text style={styles.botonTexto}>Cerrar</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#191716',
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#191716',
    paddingBottom: 100,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff'
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
    backgroundColor: 'rgba(0, 100, 0, 0.5)',
    borderColor: 'green',
    borderWidth: 2,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    margin: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  jugadorTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Eliminado topContainer si no es usado
  topItem: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  // Eliminados dropZoneWrapper y dropZone si ya no se usan
  header: {
    width: '100%',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tema: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
    marginTop: 40,
  },
  botonContinuar: {
    backgroundColor: '#6a0dad',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 0,
  },
  botonTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#333',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    width: '80%',
  },
  botonCerrar: {
    marginTop: 20,
    backgroundColor: '#cc0000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
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
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  podiumBox: {
    borderWidth: 2,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    width: '100%',
  },
  podiumFirst: {
    height: 120,
    borderColor: '#FFD700', // oro
    backgroundColor: '#333',
  },
  podiumSecond: {
    height: 90,
    borderColor: '#C0C0C0', // plata
    backgroundColor: '#444',
  },
  podiumThird: {
    height: 90,
    borderColor: '#CD7F32', // bronce
    backgroundColor: '#444',
  },
  });
