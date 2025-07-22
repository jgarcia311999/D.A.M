import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, Animated, Image } from 'react-native';
import CustomHeader from './components/CustomHeader';

const GameFiveScreen = ({ navigation }) => {
  const [diceValue, setDiceValue] = useState(1);
  const rotation = useRef(new Animated.Value(0)).current;

  const rollDice = () => {
    Animated.sequence([
      Animated.timing(rotation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(rotation, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start(() => {
      const randomValue = Math.floor(Math.random() * 6) + 1;
      setDiceValue(randomValue);
    });
  };

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        navigation={navigation}
        showBack={true}
        backTo="Inicio"
        showInfo={false}
      />
      <Pressable style={styles.content} onPress={rollDice}>
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Image
            source={require(`../assets/dice${diceValue}.png`)}
            style={styles.diceImage}
          />
        </Animated.View>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diceImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
});

export default GameFiveScreen;