import React, { useRef, useState } from 'react';
import { View, Image, FlatList, ScrollView, Dimensions, StyleSheet, SafeAreaView, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const slides = [
  { id: 1, color: '#bfa3ff' },
  { id: 2, color: '#ffc8a3' },
  { id: 3, color: '#d5c385' },
];

export default function HomeScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modoLista, setModoLista] = useState(false);
  const flatListRef = useRef(null);
  const fadeCarrusel = useRef(new Animated.Value(1)).current;
  const fadeLista = useRef(new Animated.Value(0)).current;

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const renderItem = ({ item }) => (
    <View style={[styles.slide, { backgroundColor: item.color }]}>
      <Image source={require('../assets/pj_fumando.png')} style={styles.image} />
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableOpacity
          style={styles.topRightButton}
          onPress={() => {
            if (modoLista) {
              Animated.parallel([
                Animated.timing(fadeCarrusel, { toValue: 1, duration: 200, useNativeDriver: true }),
                Animated.timing(fadeLista, { toValue: 0, duration: 200, useNativeDriver: true }),
              ]).start(() => setModoLista(false));
            } else {
              Animated.parallel([
                Animated.timing(fadeCarrusel, { toValue: 0, duration: 200, useNativeDriver: true }),
                Animated.timing(fadeLista, { toValue: 1, duration: 200, useNativeDriver: true }),
              ]).start(() => setModoLista(true));
            }
          }}
        >
          <Ionicons name="menu" size={28} color="#fff" />
        </TouchableOpacity>
        <Animated.View style={{ flex: 1, opacity: fadeCarrusel, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <FlatList
            data={slides}
            ref={flatListRef}
            renderItem={renderItem}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            keyExtractor={(item) => item.id.toString()}
          />
          <View style={styles.dotsContainer}>
            {slides.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  currentIndex === i && styles.dotActive,
                ]}
              />
            ))}
          </View>
        </Animated.View>

        <Animated.View style={{ flex: 1, opacity: fadeLista }}>
          <ScrollView contentContainerStyle={styles.scrollList}>
            {slides.map((item) => (
              <View key={item.id} style={[styles.card, { backgroundColor: item.color }]}>
                <Image source={require('../assets/pj_fumando.png')} style={styles.imageSmall} />
              </View>
            ))}
          </ScrollView>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191716',
  },
  slide: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
  topRightButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#444',
    marginHorizontal: 5,
  },
  dotActive: {
    backgroundColor: '#fff',
  },
  scrollList: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  card: {
    width: '90%',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  imageSmall: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
});
