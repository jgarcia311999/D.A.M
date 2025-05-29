import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Dimensions, TouchableWithoutFeedback, PanResponder } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

const { width } = Dimensions.get('window');
const radius = width * 0.35;
const options = ['1 trago', '2 tragos', '3 tragos', 'Todos beben', 'Regla', 'Elige quien bebe'];
const colors = ['#f39c12', '#d35400', '#8e44ad', '#27ae60', '#2980b9', '#c0392b'];

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
    <TouchableWithoutFeedback disabled={!isSpinning}>
      <View style={styles.container}>
        <Text style={styles.title}>Ruleta de los Traguitos</Text>
        <View style={styles.pointer} />
        <Animated.View style={{ transform: [{ rotate: spin }] }} {...panResponder.panHandlers}>
          <Svg width={radius * 2} height={radius * 2}>
            <G>
              {wheelPaths.map((segment, index) => (
                <Path key={index} d={segment.path} fill={segment.color} />
              ))}
            </G>
          </Svg>
        </Animated.View>
        <TouchableOpacity
          style={[styles.button, isSpinning && { opacity: 0.5 }]}
          onPress={spinWheel}
          disabled={isSpinning}
        >
          <Text style={styles.buttonText}>🎯 GIRAR</Text>
        </TouchableOpacity>
        {selected && <Text style={styles.result}>Resultado: {selected}</Text>}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    marginTop: 40,
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  result: {
    marginTop: 30,
    fontSize: 20,
    fontWeight: '600',
  },
  pointer: {
    position: 'absolute',
    top: (Dimensions.get('window').height / 2 - radius - 10),
    left: '50%',
    marginLeft: -10,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 0,
    borderTopWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#000',
    borderBottomColor: 'transparent',
    zIndex: 1,
  },
});