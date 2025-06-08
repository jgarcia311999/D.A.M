import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, TouchableWithoutFeedback, Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { height, width } = Dimensions.get('window');

export default function TittleScreen({ navigation }) {
  const [burbujas, setBurbujas] = React.useState([]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const translateY = new Animated.Value(0);
      const opacity = new Animated.Value(0);

      const id = Date.now();
      const left = Math.random() * width;
      const size = 10 + Math.random() * 20;
      const duration = 4000 + Math.random() * 2000;

      const burbuja = { id, left, size, duration, translateY, opacity };

      setBurbujas(prev => [...prev, burbuja]);

      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -height * 0.75,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: duration / 3,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setBurbujas(prev => prev.filter(b => b.id !== id));
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handleScrollDown = () => {
    navigation.navigate('Inicio');
  };

  return (
    <TouchableWithoutFeedback onPress={() => navigation.navigate('Inicio')}>
      <View style={{ height, width, backgroundColor: '#EFD74A' }}>
        <Svg
          width={width}
          height={height * 0.8}
          viewBox={`0 0 ${width} ${height * 0.8}`}
          style={{ position: 'absolute', top: 0, zIndex: 1 }}
        >
          <Path
            d={`
              M0,160 
              C${width * 0.1},240 ${width * 0.2},140 ${width * 0.3},190 
              C${width * 0.4},290 ${width * 0.6},90 ${width * 0.7},190 
              C${width * 0.8},240 ${width * 0.9},140 ${width},160 
              L${width},0 
              L0,0 
              Z
            `}
            fill="#ffffff"
          />
        </Svg>
        {burbujas.map((burbuja) => {
          return (
            <Animated.View
              key={burbuja.id}
              style={{
                position: 'absolute',
                bottom: 0,
                left: burbuja.left,
                width: burbuja.size,
                height: burbuja.size,
                borderRadius: burbuja.size / 2,
                backgroundColor: '#F8E473',
                opacity: burbuja.opacity,
                transform: [{ translateY: burbuja.translateY }],
                zIndex: 2,
              }}
            />
          );
        })}
        <TouchableOpacity onPress={handleScrollDown} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.damText}>D.A.M</Text>
          <Text style={styles.slogan}>Drink and More</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  damText: {
    fontSize: height * 0.1,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#780000',
    fontFamily: 'PlayfairDisplaySC-Bold',
  },
  slogan: {
    fontSize: height * 0.025,
    color: '#780000',
    textAlign: 'center',
    fontFamily: 'PlayfairDisplaySC-Regular',
  },
});