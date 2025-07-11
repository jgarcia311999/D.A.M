import * as Haptics from 'expo-haptics';
import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Dimensions, TouchableWithoutFeedback, PanResponder, SafeAreaView } from 'react-native';
import Svg, { G, Path, Text as SvgText } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const radius = width * 0.99;

const numericLabels = Array.from({ length: 37 }, (_, i) => i.toString());

const options = [];
const colors = [];
for (let i = 0; i < numericLabels.length; i++) {
  options[i] = numericLabels[i];
  if (i === 0) {
    colors[i] = '#008000'; // green for segment 0
  } else {
    colors[i] = i % 2 === 0 ? '#000000' : '#FF0000';
  }
}

const baseOptions = [
  '0 - VERDE',
  '1 - ROJO',
  '2 - NEGRO',
  '3 - ROJO',
  '4 - NEGRO',
  '5 - ROJO',
  '6 - NEGRO',
  '7 - ROJO',
  '8 - NEGRO',
  '9 - ROJO',
  '10 - NEGRO',
  '11 - ROJO',
  '12 - NEGRO',
  '13 - ROJO',
  '14 - NEGRO',
  '15 - ROJO',
  '16 - NEGRO',
  '17 - ROJO',
  '18 - NEGRO',
  '19 - ROJO',
  '20 - NEGRO',
  '21 - ROJO',
  '22 - NEGRO',
  '23 - ROJO',
  '24 - NEGRO',
  '25 - ROJO',
  '26 - NEGRO',
  '27 - ROJO',
  '28 - NEGRO',
  '29 - ROJO',
  '30 - NEGRO',
  '31 - ROJO',
  '32 - NEGRO',
  '33 - ROJO',
  '34 - NEGRO',
  '35 - ROJO',
  '36 - NEGRO'
];

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

    const labelAngle = startAngle + angle / 2;
    const labelRadius = radius * 0.92;
    const labelX = radius + labelRadius * Math.cos(labelAngle);
    const labelY = radius + labelRadius * Math.sin(labelAngle);
    // Rotate label so it appears upright and readable from outside the circle, add 90 degrees to align tangentially
    const labelRotation = (labelAngle * 180) / Math.PI + 90;

    paths.push({
      path: pathData,
      color: colors[i],
      label: options[i],
      labelX,
      labelY,
      labelRotation,
    });
  }

  return paths;
}

export default function GameThreeScreen({ route }) {
  const { jugadores = [] } = route.params || {};
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const spinAnim = useRef(new Animated.Value(0)).current;
  const [selected, setSelected] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const angle = useRef(0);
  const wheelPaths = createWheelPaths();

  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (selected) {
      scaleAnim.setValue(1);
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [selected]);

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
            const index = parseInt(options[randomIndex % baseOptions.length], 10);
            const jugador = jugadores.length ? jugadores[Math.floor(Math.random() * jugadores.length)] : 'Jugador';
            setSelected(`${jugador}: ${baseOptions[index]}`);
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
      const index = parseInt(options[randomIndex % baseOptions.length], 10);
      const jugador = jugadores.length ? jugadores[Math.floor(Math.random() * jugadores.length)] : 'Jugador';
      setSelected(`${jugador}: ${baseOptions[index]}`);
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
        {/*
          Dynamically position the textWrapper below the header using insets.top + 60
        */}
        {(() => {
          const dynamicTextWrapper = {
            position: 'absolute',
            top: insets.top + 60,
            left: 0,
            right: 0,
            alignItems: 'center',
            zIndex: 2,
          };
          return (
            <View style={dynamicTextWrapper}>
              <Text style={styles.title}>Ruleta del shot</Text>
              {selected && (
                <View style={styles.resultContainer}>
                  <Animated.Text style={[styles.result, { transform: [{ scale: scaleAnim }] }]}>
                    {selected}
                  </Animated.Text>
                </View>
              )}
            </View>
          );
        })()}
        {/* <View style={styles.pointer} /> */}
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
                  <React.Fragment key={index}>
                    <Path d={segment.path} fill={segment.color} stroke="#000" strokeWidth={1} />
                    <SvgText
                      x={segment.labelX}
                      y={segment.labelY}
                      fill="#fff"
                      fontSize="12"
                      fontWeight="bold"
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      transform={`rotate(${segment.labelRotation} ${segment.labelX} ${segment.labelY})`}
                    >
                      {segment.label}
                    </SvgText>
                  </React.Fragment>
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
  resultContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 16,
    marginHorizontal: 32,
    borderRadius: 8,
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
    bottom: -100,
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


  });