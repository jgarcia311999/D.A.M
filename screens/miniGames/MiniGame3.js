import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function MiniGame3() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Hello World</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#191716',
    paddingTop: 50,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff'
  },
});
