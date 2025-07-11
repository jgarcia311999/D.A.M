import * as Haptics from 'expo-haptics';
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Dimensions, TouchableWithoutFeedback, PanResponder, SafeAreaView } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const radius = width * 0.7;

const baseOptions = [
  '1 trago',
  '2 tragos',
  '3 tragos',
  'Todos beben',
  'Crea una regla',
  'Elige quien bebe',
  'Besito al de la izquierda',
  'Reta a alguien a piedra, papel, tijeras, el que pierda bebe',
  'Elige quien tenga una bebida diferente a la tuya, y cambiarosla',
  'Reto rápido',
  'Cambio de sitio, muevete tres sillas a tu izquierda',
  'Besito al de la derecha',
];

const baseColors = [
  '#bfa3ff', // lila suave
  '#a3c8ff', // celeste claro
  '#9BB7D4', // azul clarito
  '#F4B7D1', // rosa pastel suave
  '#FFC8A3', // durazno claro
  '#FDD9B0', // melocotón pastel
  '#70B77E', // verde suave
  '#8FCC9F', // verde menta claro
  '#FFB6B9', // rosa melocotón claro
  '#6A5ACD', // azul índigo
  '#FF9F80', // naranja pastel
  '#D6A0F6', // lavanda suave
];


const options = [];
const colors = [];
for (let i = 0; i < baseOptions.length; i++) {
  options[i] = baseOptions[i];
  options[i + baseOptions.length] = baseOptions[i];
  colors[i] = baseColors[i];
  colors[i + baseColors.length] = baseColors[i];
}

function createWheelPaths() {
  const angle = (2 * Math.PI) / options.length;
  const paths = [];

  for (let i = 0; i < options.length; i++) {
    const startAngle = angle * i;
    const endAngle = startAngle + angle;
    const x1 = radius + radius * Math.cos(startAngle);
    const y1 = radius + radius * Math.sin(startAngle);
    const x2 = radius + radius * Math.cos(endAngle);
    const y2 = radius + radius * Math.sin(endAngle);

    const largeArc = angle > Math.PI ? 1 : 0;
    const pathData = [
      `M${radius},${radius}`,
      `L${x1},${y1}`,
      `A${radius},${radius} 0 ${largeArc},1 ${x2},${y2}`,
      'Z'
    ].join(' ');

    paths.push({ path: pathData, color: colors[i], label: options[i] });
  }

  return paths;
}

export default function GameThreeScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const spinAnim = useRef(new Animated.Value(0)).current;
  const [selected, setSelected] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const angle = useRef(0);
  const wheelPaths = createWheelPaths();

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => !isSpinning,
      onPanResponderMove: (_, gestureState) => {
        const delta = gestureState.dx;
        spinAnim.setValue(angle.current + delta);
      },
      onPanResponderRelease: (_, gestureState) => {
        const delta = gestureState.dx * 20;
        if (Math.abs(delta) > 50) {
          angle.current += delta;
          Animated.timing(spinAnim, {
            toValue: angle.current,
            duration: 1000,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }).start(() => {
            angle.current = angle.current % 360;
            spinAnim.setValue(angle.current);
            const randomIndex = Math.floor(Math.random() * options.length);
            setSelected(options[randomIndex]);
          });
        }
      },
    })
  ).current;

  const spinWheel = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); // vibración al girar
    setIsSpinning(true);
    const segmentAngle = 360 / options.length;
    const randomIndex = Math.floor(Math.random() * options.length);
    const targetAngle = 360 * 5 + Math.random() * 360;

    Animated.timing(spinAnim, {
      toValue: targetAngle,
      duration: 3000,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setSelected(options[randomIndex]);
      angle.current = targetAngle % 360;
      spinAnim.setValue(angle.current);
      setIsSpinning(false);
    });
  };

  const spin = spinAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg']
  });

  return (
    <TouchableWithoutFeedback disabled={isSpinning} onPress={spinWheel}>
      <SafeAreaView style={[styles.container, { paddingTop: 50 }]}>
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity onPress={() => {
            Haptics.selectionAsync();
            navigation.goBack();
          }}>
            <Ionicons name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { /* vacío de momento */ }}>
            <Ionicons name="ellipsis-vertical" size={28} color="#000" />
          </TouchableOpacity>
        </View>
        <View style={styles.textWrapper}>
          <Text style={styles.title}>Ruleta del shot</Text>
          {selected && <Text style={styles.result}>{selected}</Text>}
        </View>
        <View style={styles.pointer} />
        <View style={styles.wheelWrapper}>
          <Animated.View
            style={[
              styles.wheelContainer,
              { transform: [{ rotate: spin }] }
            ]}
            {...panResponder.panHandlers}
          >
            <Svg width={radius * 2} height={radius * 2}>
              <G>
                {wheelPaths.map((segment, index) => (
                  <Path key={index} d={segment.path} fill={segment.color} stroke="#000" strokeWidth={1} />
                ))}
              </G>
            </Svg>
          </Animated.View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF3B0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'Panchang-Bold',
    textAlign: 'center',
  },
  button: {
    marginTop: 40,
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  result: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'Panchang-Bold',
    textAlign: 'center',
  },
  pointer: {
    position: 'absolute',
    bottom: radius + 10,
    left: '50%',
    marginLeft: -10,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 20,
    borderBottomWidth: 0,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#000',
    borderBottomColor: 'transparent',
    zIndex: 1,
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
  wheelWrapper: {
    position: 'absolute',
    bottom: 0,
    height: radius,
    width: radius * 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  wheelContainer: {
    width: radius * 2,
    height: radius * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textWrapper: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 2,
  },

  });