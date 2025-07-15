import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, TouchableWithoutFeedback, Animated, Platform, Modal, Pressable, CheckBox } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height, width } = Dimensions.get('window');

export default function TittleWeb({ navigation }) {
  const [burbujas, setBurbujas] = React.useState([]);

  const [modalVisible, setModalVisible] = React.useState(true);
  const [isAdult, setIsAdult] = React.useState(false);
  const [isResponsible, setIsResponsible] = React.useState(false);

  React.useEffect(() => {
    const loadChecks = async () => {
      const storedAdult = await AsyncStorage.getItem('isAdult');
      const storedResponsible = await AsyncStorage.getItem('isResponsible');
      if (storedAdult !== null) setIsAdult(storedAdult === 'true');
      if (storedResponsible !== null) setIsResponsible(storedResponsible === 'true');
    };
    loadChecks();
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      requestAnimationFrame(() => {
        const translateY = new Animated.Value(0);
        const opacity = new Animated.Value(0);

        const id = Date.now();
        const left = Math.random() * width;
        const size = 10 + Math.random() * 20;
        const duration = 4000 + Math.random() * 2000;

        const burbuja = { id, left, size, duration, translateY, opacity };

        setBurbujas(prev => {
          if (prev.length >= 20) {
            return prev.slice(1).concat(burbuja);
          }
          return [...prev, burbuja];
        });

        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -height * 1,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: duration / 4,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setBurbujas(prev => prev.filter(b => b.id !== id));
        });
      });
    }, 500);

    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 20000); // 20 segundos

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const handleScrollDown = () => {
    navigation.navigate('Inicio'); 
  };

  if (Platform.OS !== 'web') {
    global.HTMLAnchorElement = function () {};
  }

  return (
    <TouchableWithoutFeedback onPress={() => {
      if (!modalVisible) {
        navigation.navigate('Inicio');
      }
    }}>
      <View style={{
        height,
        width,
        backgroundColor: '#EFD74A',
        overflow: 'hidden',
      }}>
        <Text style={{
          position: 'absolute',
          top: 20,
          width: '100%',
          textAlign: 'center',
          fontSize: 14,
          color: '#AC950F',
          fontFamily: 'Panchang-Bold',
          zIndex: 5,
          paddingHorizontal: 20,
        }}>
          Solo para adultos (18+){'\n'}Juega con moderación.
        </Text>
        <Svg
          width={width}
          height={height * 0.8}
          viewBox={`0 0 ${width} ${height * 0.8}`}
          style={{ position: 'absolute', top: 0, zIndex: 3 }}
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
        <TouchableOpacity onPress={handleScrollDown} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 10, position: 'relative' }}>
          <View style={styles.damTextWrapper}>
            <Text style={styles.damLineTop}>la</Text>
            <Text style={styles.damLineBottom}>prv.</Text>
          </View>
        </TouchableOpacity>
        <Text style={{
          position: 'absolute',
          bottom: 20,
          width: '100%',
          textAlign: 'center',
          fontSize: 14,
          color: '#AC950F',
          fontFamily: 'Panchang-Bold',
          zIndex: 5,
        }}>
          Pulsa para continuar
        </Text>

        {Platform.OS === 'web' && (
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
          >
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.6)',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 20,
              }}>
                <View style={{
                  backgroundColor: '#fff',
                  borderRadius: 12,
                  padding: 24,
                  width: '100%',
                  maxWidth: 400,
                  alignItems: 'flex-start',
                }}>
                  <Text style={{
                    fontFamily: 'Panchang-Bold',
                    fontSize: 18,
                    marginBottom: 12,
                    color: '#000',
                    textAlign: 'center',
                    alignSelf: 'center',
                  }}>
                    Advertencia de contenido +18
                  </Text>
                  <Text style={{
                    fontFamily: 'Panchang-Regular',
                    fontSize: 14,
                    marginBottom: 16,
                    color: '#000',
                  }}>
                    Esta aplicación está dirigida exclusivamente a personas mayores de 18 años. No promovemos el consumo excesivo de alcohol. Juega con responsabilidad y conforme a la normativa vigente en tu país.
                  </Text>

                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <CheckBox
                      value={isAdult}
                      onValueChange={(value) => {
                        setIsAdult(value);
                        AsyncStorage.setItem('isAdult', value.toString());
                      }}
                    />
                    <Text style={{ fontFamily: 'Panchang-Regular', marginLeft: 8 }}>Confirmo que tengo más de 18 años.</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                    <CheckBox
                      value={isResponsible}
                      onValueChange={(value) => {
                        setIsResponsible(value);
                        AsyncStorage.setItem('isResponsible', value.toString());
                      }}
                    />
                    <Text style={{ fontFamily: 'Panchang-Regular', marginLeft: 8 }}>Me comprometo a jugar con responsabilidad.</Text>
                  </View>

                  <Pressable
                    onPress={() => {
                      if (isAdult && isResponsible) {
                        setModalVisible(false);
                      }
                    }}
                    style={{
                      backgroundColor: '#AC950F',
                      paddingVertical: 12,
                      paddingHorizontal: 20,
                      borderRadius: 8,
                      alignSelf: 'stretch',
                    }}
                  >
                    <Text style={{ textAlign: 'center', color: '#fff', fontFamily: 'Panchang-Bold', fontSize: 16 }}>
                      Aceptar
                    </Text>
                  </Pressable>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  damTextWrapper: {
    position: 'absolute',
    bottom: height * 0.1,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  damLineTop: {
    fontSize: height * 0.12,
    fontWeight: 'bold',
    color: '#5C3227',
    fontFamily: 'Panchang-Bold',
    textAlign: 'left',
    marginLeft: 0,
    paddingLeft: 20,
  },
  damLineBottom: {
    fontSize: height * 0.15,
    fontWeight: 'bold',
    color: '#5C3227',
    fontFamily: 'Panchang-Bold',
    textAlign: 'left',
    width: '100%',
    letterSpacing: -2,
    lineHeight: height * 0.16,
    marginLeft: 0,
    paddingLeft: 20,
  },
  slogan: {
    fontSize: height * 0.025,
    color: '#5C3227',
    textAlign: 'center',
    fontFamily: 'Panchang-Regular',
    zIndex: 5,
  },
});