import React, { useState, useRef, useMemo } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, PanResponder, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MiniGame1({ route, navigation }) {
  const { jugadores = [] } = route.params || {};
  const [top, setTop] = useState({ 1: null, 2: null, 3: null });
  const [asignados, setAsignados] = useState([]);
  const dropZoneRefs = useRef({ 1: null, 2: null, 3: null });

useFocusEffect(
  React.useCallback(() => {
    setTop({ 1: null, 2: null, 3: null });
    setAsignados([]);
    // Reiniciar animaciones de cada jugador al volver a la pantalla
    jugadoresRefs.forEach(j => {
      j.pan.setValue({ x: 0, y: 0 });
      j.pan.setOffset({ x: 0, y: 0 });
    });
  }, [])
);

  const checkDropZones = (gestureState) => {
    return new Promise((resolve) => {
      let matchedZone = null;
      let pending = 3;
      for (let i = 1; i <= 3; i++) {
        dropZoneRefs.current[i]?.measureInWindow((x, y, width, height) => {
          const inside =
            gestureState.moveY >= y &&
            gestureState.moveY <= y + height &&
            gestureState.moveX >= x &&
            gestureState.moveX <= x + width;

          if (inside && !matchedZone) {
            matchedZone = i;
          }
          if (--pending === 0) {
            resolve(matchedZone);
          }
        });
      }
    });
  };

  const jugadoresRefs = useMemo(() => {
    return jugadores.map((nombre, index) => {
      const pan = new Animated.ValueXY();
      const row = Math.floor(index / 3);
      const col = index % 3;
      const initialLeft = 20 + col * 110;
      const initialTop = 20 + row * 80;
      const initialPos = { x: initialLeft, y: initialTop };

      pan.setValue({ x: 0, y: 0 });

      const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          pan.setOffset(pan.__getValue());
          pan.setValue({ x: 0, y: 0 });
        },
        onPanResponderMove: Animated.event(
          [null, { dx: pan.x, dy: pan.y }],
          { useNativeDriver: false }
        ),
        onPanResponderRelease: async (_, gestureState) => {
          const zona = await checkDropZones(gestureState);
          console.log(`[${nombre}] soltado. Zona detectada:`, zona);
          if (zona) {
            console.log(`[${nombre}] intentando entrar en TOP ${zona}`);
            setTop((prev) => {
              const anterior = prev[zona];
              if (anterior && anterior !== nombre) {
                console.log(`[${nombre}] reemplaza a ${anterior} en TOP ${zona}`);
                const reemplazado = jugadoresRefs.find(j => j.nombre === anterior);
                if (reemplazado) {
                  reemplazado.pan.flattenOffset();
                  Animated.spring(reemplazado.pan, {
                    toValue: { x: 0, y: 0 },
                    useNativeDriver: false,
                  }).start();
                }
                setAsignados((prevAsignados) =>
                  prevAsignados.filter((j) => j !== anterior)
                );
              }
              console.log(`[${nombre}] asignado a TOP ${zona}. Estado anterior:`, anterior);
              return { ...prev, [zona]: nombre };
            });
            setAsignados((prev) => [...prev, nombre]);
            pan.setOffset(pan.__getValue());
            pan.setValue({ x: 0, y: 0 });
          } else {
            console.log(`[${nombre}] no cayó en zona válida. Vuelve a posición original`);
            pan.flattenOffset();
            Animated.spring(pan, {
              toValue: { x: 0, y: 0 },
              useNativeDriver: false,
            }).start();
          }
        },
      });

      return { nombre, pan, panResponder, initialLeft, initialTop, initialPos };
    });
  }, [jugadores]);

  const renderDropZones = () => (
    <View style={styles.topContainer}>
      {[1, 2, 3].map((pos) => {
        const jugadorTop = jugadoresRefs.find(j => j.nombre === top[pos]);
        return (
          <View key={pos} style={styles.dropZoneWrapper}>
            <Text style={styles.topItem}>TOP {pos}:</Text>
            <View
              ref={(ref) => (dropZoneRefs.current[pos] = ref)}
              style={styles.dropZone}
            >
              {jugadorTop && (
                <Animated.View
                  style={[
                    { position: 'relative' },
                    styles.jugador
                  ]}
                >
                  <Text style={styles.jugadorTexto}>{jugadorTop.nombre}</Text>
                </Animated.View>
              )}
            </View>
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
        <TouchableOpacity onPress={() => setMostrarOpciones(!mostrarOpciones)}>
          <Ionicons name="ellipsis-vertical" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
      {renderDropZones()}
      <View style={styles.jugadoresWrapper}>
        {jugadoresRefs
          .filter((j) => !asignados.includes(j.nombre))
          .map(({ nombre, pan, panResponder, initialLeft, initialTop }, index) => (
            <Animated.View
              key={index}
              {...panResponder.panHandlers}
              style={[
                { position: 'absolute', left: initialLeft, top: initialTop },
                { transform: pan.getTranslateTransform() },
                styles.jugador
              ]}
            >
              <Text style={styles.jugadorTexto}>{nombre}</Text>
            </Animated.View>
          ))}
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
