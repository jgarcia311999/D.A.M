import * as Haptics from 'expo-haptics';
import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Dimensions, TouchableWithoutFeedback, PanResponder, SafeAreaView } from 'react-native';
import Svg, { G, Path, Text as SvgText } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const radius = width * 0.99;

const rouletteNumbers = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27,
                         13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33,
                         1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12,
                         35, 3, 26];

const rouletteColors = [
  '#008000', // 0 - Green
  '#000000', '#FF0000', '#000000', '#FF0000', '#000000', '#FF0000', '#000000',
  '#FF0000', '#000000', '#FF0000', '#000000', '#FF0000', '#000000', '#FF0000',
  '#000000', '#FF0000', '#000000', '#FF0000', '#000000', '#FF0000', '#000000',
  '#FF0000', '#000000', '#FF0000', '#000000', '#FF0000', '#000000', '#FF0000',
  '#000000', '#FF0000', '#000000', '#FF0000', '#000000', '#FF0000', '#000000',
  '#FF0000'
];

const numericLabels = rouletteNumbers.map(n => n.toString());
const options = [...numericLabels];
const colors = [...rouletteColors];
const baseOptions = [
  'BEBEN TODOS',
  'Manda a alguien a beber 1 trago',
  'Te toca beber 1 trago',
  'Manda a alguien a beber 2 tragos seguidos',
  'Te tocan 2 tragos, sin pausas',
  'Manda a alguien a beber 3 tragos sin respirar entre ellos',
  'Trágate 3 tragos como si fuera agua',
  'Manda a alguien que se cambie de sitio por el de enfrente mientras los dos beben',
  'Cambiate por el de enfrente mientras los dos bebeis',
  'Obliga a alguien a leer su último mensaje con un ex y que beba',
  'Lée el último mensaje de tu ex en voz alta y bebe',
  'Haz que dos personas se miren muy cerca mientras beben',
  'Bebe tu y el de tu izquierda, mientras os mirais muy de cerca',
  'Manda a alguien a gemir como si fuera real y después que beba',
  'Imita un gemido y luego bebe como si nada hubiera pasado',
  'Haz que alguien diga como le ha ido el mes, sexualmente hablando, y que beba',
  'Cuenta que tal te ha ido el mes, sexualmente hablando, y bebe',
  'Manda a alguien a simular un “body shot” y luego beber CAMBIAR',
  'Haz un “body shot” imaginario en el aire y bebe CAMBIAR',
  'Obliga a alguien a intercambiar ropa con otro y que beba',
  'Cambia una prenda con alguien mientras bebes',
  'Manda a alguien a beber desde el vaso de la persona que mas le guste',
  'Bebe desde el vaso de la persona que más te atrae',
  'Manda a alguien a beber del vaso del de su izquierda',
  'Bebe del vaso del de tu izquierda',
  'Haz que alguien beba sin manos',
  'Bebe sin usar las manos',
  'Manda a alguien a que se cambie de sitio por la 3ª persona a su izquierda',
  'Cambiate por la 3ª persona de tu izquierda ',
  'Elige a alguien y haz que confiese con quién se liaría de la mesa',
  'Bebe y luego declara con quién te liarías esta noche',
  'Manda a alguien que haga una selfi con todo el mundo',
  'Haz un selfi con todo el mundo',
  'Manda a alguien a soltar una frase de ligue y luego beber',
  'Suelta tu mejor frase de ligue, y bebe',
  'Manda a alguien a morder la oreja de otro mientras bebe',
  'Dale un mordisquito en la oreja al de tu derecha y luego bebe'
];


function createWheelPaths() {
  const angle = (2 * Math.PI) / options.length * 1.2;
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
    const labelRadius = radius * 0.88;
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
            const segmentAngle = 360 / options.length;
            const normalizedAngle = (angle.current % 360 + 360) % 360;
            const pointerAngle = 270; // vertical center at top
            const relativeAngle = (pointerAngle - normalizedAngle + 360) % 360;
            const selectedIndex = Math.floor((relativeAngle + segmentAngle / 2) % 360 / segmentAngle);
            const index = parseInt(options[selectedIndex], 10);
            const jugador = jugadores.length ? jugadores[Math.floor(Math.random() * jugadores.length)] : 'Jugador';
            setSelected(`${jugador}: ${baseOptions[selectedIndex]}`);
            console.log(`Número de la ruleta: ${index}. Frase: ${baseOptions[selectedIndex]}`);
          });
        }
      },
    })
  ).current;

  const spinWheel = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); // vibración al girar
    setIsSpinning(true);

    let vibrationActive = true;

    const triggerHaptics = () => {
      let duration = 30; // initial fast vibration

      const loop = () => {
        if (!vibrationActive) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        duration = Math.min(duration * 1.1, 300); // increase interval
        setTimeout(loop, duration);
      };

      loop();
    };

    triggerHaptics();

    const segmentAngle = 360 / options.length;
    const randomIndex = Math.floor(Math.random() * options.length);
    const targetAngle = 360 * 5 + Math.random() * 360;

    Animated.timing(spinAnim, {
      toValue: targetAngle,
      duration: 3000,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      angle.current = targetAngle % 360;
      spinAnim.setValue(angle.current);
      const normalizedAngle = (angle.current % 360 + 360) % 360;
      const pointerAngle = 270; // vertical center at top
      const relativeAngle = (pointerAngle - normalizedAngle + 360) % 360;
      const selectedIndex = Math.floor((relativeAngle + segmentAngle / 2) % 360 / segmentAngle);
      const index = parseInt(options[selectedIndex], 10);
      const jugador = jugadores.length ? jugadores[Math.floor(Math.random() * jugadores.length)] : 'Jugador';
      setSelected(`${jugador}: ${baseOptions[selectedIndex]}`);
      console.log(`Número de la ruleta: ${index}. Frase: ${baseOptions[selectedIndex]}`);
      setIsSpinning(false);
      vibrationActive = false;
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
                  <React.Fragment key={index}>
                    <Path d={segment.path} fill={segment.color} stroke="#000" strokeWidth={1} />
                    <SvgText
                      x={segment.labelX}
                      y={segment.labelY}
                      fill="#fff"
                      fontSize="16"
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
    bottom: radius - 1,
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