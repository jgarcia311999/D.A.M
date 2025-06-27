import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MiniGame2() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello World</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#191716',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff'
  },
});

