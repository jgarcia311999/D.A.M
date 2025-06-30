import React, { useState, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MiniGame1({ route, navigation }) {
  const { jugadores = [] } = route.params || {};
  const [top, setTop] = useState({ 1: null, 2: null, 3: null });
  const [asignados, setAsignados] = useState([]);
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState(null);
  const dropZoneRefs = useRef({ 1: null, 2: null, 3: null });

  useFocusEffect(
    React.useCallback(() => {
      setTop({ 1: null, 2: null, 3: null });
      setAsignados([]);
      setJugadorSeleccionado(null);
    }, [])
  );

  const renderDropZones = () => (
    <View style={styles.topContainer}>
      {[1, 2, 3].map((pos) => {
        const jugadorTop = asignados.includes(top[pos]) ? top[pos] : null;
        return (
          <View key={pos} style={styles.dropZoneWrapper}>
            <Text style={styles.topItem}>TOP {pos}:</Text>
            <TouchableOpacity
              ref={(ref) => {
                if (ref) dropZoneRefs.current[pos] = ref;
              }}
              style={styles.dropZone}
              onPress={() => {
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
              }}
            >
              {jugadorTop && (
                <View
                  style={[
                    { position: 'relative' },
                    styles.jugador
                  ]}
                >
                  <Text style={styles.jugadorTexto}>{jugadorTop}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <Ionicons name="ellipsis-vertical" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
      {renderDropZones()}
      <View style={styles.jugadoresWrapper}>
        {jugadores
          .filter((nombre) => !asignados.includes(nombre))
          .map((nombre, index) => {
            const row = Math.floor(index / 3);
            const col = index % 3;
            const initialLeft = 20 + col * 110;
            const initialTop = 20 + row * 80;
            return (
              <TouchableOpacity
                key={nombre}
                onPress={() => setJugadorSeleccionado(nombre)}
                style={[
                  {
                    position: 'absolute',
                    left: initialLeft,
                    top: initialTop,
                  },
                  styles.jugador,
                  jugadorSeleccionado === nombre && { backgroundColor: 'rgba(0, 150, 0, 0.6)' }
                ]}
              >
                <Text style={styles.jugadorTexto}>{nombre}</Text>
              </TouchableOpacity>
            );
          })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#191716',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff'
  },
  jugadoresWrapper: {
    position: 'relative',
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
  topContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
  },
  topItem: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dropZoneWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  dropZone: {
    flex: 1,
    height: 90,
    borderWidth: 2,
    borderColor: '#555',
    borderStyle: 'dashed',
    borderRadius: 10,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  header: {
    width: '100%',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
